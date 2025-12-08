/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly';
import {blocks} from './blockly/blocks/block_definitions';
import {forBlock} from './blockly/generators/javascript';
import {javascriptGenerator} from 'blockly/javascript';
import {save, load} from './js/serialization';
import {toolbox} from './blockly/toolbox';
import './styles/index.css';

// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(blocks);
Object.assign(javascriptGenerator.forBlock, forBlock);

// Set up UI elements and inject Blockly
const codeDiv = document.getElementById('generatedCode')?.firstChild;
const outputDiv = document.getElementById('output');
const blocklyDiv = document.getElementById('blocklyDiv');

if (!blocklyDiv) {
  throw new Error(`div with id 'blocklyDiv' not found`);
}
const ws = Blockly.inject(blocklyDiv, {toolbox});

// This function resets the code and output divs, shows the
// generated code from the workspace, and evals the code.
// In a real application, you probably shouldn't use `eval`.
const runCode = () => {
  //let code = javascriptGenerator.workspaceToCode(ws as Blockly.Workspace);
  //code = code.split(';')[0]; // we don't care about anything beyond the main backchanneling block
  //code = code.split('\n')[0];
  const blocks = ws.getAllBlocks(true).filter(block => block.type === 'backchanneling');
  if (blocks.length > 0) {
    let code = javascriptGenerator.blockToCode(blocks[0]);
    console.log("code is " + code as string);
    sendParameters(JSON.parse(code as string));
  }
};

const sendParameters = (codeJson: JSON) => {
  fetch('http://localhost:62753/api/params', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(codeJson)
  }).then(response => {
    if (response.ok) {
      console.log('Data sent successfully');
      if (codeDiv) codeDiv.textContent = response.statusText + ": Sota up to date";
    } else {
      console.error('Error sending data');
      if (codeDiv) codeDiv.textContent = response.statusText;
    }
  }).catch(error => {
    console.error('Error:', error);
    if (codeDiv) codeDiv.textContent = error.message;
  });
}

if (ws) {
  // Load the initial state from storage and run the code.
  load(ws);
  runCode();

  // Every time the workspace changes state, save the changes to storage.
  ws.addChangeListener((e: Blockly.Events.Abstract) => {
    // UI events are things like scrolling, zooming, etc.
    // No need to save after one of these.
    if (e.isUiEvent) return;
    save(ws);
  });

  // Whenever the workspace changes meaningfully, run the code again.
  ws.addChangeListener((e: Blockly.Events.Abstract) => {
    // Don't run the code when the workspace finishes loading; we're
    // already running it once when the application starts.
    // Don't run the code during drags; we might have invalid state.
    if (
      e.isUiEvent ||
      e.type == Blockly.Events.FINISHED_LOADING ||
      ws.isDragging()
    ) {
      return;
    }
    runCode();
  });
}

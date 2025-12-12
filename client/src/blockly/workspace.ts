/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
// some code in this file is originally from Blockly
// and modified for the purposes of this project
// https://github.com/RaspberryPiFoundation/blockly-samples

/**
 * Blockly Workspace Module
 * This module sets up the Blockly workspace, registers custom blocks and
 * their JavaScript generators, and manages the serialization and execution
 * of the generated code.
 */

import * as Blockly from 'blockly';
import {blocks} from './blocks/block_definitions';
import {forBlock} from './generators/generators';
import {javascriptGenerator} from 'blockly/javascript';
import {save, load} from '../services/serialization';
import {toolbox} from './toolbox';
import { log } from '../services/debug-log';

let workspace: Blockly.WorkspaceSvg;

export const initWorkspace = () => {
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

  workspace = Blockly.inject(blocklyDiv, {toolbox});

  if (workspace) {
    // Load the initial state from storage and run the code.
    load(workspace);
    addEventListeners();
  } else {
    throw new Error('Failed to initialize Blockly workspace');
  }
}

const addEventListeners = () => {
  // Every time the workspace changes state, save the changes to storage.
    workspace.addChangeListener((e: Blockly.Events.Abstract) => {
      // UI events are things like scrolling, zooming, etc.
      // No need to save after one of these.
      if (!e.isUiEvent) {
        save(workspace);
      }
    });

    // TODO: add event listener for the run code button
};

/**
 * evaluates the generated code from the blocks in the workspace.
 */
const runCode = () => {
  
};


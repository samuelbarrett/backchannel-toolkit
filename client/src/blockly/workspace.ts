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
import {blocks} from './blocks/block_definitions.ts';
import {forBlock} from './generators/generators.ts';
import {javascriptGenerator} from 'blockly/javascript';
import {save, load} from '../services/serialization.ts';
import {toolbox} from './toolbox.ts';
import { log } from '../services/debug-log.ts';
import { FieldStyleOptions } from './fields/FieldStyleOptions.tsx';

let workspace: Blockly.WorkspaceSvg;
let bootstrapComplete = false;

const bootstrapBlockly = () => {
  if (bootstrapComplete) return;

  Blockly.common.defineBlocks(blocks);
  Blockly.fieldRegistry.register('field_style_options', FieldStyleOptions);
  Object.assign(javascriptGenerator.forBlock, forBlock);
  bootstrapComplete = true;
};

export const createWorkspace = (container: HTMLElement, options: Partial<Blockly.BlocklyOptions> = {}) => {
  bootstrapBlockly();

  const workspaceOptions: Blockly.BlocklyOptions = {
    toolbox: toolbox,
    trashcan: true,
    zoom: {
      controls: true,
      wheel: true,
    },
    move: {
      scrollbars: true,
      drag: true,
      wheel: false,
    },
    ...options,
  };

  return Blockly.inject(container, workspaceOptions);
};

export const loadWorkspaceState = (targetWorkspace: Blockly.Workspace, state: unknown) => {
  Blockly.Events.disable();
  targetWorkspace.clear();
  if (state) {
    Blockly.serialization.workspaces.load(state as Blockly.serialization.blocks.State, targetWorkspace, undefined);
  }
  Blockly.Events.enable();
};

export const initWorkspace = () => {
  // Register the blocks, fields, and generator with Blockly
  bootstrapBlockly();

  // Set up UI elements and inject Blockly
  const blocklyDiv = document.getElementById('blocklyDiv');

  if (!blocklyDiv) {
    throw new Error(`div with id 'blocklyDiv' not found`);
  }
  console.log('Injecting Blockly workspace...');
  workspace = createWorkspace(blocklyDiv);

  if (workspace) {
    // Load the initial state from storage and run the code.
    load(workspace);
    if (workspace.getToolbox() && workspace.getToolbox()?.getFlyout()) {
      workspace.getToolbox().getFlyout().autoClose = false;
    }
    addEventListeners();
  } else {
    throw new Error('Failed to initialize Blockly workspace');
  }
}

const addEventListeners = () => {
  // Every time the workspace changes state, save the changes to storage.
  workspace.addChangeListener(async (e: Blockly.Events.Abstract) => {
    // UI events are things like scrolling, zooming, etc.
    // No need to save after one of these.
    if (!e.isUiEvent) {
      await save(workspace);
    }
  });
};

/**
 * evaluates the generated code from the blocks in the workspace.
 */
export const runCode = () => {
  const blocks: Blockly.Block[] = workspace.getAllBlocks(true).filter((block) => block.type === 'robot_dialog_block');
  if (blocks.length > 0) {
    for (const block of blocks) {
      const generatedCode = javascriptGenerator.blockToCode(block);
      const code = Array.isArray(generatedCode) ? generatedCode[0] : generatedCode;
      if (typeof code === 'string') {
        log('Generated code:\n' + code);
        // eslint-disable-next-line no-eval
        eval(code);
      }
    }
  } else {
    log('No robot dialog block found in workspace.');
  }
};

/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
// some code in this file is originally from Blockly
// and modified for the purposes of this project
// https://github.com/RaspberryPiFoundation/blockly-samples

import * as Blockly from 'blockly/core';
import { log } from '../../services/debug-log.ts';

// Export all the code generators for our custom blocks,
// but don't register them with Blockly yet.
// This file has no side effects!
export const forBlock = Object.create(null);

forBlock['robot_dialog_block'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator, 
) {
  const header: string = `BlockCodeService.robotDialog();\n`; 
  const body = generator.statementToCode(block, 'actions'); // generate code for each nested statement block
  console.log('robot_dialog_block generated code:', header + body);
  return header + body;
}

forBlock['listen_keyword_block'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const keyword = block.getFieldValue('keyword');
  const styleCode = getStyleCodeFromBlock(block, generator);
  return `BlockCodeService.listenForKeyword(${JSON.stringify(keyword)}, ${styleCode});\n`;
}

forBlock['listen_block'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const styleCode = getStyleCodeFromBlock(block, generator);
  return `BlockCodeService.listenUntilSilence(${styleCode});\n`;
}

forBlock['say_block'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const speech = block.getFieldValue('content');
  const styleCode = getStyleCodeFromBlock(block, generator);
  const code = `BlockCodeService.say(${JSON.stringify(speech)}, ${styleCode});\n`;
  return code;
}

// ------------- Style blocks -------------
forBlock['style_happy_block'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  return styleBlockGenerator(block);
}

forBlock['style_sad_block'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  return styleBlockGenerator(block);
}

forBlock['style_excited_block'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  return styleBlockGenerator(block);
}

forBlock['style_bored_block'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  return styleBlockGenerator(block);
}

// ------------ helper functions ------------

// extract the style code from the 'style' input of a block
function getStyleCodeFromBlock(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
): string {
  const styleBlock = block.getInputTargetBlock('style');
  let styleCode = '{}';
  if (styleBlock) {
    const sc = generator.blockToCode(styleBlock);
    styleCode = Array.isArray(sc) ? sc[0] : sc;
  }
  return styleCode;
}

// style_* blocks: return a JS expression (JSON text) for the style object
function styleBlockGenerator(block: Blockly.Block) {
  const field = block.getField('styleOptions') as any;
  const styleObj = field && typeof field.getStyle === 'function' ? field.getStyle() : {};
  return JSON.stringify(styleObj);
}
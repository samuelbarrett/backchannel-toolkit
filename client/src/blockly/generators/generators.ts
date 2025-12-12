/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
// some code in this file is originally from Blockly
// and modified for the purposes of this project
// https://github.com/RaspberryPiFoundation/blockly-samples

import * as Blockly from 'blockly/core';
import { log } from '../../services/debug-log';

// Export all the code generators for our custom blocks,
// but don't register them with Blockly yet.
// This file has no side effects!
export const forBlock = Object.create(null);

// placeholder copied from block factory
forBlock['robot_dialog'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator, 
) {
  log("generating code for robot dialog block");
  const code = `BlockCodeService.robotDialog();\n`;
  return code;
}

// placeholder copied from block factory
forBlock['listen_keyword_block'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  console.log("generating code for listen keyword block");
}

forBlock['listen_block'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  console.log("generating code for listen block");
}

forBlock['say_block'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  console.log("generating code for say block");
}

// ------------- Style blocks -------------
forBlock['style_happy_block'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  console.log("generating code for happy style");
}

forBlock['style_sad_block'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  console.log("generating code for sad style");
}

forBlock['style_excited_block'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  console.log("generating code for excited style");
}

forBlock['style_bored_block'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  console.log("generating code for bored style");
}
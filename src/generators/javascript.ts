/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Order} from 'blockly/javascript';
import * as Blockly from 'blockly/core';

// Export all the code generators for our custom blocks,
// but don't register them with Blockly yet.
// This file has no side effects!
export const forBlock = Object.create(null);

// placeholder copied from block factory
forBlock['robot_dialog'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator, 
) {
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_style = generator.valueToCode(block, 'style', Order.ATOMIC);

  const statement_actions = generator.statementToCode(block, 'actions');

  // TODO: Assemble javascript into the code variable.
  const code = '...';
  return code;
}

// placeholder copied from block factory
forBlock['listen_keyword_block'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const dropdown_keyword = block.getFieldValue('keyword');

  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_style = generator.valueToCode(block, 'style', Order.ATOMIC);

  // TODO: Assemble javascript into the code variable.
  const code = '...';
  return code;
}

forBlock['listen_block'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const value_style = generator.valueToCode(block, 'style', Order.ATOMIC);

  const code = '...';
  return code;
}

forBlock['say_block'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const value_content = block.getFieldValue('content');
  
  // TODO: change Order.ATOMIC to the correct operator precedence strength 
  const value_style = generator.valueToCode(block, 'style', Order.ATOMIC);
  
  const code = '...';
  return code;
}
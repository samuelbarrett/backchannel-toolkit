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

forBlock['dialog_line'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_character = generator.valueToCode(block, 'character', Order.ATOMIC);

  const statement_dialog = generator.statementToCode(block, 'dialog');

  // TODO: Assemble javascript into the code variable.
  const code = `hello my dialog generator placeholder: ${value_character} says ${statement_dialog}`;
  return code;
}

forBlock['dialog_text'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const text_prompt = block.getFieldValue('prompt');

  // TODO: Assemble javascript into the code variable.
  const code = `say hello to my little prompt ${text_prompt}`;
  return code;
}
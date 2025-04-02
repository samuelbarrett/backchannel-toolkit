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

forBlock['backchanneling'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  let value_delay = generator.valueToCode(block, 'delay', Order.ATOMIC);
  let value_frequency = generator.valueToCode(block, 'frequency', Order.ATOMIC);
  const checkbox_verbal = block.getFieldValue('verbal') === 'TRUE' ? 'true' : 'false';
  const checkbox_nodding = block.getFieldValue('nodding') === 'TRUE' ? 'true' : 'false';
  
  // default values
  if (value_delay == "") {
    value_delay = '0';
  }
  if (value_frequency == "") {
    value_frequency = '100';
  }

  const code = {
    verbal: checkbox_verbal,
    nodding: checkbox_nodding,
    delay: value_delay,
    frequency: value_frequency
  };
  return JSON.stringify(code);
}

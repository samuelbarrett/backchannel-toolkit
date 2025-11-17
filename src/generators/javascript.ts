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
  console.log(value_delay);
  
  // default values
  if (value_delay == "") {
    value_delay = '0';
  }
  if (value_frequency == "") {
    value_frequency = '100';
  } else {
    try {
      value_frequency = JSON.parse(value_frequency).slider.toString();
      console.log("json of value_frequency is " + value_frequency);
    } catch (error) {
      console.error("Error parsing JSON: ", error);
      value_frequency = '100';
    }
  }

  const code = {
    verbal: checkbox_verbal,
    nodding: checkbox_nodding,
    delay: value_delay,
    frequency: value_frequency
  };
  console.log("generated code is : " + code);
  return JSON.stringify(code);
}

forBlock['field_slider'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  let value_slider = block.getFieldValue('slider_value');
  if (value_slider == "") {
    value_slider = '50';
  }
  const code = {
    slider: value_slider
  };
  return [JSON.stringify(code), Order.ATOMIC];
}

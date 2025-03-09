import * as Blockly from 'blockly/core';

const dialogLine = {
  type: 'dialog_line',
  tooltip: 'Define a line of dialog spoken by a character.',
  helpUrl: '',
  message0: 'Character: %1 Dialog: %2',
  args0: [
    {
      type: 'input_value',
      name: 'character',
      check: 'Character'
    },
    {
      type: 'input_statement',
      name: 'dialog',
      check: 'String'
    }
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 285
};

export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
    dialogLine,
]);
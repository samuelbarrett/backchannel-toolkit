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

const dialogText = {
  type: 'dialog_text',
  tooltip: 'Describe something this character will say',
  helpUrl: '',
  message0: 'text description: %1 %2',
  args0: [
    {
      type: 'field_input',
      name: 'prompt',
      text: 'What will they say?'
    },
    {
      type: 'input_dummy',
      name: 'text_description'
    }
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 60
};

export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
    dialogLine, dialogText
]);
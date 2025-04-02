import * as Blockly from 'blockly/core';

const backchannelBlock = {
    "type": "backchanneling",
    "tooltip": "Control panel for Sota's backchanneling behaviours",
    "helpUrl": "",
    "message0": "Backchanneling Parameters %1 Verbal %2 Nodding %3 %4 delay (0-1000 ms): %5 frequency (%) %6",
    "args0": [
    {
        "type": "input_dummy",
        "name": "title"
    },
    {
        "type": "field_checkbox",
        "name": "verbal",
        "checked": "TRUE"
    },
    {
        "type": "field_checkbox",
        "name": "nodding",
        "checked": "TRUE"
    },
    {
        "type": "input_dummy",
        "name": "modalities",
        "align": "RIGHT"
    },
    {
        "type": "input_value",
        "name": "delay",
        "align": "RIGHT",
        "check": "Number"
    },
    {
        "type": "input_value",
        "name": "frequency",
        "align": "RIGHT",
        "check": "Number"
    }
    ],
    "colour": 150,
    "inputsInline": false
}
                       

export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
    backchannelBlock,
]);
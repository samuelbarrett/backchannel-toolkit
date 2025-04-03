import * as Blockly from 'blockly/core';
import '@blockly/field-slider';

const backchannelBlock = {
    type: 'backchanneling',
    tooltip: 'Control panel for Sota\'s backchanneling behaviours. Default delay is 0, frequency is 100%.',
    helpUrl: '',
    message0: 'Backchanneling Parameters %1 Verbal %2 Nodding %3 %4 delay (0-1000 ms): %5 frequency (%) %6',
    args0: [
        {
            type: 'input_dummy',
            name: 'title'
        },
        {
            type: 'field_checkbox',
            name: 'verbal',
            checked: true
        },
        {
            type: 'field_checkbox',
            name: 'nodding',
            checked: 'TRUE'
        },
        {
            type: 'input_dummy',
            name: 'modalities',
            align: 'RIGHT'
        },
        {
            type: 'input_value',
            name: 'delay',
            align: 'RIGHT',
            check: 'Number'
        },
        {
            type: 'input_value',
            name: 'frequency',
            align: 'RIGHT',
            check: 'Number'
        }
    ],
    colour: 150,
    inputsInline: false
}

const field_slider = {
    type: 'field_slider',
    message0: 'slider: %1',
    args0: [
        {
            type: 'field_slider',
            name: 'slider_value',
            value: 50,
            min: 0,
            max: 100,
            precision: 1
        },
    ],
    output: 'Number',
    colour: 270,
    inputsInline: false
};
                       

export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
    backchannelBlock, field_slider
]);
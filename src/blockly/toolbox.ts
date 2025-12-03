/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/*
This toolbox contains nearly every single built-in block that Blockly offers,
in addition to the custom block 'add_text' this sample app adds.
You probably don't need every single block, and should consider either rewriting
your toolbox from scratch, or carefully choosing whether you need each block
listed here.
*/

export const toolbox = {
    kind: 'categoryToolbox',
    contents: [
        {
            kind: 'category',
            name: 'Actions',
            colour: '#6688dfff',
            contents: [
                {
                    kind: 'block',
                    type: 'robot_dialog_block'
                },
                {
                    kind: 'block',
                    type: 'listen_keyword_block'
                },
                {
                    kind: 'block',
                    type: 'listen_block'
                },
                {
                    kind: 'block',
                    type: 'say_block'
                }
            ]
        },
        {
            kind: 'category',
            name: 'Styles',
            colour: '#517da9ff',
            contents: [
                {
                    kind: 'block',
                    type: 'style_happy_block'
                },
                {
                    kind: 'block',
                    type: 'style_sad_block'
                },
                {
                    kind: 'block',
                    type: 'style_excited_block'
                },
                {
                    kind: 'block',
                    type: 'style_bored_block'
                }
            ]
        }
    ]
};
import * as Blockly from 'blockly/core';
import {listenBlockJson} from './listen_block.ts';
import {listenKeywordBlockJson} from './listen_keyword_block.ts';
import {robotDialogBlockJson} from './robot_dialog_block.ts';
import {sayBlockJson} from './say_block.ts';
import { happy_style, sad_style, excited_style, bored_style } from '../../models/style.ts';
import { 
  happyStyleBlockJson,
  sadStyleBlockJson,
  excitedStyleBlockJson,
  boredStyleBlockJson
} from './style_blocks.ts';

const allJson = [
  ...listenBlockJson,
  ...listenKeywordBlockJson,
  ...robotDialogBlockJson,
  ...sayBlockJson,
];

/**
 * Define the Style blocks separately to add their style options field
 */
Blockly.Blocks['style_happy_block'] = {
  init: function() {
    this.jsonInit(happyStyleBlockJson);
    const styleOptionsField = this.getField('styleOptions') as any;
    styleOptionsField.setStyle(happy_style);
  }
};

Blockly.Blocks['style_sad_block'] = {
  init: function() {
    this.jsonInit(sadStyleBlockJson);
    const styleOptionsField = this.getField('styleOptions') as any;
    styleOptionsField.setStyle(sad_style);
  }
};

Blockly.Blocks['style_excited_block'] = {
  init: function() {
    this.jsonInit(excitedStyleBlockJson);
    const styleOptionsField = this.getField('styleOptions') as any;
    styleOptionsField.setStyle(excited_style);
  }
};

Blockly.Blocks['style_bored_block'] = {
  init: function() {
    this.jsonInit(boredStyleBlockJson);
    const styleOptionsField = this.getField('styleOptions') as any;
    styleOptionsField.setStyle(bored_style);
  }
};

const blocks = Blockly.common.createBlockDefinitionsFromJsonArray(allJson);

export {blocks};
import * as Blockly from 'blockly/core';
import {listenBlockJson} from './listen_block';
import {listenKeywordBlockJson} from './listen_keyword_block';
import {robotDialogBlockJson} from './robot_dialog_block';
import {sayBlockJson} from './say_block';
import { happy_style, sad_style, excited_style, bored_style } from '../../models/style';
import { 
  happyStyleBlockJson,
  sadStyleBlockJson,
  excitedStyleBlockJson,
  boredStyleBlockJson
} from './style_blocks';

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
    this.setFieldValue(happy_style, "styleOptions");
  }
};

Blockly.Blocks['style_sad_block'] = {
  init: function() {
    this.jsonInit(sadStyleBlockJson);
    this.setFieldValue(sad_style, "styleOptions");
  }
};

Blockly.Blocks['style_excited_block'] = {
  init: function() {
    this.jsonInit(excitedStyleBlockJson);
    this.setFieldValue(excited_style, "styleOptions");
  }
};

Blockly.Blocks['style_bored_block'] = {
  init: function() {
    this.jsonInit(boredStyleBlockJson);
    this.setFieldValue(bored_style, "styleOptions");
  }
};

const blocks = Blockly.common.createBlockDefinitionsFromJsonArray(allJson);

export {blocks};
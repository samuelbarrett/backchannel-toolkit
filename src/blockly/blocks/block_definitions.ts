import * as Blockly from 'blockly/core';
import {listenBlockJson} from './listen_block';
import {listenKeywordBlockJson} from './listen_keyword_block';
import {robotDialogBlockJson} from './robot_dialog_block';
import {sayBlockJson} from './say_block';
import { styleBlocksJson } from './style_blocks';

const allJson = [
  ...listenBlockJson,
  ...listenKeywordBlockJson,
  ...robotDialogBlockJson,
  ...sayBlockJson,
  ...styleBlocksJson
];

const blocks = Blockly.common.createBlockDefinitionsFromJsonArray(allJson);

export {blocks};
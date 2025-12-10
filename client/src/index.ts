/**
 * This is the main entry point for the client frontend application.
 */

import './styles/index.css';
import {initWorkspace} from './blockly/workspace';
import { BlockCodeService } from './services/BlockCodeService';

const main = () => {
  console.log('Initializing client...');
  
  // expose the BlockCodeService globally so generated code can call its functions
  (window as any).BlockCodeService = BlockCodeService;
  
  initWorkspace();
}

main();
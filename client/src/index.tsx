/**
 * This is the main entry point for the client frontend application.
 */

import './styles/index.css';
import { initWorkspace } from './blockly/workspace.ts';
import { BlockCodeService } from './services/BlockCodeService.ts';
import { createRoot } from 'react-dom/client';
import Header from './components/Header.tsx';
import { runCode } from './blockly/workspace.ts';

const main = () => {
  console.log('Initializing client...');

  // Render the header component
  const headerContainer = document.getElementById('header');
  if (headerContainer) {
    const root = createRoot(headerContainer);
    root.render(<Header onClick={runCode} />);
  }
  
  // expose the BlockCodeService globally so generated code can call its functions
  (window as any).BlockCodeService = BlockCodeService;
  
  initWorkspace();
}

main();
/**
 * This is the main entry point for the client frontend application.
 */

import './styles/index.css';
import { initWorkspace } from './blockly/workspace.ts';
import { BlockCodeService } from './services/BlockCodeService.ts';
import { PairingService } from './services/PairingService.ts';
import { createRoot } from 'react-dom/client';
import { useEffect } from 'react';
import Header from './components/Header.tsx';
import { runCode } from './blockly/workspace.ts';
import DialogProvider from './components/DialogProvider.tsx';

function App() {
  useEffect(() => {
    // initialize Blockly and provide the BlockCodeService for generated Blockly code to call
    (window as any).BlockCodeService = BlockCodeService;
    initWorkspace();
  }, []);

  return (
    <div id="pageContainer">
      <DialogProvider>
        <Header />
        <div id="blocklyDiv" style={{ width: '100%', flex: 1 }}></div>
      </DialogProvider>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
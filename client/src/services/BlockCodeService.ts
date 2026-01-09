/**
 * Handler for service calls made by generated code.
 * Code generated from blocks call functions of this service to interact with the backend.
 * These functions are exposed globally in the window as the BlockCodeService object, making them callable by the generated code.
 */

import { StyleSchema } from "../models/style.ts";

export const BlockCodeService = {
  robotDialog: async () => {
    console.log('BlockCodeService.robotDialog called');
    const response = await fetch('http://localhost:3000/status', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
  },
  say: async (speech: string, style: StyleSchema) => {
    console.log('BlockCodeService.say called with message:', speech, 'and style:', style);
    const response = await fetch('http://localhost:3000/command/speak', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Pairing-Token': sessionStorage.getItem('pairingToken') || ''
      },
      body: JSON.stringify({ speech: speech, style: style })
    });
  },
  listenForKeyword: async (keyword: string, style: StyleSchema) => {
    console.log('BlockCodeService.listenForKeyword called with keyword:', keyword);
    const response = await fetch('http://localhost:3000/command/listenKeyword', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Pairing-Token': sessionStorage.getItem('pairingToken') || ''
      },
      body: JSON.stringify({ keyword: keyword, style: style })
    });
  },
  listenUntilSilence: async (style: StyleSchema) => {
    console.log('BlockCodeService.listenUntilSilence called');
    const response = await fetch('http://localhost:3000/command/listenSilence', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Pairing-Token': sessionStorage.getItem('pairingToken') || ''
      },
      body: JSON.stringify({ style: style })
    });
  }
};
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
    const robotId = sessionStorage.getItem('robotId') || '';
    const response = await fetch('http://localhost:3000/command/speak', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Pairing-Token': sessionStorage.getItem('pairingToken') || ''
      },
      body: JSON.stringify({ robot_id: robotId, speech: speech, style: style })
    });
  },
  listenForKeywords: async (keywords: string[], style: StyleSchema) => {
    console.log('BlockCodeService.listenForKeywords called with keywords:', keywords);
    const robotId = sessionStorage.getItem('robotId') || '';
    const response = await fetch('http://localhost:3000/command/listenKeywords', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Pairing-Token': sessionStorage.getItem('pairingToken') || ''
      },
      body: JSON.stringify({ robot_id: robotId, keywords: keywords, style: style })
    });
  },
  listenUntilSilence: async (style: StyleSchema) => {
    console.log('BlockCodeService.listenUntilSilence called');
    const robotId = sessionStorage.getItem('robotId') || '';
    const response = await fetch('http://localhost:3000/command/listenSilence', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Pairing-Token': sessionStorage.getItem('pairingToken') || ''
      },
      body: JSON.stringify({ robot_id: robotId, style: style })
    });
  }
};
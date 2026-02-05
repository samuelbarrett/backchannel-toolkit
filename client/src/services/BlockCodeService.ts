/**
 * Handler for service calls made by generated code.
 * Code generated from blocks call functions of this service to interact with the backend.
 * These functions are exposed globally in the window as the BlockCodeService object, making them callable by the generated code.
 */

import { StyleSchema } from "../models/style.ts";

// allowed types of dialog commands
type DialogCommand = 
  | { type: 'say'; content: string; style?: StyleSchema }
  | { type: 'listen_until_silence'; style?: StyleSchema }
  | { type: 'listen_keyword'; keywords: string[]; style?: StyleSchema };

export const BlockCodeService = {
  runDialog: async (commands: DialogCommand[]) => {
    console.log('BlockCodeService.runDialog called with dialog:', commands);
    const robotId = sessionStorage.getItem('robotId') || '';
    const pairingToken = sessionStorage.getItem('pairingToken') || '';
    await fetch('/command/runDialog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Pairing-Token': pairingToken
      },
      body: JSON.stringify({ robot_id: robotId, dialog: commands })
    });
  },
};
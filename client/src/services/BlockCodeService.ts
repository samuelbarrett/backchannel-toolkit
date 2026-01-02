/**
 * Handler for service calls made by generated code.
 * Code generated from blocks call functions of this service to interact with the backend.
 * These functions are exposed globally in the window as the BlockCodeService object, making them callable by the generated code.
 */

export const BlockCodeService = {
  robotDialog: async () => {
    console.log('BlockCodeService.robotDialog called');
    const response = await fetch('http://localhost:3000/status', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
  },
  say: (message: string) => {
    console.log('BlockCodeService.say called with message:', message);

  },
  listenForKeyword: (keyword: string) => {
    console.log('BlockCodeService.listenForKeyword called with keyword:', keyword);
  },
  listenUntilSilence: () => {
    console.log('BlockCodeService.listenUntilSilence called');
  }
};
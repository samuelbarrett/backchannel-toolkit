/**
 * Handler for service calls made by generated code.
 * Code generated from blocks call functions of this service to interact with the backend.
 * These functions are exposed globally in the window as the BlockCodeService object, making them callable by the generated code.
 */

import * as api from './api/backend-service';
import type { paths } from './api/openapi-types';

type StatusResponse = paths['/status']['get']['responses']['200']['content']['application/json'];

export const BlockCodeService = {
  robotDialog: () => {
    console.log('BlockCodeService.robotDialog called');
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
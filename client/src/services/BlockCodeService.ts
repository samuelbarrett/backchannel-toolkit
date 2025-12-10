/**
 * Handler for service calls made by generated code.
 * Code generated from blocks call functions of this service to interact with the backend.
 * These functions are exposed globally in the window as the BlockCodeService object, making them callable by the generated code.
 */

import * as api from './api/api';
import type { paths } from './api/openapi-types';

type StatusResponse = paths['/status']['get']['responses']['200']['content']['application/json'];

export const BlockCodeService = {
  
};
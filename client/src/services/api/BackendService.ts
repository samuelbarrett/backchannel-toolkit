// handles calls to the backend API

import { StyleSchema } from '../../models/style.ts';
import type { paths } from './openapi-types.ts';
import createClient from 'openapi-fetch';

type StatusResponse = paths['/status']['get']['responses']['200']['content']['application/json'];
type SpeakRequestBody = paths['/command/speak']['post']['requestBody']['content']['application/json'];
type SpeakResponse = paths['/command/speak']['post']['responses']['200']['content']['application/json'];
type listenSilenceRequestBody = paths['/command/listenSilence']['post']['requestBody']['content']['application/json'];
type listenSilenceResponse = paths['/command/listenSilence']['post']['responses']['200']['content']['application/json'];
type listenKeywordRequestBody = paths['/command/listenKeyword']['post']['requestBody']['content']['application/json'];
type listenKeywordResponse = paths['/command/listenKeyword']['post']['responses']['200']['content']['application/json'];
type PairRequestBody = paths['/pair']['post']['requestBody']['content']['application/json'];
type PairResponse = paths['/pair']['post']['responses']['200']['content']['application/json'];
type runDialogRequestBody = paths['/command/runDialog']['post']['requestBody']['content']['application/json'];
type runDialogResponse = paths['/command/runDialog']['post']['responses']['200']['content']['application/json'];

const backend = createClient<paths>({
  baseUrl: process.env.BASE_SERVER_URL,
});

export const backendService = {
  getStatus: async (): Promise<StatusResponse> => {
    const {data, error} = await backend.GET('/status');
    if (error || !data) {
      console.error('Error fetching status from backend:', error);
    }
    return data;
  },
  pair: async (
    robot_id: string
  ): Promise<PairResponse | undefined> => {
    const body: PairRequestBody = { robot_id };
    const {data, error} = await backend.POST('/pair', {body});
    if (error || !data) {
      console.error(`Error pairing with robot ${robot_id}:`, error);
    }
    return data;
  },
  runDialog: async (
    token: string,
    robot_id: string,
    dialog: any[]
  ): Promise<runDialogResponse | undefined> => {
    const body: runDialogRequestBody = { robot_id, dialog };
    const {data, error} = await backend.POST('/command/runDialog', {body, headers: { 'x-pairing-token': token }});
    if (error || !data) {
      console.error('Error sending runDialog command to backend:', error);
    }
    return data;
  },
};
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
  speak: async (
    speech: string,
    options?: StyleSchema
  ): Promise<SpeakResponse> => {
    const body: SpeakRequestBody = { speech };
    const {data, error} = await backend.POST('/command/speak', {body});
    if (error || !data) {
      console.error('Error sending speak command to backend:', error);
    }
    return data;
  },
  listenSilence: async (
    options?: StyleSchema
  ): Promise<listenSilenceResponse> => {
    const body: listenSilenceRequestBody = { options };
    const {data, error} = await backend.POST('/command/listenSilence', {body});
    if (error || !data) {
      console.error('Error sending listenSilence command to backend:', error);
    }
    return data;
  },
  listenKeyword: async (
    keyword: string,
    options?: StyleSchema
  ): Promise<listenKeywordResponse> => {
    const body: listenKeywordRequestBody = { keyword, options };
    const {data, error} = await backend.POST('/command/listenKeyword', {body});
    if (error || !data) {
      console.error('Error sending listenKeyword command to backend:', error);
    }
    return data;
  }
};
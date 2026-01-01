// handles calls to the backend API

import type { paths } from './openapi-types.ts';
import createClient from 'openapi-fetch';

type StatusResponse = paths['/status']['get']['responses']['200']['content']['application/json'];
type SpeakRequestBody = paths['/command/speak']['post']['requestBody']['content']['application/json'];
type SpeakResponse = paths['/command/speak']['post']['responses']['200']['content']['application/json'];
type listenSilenceRequestBody = paths['/command/listenSilence']['post']['requestBody']['content']['application/json'];
type listenSilenceResponse = paths['/command/listenSilence']['post']['responses']['200']['content']['application/json'];
type listenKeywordRequestBody = paths['/command/listenKeyword']['post']['requestBody']['content']['application/json'];
type listenKeywordResponse = paths['/command/listenKeyword']['post']['responses']['200']['content']['application/json'];

const client = createClient<paths>({
  baseUrl: process.env.BASE_SERVER_URL,
});

export const backendService = {
  getStatus: async (): Promise<StatusResponse> => {
    const {data, error} = await client.GET('/status');
    if (error || !data) {
      console.error('Error fetching status from backend:', error);
    }
    return data;
  },
  speak: async (body: SpeakRequestBody): Promise<SpeakResponse> => {
    const {data, error} = await client.POST('/command/speak', {body});
    if (error || !data) {
      console.error('Error sending speak command to backend:', error);
    }
    return data;
  },
  listenSilence: async (body: listenSilenceRequestBody): Promise<listenSilenceResponse> => {
    const {data, error} = await client.POST('/command/listenSilence', {body});
    if (error || !data) {
      console.error('Error sending listenSilence command to backend:', error);
    }
    return data;
  },
  listenKeyword: async (body: listenKeywordRequestBody): Promise<listenKeywordResponse> => {
    const {data, error} = await client.POST('/command/listenKeyword', {body});
    if (error || !data) {
      console.error('Error sending listenKeyword command to backend:', error);
    }
    return data;
  }
};
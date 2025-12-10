// handles calls to the backend API

import type { paths } from './openapi-types';

type StatusResponse = paths['/status']['get']['responses']['200']['content']['application/json'];
type CommandRequest = paths['/command']['post']['requestBody']['content']['application/json'];
type CommandResponse = paths['/command']['post']['responses']['200']['content']['application/json'];

/**
 * query the server status
 * @returns StatusResponse object with the server status
 */
export async function getStatus(): Promise<StatusResponse> {
  try {
    const response = await fetch('/status', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      let body: any;
      try {
        body = await response.json();
      } catch {
        body = { message: response.statusText || 'Unknown error' };
      }
      throw new Error(`Error fetching /status: ${response.status} ${body.message}`);
    }

    const json = (await response.json()) as StatusResponse;
    return json;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * post a command to the server
 * @param commandData object containing the command data
 */
export async function postCommand(commandData: CommandRequest): Promise<CommandResponse> {
  try {
    const response = await fetch('/command', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commandData)
    });

    if (!response.ok) {
      let body: any;
      try {
        body = await response.json();
      } catch {
        body = { message: response.statusText || 'Unknown error' };
      }
      throw new Error(`Error posting to /command: ${response.status} ${body.message}`);
    }

    const json = (await response.json()) as CommandResponse;
    return json;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
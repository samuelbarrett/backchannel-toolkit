import debug from 'debug';

// debug logs are only enabled when the DEBUG environment variable includes 'app:log'
export const log = debug('app:log');
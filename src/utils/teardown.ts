import * as http from 'http';
import { Logger } from '@piyushkumar96-common-libraries/app-logger';
import { logError } from '../models/Error';

export interface DisconnectClient {
  name: string;
  disconnect: () => Promise<void>;
}

let server: http.Server;
const disconnectClients: DisconnectClient[] = [];

export function setServer(serverInstance: http.Server) {
  server = serverInstance;
}

export function addDisconnectClient(client: DisconnectClient) {
  disconnectClients.push(client);
}

async function teardownServer() {
  if (!server) {
    return undefined;
  }

  Logger.info('Shutting down the server.');
  return new Promise<void>((resolve) => {
    server.close((err) => {
      if (err) {
        logError('While shutting down the server', err);
        process.exitCode = 1;
      } else {
        Logger.info('Server shutdown successfully.');
      }
      resolve();
    });
  });
}

async function teardownClients() {
  return Promise.all(
    disconnectClients.map((c) => {
      Logger.info(`Disconnecting client: ${c.name}`);
      return c.disconnect();
    }),
  );
}

let tearingDown = false;

export function teardown() {
  if (tearingDown) {
    return;
  }
  tearingDown = true;

  Promise.all([teardownServer(), teardownClients()])
    .catch((e) => {
      logError('While tearing down the service', e);
      process.exitCode = 1;
    })
    .finally(process.exit);
}

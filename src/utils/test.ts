import { Container } from 'inversify';
// eslint-disable-next-line import/no-extraneous-dependencies
import proxyquire from 'proxyquire';
import { IMostAndLeastVisitedMuseumResp } from '../models/IMuseum';

/**
 * Suppress all logging messages when testing.
 */
export const appLogger = {
  Logger: new Proxy({}, {
    get: () => () => {},
  }),
};

export function loadContainer(stubs: Record<string, any>): Container {
  const appC = proxyquire('../ioc-container/defaultContainer', {
    './inversify.config': proxyquire('../ioc-container/inversify.config', stubs),
  });
  return appC.default;
}

/**
 * Given an `Inner Request` type, turn it into an object that can be passed
 * to request submitter.
 */
export type Payload<T extends Record<string, any>> = Omit<T, 'requestStatus' | 'requestMetadata'>;

export type InnerRequest =
    | IMostAndLeastVisitedMuseumResp;

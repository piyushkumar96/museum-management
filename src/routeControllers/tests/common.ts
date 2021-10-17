/* eslint-disable import/no-extraneous-dependencies */
import { createRequest, RequestOptions } from 'node-mocks-http';
import { MethodResponse } from '@piyushkumar96-common-libraries/app-utilities';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import express from 'express';

import appContainer from '../../ioc-container/defaultContainer';
import { appLogger, InnerRequest, Payload } from '../../utils/test';

const appUtilities = proxyquire(
  '@piyushkumar96-common-libraries/app-utilities',
  {
    '@piyushkumar96-common-libraries/app-logger': appLogger,
  },
);

interface MockedResponse {
  send: (...args: any[]) => void;
  status: (code: number) => void;
}

type ControllerMethod = (
  request: express.Request,
  response: MockedResponse
) => Promise<void>;

const createResponse = () => {
  const response = { send: () => {}, status: () => {} };
  response.status = () => response;
  return response as MethodResponse;
};

interface StubClass {
  className: string;
  classObj: any;
}

function testUtil(
  Controller: any,
  className: string,
  container: typeof appContainer,
  stubObj: StubClass[],
) {
  return {
    runTest: async (options: TestOptions<typeof Controller>) => {
      stubObj.forEach((obj) => {
        container.rebind(obj.className).toConstantValue(obj.classObj);
      });

      const request = createRequest(options.request);
      const response = createResponse();
      const responseMock = sinon.mock(response);
      responseMock
        .expects('send')
        .once()
        .withExactArgs(
          options.data
            ? {
              apiVersion: '1',
              context: undefined,
              data: options.correlationId
                ? {
                  ...options.data,
                  correlationId: options.correlationId,
                }
                : { ...options.data },
            }
            : {
              apiVersion: '1',
              context: undefined,
              error: {
                ...options.error,
                errors: undefined,
              },
            },
        );
      const controller = container.get<typeof Controller>(className);
      await (controller[options.method] as ControllerMethod)(request, response);
      responseMock.verify();
    },
  };
}

interface TestOptions<T> {
  request?: RequestOptions;
  data?: any;
  correlationId?: string;
  error?: {
    code: number;
    message: string;
  };
  method: keyof T;
  expected?: Payload<InnerRequest>;
}

export { testUtil, appUtilities };

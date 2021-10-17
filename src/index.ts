#!/usr/bin/env node
import 'reflect-metadata';
import express from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import { urlencoded, json } from 'body-parser';
import {
  Logger,
  requestLoggingMiddleware,
} from '@piyushkumar96-common-libraries/app-logger';
import {
  openapiValidator,
  sanitizeInput,
} from '@piyushkumar96-common-libraries/app-utilities';

import { logError } from './models/Error';
import { setServer, teardown } from './utils/teardown';
import envConfig from './config/environment';
import appContainer from './ioc-container/defaultContainer';
import classNames from './ioc-container/classNames';
import HealthCheckController from './routeControllers/HealthCheckController';
import setUpMongoDb from './persistence/database/mongodb';

async function init() {
  await setUpMongoDb();
}

async function main() {
  const app = express();
  const inversifyServer = new InversifyExpressServer(
    appContainer,
    undefined,
    undefined,
    app,
  );

  app.use(urlencoded({ extended: true }));
  app.use(json());
  app.use((_, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTION');
    res.append('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
  });

  await Promise.all([
    openapiValidator(app, {
      validateResponses: true,
      validateRequests: true,
      apiSpec: './api/swagger/openapi.yaml',
    }).then(() => {
      Logger.info('OpenAPI validator set up.');
    }),
  ]);

  // X-Powered-By is set by various servers to say what kind of server it is.
  app.disable('x-powered-by');

  // HTML sanitization can be used to protect against attacks such as cross-site scripting
  // the disallowed tags are escaped rather than discarded. Any text or subtags is handled normally.
  app.use(
    sanitizeInput({
      disallowedTagsMode: 'escape',
    }),
  );
  app.use(requestLoggingMiddleware);

  if (envConfig.SkipHealthCheck.toString() === 'true') {
    Logger.verbose('Skipping health check for dependent services');
  } else {
    Logger.info('Checking dependent services health');
    const controller = appContainer.get<HealthCheckController>(
      classNames.HealthCheckController,
    );
    const response = await controller.healthCheck().then((res) => res.value);

    let serviceDown = false;
    for (const [service, status] of Object.entries(response)) {
      Logger.info(`${service}: ${status}`);
      if (status !== true) {
        serviceDown = true;
      }
    }
    if (serviceDown) {
      Logger.info('Dependent services are not healthy');
      teardown();
      return;
    }
    Logger.info('All dependent services are healthy');
  }

  // setting up prerequisite servers
  await init();

  // setting up the server
  const serverInstance = inversifyServer.build();
  setServer(
    serverInstance.listen(envConfig.ServicePort, () => {
      Logger.info(
        `Server: ${envConfig.ServiceName} started and listening on port: ${envConfig.ServicePort}`,
      );
    }),
  );
}

main().catch((e) => {
  logError(`Failed to start the server: ${envConfig.ServiceName} `, e);
  process.exitCode = 1;
  teardown();
});

// On Ctrl+C:- Stopping the server and also disconnecting client for dependent services
process.on('SIGINT', teardown);
process.on('SIGTERM', teardown);

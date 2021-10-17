import { Container } from 'inversify';

import HealthCheckController from '../routeControllers/HealthCheckController';
import MuseumManagementController from '../routeControllers/MuseumManagementController';
import classNames from './classNames';
import MuseumManagementService from '../services/MuseumManagementService';
import MuseumMongoDbManager from '../persistence/database/mongodb/MuseumMongoDbManager';

// Setting up the Controllers
export function setupControllers(container: Container) {
  container
    .bind<HealthCheckController>(classNames.HealthCheckController)
    .to(HealthCheckController)
    .inSingletonScope();

  container
    .bind<MuseumManagementController>(classNames.MuseumManagementController)
    .to(MuseumManagementController)
    .inSingletonScope();
}

// Setting up the Services
export function setupServices(container: Container) {
  container
    .bind<MuseumManagementService>(classNames.MuseumManagementService)
    .to(MuseumManagementService)
    .inSingletonScope();
}

// Setting up the Persistence Storage
export function setupPersistenceStorage(container: Container) {
  container
    .bind<MuseumMongoDbManager>(classNames.MuseumMongoDbManager)
    .to(MuseumMongoDbManager)
    .inSingletonScope();
}

export function setupContainer(container: Container) {
  setupControllers(container);
  setupServices(container);
  setupPersistenceStorage(container);
}

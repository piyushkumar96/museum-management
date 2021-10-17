const classNames = {
  // Controllers
  HealthCheckController: 'HealthCheckController',
  MuseumManagementController: 'MuseumManagementController',

  // Services
  MuseumManagementService: 'MuseumManagementService',

  // Persistence
  IMuseumDatabaseManager: 'IMuseumDatabaseManager',
  MuseumMongoDbManager: 'MuseumMongoDbManager',

  // External Services
  MongoDbCollection: 'MongoDbCollection',
} as const;

export default classNames;

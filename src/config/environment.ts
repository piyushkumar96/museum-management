import { getConfigOrBail } from '@piyushkumar96-common-libraries/app-utilities';

const configConst = {
  ServiceName: {
    variableName: 'SERVICE_NAME',
    defaultValue: 'UserManagement',
  },
  ServicePort: {
    variableName: 'SERVICE_PORT',
    defaultValue: '4000',
    validator: 'number',
  },

  // Health check
  SkipHealthCheck: {
    variableName: 'SKIP_HEALTH_CHECK',
    defaultValue: 'false',
    validator: /^true|false$/,
  },

  // Logging
  LogLevel: {
    variableName: 'LOGLEVEL',
  },
  LogDir: {
    variableName: 'LOG_DIR',
  },
  OutFileName: {
    variableName: 'OUT_FILE_NAME',
  },
  ErrFileName: {
    variableName: 'ERR_FILE_NAME',
  },

  // Mongo
  MongoDbUrl: {
    variableName: 'MONGODB_URL',
    defaultValue: 'mongodb://localhost:27017',
  },
  MongoDbDBName: {
    variableName: 'MONGODB_DBNAME',
    defaultValue: 'users',
  },
  MongoDbUser: {
    variableName: 'MONGODB_USER',
    required: false,
  },
  MongoDbPassword: {
    variableName: 'MONGODB_PASSWORD',
    required: false,
  },
  MongoDbAuthenticationDB: {
    variableName: 'MONGODb_AUTHENTICATION_DB',
    required: false,
  },
} as const;

const envConfig = getConfigOrBail(configConst);

export default envConfig;

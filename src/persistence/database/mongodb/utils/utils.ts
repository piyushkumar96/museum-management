import { MongoClient, MongoClientOptions } from 'mongodb';

import envConfig from '../../../../config/environment';

const MongoDbCollections = {
  Museums: 'museums',
} as const;

const connectMongoDb = async (): Promise<MongoClient> => {
  const connectionOptions: MongoClientOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  if (envConfig.MongoDbUser !== undefined) {
    connectionOptions.auth = {
      user: envConfig.MongoDbUser as string,
      password: envConfig.MongoDbPassword as string,
    };
    connectionOptions.authSource = envConfig.MongoDbAuthenticationDB;
  }

  return new MongoClient(envConfig.MongoDbUrl, connectionOptions);
};

export { MongoDbCollections, connectMongoDb };

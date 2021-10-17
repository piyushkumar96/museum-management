import { Collection, MongoClient } from 'mongodb';
import { Logger } from '@piyushkumar96-common-libraries/app-logger';

import { MongoDbCollections, connectMongoDb } from './utils/utils';
import appContainer from '../../../ioc-container/defaultContainer';
import envConfig from '../../../config/environment';
import classNames from '../../../ioc-container/classNames';

const setUpMongoDb = async () => {
  const DBClient: MongoClient = await connectMongoDb();

  await DBClient.connect();
  const DB = DBClient.db(envConfig.MongoDbDBName);

  const collections = Object.values(MongoDbCollections);

  for (let i = 0; i < collections.length; i += 1) {
    appContainer
      .bind<Collection>(classNames.MongoDbCollection)
      .toConstantValue(DB.collection(collections[i]))
      .whenTargetNamed(collections[i]);
  }

  Logger.info('Successfully connected to MongoDb');
};

export default setUpMongoDb;

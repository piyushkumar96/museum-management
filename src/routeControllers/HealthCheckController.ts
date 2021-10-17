import {
  controller,
  httpGet,
  MethodResponse,
} from '@piyushkumar96-common-libraries/app-utilities';
import { MongoClient } from 'mongodb';

import { logError } from '../models/Error';
import { connectMongoDb } from '../persistence/database/mongodb/utils/utils';

const API_VERSION = 'v1';

@controller('/health', API_VERSION)
export default class HealthCheckController {
  @httpGet('')
  async health(): Promise<MethodResponse> {
    return this.healthCheck();
  }

  healthCheck = async () => {
    const [MongoDb] = await Promise.all([
      await this.checkMongoDbHealth(),
    ]);

    const allLive = [MongoDb].every((svcStatus) => svcStatus === true);

    return {
      value: { MongoDb },
      statusCode: allLive ? 200 : 500,
    };
  };

  private checkMongoDbHealth = async (): Promise<string | true> => {
    const clientMGDB: MongoClient = await connectMongoDb();
    try {
      await clientMGDB.connect();
      await clientMGDB.db('admin').command({ ping: 1 });
    } catch (e) {
      logError('Couldn\'t connect to MongoDB Reason: ', e);
      return e.message;
    } finally {
      await clientMGDB.close();
    }

    return true;
  };
}

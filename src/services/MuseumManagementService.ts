import { inject, injectable } from 'inversify';

import classNames from '../ioc-container/classNames';
import {
  IMostAndLeastVisitedMuseumResp,
  IMuseumSearchProperty,
} from '../models/IMuseum';
import MuseumMongoDbManager from '../persistence/database/mongodb/MuseumMongoDbManager';

@injectable()
export default class MuseumManagementService {
  constructor(
    @inject(classNames.MuseumMongoDbManager)
    private readonly museumMongoDbManager: MuseumMongoDbManager,
  ) {}

  /**
   * Get most and least visited museum for given properties from the database.
   * @param searchQuery: search query for getting most and least visited museum by properties
   * @return IMostAndLeastVisitedMuseumResp: most and least visited museum
   */
  async getMostAndLeastVisitedMuseumByProperties(
    searchQuery: IMuseumSearchProperty,
  ): Promise<IMostAndLeastVisitedMuseumResp | null> {
    return this.museumMongoDbManager.getMostAndLeastVisitedMuseumByProperties(searchQuery);
  }
}

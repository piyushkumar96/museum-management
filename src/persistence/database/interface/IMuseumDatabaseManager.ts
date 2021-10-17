import { IMostAndLeastVisitedMuseumResp, IMuseumSearchProperty } from '../../../models/IMuseum';

export interface IMuseumDatabaseManager {

  /**
   * Get most and least visited museum for given properties from the database.
   * @param searchQuery: search query for getting most and least visited museum by properties
   * @return IMostAndLeastVisitedMuseumResp: most and least visited museum
   */
  getMostAndLeastVisitedMuseumByProperties(
    searchQuery: IMuseumSearchProperty,
  ): Promise<IMostAndLeastVisitedMuseumResp | null>;
}

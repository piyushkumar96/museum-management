/* eslint-disable no-param-reassign */
import { inject, injectable, named } from 'inversify';
import { Collection } from 'mongodb';

import { IMuseumDatabaseManager } from '../interface/IMuseumDatabaseManager';
import classNames from '../../../ioc-container/classNames';
import { MongoDbCollections } from './utils/utils';
import {
  IMostAndLeastVisitedMuseumResp,
  IMuseum,
  IMuseumSearchProperty,
} from '../../../models/IMuseum';

@injectable()
export default class MuseumMongoDbManager implements IMuseumDatabaseManager {
  constructor(
    @inject(classNames.MongoDbCollection)
    @named(MongoDbCollections.Museums)
    private readonly museumDb: Collection<IMuseum>,
  ) {}

  /**
   * Get most and least visited museum for given properties from the database.
   * @param searchQuery: search query for getting most and least visited museum by properties
   * @return IMostAndLeastVisitedMuseumResp: most and least visited museum
   */
  async getMostAndLeastVisitedMuseumByProperties(
    searchQuery: IMuseumSearchProperty,
  ): Promise<IMostAndLeastVisitedMuseumResp | null> {
    const date = new Date(searchQuery.date);

    const data = await this.museumDb
      .aggregate([
        {
          $project: {
            _id: 0,
            america_tropical_interpretive_center: 1,
            avila_adobe: 1,
            chinese_american_museum: 1,
            firehouse_museum: 1,
            hellman_quon: 1,
            pico_house: 1,
            visitor_center_avila_adobe: 1,
            m: { $month: '$month' },
            y: { $year: '$month' },
          },
        },
        { $match: { m: date.getMonth(), y: date.getFullYear() } },
        {
          $project: {
            america_tropical_interpretive_center: 1,
            avila_adobe: 1,
            chinese_american_museum: 1,
            firehouse_museum: 1,
            hellman_quon: 1,
            pico_house: 1,
            visitor_center_avila_adobe: 1,
          },
        },
      ])
      .toArray();

    if (data.length !== 0) {
      const museums = Object.keys(data[0]);

      let maxVisitedMuseum = '';
      let maxVisitors = Number.NEGATIVE_INFINITY;
      let minVisitedMuseum = '';
      let minVisitors = Number.POSITIVE_INFINITY;
      let ignoredMuseumVisitors = 0;
      let ignoredMuseum = '';
      let totalVisitors = 0;

      // calculating most and least visited museum for given date
      museums.forEach((m) => {
        // @ts-ignore
        const val = parseInt(data[0][m], 10);
        if (m !== searchQuery.ignore) {
          totalVisitors += val;
          if (val > maxVisitors) {
            maxVisitors = val;
            maxVisitedMuseum = m;
          }
          if (val < minVisitors) {
            minVisitors = val;
            minVisitedMuseum = m;
          }
        } else {
          ignoredMuseum = m;
          ignoredMuseumVisitors = val;
        }
      });

      const resp: IMostAndLeastVisitedMuseumResp = {
        attendance: {
          month: date.toLocaleString('en-us', { month: 'short' }),
          year: date.getFullYear(),
          highest: {
            museum: maxVisitedMuseum,
            visitors: maxVisitors,
          },
          lowest: {
            museum: minVisitedMuseum,
            visitors: minVisitors,
          },
          total: totalVisitors,
        },
      };

      if (searchQuery.ignore !== undefined) {
        resp.attendance.ignored = {
          museum: ignoredMuseum,
          visitors: ignoredMuseumVisitors,
        };
      }

      return resp;
    }

    // no document matched for given query
    return null;
  }
}

import {
  controller,
  httpGet,
  MethodResponse,
  NotFoundError,
} from '@piyushkumar96-common-libraries/app-utilities';
import { inject } from 'inversify';
import { Request } from 'express';

import classNames from '../ioc-container/classNames';
import MuseumManagementService from '../services/MuseumManagementService';
import { IMuseumSearchProperty } from '../models/IMuseum';
import { BasicError } from '../models/Error';

const API_VERSION = 'v1';
const PROVIDE_PARAM = 'Please provide at least one query parameter/property';

@controller('', API_VERSION)
export default class MuseumManagementController {
  constructor(
    @inject(classNames.MuseumManagementService)
    private readonly museumManagementService: MuseumManagementService,
  ) {}

  /**
   * Function to get most and least visited museum by provided properties.
   *
   * @param req
   * @returns {Promise<IMostAndLeastVisitedMuseumResp>}
   */
  @httpGet('/museum/properties')
  async getMostAndLeastVisitedMuseumByProperties(req: Request): Promise<MethodResponse> {
    const prop: IMuseumSearchProperty = req.query as unknown as IMuseumSearchProperty;
    if (!Object.keys(prop).length) {
      throw new BasicError(PROVIDE_PARAM);
    }

    const resp = await this.museumManagementService.getMostAndLeastVisitedMuseumByProperties(prop);
    if (resp == null) {
      throw new NotFoundError('No museum match with provided properties');
    }

    return resp;
  }
}

import 'reflect-metadata';
import sinon from 'sinon';
import { assert } from 'chai';
import proxyquire from 'proxyquire';

import classNames from '../../ioc-container/classNames';
import MuseumManagementController from '../MuseumManagementController';
import { testUtil, appUtilities } from './common';
import { IMostAndLeastVisitedMuseumResp } from '../../models/IMuseum';
import { loadContainer } from '../../utils/test';

const container = loadContainer({
  '../routeControllers/MuseumManagementController': proxyquire(
    '../MuseumManagementController',
    {
      '@piyushkumar96-common-libraries/app-utilities': appUtilities,
    },
  ),
});

beforeEach(() => {
  container.snapshot();
});

afterEach(() => {
  container.restore();
  sinon.restore();
});

const museumManagementService = {
  getMostAndLeastVisitedMuseumByProperties: Function,
};

const MUSEUM_NOT_FOUND = 'No museum match with provided properties';
const PROVIDE_PARAM = 'Please provide at least one query parameter/property';

const { runTest } = testUtil(
  MuseumManagementController,
  classNames.MuseumManagementController,
  container,
  [
    {
      className: classNames.MuseumManagementService,
      classObj: museumManagementService,
    },
  ],
);

const malvMuseumResp: IMostAndLeastVisitedMuseumResp = {
  attendance: {
    month: 'Jul',
    year: 2014,
    highest: {
      museum: 'avila_adobe',
      visitors: 32378,
    },
    lowest: {
      museum: 'hellman_quon',
      visitors: 120,
    },
    total: 60535,
  },
};

describe('UT_MM_01_MuseumManagementController test suite', () => {
  it('Get Most and Least Visited Museum', async () => {
    const stubGetMALVisitedMuseumByProperties = sinon
      .stub(museumManagementService, 'getMostAndLeastVisitedMuseumByProperties')
      .resolves(malvMuseumResp);
    await runTest({
      method: 'getMostAndLeastVisitedMuseumByProperties',
      request: {
        query: {
          date: 1404198000000,
        },
      },
      data: {
        ...malvMuseumResp,
      },
    });

    assert.isTrue(stubGetMALVisitedMuseumByProperties.calledOnce);
  });

  it('Get Most and Least Visited Museum FAILURE: No museum match with provided properties', async () => {
    const stubGetMALVisitedMuseumByProperties = sinon
      .stub(museumManagementService, 'getMostAndLeastVisitedMuseumByProperties')
      .resolves(null);
    await runTest({
      method: 'getMostAndLeastVisitedMuseumByProperties',
      request: {
        query: {
          date: 1404198000000,
        },
      },
      error: {
        code: 404,
        message: MUSEUM_NOT_FOUND,
      },
    });
    assert.isTrue(stubGetMALVisitedMuseumByProperties.calledOnce);
  });

  it('Get Most and Least Visited Museum FAILURE: Please provide at least one query parameter/property', async () => {
    const stubGetMALVisitedMuseumByProperties = sinon
      .stub(museumManagementService, 'getMostAndLeastVisitedMuseumByProperties')
      .resolves(malvMuseumResp);
    await runTest({
      method: 'getMostAndLeastVisitedMuseumByProperties',
      request: {
        query: {},
      },
      error: {
        code: 500,
        message: PROVIDE_PARAM,
      },
    });
    assert.isTrue(stubGetMALVisitedMuseumByProperties.notCalled);
  });
});

/* istanbul ignore file */

'use strict';

const {
    CampaignService,
} = require('../services');

CampaignService
    .getInstance()
    .processUpdateExpiredCampaigns();

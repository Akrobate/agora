/* istanbul ignore file */

'use strict';

const cron = require('node-cron');

const {
    CampaignService,
} = require('../services');


function init(cron_string) {
    cron.schedule(cron_string, () => {
        CampaignService
            .getInstance()
            .processUpdateExpiredCampaigns();
    });
}

module.exports = {
    init,
};

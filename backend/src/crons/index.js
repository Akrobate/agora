/* istanbul ignore file */

'use strict';

const {
    init: initUpdateExpiredCampaignsCron,
} = require('updateExpiredCampaigns.cron');

function initAllCrons() {
    initUpdateExpiredCampaignsCron('*/10 * * * *');
}

module.exports = {
    initAllCrons,
};

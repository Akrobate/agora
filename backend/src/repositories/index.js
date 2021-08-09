'use strict';

const {
    CampaignUserRepository,
} = require('./CampaignUserRepository');

const {
    CampaignRepository,
} = require('./CampaignRepository');

const {
    UserRepository,
} = require('./UserRepository');

const {
    PropositionRepository,
} = require('./PropositionRepository');

const {
    CampaignUserStatusRepository,
} = require('./CampaignUserStatusRepository');

const {
    UserPropositionEloResultRepository,
} = require('./UserPropositionEloResultRepository');

const {
    UserPropositionResultRepository,
} = require('./UserPropositionResultRepository');

module.exports = {
    CampaignUserRepository,
    CampaignUserStatusRepository,
    CampaignRepository,
    UserRepository,
    PropositionRepository,
    UserPropositionEloResultRepository,
    UserPropositionResultRepository,
};

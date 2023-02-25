'use strict';

const {
    CampaignUserRepository,
} = require('./CampaignUserRepository');

const {
    CampaignRepository,
} = require('./CampaignRepository');

const {
    ContactTagRepository,
} = require('./ContactTagRepository');

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
    UserContactTagRepository,
} = require('./UserContactTagRepository');

const {
    UserPropositionEloResultRepository,
} = require('./UserPropositionEloResultRepository');

const {
    UserPropositionResultRepository,
} = require('./UserPropositionResultRepository');

const {
    EmailRepository,
} = require('./EmailRepository');

module.exports = {
    CampaignUserRepository,
    CampaignUserStatusRepository,
    ContactTagRepository,
    CampaignRepository,
    EmailRepository,
    UserRepository,
    PropositionRepository,
    UserContactTagRepository,
    UserPropositionEloResultRepository,
    UserPropositionResultRepository,
};

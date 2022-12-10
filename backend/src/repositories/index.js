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

module.exports = {
    CampaignUserRepository,
    CampaignUserStatusRepository,
    ContactTagRepository,
    CampaignRepository,
    UserRepository,
    PropositionRepository,
    UserContactTagRepository,
    UserPropositionEloResultRepository,
    UserPropositionResultRepository,
};

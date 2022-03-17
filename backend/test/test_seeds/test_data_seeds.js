'use strict';

const moment = require('moment');

const manager_user_seed = {
    id: 100,
    password: 'ShouldHaveLettersDigitsAndAtLeast8chars1',
    email: 'manager.user@test.com',
};

const campaign_seed = {
    id: 10,
    title: 'Title of campaignsss',
    description: 'Somethings',
    proposition_type: 'Proposition_type',
    campaign_status: 2,
    owner_user_id: manager_user_seed.id,
};

const manager_campaign_user_seed = {
    campaign_id: campaign_seed.id,
    user_id: 100,
    access_level: 3,
};

const guest_user_seed = {
    id: 200,
    email: 'guest.user@test.com',
};

const guest_campaign_user_seed = {
    id: 201,
    campaign_id: campaign_seed.id,
    user_id: guest_user_seed.id,
    public_token: '8185933f78c749b381ad630308cd1257',
    access_level: 1,
};

const campaign_user_status_1_seed = {
    campaign_id: campaign_seed.id,
    status_id: 3,
    user_id: manager_user_seed.id,
    date: moment().toISOString(),
};

const campaign_user_status_2_seed = {
    campaign_id: campaign_seed.id,
    status_id: 3,
    user_id: guest_user_seed.id,
    date: moment().toISOString(),
};

const proposition_1_seed = {
    id: 1,
    campaign_id: campaign_seed.id,
    payload: 'A',
    creator_user_id: manager_user_seed.id,
};

const proposition_2_seed = {
    id: 2,
    campaign_id: campaign_seed.id,
    payload: 'B',
    creator_user_id: manager_user_seed.id,
};

const proposition_3_seed = {
    id: 3,
    campaign_id: campaign_seed.id,
    payload: 'C',
    creator_user_id: manager_user_seed.id,
};

// guest prop
const guest_user_proposition_result_1 = {
    campaign_id: campaign_seed.id,
    user_id: guest_user_seed.id,
    proposition_id: proposition_1_seed.id,
    rank: 1,
};

const guest_user_proposition_result_2 = {
    campaign_id: campaign_seed.id,
    user_id: guest_user_seed.id,
    proposition_id: proposition_2_seed.id,
    rank: 2,
};

const guest_user_proposition_result_3 = {
    campaign_id: campaign_seed.id,
    user_id: guest_user_seed.id,
    proposition_id: proposition_3_seed.id,
    rank: 3,
};

// manager prop
const manager_user_proposition_result_1 = {
    campaign_id: campaign_seed.id,
    user_id: manager_user_seed.id,
    proposition_id: proposition_1_seed.id,
    rank: 1,
};

const manager_user_proposition_result_2 = {
    campaign_id: campaign_seed.id,
    user_id: manager_user_seed.id,
    proposition_id: proposition_2_seed.id,
    rank: 3,
};

const manager_user_proposition_result_3 = {
    campaign_id: campaign_seed.id,
    user_id: manager_user_seed.id,
    proposition_id: proposition_3_seed.id,
    rank: 2,
};


const guest_user_to_delete_seed = {
    id: 300,
    email: 'guest.user_to_delete@test.com',
};

const guest_campaign_user_to_delete_seed = {
    id: 301,
    campaign_id: campaign_seed.id,
    user_id: guest_user_to_delete_seed.id,
    public_token: '8185933f78c749b381ad630308cd1257',
    access_level: 1,
};


module.exports = {
    manager_user_seed,
    campaign_seed,
    manager_campaign_user_seed,
    guest_user_seed,
    guest_campaign_user_seed,
    guest_campaign_user_to_delete_seed,
    guest_user_to_delete_seed,
    campaign_user_status_1_seed,
    campaign_user_status_2_seed,
    proposition_1_seed,
    proposition_2_seed,
    proposition_3_seed,
    guest_user_proposition_result_1,
    guest_user_proposition_result_2,
    guest_user_proposition_result_3,
    manager_user_proposition_result_1,
    manager_user_proposition_result_2,
    manager_user_proposition_result_3,
};

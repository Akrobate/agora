'use strict';

const moment = require('moment');

const {
    ContactTagRepository,
    UserContactTagRepository,
} = require('../repositories');

const {
    CustomError,
} = require('../CustomError');

const {
    Acl,
} = require('./commons');


class UserContactTagService {

    /**
     * Constructor.
     * @param {Acl} acl
     * @param {ContactTagRepository} contact_tag_repository
     * @param {UserContactTagRepository} user_contact_tag_repository
     */
    constructor(
        acl,
        contact_tag_repository,
        user_contact_tag_repository,
    ) {
        this.acl = acl;
        this.contact_tag_repository = contact_tag_repository;
        this.user_contact_tag_repository = user_contact_tag_repository;
    }


    /* istanbul ignore next */
    /**
     * @static
     * @returns {UserContactTagService}
     */
    static getInstance() {
        if (UserContactTagService.instance === null) {
            UserContactTagService.instance = new UserContactTagService(
                Acl.getInstance(),
                ContactTagRepository.getInstance(),
                UserContactTagRepository.getInstance(),
            );
        }
        return UserContactTagService.instance;
    }


    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async createTag(user, input) {

        const tag = await this.contact_tag_repository
            .create({
                ...input,
                owner_user_id: user.user_id,
            });

        return tag;
    }


    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async searchTag(user, input) {
console.log({
    ...input,
    user_id: user.user_id,
})
        const tag_list = await this.contact_tag_repository
            .search({
                ...input,
                user_id: user.user_id,
            });

        return tag_list;
    }
}

UserContactTagService.instance = null;

module.exports = {
    UserContactTagService,
};

'use strict';

const {
    ContactTagRepository,
    UserContactTagRepository,
} = require('../repositories');

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
        user_contact_tag_repository
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
                UserContactTagRepository.getInstance()
            );
        }
        return UserContactTagService.instance;
    }


    /**
     * @todo
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async add(user, input) {

        const tag = await this.contact_tag_repository
            .create({
                ...input,
                owner_user_id: user.user_id,
            });

        return tag;
    }


    /**
     * @todo
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async replace(user, input) {

        const tag = await this.contact_tag_repository
            .create({
                ...input,
                owner_user_id: user.user_id,
            });

        return tag;
    }


    /**
     * @todo
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async deleteAllTagContent(user, input) {

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
        const tag_list = await this.contact_tag_repository
            .search({
                ...input,
                user_id: user.user_id,
            });

        return tag_list;
    }


    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async updateTag(user, input) {
        const {
            user_id,
        } = user;
        const {
            id: tag_id,
        } = input;

        const tag = await this.contact_tag_repository
            .read(tag_id);

        this.acl.checkUserModifiesOwnData(user_id, tag.user_id);

        await this.contact_tag_repository
            .update(input);

        return this.contact_tag_repository.find({
            id: tag_id,
        });
    }


    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async deleteTag(user, input) {
        const {
            user_id,
        } = user;
        const {
            id: tag_id,
        } = input;

        const tag = await this.contact_tag_repository
            .read(tag_id);

        this.acl.checkUserModifiesOwnData(user_id, tag.user_id);

        await this.contact_tag_repository
            .delete(tag_id);

        return null;
    }
}

UserContactTagService.instance = null;

module.exports = {
    UserContactTagService,
};

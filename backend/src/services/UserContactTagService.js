'use strict';

const {
    ContactTagRepository,
    UserContactTagRepository,
    UserRepository,
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
     * @param {UserRepository} user_repository
     */
    constructor(
        acl,
        contact_tag_repository,
        user_contact_tag_repository,
        user_repository
    ) {
        this.acl = acl;
        this.contact_tag_repository = contact_tag_repository;
        this.user_contact_tag_repository = user_contact_tag_repository;
        this.user_repository = user_repository;
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
                UserRepository.getInstance()
            );
        }
        return UserContactTagService.instance;
    }


    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async add(user, input) {

        const {
            tag_id,
            contact_id_list,
            user_id,
        } = input;

        const {
            user_id: jwt_user_id,
        } = user;

        this.acl.checkUserAccessOwnData(jwt_user_id, user_id);

        const tag_list = await this.contact_tag_repository
            .search({
                id: tag_id,
                user_id,
            });

        if (tag_list.length === 0) {
            this.acl.throwErrorUserAccessOwnData();
        }

        const existing_contact_user_list = await this.user_contact_tag_repository
            .search({
                tag_id,
                user_id,
                contact_user_id_list: contact_id_list,
            });

        const not_to_insert_contact_user_id_list = existing_contact_user_list
            .map((item) => item.contact_user_id);

        for (const contact_user_id of contact_id_list) {
            if (!not_to_insert_contact_user_id_list.includes(contact_user_id)) {
                await this.user_contact_tag_repository.create({
                    contact_user_id,
                    tag_id,
                    user_id,
                });
            }
        }

        return this.readOneTagContent(user, input);
    }


    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async replace(user, input) {

        const {
            tag_id,
            contact_id_list,
            user_id,
        } = input;

        const {
            user_id: jwt_user_id,
        } = user;

        this.acl.checkUserAccessOwnData(jwt_user_id, user_id);

        const tag_list = await this.contact_tag_repository
            .search({
                id: tag_id,
                user_id,
            });

        if (tag_list.length === 0) {
            this.acl.throwErrorUserAccessOwnData();
        }

        await this.deleteAllTagContent(user, input);

        for (const contact_user_id of contact_id_list) {
            await this.user_contact_tag_repository.create({
                contact_user_id,
                tag_id,
                user_id,
            });
        }

        return this.readOneTagContent(user, input);
    }


    /**
     *
     * @param {Object} user
     * @param {Object} input
     * @returns {Object}
     */
    async search(user, input) {

        const {
            tag_id_list,
            contact_id_list,
            user_id,
        } = input;

        const {
            user_id: jwt_user_id,
        } = user;

        this.acl.checkUserAccessOwnData(jwt_user_id, user_id);

        const user_contact_list = await this.user_contact_tag_repository
            .search({
                tag_id_list,
                contact_user_id_list: contact_id_list,
                user_id,
            });

        const contact_user_id_list = [
            ...new Set(user_contact_list.map((item) => item.contact_user_id)),
        ];

        const user_list = await this.user_repository
            .search({
                id_list: contact_user_id_list,
            });

        const enrichment_user_contact_list = await this.user_contact_tag_repository
            .search({
                contact_user_id_list: user_list.map((item) => item.id),
                user_id,
            });

        const uniq_tag_id_list = [
            ...new Set(enrichment_user_contact_list.map((item) => item.tag_id)),
        ];

        const enrichment_tag_list = await this.contact_tag_repository
            .search({
                id_list: uniq_tag_id_list,
            });

        const enriched_user_contact_list = user_list.map((item) => {
            const user_contact_tag_list = enrichment_user_contact_list
                .filter((user_contact) => item.id === user_contact.contact_user_id);

            return {
                contact_user_id: item.id,
                contact_first_name: item.first_name,
                contact_last_name: item.last_name,
                contact_email: item.email,
                tag_list: user_contact_tag_list.map((_user_contact_tag) => ({
                    ..._user_contact_tag,
                    tag_name: enrichment_tag_list
                        .find((tag) => tag.id === _user_contact_tag.tag_id).name,
                })),
            };
        });

        return enriched_user_contact_list;
    }

    /**
     * @todo
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async deleteContactsInTag(user, input) {

        const {
            tag_id,
            contact_id_list,
            user_id,
        } = input;

        const {
            user_id: jwt_user_id,
        } = user;

        this.acl.checkUserAccessOwnData(jwt_user_id, user_id);

        const tag_list = await this.contact_tag_repository
            .search({
                id: tag_id,
                user_id,
            });

        if (tag_list.length === 0) {
            this.acl.throwErrorUserAccessOwnData();
        }


        // Modification to validate. Seems beeing not use full here
        // await this.deleteAllTagContent(user, input);


        const user_contact_list = await this.user_contact_tag_repository
            .search({
                tag_id,
                user_id,
                contact_user_id_list: contact_id_list,
            });

        await Promise.all(
            user_contact_list
                .map((user_contact) => this
                    .user_contact_tag_repository
                    .delete(user_contact.id)
                )
        );

        return {};
    }


    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async readOneTagContent(user, input) {

        const {
            tag_id,
        } = input;

        const {
            user_id,
        } = user;

        // @todo check ownership

        const {
            name,
            created_at,
            updated_at,
        } = await this.contact_tag_repository.read(tag_id);

        const tag_content = await this.user_contact_tag_repository
            .search({
                tag_id,
                user_id,
            });

        return {
            tag_id,
            user_id,
            name,
            created_at,
            updated_at,
            contact_user_list: tag_content.map((item) => ({
                id: item.id,
                contact_user_id: item.contact_user_id,
            })),
        };
    }


    /**
     * @param {Object} user
     * @param {Object} input
     * @returns {Promise<*|Error>}
     */
    async deleteAllTagContent(user, input) {

        const {
            tag_id,
        } = input;

        const user_contact_list = await this.user_contact_tag_repository
            .search({
                tag_id,
            });

        return Promise.all(
            user_contact_list
                .map((user_contact) => this
                    .user_contact_tag_repository
                    .delete(user_contact.id)
                )
        );
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

        const results = [];

        for (const tag of tag_list) {
            const tag_content = await this.user_contact_tag_repository
                .search({
                    tag_id: tag.id,
                    user_id: tag.user_id,
                });
            results.push({
                ...tag,
                contact_count: tag_content.length,
            });
        }
        return results;
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

        this.acl.checkUserAccessOwnData(user_id, tag.user_id);

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

        this.acl.checkUserAccessOwnData(user_id, tag.user_id);

        await this.contact_tag_repository
            .delete(tag_id);

        return null;
    }
}

UserContactTagService.instance = null;

module.exports = {
    UserContactTagService,
};

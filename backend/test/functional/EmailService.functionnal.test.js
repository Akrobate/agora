'use strict';

const {
    EmailService,
} = require('../../src/services/EmailService');

describe.skip('EmailService', () => {

    it('Send mail test', async () => {
        const email_service = EmailService.getInstance();

        await email_service.sendInvitationMail({
            to: 'fedorov.artiom@gmail.com',
            campaign_name: 'Nom de la campagne',
            campaign_description: 'Description de la campagne lorem ipsum sic amet dolorit',
            invitation_token: 'lkdfjslfkjsdlfkj',
        });
    });

});

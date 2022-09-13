describe('Login', () => {

    it('Should get be able to update type of campaign', () => {
        cy.login('fedorov.artiom@gmail.com', 'Aze987654')
        cy.contains('campagnes')
    })

})
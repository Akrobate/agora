describe('Campaign edit', () => {
    beforeEach(() => {
        cy.login('fedorov.artiom@gmail.com', 'Aze987654')
        cy.visit('/campaigns/edit/1')
    })

    it('Should get be able to update type of campaign', () => {
        cy.contains('Paramètres de campagne')
        cy.get('#input-62').clear().type('raw_string')
        cy.get('.v-card__actions > :nth-child(3) > .v-btn__content').click()
        cy.get('#input-62').should('have.value', 'raw_string')
        cy.contains('Créer proposition')
        cy.reload()
        cy.get('#input-62').should('have.value', 'raw_string')
    })
})
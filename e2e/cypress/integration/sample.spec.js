describe('Sample', () => {
    it('should not test anything', () => {
        cy.viewport(1290, 800)
        cy.visit('http://192.168.1.11:8080')
        cy.url().should('include', 'login')
        cy.get('#input-52').type('fedorov.artiom@gmail.com')
        cy.get('#password').type('Aze987654')
        cy.get('.v-btn').click()
        cy.url().should('not.include', 'login')
    })
})
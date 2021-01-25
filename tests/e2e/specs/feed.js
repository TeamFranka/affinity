/// <reference types="Cypress" />
describe('Visiting the public feed', () => {
    it('Visits the feed', () => {
      cy.visit('/feed')
      cy.contains('ion-title', 'Doctor Who')
    })
  })

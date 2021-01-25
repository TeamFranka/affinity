/// <reference types="Cypress" />

describe('Posting to the feed as regular User', () => {
    beforeEach(() => {
      cy.loggedInAs("clara");
    })
    it('Posts a simple message', () => {
      const testStr = `Whatever, dude ${Math.abs(Math.random()*  1000000)}!`;
      cy.visit('/feed');
      cy.get('[data-cy=newPost]').within(()=>{
        cy.get('[data-cy=richEditor]').type(testStr);
        cy.get('[data-cy-role=submit]').first().click();
      })

      cy.get('[data-cy-type=activity] [data-cy-role=content] p')
        .should('contain', testStr);
    })
  })

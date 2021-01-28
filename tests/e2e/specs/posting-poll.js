/// <reference types="Cypress" />

describe('Posting poll to the feed as an Admin', () => {
    beforeEach(() => {
      cy.loggedInAs("river");
    })

    it('Posts a Poll', () => {
      const testTitle = `How awesome is Dr Who ${Math.abs(Math.random()*  1000000)}?`;
      const testDesc = `Test Description ${Math.abs(Math.random()*  1000000)}?`;
      cy.visit('/feed');
      cy.get('[data-cy=newPost] [data-cy=addPoll]').click();
      cy.get('ion-modal').within(() => {
          cy.wait(500);
          cy.get('input[name=title]').clear().type(testTitle);
          cy.get('[data-cy=richEditor]').clear().type(testDesc);
          cy.get('input[name=opt-0-title]').clear();
          cy.get('[data-cy-role=submit]').should("be.disabled");
          cy.get('input[name=opt-0-title]').type("Knorke");
          cy.get('[data-cy-role=submit]').should("not.be.disabled");
          cy.get('input[name=opt-1-title]').clear().type("Ehrenfrau");
          cy.get('input[name=opt-2-title]').clear().type("Mega");

          cy.get('input[name=opt-3-title]').should("not.exist");
          cy.get('[data-cy=addOption]').click();
          cy.get('input[name=opt-3-title]').should("exist");
          cy.get('input[name=opt-3-title]').clear().type("Geil-o-Mat");

          cy.get('input[name=opt-4-title]').should("not.exist");
          cy.get('[data-cy=addOption]').click();
          cy.get('input[name=opt-4-title]').should("exist");
          cy.get('input[name=opt-4-title]').clear().type("clowntastisch");
          cy.get('input[name=opt-4-desc]').clear().type("Mehr Infos zum Eintrag");
          cy.get('[data-cy-role=submit]').click();
      });

      cy.get('[data-cy=newPost]').within(() => {
        cy.get('[data-cy-role=submit]').first().click();
        cy.get('[data-cy-obj=poll]').within(() => {
          cy.get('[data-cy-role=title]').contains(testTitle);
          cy.get('[data-cy-role=desc]').contains(testDesc);
          cy.get('[name=opt-0-title]').contains("Knorke");
          cy.get('[name=opt-1-title]').contains("Ehrenfrau");
          cy.get('[name=opt-2-title]').contains("Mega");
          cy.get('[name=opt-3-title]').contains("Geil-o-Mat");
          cy.get('[name=opt-4-title]').contains("clowntastisch");
          cy.get('[name=opt-4-desc]').contains("Mehr Infos zum Eintrag");
        });
      });

      cy.get('[data-cy-type=activity] [data-cy-obj=poll]').within(() => {
        cy.get('[data-cy-role=title]').contains(testTitle);
        cy.get('[data-cy-role=desc]').contains(testDesc);
        cy.get('[name=opt-0-title]').contains("Knorke");
        cy.get('[name=opt-1-title]').contains("Ehrenfrau");
        cy.get('[name=opt-2-title]').contains("Mega");
        cy.get('[name=opt-3-title]').contains("Geil-o-Mat");
        cy.get('[name=opt-4-title]').contains("clowntastisch");
        cy.get('[name=opt-4-desc]').contains("Mehr Infos zum Eintrag");
    })
  })
});

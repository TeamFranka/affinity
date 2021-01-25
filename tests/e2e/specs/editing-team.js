/// <reference types="Cypress" />

describe('Editing the team as an admin', () => {
  const teamSlug = "doctor-who";

  beforeEach(() => {
    cy.loggedInAs("river");
  })

  it('Can edit Team Name', () => {
    const testStr = `New Name ${Math.abs(Math.random()*  1000000)}!`;
    cy.visit(`/t/${teamSlug}`);
    cy.get('[data-cy=title] [data-cy-role=editModal]').click();
    cy.get('ion-modal').within( () => {
      cy.wait(200);
      cy.get('[data-cy-role=edit] input').clear().type(testStr);
      cy.get('[data-cy-role=submit]').first().click();
    })

    cy.get('[data-cy=title]').should('contain', testStr);
  })

  it('Can edit Team Description', () => {
    const testStr = `New Description ${Math.abs(Math.random()*  1000000)}!`;
    cy.visit(`/t/${teamSlug}`);
    cy.get('[data-cy=description] [data-cy-role=editModal]').click();
    cy.get('ion-modal').within( () => {
      cy.wait(200);
      cy.get('[data-cy=richEditor]').clear().type(testStr);
      cy.get('[data-cy-role=submit]').first().click();
    })

    cy.get('[data-cy=description]').should('contain', testStr);
  })

  it('Can edit set custom styles', () => {
    const testStr = `--color-${Math.ceil(Math.random()* 1000000)}: blue;`;
    cy.visit(`/t/${teamSlug}`);
    cy.get('[data-cy-role=edit][data-cy-edit-target=styles]').click();
    cy.get('ion-modal').within( () => {
      cy.wait(200);
      cy.get('[data-cy-role=edit] textarea').clear().type(testStr);
      cy.get('[data-cy-role=submit]').first().click();
    })

    cy.get('[data-cy=customStyles]').should('have.css', testStr);
  })

})

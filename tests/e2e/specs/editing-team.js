/// <reference types="Cypress" />

describe("Editing the team as an admin", () => {
  const teamSlug = "doctor-who";

  beforeEach(() => {
    cy.loggedInAs("river");
  });

  it("Can edit Team Name", () => {
    const testStr = `Team Name ${Math.random().toString(36).substring(7)}!`;
    cy.visit(`/t/${teamSlug}`);
    cy.get("[data-cy=title] [data-cy-role=editModal]").click();
    cy.get("ion-modal").within(() => {
      cy.wait(500);
      cy.get("[data-cy-role=edit] input").clear();
      cy.wait(500);
      cy.get("[data-cy-role=edit] input").type(testStr);
      cy.get("[data-cy-role=submit]").first().click();
    });

    cy.get("[data-cy=title]").should("contain", testStr);
  });

  it("Can edit Team Description", () => {
    const testStr = `Team Description ${Math.random()
      .toString(36)
      .substring(7)}!`;
    cy.visit(`/t/${teamSlug}`);
    cy.get("[data-cy=description] [data-cy-role=editModal]").click();
    cy.get("ion-modal").within(() => {
      cy.wait(500);
      cy.get("[data-cy=richEditor]").clear();
      cy.wait(500);
      cy.get("[data-cy=richEditor]").type(testStr);
      cy.get("[data-cy-role=submit]").first().click();
    });

    cy.get("[data-cy=description]").should("contain", testStr);
  });

  it("Can edit set custom styles", () => {
    const testStr = `--color-${Math.random().toString(36).substring(7)}:blue;`;
    cy.visit(`/t/${teamSlug}`);
    cy.get("[data-cy-role=edit][data-cy-edit-target=styles]").click();
    cy.get("ion-modal").within(() => {
      cy.wait(500);
      cy.get("[data-cy-role=edit] textarea").clear({ force: true });
      cy.wait(500);
      cy.get("[data-cy-role=edit] textarea").type(testStr);
      cy.get("[data-cy-role=submit]").click();
    });

    cy.get("[data-cy=customStyles]")
      .should("have.attr", "style")
      .and("include", testStr);
  });
});

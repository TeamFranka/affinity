/// <reference types="Cypress" />
describe("Joining team", () => {
  it("Try to join a public team", () => {
    cy.signUpAsNewUser();

    cy.visit("/t/doctor-who");
    // we are member of the default team
    cy.get("[data-cy-role=leave]").should("exist");

    cy.visit("/t/team-earth");
    // we are not a member yet
    cy.get("[data-cy-role=leave]").should("not.exist");
    cy.get("[data-cy-role=join]").click();
    cy.get("[data-cy-role=leave]").should("exist");

    // ensure it persists over reloads.
    cy.visit("/t/doctor-who");
    // nothing changed
    cy.get("[data-cy-role=leave]").should("exist");
    // --
    cy.visit("/t/team-earth");
    // nothing changed
    cy.get("[data-cy-role=leave]").should("exist");
  });
});

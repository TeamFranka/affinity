/// <reference types="Cypress" />
describe("Sign up", () => {
  it("Applies for membership of default team", () => {
    cy.signUpAsNewUser();
    cy.visit("/my");
    // and route to the team listing
    cy.get("[data-cy-role=myTeams]").click();
    cy.get("[data-cy-role=teamLink]").should("have.length", 1);
    cy.get("[data-cy-team=doctor-who]").click();

    // and we are able to leave it
    cy.url().should("include", "/t/doctor-who");
    cy.get("[data-cy-role=leave]").should("exist");
  });
});

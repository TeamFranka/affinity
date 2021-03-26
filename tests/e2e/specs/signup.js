/// <reference types="Cypress" />
describe("Sign up", () => {
  it("Applies for membership of default team", () => {
    cy.signUpAsNewUser();
    cy.visit("/me");

    // Make sure we are a member of the default team
    cy.get("[data-cy=my-teams]").within(() => {
      cy.get("a").should("have.attr", "href").and("include", "/t/");
    });
  });
});

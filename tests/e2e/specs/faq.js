/// <reference types="Cypress" />
describe("FAQ", () => {

  it("regular user can't create FAQ item", () => {
    cy.signUpAsNewUser();
    cy.viewport("iphone-6", "portrait");
    cy.visit("/faq");
    cy.get("[data-cy=addEntry]").should("not.exist");
  });

  it.only("create FAQ item", () => {
    cy.loggedInAs("river");
    cy.viewport("iphone-6", "portrait");
    cy.visit("/faq");
    const testTitle = `What is Dr Who ${Math.floor(
      Math.random() * 1000000
    )}?`;
    const testDesc = `Test Description ${Math.floor(Math.random() * 1000000)}?`;

    cy.get("[data-cy=addEntry]").click();
    cy.get("ion-modal").within(() => {
        cy.get("input[name=title]").clear().type(testTitle);
        cy.get("[data-cy=richEditor]").clear().type(testDesc);
        cy.get("[data-cy-role=submit]").click();
    });

    cy.get("ion-modal").should("not.exist");

    cy.get("[data-cy-role=search] input ").clear().type(testTitle);

    // find our new item
    cy.get("[data-cy-role=title]").contains(testTitle);
    cy.get("[data-cy-role=title]").first().click(); // to open
    cy.get("[data-cy-role=desc]").contains(testDesc);
  });
});
/// <reference types="Cypress" />
describe("Log in", () => {
  beforeEach(() => {
    cy.clearUser();
  })
  it("as clara ", () => {
    const username = "clara";;
    cy.visit("/my");

    cy.get("ion-modal").within(() => {
        cy.wait(1000);
        cy.get("input[name=username]:visible").type(username, { delay: 50 });
        cy.get("input[name=password]:visible").type(username, { delay: 50 });
        cy.get("ion-button[data-cy-role=loginSubmit]").click();
    });
    cy.get("[data-cy-role=loginModal]").should("not.exist", { timeout: 10000 });
    cy.get("[data-cy=title]").should("contain", "Clara");
  });
  it("as river ", () => {
    const username = "river";
    cy.visit("/my");

    cy.get("ion-modal").within(() => {
        cy.wait(1000);
        cy.get("input[name=username]:visible").type(username, { delay: 50 });
        cy.get("input[name=password]:visible").type(username, { delay: 50 });
        cy.get("ion-button[data-cy-role=loginSubmit]").click();
    });
    cy.get("[data-cy-role=loginModal]").should("not.exist", { timeout: 10000 });
    cy.get("[data-cy=title]").should("contain", "River");
  });
});

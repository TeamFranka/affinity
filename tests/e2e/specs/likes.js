/// <reference types="Cypress" />
describe("Liking", () => {
  it("on news item anon opens login", () => {
    cy.clearUser();
    cy.viewport("iphone-6", "portrait");
    cy.visit("/news");

    cy.get("[data-cy-role=like]").first().click();
    cy.get("[data-cy-role=loginModal]").should("exist", { timeout: 10000 });
  });
  it("on feed item anon opens login", () => {
    cy.clearUser();
    cy.viewport("iphone-6", "portrait");
    cy.visit("/feed");
    cy.clearNotification();

    cy.get("[data-cy-role=like]").first().click();
    cy.get("[data-cy-role=loginModal]").should("exist", { timeout: 10000 });
  });

  it("on the news feed", () => {
    cy.signUpAsNewUser();
    cy.viewport("iphone-6", "portrait");
    cy.visit("/news");

    cy.get("[data-cy-role=like]:visible").first().then( (d) => {
      const beforeCount = parseInt(d.attr("data-cy-count"));
      cy.get(d).click();

      // toggle on
      cy.get(d).should("have.attr", "data-cy-count").and("eq", (beforeCount +1).toString());
      // toggle off
      cy.get(d).click();
      cy.get(d).should("have.attr", "data-cy-count").and("eq", beforeCount.toString());
    })
  });
  it("A feed item", () => {
    cy.signUpAsNewUser();
    cy.viewport("iphone-6", "portrait");
    cy.visit("/feed");
    cy.clearNotification();

    cy.get("[data-cy-role=like]").first().then( (d) => {
      const beforeCount = parseInt(d.attr("data-cy-count"));
      cy.get(d).click();

      // toggle on
      cy.get("[data-cy-role=like]").first().should("have.attr", "data-cy-count").and("eq", (beforeCount +1).toString());
      // toggle off
      cy.get("[data-cy-role=like]").first().click();
      cy.get("[data-cy-role=like]").first().should("have.attr", "data-cy-count").and("eq", beforeCount.toString());
    })
  });
});
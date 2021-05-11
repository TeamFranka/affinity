/// <reference types="Cypress" />
describe("Visiting the public feed gallery", () => {
    it("Visits the feed gallery", () => {
      const testStr = "Welcome everyone!";
      cy.visit("/gallery"); 
    });
  });

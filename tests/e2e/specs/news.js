/// <reference types="Cypress" />
describe("Visiting the public news", () => {
  it("Swiping through the news", () => {
    cy.viewport("iphone-6", "portrait");
    cy.visit("/news");

    cy.get(".flip-in .shown").then((x) => {
      const before = x.length;

      cy.swipeUp();
      cy.get(".flip-in .shown").should("have.length", before -1);

      cy.swipeUp();
      cy.get(".flip-in .shown").should("have.length", before -2);

      cy.swipeUp();
      cy.get(".flip-in .shown").should("have.length", before -3);

      cy.swipeDown();
      cy.get(".flip-in .shown").should("have.length", before -2);

      cy.swipeDown();
      cy.get(".flip-in .shown").should("have.length", before -1);


    });

  });
});
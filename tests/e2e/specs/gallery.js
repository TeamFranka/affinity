/// <reference types="Cypress" />
describe("Visiting the public feed gallery", () => {
    it("Visits the feed gallery", () => {
      const testStr = "Willkommen euch allen!";
      cy.visit("/gallery");

        // there is an element with the default sentence
      // cy.get("[data-cy-type=activity] [data-cy-role=content] p").should(
      //   "contain",
      //   testStr
      // );


      cy.contains('img').click()

      // cy.get("[data-cy-type=activity][data-cy-verb=announce]").within(() => {
      //   cy.get("[data-cy-role=content] p").should(
      //     "contain",
      //     "Ein freundliches Hallo zu Yaz!!!"
      //   );
      //   cy.get("[data-cy-obj=picture] ion-img").should("exist");
      // });
 
    });
  });

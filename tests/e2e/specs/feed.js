/// <reference types="Cypress" />
describe("Visiting the public feed", () => {
  it("Visits the feed", () => {
    const testStr = "Willkommen euch allen!";
    cy.visit("/feed");

    // there is an element with the default sentence
    cy.get("[data-cy-type=activity] [data-cy-role=content] p").should(
      "contain",
      testStr
    );

    // and an announcement with a text and a picture
    cy.get("[data-cy-type=activity][data-cy-verb=announce]").within(() => {
      cy.get("[data-cy-role=content] p").should(
        "contain",
        "Ein freundliches Hallo zu Yaz!!!"
      );
      cy.get("[data-cy-obj=picture] ion-img").should("exist");
    });
  });
  it.skip("Can endless scroll", () => {
    // FIXME scrolling doesn't work.
    cy.visit("/feed");

    // there is an element with the default sentence
    cy.get("[data-cy-type=activity]").should("have.length.of.at.most", 25);
    // scrolling to the bottom
    cy.get("[data-cy-type=activity]")
      .last()
      .scrollIntoView({ ensureScrollable: false });

    // and we have more elements loaded!
    cy.get("[data-cy-type=activity]").should("have.length.of.at.least", 50);

    // scrolling to the bottom
    cy.get("[data-cy-type=activity]")
      .last()
      .scrollIntoView({ ensureScrollable: false });

    // and we have more elements loaded!
    cy.get("[data-cy-type=activity]").should("have.length.of.at.least", 75);
  });
});

/// <reference types="Cypress" />

describe("Posting to the feed as an admin User", () => {
  beforeEach(() => {
    cy.loggedInAs("river");
    cy.viewport("ipad-2", "landscape");
  });

  it("Posts a news item", () => {
    const testStr = `This is an announcement ${Math.abs(Math.random() * 1000000)}!`;
    cy.visit("/feed");
    cy.get("[data-cy=openNewPostModal").should("not.be.visible");
    cy.get("[data-cy=newPost] [data-cy=richEditor]").type(testStr);
    cy.get("[data-cy=newPost] [data-cy-role=editSettings] ion-button").first().click();
    cy.get("[data-cy=newPost] [data-cy-role=selectType]").first().click();
    cy.get("[data-cy-select=announce]").first().click();
    cy.get("[data-cy=newPost] [data-cy-role=closeSettings]").first().click();
    cy.get("[data-cy=newPost] [data-cy-role=postType]")
      .should("have.attr", "data-cy-value", "announce");
    cy.get("[data-cy=newPost] [data-cy-role=submit]").first().click();

    cy.get("[data-cy-type=activity]:first [data-cy-role=content] p").should(
      "contain",
      testStr
    );
    cy.visit("/news");

    cy.get("[data-cy-role=news]:last [data-cy-role=content] p", { includeShadowDom: true }).should(
      "contain",
      testStr
    );
  });
});
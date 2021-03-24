describe("Posting to the feed as User with multiple teams", () => {
  beforeEach(() => {
    cy.loggedInAs("yaz");
    cy.viewport("ipad-2", "landscape");
  });
  it("Posts a simple message to other team", () => {
    const testStr = `Whatever, dude ${Math.abs(Math.random() * 1000000)}!`;
    cy.visit("/feed");
    cy.get("[data-cy=newPost]").within(() => {
      cy.get("[data-cy=richEditor]").type(testStr);
      cy.get("[data-cy-role=editSettings]").click();
      cy.get("[data-cy=selectTeam]").click();
    });

    // the popover is outside that submit.
    cy.get("ion-popover").should("be.visible");
    cy.get("ion-popover ion-item").contains("Team Earth").click();
    cy.get("ion-popover").should("not.be.visible");

    cy.get("[data-cy=newPost]").within(() => {
      // is selected now.
      cy.get("[data-cy=selectTeam]").contains("Team Earth");
      // we submit
      cy.get("[data-cy-role=submit]").first().click();
    });

    // submitted item has the team signifier.
    cy.get("[data-cy-type=activity]:first")
      .should("contain", testStr)
      .and("contain", "Team Earth");
  });
});

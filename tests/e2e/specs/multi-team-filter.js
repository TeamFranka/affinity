describe("Filtering the feed by teams", () => {
  beforeEach(() => {
    cy.loggedInAs("yaz");
    cy.viewport("ipad-2", "landscape");
  });
  it("Filter for subteam", () => {
    cy.visit("/feed");

    // make sure the ones we care about are accessible;

    // this implicitly also checks that saving works!
    // cy.get("[data-cy=team-filter] [data-cy-entry='settings']").click()
    // cy.get("ion-modal").within(() => {
    //   ['ALL', 'team-earth', 'doctor-who'].forEach((name) => {
    //     cy.get(`ion-toggle[data-cy-entry=${name}]`).then(($e) => {
    //       console.log($e.attr('aria-checked'), $e);
    //       if ($e.attr('aria-checked') !== 'true') {
    //         cy.get(`ion-toggle[data-cy-entry=${name}]`).click();
    //       }
    //     })
    //   });
    //   cy.get("[data-cy=save]").click();
    // })


    cy.get("[data-cy=team-filter] [data-cy-entry=ALL]").click();
    // all
    cy.get("[data-cy-type=activity][data-cy-team=team-earth]")
      .should("exist");
    cy.get("[data-cy-type=activity][data-cy-team=doctor-who]")
      .should("exist");

    cy.get("[data-cy=team-filter] [data-cy-entry=team-earth]").click();
    cy.get("[data-cy-type=activity][data-cy-team=team-earth]")
      .should("exist", "");
    cy.get("[data-cy-type=activity][data-cy-team=doctor-who]")
      .should("not.exist");

    cy.get("[data-cy=team-filter] [data-cy-entry=doctor-who]").click();
    cy.get("[data-cy-type=activity][data-cy-team=team-earth]")
      .should("not.exist", "");
    cy.get("[data-cy-type=activity][data-cy-team=doctor-who]")
      .should("exist");

    cy.get("[data-cy=team-filter] [data-cy-entry=ALL]").click();
    cy.get("[data-cy-type=activity][data-cy-team=team-earth]")
      .should("exist");
    cy.get("[data-cy-type=activity][data-cy-team=doctor-who]")
      .should("exist");
  });
});

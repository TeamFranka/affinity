/// <reference types="Cypress" />

describe("Create a new sub team as an admin", () => {
  const mainTeamSlug = "doctor-who";

  beforeEach(() => {
    cy.loggedInAs("river");
  });

  it("Can create new sub Team", () => {
    const rand = Math.random().toString(36).substring(7);
    const testStr = `Sub Team ${rand}!`;
    const subTeamSlug = `sub-team-${rand}`;
    cy.visit(`/t/${mainTeamSlug}`);
    cy.get("[data-cy=addSubTeamModal]").click();
    cy.get("ion-modal").within(() => {
      cy.wait(500);
      cy.get("[data-cy-role=name] input").clear();
      cy.get("[data-cy-role=slug] input").clear();
      cy.wait(500);
      cy.get("[data-cy-role=name] input").type(testStr);
      cy.get("[data-cy-role=slug] input").type(subTeamSlug);
      cy.get("[data-cy-role=submit]").first().click();
    });

    cy.location("pathname").should("equal", `/t/${subTeamSlug}`);
    cy.get("[data-cy=title]").should("contain", testStr);

    cy.visit(`/t/${mainTeamSlug}`);
    cy.get("[data-cy=subteams]").within(() => {
      // and is listed as subteam
      cy.get("span").should("contain", testStr);
    });

    // Team Leaders conversation should exist
    cy.visit(`/inbox`);
    cy.get(`ion-item [data-cy=teamchat-${subTeamSlug}-leaders`);
  });
});

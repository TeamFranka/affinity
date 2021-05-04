/// <reference types="Cypress" />
describe("Joining team", () => {
  it.skip("Try to join a root team", () => {
    cy.signUpAsNewUser();

    cy.visit("/t/doctor-who");
    // we are member of the default team
    cy.get("[data-cy-role=leave]").should("exist");

    cy.visit("/t/torchwood");
    // we are not a member yet
    cy.get("[data-cy-role=leave]").should("not.exist");
    cy.get("[data-cy-role=join]").click();
    cy.get("[data-cy-role=leave]").should("exist");

    // ensure it persists over reloads.
    cy.visit("/t/doctor-who");
    // nothing changed
    cy.get("[data-cy-role=leave]").should("exist");
    // --
    cy.visit("/t/torchwood");
    // nothing changed
    cy.get("[data-cy-role=leave]").should("exist");
    cy.get("[data-cy-role=leave]").click();
    // confirm the shown alert
    cy.get("ion-alert .alert-button-role-confirm").click();
    cy.get("[data-cy-role=join]").should("exist");
  });
  it.skip("Try to join a sub team", () => {
    cy.signUpAsNewUser();

    cy.visit("/t/doctor-who");
    // we are member of the default team
    cy.get("[data-cy-role=leave]").should("exist");

    cy.visit("/t/team-earth");
    // we are not a member of this subteam yet
    cy.get("[data-cy-role=leave]").should("not.exist");
    cy.get("[data-cy-role=join]").click();
    cy.get("[data-cy-role=leave]").should("exist");

    // ensure it persists over reloads.
    cy.visit("/t/doctor-who");
    // nothing changed
    cy.get("[data-cy-role=leave]").should("exist");
    // --
    cy.visit("/t/team-earth");
    // nothing changed
    cy.get("[data-cy-role=leave]").should("exist");
    cy.get("[data-cy-role=leave]").click();
    // confirm the shown alert
    cy.get("ion-alert .alert-button-role-confirm").click();
    cy.get("[data-cy-role=join]").should("exist");
  });

  it("Autojoins a subteam team", () => {
    cy.signUpAsNewUser();

    cy.visit("/t/doctor-who");
    // we are member of the default team
    cy.get("[data-cy-role=leave]").should("exist");

    cy.visit("/t/tw-cardiff");
    // we are not a member yet
    cy.get("[data-cy-role=leave]").should("not.exist");

    cy.visit("/t/torchwood");
    // we are not a member yet
    cy.get("[data-cy-role=leave]").should("not.exist");
    cy.get("[data-cy-role=join]").click();
    cy.get("[data-cy-role=leave]").should("exist");

    // ensure it persists over reloads.
    cy.visit("/t/doctor-who");
    // nothing changed
    cy.get("[data-cy-role=leave]").should("exist");

    // and we are member of the subteamm, too
    cy.visit("/t/tw-cardiff");
    // we are not a member yet
    cy.get("[data-cy-role=leave]").should("exist");

    // and both and the default team are listed on our membership page
    cy.visit("/my");
    // and route to the team listing
    cy.get("[data-cy-role=myTeams]").click();
    cy.get("[data-cy-role=teamLink]").should("have.length", 3);
    cy.get("[data-cy-team=doctor-who]").should("exist");
    cy.get("[data-cy-team=torchwood]").should("exist");
    cy.get("[data-cy-team=tw-cardiff]").should("exist");
  });
});

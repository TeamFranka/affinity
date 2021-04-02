/// <reference types="Cypress" />
describe("Notification Configuration", () => {
  it("anon mobile can disable notifications", () => {
    const testStr = `${Math.random().toString(36).substring(18)}!`;

    const setup = {
      isMobile: true,
      device: {
        deviceName: "iPhone 6",
        deviceModel: "as-asdf",
        appIdentifier: "jetzt.franka.affinity",
        appName: "TeamFranka",
        appVersion: "1.0",
        appBuild: "1",
        deviceType: "android",
        installationId: `adsfa${testStr}sdf23`,
        GCMSenderId: "11215447asdfasdfasd3685",
        deviceToken: `PbdmfVZt00nr3${testStr}70xa3nDXRRuI-JD`,
      },
    };
    cy.viewport("iphone-6");
    cy.visit("/", {
      onBeforeLoad: (win) => {
        win.CYPRESS = Object.assign({}, setup);
      },
    });

    cy.get("[data-cy=anon-menu-trigger]").click();
    cy.get("[data-cy=anon-menu]").within(() => {
      cy.get("[data-cy=push-settings-link]").click();
    });

    cy.url().should("match", /settings\/notifications/);

    // Team News is enabled by default
    cy.get("ion-item[data-cy-channel=news] ion-toggle").should(
      "have.attr",
      "aria-checked",
      "true"
    );
    cy.get("ion-item[data-cy-channel=news] ion-toggle").click();
    cy.get("ion-item[data-cy-channel=news] ion-toggle").should(
      "have.attr",
      "aria-checked",
      "false"
    );
    cy.get("ion-item[data-cy-channel=notifications] ion-toggle").should(
      "have.attr",
      "aria-checked",
      "false"
    );
    cy.get("ion-item[data-cy-channel=notifications] ion-toggle").click();
    cy.get("ion-item[data-cy-channel=notifications] ion-toggle").should(
      "have.attr",
      "aria-checked",
      "true"
    );

    /// give it some time
    cy.wait(1000);
    cy.reload({
      onBeforeLoad: (win) => {
        win.CYPRESS = Object.assign({}, setup);
      },
    });
    // they are still like that.
    cy.get("ion-item[data-cy-channel=news] ion-toggle").should(
      "have.attr",
      "aria-checked",
      "false"
    );
    cy.get("ion-item[data-cy-channel=notifications] ion-toggle").should(
      "have.attr",
      "aria-checked",
      "true"
    );
  });
});

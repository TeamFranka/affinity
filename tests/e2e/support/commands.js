import "cypress-localstorage-commands";

const LOGINS = {};

const KEYS = [
  "Parse/APPLICATION_ID/installationId",
  "Parse/APPLICATION_ID/currentUser",
];

Cypress.Commands.add("signUpAsNewUser", ({ user, handleWelcome } = { handleWelcome: true }) => {
  const username = user || `sontaran-${Math.floor(Math.random() * 1000000)}`;

  cy.visit("/news");
  cy.clearNotification();
  cy.get("[data-cy-role=loginModal]").click();
  cy.get("ion-modal").within(() => {
    cy.wait(500);
    cy.get("[data-cy=registerTab]").click();
    cy.get("input[name=email]").should("be.visible");
    cy.get("input[name=email]")
      .clear()
      .type(`${username}@example.org`, { delay: 50 });
    cy.get("input[name=username]").clear().type(username, { delay: 50 });
    cy.get("input[name=password]").clear().type(username, { delay: 50 });
    cy.get("input[name=name]").clear().type(username, { delay: 50 });
    cy.get("ion-button[data-cy-role=registerSubmit]").click();
  });
  cy.get("[data-cy-role=loginModal]").should("not.exist", { timeout: 10000 });

  // handles welcome only if displayed - no assertion
  if (handleWelcome) {
    cy.get('ion-slide + ion-slide ion-button.done')?.click();
  }
  cy.wait(250);
});

Cypress.Commands.add("clearUser", () => {
  for (const key of KEYS) {
    // resetting
    cy.removeLocalStorage(key);
  }
})

Cypress.Commands.add("clearNotification", () => {
  cy.get(".toast-wrapper .toast-button-cancel", {includeShadowDom: true}).click();
})

Cypress.Commands.add("loggedInAs", (username, next) => {
  if (LOGINS[username]) {
    for (const key of KEYS) {
      cy.setLocalStorage(key, LOGINS[username][key]);
    }
    return;
  } else {
    cy.clearUser();
  }

  cy.visit(`/login?username=${username}&next=${next || '/my'}`);
  cy.get("[data-cy-role=loginModal]").should("not.exist", { timeout: 10000 });

  LOGINS[username] = {};
  for (const key of KEYS) {
    cy.getLocalStorage(key).then((value) => {
      LOGINS[username][key] = value;
    });
  }
});

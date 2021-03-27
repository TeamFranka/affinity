import "cypress-localstorage-commands";

const LOGINS = {};

const KEYS = [
  "Parse/APPLICATION_ID/installationId",
  "Parse/APPLICATION_ID/currentUser",
];

Cypress.Commands.add("signUpAsNewUser", (u) => {
  const username = u || `sontaran-${Math.floor(Math.random() * 1000000)}`;

  cy.visit("/news");
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
});

Cypress.Commands.add("loggedInAs", (username) => {
  if (LOGINS[username]) {
    for (const key of KEYS) {
      cy.setLocalStorage(key, LOGINS[username][key]);
    }
    return;
  } else {
    for (const key of KEYS) {
      // resetting
      cy.removeLocalStorage(key);
    }
  }

  cy.visit("/inbox");
  // cy.get('[data-cy-role=userMenu]').should('not.exist');
  // cy.get('[data-cy-role=loginModal]').click();
  cy.get("ion-modal").within(() => {
    cy.wait(1000);
    cy.get("input[name=username]:visible").type(username, { delay: 100 });
    cy.get("input[name=password]:visible").type(username, { delay: 100 });
    cy.get("ion-button[data-cy-role=loginSubmit]").click();
  });
  cy.get("[data-cy-role=loginModal]").should("not.exist", { timeout: 10000 });

  LOGINS[username] = {};
  for (const key of KEYS) {
    cy.getLocalStorage(key).then((value) => {
      LOGINS[username][key] = value;
    });
  }
});

import "cypress-localstorage-commands"

const LOGINS = {};
let CURRENT_USER = null;

const KEYS = ['Parse/APPLICATION_ID/installationId', 'Parse/APPLICATION_ID/currentUser'];

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

    cy.visit('/inbox');
    // cy.get('[data-cy-role=userMenu]').should('not.exist');
    // cy.get('[data-cy-role=loginModal]').click();
    cy.get('ion-modal').within(() => {
        cy.wait(500);
        cy.get('input[name=username]').type(username, {delay: 100});
        cy.get('input[name=password]').type(username, {delay: 100});
        cy.get('ion-button[data-cy-role=loginSubmit]').click();
    });
    cy.get('[data-cy-role=loginModal]').contains('Einloggen').should('not.exist');

    CURRENT_USER = username;
    LOGINS[username] = {};
    for (const key of KEYS) {
        cy.getLocalStorage(key).then(value => {
            LOGINS[username][key] = value
        })
    }
})
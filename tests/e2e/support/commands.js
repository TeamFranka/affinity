// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("loggedInAs", (username) => {
    cy.visit('/inbox');
    // cy.get('[data-cy-role=userMenu]').should('not.exist');
    // cy.get('[data-cy-role=loginModal]').click();
    cy.get('ion-modal').within(() => {
        cy.wait(500);
        cy.get('input[name=username]').type(username, {delay: 100});
        cy.get('input[name=password]').type(username, {delay: 100});
        cy.get('ion-button[data-cy-role=loginSubmit]').click();
    });
    cy.get('[data-cy-role=loginModal]').contains('Einloggen').should('not.exist')
})

Cypress.Commands.add("swipeUp", () => {
  cy.get('.flip-in')
    .trigger('mousedown', {position: "bottom", force: true},)
    .trigger('mousemove', {clientX: 100, clientY: 275})
    .trigger('mouseup', {force: true})
});

Cypress.Commands.add("swipeDown", () => {
  cy.get('.flip-in')
    .trigger('mousedown', {position: "top", force: true})
    .trigger('mousemove', {clientX: 100, clientY: 275})
    .trigger('mouseup', {force: true})
});
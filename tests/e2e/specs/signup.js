/// <reference types="Cypress" />
describe('Sign up', () => {
  it('Applies for membership of default team', () => {
    const username = `sontaran-${Math.floor(Math.random()*  1000000)}`;

    cy.visit('/news');
    cy.get('[data-cy-role=loginModal]').contains('Einloggen').click()
    cy.get('ion-modal').within(() => {
        cy.wait(500);
        cy.get('[data-cy=registerTab]').click();
        cy.get('input[name=email]').should("be.visible");
        cy.get('input[name=email]').clear().type(`${username}@example.org`, {delay: 50});
        cy.get('input[name=username]').clear().type(username, {delay: 50});
        cy.get('input[name=password]').clear().type(username, {delay: 50});
        cy.get('input[name=name]').clear().type(username, {delay: 50});
        cy.get('ion-button[data-cy-role=registerSubmit]').click();
    });
    cy.get('[data-cy-role=loginModal]').contains('Einloggen').should('not.exist');

    cy.visit('/me');

    // Make sure we are a member of the default team
    cy.get('[data-cy=my-teams]').within(() => {
        cy.get('a').should('have.attr', 'href').and('include', '/t/');
    });
  })

  it('and uploads avatar', () => {
    const username = `sontaran-${Math.floor(Math.random()*  1000000)}`;

    cy.visit('/news');
    cy.get('[data-cy-role=loginModal]').contains('Einloggen').click()
    cy.get('ion-modal').within(() => {
        cy.wait(500);
        cy.get('[data-cy=registerTab]').click();
        cy.get('input[name=email]').should("be.visible");
        cy.get('input[name=email]').clear().type(`${username}@example.org`, {delay: 50});
        cy.get('input[name=username]').clear().type(username, {delay: 50});
        cy.get('input[name=password]').clear().type(username, {delay: 50});
        cy.get('input[name=name]').clear().type(username, {delay: 50});
        cy.get('ion-button[data-cy-role=registerSubmit]').click();
    });
    cy.get('[data-cy-role=loginModal]').contains('Einloggen').should('not.exist');

    cy.visit('/me');

    cy.fixture('images/sontaran.jpg', 'base64').then(data => {
      const avatarBlob = Cypress.Blob.base64StringToBlob(data, 'image/jpg');
      return cy.window().then((win) => {
        return Cypress.Blob.blobToDataURL(avatarBlob)
          .then(dataUrl => {
            win.CYPRESS = { nextImage: {dataUrl, format: 'image/jpg'}};
            console.log(win, win.CYPRESS.nextImage);
          });
      })
    });

    cy.get('[data-cy=setAvatar]').click();
    cy.get('[data-role=myAvatar] img').should("have.attr", "src");

  })
})

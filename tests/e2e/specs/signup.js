/// <reference types="Cypress" />
describe("Sign up", () => {
  it("Applies for membership of default team", () => {
    cy.signUpAsNewUser({ handleWelcome: false });

    // check for welcome page
    // check if first slide is visible
    cy.get(".swiper-wrapper").should("exist").should('have.attr', 'style').should('contain', 'transform: translate3d(0px, 0px, 0px)');
    // turn to second slide
    cy.get("[data-cy=welcome-slide1-next-button]").should("exist").click();
    // check if second slide is visible (at least swiped some amount)
    cy.get(".swiper-wrapper").should('have.attr', 'style')
      .should((style) => {
        const translate = style.match(/.*translate3d\(-(\d+)px.*/);
        expect(+translate[1]).to.be.greaterThan(0);
      });

    // check for torchwood main team and join
    cy.get('a[href="/t/torchwood"] + .header-content > ion-chip.join').should('exist').click();
    // check for torchwood main team and leave
    cy.get('a[href="/t/torchwood"] + .header-content > ion-chip:not(.join)').should('exist').click();

    // check for doctor-who subteam and join
    cy.get('ion-card-header:has( > a[href="/t/doctor-who"]) + ion-card-content > ion-chip.join').should('exist').first().click();
    // check for doctor-who subteam and leave
    cy.get('ion-card-header:has( > a[href="/t/doctor-who"]) + ion-card-content > ion-chip.leave').should('exist').first().click();
    // finish welcome dialog
    cy.get('ion-slide + ion-slide ion-button.done').should('exist').click();

    // go to profile
    cy.visit("/my");
    // and route to the team listing
    cy.get("[data-cy-role=myTeams]").click();

    // FEXME: User is not removed from subteam when removed from main team. Bug #231 - has to be fixed that this test succeeds
    // cy.get("[data-cy-role=teamLink]").should("have.length", 1);
    cy.get("[data-cy-team=doctor-who]").click();

    // and we are able to leave it
    cy.url().should("include", "/t/doctor-who");
    cy.get("[data-cy-role=leave]").should("exist");
  });
});

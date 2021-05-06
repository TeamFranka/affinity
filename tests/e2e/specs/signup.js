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
    cy.get('ion-card-header:has( > a[href="/t/doctor-who"]) + ion-card-content > ion-chip.join').should('exist').click();
    // check for doctor-who subteam and leave
    cy.get('ion-card-header:has( > a[href="/t/doctor-who"]) + ion-card-content > ion-chip.leave').should('exist').click();
    // finish welcome dialog
    cy.get('ion-slide + ion-slide ion-button.done').should('exist').click();

    // go to profile
    cy.visit("/me");

    // Make sure we are a member of the default team
    cy.get("[data-cy=my-teams]").within(() => {
      cy.get("a").should("have.attr", "href").and("include", "/t/");
    });
  });
});

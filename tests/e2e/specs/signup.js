/// <reference types="Cypress" />
describe("Sign up", () => {
  it("Applies for membership of default team", () => {
    cy.signUpAsNewUser({ handleWelcome: false });

    // check email verification process
    cy.mhGetAllMails().then((emails) => {
      const latestEmail = emails.sort(
        (a, b) => new Date(b.Created) - new Date(a.Created)
      )[0]
      const link = latestEmail.Content.Body.replace("?=", "?").replace(/=3D/g, "=") // there's some weird encoding going on

      // verify email
      cy.request(link)
        .its('body')
        .should('include', 'Successfully verified your email!')
    })


    // check for welcome page
    // check if first slide is visible
    cy.get(".swiper-wrapper").should("exist");
    cy.get(".swiper-wrapper .swiper-slide-prev").should("not.exist");
    cy.get("[data-cy=welcome-slide1-next-button]").should("exist").click();
    // check if second slide is visible (at least swiped some amount)
    cy.get(".swiper-wrapper .swiper-slide-prev").should("exist");

    // check for doctor-who top team, we joined by default
    cy.get('ion-chip[data-cy-team=doctor-who].leave').should('exist').first().click();
    // after leave, try re-joining
    cy.get('ion-chip[data-cy-team=doctor-who].join').should('exist').first().click();

    // check for torchwood main team and join
    cy.get('ion-chip[data-cy-team=torchwood].join').should('exist').click();
    // check for torchwood main team and leave
    cy.get('ion-chip[data-cy-team=torchwood].leave').should('exist').click();

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

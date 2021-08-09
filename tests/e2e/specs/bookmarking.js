describe("Bookmarking", () => {
  it("works", () => {

    cy.signUpAsNewUser();
    cy.visit("/feed");

    cy.get("[data-cy-type=activity]:nth(5) [data-cy-role=bookmarked]").should("not.exist");
    cy.get("[data-cy-type=activity]:nth(5) [data-cy-role=extra]").click();
    cy.get("ion-popover [data-cy-role=bookmark]").click();
    cy.get("[data-cy-type=activity]:nth(5) [data-cy-role=bookmarked]").should("exist");

    cy.get("[data-cy-type=activity]").last().scrollIntoView()

    cy.get("[data-cy-type=activity]:nth(15) [data-cy-role=bookmarked]").should("not.exist");
    cy.get("[data-cy-type=activity]:nth(15) [data-cy-role=extra]").click();
    cy.get("ion-popover [data-cy-role=bookmark]").click();
    cy.get("[data-cy-type=activity]:nth(15) [data-cy-role=bookmarked]").should("exist");

    cy.visit("/my");
    cy.get("[data-cy-role=bookmarks]").click();
    cy.get("[data-cy-type=activity]").should("have.length", 2);
  });
});

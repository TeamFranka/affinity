/// <reference types="Cypress" />
describe("User Profile", () => {
  before(() => {
    cy.signUpAsNewUser();
  });

  it("can change avatar", () => {
    cy.visit("/me");

    cy.fixture("images/sontaran.jpg", "base64").then((data) => {
      const avatarBlob = Cypress.Blob.base64StringToBlob(data, "image/jpg");
      return cy.window().then((win) => {
        return Cypress.Blob.blobToDataURL(avatarBlob).then((dataUrl) => {
          win.CYPRESS = { nextImage: { dataUrl, format: "image/jpg" } };
          console.log(win, win.CYPRESS.nextImage);
        });
      });
    });

    cy.get("[data-cy=setAvatar]").click();
    cy.get("[data-role=myAvatar] img").should("have.attr", "src");
  });
});

/// <reference types="Cypress" />
describe("User Profile", () => {
  beforeEach(() => {
    // we create a new user
    cy.signUpAsNewUser()
  });

  it("can change details", () => {
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
    // trying avatar
    cy.get("[data-cy=setAvatar]").click();
    cy.get("[data-cy-role=avatar] img").should("have.attr", "src");

    // name
    const testStr = `User Name ${Math.random().toString(36).substring(7)}!`;
    cy.visit("/me");
    cy.get("[data-cy=title] [data-cy-role=editModal]").click();
    cy.get("ion-modal").within(() => {
      cy.wait(500);
      cy.get("[data-cy-role=edit] input").clear();
      cy.wait(500);
      cy.get("[data-cy-role=edit] input").type(testStr);
      cy.get("[data-cy-role=submit]").first().click();
    });

    cy.get("[data-cy=title]").should("contain", testStr);

    // user Bio
    const testDesc = `User Bio ${Math.random()
      .toString(36)
      .substring(7)}!`;
    cy.visit("/me");
    cy.get("[data-cy=info] [data-cy-role=editModal]").click();
    cy.get("ion-modal").within(() => {
      cy.wait(500);
      cy.get("[data-cy=richEditor]").clear();
      cy.wait(500);
      cy.get("[data-cy=richEditor]").type(testDesc);
      cy.get("[data-cy-role=submit]").first().click();
    });

    cy.get("[data-cy=info]").should("contain", testDesc);


    cy.fixture("images/background.jpg", "base64").then((data) => {
      const blob = Cypress.Blob.base64StringToBlob(data, "image/jpg");
      return cy.window().then((win) => {
        return Cypress.Blob.blobToDataURL(blob).then((dataUrl) => {
          win.CYPRESS = { nextImage: { dataUrl, format: "image/jpg" } };
          console.log(win, win.CYPRESS.nextImage);
        });
      });
    });
    // trying avatar
    cy.get("[data-cy=setBackground]").click();
    cy.get("profile-card .header").should("have.css", "backgroundImage", /url(.*)/g);


    // let's make sure it persistet
    cy.reload();
    cy.get("[data-cy-role=avatar] img").should("have.attr", "src");
    cy.get("[data-cy=title]").should("contain", testStr);
    cy.get("[data-cy=info]").should("contain", testDesc);
    cy.get("profile-card .header").should("have.css", "backgroundImage", /url(.*)/g);
  });
});

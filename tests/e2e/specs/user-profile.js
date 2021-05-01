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
    // trying background
    cy.get("[data-cy=setBackground]").click();
    cy.get(".header")
      .should("have.css", "background")
      .and("match", /url/g);

    cy.get("[data-cy=socialLinks] [data-cy-role=editModal]").click();
    cy.get("ion-modal").within(() => {
      cy.wait(500);
      cy.get("[data-cy=add]").click();
      cy.get("[data-cy-role=title-0]").type("Website");
      cy.get("[data-cy-role=url-0] input").clear().type("https://www.doctorwho.tv");
      cy.get("[data-cy=add]").click();
      cy.get("[data-cy-role=title-1]").type("Instagram");
      cy.get("[data-cy-role=url-1] input").clear().type("https://instagram.com/doctorwho");
      cy.get("[data-cy-role=submit]").first().click();
    });

    cy.get("[data-cy=socialLinks] li:first a").should("have.attr", "href", "https://www.doctorwho.tv");
    cy.get("[data-cy=socialLinks] li:last a").should("have.attr", "href", "https://instagram.com/doctorwho");

    // let's make sure it persistet
    cy.reload();
    cy.get("[data-cy-role=avatar] img").should("have.attr", "src");
    cy.get("[data-cy=title]").should("contain", testStr);
    cy.get("[data-cy=info]").should("contain", testDesc);

    cy.get("[data-cy=socialLinks] li:first a").should("have.attr", "href", "https://www.doctorwho.tv");
    cy.get("[data-cy=socialLinks] li:last a").should("have.attr", "href", "https://instagram.com/doctorwho");

    cy.get(".header")
      .should("have.css", "background")
      .and("match", /url/g);
  });
});

/// <reference types="Cypress" />
describe('Notification Configuration', () => {

  it('anon mobile can disable notifications', () => {

    const testStr = `${Math.random().toString(36).substring(18)}!`;
    cy.viewport("iphone-6");
    cy.visit('/', {
        onBeforeLoad: (win) => {
            console.log(win);
            win.CYPRESS = { isMobile: true, device: {
                    "deviceName": "iPhone 6",
                    "deviceModel": "as-asdf",
                    "appIdentifier": "jetzt.franka.affinity",
                    "appName": "TeamFranka",
                    "appVersion": "1.0",
                    "appBuild": "1",
                    "deviceType": "android",
                    "installationId": `adsfa${testStr}sdf23`,
                    "GCMSenderId": "11215447asdfasdfasd3685",
                    "deviceToken": `PbdmfVZt00nr3${testStr}70xa3nDXRRuI-JD`,
                }
            };
        }
    });

    cy.get('[data-cy=anon-menu-trigger]').click();
    cy.get('[data-cy=anon-menu]').within(() => {
        cy.get('[data-cy=push-settings-link]').click();
    })
  })
})

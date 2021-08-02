/// <reference types="Cypress" />

describe('Posts from subteams', () => {
  it('shows up in the feed even when only subscribed to the parent team', () => {
    cy.loggedInAs('river') // post from main team
    cy.visit('/feed')
    cy.get('[data-cy=newPost] [data-cy=richEditor]').type(
      'This is a news post from the main team.'
    )
    cy.get('[data-cy=newPost] [data-cy-role=editSettings] ion-button')
      .first()
      .click()
    cy.get('[data-cy-role=selectType]').first().click()
    cy.get('[data-cy-select=announce]').first().click()
    cy.get('[data-cy=newPost] [data-cy-role=submit]').first().click()

    cy.loggedInAs('graham') // post from sub team
    cy.visit('/feed')
    cy.get('[data-cy=newPost] [data-cy=richEditor]').type(
      'This is a news post from a sub team.'
    )
    cy.get('[data-cy=newPost] [data-cy-role=editSettings] ion-button')
      .first()
      .click()
    cy.get('[data-cy=selectTeam]').first().click()
    cy.get('[data-cy=selectTeam-team-earth]').first().click()
    cy.get('[data-cy-role=selectType]').first().click()
    cy.get('[data-cy-select=announce]').first().click()
    cy.get('[data-cy=newPost] [data-cy-role=submit]').first().click()

    cy.loggedInAs('gwen') // post from different team
    cy.visit('/feed')
    cy.get('[data-cy=newPost] [data-cy=richEditor]').type(
      'This is a news post from a different team.'
    )
    cy.get('[data-cy=newPost] [data-cy-role=editSettings] ion-button')
      .first()
      .click()
    cy.get('[data-cy=selectTeam]').first().click()
    cy.get('[data-cy=selectTeam-torchwood]').first().click()
    cy.get('[data-cy-role=selectType]').first().click()
    cy.get('[data-cy-select=announce]').first().click()
    cy.get('[data-cy=newPost] [data-cy-role=submit]').first().click()

    cy.loggedInAs('clara') // subscribed to main team
    cy.visit('/feed')
    cy.contains('This is a news post from the main team.')
    cy.contains('This is a news post from a sub team.')
    cy.should('not.contain', 'This is a news post from a different team.')
  })
})

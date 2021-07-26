/// <reference types="Cypress" />
describe('In-App notification', () => {
  const post = 'This is a test, please interact with this post!'
  const comment =
    "Hi, yes, I am replying to your post! Can you read this? I'm going to make this comment a little bit longer so you can test how you can expand and collapse comment previews in the notification tab!"

  before(() => {
    // create a post
    cy.loggedInAs('clara')
    cy.visit('/feed')
    cy.get('[data-cy=newPost]').within(() => {
      cy.get('[data-cy=richEditor]').type(post)
      cy.get('[data-cy-role=submit]').first().click()
    })

    // react to post
    cy.loggedInAs('yaz')
    cy.visit('/feed')
    cy.get('[data-cy-verb=post]')
      .first()
      .within(() => {
        // like
        cy.get('[data-cy-role=like]').click()

        // comment
        cy.get('[data-cy-role=toggleComments]').click()
        cy.get('[data-cy=comment]>ion-input').type(comment)
        cy.get('[data-cy=comment]>ion-button').click()

        // emoji reaction
        cy.get('[data-cy=reaction]').click()
      })
    cy.get('.emoji').first().click()
    cy.wait(500)
  })

  it('shows up for interactions with posts', () => {
    cy.loggedInAs('clara')
    cy.visit('/inbox')

    // unread notifications should be highlighted
    cy.contains('Notifications (3)').click({ force: true })
    cy.get('.unread').should('have.length', 3)

    // ... and marked as read after a short while
    cy.wait(1000)
    cy.contains('Notifications (3)').should('not.exist')
    cy.get('.unread').should('have.length', 0)

    // each notification should come with a preview of the original post
    cy.contains(post)

    // expand comment preview
    cy.contains(comment.substr(0, 50)).first().click()
    cy.contains(comment)

    // TODO (if possible): new notifications should appear automatically
  })
})

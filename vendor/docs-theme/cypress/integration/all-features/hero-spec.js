// / <reference types="cypress" />

beforeEach(() => {
  cy.visit('/hero/');
});

describe('Hero banner', () => {
  it('Should look like expected', () => {
    cy.get('.hero-banner').should('be.visible').matchImageSnapshot();
  });
});

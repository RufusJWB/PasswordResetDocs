// / <reference types="cypress" />

beforeEach(() => {
  cy.visit('/sit/');
});

describe('Siemens UI icons', () => {
  it('Should look like expected', () => {
    cy.get('.md-content__inner > :nth-child(18)').should('be.visible').matchImageSnapshot();
  });
});

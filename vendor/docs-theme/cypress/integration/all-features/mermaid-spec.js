// / <reference types="cypress" />

beforeEach(() => {
  cy.visit('/quam/');
});

describe('Mermaid diagram', () => {
  it('Should look like expected', () => {
    cy.get('div.mermaid:nth-child(14)')
        .should('be.visible')
        .matchImageSnapshot();
  });
});

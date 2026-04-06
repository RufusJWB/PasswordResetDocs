// / <reference types="cypress" />

context('Window', () => {
  beforeEach(() => {
    cy.visit('/erat/');
  });

  it('cy.window() - get the global window object', () => {
    cy.window().should('have.property', 'top');
  });

  it('cy.document() - get the document object', () => {
    cy.document().its('contentType')
        .should('eq', 'text/html');
    cy.document().should('have.property', 'charset')
        .and('eq', 'UTF-8');
  });
});

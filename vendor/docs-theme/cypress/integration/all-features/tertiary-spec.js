// / <reference types="cypress" />

beforeEach(() => {
  cy.visit('/');
});

describe('Tertiary navigation', () => {
  describe(`With viewport 1220 720 and scroll position 0`, () => {
    it(`Contains all top section links`, () => {
      cy.get('.main-nav--active').contains('Lorem').should('be.visible');
      cy.get('#siemens-header-container > [href=\'dolor/\']').contains('Ipsum').should('be.visible');
      cy.get('[href=\'erat/\']').contains('Dapibus').should('be.visible');
      cy.get('#siemens-header-container').matchImageSnapshot();
    });
  });

  describe(`With viewport 1220 720 and scroll position 700`, () => {
    it(`Contains all top section links`, () => {
      cy.scrollTo(0, 700);
      cy.get('.main-nav--active').contains('Lorem').should('be.visible');
      cy.get('#siemens-header-container > [href=\'dolor/\']').contains('Ipsum').should('be.visible');
      cy.get('#siemens-header-container > [href=\'erat/\']').contains('Dapibus').should('be.visible');
      cy.get('#siemens-header-container').matchImageSnapshot();
    });
  });

  describe(`With viewport 979 700 and scroll position 0`, () => {
    it(`Contains no section links but a hamburger`, () => {
      cy.viewport(979, 700);
      cy.get('.main-nav--active').contains('Lorem').should('not.be.visible');
      cy.get('#siemens-header-container > [href=\'dolor/\']').contains('Ipsum').should('not.be.visible');
      cy.get('#siemens-header-container > [href=\'erat/\']').contains('Dapibus').should('not.be.visible');
      cy.get('.main-nav > label').should('be.visible');
      cy.get('#siemens-header-container').matchImageSnapshot();
    });

    it(`Shows all top sections in the mobile nav when clicking the hamburger`, () => {
      cy.viewport(979, 700);
      cy.get('.main-nav--active').contains('Lorem').should('not.be.visible');
      cy.get('#siemens-header-container > [href=\'dolor/\']').contains('Ipsum').should('not.be.visible');
      cy.get('#siemens-header-container > [href=\'erat/\']').contains('Dapibus').should('not.be.visible');
      cy.get('.main-nav > label').should('be.visible');
      cy.get('.main-nav > label').click();
      cy.get('.main-nav').should('be.visible');
      cy.get('.main-nav').matchImageSnapshot();
    });
  });

  describe(`With viewport 979 700 and scroll position 700`, () => {
    it(`Shows all top sections in the top mobile nav when clicking the hamburger`, () => {
      cy.viewport(979, 700);
      cy.scrollTo(0, 700);
      cy.get('.main-nav > label').should('be.visible');
      cy.get('.main-nav > label').click();
      cy.get('.main-nav').should('be.visible');
      cy.get('.main-nav--active').should('be.visible');
      cy.get('#siemens-header-container > [href=\'dolor/\']').should('be.visible');
      cy.get('#siemens-header-container > [href=\'erat/\']').should('be.visible');
      cy.get('.main-nav').matchImageSnapshot();
    });
  });
});

// / <reference types="cypress" />

beforeEach(() => {
  cy.visit('/dolor');
  cy.viewport(959, 700);
});

describe('Mobile navigation', () => {
  describe(`With viewport 959 700 and scroll position 0`, () => {
    it(`Shows the current section`, () => {
      cy.get('.md-tabbar-search-container__title').contains('Ipsum').should('be.visible');
      cy.get('.md-tabbar-search-container').matchImageSnapshot();
    });

    it(`Opens the navigation pane when clicked`, () => {
      cy.get('.md-tabbar-search-container__title').click();
      cy.get('.md-nav--primary > :nth-child(1)').should('be.visible').matchImageSnapshot();
    });

    it(`Shows links and TOC icons`, () => {
      cy.get('.md-tabbar-search-container__title').click();
      cy.get(
        Cypress.env('CYPRESS_SUITE') === 'all-features' ?
          '.md-nav--primary > :nth-child(1) > :nth-child(1)' :
          '.md-nav--primary > :nth-child(1) > :nth-child(2) > :nth-child(3) > :nth-child(2) > :nth-child(1)',
      ).should('be.visible')
          .matchImageSnapshot(`Mobile navigation -- Shows links and TOC icons -- link`);
      cy.get('.md-nav--primary > :nth-child(1)').should('be.visible')
          .matchImageSnapshot('Mobile navigation -- Shows links and TOC icons -- pane');
    });
  });
});

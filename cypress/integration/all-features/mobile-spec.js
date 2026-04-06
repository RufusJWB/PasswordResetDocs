// / <reference types="cypress" />

beforeEach(() => {
  cy.visit('/dolor');
});

describe('Mobile navigation', () => {
  describe(`With viewport 959 700 and scroll position 0`, () => {
    beforeEach(() => {
      cy.viewport(959, 700);
    });

    it(`Shows TOC when TOC icon is clicked`, () => {
      cy.get('.md-tabbar-search-container__title').click();
      cy.get('label.md-nav__link > .md-nav__icon').click();
      cy.get('.md-nav__item--active > .md-nav > .md-nav__title')
          .contains('Table of contents')
          .should('be.visible')
          .matchImageSnapshot('Mobile navigation -- Shows TOC when TOC icon is clicked -- Table of contents');
      cy.get('.md-nav__item--active > .md-nav > .md-nav__list')
          .should('be.visible')
          .matchImageSnapshot('Mobile navigation -- Shows TOC when TOC icon is clicked -- TOC items');
    });
  });

  describe(`With viewport 960 700 and scroll position 0`, () => {
    beforeEach(() => {
      cy.viewport(960, 700);
    });

    it(`Hides TOC icon`, () => {
      cy.get('.md-tabbar-search-container__title').click();
      cy.get('label.md-nav__link > .md-nav__icon').should('not.be.visible');
      cy.get('.md-nav--primary > .md-nav__list')
          .should('be.visible')
          .matchImageSnapshot('Mobile navigation -- Hides TOC -- Nav items');
    });
  });
});

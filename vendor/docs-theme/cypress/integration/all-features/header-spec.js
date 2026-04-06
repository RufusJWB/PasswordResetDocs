// / <reference types="cypress" />

const viewports = [
  [1220, 720],
  [979, 700],
  [959, 700],
];

const scrollPositions = [
  [0, 0],
  [0, 700],
];

beforeEach(() => {
  cy.visit('/erat/');
});

describe('The header', () => {
  viewports.forEach((size) => {
    scrollPositions.forEach((position) => {
      describe(`With viewport ${size} and scroll position ${position}`, () => {
        beforeEach(() => {
          cy.viewport(size[0], size[1]);
          cy.scrollTo(position[0], position[1]);
          cy.wait(1000);
        });

        it(`Contains a logo`, () => {
          cy.get('a.logo').should('be.visible');
          cy.get('.main-nav').matchImageSnapshot();
        });

        it(`Contains nav and search`, () => {
          cy.get(
              '.md-tabbar-search-container > .md-grid > .md-tabs > .md-tabs__list > :nth-child(1) > .md-tabs__link',
          ).contains('Amet');
          cy.get('.md-search__input');
          cy.get('.md-tabbar-search-container').matchImageSnapshot();
        });
      });
    });
  });

  it('Should render the search correctly', () => {
    cy.viewport(viewports[0][0], viewports[0][1]);
    cy.get('.md-search__input').first().type('erat');
    cy.get('.md-search__input').first().should('have.value', 'erat');
    cy.get('.md-search-result__meta').matchImageSnapshot({padding: [44, 0, 0]});
  });

  it('Should hide the search input on smaller screens', () => {
    cy.viewport(viewports[2][0], viewports[2][1]);
    cy.get('.md-search__input').should('not.be.visible');
    cy.get('.md-tabbar-search-container').matchImageSnapshot();
  });
});

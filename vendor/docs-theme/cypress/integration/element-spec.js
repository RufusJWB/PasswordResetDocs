// / <reference types="cypress" />

beforeEach(() => {
  cy.visit('/quam/');
});

const elements = [
  ['Code snippet', '.md-content__inner > :nth-child(7)'],
  ['Community button', '.md-content__inner > .md-community-button'],
];

const sections = [
  ['Header', '.main-nav'],
  ['Search bar', '.md-tabbar-search-container'],
];

describe('Content element', () => {
  elements.forEach((element) => {
    describe(element[0], () => {
      it('Should look like expected', () => {
        cy.get(element[1]).should('be.visible')
            .matchImageSnapshot({
              padding: [150, 0, 0],
              clip: {x: 0, y: 150, width: 1000, height: 720},
            });
      });
    });
  });
});

describe('Section', () => {
  sections.forEach((section) => {
    describe(section[0], () => {
      it('Should look like expected', () => {
        cy.get(section[1]).should('be.visible')
            .matchImageSnapshot('Section -- ' + section[0]);
      });
    });
  });
});

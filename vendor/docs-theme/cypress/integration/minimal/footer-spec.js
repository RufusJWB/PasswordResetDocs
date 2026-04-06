// / <reference types="cypress" />

const viewports = [
  [1220, 720],
  [979, 700],
  [550, 700],
];

beforeEach(() => {
  cy.visit('/dapibus/');
});

describe('The footer', () => {
  viewports.forEach((size) => {
    describe(`With viewport ${size}`, () => {
      beforeEach( () => {
        cy.viewport(size[0], size[1]);
        cy.scrollTo(0, 3000);
      });

      it(`Correctly aligns elements without social icons`, () => {
        cy.get('.md-footer-meta').should('be.visible').matchImageSnapshot();
      });
    });
  },
  );
});

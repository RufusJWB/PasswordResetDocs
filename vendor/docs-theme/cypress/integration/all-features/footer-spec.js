// / <reference types="cypress" />

const viewports = [
  [1220, 720],
  [979, 700],
  [550, 700],
];

describe('The footer', () => {
  viewports.forEach((size) => {
    describe(`With viewport ${size}`, () => {
      beforeEach( () => {
        cy.visit('/dapibus/');
        cy.viewport(size[0], size[1]);
        cy.scrollTo(0, 3000);
      });

      it(`Correctly aligns elements with social icons`, () => {
        cy.get('.md-footer-meta').should('be.visible').matchImageSnapshot();
      });
    });
  },
  );

  describe(`On desktop`, () => {
    beforeEach( () => {
      cy.viewport(1920, 1080);
    });

    it(`Shows correctly with narrow content`, () => {
      cy.visit('/width/');
      cy.get('.md-footer__inner').should('be.visible').matchImageSnapshot();
    });
  });
});

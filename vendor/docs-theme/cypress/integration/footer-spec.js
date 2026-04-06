// / <reference types="cypress" />

const viewports = [
  [1220, 720],
  [979, 700],
  [550, 700],
];
const footerButton = ':nth-child(1) > nav > ul > :nth-child(1) > .footer-siemens__link-topic';
const footerLink = 'https://pretium.tempus.com/pretium-ops/elit-theme';

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

      it(`Shows the footer navigation when viewport is ${size}`, () => {
        cy.get('.footer-siemens').should('be.visible').matchImageSnapshot();
      });

      it(`Shows previous page button when viewport is ${size}`, () => {
        cy.get('.md-footer__link--prev').should('be.visible').matchImageSnapshot();
      });

      it(`Shows next page button when viewport is ${size}`, () => {
        cy.get('.md-footer__link--next').should('be.visible').matchImageSnapshot();
      });

      it(`Shows footer links when viewport is ${size}`, () => {
        cy.get('.footer-siemens > :nth-child(1) > .footer-siemens-title').should('be.visible').matchImageSnapshot();
      });

      it(`Shows legal infos when viewport is ${size}`, () => {
        cy.get('.md-copyright').should('be.visible').matchImageSnapshot();
      });

      it(`Has clickable footer link when viewport is ${size}`, () => {
        const btn = () => cy.get(footerButton);
        btn().should('have.prop', 'href').and('equal', footerLink);
        btn().should('have.attr', 'target').and('equal', '_blank');
      });
    });
  },
  );
});

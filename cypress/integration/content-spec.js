// / <reference types="cypress" />

const viewports = [
  [1220, 720],
  [979, 700],
  [959, 700],
];

const scrollPositions = [
  [0, 0],
  [0, 1000],
];

beforeEach(() => {
  cy.visit('/dapibus/');
});

describe('The content area', () => {
  scrollPositions.forEach((position) => {
    describe(`With viewport ${viewports[0]}`, () => {
      beforeEach(() => {
        cy.viewport(viewports[0][0], viewports[0][1]);
        cy.scrollTo(position[0], position[1]);
      });

      it(`Shows primary navigation when position is ${position}`, () => {
        cy.wait(500);
        cy.get('.md-sidebar--primary > .md-sidebar__scrollwrap')
            .should('be.visible')
            .matchImageSnapshot();
      });

      it(`Shows table of contents when position is ${position}`, () => {
        cy.get('.md-sidebar--secondary > .md-sidebar__scrollwrap > .md-sidebar__inner > .md-nav')
            .should('be.visible')
            .matchImageSnapshot();
      });
    },
    );

    describe(`With viewport ${viewports[1]}`, () => {
      beforeEach(() => {
        cy.viewport(viewports[1][0], viewports[1][1]);
        cy.scrollTo(position[0], position[1]);
      });

      it(`Hides primary navigation when position is ${position}`, () => {
        cy.get('.md-sidebar--primary > .md-sidebar__scrollwrap')
            .should('not.be.visible');
      });

      it(`Shows table of contents when position is ${position}`, () => {
        cy.get('.md-sidebar--secondary > .md-sidebar__scrollwrap > .md-sidebar__inner > .md-nav')
            .should('be.visible')
            .matchImageSnapshot();
      });
    },
    );

    describe(`With viewport ${viewports[2]}`, () => {
      beforeEach(() => {
        cy.viewport(viewports[2][0], viewports[2][1]);
        cy.scrollTo(position[0], position[1]);
      });

      it(`Hides primary navigation when position is ${position}`, () => {
        cy.get('.md-sidebar--primary > .md-sidebar__scrollwrap')
            .should('not.be.visible');
      });

      it(`Hides table of contents when position is ${position}`, () => {
        cy.get('.md-sidebar--secondary > .md-sidebar__scrollwrap > .md-sidebar__inner > .md-nav')
            .should('not.be.visible');
      });
    },
    );
  });

  viewports.forEach((size) => {
    describe(`With viewport ${size}`, () => {
      beforeEach(() => {
        cy.viewport(size[0], size[1]);
      });

      it('Shows the content', () => {
        cy.get('.md-content').should('be.visible').matchImageSnapshot();
      });
    });
  });
});

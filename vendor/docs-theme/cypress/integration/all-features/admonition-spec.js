// / <reference types="cypress" />

const admonitionElements = [
  ['With default icons', '.md-content__inner > :nth-child(6)'],
  ['With details', '[open="open"]'],
];

const snapshotOptions = {
  padding: [150, 0, 0],
  clip: {x: 0, y: 150, width: 720, height: 300},
};

describe('Siemens Brand admonitions', () => {
  beforeEach(() => {
    cy.visit('/admonitions/');
  });

  admonitionElements.forEach((element) => {
    describe(element[0], () => {
      it('Should look like expected', () => {
        cy.get(element[1])
            .should('be.visible')
            .matchImageSnapshot('Admonitions -- ' + element[0], snapshotOptions);
      });
    });
  });
});

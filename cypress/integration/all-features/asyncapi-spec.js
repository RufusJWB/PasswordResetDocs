// / <reference types="cypress" />

const bundleLoadTime = 500;

const elements = [
  ['API title', '.text-4xl'],
  ['Introduction buttons', '#introduction > .flex'],
  ['Introduction prose', '#introduction > .mt-4 > .prose'],
  ['Servers', '#servers'],
  ['Operations title', '#operations > .\\32 xl\\:w-7\\/12'],
  ['Operation', '#operation-receive-receiveLightMeasurement > :nth-child(1) > :nth-child(1)'],

  ['Operation accepts title', '#operation-receive-smartylighting\\.streetlights\\.1\\.0\\.event\\.' +
  '\\{streetlightId\\}\\.lighting\\.measured-message > :nth-child(1) > p.px-8'],

  ['Operation accepts', '#operation-receive-smartylighting\\.streetlights\\.1\\.0\\.event\\.' +
  '\\{streetlightId\\}\\.lighting\\.measured-message > :nth-child(1) > :nth-child(2) > .panel-item > ' +
  '.panel-item--center > .shadow'],

  ['Operation example', '#operation-receive-smartylighting\\.streetlights\\.1\\.0\\.event\\.' +
  '\\{streetlightId\\}\\.lighting\\.measured-message > :nth-child(1) > :nth-child(2) > .panel-item > ' +
  '.panel-item--right > .bg-gray-800'],

  ['Messages title', '#messages > .\\32 xl\\:w-7\\/12'],
  ['Message', '#message-dimLight > .panel-item > .panel-item--center > .shadow'],
  ['Schemas title', '#schemas > .\\32 xl\\:w-7\\/12'],
  ['Schema', '#schema-sentAt > :nth-child(1) > .panel-item--center > .shadow'],
  ['Burger Menu', '.burger-menu'],
];

const snapshotOptions = {
  padding: [99, 0, 0],
  clip: {x: 0, y: 99, width: 1000, height: 1000},
};

const testTitle = 'Should look as expected on ';

describe('AsyncAPI element', () => {
  beforeEach(() => {
    cy.visit('/api/asyncapi/');
    // wait for external async api bundle to be loaded
    cy.wait(bundleLoadTime);
  });

  elements.forEach((element) => {
    describe(element[0], () => {
      it(testTitle, () => {
        cy.get(element[1]).should('be.visible');
        cy.scrollTo(0, 250);
        cy.get(element[1]).matchImageSnapshot(snapshotOptions);
      });
    });
  },
  );
});

const clickElements = [
  ['Payload',
    '#operation-receive-smartylighting\\.streetlights\\.1\\.0\\.event\\.\\{streetlightId\\}\\.lighting' +
    '\\.measured-message > :nth-child(1) > :nth-child(2) > .panel-item > .panel-item--center > .shadow > ' +
    ':nth-child(4) > :nth-child(1) > :nth-child(1) > .min-w-1\\/4 > .focus\\:outline-none',
    '#operation-receive-smartylighting\\.streetlights\\.1\\.0\\.event\\.\\{streetlightId\\}\\.lighting' +
    '\\.measured-message > :nth-child(1) > :nth-child(2) > .panel-item > .panel-item--center > .shadow'],

  ['Headers',
    '#operation-receive-smartylighting\\.streetlights\\.1\\.0\\.event\\.\\{streetlightId\\}\\.lighting\\.measured-message > ' +
  ':nth-child(1) > :nth-child(2) > .panel-item > .panel-item--center > .shadow > :nth-child(5) > :nth-child(1) > :nth-child(1) > ' +
  '.min-w-1\\/4 > .focus\\:outline-none > div.inline-block > .break-anywhere',
    '#operation-receive-smartylighting\\.streetlights\\.1\\.0\\.event\\.\\{streetlightId\\}\\.lighting\\.measured-message > ' +
  ':nth-child(1) > :nth-child(2) > .panel-item > .panel-item--center > .shadow > :nth-child(5) > :nth-child(1) > .p-4'],

  ['Operation information',
    ':nth-child(9) > :nth-child(1) > :nth-child(1) > :nth-child(1) > .focus\\:outline-none',
    ':nth-child(9) > :nth-child(1) > .p-4'],

  ['Examples payload',
    '#operation-receive-smartylighting\\.streetlights\\.1\\.0\\.event\\.\\{streetlightId\\}\\.lighting' +
    '\\.measured-message > :nth-child(1) > :nth-child(2) > .panel-item > .panel-item--right > .bg-gray-800 ' +
    '> :nth-child(2) > :nth-child(1) > .undefined > div.inline-block > .inline-block',
    '.block > .mt-4 > .prose > pre'],

  ['Examples header',
    '#operation-receive-smartylighting\\.streetlights\\.1\\.0\\.event\\.\\{streetlightId\\}\\.lighting' +
    '\\.measured-message > :nth-child(1) > :nth-child(2) > .panel-item > .panel-item--right > .bg-gray-800 ' +
    '> :nth-child(3) > :nth-child(1) > .undefined > div.inline-block > .inline-block',
    '#operation-receive-smartylighting\\.streetlights\\.1\\.0\\.event\\.\\{streetlightId\\}\\.lighting' +
    '\\.measured-message > :nth-child(1) > :nth-child(2) > .panel-item > .panel-item--right > .bg-gray-800 > ' +
    ':nth-child(3)'],
  ['Menu',
    '.burger-menu',
    '.sidebar--content > .relative'],
];

describe('Clicked AsyncAPI element', () => {
  beforeEach(() => {
    cy.visit('/api/asyncapi/');
    // wait for external async api bundle to be loaded
    cy.wait(bundleLoadTime);
  });

  clickElements.forEach((element) => {
    describe(element[0], () => {
      it(testTitle, () => {
        cy.get(element[1])
            .click()
            .get(element[2])
            .should('be.visible')
            .matchImageSnapshot(snapshotOptions);

        cy.get(element[1]).click();
      });
    });
  },
  );
});

describe('AsyncAPI integration with sidebars from mkdocs', () => {
  beforeEach(() => {
    cy.visit('/semper/');
    cy.scrollTo(0, 250);
    // wait for external async api bundle to be loaded
    cy.wait(bundleLoadTime);
  });

  it('Should be visible', () => {
    cy.get('#asyncapi')
        .should('be.visible');
    cy.get('.md-sidebar--primary')
        .should('be.visible')
        .matchImageSnapshot('Primary mkdocs siedebar');
    cy.get('#introduction')
        .should('be.visible')
        .matchImageSnapshot('Introduction');
    cy.get('.md-sidebar--secondary')
        .should('be.visible')
        .matchImageSnapshot('Secondary mkdocs sidebar');
  });

  it('Should show menu after click on the hamburger', () => {
    cy.get('#asyncapi')
        .should('be.visible');
    cy.get('.burger-menu')
        .click();
    cy.get('.sidebar')
        .should('be.visible')
        .matchImageSnapshot();
  });
});

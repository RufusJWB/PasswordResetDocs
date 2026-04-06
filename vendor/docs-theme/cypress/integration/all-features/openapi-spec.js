// / <reference types="cypress" />

beforeEach(() => {
  cy.visit('/api/openapi/');
});

const elements = [
  ['API title', '.main'],
  ['Servers', '.schemes'],
  ['Operation', '#operations-Tests-testInfo'],
  ['Operation list', ':nth-child(1) > .opblock-tag-section'],
  ['Object Access Operations ', ':nth-child(2) > .opblock-tag-section'],
  ['Models', '.models'],
  ['MD table in description', 'table'],
];

const snapshotOptions = {
  padding: [99, 0, 0],
  clip: {x: 0, y: 99, width: 1000, height: 1000},
};

describe('Open API element', () => {
  const testTitle = 'Should look as expected';

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
  describe('Operations', () => {
    const detailElements = [
      ['Parameter head', '.opblock-body > :nth-child(1) > :nth-child(1)'],
      ['Parameters', '.table-container'],
      ['Request head', '.opblock-body > :nth-child(1) > .opblock-section > .opblock-section-header'],
      ['Request', '.opblock-description-wrapper'],
      ['Response head', '.responses-wrapper > .opblock-section-header'],
      ['Response', '.responses-inner'],
    ];

    describe('Detail', () => {
      it('Opens on click', () => {
        cy.get('#operations-Tests-updateTest > .opblock-summary').click();
        cy.get(detailElements[0][1]).should('be.visible');
      });
      detailElements.forEach((element) => {
        describe(element[0], () => {
          it(testTitle, () => {
            cy.get('#operations-Tests-updateTest > .opblock-summary').click();
            cy.get(element[1])
                .should('be.visible')
                .matchImageSnapshot(snapshotOptions);
          });
        });
      });
    });
  });

  describe('Operations with tables', () => {
    const detailElements = [
      ['Parameter head',
        '#operations-Object_Access_Operations-generateDownloadObjectUrls > .opblock-summary',
        '.opblock-body > :nth-child(1) > :nth-child(1)'],
      ['Parameters',
        '#operations-Object_Access_Operations-generateDownloadObjectUrls > .opblock-summary',
        '.table-container'],
      ['Request',
        '#operations-Object_Access_Operations-generateDownloadObjectUrls > .opblock-summary',
        '.opblock-description-wrapper'],
      ['Response head',
        '#operations-Object_Access_Operations-generateDownloadObjectUrls > .opblock-summary',
        '.responses-wrapper > .opblock-section-header'],
      ['Response',
        '#operations-Object_Access_Operations-generateDownloadObjectUrls > .opblock-summary',
        '.responses-inner'],
      ['Response table',
        '#operations-Object_Access_Operations-generateDownloadObjectUrls > .opblock-summary',
        '[data-code=\'400\'] > .response-col_description > .response-col_description__inner'],
      ['Info',
        '#operations-Info-getVersion > .opblock-summary > .opblock-summary-control',
        ':nth-child(3) > .opblock-tag-section'],
    ];

    describe('Detail', () => {
      detailElements.forEach((element) => {
        it(element[0] + ' opens on click', () => {
          cy.get(element[1]).click();
          cy.get(element[2]).should('be.visible');
        });

        describe(element[0], () => {
          it(testTitle, () => {
            cy.get(element[1]).click();
            cy.get(element[2])
                .should('be.visible')
                .matchImageSnapshot(snapshotOptions);
          });
        });
      });
    });
  });

  describe('Schema panel', () => {
    it('Looks as expected', () => {
      cy.get('#operations-Tests-updateTest > .opblock-summary ' +
        '> .opblock-summary-control > .opblock-summary-method')
          .should('be.visible')
          .click()
          .get(':nth-child(1) > .model-example > .tab > :nth-child(2) > .tablinks')
          .should('be.visible')
          .click()
          .get(':nth-child(1) > .model-example > :nth-child(2) > .model-box')
          .should('be.visible')
          .matchImageSnapshot(snapshotOptions);
    });
  });
});

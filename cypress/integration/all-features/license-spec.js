// / <reference types="cypress" />

beforeEach(() => {
  cy.visit('/_licenses.html');
});

describe('Third-party software page', () => {
  it('Should contain license text', () => {
    cy.get('table').contains('a', 'MIT');
  });

  it('Should contain components from user-provided SBOM', () => {
    cy.get('table').contains('jackson-core');
  });

  it('Should contain multiple mkdocs-material and bundled software license texts', () => {
    cy.get('.md-license')
        .should('contain', 'Martin Donath') // mkdocs-material top-level license
        .and('contain', 'Fonticons, Inc.') // .icons: bundled icons
        .and('contain', 'Oliver Nightingale') // assets: lunr.js
        .and('contain', 'lunr-languages') // assets: lunr-languages
        .and('contain', 'swagger-ui-dist') // assets: swagger-ui-bundle.js
        .and('contain', 'react-component'); // html, cdn: @asyncapi/react-component
  });

  it('Should not contain docs-theme or invalid stdlib licenses', () => {
    cy.get('table')
        .should('not.contain', 'mkdocs-code-siemens-code-docs-theme')
        .and('not.contain', 'asyncio');

    cy.get('.md-license')
        .should('not.contain', 'mkdocs-code-siemens-code-docs-theme')
        .and('not.contain', 'asyncio');
  });
});

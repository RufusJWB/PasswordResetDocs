// / <reference types="cypress" />

beforeEach(() => {
  cy.visit('/api/openapi-custom-request/', {
    onBeforeLoad(win) {
      cy.stub(win.console, 'log').as('consoleLog');
    },
  })
});
  
describe('OpenAPI with customized request', () => {
  it('Should log custom message', () => {
    // Our custom function doesn't filter URLs, so we can already assert
    // on the initial spec request on page load without more test logic
    cy.get('@consoleLog').should('be.calledWith', 'Customizing request.');
  });
});

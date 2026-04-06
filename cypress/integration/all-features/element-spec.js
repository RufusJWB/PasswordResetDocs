// / <reference types="cypress" />

const headerElements = [
  ['Version selector', '.md-version__current', '.md-version__list'],
  ['Language selector button', '.md-select > .md-header__button', '.md-select__inner'],
];
const communityButton = '.md-community-button > .md-tabs__link';
const communityLink = 'https://pretium.tempus.com/pretium-ops/elit-theme';
const customAnalytics = '#test-custom-analytics';
const customAnalyticsProperty = 'test-property';


describe('Header element', () => {
  beforeEach(() => {
    cy.visit('/quam/');
  });

  headerElements.forEach((element) => {
    describe(element[0], () => {
      it('Should look like expected', () => {
        cy.get(element[1])
            .should('be.visible')
            .matchImageSnapshot('Header element -- ' + element[0]);
        cy.get(element[1])
            .click()
            .get(element[2])
            .should('be.visible')
            .matchImageSnapshot('Header element -- ' + element[0] + ' -- mouse over');
      });
    });
  });

  describe('External Community button', () => {
    it('Should look like expected with correct properties', () => {
      const btn = () => cy.get(communityButton);
      btn().should('be.visible').matchImageSnapshot('Header element -- Community button');
      btn().should('have.prop', 'href').and('equal', communityLink);
      btn().should('have.attr', 'target').and('equal', '_blank');
    });
  });
});

describe('Back to top button', () => {
  beforeEach(() => {
    cy.visit('/api/asyncapi/')
        .wait(200);
  });

  it('Should be hidden when scrolling down', () => {
    cy.scrollTo(0, 400)
        .get('.md-top')
        .should('be.hidden');
  });

  it('Should be visible when scrolling up', () => {
    cy.scrollTo(0, 400)
        .wait(30)
        .scrollTo(0, 200)
        .get('.md-top')
        .should('be.visible')
        .matchImageSnapshot('Visible back to top button');
  });
});


describe('Custom analytics', () => {
  it('Should contain custom analytics partial with user config', () => {
    cy.visit('/');
    cy.get(customAnalytics).should('contain.text', customAnalyticsProperty);
  });
});

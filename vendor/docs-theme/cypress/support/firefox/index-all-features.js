import './commands-all-features';

Cypress.on('uncaught:exception', (err) => !err.message.includes('ResizeObserver loop completed with undelivered notifications'));

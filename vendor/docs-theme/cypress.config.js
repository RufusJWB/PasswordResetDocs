const {defineConfig} = require('cypress');
const {addMatchImageSnapshotPlugin} = require('cypress-image-snapshot/plugin');
const fs = require('fs')

const browser = process.env.CYPRESS_BROWSER ?? 'chrome';
const host = process.env.CYPRESS_HOST ?? 'localhost';
const suite = process.env.CYPRESS_SUITE ?? 'all-features';

// our suites target mkdocs pages served at different ports
const port = (suite == 'minimal') ? '8001': '8000';

module.exports = defineConfig({
  viewportWidth: 1220,
  viewportHeight: 720,
  pageLoadTimeout: 10000,
  defaultCommandTimeout: 10000,
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'cypress/results/report-[hash].xml',
    toConsole: false,
  },
  retries: {
    runMode: 2,
  },
  video: false,
  videoCompression: false,
  screenshotOnRunFailure: true,
  env: {
    CYPRESS_SUITE: suite,
  },
  e2e: {
    setupNodeEvents(on, config) {
      addMatchImageSnapshotPlugin(on, config);
      // Copied from https://docs.cypress.io/app/guides/screenshots-and-videos#Delete-videos-for-specs-without-failing-or-retried-tests
      on('after:spec', (spec, results) => {
        if (results && results.video) {
          // Do we have failures for any retry attempts?
          const failures = results.tests.some((test) =>
            test.attempts.some((attempt) => attempt.state === 'failed')
          )
          if (!failures) {
            // delete the video if the spec passed and no tests retried
            fs.unlinkSync(results.video)
          }
        }
      });
    },
    baseUrl: `http://${host}:${port}`,
    supportFile: `cypress/support/${browser}/index-${suite}.js`,
    specPattern: [
      'cypress/integration/*.js',
      `cypress/integration/${suite}/*.js`,
    ],
  },
});

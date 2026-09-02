import { defineConfig, devices } from '@playwright/test';

const suite = process.env['PLAYWRIGHT_SUITE'] ?? 'all-features';
const docsEngine = process.env['DOCS_ENGINE'] ?? 'mkdocs';
const port = suite === 'minimal' ? '8001' : '8000';
const host = process.env['PLAYWRIGHT_HOST'] ?? 'localhost';
const baseURL = `http://${host}:${port}`;

const isCI = Boolean(process.env['CI']);

export default defineConfig({
  testDir: `playwright/e2e/${suite}`,
  snapshotPathTemplate:
    docsEngine === 'zensical'
      ? '{testDir}/{testFilePath}-zensical-snapshots/{arg}-{projectName}-{platform}{ext}'
      : undefined,
  timeout: 60_000,
  outputDir: 'dist/reports/playwright/test-results',
  fullyParallel: true,
  forbidOnly: isCI,
  reporter: [
    ['list'],
    ['junit', { outputFile: 'dist/reports/playwright/junit.xml' }],
    ['html', { outputFolder: 'dist/reports/playwright/html', open: 'never' }],
  ],
  retries: isCI ? 2 : 0,
  workers: isCI ? 4 : undefined,
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: {
      width: 1220,
      height: 720,
    },
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
});

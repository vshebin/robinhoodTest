import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/test-cases',
  fullyParallel: false,
  workers: 2,
  retries: 1,
  forbidOnly: Boolean(process.env.CI),
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report/details', open: 'never' }],
    ['./tests/reporters/table-reporter.ts', { outputFolder: 'playwright-report' }],
  ],
  use: {
    baseURL: process.env.ACTUAL_BASE_URL ?? 'http://localhost:3001',
    locale: process.env.ACTUAL_LOCALE ?? 'en-US',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], browserName: 'chromium' },
    },
    {
      name: 'edge',
      use: {
        ...devices['Desktop Edge'],
        browserName: 'chromium',
        channel: 'msedge',
      },
    },
  ],
});

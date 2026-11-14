import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 2,
  retries: 1,
  forbidOnly: Boolean(process.env.CI),
  reporter: 'list',
  use: {
    baseURL: process.env.ACTUAL_BASE_URL ?? 'http://localhost:3001',
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

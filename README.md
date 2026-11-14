# Actual UI automation

This project contains Playwright end-to-end tests for Actual onboarding,
account creation, and expense creation/editing. Tests, page objects, factories,
interfaces, locators, and fixtures are separated under `tests/` by responsibility.

## Prerequisites

- Node.js and npm
- The Actual web app running at `http://localhost:3001`

For this workspace's sibling Actual checkout, start the app in a separate
terminal:

```powershell
cd ..\actual
yarn start
```

## Install and run

From this automation project directory:

```powershell
npm install
npx playwright install chromium msedge
npm test
```

The same tests run in Chromium and Microsoft Edge, configured as Playwright
projects in `playwright.config.ts`. Add a project that spreads a Playwright
device descriptor into `use` when you are ready to cover a mobile device; the
test files and page objects do not need browser-specific changes. Playwright
runs test files in parallel across browser projects, while tests within each
file run sequentially to avoid conflicts in the shared app.

For example, a Chromium-based mobile project can be added alongside the current
browser projects:

```ts
{
  name: 'pixel-7',
  use: { ...devices['Pixel 7'], browserName: 'chromium' },
}
```

Page-object construction is centralized in the `ActualPageFactory`, which
implements the separate `PageFactory` interface. Actual page objects live in
`tests/pages/actual`. Actual UI text, roles, routes, and interaction values are
in `tests/constants/actual-ui.constants.ts`; test IDs and CSS selectors are in
`tests/constants/actual-selectors.constants.ts`. The locator class in
`tests/locators/actual-app-locators.ts` composes those constants into Playwright
locators. Update the relevant constants module when the UI changes, and keep
locator construction in the locator class rather than duplicating it in tests.
The interface and factory are separate so another platform implementation can
be added without mixing it into the current one.

To run with a visible browser:

```powershell
npm run test:headed
```

## CI integration

Use the provider-neutral `test:ci` script as the pipeline entry point. It keeps
the configured two-worker Chromium/Edge run and one retry, and produces an HTML
report in addition to console output:

```sh
npm ci
npx playwright install --with-deps chromium msedge
# Start the Actual app or set ACTUAL_BASE_URL to an available CI instance.
npm run test:ci
```

Configure the CI job to preserve `playwright-report/` and `test-results/` as
artifacts, including when a test fails. The pipeline must make the Actual app
available at `ACTUAL_BASE_URL` (defaults to `http://localhost:3001`).

Each test uses a fresh Playwright browser context and budget. The expense tests
create a new on-budget account, add a fresh expense category with a 100.00
allocation, explicitly select that category in the transaction form, and verify
its filtered activity from the Budget view before and after reload. The Spent
column displays expenses as negative amounts (for example `-25.00`), while the
remaining category balance and account balance display positive amounts.

The test cases include:

- Account creation with a 1000.00 opening balance.
- TC-01: create and persist a 25.00 expense.
- TC-02: independently create a 25.00 expense, edit it to 40.00, and verify
  that only one matching transaction remains.

Set `ACTUAL_BASE_URL` to target a different running instance.

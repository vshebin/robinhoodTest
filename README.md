# Actual UI automation

This project contains Playwright end-to-end tests for Actual onboarding,
account creation, and expense creation/editing. Tests, page objects, factories,
interfaces, locators, and fixtures are separated under `tests/` by responsibility.
Executable test scenarios live in `tests/test-cases/`.

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
projects in `playwright.config.ts`. Playwright runs test files in parallel
across browser projects, while tests within each file run sequentially to avoid
conflicts in the shared app. Test runs generate a table at
`playwright-report/index.html`; the full Playwright HTML report, including
detailed test output and attachments, is available at
`playwright-report/details/index.html`.

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

## Running specific tests

Run the full suite in all configured browser projects:

```powershell
npx playwright test
```

Run every test in the expense spec in Chromium:

```powershell
npx playwright test tests/test-cases/expenses.spec.ts --project=chromium
```

Run only TC-01 in Chromium:

```powershell
npx playwright test -g "TC-01" --project=chromium
```

Add `--headed` to see the browser while a test runs:

```powershell
npx playwright test -g "TC-01" --project=chromium --headed
```

The current test title begins with `TC-01` (without a colon), so use
`-g "TC-01"` rather than `-g "TC-01:"`. The expense spec is named
`expenses.spec.ts` (plural). A file-and-line selector can run a test at that
location; for example, the current TC-01 location is:

```powershell
npx playwright test tests/test-cases/expenses.spec.ts:166 --project=chromium
```

Run the tests that failed in the previous run:

```powershell
npx playwright test --last-failed --headed
```

The configured retry count is one retry after the initial attempt. Override it
for a run with `--retries`; use `0` to disable retries or another number to
change the retry count:

```powershell
npx playwright test --project=chromium --retries=2
```

Choose a browser project with `--project=chromium` or `--project=edge`. To pass
the project through a PowerShell environment variable:

```powershell
$env:PW_PROJECT = "chromium"
npx playwright test --project=$env:PW_PROJECT
```

Set the browser context locale with `ACTUAL_LOCALE`. It defaults to `en-US`:

```powershell
$env:ACTUAL_LOCALE = "en-GB"
npx playwright test --project=chromium
```

The expense tests currently expect dates in `MM/DD/YYYY` format, so those date
assertions may need localization when running with a locale that formats dates
differently.

## Future platform onboarding

The current framework targets the Actual web app in Chromium and Edge. No
Android platform support is implemented. To onboard a future platform:

1. Add platform-specific page objects and locator definitions in their own
   directories, keeping selectors and UI-specific constants separate.
2. Before using the current `PageFactory` for another platform, extract
   platform-neutral page contracts: it currently returns Actual-specific page
   objects and locators. Update shared test flows to depend on those contracts,
   then implement a factory for the new platform.
3. Configure the platform's Playwright project or provider-specific setup.
   Keep platform-specific setup out of the existing Actual web factory.
4. Add or adapt test cases where the platform supports the same user flows,
   then run them alongside the existing web projects.

This keeps test cases dependent on the factory contract rather than a
platform's concrete page classes, making future onboarding more maintainable.

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
artifacts, including when a test fails. The table report is the
`playwright-report/index.html` entry point, with the full Playwright report
linked from it. The pipeline must make the Actual app
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

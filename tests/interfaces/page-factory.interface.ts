import type { ActualAppLocators } from '../locators/actual-app-locators';
import type { AccountPage } from '../pages/actual/account-page';
import type { AddAccountPage } from '../pages/actual/add-account-page';
import type { BudgetPage } from '../pages/actual/budget-page';
import type { InitialPage } from '../pages/actual/initial-page';

/**
 * Defines the page-object factory contract used by Playwright test fixtures.
 */
export interface PageFactory {
  /** Shared, page-scoped locators used by tests that need direct UI access. */
  readonly locators: ActualAppLocators;
  /** Creates the page object for the application's initial screen. */
  initialPage(): InitialPage;
  /** Creates the page object for account creation. */
  addAccountPage(): AddAccountPage;
  /** Creates the page object for account transactions. */
  accountPage(): AccountPage;
  /** Creates the page object for budget operations. */
  budgetPage(): BudgetPage;
}

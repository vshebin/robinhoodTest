import type { Page } from '@playwright/test';

import type { PageFactory } from '../interfaces/page-factory.interface';
import { ActualAppLocators } from '../locators/actual-app-locators';
import { AccountPage } from '../pages/actual/account-page';
import { AddAccountPage } from '../pages/actual/add-account-page';
import { BudgetPage } from '../pages/actual/budget-page';
import { InitialPage } from '../pages/actual/initial-page';

/**
 * Creates Actual page objects that share one page-scoped locator catalog.
 */
export class ActualPageFactory implements PageFactory {
  readonly locators: ActualAppLocators;

  /**
   * Creates a factory whose page objects share a page-scoped locator catalog.
   * @param page Playwright page used by the current test.
   */
  constructor(private readonly page: Page) {
    this.locators = new ActualAppLocators(page);
  }

  /** Creates the page object for the initial screen. */
  initialPage(): InitialPage {
    return new InitialPage(this.page, this.locators);
  }

  /** Creates the page object for account creation. */
  addAccountPage(): AddAccountPage {
    return new AddAccountPage(this.page, this.locators);
  }

  /** Creates the page object for account transactions. */
  accountPage(): AccountPage {
    return new AccountPage(this.page, this.locators);
  }

  /** Creates the page object for budget operations. */
  budgetPage(): BudgetPage {
    return new BudgetPage(this.page, this.locators);
  }
}

import type { Locator, Page } from '@playwright/test';

import type { ActualAppLocators } from '../../locators/actual-app-locators';
import { CommonPage } from './common-page';

/**
 * Models account creation and the account details shown after creation.
 */
export class AddAccountPage extends CommonPage {
  readonly accountName: Locator;
  readonly accountBalance: Locator;

  /**
   * Creates the account-page object.
   * @param page Playwright page used for account creation.
   * @param locators Actual locator catalog scoped to the page.
   */
  constructor(page: Page, locators: ActualAppLocators) {
    super(page, locators);
    this.accountName = locators.accountName();
    this.accountBalance = locators.accountBalance();
  }

  /**
   * Creates an account with the provided opening balance.
   * @param name Name to assign to the account.
   * @param balance Opening balance to assign.
   */
  async createAccount(name: string, balance: string): Promise<void> {
    await this.click(this.locators.addAccountButton());

    await this.locators.accountNameInput().fill(name);
    await this.locators.accountBalanceInput().fill(balance);
    await this.click(this.locators.createButton());
  }
}

import type { Locator, Page } from '@playwright/test';

import type { AppLocators } from './app-locators';
import { CommonPage } from './common-page';

export class AddAccountPage extends CommonPage {
  readonly accountName: Locator;
  readonly accountBalance: Locator;

  constructor(page: Page, locators: AppLocators) {
    super(page, locators);
    this.accountName = locators.accountName();
    this.accountBalance = locators.accountBalance();
  }

  async createAccount(name: string, balance: string): Promise<void> {
    await this.click(this.locators.addAccountButton());

    await this.locators.accountNameInput().fill(name);
    await this.locators.accountBalanceInput().fill(balance);
    await this.click(this.locators.createButton());
  }
}

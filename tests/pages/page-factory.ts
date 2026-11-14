import type { Page } from '@playwright/test';

import { AccountPage } from './account-page';
import { AddAccountPage } from './add-account-page';
import { AppLocators } from './app-locators';
import { BudgetPage } from './budget-page';
import { InitialPage } from './initial-page';

export interface PageFactory {
  readonly locators: AppLocators;
  initialPage(): InitialPage;
  addAccountPage(): AddAccountPage;
  accountPage(): AccountPage;
  budgetPage(): BudgetPage;
}

export class DefaultPageFactory implements PageFactory {
  readonly locators: AppLocators;

  constructor(private readonly page: Page) {
    this.locators = new AppLocators(page);
  }

  initialPage(): InitialPage {
    return new InitialPage(this.page, this.locators);
  }

  addAccountPage(): AddAccountPage {
    return new AddAccountPage(this.page, this.locators);
  }

  accountPage(): AccountPage {
    return new AccountPage(this.page, this.locators);
  }

  budgetPage(): BudgetPage {
    return new BudgetPage(this.page, this.locators);
  }
}

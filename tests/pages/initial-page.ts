import type { Page } from '@playwright/test';

import type { AppLocators } from './app-locators';
import { CommonPage } from './common-page';

export class InitialPage extends CommonPage {
  constructor(page: Page, locators: AppLocators) {
    super(page, locators);
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async startBudgeting(): Promise<void> {
    const noServerButton = this.locators.noServerButton();

    if (await noServerButton.isVisible()) {
      await this.click(noServerButton);
    }

    await this.click(this.locators.startBudgetingButton());
  }
}

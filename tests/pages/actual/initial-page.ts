import type { Page } from '@playwright/test';

import type { ActualAppLocators } from '../../locators/actual-app-locators';
import { ACTUAL_ROUTES } from '../../locators/actual-app-locators';
import { CommonPage } from './common-page';

/**
 * Models Actual's initial screen and its budget-start flow.
 */
export class InitialPage extends CommonPage {
  /**
   * Creates the initial-page object.
   * @param page Playwright page used for navigation.
   * @param locators Actual locator catalog scoped to the page.
   */
  constructor(page: Page, locators: ActualAppLocators) {
    super(page, locators);
  }

  /** Navigates to the configured application home route. */
  async open(): Promise<void> {
    await this.page.goto(ACTUAL_ROUTES.home);
  }

  /** Completes the initial prompts and starts the budget. */
  async startBudgeting(): Promise<void> {
    const noServerButton = this.locators.noServerButton();

    if (await noServerButton.isVisible()) {
      await this.click(noServerButton);
    }

    await this.click(this.locators.startBudgetingButton());
  }
}

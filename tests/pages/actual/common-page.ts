import type { Locator, Page } from '@playwright/test';

import type { ActualAppLocators } from '../../locators/actual-app-locators';

/**
 * Provides shared browser interactions for Actual page objects.
 */
export class CommonPage {
  /**
   * Initializes shared Playwright and locator dependencies.
   * @param page Playwright page used by the page object.
   * @param locators Actual locator catalog scoped to the page.
   */
  constructor(
    protected readonly page: Page,
    readonly locators: ActualAppLocators,
  ) {}

  /**
   * Clicks a locator.
   * @param locator Target element to click.
   */
  async click(locator: Locator): Promise<void> {
    await locator.click();
  }
}

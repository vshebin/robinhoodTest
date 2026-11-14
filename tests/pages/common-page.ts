import type { Locator, Page } from '@playwright/test';

import type { AppLocators } from './app-locators';

export class CommonPage {
  constructor(
    protected readonly page: Page,
    readonly locators: AppLocators,
  ) {}

  async click(locator: Locator): Promise<void> {
    await locator.click();
  }
}

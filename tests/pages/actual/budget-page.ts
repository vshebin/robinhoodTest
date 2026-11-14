import type { Locator, Page } from '@playwright/test';

import {
  ACTUAL_ATTRIBUTES,
  ACTUAL_ERROR_MESSAGES,
  ACTUAL_KEYBOARD_KEYS,
  ACTUAL_LOCATOR_STATES,
  type ActualAppLocators,
} from '../../locators/actual-app-locators';
import { CommonPage } from './common-page';

/**
 * Models budget categories, allocations, and expense activity.
 */
export class BudgetPage extends CommonPage {
  readonly budgetTable: Locator;
  readonly selectedMonth: Locator;

  /**
   * Creates the budget page object and binds its primary locators.
   * @param page Playwright page displaying the budget.
   * @param locators Actual locator catalog scoped to the page.
   */
  constructor(page: Page, locators: ActualAppLocators) {
    super(page, locators);
    this.budgetTable = locators.budgetTable();
    this.selectedMonth = locators.selectedBudgetMonth();
  }

  /** Waits until the budget table is visible. */
  async waitFor(): Promise<void> {
    await this.budgetTable.waitFor({ state: ACTUAL_LOCATOR_STATES.visible });
  }

  /**
   * Reads the currently selected budget month.
   * @returns Selected month in the application's month format.
   * @throws Error if the selected month attribute is unavailable.
   */
  async getSelectedMonth(): Promise<string> {
    const month = await this.selectedMonth.getAttribute(
      ACTUAL_ATTRIBUTES.selectedBudgetMonth,
    );
    if (!month) {
      throw new Error(ACTUAL_ERROR_MESSAGES.selectedBudgetMonthUnavailable);
    }
    return month;
  }

  /**
   * Locates the row for a budget category.
   * @param name Category name to locate.
   */
  categoryRow(name: string): Locator {
    return this.locators.categoryRow(name);
  }

  /**
   * Adds a category to the Usual Expenses group.
   * @param name Name for the new category.
   */
  async createExpenseCategory(name: string): Promise<void> {
    const expenseGroup = this.locators.usualExpensesRow();

    await this.locators.usualExpensesLabel(expenseGroup).hover();
    await this.click(
      this.locators.addCategoryButton(expenseGroup),
    );

    const categoryName = this.locators.newCategoryNameInput();
    await categoryName.fill(name);
    await categoryName.press(ACTUAL_KEYBOARD_KEYS.enter);
    await this.categoryRow(name).waitFor({
      state: ACTUAL_LOCATOR_STATES.visible,
    });
  }

  /**
   * Sets a category's monthly budget allocation.
   * @param name Category whose allocation is changed.
   * @param amount New monthly allocation.
   */
  async setMonthlyAllocation(name: string, amount: string): Promise<void> {
    const budgetCell = this.locators.categoryBudgetCell(name);
    await this.click(budgetCell);

    const input = this.locators.budgetAmountInput(budgetCell);
    await input.waitFor({ state: ACTUAL_LOCATOR_STATES.visible });
    await input.fill(amount);
    await input.press(ACTUAL_KEYBOARD_KEYS.enter);
  }

  /**
   * Locates a category's allocation amount.
   * @param name Category whose allocation is requested.
   */
  allocation(name: string): Locator {
    return this.locators.categoryBudgetCell(name);
  }

  /**
   * Locates a category's amount spent this month.
   * @param name Category whose spent amount is requested.
   */
  spent(name: string): Locator {
    return this.locators.categorySpent(name);
  }

  /**
   * Locates a category's remaining balance.
   * @param name Category whose remaining amount is requested.
   */
  remaining(name: string): Locator {
    return this.locators.categoryRemaining(name);
  }

  /**
   * Opens the transaction activity for a category.
   * @param name Category whose activity is opened.
   */
  async openCategoryActivity(name: string): Promise<void> {
    await this.click(this.spent(name));
    await this.locators.transactionTable().waitFor({
      state: ACTUAL_LOCATOR_STATES.visible,
    });
  }
}

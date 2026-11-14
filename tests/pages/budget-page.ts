import type { Locator, Page } from '@playwright/test';

import type { AppLocators } from './app-locators';
import { CommonPage } from './common-page';

export class BudgetPage extends CommonPage {
  readonly budgetTable: Locator;
  readonly selectedMonth: Locator;

  constructor(page: Page, locators: AppLocators) {
    super(page, locators);
    this.budgetTable = locators.budgetTable();
    this.selectedMonth = locators.selectedBudgetMonth();
  }

  async waitFor(): Promise<void> {
    await this.budgetTable.waitFor({ state: 'visible' });
  }

  async getSelectedMonth(): Promise<string> {
    const month = await this.selectedMonth.getAttribute('data-month');
    if (!month) {
      throw new Error('The selected budget month is not available.');
    }
    return month;
  }

  categoryRow(name: string): Locator {
    return this.locators.categoryRow(name);
  }

  async createExpenseCategory(name: string): Promise<void> {
    const expenseGroup = this.locators.usualExpensesRow();

    await this.locators.usualExpensesLabel(expenseGroup).hover();
    await this.click(
      this.locators.addCategoryButton(expenseGroup),
    );

    const categoryName = this.locators.newCategoryNameInput();
    await categoryName.fill(name);
    await categoryName.press('Enter');
    await this.categoryRow(name).waitFor({ state: 'visible' });
  }

  async setMonthlyAllocation(name: string, amount: string): Promise<void> {
    const budgetCell = this.locators.categoryBudgetCell(name);
    await this.click(budgetCell);

    const input = this.locators.budgetAmountInput(budgetCell);
    await input.waitFor({ state: 'visible' });
    await input.fill(amount);
    await input.press('Enter');
  }

  allocation(name: string): Locator {
    return this.locators.categoryBudgetCell(name);
  }

  spent(name: string): Locator {
    return this.locators.categorySpent(name);
  }

  remaining(name: string): Locator {
    return this.locators.categoryRemaining(name);
  }

  async openCategoryActivity(name: string): Promise<void> {
    await this.click(this.spent(name));
    await this.locators.transactionTable().waitFor({ state: 'visible' });
  }
}

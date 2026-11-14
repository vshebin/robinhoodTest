import type { Locator, Page } from '@playwright/test';

import type { AppLocators } from './app-locators';
import { CommonPage } from './common-page';

export type ExpenseDetails = {
  date: string;
  payee: string;
  notes: string;
  category: string;
  amount: string;
};

export class AccountPage extends CommonPage {
  readonly accountName: Locator;
  readonly accountBalance: Locator;
  readonly transactionTable: Locator;
  readonly transactionRows: Locator;
  readonly newTransactionRow: Locator;

  constructor(page: Page, locators: AppLocators) {
    super(page, locators);
    this.accountName = locators.accountName();
    this.accountBalance = locators.accountBalance();
    this.transactionTable = locators.transactionTable();
    this.transactionRows = locators.transactionRows();
    this.newTransactionRow = locators.newTransactionRow();
  }

  async waitFor(): Promise<void> {
    await this.transactionTable.waitFor({ state: 'visible' });
  }

  matchingTransactions(payee: string): Locator {
    return this.locators.matchingTransactions(payee);
  }

  async beginExpense(details: ExpenseDetails): Promise<void> {
    await this.click(this.locators.addNewButton());
    await this.newTransactionRow.waitFor({ state: 'visible' });

    const dateCell = this.locators.transactionCell(
      this.newTransactionRow,
      'date',
    );
    await this.click(dateCell);
    const dateInput = this.locators.transactionInput(dateCell, 'textbox');
    await dateInput.fill(details.date);
    await dateInput.press('Enter');

    const debitCell = this.locators.transactionCell(
      this.newTransactionRow,
      'debit',
    );
    await this.click(debitCell);
    const debitInput = this.locators.transactionInput(debitCell, 'textbox');
    await debitInput.fill(details.amount);
    await debitInput.press('Tab');

    const payeeCell = this.locators.transactionCell(
      this.newTransactionRow,
      'payee',
    );
    await this.click(payeeCell);
    await this.locators
      .transactionInput(payeeCell, 'textbox')
      .pressSequentially(details.payee);
    await this.page.keyboard.press('Tab');
    await this.fillTextCell(
      this.newTransactionRow,
      'notes',
      details.notes,
      'combobox',
    );
    const categoryCell = this.locators.transactionCell(
      this.newTransactionRow,
      'category',
    );
    await this.click(categoryCell);
    await this.locators
      .transactionInput(categoryCell, 'textbox')
      .fill(details.category);
    await this.click(this.locators.categoryItem(details.category));
  }

  async saveExpense(payee: string): Promise<Locator> {
    const matchingRows = this.matchingTransactions(payee);
    const previousCount = await this.transactionRows.count();

    await this.click(this.locators.addTransactionButton());
    await matchingRows.first().waitFor({ state: 'visible' });
    await this.locators.cancelButton().click();
    await matchingRows.first().waitFor({ state: 'visible' });

    if ((await this.transactionRows.count()) !== previousCount + 1) {
      throw new Error('Saving the expense did not add exactly one transaction.');
    }
    return matchingRows.first();
  }

  async editExpenseAmount(payee: string, amount: string): Promise<void> {
    const row = this.matchingTransactions(payee).first();
    const debitCell = this.locators.transactionCell(row, 'debit');
    await this.click(debitCell);

    const input = this.locators.transactionInput(debitCell, 'textbox');
    await input.selectText();
    await input.fill(amount);
    await input.press('Tab');
  }

  private async fillTextCell(
    row: Locator,
    testId: string,
    value: string,
    role: 'textbox' | 'combobox',
  ): Promise<void> {
    const cell = this.locators.transactionCell(row, testId);
    await this.click(cell);
    const input = this.locators.transactionInput(cell, role);
    await input.fill(value);
    await input.press('Tab');
  }
}

import type { Locator, Page } from '@playwright/test';

import type { ActualAppLocators } from '../../locators/actual-app-locators';
import {
  ACTUAL_ERROR_MESSAGES,
  ACTUAL_KEYBOARD_KEYS,
  ACTUAL_LOCATOR_STATES,
  ACTUAL_UI_ROLES,
} from '../../constants/actual-ui.constants';
import { ACTUAL_TEST_IDS } from '../../constants/actual-selectors.constants';
import { CommonPage } from './common-page';

/**
 * Describes the values needed to enter an expense transaction.
 */
export type ExpenseDetails = {
  date: string;
  payee: string;
  notes: string;
  category: string;
  amount: string;
};

/**
 * Models account transactions, including creating and editing expenses.
 */
export class AccountPage extends CommonPage {
  readonly accountName: Locator;
  readonly accountBalance: Locator;
  readonly transactionTable: Locator;
  readonly transactionRows: Locator;
  readonly newTransactionRow: Locator;

  /**
   * Creates the account page object and binds its common locators.
   * @param page Playwright page displaying the account.
   * @param locators Actual locator catalog scoped to the page.
   */
  constructor(page: Page, locators: ActualAppLocators) {
    super(page, locators);
    this.accountName = locators.accountName();
    this.accountBalance = locators.accountBalance();
    this.transactionTable = locators.transactionTable();
    this.transactionRows = locators.transactionRows();
    this.newTransactionRow = locators.newTransactionRow();
  }

  /** Waits until the account transaction table is visible. */
  async waitFor(): Promise<void> {
    await this.transactionTable.waitFor({
      state: ACTUAL_LOCATOR_STATES.visible,
    });
  }

  /**
   * Finds transactions containing a payee.
   * @param payee Payee text to match.
   */
  matchingTransactions(payee: string): Locator {
    return this.locators.matchingTransactions(payee);
  }

  /**
   * Enters an expense into the editable transaction row.
   * @param details Expense values to enter.
   */
  async beginExpense(details: ExpenseDetails): Promise<void> {
    await this.click(this.locators.addNewButton());
    await this.newTransactionRow.waitFor({
      state: ACTUAL_LOCATOR_STATES.visible,
    });

    const dateCell = this.locators.transactionCell(
      this.newTransactionRow,
      ACTUAL_TEST_IDS.transactionColumn.date,
    );
    await this.click(dateCell);
    const dateInput = this.locators.transactionInput(
      dateCell,
      ACTUAL_UI_ROLES.textbox,
    );
    await dateInput.fill(details.date);
    await dateInput.press(ACTUAL_KEYBOARD_KEYS.enter);

    const debitCell = this.locators.transactionCell(
      this.newTransactionRow,
      ACTUAL_TEST_IDS.transactionColumn.debit,
    );
    await this.click(debitCell);
    const debitInput = this.locators.transactionInput(
      debitCell,
      ACTUAL_UI_ROLES.textbox,
    );
    await debitInput.fill(details.amount);
    await debitInput.press(ACTUAL_KEYBOARD_KEYS.tab);

    const payeeCell = this.locators.transactionCell(
      this.newTransactionRow,
      ACTUAL_TEST_IDS.transactionColumn.payee,
    );
    await this.click(payeeCell);
    await this.locators
      .transactionInput(payeeCell, ACTUAL_UI_ROLES.textbox)
      .pressSequentially(details.payee);
    await this.page.keyboard.press(ACTUAL_KEYBOARD_KEYS.tab);
    await this.fillTextCell(
      this.newTransactionRow,
      ACTUAL_TEST_IDS.transactionColumn.notes,
      details.notes,
      ACTUAL_UI_ROLES.combobox,
    );
    const categoryCell = this.locators.transactionCell(
      this.newTransactionRow,
      ACTUAL_TEST_IDS.transactionColumn.category,
    );
    await this.click(categoryCell);
    await this.locators
      .transactionInput(categoryCell, ACTUAL_UI_ROLES.textbox)
      .fill(details.category);
    await this.click(this.locators.categoryItem(details.category));
  }

  /**
   * Commits the entered expense and verifies exactly one matching row was added.
   * @param payee Payee used to identify the saved transaction.
   * @returns The matching saved transaction row.
   * @throws Error if saving does not add exactly one transaction.
   */
  async saveExpense(payee: string): Promise<Locator> {
    const matchingRows = this.matchingTransactions(payee);
    const previousCount = await this.transactionRows.count();

    await this.click(this.locators.addTransactionButton());
    await matchingRows.first().waitFor({
      state: ACTUAL_LOCATOR_STATES.visible,
    });
    await this.locators.cancelButton().click();
    await matchingRows.first().waitFor({
      state: ACTUAL_LOCATOR_STATES.visible,
    });

    if ((await this.transactionRows.count()) !== previousCount + 1) {
      throw new Error(ACTUAL_ERROR_MESSAGES.saveTransactionCount);
    }
    return matchingRows.first();
  }

  /**
   * Changes the amount of an existing expense.
   * @param payee Payee used to identify the transaction.
   * @param amount New expense amount.
   */
  async editExpenseAmount(payee: string, amount: string): Promise<void> {
    const row = this.matchingTransactions(payee).first();
    const debitCell = this.locators.transactionCell(
      row,
      ACTUAL_TEST_IDS.transactionColumn.debit,
    );
    await this.click(debitCell);

    const input = this.locators.transactionInput(
      debitCell,
      ACTUAL_UI_ROLES.textbox,
    );
    await input.selectText();
    await input.fill(amount);
    await input.press(ACTUAL_KEYBOARD_KEYS.tab);
  }

  /**
   * Fills a text or combobox cell and commits the edit.
   * @param row Transaction row containing the cell.
   * @param testId Test id identifying the cell.
   * @param value Text to enter.
   * @param role Accessible role of the cell input.
   */
  private async fillTextCell(
    row: Locator,
    testId: string,
    value: string,
    role: typeof ACTUAL_UI_ROLES.textbox | typeof ACTUAL_UI_ROLES.combobox,
  ): Promise<void> {
    const cell = this.locators.transactionCell(row, testId);
    await this.click(cell);
    const input = this.locators.transactionInput(cell, role);
    await input.fill(value);
    await input.press(ACTUAL_KEYBOARD_KEYS.tab);
  }
}

import { expect, test } from '../support/test-fixtures';
import type { Page } from '@playwright/test';

import type {
  AccountPage,
  ExpenseDetails,
} from '../pages/actual/account-page';
import type { BudgetPage } from '../pages/actual/budget-page';
import type { PageFactory } from '../interfaces/page-factory.interface';
import { ACTUAL_TEST_IDS } from '../constants/actual-selectors.constants';
import { ACTUAL_UI_ROLES } from '../constants/actual-ui.constants';

const accountName = 'Expense Test Account';

function currentMonthAndDate(): { month: string; date: string } {
  const now = new Date();
  const monthNumber = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const year = now.getFullYear();

  return {
    month: `${year}-${monthNumber}`,
    date: `${monthNumber}/${day}/${year}`,
  };
}

async function prepareExpenseFixture(
  page: Page,
  app: PageFactory,
  categoryName: string,
): Promise<{
  accountPage: AccountPage;
  budgetPage: BudgetPage;
  expenseDate: string;
  expenseDetails: ExpenseDetails;
}> {
  const initialPage = app.initialPage();
  const addAccountPage = app.addAccountPage();
  const accountPage = app.accountPage();
  const budgetPage = app.budgetPage();
  const { month, date } = currentMonthAndDate();

  await initialPage.open();
  await initialPage.startBudgeting();
  await budgetPage.waitFor();
  expect(await budgetPage.getSelectedMonth()).toBe(month);

  await addAccountPage.createAccount(accountName, '1000');
  await expect(accountPage.accountName).toHaveText(accountName);
  await expect(accountPage.accountBalance).toHaveText('1,000.00');
  await expect(accountPage.transactionRows).toHaveCount(1);
  await expect(accountPage.transactionRows.first()).toContainText(
    'Starting Balance',
  );
  await expect(app.locators.onBudgetBalance()).toHaveText(
    '1,000.00',
  );

  await app.locators.budgetLink().click();
  await budgetPage.waitFor();
  await budgetPage.createExpenseCategory(categoryName);
  await budgetPage.setMonthlyAllocation(categoryName, '100');

  await expect(budgetPage.allocation(categoryName)).toHaveText('100.00');
  await expect(budgetPage.spent(categoryName)).toHaveText('0.00');
  await expect(budgetPage.remaining(categoryName)).toHaveText('100.00');

  await app.locators.accountLink(accountName).click();
  await accountPage.waitFor();

  const expenseDetails: ExpenseDetails = {
    date,
    payee: `E2E ${categoryName} Payee`,
    notes: `Prepared ${categoryName} expense`,
    category: categoryName,
    amount: '25.00',
  };

  return { accountPage, budgetPage, expenseDate: date, expenseDetails };
}

async function verifyTransaction(
  accountPage: AccountPage,
  details: ExpenseDetails,
  amount = details.amount,
): Promise<void> {
  const matches = accountPage.matchingTransactions(details.payee);
  await expect(matches).toHaveCount(1);
  const row = matches.first();
  await expect(
    accountPage.locators.transactionCell(
      row,
      ACTUAL_TEST_IDS.transactionColumn.date,
    ),
  ).toHaveText(details.date);
  await expect(
    accountPage.locators.transactionCell(
      row,
      ACTUAL_TEST_IDS.transactionColumn.payee,
    ),
  ).toHaveText(details.payee);
  await expect(
    accountPage.locators.transactionCell(
      row,
      ACTUAL_TEST_IDS.transactionColumn.notes,
    ),
  ).toHaveText(details.notes);
  await expect(
    accountPage.locators.transactionCell(
      row,
      ACTUAL_TEST_IDS.transactionColumn.category,
    ),
  ).toHaveText(details.category);
  await expect(
    accountPage.locators.transactionCell(
      row,
      ACTUAL_TEST_IDS.transactionColumn.debit,
    ),
  ).toHaveText(amount);
  await expect(
    accountPage.locators.transactionCell(
      row,
      ACTUAL_TEST_IDS.transactionColumn.credit,
    ),
  ).toHaveText('');
}

async function verifyBudgetValues(
  budgetPage: BudgetPage,
  categoryName: string,
  spent: string,
  remaining: string,
): Promise<void> {
  await expect(budgetPage.allocation(categoryName)).toHaveText('100.00');
  await expect(budgetPage.spent(categoryName)).toHaveText(spent);
  await expect(budgetPage.remaining(categoryName)).toHaveText(remaining);
}

test('TC-01 creates and persists a 25.00 expense', async ({ page, app }) => {
  const categoryName = 'TC-01 Expense Category';
  const { accountPage, budgetPage, expenseDetails } =
    await prepareExpenseFixture(page, app, categoryName);

  await expect(accountPage.accountBalance).toHaveText('1,000.00');
  await expect(accountPage.matchingTransactions(expenseDetails.payee)).toHaveCount(
    0,
  );

  await accountPage.beginExpense(expenseDetails);
  await expect(
    accountPage.locators.transactionCell(
      accountPage.newTransactionRow,
      ACTUAL_TEST_IDS.transactionColumn.date,
    ),
  ).toHaveText(expenseDetails.date);
  await expect(
    accountPage.locators.transactionCell(
      accountPage.newTransactionRow,
      ACTUAL_TEST_IDS.transactionColumn.payee,
    ),
  ).toContainText(expenseDetails.payee);
  await expect(
    accountPage.locators.transactionCell(
      accountPage.newTransactionRow,
      ACTUAL_TEST_IDS.transactionColumn.notes,
    ),
  ).toContainText(expenseDetails.notes);
  await expect(
    accountPage.locators.transactionInput(
      accountPage.locators.transactionCell(
        accountPage.newTransactionRow,
        ACTUAL_TEST_IDS.transactionColumn.category,
      ),
      ACTUAL_UI_ROLES.textbox,
    ),
  ).toHaveValue(expenseDetails.category);
  await expect(
    accountPage.locators.transactionCell(
      accountPage.newTransactionRow,
      ACTUAL_TEST_IDS.transactionColumn.debit,
    ),
  ).toHaveAttribute('title', '25.00');

  await accountPage.saveExpense(expenseDetails.payee);
  await verifyTransaction(accountPage, expenseDetails);
  await expect(accountPage.accountBalance).toHaveText('975.00');

  await app.locators.budgetLink().click();
  await budgetPage.waitFor();
  await verifyBudgetValues(budgetPage, categoryName, '-25.00', '75.00');
  await budgetPage.openCategoryActivity(categoryName);
  await verifyTransaction(accountPage, expenseDetails);

  await app.locators.accountLink(accountName).click();
  await accountPage.waitFor();
  await page.reload();
  await accountPage.waitFor();
  await expect(accountPage.accountName).toHaveText(accountName);
  await verifyTransaction(accountPage, expenseDetails);
  await expect(accountPage.accountBalance).toHaveText('975.00');

  await app.locators.budgetLink().click();
  await budgetPage.waitFor();
  await verifyBudgetValues(budgetPage, categoryName, '-25.00', '75.00');
});

test('TC-02 edits an independent 25.00 expense to 40.00', async ({
  page,
  app,
}) => {
  const categoryName = 'TC-02 Expense Category';
  const { accountPage, budgetPage, expenseDetails } =
    await prepareExpenseFixture(page, app, categoryName);

  await accountPage.beginExpense(expenseDetails);
  await accountPage.saveExpense(expenseDetails.payee);
  await verifyTransaction(accountPage, expenseDetails);
  await expect(accountPage.accountBalance).toHaveText('975.00');

  await app.locators.budgetLink().click();
  await budgetPage.waitFor();
  await verifyBudgetValues(budgetPage, categoryName, '-25.00', '75.00');

  await app.locators.accountLink(accountName).click();
  await accountPage.waitFor();
  await verifyTransaction(accountPage, expenseDetails);

  await accountPage.editExpenseAmount(expenseDetails.payee, '40.00');
  await verifyTransaction(accountPage, expenseDetails, '40.00');
  await expect(accountPage.accountBalance).toHaveText('960.00');

  await app.locators.budgetLink().click();
  await budgetPage.waitFor();
  await verifyBudgetValues(budgetPage, categoryName, '-40.00', '60.00');

  await page.reload();
  await budgetPage.waitFor();
  await verifyBudgetValues(budgetPage, categoryName, '-40.00', '60.00');
  await budgetPage.openCategoryActivity(categoryName);
  await verifyTransaction(accountPage, expenseDetails, '40.00');

  await app.locators.accountLink(accountName).click();
  await accountPage.waitFor();
  await verifyTransaction(accountPage, expenseDetails, '40.00');
  await expect(accountPage.accountBalance).toHaveText('960.00');
});

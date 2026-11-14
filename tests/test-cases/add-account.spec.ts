import { expect, test } from '../support/test-fixtures';

/**
 * Verifies that a new savings account is created with the requested opening balance.
 */
test('creates a savings account with an opening balance', async ({ app }) => {
  const initialPage = app.initialPage();
  const addAccountPage = app.addAccountPage();

  await initialPage.open();
  await initialPage.startBudgeting();
  await addAccountPage.createAccount('Saving Account', '1000');

  await expect(addAccountPage.accountName).toHaveText('Saving Account');
  await expect(addAccountPage.accountBalance).toHaveText('1,000.00');
});

import type { Locator, Page } from '@playwright/test';

export class AppLocators {
  constructor(private readonly page: Page) {}

  noServerButton(): Locator {
    return this.page.getByRole('button', { name: "Don't use a server" });
  }

  startBudgetingButton(): Locator {
    return this.page.getByRole('button', {
      name: 'Start budgeting',
      exact: true,
    });
  }

  accountName(): Locator {
    return this.page.getByTestId('account-name');
  }

  accountBalance(): Locator {
    return this.page.getByTestId('account-balance');
  }

  transactionTable(): Locator {
    return this.page.getByTestId('transaction-table');
  }

  transactionRows(): Locator {
    return this.transactionTable().getByTestId('row');
  }

  newTransactionRow(): Locator {
    return this.page.getByTestId('new-transaction').getByTestId('row');
  }

  matchingTransactions(payee: string): Locator {
    return this.transactionRows().filter({ hasText: payee });
  }

  transactionCell(row: Locator, testId: string): Locator {
    return row.getByTestId(testId);
  }

  transactionInput(
    cell: Locator,
    role: 'textbox' | 'combobox',
  ): Locator {
    return cell.getByRole(role);
  }

  addNewButton(): Locator {
    return this.page.getByRole('button', { name: 'Add New' });
  }

  addTransactionButton(): Locator {
    return this.page.getByTestId('add-button');
  }

  cancelButton(): Locator {
    return this.page.getByRole('button', { name: 'Cancel', exact: true });
  }

  categoryItem(name: string): Locator {
    return this.page.getByTestId(`${name}-category-item`);
  }

  budgetLink(): Locator {
    return this.page.getByRole('link', { name: 'Budget', exact: true });
  }

  accountLink(name: string): Locator {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.page.getByRole('link', {
      name: new RegExp(`^${escapedName}`),
    });
  }

  onBudgetBalance(): Locator {
    return this.page.getByTestId('sidebar-on-budget-balance');
  }

  addAccountButton(): Locator {
    return this.page.getByRole('button', {
      name: 'Add account',
      exact: true,
    });
  }

  accountNameInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Name:' });
  }

  accountBalanceInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Balance:' });
  }

  createButton(): Locator {
    return this.page.getByRole('button', { name: 'Create' });
  }

  budgetTable(): Locator {
    return this.page.getByTestId('budget-table');
  }

  selectedBudgetMonth(): Locator {
    return this.page.getByTestId('selected-budget-month');
  }

  categoryRow(name: string): Locator {
    return this.budgetTable()
      .getByTestId('row')
      .filter({ hasText: name })
      .first();
  }

  usualExpensesRow(): Locator {
    return this.budgetTable()
      .getByTestId('row')
      .filter({ hasText: 'Usual Expenses' })
      .first();
  }

  addCategoryButton(row: Locator): Locator {
    return row.getByRole('button', { name: 'Add category' });
  }

  usualExpensesLabel(row: Locator): Locator {
    return row.getByText('Usual Expenses', { exact: true });
  }

  newCategoryNameInput(): Locator {
    return this.page.getByPlaceholder('New category name');
  }

  categoryBudgetCell(name: string): Locator {
    return this.categoryRow(name).getByTestId('budget').first();
  }

  categorySpent(name: string): Locator {
    return this.categoryRow(name).getByTestId('category-month-spent');
  }

  categoryRemaining(name: string): Locator {
    return this.categoryRow(name).getByTestId('balance').first();
  }

  budgetAmountInput(cell: Locator): Locator {
    return cell.locator('input');
  }
}

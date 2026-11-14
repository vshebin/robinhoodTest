import type { Locator, Page } from '@playwright/test';

import {
  ACTUAL_CSS_SELECTORS,
  ACTUAL_LOCATOR_PATTERNS,
  ACTUAL_TEST_IDS,
} from '../constants/actual-selectors.constants';
import {
  ACTUAL_PLACEHOLDERS,
  ACTUAL_UI_ROLES,
  ACTUAL_UI_TEXT,
} from '../constants/actual-ui.constants';

/**
 * Provides the centralized Playwright selectors for Actual's web interface.
 */
export class ActualAppLocators {
  /**
   * Creates the locator catalog for one Playwright page.
   * @param page Page whose Actual UI is being queried.
   */
  constructor(private readonly page: Page) {}

  /** Locates the option to use Actual without a server. */
  noServerButton(): Locator {
    return this.page.getByRole(ACTUAL_UI_ROLES.button, {
      name: ACTUAL_UI_TEXT.noServerButton,
    });
  }

  /** Locates the button that starts the budgeting flow. */
  startBudgetingButton(): Locator {
    return this.page.getByRole(ACTUAL_UI_ROLES.button, {
      name: ACTUAL_UI_TEXT.startBudgetingButton,
      exact: true,
    });
  }

  /** Locates the displayed account name. */
  accountName(): Locator {
    return this.page.getByTestId(ACTUAL_TEST_IDS.accountName);
  }

  /** Locates the displayed account balance. */
  accountBalance(): Locator {
    return this.page.getByTestId(ACTUAL_TEST_IDS.accountBalance);
  }

  /** Locates the account transaction table. */
  transactionTable(): Locator {
    return this.page.getByTestId(ACTUAL_TEST_IDS.transactionTable);
  }

  /** Locates all transaction rows in the account table. */
  transactionRows(): Locator {
    return this.transactionTable().getByTestId(ACTUAL_TEST_IDS.row);
  }

  /** Locates the editable row used to enter a new transaction. */
  newTransactionRow(): Locator {
    return this.page
      .getByTestId(ACTUAL_TEST_IDS.newTransaction)
      .getByTestId(ACTUAL_TEST_IDS.row);
  }

  /**
   * Finds transaction rows containing the requested payee.
   * @param payee Text to match within a transaction row.
   */
  matchingTransactions(payee: string): Locator {
    return this.transactionRows().filter({ hasText: payee });
  }

  /**
   * Locates a test-id cell inside a row.
   * @param row Row that contains the cell.
   * @param testId Test id identifying the cell.
   */
  transactionCell(row: Locator, testId: string): Locator {
    return row.getByTestId(testId);
  }

  /**
   * Locates the editable input inside a transaction cell.
   * @param cell Transaction cell containing the input.
   * @param role Accessible role of the input.
   */
  transactionInput(
    cell: Locator,
    role: typeof ACTUAL_UI_ROLES.textbox | typeof ACTUAL_UI_ROLES.combobox,
  ): Locator {
    return cell.getByRole(role);
  }

  /** Locates the control for adding a transaction row. */
  addNewButton(): Locator {
    return this.page.getByRole(ACTUAL_UI_ROLES.button, {
      name: ACTUAL_UI_TEXT.addNewButton,
    });
  }

  /** Locates the control that commits a newly entered transaction. */
  addTransactionButton(): Locator {
    return this.page.getByTestId(ACTUAL_TEST_IDS.addTransactionButton);
  }

  /** Locates the control that cancels transaction entry. */
  cancelButton(): Locator {
    return this.page.getByRole(ACTUAL_UI_ROLES.button, {
      name: ACTUAL_UI_TEXT.cancelButton,
      exact: true,
    });
  }

  /**
   * Locates a category suggestion.
   * @param name Category name used to identify its suggestion.
   */
  categoryItem(name: string): Locator {
    return this.page.getByTestId(
      `${name}${ACTUAL_TEST_IDS.categoryItemSuffix}`,
    );
  }

  /** Locates the Budget navigation link. */
  budgetLink(): Locator {
    return this.page.getByRole(ACTUAL_UI_ROLES.link, {
      name: ACTUAL_UI_TEXT.budgetLink,
      exact: true,
    });
  }

  /**
   * Locates an account navigation link by its name prefix.
   * @param name Account name to match.
   */
  accountLink(name: string): Locator {
    const escapedName = name.replace(
      /[.*+?^${}()|[\]\\]/g,
      ACTUAL_LOCATOR_PATTERNS.regexEscapeReplacement,
    );
    return this.page.getByRole(ACTUAL_UI_ROLES.link, {
      name: new RegExp(
        `${ACTUAL_LOCATOR_PATTERNS.accountLinkStart}${escapedName}`,
      ),
    });
  }

  /** Locates the sidebar's on-budget balance. */
  onBudgetBalance(): Locator {
    return this.page.getByTestId(ACTUAL_TEST_IDS.onBudgetBalance);
  }

  /** Locates the control that opens account creation. */
  addAccountButton(): Locator {
    return this.page.getByRole(ACTUAL_UI_ROLES.button, {
      name: ACTUAL_UI_TEXT.addAccountButton,
      exact: true,
    });
  }

  /** Locates the account-name field in the creation form. */
  accountNameInput(): Locator {
    return this.page.getByRole(ACTUAL_UI_ROLES.textbox, {
      name: ACTUAL_UI_TEXT.accountNameLabel,
    });
  }

  /** Locates the opening-balance field in the account creation form. */
  accountBalanceInput(): Locator {
    return this.page.getByRole(ACTUAL_UI_ROLES.textbox, {
      name: ACTUAL_UI_TEXT.accountBalanceLabel,
    });
  }

  /** Locates the control that submits account creation. */
  createButton(): Locator {
    return this.page.getByRole(ACTUAL_UI_ROLES.button, {
      name: ACTUAL_UI_TEXT.createButton,
    });
  }

  /** Locates the budget table. */
  budgetTable(): Locator {
    return this.page.getByTestId(ACTUAL_TEST_IDS.budgetTable);
  }

  /** Locates the element containing the selected budget month. */
  selectedBudgetMonth(): Locator {
    return this.page.getByTestId(ACTUAL_TEST_IDS.selectedBudgetMonth);
  }

  /**
   * Locates the first budget row matching a category name.
   * @param name Category or group name to match.
   */
  categoryRow(name: string): Locator {
    return this.budgetTable()
      .getByTestId(ACTUAL_TEST_IDS.row)
      .filter({ hasText: name })
      .first();
  }

  /** Locates the Usual Expenses group row. */
  usualExpensesRow(): Locator {
    return this.budgetTable()
      .getByTestId(ACTUAL_TEST_IDS.row)
      .filter({ hasText: ACTUAL_UI_TEXT.usualExpenses })
      .first();
  }

  /**
   * Locates the add-category control inside a budget group.
   * @param row Budget group row containing the control.
   */
  addCategoryButton(row: Locator): Locator {
    return row.getByRole(ACTUAL_UI_ROLES.button, {
      name: ACTUAL_UI_TEXT.addCategoryButton,
    });
  }

  /**
   * Locates the Usual Expenses label inside a budget group row.
   * @param row Budget group row containing the label.
   */
  usualExpensesLabel(row: Locator): Locator {
    return row.getByText(ACTUAL_UI_TEXT.usualExpenses, { exact: true });
  }

  /** Locates the field for entering a new category name. */
  newCategoryNameInput(): Locator {
    return this.page.getByPlaceholder(ACTUAL_PLACEHOLDERS.newCategoryName);
  }

  /**
   * Locates the budget allocation cell for a category.
   * @param name Category whose allocation is requested.
   */
  categoryBudgetCell(name: string): Locator {
    return this.categoryRow(name)
      .getByTestId(ACTUAL_TEST_IDS.budget)
      .first();
  }

  /**
   * Locates the current-month spent amount for a category.
   * @param name Category whose spent amount is requested.
   */
  categorySpent(name: string): Locator {
    return this.categoryRow(name).getByTestId(ACTUAL_TEST_IDS.categorySpent);
  }

  /**
   * Locates the remaining balance for a category.
   * @param name Category whose remaining amount is requested.
   */
  categoryRemaining(name: string): Locator {
    return this.categoryRow(name).getByTestId(ACTUAL_TEST_IDS.balance).first();
  }

  /**
   * Locates the editable input inside a budget amount cell.
   * @param cell Budget amount cell containing the input.
   */
  budgetAmountInput(cell: Locator): Locator {
    return cell.locator(ACTUAL_CSS_SELECTORS.input);
  }
}

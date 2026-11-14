/** Test ids used to locate Actual's application elements. */
export const ACTUAL_TEST_IDS = {
  accountName: 'account-name',
  accountBalance: 'account-balance',
  transactionTable: 'transaction-table',
  row: 'row',
  newTransaction: 'new-transaction',
  addTransactionButton: 'add-button',
  categoryItemSuffix: '-category-item',
  onBudgetBalance: 'sidebar-on-budget-balance',
  budgetTable: 'budget-table',
  selectedBudgetMonth: 'selected-budget-month',
  budget: 'budget',
  categorySpent: 'category-month-spent',
  balance: 'balance',
  transactionColumn: {
    date: 'date',
    debit: 'debit',
    payee: 'payee',
    notes: 'notes',
    category: 'category',
    credit: 'credit',
  },
} as const;

/** CSS selectors used when Actual does not expose a test id. */
export const ACTUAL_CSS_SELECTORS = {
  input: 'input',
} as const;

/** Regex fragments used to build safe, dynamic locator patterns. */
export const ACTUAL_LOCATOR_PATTERNS = {
  accountLinkStart: '^',
  regexEscapeReplacement: '\\$&',
} as const;

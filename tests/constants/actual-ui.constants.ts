/** Accessible roles used to query Actual's controls. */
export const ACTUAL_UI_ROLES = {
  button: 'button',
  link: 'link',
  textbox: 'textbox',
  combobox: 'combobox',
} as const;

/** Visible labels used by Actual's page objects and locators. */
export const ACTUAL_UI_TEXT = {
  noServerButton: "Don't use a server",
  startBudgetingButton: 'Start budgeting',
  addNewButton: 'Add New',
  cancelButton: 'Cancel',
  budgetLink: 'Budget',
  addAccountButton: 'Add account',
  accountNameLabel: 'Name:',
  accountBalanceLabel: 'Balance:',
  createButton: 'Create',
  addCategoryButton: 'Add category',
  usualExpenses: 'Usual Expenses',
} as const;

/** Placeholder labels used in Actual's forms. */
export const ACTUAL_PLACEHOLDERS = {
  newCategoryName: 'New category name',
} as const;

/** HTML attributes used to read Actual UI state. */
export const ACTUAL_ATTRIBUTES = {
  selectedBudgetMonth: 'data-month',
} as const;

/** Routes used by Actual's page objects. */
export const ACTUAL_ROUTES = {
  home: '/',
} as const;

/** Keyboard keys used to commit UI form edits. */
export const ACTUAL_KEYBOARD_KEYS = {
  enter: 'Enter',
  tab: 'Tab',
} as const;

/** Locator states used when waiting for Actual UI elements. */
export const ACTUAL_LOCATOR_STATES = {
  visible: 'visible',
} as const;

/** Error text emitted when Actual UI state does not match expectations. */
export const ACTUAL_ERROR_MESSAGES = {
  saveTransactionCount:
    'Saving the expense did not add exactly one transaction.',
  selectedBudgetMonthUnavailable:
    'The selected budget month is not available.',
} as const;

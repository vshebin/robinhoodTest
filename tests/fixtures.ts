import { expect, test as base } from '@playwright/test';

import { DefaultPageFactory, type PageFactory } from './pages/page-factory';

type Fixtures = {
  app: PageFactory;
};

export const test = base.extend<Fixtures>({
  app: async ({ page }, use) => {
    await use(new DefaultPageFactory(page));
  },
});

export { expect };

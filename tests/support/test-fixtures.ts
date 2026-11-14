import { expect, test as base } from '@playwright/test';

import { ActualPageFactory } from '../factories/actual-page-factory';
import type { PageFactory } from '../interfaces/page-factory.interface';

type Fixtures = {
  app: PageFactory;
};

export const test = base.extend<Fixtures>({
  app: async ({ page }, use) => {
    await use(new ActualPageFactory(page));
  },
});

export { expect };

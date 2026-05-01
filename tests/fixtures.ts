import { test as base } from '@playwright/test';
import { LoginPage, HomePage, FortunePage, LotteryPage } from '../src/pages';

export type TestFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  fortunePage: FortunePage;
  lotteryPage: LotteryPage;
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  fortunePage: async ({ page }, use) => {
    const fortunePage = new FortunePage(page);
    await use(fortunePage);
  },
  lotteryPage: async ({ page }, use) => {
    const lotteryPage = new LotteryPage(page);
    await use(lotteryPage);
  },
});

export { expect } from '@playwright/test';

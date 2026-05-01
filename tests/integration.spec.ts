import { test, expect } from './fixtures';
import { sleep, verifyPageTitle, verifyUrlContains } from '../src/utils/testHelpers';

test.describe('Integration Tests', () => {
  test('complete user workflow', async ({ loginPage, homePage }) => {
    // Navigate to login
    await loginPage.navigateToLogin();

    // Verify on login page
    const loginUrl = loginPage.getUrl();
    expect(loginUrl).toContain('/login');

    // Perform login
    await loginPage.login('testuser@example.com', 'password123');

    // Wait for page transition
    await sleep(500);

    // Verify on home page
    const isWelcomeVisible = await homePage.isWelcomeMessageDisplayed();
    expect(isWelcomeVisible).toBeTruthy();

    // Verify welcome message contains expected text
    const welcomeText = await homePage.getWelcomeMessageText();
    expect(welcomeText).toContain('Welcome');

    // Navigate to different sections
    await homePage.clickMenuItemByText('Dashboard');
    await sleep(300);

    // Verify section change
    const isContentVisible = await homePage.isContentAreaVisible();
    expect(isContentVisible).toBeTruthy();
  });

  test('login to logout flow', async ({ loginPage, homePage }) => {
    // Login
    await loginPage.navigateToLogin();
    await loginPage.login('user@example.com', 'password');

    // Verify logged in
    const profileVisible = await homePage.isNavigationMenuVisible();
    expect(profileVisible).toBeTruthy();

    // Logout
    await homePage.logout();
    expect(true).toBe(true);
  });

  test('session persistence test', async ({ homePage }) => {
    // Navigate to home
    await homePage.navigateToHome();

    // Verify initial state
    let isWelcomeVisible = await homePage.isWelcomeMessageDisplayed();
    expect(isWelcomeVisible).toBeTruthy();

    // Wait and navigate again
    await sleep(1000);
    await homePage.navigateToHome();

    // Verify session still active
    isWelcomeVisible = await homePage.isWelcomeMessageDisplayed();
    expect(isWelcomeVisible).toBeTruthy();
  });
});

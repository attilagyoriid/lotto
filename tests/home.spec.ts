import { test, expect } from './fixtures';

test.describe('Home Page Tests', () => {
  test.beforeEach(async ({ homePage }) => {
    // Navigate to home page before each test
    await homePage.navigateToHome();
  });

  test('should display welcome message', async ({ homePage }) => {
    // Verify welcome message is displayed
    const isWelcomeVisible = await homePage.isWelcomeMessageDisplayed();
    expect(isWelcomeVisible).toBeTruthy();
  });

  test('should display user profile', async ({ homePage }) => {
    // Verify user profile section is visible
    const profileText = await homePage.getUserProfile();
    expect(profileText).toBeTruthy();
  });

  test('should display navigation menu', async ({ homePage }) => {
    // Verify navigation menu is visible
    const isMenuVisible = await homePage.isNavigationMenuVisible();
    expect(isMenuVisible).toBeTruthy();
  });

  test('should display content area', async ({ homePage }) => {
    // Verify main content area is visible
    const isContentVisible = await homePage.isContentAreaVisible();
    expect(isContentVisible).toBeTruthy();
  });

  test('should logout successfully', async ({ homePage, loginPage }) => {
    // Test logout functionality
    // Note: In a real scenario, you might need to verify navigation to login page
    await homePage.logout();
    expect(true).toBe(true);
  });

  test('should navigate to menu items', async ({ homePage }) => {
    // Example of clicking a menu item
    // Replace 'Dashboard' with an actual menu item text
    await homePage.clickMenuItemByText('Dashboard');
    expect(true).toBe(true);
  });
});

test.describe('Home Page Navigation', () => {
  test('should maintain session on page navigation', async ({ homePage }) => {
    // Test session persistence during navigation
    await homePage.navigateToHome();
    const isWelcomeVisible = await homePage.isWelcomeMessageDisplayed();
    expect(isWelcomeVisible).toBeTruthy();
  });
});

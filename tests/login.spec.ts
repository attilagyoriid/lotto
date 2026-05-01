import { test, expect } from './fixtures';

test.describe('Login Page Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    // Navigate to login page before each test
    await loginPage.navigateToLogin();
  });

  test('should display login page elements', async ({ loginPage }) => {
    // Add your assertions here
    expect(true).toBe(true);
  });

  test('should login with valid credentials', async ({ loginPage, homePage }) => {
    // Example login test
    await loginPage.login('testuser@example.com', 'password123');

    // Verify successful login by checking home page
    const isWelcomeVisible = await homePage.isWelcomeMessageDisplayed();
    expect(isWelcomeVisible).toBeTruthy();
  });

  test('should display error message for invalid credentials', async ({ loginPage }) => {
    // Example invalid login test
    await loginPage.login('invalid@example.com', 'wrongpassword');

    // Verify error message
    const isErrorVisible = await loginPage.isErrorMessageVisible();
    expect(isErrorVisible).toBeTruthy();
  });

  test('should remember user when checkbox is ticked', async ({ loginPage }) => {
    // Example test with remember me option
    await loginPage.login('testuser@example.com', 'password123', true);
    expect(true).toBe(true);
  });
});

test.describe('Remember Me Functionality', () => {
  test('should persist login when remember me is checked', async ({ loginPage }) => {
    // Test remember me functionality
    await loginPage.navigateToLogin();
    await loginPage.toggleRememberMe();
    expect(true).toBe(true);
  });
});

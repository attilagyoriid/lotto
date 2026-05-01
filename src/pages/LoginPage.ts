import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  // Selectors
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly rememberMeCheckbox: Locator;

  constructor(page: Page) {
    super(page);
    // Initialize selectors
    this.usernameInput = this.page.locator("#username");
    this.passwordInput = this.page.locator("#password");
    this.loginButton = this.page.locator('button[type="submit"]');
    this.errorMessage = this.page.locator(".error-message");
    this.rememberMeCheckbox = this.page.locator("#rememberMe");
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin(): Promise<void> {
    await this.goto("/login");
  }

  /**
   * Enter username
   */
  async enterUsername(username: string): Promise<void> {
    await this.fill(this.usernameInput, username);
  }

  /**
   * Enter password
   */
  async enterPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password);
  }

  /**
   * Click login button
   */
  async clickLoginButton(): Promise<void> {
    await this.click(this.loginButton);
  }

  /**
   * Toggle remember me checkbox
   */
  async toggleRememberMe(): Promise<void> {
    await this.click(this.rememberMeCheckbox);
  }

  /**
   * Perform login with credentials
   */
  async login(
    username: string,
    password: string,
    rememberMe: boolean = false,
  ): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    if (rememberMe) {
      await this.toggleRememberMe();
    }
    await this.clickLoginButton();
    await this.waitForNavigation();
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return this.isVisible(this.errorMessage);
  }
}

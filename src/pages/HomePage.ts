import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  // Selectors
  private readonly welcomeMessage: Locator;
  private readonly userProfile: Locator;
  private readonly logoutButton: Locator;
  private readonly navigationMenu: Locator;
  private readonly contentArea: Locator;

  constructor(page: Page) {
    super(page);
    // Initialize selectors
    this.welcomeMessage = this.page.locator("text=Welcome");
    this.userProfile = this.page.locator('[data-testid="user-profile"]');
    this.logoutButton = this.page.locator('button:has-text("Logout")');
    this.navigationMenu = this.page.locator("nav");
    this.contentArea = this.page.locator("main");
  }

  /**
   * Navigate to home page
   */
  async navigateToHome(): Promise<void> {
    await this.goto("/");
  }

  /**
   * Check if welcome message is displayed
   */
  async isWelcomeMessageDisplayed(): Promise<boolean> {
    return this.isVisible(this.welcomeMessage);
  }

  /**
   * Get welcome message text
   */
  async getWelcomeMessageText(): Promise<string> {
    return this.getText(this.welcomeMessage);
  }

  /**
   * Get user profile information
   */
  async getUserProfile(): Promise<string> {
    return this.getText(this.userProfile);
  }

  /**
   * Click logout button
   */
  async logout(): Promise<void> {
    await this.click(this.logoutButton);
    await this.waitForNavigation();
  }

  /**
   * Check if navigation menu is visible
   */
  async isNavigationMenuVisible(): Promise<boolean> {
    return this.isVisible(this.navigationMenu);
  }

  /**
   * Check if content area is visible
   */
  async isContentAreaVisible(): Promise<boolean> {
    return this.isVisible(this.contentArea);
  }

  /**
   * Click menu item by text
   */
  async clickMenuItemByText(itemText: string): Promise<void> {
    const menuItem = this.page.locator(`nav button:has-text("${itemText}")`);
    await this.click(menuItem);
  }
}

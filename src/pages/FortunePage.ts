import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class FortunePage extends BasePage {
  // Selectors
  private readonly fortuneButton: Locator;
  private readonly fortuneText: Locator;
  private readonly fortuneContainer: Locator;
  private readonly resetButton: Locator;
  private readonly fortuneCount: Locator;
  private readonly shareButton: Locator;
  private readonly categorySelect: Locator;

  constructor(page: Page) {
    super(page);
    // Initialize selectors
    this.fortuneButton = this.page.locator('button:has-text("Get Fortune")');
    this.fortuneText = this.page.locator('[data-testid="fortune-text"]');
    this.fortuneContainer = this.page.locator('[data-testid="fortune-container"]');
    this.resetButton = this.page.locator('button:has-text("Reset")');
    this.fortuneCount = this.page.locator('[data-testid="fortune-count"]');
    this.shareButton = this.page.locator('button:has-text("Share")');
    this.categorySelect = this.page.locator('select[name="category"]');
  }

  /**
   * Navigate to fortune page
   */
  async navigateToFortune(): Promise<void> {
    await this.goto('/fortune');
  }

  /**
   * Click get fortune button to retrieve a fortune
   */
  async getNewFortune(): Promise<void> {
    await this.click(this.fortuneButton);
  }

  /**
   * Get the displayed fortune text
   */
  async getFortuneText(): Promise<string> {
    return this.getText(this.fortuneText);
  }

  /**
   * Check if fortune is displayed
   */
  async isFortuneDisplayed(): Promise<boolean> {
    return this.isVisible(this.fortuneText);
  }

  /**
   * Check if fortune container is visible
   */
  async isFortuneContainerVisible(): Promise<boolean> {
    return this.isVisible(this.fortuneContainer);
  }

  /**
   * Get count of fortunes retrieved
   */
  async getFortuneCount(): Promise<string> {
    return this.getText(this.fortuneCount);
  }

  /**
   * Click reset button to clear fortunes
   */
  async resetFortunes(): Promise<void> {
    await this.click(this.resetButton);
  }

  /**
   * Click share button
   */
  async shareFortune(): Promise<void> {
    await this.click(this.shareButton);
  }

  /**
   * Select fortune category
   */
  async selectCategory(category: string): Promise<void> {
    await this.selectOption(this.categorySelect, category);
  }

  /**
   * Get multiple fortunes in sequence
   */
  async getMultipleFortunes(count: number): Promise<string[]> {
    const fortunes: string[] = [];
    for (let i = 0; i < count; i++) {
      await this.getNewFortune();
      await this.page.waitForTimeout(300); // Wait for display
      const fortuneText = await this.getFortuneText();
      fortunes.push(fortuneText);
    }
    return fortunes;
  }

  /**
   * Wait for fortune to load
   */
  async waitForFortuneToLoad(): Promise<void> {
    await this.waitForElement(this.fortuneText);
  }

  /**
   * Verify fortune is not empty
   */
  async isFortuneNotEmpty(): Promise<boolean> {
    const fortuneText = await this.getFortuneText();
    return fortuneText.trim().length > 0;
  }
}

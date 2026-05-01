import { Page, Locator } from "@playwright/test";

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL path
   */
  async goto(path: string = "/"): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Get page URL
   */
  getUrl(): string {
    return this.page.url();
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Click on an element
   */
  async click(selector: string | Locator): Promise<void> {
    const locator =
      typeof selector === "string" ? this.page.locator(selector) : selector;
    await locator.click();
  }

  /**
   * Fill input field
   */
  async fill(selector: string | Locator, text: string): Promise<void> {
    const locator =
      typeof selector === "string" ? this.page.locator(selector) : selector;
    await locator.fill(text);
  }

  /**
   * Get text content
   */
  async getText(selector: string | Locator): Promise<string> {
    const locator =
      typeof selector === "string" ? this.page.locator(selector) : selector;
    return locator.textContent() ?? "";
  }

  /**
   * Check if element is visible
   */
  async isVisible(selector: string | Locator): Promise<boolean> {
    const locator =
      typeof selector === "string" ? this.page.locator(selector) : selector;
    return locator.isVisible();
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector: string | Locator): Promise<void> {
    const locator =
      typeof selector === "string" ? this.page.locator(selector) : selector;
    await locator.waitFor({ state: "visible" });
  }

  /**
   * Select option from dropdown
   */
  async selectOption(selector: string | Locator, value: string): Promise<void> {
    const locator =
      typeof selector === "string" ? this.page.locator(selector) : selector;
    await locator.selectOption(value);
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(filename: string): Promise<Buffer> {
    return this.page.screenshot({ path: filename });
  }

  /**
   * Close the page
   */
  async close(): Promise<void> {
    await this.page.close();
  }
}

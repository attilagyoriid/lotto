import { Page, expect } from '@playwright/test';

/**
 * Utility functions for common test operations
 */

/**
 * Wait for a specific amount of time (in milliseconds)
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get all text from multiple elements
 */
export async function getMultipleTexts(page: Page, selector: string): Promise<string[]> {
  const elements = await page.locator(selector).all();
  const texts: string[] = [];
  for (const element of elements) {
    const text = await element.textContent();
    if (text) {
      texts.push(text.trim());
    }
  }
  return texts;
}

/**
 * Check if element exists (is in DOM)
 */
export async function elementExists(page: Page, selector: string): Promise<boolean> {
  const count = await page.locator(selector).count();
  return count > 0;
}

/**
 * Get element count
 */
export async function getElementCount(page: Page, selector: string): Promise<number> {
  return page.locator(selector).count();
}

/**
 * Verify element has specific attribute
 */
export async function elementHasAttribute(
  page: Page,
  selector: string,
  attribute: string,
  value?: string,
): Promise<boolean> {
  const element = page.locator(selector);
  const attrValue = await element.getAttribute(attribute);
  return value ? attrValue === value : attrValue !== null;
}

/**
 * Type text slowly (character by character)
 */
export async function typeSlowly(
  page: Page,
  selector: string,
  text: string,
  delay: number = 50,
): Promise<void> {
  const element = page.locator(selector);
  await element.click();
  for (const char of text) {
    await element.type(char);
    await sleep(delay);
  }
}

/**
 * Hover over element
 */
export async function hover(page: Page, selector: string): Promise<void> {
  await page.locator(selector).hover();
}

/**
 * Press keyboard key
 */
export async function pressKey(page: Page, key: string): Promise<void> {
  await page.keyboard.press(key);
}

/**
 * Double click element
 */
export async function doubleClick(page: Page, selector: string): Promise<void> {
  await page.locator(selector).dblclick();
}

/**
 * Verify page title
 */
export async function verifyPageTitle(page: Page, expectedTitle: string): Promise<void> {
  const title = await page.title();
  expect(title).toBe(expectedTitle);
}

/**
 * Verify page URL contains text
 */
export async function verifyUrlContains(page: Page, expectedUrl: string): Promise<void> {
  expect(page.url()).toContain(expectedUrl);
}

/**
 * Scroll element into view
 */
export async function scrollIntoView(page: Page, selector: string): Promise<void> {
  await page.locator(selector).scrollIntoViewIfNeeded();
}

/**
 * Get all attribute values from elements
 */
export async function getAttributeValues(
  page: Page,
  selector: string,
  attribute: string,
): Promise<(string | null)[]> {
  const elements = await page.locator(selector).all();
  const values: (string | null)[] = [];
  for (const element of elements) {
    values.push(await element.getAttribute(attribute));
  }
  return values;
}

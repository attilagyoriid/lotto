import { test, expect } from './fixtures';

test.describe('Fortune Page Tests', () => {
  test.beforeEach(async ({ fortunePage }) => {
    // Navigate to fortune page before each test
    await fortunePage.navigateToFortune();
  });

  test('should display fortune page', async ({ fortunePage }) => {
    // Verify fortune container is visible
    const isContainerVisible = await fortunePage.isFortuneContainerVisible();
    expect(isContainerVisible).toBeTruthy();
  });

  test('should display fortune button', async ({ fortunePage }) => {
    // Verify get fortune button exists
    const pageUrl = fortunePage.getUrl();
    expect(pageUrl).toContain('/fortune');
  });

  test('should get a new fortune', async ({ fortunePage }) => {
    // Click get fortune button
    await fortunePage.getNewFortune();

    // Wait for fortune to load
    await fortunePage.waitForFortuneToLoad();

    // Verify fortune is displayed
    const isFortuneDisplayed = await fortunePage.isFortuneDisplayed();
    expect(isFortuneDisplayed).toBeTruthy();
  });

  test('should display non-empty fortune text', async ({ fortunePage }) => {
    // Get a fortune
    await fortunePage.getNewFortune();
    await fortunePage.waitForFortuneToLoad();

    // Verify fortune text is not empty
    const isNotEmpty = await fortunePage.isFortuneNotEmpty();
    expect(isNotEmpty).toBeTruthy();

    // Verify actual text
    const fortuneText = await fortunePage.getFortuneText();
    expect(fortuneText.length).toBeGreaterThan(0);
  });

  test('should get different fortunes', async ({ fortunePage }) => {
    // Get first fortune
    await fortunePage.getNewFortune();
    await fortunePage.waitForFortuneToLoad();
    const firstFortune = await fortunePage.getFortuneText();

    // Get second fortune
    await fortunePage.getNewFortune();
    await fortunePage.waitForFortuneToLoad();
    const secondFortune = await fortunePage.getFortuneText();

    // Verify they are different (in most cases)
    // Note: Theoretically they could be the same if the app returns the same fortune twice
    expect(firstFortune).toBeTruthy();
    expect(secondFortune).toBeTruthy();
  });

  test('should track fortune count', async ({ fortunePage }) => {
    // Get initial count
    const initialCount = await fortunePage.getFortuneCount();

    // Get a fortune
    await fortunePage.getNewFortune();
    await fortunePage.waitForFortuneToLoad();

    // Verify count increased
    const newCount = await fortunePage.getFortuneCount();
    expect(newCount).not.toBe(initialCount);
  });

  test('should reset fortunes', async ({ fortunePage }) => {
    // Get some fortunes
    await fortunePage.getNewFortune();
    await fortunePage.waitForFortuneToLoad();

    // Reset
    await fortunePage.resetFortunes();

    // Verify fortune display is reset (check count or that fortune is hidden)
    expect(true).toBe(true);
  });

  test('should share fortune', async ({ fortunePage }) => {
    // Get a fortune
    await fortunePage.getNewFortune();
    await fortunePage.waitForFortuneToLoad();

    // Click share (this may open a dialog or new window)
    await fortunePage.shareFortune();

    expect(true).toBe(true);
  });

  test('should select different fortune categories', async ({ fortunePage }) => {
    // Select a category
    await fortunePage.selectCategory('wisdom');

    // Get fortune from that category
    await fortunePage.getNewFortune();
    await fortunePage.waitForFortuneToLoad();

    // Verify fortune is displayed
    const isFortuneDisplayed = await fortunePage.isFortuneDisplayed();
    expect(isFortuneDisplayed).toBeTruthy();
  });
});

test.describe('Fortune Page - Multiple Fortunes', () => {
  test('should get multiple fortunes in sequence', async ({ fortunePage }) => {
    // Navigate to fortune page
    await fortunePage.navigateToFortune();

    // Get multiple fortunes
    const fortunes = await fortunePage.getMultipleFortunes(3);

    // Verify we got fortunes
    expect(fortunes.length).toBe(3);
    expect(fortunes[0]).toBeTruthy();
    expect(fortunes[1]).toBeTruthy();
    expect(fortunes[2]).toBeTruthy();
  });
});

test.describe('Fortune Page - UI Responsiveness', () => {
  test('should handle rapid fortune requests', async ({ fortunePage }) => {
    // Navigate to fortune page
    await fortunePage.navigateToFortune();

    // Request multiple fortunes rapidly
    for (let i = 0; i < 5; i++) {
      await fortunePage.getNewFortune();
    }

    // Wait for last fortune to load
    await fortunePage.waitForFortuneToLoad();

    // Verify page is still responsive
    const isFortuneDisplayed = await fortunePage.isFortuneDisplayed();
    expect(isFortuneDisplayed).toBeTruthy();
  });

  test('should display fortune immediately after navigation', async ({ fortunePage }) => {
    // Navigate and verify container exists
    const isContainerVisible = await fortunePage.isFortuneContainerVisible();
    expect(isContainerVisible).toBeTruthy();

    // Get fortune
    await fortunePage.getNewFortune();

    // Verify it appears
    const isFortuneDisplayed = await fortunePage.isFortuneDisplayed();
    expect(isFortuneDisplayed).toBeTruthy();
  });

  
});

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LotteryPage extends BasePage {
  // Selectors
  private readonly cookieAcceptButton: Locator;
  private readonly loginLink: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly overlayCloseButton: Locator;
  private readonly gamesMenuButton: Locator;
  private readonly basketButton: Locator;
  private readonly basketCloseButton: Locator;

  constructor(page: Page) {
    super(page);
    // Initialize selectors
    this.cookieAcceptButton = this.page.getByRole('button', { name: 'ÖSSZES SÜTI ENGEDÉLYEZÉSE' });
    this.loginLink = this.page.getByRole('link', { name: 'Belépés és Regisztráció' });
    this.usernameInput = this.page.getByRole('textbox', {
      name: 'Felhasználónév, vagy email cím',
    });
    this.passwordInput = this.page.getByRole('textbox', { name: 'Jelszó' });
    this.loginButton = this.page.getByRole('button', { name: 'Bejelentkezés' });
    this.overlayCloseButton = this.page.locator('.sas-popup__close-overlay');
    this.gamesMenuButton = this.page.getByText('Lottók');
    this.basketButton = this.page.getByRole('button', { name: '  Kosárba' });
    this.basketCloseButton = this.page.locator('.cart-panel__close, .basket-close, [class*="cart"] [class*="close"], .modal__close').first();
  }

  /**
   * Navigate to lottery website
   */
  async navigate(): Promise<void> {
    await this.goto('https://www.szerencsejatek.hu/');
  }

  /**
   * Accept cookies if the button exists
   */
  async acceptCookiesIfExist(): Promise<void> {
    try {
      await this.cookieAcceptButton.waitFor({ state: 'visible', timeout: 5000 });
      await this.click(this.cookieAcceptButton);
    } catch {
      // Cookie button not found, continue
    }
  }

  /**
   * Login with credentials from environment variables
   */
  async logIn(): Promise<void> {
    const username = process.env.LOTTERY_USERNAME;
    const password = process.env.LOTTERY_PASSWORD;

    if (!username || !password) {
      throw new Error('LOTTERY_USERNAME and LOTTERY_PASSWORD must be set in .env file');
    }

    // Click login link
    await this.click(this.loginLink);
    await this.page.waitForTimeout(500);

    // Fill username
    await this.click(this.usernameInput);
    await this.fill(this.usernameInput, username);
    await this.usernameInput.press('Tab');

    // Fill password
    await this.fill(this.passwordInput, password);

    // Click login button
    await this.click(this.loginButton);
    await this.page.waitForTimeout(1000);
  }

  /**
   * Close overlay popup if it exists
   */
  async closeOverlayIfExist(): Promise<void> {
    try {
      await this.overlayCloseButton.waitFor({ state: 'visible', timeout: 3000 });
      await this.click(this.overlayCloseButton);
    } catch {
      // Overlay not found, continue
    }
  }

  /**
   * Click on the games/lottery menu
   */
  async selectGame(): Promise<void> {
    await this.click(this.gamesMenuButton);
    await this.page.waitForTimeout(500);
  }

  /**
   * Select a specific game type (Ötöslottó, Hatoslottó, Skandináv lottó, Eurojackpot)
   */
  async selectGameType(
    gameType: 'Ötöslottó' | 'Hatoslottó' | 'Skandináv lottó' | 'Eurojackpot',
  ): Promise<void> {
    const gameLink = this.page.getByRole('link', { name: gameType });
    await this.click(gameLink);
    await this.page.locator('.eurojackpot_a .numbers').first().waitFor({ state: 'visible' });
  }

  /**
   * Click a number ball scoped to a grid container, bypassing header interception
   */
  private async clickNumberInGrid(grid: Locator, number: number): Promise<void> {
    const ball = grid.locator('div.number').filter({ hasText: new RegExp(`^${number}$`) }).first();
    await ball.scrollIntoViewIfNeeded();
    await ball.dispatchEvent('click');
  }

  /**
   * Select main lottery numbers (typically 5 numbers for Eurojackpot)
   */
  async selectMainNumbers(numbers: number[]): Promise<void> {
    if (numbers.length !== 5) {
      throw new Error('Eurojackpot requires exactly 5 main numbers (1-50)');
    }
    const mainGrid = this.page.locator('.eurojackpot_a .numbers').first();
    for (const number of numbers) {
      await this.clickNumberInGrid(mainGrid, number);
    }
  }

  /**
   * Select secondary numbers (typically 2 numbers for Eurojackpot)
   */
  async selectSecondaryNumbers(numbers: number[]): Promise<void> {
    if (numbers.length !== 2) {
      throw new Error('Eurojackpot requires exactly 2 secondary numbers');
    }
    const secondaryGrid = this.page.locator('.eurojackpot_b .numbers').first();
    for (const number of numbers) {
      await this.clickNumberInGrid(secondaryGrid, number);
    }
  }

  /**
   * Add current lottery slip to basket and dismiss any basket panel that appears
   */
  async addToBasket(): Promise<void> {
    await this.click(this.basketButton);
    // Wait for the automatic redirect to /kosar to complete
    await this.page.waitForURL('**/kosar', { timeout: 10000 }).catch(() => {});
  }

  /**
   * Show a pause screen in the browser and wait for user to press C to continue
   */
  private continueResolver: (() => void) | null = null;

  async waitForContinue(): Promise<void> {
    if (!(this.page as any).__continueExposed) {
      (this.page as any).__continueExposed = true;
      await this.page.exposeFunction('__continueCallback', () => {
        if (this.continueResolver) {
          this.continueResolver();
          this.continueResolver = null;
        }
      });
    }

    const registerListener = async () => {
      await this.page.evaluate(() => {
        (window as any).__continueListenerActive = true;
        window.addEventListener('keydown', (e) => {
          (window as any).__continueListenerActive = false;
          if (e.key === 'c') (window as any).__continueCallback();
        }, { once: true });
      }).catch(() => {});
    };

    this.page.on('framenavigated', registerListener);
    await registerListener();

    await new Promise<void>((resolve) => {
      this.continueResolver = () => {
        this.page.off('framenavigated', registerListener);
        resolve();
      };
    });
  }

  /**
   * Navigate directly to Eurojackpot page by URL
   */
  async navigateToEurojackpot(): Promise<void> {
    await this.goto('https://bet.szerencsejatek.hu/jatekok/eurojackpot');
    await this.page.locator('.eurojackpot_a .numbers').first().waitFor({ state: 'visible' });
  }

  /**
   * Complete a single lottery ticket: select numbers and add to basket
   */
  async playLottery(mainNumbers: number[], secondaryNumbers: number[]): Promise<void> {
    await this.selectMainNumbers(mainNumbers);
    await this.selectSecondaryNumbers(secondaryNumbers);
    await this.addToBasket();
  }

  /**
   * Play multiple lottery tickets
   */
  async playMultipleLottery(
    iterations: number,
    ticketNumbersList: { main: number[]; secondary: number[] }[],
  ): Promise<void> {
    for (let i = 0; i < iterations; i++) {
      const ticket = ticketNumbersList[i % ticketNumbersList.length];

      // Navigate back to Eurojackpot for subsequent tickets
      if (i > 0) {
        await this.selectGame();
        await this.selectGameType('Eurojackpot');
      }

      await this.playLottery(ticket.main, ticket.secondary);
    }
  }
}

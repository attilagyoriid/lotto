# Playwright TypeScript Project with Page Object Model

A comprehensive Playwright testing framework built with TypeScript, following the Page Object Model (POM) design pattern for maintainable and scalable automation.

## Project Structure

```
.
├── src/
│   └── pages/
│       ├── BasePage.ts         # Base class with common page interactions
│       ├── LoginPage.ts        # Login page object
│       ├── HomePage.ts         # Home page object
│       └── index.ts            # Page exports
├── tests/
│   ├── fixtures.ts             # Test fixtures and custom test setup
│   ├── login.spec.ts           # Login page tests
│   └── home.spec.ts            # Home page tests
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Project dependencies
└── README.md                   # This file
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Install Playwright browsers:

```bash
npx playwright install
```

## Usage

### Running Tests

Run all tests:

```bash
npm test
```

Run tests in headed mode (see browser):

```bash
npm run test:headed
```

Debug tests:

```bash
npm run test:debug
```

Generate test code using Codegen:

```bash
npm run test:codegen
```

Type check:

```bash
npm run type-check
```

### Page Object Model Pattern

#### BasePage

The `BasePage` class provides common functionality that all pages inherit:

- Navigation (`goto`, `waitForNavigation`)
- Element interactions (`click`, `fill`, `getText`, `selectOption`)
- Visibility checks (`isVisible`, `waitForElement`)
- Screenshots and page management

#### Creating a New Page Object

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyPage extends BasePage {
  private readonly myElement: Locator;

  constructor(page: Page) {
    super(page);
    this.myElement = this.page.locator('#my-element');
  }

  async clickMyElement(): Promise<void> {
    await this.click(this.myElement);
  }
}
```

#### Using Page Objects in Tests

```typescript
import { test, expect } from './fixtures';

test('my test', async ({ page }) => {
  const myPage = new MyPage(page);
  await myPage.goto('/my-page');
  await myPage.clickMyElement();
  expect(true).toBe(true);
});
```

Or using fixtures:

```typescript
test('my test with fixture', async ({ loginPage, homePage }) => {
  await loginPage.login('user', 'pass');
  await homePage.clickMenuItemByText('Dashboard');
  expect(true).toBe(true);
});
```

## Configuration

### Playwright Config

Edit `playwright.config.ts` to customize:

- Base URL
- Browsers (Chromium, Firefox, WebKit)
- Screenshot and video recording
- Traces and reporter options
- Parallelization settings

### TypeScript Config

Edit `tsconfig.json` to customize:

- Compiler options
- Path aliases (`@pages`, `@utils`, `@tests`)
- Output settings

## Best Practices

1. **Create page objects for each page/component**
   - Encapsulate all selectors and interactions
   - Provide high-level methods for tests

2. **Use fixtures for common setup**
   - Initialize pages with fixtures
   - Share setup logic across tests

3. **Keep selectors localized**
   - Store all selectors as private properties
   - Update in one place when UI changes

4. **Provide descriptive method names**
   - Methods should describe what they do
   - Use business language, not technical details

5. **Use waiting functions appropriately**
   - Wait for element visibility when needed
   - Use `waitForNavigation()` after actions that load new pages

6. **Organize tests logically**
   - Group related tests with `test.describe()`
   - Use `test.beforeEach()` and `test.afterEach()` for setup/teardown

## Example Tests

### Login Page Tests

See [tests/login.spec.ts](tests/login.spec.ts) for:

- Valid login
- Invalid credentials error handling
- Remember me functionality

### Home Page Tests

See [tests/home.spec.ts](tests/home.spec.ts) for:

- Page element visibility
- Navigation
- User profile display
- Logout functionality

## Extending the Framework

### Add a New Page Object

1. Create a new file in `src/pages/MyPage.ts`
2. Extend `BasePage`
3. Define selectors as private properties
4. Create high-level methods for test interactions
5. Export from `src/pages/index.ts`

### Add a New Fixture

Update `tests/fixtures.ts` to include your new page:

```typescript
export type TestFixtures = {
  loginPage: LoginPage;
  myPage: MyPage; // Add new page
};

export const test = base.extend<TestFixtures>({
  myPage: async ({ page }, use) => {
    const myPage = new MyPage(page);
    await use(myPage);
  },
});
```

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [TypeScript Documentation](https://www.typescriptlang.org)

## License

ISC

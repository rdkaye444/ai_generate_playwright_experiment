# Playwright Testing Setup

This project is set up for end-to-end testing using [Playwright](https://playwright.dev/), a modern testing framework that supports testing across multiple browsers.

## Features

- ✅ Cross-browser testing (Chrome, Firefox, Safari, Edge)
- ✅ Mobile device testing
- ✅ API testing capabilities
- ✅ Visual regression testing with screenshots
- ✅ Page Object Pattern examples
- ✅ Custom fixtures and test utilities
- ✅ Comprehensive reporting
- ✅ CI/CD ready configuration

## Project Structure

```
playwright_agent/
├── tests/                      # Test files
│   ├── example.spec.js         # Basic browser testing examples
│   ├── api.spec.js            # API testing examples
│   ├── page-objects.spec.js   # Page Object Pattern examples
│   └── fixtures.js            # Reusable test data and utilities
├── playwright.config.js       # Playwright configuration
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## Installation

The project is already set up with all necessary dependencies. If you need to reinstall:

```bash
npm install
npx playwright install
```

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests with UI mode (interactive)
npm run test:ui

# Run tests in debug mode
npm run test:debug
```

### Browser-Specific Tests

```bash
# Run tests only in Chrome
npm run test:chrome

# Run tests only in Firefox
npm run test:firefox

# Run tests only in Safari
npm run test:safari
```

### Advanced Commands

```bash
# Run specific test file
npx playwright test tests/example.spec.js

# Run tests matching a pattern
npx playwright test --grep "API"

# Run tests in specific project
npx playwright test --project=chromium

# Run tests with specific number of workers
npx playwright test --workers=2

# Generate code from browser interactions
npx playwright codegen https://example.com
```

## Test Examples

### 1. Basic Browser Testing (`tests/example.spec.js`)

Demonstrates:
- Page navigation and assertions
- Element interactions
- Form filling
- Screenshot capture
- Mobile viewport testing

### 2. API Testing (`tests/api.spec.js`)

Demonstrates:
- HTTP requests (GET, POST, PUT, DELETE)
- Response validation
- Headers and authentication
- Performance testing

### 3. Page Object Pattern (`tests/page-objects.spec.js`)

Demonstrates:
- Reusable page components
- Clean test organization
- Maintainable test code

## Configuration

The `playwright.config.js` file includes:

- **Multiple browsers**: Chrome, Firefox, Safari, Edge
- **Mobile devices**: Pixel 5, iPhone 12
- **Visual testing**: Screenshots and videos on failure
- **Reporting**: HTML, JUnit, and list reporters
- **Parallel execution**: Tests run in parallel for speed
- **Retry logic**: Automatic retries on CI

## Test Data and Fixtures

The `tests/fixtures.js` file provides:

- **Test data**: Reusable user data, URLs, timeouts
- **Custom fixtures**: Enhanced page and API request objects
- **Helper functions**: Common testing utilities

## Reports

After running tests, you can view detailed reports:

```bash
# Open HTML report
npm run report

# Reports are generated in:
# - playwright-report/ (HTML report)
# - test-results/ (screenshots, videos, traces)
```

## Best Practices

### 1. Writing Tests

- Use descriptive test names
- Keep tests independent and atomic
- Use Page Object Pattern for complex applications
- Add proper assertions with meaningful error messages

### 2. Element Selection

```javascript
// Prefer role-based selectors
page.getByRole('button', { name: 'Submit' })

// Use text content when appropriate
page.getByText('Welcome')

// Use data-testid for complex elements
page.getByTestId('user-profile')

// Avoid CSS selectors when possible
page.locator('.complex-selector')
```

### 3. Waiting Strategies

```javascript
// Wait for element to be visible
await expect(page.getByText('Loading...')).toBeHidden();

// Wait for network to be idle
await page.waitForLoadState('networkidle');

// Wait for specific condition
await page.waitForFunction(() => window.ready === true);
```

## Debugging

### Debug Mode

```bash
npm run test:debug
```

This opens the Playwright Inspector where you can:
- Step through tests
- Inspect page elements
- View console logs
- Generate selectors

### Browser Development Tools

```bash
# Run with browser dev tools
npx playwright test --headed --slowMo=1000
```

### Screenshots and Videos

Failed tests automatically capture:
- Screenshots
- Videos (on retry)
- Trace files for debugging

## CI/CD Integration

The configuration is CI-ready with:

- **Retry logic**: Tests retry 2 times on CI
- **Parallel execution**: Controlled worker count
- **JUnit reports**: For CI integration
- **Artifact collection**: Screenshots and videos

### GitHub Actions Example

```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run tests
  run: npm test

- name: Upload report
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## Common Issues

### 1. Browser Installation

If you get browser installation errors:

```bash
npx playwright install
```

### 2. Permission Issues

On some systems, you might need:

```bash
npx playwright install --with-deps
```

### 3. Network Issues

For tests requiring internet access, ensure your network allows connections to test sites.

## Contributing

When adding new tests:

1. Follow the existing naming conventions
2. Add appropriate test descriptions
3. Use the fixtures and helpers when possible
4. Update this README if adding new patterns

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Selectors Guide](https://playwright.dev/docs/selectors) 
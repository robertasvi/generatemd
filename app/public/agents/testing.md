When creating or modifying features, the agent must write corresponding Playwright tests following these conventions based on TDD.

```typescript
// Example test expectation structure for agent-generated tests
import { test, expect } from '@playwright/test';

test.describe('Financial Self-Service Report Generation', () => {
  test('should require 2FA prior to loading sensitive reports', async ({ page }) => {
    // 1. Authenticate user without 2FA step
    await page.goto('/reports/summary');
    
    // 2. Expect redirection to 2FA verification page
    await expect(page).toHaveURL(/.*\/auth\/2fa-verify/);
    
    // 3. Complete 2FA and verify report table loads from Redis endpoint
    await page.fill('input[name="totpCode"]', '123456');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('app-financial-report-table')).toBeVisible();
  });
});
```

### Flakiness Prevention 

Use Playwright auto-waiting assertions (toBeVisible(), toHaveURL()) rather than arbitrary page.waitForTimeout().

### Accessibility Tests

Include basic axe-playwright checks on report tables to guarantee accessible colors, screen-reader table headers, and keyboard navigation.
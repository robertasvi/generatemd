# AGENTS.md: Self-Service Financial Reporting Engine

## Operational Purpose & Scope
This repository houses the customer-facing **Self-Service Financial Reporting Application**. It enables authorized users with active **Two-Step Verification (2FA)** to query, generate, and view detailed financial reports and automated insights without requiring assistance from client support.

---

## 1. Stack & Architectural Guidance

| Layer | Technology | Key Architectural Guidelines |
| :--- | :--- | :--- |
| **Frontend** | Angular 21 (TypeScript) | • Use Standalone Components and Signals for local state management.<br>• Enforce strict lazy loading for reporting modules.<br>• Utilize Angular's native i18n pipes for currency, percentage, and localized date formatting. |
| **Data & Cache** | Redis Database | • **Read Strategy:** Read through the Redis cache layer first for pre-aggregated reporting metrics.<br>• **Key Namespacing:** Enforce strict key structures: `user:{userId}:reports:{reportType}:{hash}`.<br>• **TTL Policy:** Always set explicit TTLs (Time-To-Live) on financial caches to prevent stale data visibility. |
| **Infrastructure** | Google Cloud Platform (GCP) | • App hosted on scalable GCP services (e.g., Cloud Run / GKE with auto-scaling).<br>• Write stateless Angular/TS API adapters to support horizontal scaling.<br>• Ensure zero-downtime deployment compatibility. |
| **Testing** | Playwright | • All end-to-end (E2E) user flows (login, 2FA prompt, report generation, download) must have matching Playwright tests.<br>• Mock external GCP and auth calls in E2E environments where appropriate. |

---

## 2. Mandatory Security & 2FA Guardrails (CRITICAL)

Financial self-service requires zero compromises on security. The agent must enforce the following rules in every code generation or modification task:

> ⚠️ **Strict Authorization Rule:**
> Users **MUST NOT** access financial datasets, reports, or insight APIs unless both conditions are met:
> 1. Valid Session / OAuth JWT token is verified.
> 2. `twoFactorAuthenticated: true` flag is verified in the session claim.

*   **2FA Verification Enforcement:**
    *   If a request reaches a financial reporting API without a validated 2FA step, return `403 Forbidden` with error code `ERR_2FA_REQUIRED`.
    *   Never generate bypass mechanisms or conditional debug flags that turn off 2FA in production or staging paths.
*   **Data Masking & PII:**
    *   Mask account identifiers in UI displays and logs: `****-****-9876`.
    *   Never write PII, unmasked bank accounts, or raw user metrics into console logs, telemetry, or unencrypted Redis keys.
*   **Rate Limiting & Abuse Prevention:**
    *   Ensure self-service export/generation endpoints utilize Redis-backed sliding-window rate limiters to prevent data scraping or denial-of-service.

---

## 3. Financial Data & Insight Engine Rules

When writing code that calculates financial figures or presents automated insights:

*   **Precision & Rounding:**
    *   Never perform financial arithmetic using native floating-point numbers (`number`).
    *   Use scaled integer math (e.g., handling cents as integers) or a dedicated decimal library (e.g., `big.js` / `decimal.js`).
*   **Insight Framing (Compliance):**
    *   Insights must be purely **descriptive and observational** (e.g., *"Your recurring vendor expenses increased by 12% compared to last month"*).
    *   **Prohibited:** Prescriptive financial advice or recommendations (e.g., *"You should terminate contract X"* or *"Invest remaining funds in Y"*).
*   **Cache Invalidation:**
    *   When user settings, custom report configurations, or underlying transaction syncs occur, issue targeted Redis key invalidations immediately.

---

## 4. Playwright Testing Standards

When creating or modifying features, the agent must write corresponding **Playwright** tests following these conventions:

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

- Flakiness Prevention: Use Playwright auto-waiting assertions (toBeVisible(), toHaveURL()) rather than arbitrary page.waitForTimeout().

- Accessibility Tests: Include basic axe-playwright checks on report tables to guarantee accessible colors, screen-reader table headers, and keyboard navigation.

### 5. Agent Workflow Checklist

Before submitting a pull request or completing a task, the agent must verify:
[ ] TypeScript code compiles cleanly with strict mode enabled (noImplicitAny: true).
[ ] Angular 21 best practices (Signals, Standalone API) are followed.
[ ] Redis caching strategy is defined for any new financial endpoint.
[ ] 2FA check is explicitly present in API authorization gates.
[ ] Playwright E2E test covers the happy path and unauthenticated / no-2FA edge cases.
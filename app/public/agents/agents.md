Strict Authorization Rule

Users MUST NOT access financial datasets, reports, or insight APIs unless both conditions are met:
1. Valid Session / OAuth JWT token is verified.
2. `twoFactorAuthenticated: true` flag is verified in the session claim.

2FA Verification Enforcement

If a request reaches a financial reporting API without a validated 2FA step, return `403 Forbidden` with error code `ERR_2FA_REQUIRED`.
Never generate bypass mechanisms or conditional debug flags that turn off 2FA in production or staging paths.

Data Masking & PII

Mask account identifiers in UI displays and logs: `****-****-9876`.
Never write PII, unmasked bank accounts, or raw user metrics into console logs, telemetry, or unencrypted Redis keys.

Rate Limiting & Abuse Prevention:

Ensure self-service export/generation endpoints utilize Redis-backed sliding-window rate limiters to prevent data scraping or denial-of-service.

When writing code that calculates financial figures or presents automated insights:

Precision & Rounding

Never perform financial arithmetic using native floating-point numbers (`number`).
Use scaled integer math (e.g., handling cents as integers) or a dedicated decimal library (e.g., `big.js` / `decimal.js`).

Agent Workflow Checklist

Before submitting a pull request or completing a task, the agent must verify:
1. TypeScript code compiles cleanly with strict mode enabled (noImplicitAny: true).
2. Angular 21 best practices (Signals, Standalone API) are followed.
3. Redis caching strategy is defined for any new financial endpoint.
4. 2FA check is explicitly present in API authorization gates.
5. Playwright E2E test covers the happy path and unauthenticated / no-2FA edge cases.
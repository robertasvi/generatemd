### Frontend

- Angular 21 (TypeScript) 
- Use Standalone Components and Signals for local state management.
- Enforce strict lazy loading for reporting modules.
- Utilize Angular's native i18n pipes for currency, percentage, and localized date formatting. 

### Data & Cache 

- Redis Database
- Read Strategy: Read through the Redis cache layer first for pre-aggregated reporting metrics.
- Key Namespacing: Enforce strict key structures: `user:{userId}:reports:{reportType}:{hash}`.
- TTL Policy: Always set explicit TTLs (Time-To-Live) on financial caches to prevent stale data visibility.

### Infrastructure

- Google Cloud Platform (GCP)
- App hosted on scalable GCP services (e.g., Cloud Run / GKE with auto-scaling).
- Write stateless Angular/TS API adapters to support horizontal scaling.
- Ensure zero-downtime deployment compatibility. 

### Testing

- Playwright
- All end-to-end (E2E) user flows (login, 2FA prompt, report generation, download) must have matching Playwright tests.
- Mock external GCP and auth calls in E2E environments where appropriate.
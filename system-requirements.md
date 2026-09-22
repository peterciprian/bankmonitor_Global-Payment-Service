# Next-Gen Payment Gateway - System Requirements

## Technical Stack
- **Backend:** Java 21, Spring Boot 4.x, H2 (In-Memory SQL, Postgres dialect), Maven, Resilience4j.
- **Frontend:** Next.js 15+ (App Router), TypeScript, Material UI (MUI), Styled Components.
- **State Management / Data Fetching:** React Query (TanStack Query) v5+.

## Core Functional Requirements
1. **Accounts & Currency Support:**
   - Create user accounts with an initial balance and currency (EUR, USD, HUF).
   - Display existing accounts with real-time balance updates.
2. **Transfer Logic (`POST /api/transfers`):**
   - Execute transfers between two accounts.
   - For cross-currency transfers, fetch rates from a flaky external FX API.
   - Flaky API Handling: Handle 503 errors and network delays gracefully using Circuit Breaker & Retry.
3. **Strict Idempotency:**
   - Every transfer request MUST include an `X-Idempotency-Key` header.
   - Key states: `PROCESSING` (returns 409 Conflict if a duplicate arrives), `SUCCESS` (returns the cached 201 Created response), `FAILED` (allows retry).
4. **System Integration (Event-Driven):**
   - External domains (Fraud, Notification) must be notified of all successful transfers.
   - **Pattern:** Transactional Outbox Pattern must be used to guarantee At-Least-Once delivery.

## Non-Functional & Quality Attributes
1. **Concurrency & Data Integrity:**
   - High-throughput protection against race conditions using **Pessimistic Locking (`SELECT FOR UPDATE`)** on Accounts.
   - Deadlock avoidance: Accounts must always be locked in ascending order of their IDs.
2. **Accessibility & Robustness:**
   - Frontend must use Material UI components to ensure enterprise-grade accessibility (WCAG / WAI-ARIA) and deep UI scalability.

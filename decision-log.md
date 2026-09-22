# Architectural Decision Log (ADR)

## 1. Next.js App Router + MUI + Styled Components
- **Context:** The application needs a robust, enterprise-ready UI foundation.
- **Decision:** Chosen Next.js for structural scalability and SEO/SSR readiness, paired with MUI for comprehensive accessibility (WAI-ARIA compliance) and Styled Components for isolated, dynamic component styling.
- **Consequences:** Requires careful configuration of the Next.js registry to handle CSS-in-JS injection during server-side rendering to avoid layout shifts.

### Task 7 implementation choice
- **Decision:** Use MUI's `styled()` utility with object syntax, backed by Emotion, and wrap the App Router tree with MUI's `AppRouterCacheProvider`.
- **Reasoning:** This is MUI's supported App Router integration, keeps style generation in the Emotion cache, and avoids a duplicate hand-rolled SSR registry. The styled factory lives in a client component because MUI v6 exposes it as a client boundary.

### Task 8 implementation choice
- **Decision:** Use the standard MUI `Table` and React Hook Form with Zod validation.
- **Reasoning:** The current accounts list needs semantic, responsive tabular rendering without the bundle and operational complexity of `@mui/x-data-grid`. React Hook Form and Zod provide typed field validation with a small, extensible form surface.

### Next.js mock backend choice
- **Decision:** Use a typed `globalThis` singleton with seeded mock accounts, transactions, and idempotency records. Use deterministic exchange rates with a 2-second cross-currency delay, plus a separate explicit fixed-503 helper for failure tests.
- **Reasoning:** The singleton survives normal development HMR reloads without adding infrastructure. Successful conversion is needed for the normal transfer flow, while the separate failure helper preserves deterministic resilience testing without making every FX transfer fail.

### Task 9 implementation choice
- **Decision:** Store the active idempotency UUID in page-owned React state, preserve it for retries and failures, and rotate it only after HTTP 201 success. Lock form inputs during mutation and expose explicit retry handling for network failures and 503 responses.
- **Reasoning:** State makes the key lifecycle explicit and testable while ensuring re-renders do not change it. UI locking prevents duplicate submits, and explicit retry preserves the server's idempotency contract.

### Task 10 implementation choice
- **Decision:** Return transactions in a `{ data, pagination }` envelope and use MUI `Table` with `TablePagination` rather than `@mui/x-data-grid`.
- **Reasoning:** Explicit server pagination metadata keeps the API contract ready for the real backend. The standard table is sufficient for the current ledger, preserves bundle size, and provides direct control over accessible responsive rendering.

### Task 6 implementation choice
- **Decision:** Use a Spring MVC `HandlerInterceptor` for `X-Idempotency-Key` enforcement and Bean Validation annotations on controller DTO records.
- **Reasoning:** The interceptor can return `400`, `409`, or a cached `201` response before the business service is invoked. `@Valid` with `@NotNull`, `@Positive`, and `@Digits` keeps malformed transfer requests out of the service layer while remaining straightforward to verify with `@WebMvcTest`.

## 2. Pessimistic Locking over Optimistic Locking
- **Context:** High-concurrency financial ledger updates on account balances.
- **Decision:** Used `@Lock(LockModeType.PESSIMISTIC_WRITE)` (`SELECT FOR UPDATE`).
- **Reasoning:** Optimistic locking (`@Version`) fails frequently under high contention, forcing high retry rates on the client. Pessimistic locking queues requests at the DB level, ensuring strict consistency and deterministic performance.

## 3. Transactional Outbox Pattern
- **Context:** Informing Fraud Detection and Notification systems safely.
- **Decision:** Instead of making HTTP/Message broker calls inside the database transaction (which causes dual-write failures if the broker is down), events are committed to an `outbox` table in the *same* transaction as the transfer. A decoupled process relays them later.

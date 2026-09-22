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
- **Decision:** Use a typed `globalThis` singleton with seeded mock accounts, transactions, and idempotency records. Use an always-fixed FX simulation with a 2-second delay and HTTP 503 for cross-currency transfers.
- **Reasoning:** The singleton survives normal development HMR reloads without adding infrastructure. Fixed simulation behavior keeps local manual testing and automated tests deterministic while still exercising the retry/error path.

## 2. Pessimistic Locking over Optimistic Locking
- **Context:** High-concurrency financial ledger updates on account balances.
- **Decision:** Used `@Lock(LockModeType.PESSIMISTIC_WRITE)` (`SELECT FOR UPDATE`).
- **Reasoning:** Optimistic locking (`@Version`) fails frequently under high contention, forcing high retry rates on the client. Pessimistic locking queues requests at the DB level, ensuring strict consistency and deterministic performance.

## 3. Transactional Outbox Pattern
- **Context:** Informing Fraud Detection and Notification systems safely.
- **Decision:** Instead of making HTTP/Message broker calls inside the database transaction (which causes dual-write failures if the broker is down), events are committed to an `outbox` table in the *same* transaction as the transfer. A decoupled process relays them later.

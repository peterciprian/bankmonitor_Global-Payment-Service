# Architectural Decision Log (ADR)

## 1. Next.js App Router + MUI + Styled Components
- **Context:** The application needs a robust, enterprise-ready UI foundation.
- **Decision:** Chosen Next.js for structural scalability and SEO/SSR readiness, paired with MUI for comprehensive accessibility (WAI-ARIA compliance) and Styled Components for isolated, dynamic component styling.
- **Consequences:** Requires careful configuration of the Next.js registry to handle CSS-in-JS injection during server-side rendering to avoid layout shifts.

## 2. Pessimistic Locking over Optimistic Locking
- **Context:** High-concurrency financial ledger updates on account balances.
- **Decision:** Used `@Lock(LockModeType.PESSIMISTIC_WRITE)` (`SELECT FOR UPDATE`).
- **Reasoning:** Optimistic locking (`@Version`) fails frequently under high contention, forcing high retry rates on the client. Pessimistic locking queues requests at the DB level, ensuring strict consistency and deterministic performance.

## 3. Transactional Outbox Pattern
- **Context:** Informing Fraud Detection and Notification systems safely.
- **Decision:** Instead of making HTTP/Message broker calls inside the database transaction (which causes dual-write failures if the broker is down), events are committed to an `outbox` table in the *same* transaction as the transfer. A decoupled process relays them later.

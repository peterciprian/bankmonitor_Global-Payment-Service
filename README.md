# Next-Gen Payment Gateway MVP

## Architecture and Technical Decisions

### Backend
Choosing **Spring Boot 4.x and Java 21** is a core requirement for enterprise environments. By leveraging Java 21 **Virtual Threads**, blocking I/O operations caused by the flaky external FX API do not consume OS-level threads. This allows the system to scale under massive concurrent load without the overhead of reactive programming.
- **Rejected:** Spring WebFlux (Reactive Stack). Reactive programming introduces high cognitive load and a complex codebase. Virtual Threads now handle high-concurrency blocking I/O more efficiently and with simpler imperative code.

### Frontend
**Next.js 15+ (App Router)** provides the structured directory layout, file-based routing, and modular architecture needed for an enterprise dashboard. **Material UI (MUI)** guarantees strict accessibility (Accessibility / WAI-ARIA compliance) out of the box and a highly scalable design system. **Styled Components** offers clean, isolated component-level styling.
- **Rejected:** Tailwind CSS. While excellent for rapid prototyping, MUI’s robust component architecture and built-in accessibility features provide a more stable and scalable foundation for long-term enterprise systems.

---

## Edge Case Handling

### 1. Resilience (Flaky FX API)
Errors and network delays from the external currency exchange API are managed using the **Resilience4j Circuit Breaker and Retry** patterns. After 3 failed network attempts, the circuit opens, preventing thread exhaustion and returning an immediate error to the user (or falling back to a cached baseline exchange rate).

### 2. Concurrency and Data Integrity
- **Race Conditions:** If multiple transfer requests attempt to debit funds from the same account simultaneously, JPA **Pessimistic Locking** (`SELECT FOR UPDATE`) locks the rows and queues the requests at the database level.
- **Deadlock Prevention:** If Account `A` transfers to Account `B` at the exact same millisecond that Account `B` transfers to Account `A`, the system locks the database records in ascending order of their IDs. Both threads will attempt to lock the lower ID first, forcing one to wait and preventing circular lock dependency (deadlock).

### 3. Reliability (Idempotency)
The `X-Idempotency-Key` header is backed by a three-state database state machine (`PROCESSING` -> `SUCCESS` / `FAILED`). This guarantees that any client retry following a dropped network connection will never result in double-charging an account.

---

## Production Readiness (Next Steps)

If this were a full development sprint instead of a 10–12 hour MVP, we would implement the following production-grade features:
1. **Distributed Idempotency and Cache:** Offload the idempotency keys and cached response payloads from the relational database into a distributed **Redis** cluster to reduce primary DB load.
2. **True Event Relay (Outbox Pattern):** Replace the built-in Spring Scheduler with a **Debezium + Kafka** infrastructure. This setup reads Outbox events directly from the database Transaction Log (WAL), ensuring zero-loss, real-time asynchronous event publishing.
3. **Security (OAuth2 / OIDC):** Integrate Spring Security with JWT token-based authentication and Role-Based Access Control (RBAC) enforced at both the backend endpoints and the Next.js middleware layer.
4. **Immutable Audit Log:** Introduce an append-only audit table tracking every balance modification for regulatory compliance and financial auditing.

---

## Current Implementation Status

### Task 1 — Backend Domain Models, Locking & Unit Tests
Completed in this workspace:
- `Account` JPA entity with validation and balance mutation rules
- `Transfer` JPA entity and `TransferStatus` state model
- `AccountRepository.findByIdForUpdate` using `@Lock(LockModeType.PESSIMISTIC_WRITE)`
- `AccountTest` covering valid debit/credit behavior, negative/zero validation, and insufficient-funds failure cases

> Verification note: the workspace has no Java/Maven toolchain available in this environment, so a real `mvn test` run could not be executed here. The editor reports no Java syntax errors in the generated files.

### Task 7 — Frontend Boilerplate (Next.js + MUI styled + Emotion SSR)
The frontend foundation is implemented under `frontend/` using the App Router. It includes:
- Next.js 15 App Router layout with responsive MUI App Bar and navigation drawers
- MUI v6 theme and accessibility-oriented components
- MUI `styled()` object syntax for application-level styling
- MUI `AppRouterCacheProvider` for server-side Emotion style collection and FOUC prevention
- TanStack React Query v5 provider
- Vitest + React Testing Library smoke test

### Task 8 — Accounts Dashboard
The accounts dashboard is implemented under `frontend/src/app/accounts/` with:
- A responsive MUI `Table` for account data
- `Skeleton` loading rows and an `Alert` error state
- An accessible create-account dialog using React Hook Form and Zod
- TanStack Query hooks using `userId` as the account identifier
- MSW component tests covering account rendering and the create-account POST payload

---

## How to Build, Run, and Test

### Running the Backend
```bash
cd backend

# Compile and run all tests (Maven)
./mvnw clean test

# Start the application (with H2 in-memory database)
./mvnw spring-boot:run
```

### Running the Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start the Next.js App Router development server
npm run dev

# Run the Vitest smoke test
npm test
```

Task 8 uses `react-hook-form`, `zod`, `@hookform/resolvers`, and `msw`; these are installed in `frontend/package.json`. No additional environment variables are required.

### Task 9 — Transfer Screen
The transfer screen is available at `/transfer`. It preserves one `X-Idempotency-Key` UUID across network failures, HTTP 503 responses, and retries, then rotates the key only after HTTP 201 success. Inputs lock during submission, conflicts show a warning, and retryable failures preserve the form and key.

Run the Playwright E2E test from `frontend/`:
```bash
npm run test:e2e
```
The first Playwright run may require `npx playwright install chromium` to install the local browser.

### Next.js mock backend
Until the Spring Boot backend is available, the frontend provides server-side App Router mock endpoints backed by a `globalThis` singleton:
- `GET/POST /api/accounts`
- `POST /api/transfers` with strict `X-Idempotency-Key` handling
- `GET /api/transactions?page=1&limit=10`

The store starts with deterministic sample accounts and persists across normal development-mode HMR reloads. Its data resets when the Next.js process restarts. Same-currency transfers succeed immediately; cross-currency transfers use a fixed 2-second delay and deterministic rates (`EUR/USD 1.08`, `EUR/HUF 395`, `USD/HUF 366`, with inverse rates defined explicitly), then debit the source amount and credit the converted target amount. The simulator also retains an explicit fixed-503 helper for isolated resilience-failure tests.

The frontend production build can be checked with `npm run build` from the `frontend/` directory.

### Project layout
```text
backend/
  pom.xml
  src/main/java/com/bankmonitor/paymentgateway/
  src/test/java/com/bankmonitor/paymentgateway/
frontend/
  package.json
  src/app/
    layout.tsx
    page.tsx
    providers.tsx
    registry.tsx (compatibility alias for AppRouterCacheProvider)
    theme.ts
    layout.test.tsx
    accounts/
      page.tsx
      page.test.tsx
      transfer/
        page.tsx
      src/hooks/useTransfers.ts
      src/__tests__/transfer.e2e.test.ts
  src/components/CreateAccountDialog.tsx
  src/hooks/useAccounts.ts
```

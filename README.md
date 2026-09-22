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

## How to Build, Run, and Test

### Running the Backend
```bash
# Compile and run all tests (Maven)
./mvnw clean test

# Start the application (with H2 in-memory database)
./mvnw spring-boot:run
```

### Running the Frontend
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

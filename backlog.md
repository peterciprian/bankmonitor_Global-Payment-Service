# Project Backlog & Copilot Prompts (Implementation + Testing Integrated)

- [x] Task 1: Backend Domain Models & Repository with Pessimistic Locking + Unit Tests
- [ ] Task 2: Idempotency Engine, Database Status Machine + Integration Tests
- [ ] Task 3: Transfer Service with Deadlock Prevention + Real PostgreSQL Concurrency Tests
- [ ] Task 4: Resilient FX External Client with Resilience4j + Integration Mock Tests
- [ ] Task 5: Transactional Outbox Pattern implementation + Scheduler Integration Tests
- [ ] Task 6: REST Controller & Idempotency Filter + WebMvc Spring Tests
- [x] Task 7: Next.js 15 Boilerplate with MUI v6 & Styled Components + SSR Hydration Smoke Test
- [x] Task 8: Accounts Dashboard Screen + Component Tests (MUI + MSW)
- [x] Task 9: Transfer Screen with Idempotency Form + Playwright E2E Network Failure Test
- [ ] Task 10: Transaction History Screen with Pagination + Visual Grid Component Tests

---

## Technical Prompts for GitHub Copilot

### Prompt for Task 1: Backend Domain Models, Locking & Unit Tests
"Act as a Principal Java Engineer. Based on #file:system-requirements.md and #file:testing-guidelines.md, generate the JPA entities for `Account` and `Transfer`. Create the `AccountRepository` interface and implement a `findByIdForUpdate` method using `@Lock(LockModeType.PESSIMISTIC_WRITE)`. 
ALSO, generate a complete JUnit 5 unit test class (`AccountTest`) WITHOUT Spring Context to test domain logic in isolation. Cover: valid debit/credit state transitions, validation blocking negative/zero transfer amounts, and ensuring `InsufficientFundsException` is thrown when balance is lower than debit amount."

### Prompt for Task 2: Idempotency Engine & Integration Tests
"Act as a Lead Backend Architect. Based on #file:system-requirements.md, generate the `IdempotencyKey` entity (fields: key string, status Enum [PROCESSING, SUCCESS, FAILED], responseBody string, responseStatusCode int, createdAt). Create the repository and a service layer that manages the idempotency lifecycle. 
ALSO, write a Spring Boot `@DataJpaTest` integration test. Test the database unique constraint behavior: simulate two rapid database writes with the identical key to ensure the unique key constraint works, and test status state transitions (`PROCESSING` -> `SUCCESS`)."

### Prompt for Task 3: Transfer Service & Advanced Concurrency Test (Testcontainers)
"Act as a Senior Financial Software Engineer. Implement the core `TransferService.processTransfer(TransferRequest req)` method. To prevent deadlocks under heavy concurrent load, it MUST lock the accounts in ascending order of their IDs. 
ALSO, write an advanced concurrency integration test using `@SpringBootTest` and Testcontainers (PostgreSQL). Set up a concurrent load test using `ExecutorService` and a `CountDownLatch` with 32 parallel threads. Set up Account A (\$1000) and Account B (\$1000). Have 16 threads simultaneously transfer \$100 from A to B, and 16 threads transfer \$100 from B to A. Assert that NO Deadlocks are thrown due to our ordered locking strategy, and verify the mathematical accuracy of final balances."

### Prompt for Task 4: Resilient FX Client & Resiliency Tests
"Act as a Cloud Resilience Expert. Implement the `ExchangeRateClient` using Spring Boot 4.x RestClient calling a flaky external API. Configure a Resilience4j `@CircuitBreaker` and `@Retry` mechanism. 
ALSO, write an integration test using Spring's `RestClientTest` or WireMock. Simulate 3 consecutive HTTP 503 errors to verify that the Retry mechanism triggers, and simulate a sustained outage to assert that the Circuit Breaker opens and falls back to either a hardcoded baseline rate or throws a specific `ExternalServiceUnavailableException`."

### Prompt for Task 5: Transactional Outbox & Scheduler Tests
"Act as an Event-Driven Architecture Expert. Implement the Transactional Outbox pattern. Create an `OutboxEvent` entity. In `TransferService`, inside the same database transaction as the transfer, save a new event. Create a background worker using Spring's `@Scheduled` that reads these events and flags them as processed. 
ALSO, write an integration test verifying that if the transfer business transaction succeeds, an outbox record is strictly present, but if the transfer fails (e.g., due to insufficient funds), the outbox write is successfully rolled back."

### Prompt for Task 6: REST Controller & Idempotency WebMvc Tests
"Act as an API Design Expert. Create the `TransferController` and a Spring MVC `HandlerInterceptor` or a Filter that intercepts `POST /api/transfers`. It must extract the `X-Idempotency-Key` header, passing it to the Idempotency Engine. 
ALSO, write web layer tests using `@WebMvcTest`. Test three HTTP scenarios: 
1. Missing header returns 400 Bad Request.
2. An active `PROCESSING` status key returns 409 Conflict.
3. A `SUCCESS` status key returns the cached response directly without hitting the service layer."

### Prompt for Task 7: Next.js + MUI + Styled Components Boilerplate & Hydration Test
"Act as a Frontend Architect. Set up a Next.js 15+ (App Router) project structure. Configure Material UI (MUI v6) and Styled Components to work seamlessly together with Server and Client Components, resolving SSR hydration issues. 
ALSO, create a smoke test using Vitest and React Testing Library to verify that the Root Layout, custom MUI theme provider, and navigation components render server-side and client-side without any CSS-in-JS injection errors or styling flashes."

### Prompt for Task 8: Accounts Dashboard Screen & Component Tests (MSW)
"Act as a Senior Frontend Developer. Create the `/accounts` page in Next.js. Use TanStack React Query to fetch the list of accounts. Display them using an accessible MUI `Table` component with `Skeleton` loading states. Implement a 'Create Account' feature inside an accessible MUI `Dialog` modal. 
ALSO, write frontend component tests using Vitest, React Testing Library, and MSW (Mock Service Worker). Mock the backend API response and test that data renders correctly in the table, and that the dialog properly fires a POST request when the form is submitted."

### Prompt for Task 9: Transfer Screen & Playwright E2E Idempotent Network Test
"Act as a UX and Frontend Security Engineer. Create the `/transfer` page. Build a form using MUI components (`TextField`, `Select`). The form must track a single UUID `idempotencyKey` in the React state. Pass this key in the `X-Idempotency-Key` header. 
ALSO, write an E2E test using Playwright. Intercept the network route. On the first click of 'Submit', simulate a network drop (abort the request). Assert that the UI shows a clear error message with a retry mechanism. On the second click (Retry), allow the request to pass. Assert that the `X-Idempotency-Key` header value matches exactly in both the aborted and the successful requests."

### Prompt for Task 10: Transaction History Screen & Visual Grid Component Tests
"Act as a Frontend Developer. Create the `/transactions` page. Fetch the list of executed transfers using React Query. Display the data using an advanced MUI `Table` or `DataGrid` component with client-side pagination. 
ALSO, write a comprehensive component test with Vitest asserting pagination flow: mock 25 transaction records, set the grid page size to 10, and verify clicking 'Next Page' renders items 11-20 seamlessly."

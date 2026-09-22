# Test Automation & Quality Assurance Guidelines

## 1. Backend Testing Pyramid

### 1.1. Unit Tests (JUnit 5 & Mockito)
- **Target:** Domain logic (`Account`, `Transfer` state changes) and pure business rules.
- **Rule:** No Spring Context (`@SpringBootTest`) allowed in unit tests to ensure execution speeds under 10ms/test. Use Mockito for dependencies.
- **Key Scenarios to Cover:**
  - Transfer with insufficient funds (must throw `InsufficientFundsException`).
  - Transfer with zero or negative amounts (must fail validation).
  - Exact mathematical rounding rules during currency conversion.

### 1.2. Integration & Concurrency Tests (Spring Boot + Testcontainers)
- **Target:** `TransferService`, `IdempotencyEngine`, and Database Locking.
- **Rule:** Use **Testcontainers with a real PostgreSQL image** to properly validate database-level locks. Do NOT use H2 for concurrency tests, as its locking mechanism differs from production databases.
- **Key Scenarios to Cover:**
  - **Race Condition Handling:** Initialize an account with \$1,000. Launch 10 parallel threads simultaneously trying to deduct \$150 (\$1,500 total). Assert that exactly 6 transactions succeed, 4 fail with `InsufficientFundsException`, and the final balance is exactly \$100.
  - **Deadlock Prevention:** Execute 50 concurrent transfers where Thread A moves money from Account 1 -> 2, and Thread B moves money from Account 2 -> 1 at the exact same millisecond. Assert zero deadlocks and accurate final balances.
  - **Idempotency Lifecycle:** Send 3 identical requests with the same `X-Idempotency-Key` concurrently. Assert that exactly 1 request returns `201 Created` and the other 2 receive `409 Conflict`.

---

## 2. Frontend Testing Strategy

### 2.1. Component & Hook Testing (React Testing Library + Vitest)
- **Target:** Material UI Form Validations, Custom React Query Hooks (`useCreateTransfer`).
- **Rule:** Mock the API layer using **MSW (Mock Service Worker)** to simulate successful network configurations, HTTP 409 Conflicts, and HTTP 503 Service Unavailables.
- **Key Scenarios to Cover:**
  - UI locks the submit button and enters a loading state (`isPending`) while the transaction is processing.
  - Form validation blocks submission if the target and source accounts are identical.

### 2.2. End-to-End (E2E) Tests (Playwright)
- **Target:** Full user journeys and Resiliency/Network degradation simulation.
- **Key Scenarios to Cover:**
  - **The "Flaky API Network Failure" Journey:** 
    1. User fills out the Transfer form.
    2. Network is artificially slowed down or drops mid-request.
    3. Verify that the UI displays a clear retry option.
    4. User clicks "Retry". Verify that the *exact same* UUID idempotency key is transmitted in the header.

### Google Gemini:
- #1 pasted the description, with small modifications, like frontend stack, but dindt ask anything specifically.
- #2 `A fejlesztés GitHub Copilot segítségével fog történni. Mielőtt az implementácba kezdünk a fenti köveztelményeket gyűjtsük ki egy fájlba pontos meghatározással, utasításokkal, amit  GitHub Copilot feldolgoz és figyelembe vesz mindnen fejlesztési lépés során. (külön .md fájl) A fejlesztés során minden döntést szeretnék feljegyezni, indoklással. (decision-log.md) vezessük a readme.md-t a  követelményben meghatározottak szerint.`
- #3 `Legyél a lead sowftware engineer, vezess végig a technológiákon melyiket miért vezessük be, milyen előnyei és hátrányai vannak, miért ezt választottad, milyen alternatívák ellenében.`
- #4 `A fejlesztést egy részletes, a fenti követelmények alapján felállított TODO lista elkészítésével kezdjük, majd ezeken fogunk végighaladni. Így mindegyik listaelemhez szükség lesz egy részletes parancsra, ami alaján az implementáció készül. (backlog.md)`
- #5 `Írj dokumentációt teljeskörű vállalati szintű unit és e2e tesztelésre vonatkozó előírásokról és iránymutatásokról. (testing-guidelines.md), a backlogot dolgozd át úgy, hogy az imlementáció magába foglalja a tesztek megírását is, mind unit, integrációs éa e2e teszt szintjén.`
- #6 `elfelejtettem mindenek előtt a projektstruktúrát kialakítani. Írj parancsot a copilot számára, ami alapján egy tiszta, professzionális monorepo struktúrába rendezi át a projektet.`
- #7 `mivel még nincsen backend, szeretném, ha nextjs szerver oldalon meghívnánk az api/{oldalnak megfelelő path} végpontot a megfelelő metúdussal, ahol szimuláljuk a backend szolgáltatás válaszait.  ennek az elkészítésére kérek promptot`

### Github Copilot:
1. You are a Staff Fullstack Engineer guiding me through building a production-ready Next-Gen Payment Gateway. 

First, read and thoroughly analyze our source-of-truth files:
1: #file:system-requirements.md
2: #file:testing-guidelines.md (Strict test architecture rules)
3: #file:backlog.md
4: #file:decision-log.md
5: #file:README.md

Your task is to help me execute the project strictly step-by-step following the sequence in `backlog.md`. Do not skip ahead. 

To start, let's look at "Task 1: Backend Domain Models, Locking & Unit Tests". Review its technical prompt inside `backlog.md`, and generate the clean, complete Java source code. Ensure it adheres perfectly to Java 21, Spring Boot 4.x, and the data integrity rules specified.
After finishing the task, update the backlog and if it is needed, the README.md also.
In case of need for technical decision, always ask me, offer solutions, provide context, explain tradeoffs.

2. Act as an expert Frontend Architect. We are shifting our development order to focus on the Frontend first.

Before generating any code, read, analyze, and strictly follow these source-of-truth files:
1: #file:system-requirements.md
2: #file:testing-guidelines.md
3: #file:backlog.md (Focus on "Task 7: Next.js + MUI + Styled Components Boilerplate & Hydration Test")
4: #file:decision-log.md
5: #file:README.md

CRITICAL INSTRUCTION ON TECHNICAL DECISIONS:
In case of need for any technical decision (e.g., directory structures, specific MUI setup variants, or state hydration approaches), DO NOT make assumptions. Always ask me first. Offer potential solutions, provide technical context, and explain the tradeoffs of each approach, then wait for my confirmation.

Scope of Task 7:
Please provide the exact file structure and code for a Next.js 15+ (App Router) application that integrates Material UI (MUI v6), Styled Components / Emotion, and TanStack React Query v5. It must include a custom Emotion Registry to collect and inject styles server-side, preventing any Flash of Unstyled Content (FOUC).

Provide:
- `src/app/registry.tsx` (CSS-in-JS registry for Next.js SSR)
- `src/app/providers.tsx` (React Query + MUI ThemeProvider setup)
- `src/app/layout.tsx` (Global Root Layout with a responsive MUI App Bar and Side Navigation Drawer for 'Accounts', 'Transfer', and 'Transactions')
- `src/app/theme.ts` (MUI custom theme definition)
- `src/app/layout.test.tsx` (Vitest + React Testing Library smoke test)

DOCUMENTATION UPDATE:
If this implementation introduces any change or configuration requirement that impacts the project layout or local execution, please output the necessary additions/modifications for #file:README.md as well.

3. Act as a Principal Enterprise Architect. Stop generating code and look at the project root directory. Currently, backend and frontend files are mixed up in a single folder. This violates our enterprise architecture principles.

Based on #file:system-requirements.md, we need a clean, standard project structure where backend and frontend are completely decoupled.

Please provide a precise directory map and instructions to reorganize the files according to this layout:

payment-gateway-workspace/
├── backend/                  <-- Spring Boot 4.x Application
│   ├── .mvn/ or .gradle/
│   ├── pom.xml or build.gradle
│   └── src/
│       ├── main/java/com/gateway/payment/
│       │   ├── config/       <-- Security, Web, Resilience4j configurations
│       │   ├── domain/       <-- Account, Transfer, Idempotency entities
│       │   ├── repository/   <-- Pessimistic Lock Repositories
│       │   ├── service/      <-- Core Transfer and Idempotency logic
│       │   └── controller/   <-- REST API Endpoints & Filters
│       └── test/             <-- JUnit 5 and Testcontainers integration tests
│
├── frontend/                 <-- Next.js 15+ (App Router) Application
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── app/              <-- App Router pages, layout, providers, registry
│       ├── components/       <-- Reusable MUI components (Forms, Tables, Layout)
│       ├── hooks/            <-- Custom TanStack React Query hooks
│       ├── services/         <-- API client definitions (Axios/Fetch)
│       └── __tests__/        <-- Vitest & Playwright test files
│
├── .gitignore
├── system-requirements.md
├── testing-guidelines.md
├── backlog.md
├── decision-log.md
└── README.md                 <-- Root documentation

INSTRUCTIONS FOR YOU (COPILOT):
1: Review all files that have been created so far.
2: Group them and explicitly tell me which file belongs to which path in the new structure (e.g., "Move file X to /backend/src/...").
3 Update the local execution paths inside #file:README.md if needed to reflect that commands must be run inside the `/backend` or `/frontend` directories.
4: Do not delete any code, just restructure it cleanly. Confirm you understand the structure before we continue with Task 8 execution.

4. Act as a Senior Frontend Developer and UX Engineer. We are ready to implement "Task 8:  Accounts Dashboard Screen + Component Tests (MUI + MSW)" as specified in #file:backlog.md and following the rules in #file:system-requirements.md and #file:testing-guidelines.md.

All code must be placed strictly within the `/frontend` directory layout established in our architecture.

CRITICAL INSTRUCTION ON TECHNICAL DECISIONS:
Before writing code, analyze the following architectural choices. Stop and present your recommendations, tradeoffs, and component choices for:
1: MUI Table Component: Should we use a standard responsive `@mui/material/Table` (lightweight, flexible) or `@mui/x-data-grid` (feature-rich but larger bundle size) for displaying the accounts list?
2: Form Validation: Should we use pure React state with custom validation or integrate a library like React Hook Form + Yup/Zod for the 'Create Account' dialog form?
Present the options and wait for my decision.

Once I give the green light, the scope of the implementation will cover:
- `src/hooks/useAccounts.ts`: TanStack React Query hooks (`useAccounts` query and `useCreateAccount` mutation) communicating with `/api/accounts`.
- `src/app/accounts/page.tsx`: The Next.js page displaying the accounts. It must use MUI Skeleton components during the loading state, show an elegant MUI Alert upon error, and render the verified data.
- `src/components/CreateAccountDialog.tsx`: An accessible MUI Dialog modal containing a form (Account Number, Initial Balance, Currency dropdown [HUF, EUR, USD]).
- `src/app/accounts/page.test.tsx`: A comprehensive Vitest + React Testing Library component test using MSW (Mock Service Worker) to mock the `/api/accounts` GET and POST endpoints. Test that data renders correctly and that submitting the dialog form triggers the correct API payload.

DOCUMENTATION UPDATE:
Ensure that any new environment variables or npm packages required (like MSW or validation libraries) are clearly documented as updates for #file:README.md.

5. Act as a Senior Next.js Fullstack Developer. We want to implement a complete server-side mock backend layer within our Next.js application using App Router Route Handlers (`src/app/api/...`), since the Spring Boot backend is not yet developed.

This mock layer must accurately simulate the behavior of the real backend, including data persistence in server memory, network delays, flaky external API behaviors (503s), and strict X-Idempotency-Key validation.

CRITICAL INSTRUCTION ON TECHNICAL DECISIONS:
Before writing code, analyze how we should manage the server-side state in Next.js development mode (since global variables can reset during Hot Module Replacement / HMR). Stop and present your recommendations and tradeoffs for:
1. In-Memory Store: How to safely implement a global in-memory singleton (or using a `globalThis` cache) to store accounts, transactions, and active idempotency keys (`PROCESSING`, `SUCCESS`, `FAILED`) without losing data on code changes.
2. Flaky FX API and Network Simulation: How to implement a controllable delay and random 503 error simulator for the cross-currency transfers to test our frontend resilience.
Present the options and wait for my decision.

Once I give the confirmation, the scope of the implementation will cover:
- `src/app/api/accounts/route.ts`: 
  - `GET`: Returns the list of accounts.
  - `POST`: Simulates creating a new account (validates fields, generates a mock account number, adds to store).
- `src/app/api/transfers/route.ts`:
  - `POST`: Processes a transfer. It MUST read the `X-Idempotency-Key` header.
    - If key is missing -> return 400 Bad Request.
    - If key state is `PROCESSING` -> return 409 Conflict.
    - If key state is `SUCCESS` -> return the cached 201 response payload immediately.
    - If it's a new key -> set status to `PROCESSING`. If it's cross-currency, simulate a 2-second delay and a 20% chance of a 503 error (flaky FX). If it succeeds, debit/credit the accounts in memory, save the transaction, update the key to `SUCCESS`, and return 201 Created. If it fails, set key to `FAILED` and return 503.
- `src/app/api/transactions/route.ts`:
  - `GET`: Returns the list of executed transfers with support for basic pagination query parameters (`page`, `limit`).

6. Act as a UX Architect and Frontend Security Engineer. We are ready to implement "Task 9: Transfer Screen with Idempotency Form + Playwright E2E Network Failure Test" as defined in #file:backlog.md, adhering to #file:system-requirements.md and #file:testing-guidelines.md.

We will connect this screen directly to our newly created server-side Route Handlers (`/api/transfers` and `/api/accounts`).

CRITICAL INSTRUCTION ON TECHNICAL DECISIONS:
Before generating the implementation, analyze the following architectural questions. Stop and present your recommendations, tradeoffs, and edge-case behaviors for:
1. Idempotency Key Management: How should we store and manage the UUID `X-Idempotency-Key` in the React/Next.js state? It must persist across component re-renders and network retries, but strictly rotate to a brand new UUID only upon a successful 201 Created transaction. Should we use a combination of useState/useRef or track it inside the React Query mutation context?
2. Form UX and Locking: When a request is in-flight (isPending), or when the mock server returns a 409 Conflict, how should the UI react (e.g., disable specific inputs, show a global Backdrop loader, or display an intuitive MUI Alert with a countdown)?
Present the options and wait for my confirmation.

Once I confirm, the scope of the implementation will cover:
- `src/hooks/useTransfers.ts`: TanStack React Query mutation (`useCreateTransfer`) that captures the transfer payload and explicitly attaches the active `X-Idempotency-Key` string to the request headers.
- `src/app/transfer/page.tsx`: The full Transfer form page using Material UI components (`TextField`, `Select` for currency, and dropdowns populated with accounts from `/api/accounts`).
- Comprehensive error and success handling:
  - On HTTP 409 Conflict: Show an MUI Alert indicating the transaction is already being processed. Protect the form from double submission.
  - On HTTP 503 / General Network Failure: Show a prominent error state with a clear 'Retry' button that preserves the *exact same* key.
  - On HTTP 201 Created: Show a success screen, trigger a data refetch for account balances, and automatically generate a *new* UUID key for the next transfer.
- `src/__tests__/transfer.e2e.test.ts`: A Playwright E2E test file that intercepts the `/api/transfers` POST request. On the first click of 'Submit', it aborts the network connection. It asserts the UI shows a retry mechanism. On the second click (Retry), it allows a successful 201 response and asserts that the `X-Idempotency-Key` header value was identical in both requests.

DOCUMENTATION UPDATE:
Provide any necessary additions to #file:README.md regarding how to run the newly added Playwright E2E tests locally.

7. Act as a Senior Next.js Fullstack Developer and Performance Engineer. We are ready to implement "Task 10: Transaction History Screen with Pagination + Visual Grid Component Tests" as specified in #file:backlog.md, adhering to #file:system-requirements.md and #file:testing-guidelines.md.

CRITICAL ARCHITECTURAL REQUIREMENT:
Since the Java Spring Boot backend is not yet ready, we MUST implement the complete server-side mock logic inside the Next.js Route Handler (`src/app/api/transactions/route.ts`). This mock endpoint must accurately imitate a real server by reading `page` and `limit` query parameters, slicing our in-memory global transactions array, and returning a structured JSON response containing the sliced data along with proper pagination metadata (e.g., totalItems, totalPages, currentPage).

CRITICAL INSTRUCTION ON TECHNICAL DECISIONS:
Before generating any implementation code, analyze the data grid performance and component choices. Stop and present your recommendations and tradeoffs for:
1. Pagination Metadata Structure: How should our Next.js mock API structure its response to support efficient frontend grid paging? (e.g., wrapping the list in a `{ data: Transaction[], pagination: { total: number, page: number, limit: number } }` envelope).
2. MUI Component Choice: Given our decision to avoid Tailwind and lean on MUI's robustness, should we use `@mui/material/Table` with a custom `TablePagination` (highly customizable styling via Styled Components) or the enterprise-grade `@mui/x-data-grid` (built-in virtualization, heavier bundle size)?
Present the options and wait for my confirmation.

Once I confirm, the scope of the implementation will cover:
- `src/app/api/transactions/route.ts`: The Next.js server-side Route Handler (`GET`). It reads `?page=X&limit=Y`, fetches data from the global/globalThis store, slices it mathematically, and returns the envelope with metadata.
- `src/hooks/useTransactions.ts`: TanStack React Query hook (`useTransactions`) that passes current `page` and `limit` state to the API, using `placeholderData: (previousData) => previousData` (keepPreviousData behavior) to prevent layout shifts.
- `src/app/transactions/page.tsx`: The full ledger page using Material UI and Styled Components, displaying: Source Account, Target Account, Sent Amount, Received Amount (FX converted), and Locale-formatted Timestamp.
- `src/app/transactions/page.test.tsx`: A Vitest + React Testing Library component test using MSW to mock 25 transactions, verifying that page 1 shows the first 10 items, and clicking 'Next' properly calls page 2 for items 11-20.

DOCUMENTATION UPDATE:
Verify if #file:README.md requires any updates regarding running or testing this final frontend + mock layer.

8. Act as a Principal Spring Boot Architect. We are continuing our engineering workflow by implementing the REST Controller layer BEFORE the core business logic (Controller-First / API-First approach). 

Please read, analyze, and strictly follow these source-of-truth files:
1. #file:system-requirements.md
2. #file:testing-guidelines.md
3. #file:backlog.md (Focusing on "Task 6: REST Controller & Idempotency Filter + WebMvc Spring Tests")

CRITICAL INSTRUCTION ON TECHNICAL DECISIONS:
Before generating the code, stop and present your recommendations, tradeoffs, and architectural approaches for:
1. Idempotency Key Interception: Should we intercept the `X-Idempotency-Key` header using a Spring MVC `HandlerInterceptor`, a Servlet `Filter`, or directly inside the Controller method using `@RequestHeader`? How does this choice impact our ability to return a 409 Conflict before hitting the business transaction?
2. DTO and Validation Validation Framework: What annotations should we use to validate incoming payment payloads (e.g., negative amounts, empty account numbers) right at the boundary layer?
Present the options and wait for my confirmation.

Once I confirm, the scope of the implementation will cover:
- All incoming/outgoing DTO classes (`TransferRequest`, `TransferResponse`, `AccountResponse`).
- `TransferController` handling `POST /api/transfers`, `GET /api/transactions`, and `GET /api/accounts`. For now, inject stubbed or mocked service interfaces so the controllers can compile.
- The Idempotency validation mechanism (Filter/Interceptor) that enforces the presence of `X-Idempotency-Key` (returns 400 if missing).
- `TransferControllerTest` using Spring Boot's `@WebMvcTest`. It must strictly verify the Web boundary layer without loading the database or real business services:
  1. Missing header returns 400 Bad Request.
  2. Invalid payload (e.g., negative amount) returns 400 Bad Request.
  3. A key currently in `PROCESSING` returns 409 Conflict.
  4. A key in `SUCCESS` returns the cached response directly.

Let's begin with the technical choices. What are your architectural recommendations for intercepting the idempotency key and structuring the DTO validations?
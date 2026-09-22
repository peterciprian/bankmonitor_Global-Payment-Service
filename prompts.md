### Google Gemini:
- #1 pasted the description, with small modifications, like frontend stack, but dindt ask anything specifically.
- #2 `A fejlesztés GitHub Copilot segítségével fog történni. Mielőtt az implementácba kezdünk a fenti köveztelményeket gyűjtsük ki egy fájlba pontos meghatározással, utasításokkal, amit  GitHub Copilot feldolgoz és figyelembe vesz mindnen fejlesztési lépés során. (külön .md fájl) A fejlesztés során minden döntést szeretnék feljegyezni, indoklással. (decision-log.md) vezessük a readme.md-t a  követelményben meghatározottak szerint.`
- #3 `Legyél a lead sowftware engineer, vezess végig a technológiákon melyiket miért vezessük be, milyen előnyei és hátrányai vannak, miért ezt választottad, milyen alternatívák ellenében.`
- #4 `A fejlesztést egy részletes, a fenti követelmények alapján felállított TODO lista elkészítésével kezdjük, majd ezeken fogunk végighaladni. Így mindegyik listaelemhez szükség lesz egy részletes parancsra, ami alaján az implementáció készül. (backlog.md)`
- #5 `Írj dokumentációt teljeskörű vállalati szintű unit és e2e tesztelésre vonatkozó előírásokról és iránymutatásokról. (testing-guidelines.md), a backlogot dolgozd át úgy, hogy az imlementáció magába foglalja a tesztek megírását is, mind unit, integrációs éa e2e teszt szintjén.`
- #6 `elfelejtettem mindenek előtt a projektstruktúrát kialakítani. Írj parancsot a copilot számára, ami alapján egy tiszta, professzionális monorepo struktúrába rendezi át a projektet.`

### Github Copilot:
1. You are a Staff Fullstack Engineer guiding me through building a production-ready Next-Gen Payment Gateway. 

First, read and thoroughly analyze our source-of-truth files:
1. #file:system-requirements.md
2. #file:testing-guidelines.md (Strict test architecture rules)
3. #file:backlog.md
4. #file:decision-log.md
5. #file:README.md

Your task is to help me execute the project strictly step-by-step following the sequence in `backlog.md`. Do not skip ahead. 

To start, let's look at "Task 1: Backend Domain Models, Locking & Unit Tests". Review its technical prompt inside `backlog.md`, and generate the clean, complete Java source code. Ensure it adheres perfectly to Java 21, Spring Boot 4.x, and the data integrity rules specified.
After finishing the task, update the backlog and if it is needed, the README.md also.
In case of need for technical decision, always ask me, offer solutions, provide context, explain tradeoffs.

2. Act as an expert Frontend Architect. We are shifting our development order to focus on the Frontend first.

Before generating any code, read, analyze, and strictly follow these source-of-truth files:
1. #file:system-requirements.md
2. #file:testing-guidelines.md
3. #file:backlog.md (Focus on "Task 7: Next.js + MUI + Styled Components Boilerplate & Hydration Test")
4. #file:decision-log.md
5. #file:README.md

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
├── architecture.md
└── README.md                 <-- Root documentation

INSTRUCTIONS FOR YOU (COPILOT):
1. Review all files that have been created so far.
2. Group them and explicitly tell me which file belongs to which path in the new structure (e.g., "Move file X to /backend/src/...").
3. Update the local execution paths inside #file:README.md if needed to reflect that commands must be run inside the `/backend` or `/frontend` directories.
4. Do not delete any code, just restructure it cleanly. Confirm you understand the structure before we continue with Task 8 execution.

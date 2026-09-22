export type MockCurrency = 'HUF' | 'EUR' | 'USD';

export type MockAccount = {
  id: number;
  userId: string;
  currency: MockCurrency;
  balance: number;
};

export type MockTransaction = {
  id: string;
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  currency: MockCurrency;
  createdAt: string;
};

export type IdempotencyStatus = 'PROCESSING' | 'SUCCESS' | 'FAILED';

export type MockIdempotencyRecord = {
  status: IdempotencyStatus;
  responseStatus: number;
  responseBody?: unknown;
};

export type MockStore = {
  accounts: MockAccount[];
  transactions: MockTransaction[];
  idempotencyKeys: Map<string, MockIdempotencyRecord>;
};

const globalStoreKey = Symbol.for('payment-gateway.mock-store');

type MockGlobal = typeof globalThis & {
  [globalStoreKey]?: MockStore;
};

function createMockStore(): MockStore {
  return {
    accounts: [
      { id: 1, userId: 'user-1', currency: 'EUR', balance: 125.5 },
      { id: 2, userId: 'user-2', currency: 'HUF', balance: 50000 },
      { id: 3, userId: 'user-3', currency: 'USD', balance: 1000 }
    ],
    transactions: [],
    idempotencyKeys: new Map()
  };
}

export const mockStore = ((globalThis as MockGlobal)[globalStoreKey] ??= createMockStore());

export function resetMockStore() {
  const store = createMockStore();
  (globalThis as MockGlobal)[globalStoreKey] = store;
  return store;
}
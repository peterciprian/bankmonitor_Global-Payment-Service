export const MOCK_FX_DELAY_MS = 2000;
export const MOCK_FX_FAILURE_STATUS = 503;

export type MockCurrency = 'HUF' | 'EUR' | 'USD';

const MOCK_RATES: Record<MockCurrency, Record<MockCurrency, number>> = {
  EUR: { EUR: 1, USD: 1.08, HUF: 395 },
  USD: { EUR: 0.93, USD: 1, HUF: 366 },
  HUF: { EUR: 0.00253, USD: 0.00273, HUF: 1 }
};

function roundAmount(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export async function simulateExchange(
  amount: number,
  fromCurrency: MockCurrency,
  toCurrency: MockCurrency
) {
  await new Promise((resolve) => setTimeout(resolve, MOCK_FX_DELAY_MS));
  const rate = MOCK_RATES[fromCurrency][toCurrency];

  return {
    rate,
    convertedAmount: roundAmount(amount * rate),
    fromCurrency,
    toCurrency
  } as const;
}

export async function simulateFixedFxFailure() {
  await new Promise((resolve) => setTimeout(resolve, MOCK_FX_DELAY_MS));
  return {
    status: MOCK_FX_FAILURE_STATUS,
    message: 'The mock FX provider is unavailable.'
  } as const;
}
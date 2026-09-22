export const MOCK_FX_DELAY_MS = 2000;
export const MOCK_FX_FAILURE_STATUS = 503;

export async function simulateFixedFxFailure() {
  await new Promise((resolve) => setTimeout(resolve, MOCK_FX_DELAY_MS));
  return {
    status: MOCK_FX_FAILURE_STATUS,
    message: 'The mock FX provider is unavailable.'
  } as const;
}
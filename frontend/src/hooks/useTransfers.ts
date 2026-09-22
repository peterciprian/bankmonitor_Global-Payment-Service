import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Currency } from './useAccounts';

export type TransferPayload = {
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  currency: Currency;
};

export type CreateTransferInput = {
  payload: TransferPayload;
  idempotencyKey: string;
};

export type TransferResponse = TransferPayload & {
  id: string;
  status: 'COMPLETED';
  createdAt: string;
};

export class TransferApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'TransferApiError';
  }
}

async function createTransfer({ payload, idempotencyKey }: CreateTransferInput): Promise<TransferResponse> {
  let response: Response;
  try {
    response = await fetch('/api/transfers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Idempotency-Key': idempotencyKey
      },
      body: JSON.stringify(payload)
    });
  } catch {
    throw new TransferApiError(0, 'The transfer request could not reach the server.');
  }

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new TransferApiError(response.status, body.message ?? 'The transfer could not be completed.');
  }
  return body;
}

export function useCreateTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransfer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts'] })
  });
}
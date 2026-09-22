import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type Currency = 'HUF' | 'EUR' | 'USD';

export type Account = {
  id: number;
  userId: string;
  currency: Currency;
  balance: string;
};

export type CreateAccountInput = {
  userId: string;
  initialBalance: string;
  currency: Currency;
};

async function getAccounts(): Promise<Account[]> {
  const response = await fetch('/api/accounts');
  if (!response.ok) {
    throw new Error('Unable to load accounts');
  }
  return response.json();
}

async function createAccount(input: CreateAccountInput): Promise<Account> {
  const response = await fetch('/api/accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  if (!response.ok) {
    throw new Error('Unable to create account');
  }
  return response.json();
}

export function useAccounts() {
  return useQuery({ queryKey: ['accounts'], queryFn: getAccounts });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts'] })
  });
}
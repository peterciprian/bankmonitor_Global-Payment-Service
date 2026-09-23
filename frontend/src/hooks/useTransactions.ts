import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { Currency } from './useAccounts';

export type Transaction = {
  id: string;
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  currency: Currency;
  convertedAmount: number;
  targetCurrency: Currency;
  exchangeRate: number;
  createdAt: string;
};

export type TransactionsResponse = {
  data: Transaction[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
};

async function getTransactions(page: number, limit: number): Promise<TransactionsResponse> {
  const response = await fetch(`/api/transactions?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Unable to load transactions');
  }
  return response.json();
}

export function useTransactions(page: number, limit: number) {
  return useQuery({
    queryKey: ['transactions', page, limit],
    queryFn: () => getTransactions(page, limit),
    placeholderData: keepPreviousData
  });
}
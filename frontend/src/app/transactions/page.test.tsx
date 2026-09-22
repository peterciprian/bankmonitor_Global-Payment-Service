import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import TransactionsPage from './page';

const transactions = Array.from({ length: 25 }, (_, index) => ({
  id: `transaction-${index + 1}`,
  fromAccountId: index + 1,
  toAccountId: index + 101,
  amount: index + 1,
  currency: 'EUR',
  convertedAmount: index + 1,
  targetCurrency: 'EUR',
  createdAt: '2026-01-01T12:00:00.000Z'
}));

const server = setupServer(
  http.get('/api/transactions', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const limit = Number(url.searchParams.get('limit') ?? 10);
    const start = (page - 1) * limit;
    return HttpResponse.json({
      data: transactions.slice(start, start + limit),
      pagination: {
        totalItems: transactions.length,
        totalPages: Math.ceil(transactions.length / limit),
        currentPage: page,
        pageSize: limit
      }
    });
  })
);

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <TransactionsPage />
    </QueryClientProvider>
  );
}

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('TransactionsPage', () => {
  it('shows the first ten transactions and loads items 11-20 on Next', async () => {
    renderPage();

    expect(await screen.findByTestId('transaction-row-transaction-1')).toBeInTheDocument();
    expect(screen.getByTestId('transaction-row-transaction-10')).toBeInTheDocument();
    expect(screen.queryByTestId('transaction-row-transaction-11')).not.toBeInTheDocument();

    const nextButton = screen.getByRole('button', { name: 'Go to next page' });
    fireEvent.click(nextButton);

    await waitFor(() => expect(screen.getByTestId('transaction-row-transaction-11')).toBeInTheDocument());
    expect(screen.getByTestId('transaction-row-transaction-20')).toBeInTheDocument();
    expect(screen.queryByTestId('transaction-row-transaction-1')).not.toBeInTheDocument();
    expect(within(screen.getByTestId('transaction-row-transaction-11')).getByText('11')).toBeInTheDocument();
  });
});
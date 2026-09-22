import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { beforeAll, afterAll, afterEach, describe, expect, it } from 'vitest';
import AccountsPage from './page';

const accounts = [
  { id: 1, userId: 'user-1', currency: 'EUR', balance: '125.50' },
  { id: 2, userId: 'user-2', currency: 'HUF', balance: '50000.00' }
];

const server = setupServer(
  http.get('/api/accounts', () => HttpResponse.json(accounts)),
  http.post('/api/accounts', async ({ request }) => {
    const payload = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ id: 3, ...payload }, { status: 201 });
  })
);

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <AccountsPage />
    </QueryClientProvider>
  );
}

beforeAll(() => server.listen());
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());

describe('AccountsPage', () => {
  it('renders accounts returned by the API', async () => {
    renderPage();

    expect(await screen.findByText('user-1')).toBeInTheDocument();
    expect(screen.getByText('125.50')).toBeInTheDocument();
    expect(screen.getByText('user-2')).toBeInTheDocument();
  });

  it('submits the userId, balance, and currency payload', async () => {
    let submittedPayload: unknown;
    server.use(
      http.post('/api/accounts', async ({ request }) => {
        submittedPayload = await request.json();
        return HttpResponse.json({ id: 3, userId: 'user-3', currency: 'USD', balance: '75.00' }, { status: 201 });
      })
    );

    renderPage();
    fireEvent.click(await screen.findByRole('button', { name: 'Create account' }));
    const dialog = screen.getByRole('dialog');
    fireEvent.change(within(dialog).getByLabelText('User ID'), { target: { value: 'user-3' } });
    fireEvent.change(within(dialog).getByLabelText('Initial balance'), { target: { value: '75.00' } });
    fireEvent.mouseDown(within(dialog).getByLabelText('Currency'));
    fireEvent.click(screen.getByRole('option', { name: 'USD' }));
    fireEvent.click(within(dialog).getByRole('button', { name: 'Create account' }));

    await waitFor(() => expect(submittedPayload).toEqual({ userId: 'user-3', initialBalance: '75.00', currency: 'USD' }));
  });
});
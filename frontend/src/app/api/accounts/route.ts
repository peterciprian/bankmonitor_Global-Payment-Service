import { NextResponse } from 'next/server';
import { MockCurrency, mockStore } from '../../../lib/mock-store';

const currencies: MockCurrency[] = ['HUF', 'EUR', 'USD'];

function accountResponse(account: (typeof mockStore.accounts)[number]) {
  return {
    ...account,
    balance: account.balance.toFixed(2)
  };
}

export async function GET() {
  return NextResponse.json(mockStore.accounts.map(accountResponse));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const userId = typeof body?.userId === 'string' ? body.userId.trim() : '';
  const initialBalance = typeof body?.initialBalance === 'string' || typeof body?.initialBalance === 'number'
    ? Number(body.initialBalance)
    : NaN;
  const currency = body?.currency as MockCurrency;

  if (!userId || !Number.isFinite(initialBalance) || initialBalance <= 0 || !currencies.includes(currency)) {
    return NextResponse.json(
      { message: 'userId, initialBalance, and a supported currency are required.' },
      { status: 400 }
    );
  }

  const account = {
    id: Math.max(...mockStore.accounts.map(({ id }) => id), 0) + 1,
    userId,
    currency,
    balance: initialBalance
  };
  mockStore.accounts.push(account);

  return NextResponse.json(accountResponse(account), { status: 201 });
}
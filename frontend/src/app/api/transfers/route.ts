import { NextResponse } from 'next/server';
import { simulateExchange } from '../../../lib/mock-simulation';
import { mockStore } from '../../../lib/mock-store';

type TransferRequest = {
  fromAccountId?: number;
  toAccountId?: number;
  amount?: number;
  currency?: 'HUF' | 'EUR' | 'USD';
};

export async function POST(request: Request) {
  const idempotencyKey = request.headers.get('X-Idempotency-Key')?.trim();
  if (!idempotencyKey) {
    return NextResponse.json({ message: 'X-Idempotency-Key is required.' }, { status: 400 });
  }

  const existing = mockStore.idempotencyKeys.get(idempotencyKey);
  if (existing?.status === 'PROCESSING') {
    return NextResponse.json({ message: 'A request with this key is already processing.' }, { status: 409 });
  }
  if (existing?.status === 'SUCCESS') {
    return NextResponse.json(existing.responseBody, { status: existing.responseStatus });
  }

  const body = (await request.json().catch(() => null)) as TransferRequest | null;
  const amount = Number(body?.amount);
  const fromAccount = mockStore.accounts.find((account) => account.id === body?.fromAccountId);
  const toAccount = mockStore.accounts.find((account) => account.id === body?.toAccountId);

  if (!fromAccount || !toAccount || fromAccount.id === toAccount.id || !Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ message: 'Valid source, target, and positive amount are required.' }, { status: 400 });
  }
  if (fromAccount.currency !== body?.currency) {
    return NextResponse.json({ message: 'Transfer currency must match the source account currency.' }, { status: 400 });
  }
  if (fromAccount.balance < amount) {
    return NextResponse.json({ message: 'Insufficient funds.' }, { status: 422 });
  }

  mockStore.idempotencyKeys.set(idempotencyKey, { status: 'PROCESSING', responseStatus: 201 });

  const exchange = fromAccount.currency === toAccount.currency
    ? {
        rate: 1,
        convertedAmount: amount,
        fromCurrency: fromAccount.currency,
        toCurrency: toAccount.currency
      }
    : await simulateExchange(amount, fromAccount.currency, toAccount.currency);
  fromAccount.balance -= amount;
  toAccount.balance += exchange.convertedAmount;
  const transaction = {
    id: crypto.randomUUID(),
    fromAccountId: fromAccount.id,
    toAccountId: toAccount.id,
    amount,
    currency: fromAccount.currency,
    convertedAmount: exchange.convertedAmount,
    targetCurrency: toAccount.currency,
    exchangeRate: exchange.rate,
    createdAt: new Date().toISOString()
  };
  mockStore.transactions.unshift(transaction);
  const responseBody = { ...transaction, status: 'COMPLETED' };
  mockStore.idempotencyKeys.set(idempotencyKey, { status: 'SUCCESS', responseStatus: 201, responseBody });

  return NextResponse.json(responseBody, { status: 201 });
}
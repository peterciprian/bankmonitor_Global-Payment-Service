import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '../../../lib/mock-store';

export async function GET(request: NextRequest) {
  const page = Math.max(Number(request.nextUrl.searchParams.get('page') ?? 1), 1);
  const limit = Math.min(Math.max(Number(request.nextUrl.searchParams.get('limit') ?? 10), 1), 100);
  const start = (page - 1) * limit;

  return NextResponse.json({
    data: mockStore.transactions.slice(start, start + limit),
    page,
    limit,
    total: mockStore.transactions.length
  });
}
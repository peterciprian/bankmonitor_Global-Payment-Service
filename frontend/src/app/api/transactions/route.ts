import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '../../../lib/mock-store';

export async function GET(request: NextRequest) {
  const requestedPage = Number(request.nextUrl.searchParams.get('page') ?? 1);
  const requestedLimit = Number(request.nextUrl.searchParams.get('limit') ?? 10);
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const limit = Number.isInteger(requestedLimit) && requestedLimit > 0
    ? Math.min(requestedLimit, 100)
    : 10;
  const start = (page - 1) * limit;
  const totalItems = mockStore.transactions.length;

  return NextResponse.json({
    data: mockStore.transactions.slice(start, start + limit),
    pagination: {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      pageSize: limit
    }
  });
}
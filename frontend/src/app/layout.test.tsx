import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import RootLayout from './layout';

vi.mock('next/navigation', () => ({
  usePathname: () => '/transactions'
}));

describe('RootLayout', () => {
  it('renders the application shell and primary navigation', () => {
    render(
      <RootLayout>
        <div>Dashboard content</div>
      </RootLayout>
    );

    expect(screen.getByText('Payment Gateway')).toBeInTheDocument();
    expect(screen.getAllByText('Accounts').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Transfer').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Transactions').length).toBeGreaterThan(0);
    expect(screen.getByText('Dashboard content')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Transactions' })).toHaveClass('Mui-selected');
  });
});
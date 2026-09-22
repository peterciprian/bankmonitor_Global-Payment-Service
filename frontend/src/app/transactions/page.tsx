'use client';

import {
  Alert,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import * as React from 'react';
import { useTransactions } from '../../hooks/useTransactions';

const pageSize = 10;

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
}

export default function TransactionsPage() {
  const [page, setPage] = React.useState(0);
  const { data, isLoading, isError, isFetching } = useTransactions(page + 1, pageSize);
  const transactions = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <Paper component="section" sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Transactions
      </Typography>
      {isError && <Alert severity="error">Transactions could not be loaded. Please try again.</Alert>}
      {isLoading && (
        <Table aria-label="Loading transactions">
          <TableBody>
            {Array.from({ length: pageSize }, (_, index) => (
              <TableRow key={index}>
                <TableCell colSpan={5}><Skeleton /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {!isError && !isLoading && (
        <>
          <TableContainer sx={{ opacity: isFetching ? 0.6 : 1 }}>
            <Table aria-label="Transaction history">
              <TableHead>
                <TableRow>
                  <TableCell>Source account</TableCell>
                  <TableCell>Target account</TableCell>
                  <TableCell>Sent amount</TableCell>
                  <TableCell>Received amount</TableCell>
                  <TableCell>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id} data-testid={`transaction-row-${transaction.id}`}>
                    <TableCell>{transaction.fromAccountId}</TableCell>
                    <TableCell>{transaction.toAccountId}</TableCell>
                    <TableCell>{formatAmount(transaction.amount, transaction.currency)}</TableCell>
                    <TableCell>
                      {formatAmount(
                        transaction.convertedAmount ?? transaction.amount,
                        transaction.targetCurrency ?? transaction.currency
                      )}
                    </TableCell>
                    <TableCell>{formatTimestamp(transaction.createdAt)}</TableCell>
                  </TableRow>
                ))}
                {transactions.length === 0 && (
                  <TableRow><TableCell colSpan={5}>No transactions found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={pagination?.totalItems ?? 0}
            page={page}
            onPageChange={(_, nextPage) => setPage(nextPage)}
            rowsPerPage={pageSize}
            rowsPerPageOptions={[pageSize]}
          />
        </>
      )}
    </Paper>
  );
}
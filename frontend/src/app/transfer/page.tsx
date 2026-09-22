'use client';

import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import * as React from 'react';
import { useAccounts } from '../../hooks/useAccounts';
import { TransferApiError, useCreateTransfer, type TransferPayload } from '../../hooks/useTransfers';

type FormValues = {
  fromAccountId: string;
  toAccountId: string;
  amount: string;
  currency: string;
};

const initialForm: FormValues = {
  fromAccountId: '',
  toAccountId: '',
  amount: '',
  currency: ''
};

function createIdempotencyKey() {
  return crypto.randomUUID();
}

export default function TransferPage() {
  const [form, setForm] = React.useState<FormValues>(initialForm);
  const [idempotencyKey, setIdempotencyKey] = React.useState(createIdempotencyKey);
  const [formError, setFormError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [lastPayload, setLastPayload] = React.useState<TransferPayload | null>(null);
  const { data: accounts = [], isLoading: accountsLoading, isError: accountsError } = useAccounts();
  const mutation = useCreateTransfer();

  React.useEffect(() => {
    if (accounts.length >= 2 && !form.fromAccountId) {
      setForm({
        fromAccountId: String(accounts[0].id),
        toAccountId: String(accounts[1].id),
        amount: '',
        currency: accounts[0].currency
      });
    }
  }, [accounts, form.fromAccountId]);

  const updateField = (field: keyof FormValues) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setFormError('');
    setSuccess(false);
  };

  const handleSuccess = () => {
    setSuccess(true);
    setForm(initialForm);
    setIdempotencyKey(createIdempotencyKey());
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = Number(form.amount);
    if (!form.fromAccountId || !form.toAccountId || !form.currency || !Number.isFinite(amount) || amount <= 0) {
      setFormError('Choose two accounts and enter a positive transfer amount.');
      return;
    }
    if (form.fromAccountId === form.toAccountId) {
      setFormError('Source and target accounts must be different.');
      return;
    }

    const payload: TransferPayload = {
      fromAccountId: Number(form.fromAccountId),
      toAccountId: Number(form.toAccountId),
      amount,
      currency: form.currency as TransferPayload['currency']
    };
    setLastPayload(payload);
    setFormError('');
    setSuccess(false);
    mutation.mutate({ payload, idempotencyKey }, { onSuccess: handleSuccess });
  };

  const retryTransfer = () => {
    if (!lastPayload) {
      return;
    }
    mutation.mutate({ payload: lastPayload, idempotencyKey }, { onSuccess: handleSuccess });
  };

  const transferError = mutation.error as TransferApiError | null;
  const transferErrorDetails = transferError
    ? {
        message: transferError.status === 409
          ? 'This transfer is already being processed. Please wait before retrying.'
          : transferError.message,
        severity: transferError.status === 409 || transferError.status === 422 ? 'warning' as const : 'error' as const,
        canRetry: transferError.status === 0 || transferError.status === 503
      }
    : null;

  return (
    <>
      <Paper component="section" sx={{ maxWidth: 720, p: { xs: 2, sm: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Transfer
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Move funds between accounts with an idempotent request.
        </Typography>
        {accountsError && <Alert severity="error" sx={{ mb: 2 }}>Accounts could not be loaded.</Alert>}
        {formError && <Alert severity="warning" sx={{ mb: 2 }}>{formError}</Alert>}
        {transferErrorDetails && (
          <Alert severity={transferErrorDetails.severity} sx={{ mb: 2 }}>
            {transferErrorDetails.message}
            {transferErrorDetails.canRetry && (
              <Button color="inherit" size="small" onClick={retryTransfer} sx={{ ml: 1 }}>
                Retry
              </Button>
            )}
          </Alert>
        )}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Transfer completed successfully.</Alert>}
        <Box component="form" onSubmit={submit} noValidate>
          <Stack spacing={2}>
            <FormControl fullWidth disabled={accountsLoading || mutation.isPending}>
              <InputLabel id="source-account-label">Source account</InputLabel>
              <Select
                labelId="source-account-label"
                label="Source account"
                name="fromAccountId"
                native
                value={form.fromAccountId}
                onChange={updateField('fromAccountId')}
              >
                <option value="" />
                {accounts.map((account) => <option key={account.id} value={account.id}>{account.userId} ({account.currency})</option>)}
              </Select>
            </FormControl>
            <FormControl fullWidth disabled={accountsLoading || mutation.isPending}>
              <InputLabel id="target-account-label">Target account</InputLabel>
              <Select
                labelId="target-account-label"
                label="Target account"
                name="toAccountId"
                native
                value={form.toAccountId}
                onChange={updateField('toAccountId')}
              >
                <option value="" />
                {accounts.map((account) => <option key={account.id} value={account.id}>{account.userId} ({account.currency})</option>)}
              </Select>
            </FormControl>
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={form.amount}
              onChange={updateField('amount')}
              inputProps={{ min: 0, step: '0.01' }}
              disabled={mutation.isPending}
              fullWidth
            />
            <FormControl fullWidth disabled={mutation.isPending}>
              <InputLabel id="transfer-currency-label">Currency</InputLabel>
              <Select
                labelId="transfer-currency-label"
                label="Currency"
                name="currency"
                native
                value={form.currency}
                onChange={updateField('currency')}
              >
                <option value="" />
                {['HUF', 'EUR', 'USD'].map((currency) => <option key={currency} value={currency}>{currency}</option>)}
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" disabled={mutation.isPending || accountsLoading}>
              Submit transfer
            </Button>
          </Stack>
        </Box>
      </Paper>
      <Backdrop open={mutation.isPending} sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}>
        <CircularProgress color="inherit" aria-label="Transfer in progress" />
      </Backdrop>
    </>
  );
}
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CreateAccountInput, Currency, useCreateAccount } from '../hooks/useAccounts';

const accountSchema = z.object({
  userId: z.string().trim().min(1, 'User ID is required'),
  initialBalance: z.string().trim().refine((value) => Number(value) > 0, 'Balance must be greater than zero'),
  currency: z.enum(['HUF', 'EUR', 'USD'])
});

type CreateAccountDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function CreateAccountDialog({ open, onClose }: CreateAccountDialogProps) {
  const mutation = useCreateAccount();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateAccountInput>({
    resolver: zodResolver(accountSchema),
    defaultValues: { userId: '', initialBalance: '', currency: 'EUR' }
  });

  const submit = (input: CreateAccountInput) => {
    mutation.mutate(input, {
      onSuccess: () => {
        reset();
        onClose();
      }
    });
  };

  return (
    <Dialog open={open} onClose={mutation.isPending ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create account</DialogTitle>
      <form onSubmit={handleSubmit(submit)} noValidate>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 1 }}>
          <TextField
            {...register('userId')}
            label="User ID"
            autoFocus
            error={Boolean(errors.userId)}
            helperText={errors.userId?.message}
          />
          <TextField
            {...register('initialBalance')}
            label="Initial balance"
            type="number"
            inputProps={{ min: 0, step: '0.01' }}
            error={Boolean(errors.initialBalance)}
            helperText={errors.initialBalance?.message}
          />
          <FormControl error={Boolean(errors.currency)}>
            <InputLabel id="account-currency-label">Currency</InputLabel>
            <Select
              {...register('currency')}
              labelId="account-currency-label"
              label="Currency"
              defaultValue="EUR"
            >
              {(['HUF', 'EUR', 'USD'] as Currency[]).map((currency) => (
                <MenuItem key={currency} value={currency}>
                  {currency}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.currency?.message}</FormHelperText>
          </FormControl>
          {mutation.isError && <FormHelperText error>Account creation failed. Please try again.</FormHelperText>}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating...' : 'Create account'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
'use client';

import AddIcon from '@mui/icons-material/Add';
import {
  Alert,
  Button,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import * as React from 'react';
import { CreateAccountDialog } from '../../components/CreateAccountDialog';
import { useAccounts } from '../../hooks/useAccounts';

export default function AccountsPage() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { data: accounts = [], isLoading, isError } = useAccounts();

  return (
    <>
      <Paper component="section" sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Accounts
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)} sx={{ mb: 3 }}>
          Create account
        </Button>
        {isLoading && (
          <TableContainer>
            <Table aria-label="Loading accounts">
              <TableBody>
                {[1, 2, 3].map((row) => (
                  <TableRow key={row}>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {isError && <Alert severity="error">Accounts could not be loaded. Please try again.</Alert>}
        {!isLoading && !isError && (
          <TableContainer>
            <Table aria-label="Accounts list">
              <TableHead>
                <TableRow>
                  <TableCell>User ID</TableCell>
                  <TableCell>Currency</TableCell>
                  <TableCell align="right">Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>{account.userId}</TableCell>
                    <TableCell>{account.currency}</TableCell>
                    <TableCell align="right">{account.balance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      <CreateAccountDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
}
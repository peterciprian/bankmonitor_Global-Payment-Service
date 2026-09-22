import { Paper, Typography } from '@mui/material';

export default function HomePage() {
  return (
    <Paper component="section" sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Accounts
      </Typography>
      <Typography color="text.secondary">Account balances will appear here.</Typography>
    </Paper>
  );
}
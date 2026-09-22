'use client';

import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from '@mui/material';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { MainContent } from './MainContent';

export const drawerWidth = 248;

const navItems = [
  { label: 'Accounts', icon: AccountBalanceWalletOutlinedIcon },
  { label: 'Transfer', icon: CompareArrowsOutlinedIcon },
  { label: 'Transactions', icon: ReceiptLongOutlinedIcon }
];

type NavigationProps = {
  children: React.ReactNode;
};

function NavigationItems({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <List aria-label="Primary navigation">
      {navItems.map(({ label, icon: Icon }) => (
        <ListItem key={label} disablePadding>
          <ListItemButton
            selected={pathname === `/${label.toLowerCase()}`}
            component="a"
            href={`/${label.toLowerCase()}`}
            onClick={onNavigate}
          >
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

export function Navigation({ children }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            aria-label="Open navigation"
            onClick={() => setMobileOpen((prev) => !prev)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" noWrap>
            Payment Gateway
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex' }}>
        <Box component="nav" aria-label="Desktop navigation" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
          <Drawer
            variant="permanent"
            open
            sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', pt: 8 } }}
          >
            <NavigationItems />
          </Drawer>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', pt: 8 } }}
          >
            <NavigationItems onNavigate={() => setMobileOpen(false)} />
          </Drawer>
        </Box>
        <MainContent>
          <Toolbar />
          <Box component="section" sx={{ p: { xs: 2, sm: 4 } }}>
            {children}
          </Box>
        </MainContent>
      </Box>
    </>
  );
}

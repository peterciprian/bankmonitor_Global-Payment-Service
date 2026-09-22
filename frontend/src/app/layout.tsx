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
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { MainContent } from '../components/MainContent';
import { Providers } from './providers';

const drawerWidth = 248;

const navItems = [
  { label: 'Accounts', icon: AccountBalanceWalletOutlinedIcon },
  { label: 'Transfer', icon: CompareArrowsOutlinedIcon },
  { label: 'Transactions', icon: ReceiptLongOutlinedIcon }
];

function Navigation({ mobile = false }: { mobile?: boolean }) {
  return (
    <List aria-label="Primary navigation">
      {navItems.map(({ label, icon: Icon }) => (
        <ListItem key={label} disablePadding>
          <ListItemButton selected={label === 'Accounts'} component="a" href={`/${label.toLowerCase()}`}>
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <Providers>
            <AppBar position="fixed" sx={{ zIndex: 1201 }}>
              <Toolbar>
                <IconButton color="inherit" edge="start" aria-label="Open navigation" sx={{ mr: 2, display: { sm: 'none' } }}>
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
                  <Navigation />
                </Drawer>
                <Drawer
                  variant="temporary"
                  ModalProps={{ keepMounted: true }}
                  sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', pt: 8 } }}
                >
                  <Navigation mobile />
                </Drawer>
              </Box>
              <MainContent>
                <Toolbar />
                <Box component="section" sx={{ p: { xs: 2, sm: 4 } }}>
                  {children}
                </Box>
              </MainContent>
            </Box>
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
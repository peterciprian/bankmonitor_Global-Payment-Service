import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0b5d66'
    },
    secondary: {
      main: '#c75c2c'
    },
    background: {
      default: '#f5f7f8',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: 'Georgia, serif',
    h1: {
      fontWeight: 700
    },
    h2: {
      fontWeight: 700
    }
  },
  shape: {
    borderRadius: 6
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid rgba(11, 93, 102, 0.14)'
        }
      }
    }
  }
});
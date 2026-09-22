import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Navigation } from '../components/Navigation';
import { Providers } from './providers';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <Providers>
            <Navigation>{children}</Navigation>
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
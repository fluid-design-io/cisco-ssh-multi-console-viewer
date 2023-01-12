'use client';

import { Inter } from '@next/font/google';
import './globals.css';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppHeader } from './AppHeader';
import { useTheme } from '../lib/useTheme';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <html lang='en' className={inter.variable}>
      <ThemeProvider theme={theme}>
        <body id='__next'>
          <CssBaseline />
          <AppHeader />
          {children}
        </body>
      </ThemeProvider>
    </html>
  );
}

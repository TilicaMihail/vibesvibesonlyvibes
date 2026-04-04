import type { Metadata } from 'next';
import './globals.css';
import StoreProvider from '@/components/StoreProvider';
import ThemeProvider from '@/components/ThemeProvider';
import ToastContainer from '@/components/ui/ToastContainer';

export const metadata: Metadata = {
  title: 'EduPlatform',
  description: 'Modern e-learning platform for organizations',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full">
        <StoreProvider>
          <ThemeProvider>
            {children}
            <ToastContainer />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import StoreProvider from '@/components/StoreProvider';
import ToastContainer from '@/components/ui/ToastContainer';

export const metadata: Metadata = {
  title: 'EduPlatform',
  description: 'Modern e-learning platform for organizations',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <StoreProvider>
          {children}
          <ToastContainer />
        </StoreProvider>
      </body>
    </html>
  );
}

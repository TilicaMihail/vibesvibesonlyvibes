'use client';

import { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useAppSelector((state) => state.ui.darkMode);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return <>{children}</>;
}

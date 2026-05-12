'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '../store/useThemeStore';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const accentColor = useThemeStore(state => state.accentColor);

  useEffect(() => {
    // Apply initial theme on mount
    document.documentElement.setAttribute('data-theme', accentColor);
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute('data-theme', accentColor);
  }, [accentColor, mounted]);

  return <>{children}</>;
}

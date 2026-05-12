import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  accentColor: string;
  setAccentColor: (color: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      accentColor: 'cyan', // default
      setAccentColor: (color) => set({ accentColor: color }),
    }),
    {
      name: 'windtodo-theme',
    }
  )
);

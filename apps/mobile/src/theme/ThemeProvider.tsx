import React, { createContext, useContext, useMemo, useState } from 'react';
import { palette } from './tokens';

export type ThemeName = 'dark' | 'light';

type Theme = {
  name: ThemeName;
  colors: typeof palette;
  setTheme: (name: ThemeName) => void;
};

const light = {
  ...palette,
  background: '#F6F5F2',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  elevated: '#F3F1EC',
  border: 'rgba(15,15,20,0.08)',
  borderStrong: 'rgba(15,15,20,0.16)',
  text: '#16161A',
  textSecondary: '#52525B',
  textMuted: '#71717A',
  inverse: '#FFFFFF',
};

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [name, setTheme] = useState<ThemeName>('dark');
  const value = useMemo<Theme>(
    () => ({
      name,
      colors: name === 'dark' ? palette : light,
      setTheme,
    }),
    [name],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('ThemeProvider is missing');
  }
  return value;
}

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  const updateDocument = (resolved: 'light' | 'dark') => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (resolved === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
  };

  const applyTheme = (targetTheme: Theme) => {
    let resolved: 'light' | 'dark' = 'light';
    if (targetTheme === 'dark') {
      resolved = 'dark';
    } else if (targetTheme === 'light') {
      resolved = 'light';
    } else if (targetTheme === 'system') {
      resolved =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
    }

    setResolvedTheme(resolved);
    updateDocument(resolved);
  };

  useEffect(() => {
    // Read stored theme preference (default to 'light' per design guidelines)
    try {
      const stored = (localStorage.getItem('tooly-theme') as Theme) || 'light';
      setThemeState(stored);
      applyTheme(stored);
    } catch {
      applyTheme('light');
    }

    // Listen for OS theme change if system is selected
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemChange = (e: MediaQueryListEvent) => {
        const currentStored = localStorage.getItem('tooly-theme') as Theme;
        if (currentStored === 'system') {
          const sys = e.matches ? 'dark' : 'light';
          setResolvedTheme(sys);
          updateDocument(sys);
        }
      };
      mediaQuery.addEventListener('change', handleSystemChange);
      return () => mediaQuery.removeEventListener('change', handleSystemChange);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('tooly-theme', newTheme);
    } catch {
      // Ignore in private storage
    }
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'light' as Theme,
      resolvedTheme: 'light' as const,
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
}


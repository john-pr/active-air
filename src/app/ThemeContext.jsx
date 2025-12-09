import React, { createContext, useEffect, useState, useCallback } from 'react';

export const ThemeContext = createContext(null);

const LS_KEY = 'appTheme';

export const ThemeProvider = ({ children }) => {
  const getDefault = () => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) {
      // ignore
    }

    if (typeof window !== 'undefined' && window.matchMedia) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }

    return 'light';
  };

  const [theme, setThemeState] = useState(getDefault);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, theme);
    } catch (e) {
      // ignore
    }

    // Toggle `dark` class on root element for Tailwind/utility-based styling
    if (typeof document !== 'undefined') {
      if (theme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setTheme = useCallback((value) => {
    if (value !== 'dark' && value !== 'light') return;
    setThemeState(value);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

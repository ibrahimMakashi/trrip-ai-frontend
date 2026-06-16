import { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext(null);

const DARK_VARS = {
  '--color-bg': '15 23 42',          // #0F172A
  '--color-surface': '30 41 59',     // #1E293B
  '--color-surface-2': '51 65 85',   // #334155
  '--color-text-1': '248 250 252',   // #F8FAFC
  '--color-text-2': '148 163 184',   // #94A3B8
  '--color-text-3': '100 116 139',   // #64748B
  '--color-border': '51 65 85',      // #334155
};

function applyDarkTheme() {
  const root = document.documentElement;

  root.classList.remove('light', 'dark');
  root.setAttribute('data-theme', 'dark');
  root.classList.add('dark');

  Object.entries(DARK_VARS).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  root.style.colorScheme = 'dark';
  try { localStorage.setItem('theme', 'dark'); } catch (e) {}
}

export const ThemeProvider = ({ children }) => {
  // Dark-theme only
  useEffect(() => {
    applyDarkTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'dark', toggleTheme: () => {}, isDark: true }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};


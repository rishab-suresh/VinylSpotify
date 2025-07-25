import React, { createContext, useState, useContext, useMemo, useEffect, ReactNode } from 'react';
import { themes, type Theme } from '../styles/themes';

type ThemeName = keyof typeof themes;

type ThemeContextType = {
  theme: Theme;
  setTheme: (name: ThemeName) => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useState<ThemeName>('dark');

  const theme = useMemo(() => {
    return themes[themeName] || themes.dark; // Fallback to dark theme if selection is invalid
  }, [themeName]);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove old theme properties
    Object.keys(themes).forEach(name => {
      Object.keys(themes[name as keyof typeof themes].styles).forEach(key => {
        root.style.removeProperty(key);
      });
    });

    // Apply new theme properties
    Object.entries(theme.styles).forEach(([key, value]) => {
      if (value) {
        root.style.setProperty(key, value);
      }
    });
  }, [theme]);

  const value = {
    theme,
    setTheme: setThemeName,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 
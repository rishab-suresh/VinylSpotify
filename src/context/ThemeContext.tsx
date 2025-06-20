import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { themes, type Theme } from '../styles/themes';

type ThemeContextType = {
  theme: Theme;
  setTheme: (name: 'dark' | 'wood' | 'floral') => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useState<'dark' | 'wood' | 'floral'>('dark');

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
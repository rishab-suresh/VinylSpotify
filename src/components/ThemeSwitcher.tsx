import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette } from '@fortawesome/free-solid-svg-icons';
import './ThemeSwitcher.css';
import { themes } from '../styles/themes';

const ThemeSwitcher: React.FC = () => {
  const { setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  const availableThemes = Object.keys(themes) as (keyof typeof themes)[];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleThemeChange = (themeName: keyof typeof themes) => {
    setTheme(themeName);
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div className="theme-switcher-container" ref={switcherRef}>
      <button 
        className="theme-toggle-button" 
        onClick={() => setIsOpen(!isOpen)} 
        aria-label="Toggle Theme Menu"
      >
        <FontAwesomeIcon icon={faPalette} />
      </button>

      {isOpen && (
        <div className="theme-dropdown">
          {availableThemes.map((theme) => (
            <button key={theme} onClick={() => handleThemeChange(theme)}>
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher; 
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeatherAlt } from '@fortawesome/free-solid-svg-icons';
import './ThemeSwitcher.css';

const ThemeSwitcher: React.FC = () => {
  const { setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  const availableThemes = ['dark', 'wood', 'floral']; 
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

  const handleThemeChange = (themeName: 'dark' | 'wood' | 'floral') => {
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
        <FontAwesomeIcon icon={faFeatherAlt} />
      </button>

      {isOpen && (
        <div className="theme-dropdown">
          {availableThemes.map((theme) => (
            <button key={theme} onClick={() => handleThemeChange(theme as 'dark' | 'wood' | 'floral')}>
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher; 
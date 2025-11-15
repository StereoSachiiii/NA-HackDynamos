import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

// Helper to get system preference
const getSystemPreference = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
};

// Helper to apply theme immediately
const applyTheme = (isDark) => {
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    const body = document.body;
    
    if (isDark) {
      root.classList.add('dark');
      body.classList.add('dark');
      // Also set data attribute for additional CSS targeting if needed
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    
    // Force a reflow to ensure styles are applied
    root.offsetHeight;
    
    console.log('Theme applied:', isDark ? 'dark' : 'light', 'Classes:', root.className);
  }
};

// Helper to calculate dark mode from theme mode
const calculateDarkMode = (mode) => {
  if (mode === 'system') {
    return getSystemPreference();
  }
  return mode === 'dark';
};

export const ThemeProvider = ({ children }) => {
  // Initialize theme mode from localStorage or default to 'system'
  const [themeMode, setThemeMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('themeMode');
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        return saved;
      }
    }
    return 'system';
  });

  // Calculate initial dark mode and apply immediately
  const [darkMode, setDarkMode] = useState(() => {
    const isDark = calculateDarkMode(themeMode);
    // Apply theme immediately on initial render
    applyTheme(isDark);
    return isDark;
  });

  // Apply theme on mount and when themeMode changes
  useEffect(() => {
    const isDark = calculateDarkMode(themeMode);
    setDarkMode(isDark);
    applyTheme(isDark);
    localStorage.setItem('themeMode', themeMode);

    // If system mode, listen for system preference changes
    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        const newDarkMode = e.matches;
        setDarkMode(newDarkMode);
        applyTheme(newDarkMode);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode]);

  const setTheme = (mode) => {
    if (['light', 'dark', 'system'].includes(mode)) {
      setThemeMode(mode);
    }
  };

  const toggleDarkMode = () => {
    console.log('Toggle clicked! Current themeMode:', themeMode);
    let newMode;
    if (themeMode === 'system') {
      // If system, toggle to explicit dark
      newMode = 'dark';
    } else if (themeMode === 'dark') {
      // If dark, toggle to light
      newMode = 'light';
    } else {
      // If light, toggle to dark
      newMode = 'dark';
    }
    console.log('Setting themeMode to:', newMode);
    setThemeMode(newMode);
    // Immediately apply the theme
    const isDark = newMode === 'dark';
    applyTheme(isDark);
    setDarkMode(isDark);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, themeMode, setTheme, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};


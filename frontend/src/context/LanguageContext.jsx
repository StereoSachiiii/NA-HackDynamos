import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const LanguageContext = createContext(null);

// Translation files
import enTranslations from '../locales/en.json';
import siTranslations from '../locales/si.json';

const translations = {
  en: enTranslations,
  si: siTranslations
};

export const LanguageProvider = ({ children }) => {
  const { user, updateUser } = useAuth();
  
  // Initialize language from user preference or localStorage, default to 'en'
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      if (saved && ['en', 'si'].includes(saved)) {
        return saved;
      }
    }
    return 'en';
  });

  // Sync with user preference when user changes
  useEffect(() => {
    if (user?.preferredLanguage) {
      const userLang = user.preferredLanguage.toLowerCase();
      if (['en', 'si'].includes(userLang)) {
        setLanguage(userLang);
        localStorage.setItem('language', userLang);
      }
    }
  }, [user?.preferredLanguage]);

  // Translation function
  const t = (key, fallback = '') => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        // Fallback to English if translation not found
        value = translations.en;
        for (const k2 of keys) {
          if (value && typeof value === 'object') {
            value = value[k2];
          } else {
            return fallback || key;
          }
        }
        break;
      }
    }
    
    return value || fallback || key;
  };

  const changeLanguage = async (lang) => {
    if (['en', 'si'].includes(lang)) {
      setLanguage(lang);
      localStorage.setItem('language', lang);
      
      // If user is logged in, update their profile
      if (user) {
        try {
          const { default: api } = await import('../services/api');
          const response = await api.put('/users/profile', {
            preferredLanguage: lang
          });
          // Update user context immediately
          if (response.data?.user) {
            updateUser(response.data.user);
          } else {
            // Fallback: update user object manually
            updateUser({ ...user, preferredLanguage: lang });
          }
        } catch (err) {
          console.error('Failed to update user language preference:', err);
          // Still allow language change even if API call fails
          // Update user object locally
          if (user) {
            updateUser({ ...user, preferredLanguage: lang });
          }
        }
      }
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};


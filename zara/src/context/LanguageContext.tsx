'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getLanguageCode } from '@/lib/translations';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<string>('en');

  useEffect(() => {
    // Load language from localStorage on mount
    const currentLang = getLanguageCode();
    setLanguageState(currentLang);

    // Listen for language changes
    const handleLanguageChange = () => {
      const newLang = getLanguageCode();
      setLanguageState(newLang);
    };

    // Check for language changes periodically
    const interval = setInterval(handleLanguageChange, 500);
    
    // Also listen to storage events
    window.addEventListener('storage', handleLanguageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleLanguageChange);
    };
  }, []);

  const setLanguage = (lang: string) => {
    // Save to localStorage
    const langMap: Record<string, { code: string; name: string }> = {
      'en': { code: 'EN', name: 'English' },
      'ru': { code: 'RU', name: 'Русский' },
      'uz': { code: 'UZ', name: "O'zbekcha" },
      'es': { code: 'ES', name: 'Español' },
    };
    
    const langObj = langMap[lang] || langMap['en'];
    localStorage.setItem('selectedLanguage', JSON.stringify(langObj));
    setLanguageState(lang);
    
    // Trigger storage event for other tabs/components
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}


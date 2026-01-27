'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '@/lib/i18n';

interface AppContextType {
    darkMode: boolean;
    toggleDarkMode: () => void;
    language: Language;
    setLanguage: (lang: Language) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguageState] = useState<Language>('zh');

    // Load preferences from localStorage
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode');
        const savedLanguage = localStorage.getItem('language');

        if (savedDarkMode) {
            setDarkMode(savedDarkMode === 'true');
        }

        if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
            setLanguageState(savedLanguage as Language);
        }
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(prev => {
            const newValue = !prev;
            localStorage.setItem('darkMode', String(newValue));
            return newValue;
        });
    };

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
    };

    return (
        <AppContext.Provider value={{ darkMode, toggleDarkMode, language, setLanguage }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
}

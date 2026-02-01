'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '@/lib/i18n';

interface User {
    id: string;
    email: string;
    name?: string;
}

interface AppContextType {
    darkMode: boolean;
    toggleDarkMode: () => void;
    language: Language;
    setLanguage: (lang: Language) => void;
    user: User | null;
    setUser: (user: User | null) => void;
    isAuthenticated: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguageState] = useState<Language>('zh');
    const [user, setUser] = useState<User | null>(null);

    // Load preferences from localStorage
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode');
        const savedLanguage = localStorage.getItem('language');
        const savedUser = localStorage.getItem('user');

        if (savedDarkMode) {
            setDarkMode(savedDarkMode === 'true');
        }

        if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
            setLanguageState(savedLanguage as Language);
        }

        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error('Failed to parse saved user:', e);
            }
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

    const handleSetUser = (user: User | null) => {
        setUser(user);
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    };

    return (
        <AppContext.Provider value={{ 
            darkMode, 
            toggleDarkMode, 
            language, 
            setLanguage,
            user,
            setUser: handleSetUser,
            isAuthenticated: !!user,
        }}>
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


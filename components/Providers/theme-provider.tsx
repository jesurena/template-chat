'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ConfigProvider, theme as antdTheme, App } from 'antd';

let message: ReturnType<typeof App.useApp>['message'];
let notification: ReturnType<typeof App.useApp>['notification'];
let modal: ReturnType<typeof App.useApp>['modal'];

export { message, notification, modal };

/**
 * Static bridge helper to capture Ant Design's context-aware instances.
 * This allows static utility functions to use the same theme/context as the rest of the app.
 */
function StaticApp() {
    const {
        message: msg,
        notification: notify,
        modal: mdl
    } = App.useApp();

    useEffect(() => {
        message = msg;
        notification = notify;
        modal = mdl;
    }, [msg, notify, mdl]);

    return null;
}

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    isDark: boolean;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('system');
    const [isDark, setIsDark] = useState<boolean>(false);

    const applyThemeClasses = React.useCallback((dark: boolean) => {
        const root = window.document.documentElement;
        if (dark) {
            root.classList.remove('light');
            root.classList.add('dark');
            root.setAttribute('data-theme', 'dark');
        } else {
            root.classList.remove('dark');
            root.classList.add('light');
            root.setAttribute('data-theme', 'light');
        }
    }, []);

    const applyTheme = React.useCallback((newTheme: Theme) => {
        let isDarkMode = false;

        const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (newTheme === 'system') {
            isDarkMode = systemIsDark;
        } else {
            isDarkMode = newTheme === 'dark';
        }

        setIsDark(isDarkMode);
        applyThemeClasses(isDarkMode);
    }, [applyThemeClasses]);

    // Initialize theme from localStorage or default to system
    useEffect(() => {
        const timer = setTimeout(() => {
            const savedTheme = (localStorage.getItem('app-theme') as Theme) || 'system';
            setThemeState(savedTheme);
            applyTheme(savedTheme);
        }, 0);
        return () => clearTimeout(timer);
    }, [applyTheme]);

    // Listen to system theme changes if 'system' is currently selected
    useEffect(() => {
        if (theme !== 'system') return;

        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e: MediaQueryListEvent) => {
            const systemIsDark = e.matches;
            setIsDark(systemIsDark);
            applyThemeClasses(systemIsDark);
        };

        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, [theme, applyThemeClasses]);



    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem('app-theme', newTheme);
        applyTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, isDark, setTheme }}>
            <ConfigProvider
                theme={{
                    algorithm: isDark
                        ? antdTheme.darkAlgorithm
                        : antdTheme.defaultAlgorithm,
                    token: isDark
                        ? {
                            colorBgElevated: '#18181b',
                        }
                        : undefined,
                }}
            >
                <App>
                    <StaticApp />
                    {children}
                </App>
            </ConfigProvider>
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

'use client';

import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { ReactNode, useMemo, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';

// WeChat Standard Color Guidelines (2017.03)
const wechatColors = {
    // Core Colors
    green: '#1AAD19',           // WeChat Green (标准绿)
    darkGreen: '#2BA245',       // Dark Green (深绿)
    darkGrey: '#4D4D4D',        // Dark Grey (深灰)
    mediumGrey: '#888888',      // Medium Grey (中灰)
    lightGrey: '#AAAAAA',       // Light Grey (浅灰)
    backgroundGrey: '#F1F1F1',  // Background Grey (背景灰)

    // Supporting Colors
    blue: '#10AEFF',            // Bright Blue
    darkBlue: '#2782D7',        // Dark Blue
    lightGreen: '#91ED61',      // Light Green
    yellow: '#FFBE00',          // Yellow
    red: '#F76260',             // Red
    darkRed: '#D84E43',         // Dark Red
    orange: '#EA6853',          // Orange
};

function ThemeContent({ children }: { children: ReactNode }) {
    const { darkMode } = useApp();

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const theme = useMemo(() => createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: {
                main: wechatColors.green,
                light: wechatColors.lightGreen,
                dark: wechatColors.darkGreen,
                contrastText: '#FFFFFF',
            },
            secondary: {
                main: wechatColors.blue,
                light: wechatColors.blue,
                dark: wechatColors.darkBlue,
                contrastText: '#FFFFFF',
            },
            success: {
                main: wechatColors.green,
                light: wechatColors.lightGreen,
                dark: wechatColors.darkGreen,
            },
            error: {
                main: wechatColors.red,
                light: wechatColors.red,
                dark: wechatColors.darkRed,
            },
            warning: {
                main: wechatColors.yellow,
                light: wechatColors.yellow,
                dark: '#E6A800',
            },
            info: {
                main: wechatColors.blue,
                light: wechatColors.blue,
                dark: wechatColors.darkBlue,
            },
            background: {
                default: darkMode ? '#121212' : wechatColors.backgroundGrey,
                paper: darkMode ? '#1E1E1E' : '#FFFFFF',
            },
            text: {
                primary: darkMode ? '#FFFFFF' : wechatColors.darkGrey,
                secondary: darkMode ? '#B0B0B0' : wechatColors.mediumGrey,
                disabled: darkMode ? '#666666' : wechatColors.lightGrey,
            },
            divider: darkMode ? '#333333' : wechatColors.backgroundGrey,
        },
        typography: {
            fontFamily: '"HarmonyOS Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif',
            h1: {
                fontWeight: 600,
                fontSize: '1.75rem',
            },
            h2: {
                fontWeight: 600,
                fontSize: '1.5rem',
            },
            h3: {
                fontWeight: 600,
                fontSize: '1.25rem',
            },
            h4: {
                fontWeight: 600,
                fontSize: '1.125rem',
            },
            h5: {
                fontWeight: 600,
                fontSize: '1rem',
            },
            h6: {
                fontWeight: 600,
                fontSize: '0.875rem',
            },
            button: {
                textTransform: 'none',
                fontWeight: 500,
            },
            body1: {
                fontSize: '0.9375rem',
            },
            body2: {
                fontSize: '0.875rem',
            },
        },
        shape: {
            borderRadius: 8,
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        fontWeight: 500,
                        borderRadius: 8,
                        padding: '10px 24px',
                        fontSize: '1rem',
                        transition: 'all 0.2s ease',
                    },
                    contained: {
                        boxShadow: 'none',
                        '&:hover': {
                            boxShadow: 'none',
                        },
                    },
                    containedPrimary: {
                        backgroundColor: wechatColors.green,
                        '&:hover': {
                            backgroundColor: wechatColors.darkGreen,
                        },
                        '&:disabled': {
                            backgroundColor: darkMode ? '#333333' : wechatColors.lightGrey,
                            color: darkMode ? '#666666' : '#FFFFFF',
                        },
                    },
                    outlined: {
                        borderColor: darkMode ? '#444444' : wechatColors.lightGrey,
                        color: darkMode ? '#FFFFFF' : wechatColors.darkGrey,
                        '&:hover': {
                            borderColor: wechatColors.green,
                            backgroundColor: darkMode ? 'rgba(26, 173, 25, 0.08)' : wechatColors.backgroundGrey,
                        },
                    },
                    outlinedPrimary: {
                        borderColor: wechatColors.green,
                        color: wechatColors.green,
                        '&:hover': {
                            borderColor: wechatColors.darkGreen,
                            backgroundColor: darkMode ? 'rgba(26, 173, 25, 0.08)' : wechatColors.backgroundGrey,
                        },
                    },
                    sizeLarge: {
                        padding: '14px 32px',
                        fontSize: '1.0625rem',
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                    },
                    rounded: {
                        borderRadius: 12,
                    },
                    elevation0: {
                        boxShadow: 'none',
                    },
                    elevation1: {
                        boxShadow: darkMode ? '0 1px 3px rgba(0, 0, 0, 0.3)' : '0 1px 2px rgba(0, 0, 0, 0.05)',
                    },
                    elevation2: {
                        boxShadow: darkMode ? '0 2px 8px rgba(0, 0, 0, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
                    },
                    elevation3: {
                        boxShadow: darkMode ? '0 4px 12px rgba(0, 0, 0, 0.5)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        boxShadow: darkMode ? '0 2px 8px rgba(0, 0, 0, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 8,
                            backgroundColor: darkMode ? '#2A2A2A' : wechatColors.backgroundGrey,
                            '& fieldset': {
                                borderColor: 'transparent',
                            },
                            '&:hover fieldset': {
                                borderColor: darkMode ? '#444444' : wechatColors.lightGrey,
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: wechatColors.green,
                                borderWidth: 1,
                            },
                        },
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        borderRadius: 4,
                        fontWeight: 500,
                    },
                },
            },
            MuiTabs: {
                styleOverrides: {
                    indicator: {
                        backgroundColor: wechatColors.green,
                        height: 3,
                    },
                },
            },
            MuiTab: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '0.9375rem',
                        '&.Mui-selected': {
                            color: wechatColors.green,
                        },
                    },
                },
            },
            MuiRadio: {
                styleOverrides: {
                    root: {
                        color: darkMode ? '#666666' : wechatColors.mediumGrey,
                        '&.Mui-checked': {
                            color: wechatColors.green,
                        },
                    },
                },
            },
            MuiCheckbox: {
                styleOverrides: {
                    root: {
                        color: darkMode ? '#666666' : wechatColors.mediumGrey,
                        '&.Mui-checked': {
                            color: wechatColors.green,
                        },
                    },
                },
            },
            MuiSwitch: {
                styleOverrides: {
                    switchBase: {
                        '&.Mui-checked': {
                            color: wechatColors.green,
                            '& + .MuiSwitch-track': {
                                backgroundColor: wechatColors.green,
                            },
                        },
                    },
                },
            },
        },
    }), [darkMode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}

export default function ThemeRegistry({ children }: { children: ReactNode }) {
    return <ThemeContent>{children}</ThemeContent>;
}

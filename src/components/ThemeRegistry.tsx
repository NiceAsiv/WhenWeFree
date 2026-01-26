'use client';

import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { ReactNode } from 'react';

// WeChat-inspired theme
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#07C160',      // WeChat green
            light: '#2DD47E',
            dark: '#059A4C',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#576B95',      // WeChat blue
            light: '#7C8DB5',
            dark: '#455A7F',
            contrastText: '#FFFFFF',
        },
        success: {
            main: '#07C160',
            light: '#2DD47E',
            dark: '#059A4C',
        },
        error: {
            main: '#FA5151',
            light: '#FB7373',
            dark: '#E03E3E',
        },
        warning: {
            main: '#FFC300',
            light: '#FFD633',
            dark: '#E6B000',
        },
        background: {
            default: '#EDEDED',   // WeChat background
            paper: '#FFFFFF',
        },
        text: {
            primary: '#191919',
            secondary: '#8C8C8C',
        },
    },
    typography: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif',
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
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
                containedPrimary: {
                    backgroundColor: '#07C160',
                    '&:hover': {
                        backgroundColor: '#059A4C',
                    },
                },
                outlined: {
                    borderColor: '#E5E5E5',
                    color: '#191919',
                    '&:hover': {
                        borderColor: '#07C160',
                        backgroundColor: 'rgba(7, 193, 96, 0.04)',
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
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                },
                elevation2: {
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                },
                elevation3: {
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                        backgroundColor: '#F7F7F7',
                        '& fieldset': {
                            borderColor: 'transparent',
                        },
                        '&:hover fieldset': {
                            borderColor: '#E5E5E5',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#07C160',
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
                    backgroundColor: '#07C160',
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
                        color: '#07C160',
                    },
                },
            },
        },
    },
});

export default function ThemeRegistry({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}

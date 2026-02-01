'use client';

import { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Button,
    TextField,
    Card,
    CardContent,
    Divider,
    Alert,
    Snackbar,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import EmailIcon from "@mui/icons-material/Email";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import Script from "next/script";

// Declare google global type
declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: any) => void;
                    renderButton: (parent: HTMLElement, options: any) => void;
                    prompt: () => void;
                };
            };
        };
    }
}

export default function LoginPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const { setUser } = useApp();
    const [mode, setMode] = useState<'select' | 'email-signin' | 'email-signup'>('select');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoaded, setGoogleLoaded] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        if (googleLoaded && window.google && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
            // Initialize Google Sign-In
            try {
                window.google.accounts.id.initialize({
                    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                    callback: handleGoogleCallback,
                });
            } catch (error) {
                console.error('Failed to initialize Google Sign-In:', error);
            }
        }
    }, [googleLoaded]);

    const handleGoogleCallback = async (response: any) => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ credential: response.credential }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || t('errors.googleLoginFailed'));
                return;
            }

            // Save user to context
            setUser(data.user);

            // Small delay to ensure state is updated
            setTimeout(() => {
                router.push('/dashboard');
            }, 100);
        } catch (err) {
            console.error('Google sign-in error:', err);
            setError(t('errors.googleLoginNetwork'));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
            setSnackbarMessage('Google 登录功能暂未开放');
            setSnackbarOpen(true);
            return;
        }
        if (!window.google) {
            setError(t('errors.googleLoginNotLoaded'));
            return;
        }
        try {
            // Trigger Google One Tap
            window.google.accounts.id.prompt();
        } catch (error) {
            console.error('Google Sign-In error:', error);
            setError('Google 登录初始化失败，请刷新页面重试');
        }
    };

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError(t('auth.errors.emailRequired'));
            return;
        }
        if (!password) {
            setError(t('auth.errors.passwordRequired'));
            return;
        }
        if (password.length < 6) {
            setError(t('auth.errors.passwordTooShort'));
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || t('errors.loginFailed'));
                return;
            }

            // Save user to context
            setUser(data.user);

            // Small delay to ensure state is updated
            setTimeout(() => {
                router.push('/dashboard');
            }, 100);
        } catch (err) {
            console.error('Login error:', err);
            setError(t('errors.loginNetwork'));
        } finally {
            setLoading(false);
        }
    };

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError(t('auth.errors.emailRequired'));
            return;
        }
        if (!password) {
            setError(t('auth.errors.passwordRequired'));
            return;
        }
        if (password.length < 6) {
            setError(t('auth.errors.passwordTooShort'));
            return;
        }
        if (password !== confirmPassword) {
            setError(t('auth.errors.passwordNotMatch'));
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, name: email.split('@')[0] }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || t('errors.registerFailed'));
                return;
            }

            // Save user to context
            setUser(data.user);

            // Small delay to ensure state is updated
            setTimeout(() => {
                router.push('/dashboard');
            }, 100);
        } catch (err) {
            console.error('Register error:', err);
            setError('注册失败，请检查网络连接');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Load Google Identity Services */}
            <Script
                src="https://accounts.google.com/gsi/client"
                strategy="afterInteractive"
                onLoad={() => setGoogleLoaded(true)}
            />
            
            <Box sx={{
                background: (theme) => theme.palette.mode === 'dark'
                    ? 'linear-gradient(180deg, #000000 0%, #121212 100%)'
                    : 'linear-gradient(180deg, #F1F1F1 0%, #FFFFFF 100%)',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
            }}>
            <Container maxWidth="sm">
                <Box sx={{ mb: 3 }}>
                    <Link href="/" passHref style={{ textDecoration: 'none' }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            sx={{
                                color: (theme) => theme.palette.text.secondary,
                                textTransform: 'none',
                            }}
                        >
                            {t('back')}
                        </Button>
                    </Link>
                </Box>

                <Card
                    elevation={3}
                    sx={{
                        p: { xs: 2, sm: 4 },
                        borderRadius: 3,
                        backgroundColor: (theme) => theme.palette.background.paper,
                    }}
                >
                    <CardContent>
                        {/* Logo */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                            <Image
                                src="/logo/logo.png"
                                alt="When We Free Logo"
                                width={80}
                                height={80}
                                priority
                                style={{ objectFit: 'contain' }}
                            />
                        </Box>

                        {/* Title */}
                        <Typography
                            variant="h4"
                            component="h1"
                            align="center"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                color: (theme) => theme.palette.mode === 'dark' ? '#4CAF50' : '#2BA245',
                                mb: 1,
                            }}
                        >
                            {mode === 'email-signup' ? t('auth.signUpTitle') : t('auth.signInTitle')}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            align="center"
                            sx={{ mb: 4 }}
                        >
                            {mode === 'email-signup' ? t('auth.createAccount') : t('auth.welcome')}
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        {/* Mode: Select Authentication Method */}
                        {mode === 'select' && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<GoogleIcon />}
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                    sx={{
                                        py: 1.5,
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        backgroundColor: '#fff',
                                        color: '#757575',
                                        border: '1px solid #ddd',
                                        boxShadow: 'none',
                                        '&:hover': {
                                            backgroundColor: '#f5f5f5',
                                            boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
                                        },
                                    }}
                                >
                                    {t('auth.googleSignIn')}
                                </Button>

                                <Divider sx={{ my: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('auth.orDivider')}
                                    </Typography>
                                </Divider>

                                <Button
                                    variant="outlined"
                                    size="large"
                                    startIcon={<EmailIcon />}
                                    onClick={() => setMode('email-signin')}
                                    sx={{
                                        py: 1.5,
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                    }}
                                >
                                    {t('auth.emailSignIn')}
                                </Button>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    align="center"
                                    sx={{ mt: 2 }}
                                >
                                    {t('auth.noAccount')}{' '}
                                    <Button
                                        variant="text"
                                        size="small"
                                        onClick={() => setMode('email-signup')}
                                        sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
                                    >
                                        {t('auth.signUp')}
                                    </Button>
                                </Typography>
                            </Box>
                        )}

                        {/* Mode: Email Sign In */}
                        {mode === 'email-signin' && (
                            <Box component="form" onSubmit={handleEmailSignIn} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                <TextField
                                    label={t('auth.email')}
                                    type="email"
                                    fullWidth
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t('auth.emailPlaceholder')}
                                    disabled={loading}
                                />
                                <TextField
                                    label={t('auth.password')}
                                    type="password"
                                    fullWidth
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t('auth.passwordPlaceholder')}
                                    disabled={loading}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    disabled={loading}
                                    sx={{
                                        py: 1.5,
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                    }}
                                >
                                    {loading ? t('loading') : t('auth.signIn')}
                                </Button>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Button
                                        variant="text"
                                        size="small"
                                        onClick={() => setMode('select')}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        {t('back')}
                                    </Button>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('auth.noAccount')}{' '}
                                        <Button
                                            variant="text"
                                            size="small"
                                            onClick={() => setMode('email-signup')}
                                            sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
                                        >
                                            {t('auth.signUp')}
                                        </Button>
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        {/* Mode: Email Sign Up */}
                        {mode === 'email-signup' && (
                            <Box component="form" onSubmit={handleEmailSignUp} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                <TextField
                                    label={t('auth.email')}
                                    type="email"
                                    fullWidth
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t('auth.emailPlaceholder')}
                                    disabled={loading}
                                />
                                <TextField
                                    label={t('auth.password')}
                                    type="password"
                                    fullWidth
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t('auth.passwordPlaceholder')}
                                    disabled={loading}
                                />
                                <TextField
                                    label={t('auth.confirmPassword')}
                                    type="password"
                                    fullWidth
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder={t('auth.confirmPasswordPlaceholder')}
                                    disabled={loading}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    disabled={loading}
                                    sx={{
                                        py: 1.5,
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                    }}
                                >
                                    {loading ? t('loading') : t('auth.signUp')}
                                </Button>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Button
                                        variant="text"
                                        size="small"
                                        onClick={() => setMode('select')}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        {t('back')}
                                    </Button>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('auth.hasAccount')}{' '}
                                        <Button
                                            variant="text"
                                            size="small"
                                            onClick={() => setMode('email-signin')}
                                            sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
                                        >
                                            {t('auth.signIn')}
                                        </Button>
                                    </Typography>
                                </Box>
                            </Box>
                        )}

            {/* Snackbar for info messages */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                message={snackbarMessage}
                sx={{
                    '& .MuiSnackbarContent-root': {
                        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#424242' : '#323232',
                        fontSize: '1rem',
                    },
                }}
            />
                    </CardContent>
                </Card>
            </Container>
        </Box>
        </>
    );
}

'use client';

import { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GroupIcon from "@mui/icons-material/Group";
import EventIcon from "@mui/icons-material/Event";
import LoginIcon from "@mui/icons-material/Login";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";

// Event interface
interface Event {
    id: string;
    title: string;
    description?: string;
    createdAt: string;
    participantCount: number;
    responseCount: number;
}

export default function DashboardPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const { user, setUser } = useApp();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Check authentication and load events in one effect
    useEffect(() => {
        let mounted = true;

        const checkAuthAndLoadEvents = async () => {
            try {
                // Check if already authenticated from context
                if (user) {
                    loadEvents();
                    return;
                }

                // Otherwise check with API
                const response = await fetch('/api/auth/me');
                if (response.ok) {
                    const data = await response.json();
                    if (mounted) {
                        setUser(data.user);
                        // Load events after setting user
                        loadEventsInternal();
                    }
                } else {
                    // Not authenticated, redirect to login
                    router.push('/login');
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                if (mounted) {
                    router.push('/login');
                }
            }
        };

        checkAuthAndLoadEvents();

        return () => {
            mounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once on mount

    const loadEventsInternal = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/user/events');
            if (!response.ok) {
                throw new Error('Failed to load events');
            }
            const data = await response.json();
            setEvents(data.events || []);
        } catch (error) {
            console.error('Failed to load events:', error);
            setError(t('errors.loadEventsFailed'));
        } finally {
            setLoading(false);
        }
    };

    const loadEvents = () => {
        loadEventsInternal();
    };

    const handleDeleteClick = (event: Event) => {
        setEventToDelete(event);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!eventToDelete) return;

        try {
            const response = await fetch(`/api/user/events/${eventToDelete.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete event');
            }

            setEvents(events.filter(e => e.id !== eventToDelete.id));
            setDeleteDialogOpen(false);
            setEventToDelete(null);
        } catch (error) {
            console.error('Failed to delete event:', error);
            setError(t('errors.deleteEventFailed'));
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Don't render anything until we know the auth state
    if (!user) {
        return null;
    }

    return (
        <Box sx={{
            background: (theme) => theme.palette.mode === 'dark'
                ? 'linear-gradient(180deg, #000000 0%, #121212 100%)'
                : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minHeight: '100vh',
            py: { xs: 3, sm: 5 },
        }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 5 }}>
                    <Link href="/" passHref style={{ textDecoration: 'none' }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            sx={{
                                color: (theme) => theme.palette.text.secondary,
                                textTransform: 'none',
                                mb: 3,
                                '&:hover': {
                                    backgroundColor: 'rgba(26, 173, 25, 0.08)',
                                    color: 'primary.main',
                                }
                            }}
                        >
                            {t('back')}
                        </Button>
                    </Link>

                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 3,
                        mb: 2,
                    }}>
                        <Box>
                            <Typography
                                variant="h3"
                                component="h1"
                                sx={{
                                    fontWeight: 800,
                                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                    background: 'linear-gradient(135deg, #1AAD19 0%, #2BA245 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    mb: 1,
                                }}
                            >
                                {t('dashboard.title')}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <EventIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', opacity: 0.75 }}>
                                    {loading ? t('loading') : t('dashboard.eventCount', { count: events.length })}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
                            <Link href="/new" passHref style={{ textDecoration: 'none' }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<AddIcon />}
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 3,
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        width: '100%',
                                        boxShadow: '0 4px 14px rgba(26, 173, 25, 0.3)',
                                        background: 'linear-gradient(135deg, #1AAD19 0%, #2BA245 100%)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 6px 20px rgba(26, 173, 25, 0.4)',
                                        },
                                    }}
                                >
                                    {t('homePage.createEvent')}
                                </Button>
                            </Link>
                        </Box>
                    </Box>
                </Box>

                {/* Error Alert */}
                {error && (
                    <Alert 
                        severity="error" 
                        sx={{ 
                            mb: 3,
                            borderRadius: 2,
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        }} 
                        onClose={() => setError(null)}
                    >
                        {error}
                    </Alert>
                )}

                {/*  sx={{ mb: 4 }}>
                    <Link href="/" passHref style={{ textDecoration: 'none' }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            sx={{
                                color: (theme) => theme.palette.text.secondary,
                                textTransform: 'none',
                                mb: 2,
                            }}
                        >
                            {t('back')}
                        </Button>
                    </Link>

                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2,
                    }}>
                        <Box>
                            <Typography
                                variant="h3"
                                component="h1"
                                gutterBottom
                                sx={{
                                    fontWeight: 700,
                                    color: (theme) => theme.palette.mode === 'dark' ? '#4CAF50' : '#2BA245',
                                }}
                            >
                                {t('dashboard.title')}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {t('dashboard.myEvents')}
                            </Typography>
                        </Box>
                        <Link href="/new" passHref style={{ textDecoration: 'none' }}>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<AddIcon />}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                }}
                            >
                                {t('homePage.createEvent')}
                            </Button>
                        </Link>
                    </Box>
                </Box>

                {/* Loading State */}
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                )}

                {/* Empty State */}
                {!loading && events.length === 0 && (
                    <Card
                        elevation={0}
                        sx={{
                            p: { xs: 4, sm: 8 },
                            textAlign: 'center',
                            backgroundColor: (theme) => theme.palette.background.paper,
                            border: 'none',
                            borderRadius: 4,
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            background: (theme) => theme.palette.mode === 'dark' 
                                ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
                                : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                        }}
                    >
                        <Box sx={{
                            width: 120,
                            height: 120,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(26, 173, 25, 0.1) 0%, rgba(43, 162, 69, 0.15) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            mb: 3,
                        }}>
                            <EventIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                        </Box>
                        <Typography 
                            variant="h5" 
                            gutterBottom 
                            sx={{ 
                                fontWeight: 700,
                                color: 'text.primary',
                                mb: 1.5,
                            }}
                        >
                            {t('dashboard.noEvents')}
                        </Typography>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                mb: 4,
                                maxWidth: 400,
                                mx: 'auto',
                                lineHeight: 1.7,
                                color: 'text.primary',
                                opacity: 0.7,
                                fontSize: '1.05rem',
                            }}
                        >
                            {t('dashboard.createFirst')}
                        </Typography>
                        <Link href="/new" passHref style={{ textDecoration: 'none' }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                size="large"
                                sx={{ 
                                    textTransform: 'none',
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 3,
                                    fontWeight: 600,
                                    boxShadow: '0 4px 14px rgba(26, 173, 25, 0.3)',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px rgba(26, 173, 25, 0.4)',
                                    },
                                }}
                            >
                                {t('homePage.createEvent')}
                            </Button>
                        </Link>
                    </Card>
                )}

                {/* Events Grid */}
                {!loading && events.length > 0 && (
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            lg: 'repeat(3, 1fr)',
                        },
                        gap: { xs: 2.5, sm: 3 },
                    }}>
                        {events.map((event) => (
                            <Box key={event.id}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 3,
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        border: 'none',
                                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                                        background: (theme) => theme.palette.mode === 'dark' 
                                            ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
                                            : 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: 4,
                                            background: 'linear-gradient(90deg, #1AAD19 0%, #2BA245 100%)',
                                            opacity: 0,
                                            transition: 'opacity 0.3s ease',
                                        },
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 12px 28px rgba(26, 173, 25, 0.15)',
                                            '&::before': {
                                                opacity: 1,
                                            },
                                        },
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                        <Typography
                                            variant="h6"
                                            component="h2"
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: '1.15rem',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                minHeight: '3em',
                                                mb: 2,
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            {event.title}
                                        </Typography>

                                        {event.description && (
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    mb: 3,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    lineHeight: 1.6,
                                                    color: 'text.primary',
                                                    opacity: 0.75,
                                                    fontSize: '0.9375rem',
                                                }}
                                            >
                                                {event.description}
                                            </Typography>
                                        )}

                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            gap: 1, 
                                            mb: 2.5,
                                        }}>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                px: 1.5,
                                                py: 0.75,
                                                borderRadius: 2,
                                                backgroundColor: 'rgba(26, 173, 25, 0.08)',
                                            }}>
                                                <GroupIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        fontWeight: 600,
                                                        color: 'primary.main',
                                                    }}
                                                >
                                                    {t('dashboard.responses', { count: event.responseCount })}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ 
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.75,
                                        }}>
                                            <EventIcon sx={{ fontSize: 14, color: 'text.primary', opacity: 0.5 }} />
                                            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary', opacity: 0.65, fontSize: '0.8125rem' }}>
                                                {formatDate(event.createdAt)}
                                            </Typography>
                                        </Box>
                                    </CardContent>

                                    <Box
                                        sx={{
                                            p: 2.5,
                                            pt: 0,
                                            display: 'flex',
                                            gap: 1.5,
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            size="medium"
                                            startIcon={<VisibilityIcon />}
                                            onClick={() => router.push(`/e/${event.id}/results`)}
                                            sx={{ 
                                                flex: 1, 
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                borderRadius: 2,
                                                py: 1,
                                                boxShadow: 'none',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(26, 173, 25, 0.25)',
                                                },
                                            }}
                                        >
                                            {t('dashboard.viewResults')}
                                        </Button>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDeleteClick(event)}
                                            sx={{
                                                border: '1.5px solid',
                                                borderColor: 'error.main',
                                                borderRadius: 2,
                                                width: 44,
                                                height: 44,
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    backgroundColor: 'error.main',
                                                    color: 'white',
                                                    transform: 'scale(1.05)',
                                                },
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Card>
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                    maxWidth="xs"
                    fullWidth
                >
                    <DialogTitle>{t('dashboard.delete')}</DialogTitle>
                    <DialogContent>
                        <Typography>
                            {t('dashboard.deleteConfirm')}
                        </Typography>
                        {eventToDelete && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                「{eventToDelete.title}」
                            </Typography>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setDeleteDialogOpen(false)} sx={{ textTransform: 'none' }}>
                            {t('cancel')}
                        </Button>
                        <Button
                            onClick={handleDeleteConfirm}
                            color="error"
                            variant="contained"
                            sx={{ textTransform: 'none' }}
                        >
                            {t('delete')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}

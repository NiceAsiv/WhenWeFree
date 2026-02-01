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
            setError('加载活动失败，请刷新页面重试');
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
            setError('删除活动失败，请重试');
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
                : 'linear-gradient(180deg, #F1F1F1 0%, #FFFFFF 100%)',
            minHeight: '100vh',
            py: 4,
        }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 4 }}>
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

                {/* Error Alert */}
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
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
                            p: 6,
                            textAlign: 'center',
                            backgroundColor: (theme) => theme.palette.background.paper,
                            border: (theme) => theme.palette.mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0',
                            borderRadius: 3,
                        }}
                    >
                        <EventIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h5" gutterBottom color="text.secondary">
                            {t('dashboard.noEvents')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            {t('dashboard.createFirst')}
                        </Typography>
                        <Link href="/new" passHref style={{ textDecoration: 'none' }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                sx={{ textTransform: 'none' }}
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
                            md: 'repeat(3, 1fr)',
                        },
                        gap: 3,
                    }}>
                        {events.map((event) => (
                            <Box key={event.id}>
                                <Card
                                    elevation={2}
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 3,
                                        transition: 'all 0.3s ease',
                                        border: (theme) => theme.palette.mode === 'dark' ? '1px solid #333' : 'none',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: (theme) => theme.palette.mode === 'dark' 
                                                ? '0px 8px 24px rgba(0, 0, 0, 0.5)' 
                                                : '0px 8px 24px rgba(0, 0, 0, 0.15)',
                                        },
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                        <Typography
                                            variant="h6"
                                            component="h2"
                                            gutterBottom
                                            sx={{
                                                fontWeight: 600,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                minHeight: '3.6em',
                                            }}
                                        >
                                            {event.title}
                                        </Typography>

                                        {event.description && (
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    mb: 2,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                }}
                                            >
                                                {event.description}
                                            </Typography>
                                        )}

                                        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                            <Chip
                                                icon={<GroupIcon />}
                                                label={t('dashboard.responses', { count: event.responseCount })}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </Box>

                                        <Typography variant="caption" color="text.secondary">
                                            {t('dashboard.createdAt')} {formatDate(event.createdAt)}
                                        </Typography>
                                    </CardContent>

                                    <Box
                                        sx={{
                                            p: 2,
                                            pt: 0,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            gap: 1,
                                        }}
                                    >
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<VisibilityIcon />}
                                            onClick={() => router.push(`/e/${event.id}/results`)}
                                            sx={{ flex: 1, textTransform: 'none' }}
                                        >
                                            {t('dashboard.viewResults')}
                                        </Button>
                                        <IconButton
                                            color="error"
                                            size="small"
                                            onClick={() => handleDeleteClick(event)}
                                            sx={{
                                                border: '1px solid',
                                                borderColor: 'error.main',
                                                borderRadius: 1,
                                            }}
                                        >
                                            <DeleteIcon />
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

'use client';

import { useState, useEffect, use } from 'react';
import { notFound } from 'next/navigation';
import { Container, Typography, Box, Button, IconButton, CircularProgress } from "@mui/material";
import Link from "next/link";
import BarChart from "@mui/icons-material/BarChart";
import ShareIcon from "@mui/icons-material/Share";
import ParticipantForm from "@/components/ParticipantForm";
import SettingsMenu from "@/components/SettingsMenu";
import ShareDialog from "@/components/ShareDialog";
import { useTranslation } from "@/hooks/useTranslation";
import { Event } from "@/types";

interface EventPageProps {
    params: Promise<{
        eventId: string;
    }>;
}

export default function EventPage({ params }: EventPageProps) {
    const { eventId } = use(params);
    const { t } = useTranslation();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);

    useEffect(() => {
        async function fetchEvent() {
            try {
                const response = await fetch(`/api/events/${eventId}`);
                if (response.ok) {
                    const data = await response.json();
                    setEvent(data);
                } else if (response.status === 404) {
                    notFound();
                }
            } catch (error) {
                console.error('Error fetching event:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchEvent();
    }, [eventId]);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
                <CircularProgress size={60} sx={{ color: 'primary.main' }} />
                <Typography sx={{ mt: 3 }} color="text.secondary">{t('loading')}</Typography>
            </Container>
        );
    }

    if (!event) {
        notFound();
        return null;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            {/* Top Bar with Settings and Share */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 1 }}>
                <SettingsMenu />
                <IconButton
                    onClick={() => setShareDialogOpen(true)}
                    sx={{
                        color: 'text.primary',
                        '&:hover': {
                            backgroundColor: 'action.hover',
                        },
                    }}
                >
                    <ShareIcon />
                </IconButton>
            </Box>

            <Box sx={{ mb: 5 }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 3,
                    flexWrap: 'wrap',
                    gap: 2,
                }}>
                    <Box>
                        <Typography
                            variant="h3"
                            component="h1"
                            sx={{
                                fontWeight: 700,
                                fontSize: { xs: '2rem', sm: '2.5rem' },
                                mb: 1,
                                background: 'linear-gradient(135deg, #1AAD19 0%, #2BA245 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            {event.title}
                        </Typography>
                        {event.description && (
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{
                                    maxWidth: '600px',
                                    lineHeight: 1.6,
                                }}
                            >
                                {event.description}
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<ShareIcon />}
                            onClick={() => setShareDialogOpen(true)}
                            sx={{
                                borderRadius: 2.5,
                                px: 3,
                                py: 1.25,
                                fontWeight: 600,
                                borderWidth: 1.5,
                                '&:hover': {
                                    borderWidth: 1.5,
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(26, 173, 25, 0.2)',
                                },
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {t('eventPage.shareEvent')}
                        </Button>
                        <Link href={`/e/${eventId}/results`} passHref style={{ textDecoration: 'none' }}>
                            <Button
                                variant="outlined"
                                startIcon={<BarChart />}
                                sx={{
                                    borderRadius: 2.5,
                                    px: 3,
                                    py: 1.25,
                                    fontWeight: 600,
                                    borderWidth: 1.5,
                                    '&:hover': {
                                        borderWidth: 1.5,
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(26, 173, 25, 0.2)',
                                    },
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {t('eventPage.viewResults')}
                            </Button>
                        </Link>
                    </Box>
                </Box>
            </Box>
            <ParticipantForm event={event} />

            {/* Share Dialog */}
            <ShareDialog
                open={shareDialogOpen}
                onClose={() => setShareDialogOpen(false)}
                eventId={event.id}
                eventTitle={event.title}
            />
        </Container>
    );
}

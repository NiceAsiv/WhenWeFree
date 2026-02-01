'use client';

import { useState, useEffect, use } from 'react';
import { notFound } from 'next/navigation';
import { Container, Typography, Box, IconButton, CircularProgress } from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShareIcon from "@mui/icons-material/Share";
import PublicIcon from "@mui/icons-material/Public";
import ResultsView from "@/components/ResultsView";
import SettingsMenu from "@/components/SettingsMenu";
import ShareDialog from "@/components/ShareDialog";
import { useTranslation } from "@/hooks/useTranslation";
import { Event, Response } from "@/types";
import { getTimezoneLabel } from '@/lib/timezones';

interface ResultsPageProps {
    params: Promise<{
        eventId: string;
    }>;
}

export default function ResultsPage({ params }: ResultsPageProps) {
    const { eventId } = use(params);
    const { t } = useTranslation();
    const [event, setEvent] = useState<(Event & { responses: Response[] }) | null>(null);
    const [loading, setLoading] = useState(true);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);

    useEffect(() => {
        async function fetchEvent() {
            try {
                const response = await fetch(`/api/events/${eventId}/results`);
                if (response.ok) {
                    const data = await response.json();
                    setEvent(data.event);
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
            <Container maxWidth="xl" sx={{ py: 6, textAlign: 'center' }}>
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
        <Container maxWidth="xl" sx={{ py: 8 }}>
            {/* Top Bar with Back, Settings and Share */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Link href={`/e/${eventId}`} passHref style={{ textDecoration: 'none' }}>
                    <IconButton
                        sx={{
                            color: 'text.secondary',
                            '&:hover': {
                                backgroundColor: 'action.hover',
                            },
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                </Link>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                        onClick={() => setShareDialogOpen(true)}
                        sx={{
                            color: 'text.secondary',
                            '&:hover': {
                                backgroundColor: 'action.hover',
                            },
                        }}
                    >
                        <ShareIcon />
                    </IconButton>
                    <SettingsMenu />
                </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                        fontWeight: 700,
                        fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                        mb: 2,
                        background: 'linear-gradient(135deg, #1AAD19 0%, #2BA245 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        lineHeight: 1.3,
                    }}
                >
                    {t('resultsPage.title', { title: event.title })}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="body1" color="text.secondary">
                        {t('resultsPage.responsesCount', { count: event.responses.length })}
                    </Typography>
                </Box>
            </Box>
            <ResultsView event={event} responses={event.responses} />

            {/* Share Dialog */}
            <ShareDialog
                open={shareDialogOpen}
                onClose={() => setShareDialogOpen(false)}
                eventId={eventId}
                eventTitle={event.title}
            />
        </Container>
    );
}

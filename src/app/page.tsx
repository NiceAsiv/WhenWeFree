'use client';

import { Container, Box, Typography, Button, Paper, Card } from "@mui/material";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import Group from "@mui/icons-material/Group";
import Schedule from "@mui/icons-material/Schedule";
import EventAvailable from "@mui/icons-material/EventAvailable";
import Link from "next/link";
import Image from "next/image";
import SettingsMenu from "@/components/SettingsMenu";
import { useTranslation } from "@/hooks/useTranslation";

export default function Home() {
    const { t } = useTranslation();

    return (
        <Box sx={{
            background: (theme) => theme.palette.mode === 'dark'
                ? 'linear-gradient(180deg, #000000 0%, #121212 100%)'
                : 'linear-gradient(180deg, #F1F1F1 0%, #FFFFFF 100%)',
            minHeight: '100vh'
        }}>
            {/* Settings Menu in top right */}
            <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>
                <SettingsMenu />
            </Box>

            <Container maxWidth="lg">
                <Box
                    sx={{
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        py: 8,
                    }}
                >
                    {/* Hero Section */}
                    <Box sx={{ textAlign: "center", mb: 8 }}>
                        {/* Logo */}
                        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                            <Image
                                src="/logo/logo.png"
                                alt="When We Free Logo"
                                width={200}
                                height={200}
                                priority
                                style={{ objectFit: 'contain' }}
                            />
                        </Box>

                        <Typography
                            variant="h2"
                            component="h1"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                color: (theme) => theme.palette.mode === 'dark' ? '#4CAF50' : '#2BA245',
                                mb: 3,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 2,
                            }}
                        >
                            When We Free?
                            <EventAvailable sx={{ fontSize: 56, color: (theme) => theme.palette.mode === 'dark' ? '#4CAF50' : '#2BA245' }} />
                        </Typography>
                        <Typography
                            variant="h4"
                            color="text.secondary"
                            gutterBottom
                            sx={{ mb: 5, maxWidth: 600, mx: 'auto' }}
                        >
                            {t('homePage.subtitle')}
                        </Typography>
                        <Link href="/new" passHref style={{ textDecoration: "none" }}>
                            <Button
                                variant="contained"
                                size="large"
                                sx={{
                                    px: 8,
                                    py: 2.5,
                                    fontSize: "1.25rem",
                                    borderRadius: 30,
                                    boxShadow: '0px 4px 12px rgba(103, 80, 164, 0.3)',
                                    '&:hover': {
                                        boxShadow: '0px 8px 24px rgba(103, 80, 164, 0.4)',
                                    },
                                }}
                            >
                                {t('homePage.createEvent')}
                            </Button>
                        </Link>
                    </Box>

                    {/* Features - Large Color Blocks */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                            gap: 4,
                            width: "100%",
                            mt: 4,
                        }}
                    >
                        <Card
                            elevation={0}
                            sx={{
                                p: 4,
                                textAlign: "center",
                                backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1E1E1E' : '#E8F5E9',
                                transition: "all 0.3s ease",
                                border: (theme) => theme.palette.mode === 'dark' ? '1px solid #333' : 'none',
                                "&:hover": {
                                    transform: "translateY(-8px)",
                                    boxShadow: (theme) => theme.palette.mode === 'dark' ? '0px 8px 24px rgba(0, 0, 0, 0.5)' : '0px 8px 24px rgba(0, 0, 0, 0.12)',
                                    borderColor: (theme) => theme.palette.mode === 'dark' ? '#4CAF50' : 'none'
                                },
                            }}
                        >
                            <Box sx={{
                                backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#2E7D32' : '#2BA245',
                                borderRadius: '50%',
                                width: 80,
                                height: 80,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 3
                            }}>
                                <CalendarMonth sx={{ fontSize: 48, color: 'white' }} />
                            </Box>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: (theme) => theme.palette.text.primary }}>
                                {t('homePage.features.simple.title')}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {t('homePage.features.simple.description')}
                            </Typography>
                        </Card>

                        <Card
                            elevation={0}
                            sx={{
                                p: 4,
                                textAlign: "center",
                                backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#252525' : '#C8E6C9',
                                transition: "all 0.3s ease",
                                border: (theme) => theme.palette.mode === 'dark' ? '1px solid #333' : 'none',
                                "&:hover": {
                                    transform: "translateY(-8px)",
                                    boxShadow: (theme) => theme.palette.mode === 'dark' ? '0px 8px 24px rgba(0, 0, 0, 0.5)' : '0px 8px 24px rgba(0, 0, 0, 0.12)',
                                    borderColor: (theme) => theme.palette.mode === 'dark' ? '#4CAF50' : 'none'
                                },
                            }}
                        >
                            <Box sx={{
                                backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1B5E20' : '#1AAD19',
                                borderRadius: '50%',
                                width: 80,
                                height: 80,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 3
                            }}>
                                <Group sx={{ fontSize: 48, color: 'white' }} />
                            </Box>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: (theme) => theme.palette.text.primary }}>
                                {t('homePage.features.smart.title')}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {t('homePage.features.smart.description')}
                            </Typography>
                        </Card>

                        <Card
                            elevation={0}
                            sx={{
                                p: 4,
                                textAlign: "center",
                                backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1E1E1E' : '#E8F5E9',
                                transition: "all 0.3s ease",
                                border: (theme) => theme.palette.mode === 'dark' ? '1px solid #333' : 'none',
                                "&:hover": {
                                    transform: "translateY(-8px)",
                                    boxShadow: (theme) => theme.palette.mode === 'dark' ? '0px 8px 24px rgba(0, 0, 0, 0.5)' : '0px 8px 24px rgba(0, 0, 0, 0.12)',
                                    borderColor: (theme) => theme.palette.mode === 'dark' ? '#4CAF50' : 'none'
                                },
                            }}
                        >
                            <Box sx={{
                                backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#2E7D32' : '#2BA245',
                                borderRadius: '50%',
                                width: 80,
                                height: 80,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 3
                            }}>
                                <Schedule sx={{ fontSize: 48, color: 'white' }} />
                            </Box>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: (theme) => theme.palette.text.primary }}>
                                {t('homePage.features.timezone.title')}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {t('homePage.features.timezone.description')}
                            </Typography>
                        </Card>
                    </Box>

                    {/* Use Cases */}
                    <Box sx={{ mt: 10, textAlign: "center", width: '100%' }}>
                        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
                            {t('homePage.useCases.title')}
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 2,
                                justifyContent: "center",
                            }}
                        >
                            {[
                                t('homePage.useCases.teamActivity'),
                                t('homePage.useCases.interview'),
                                t('homePage.useCases.gathering'),
                                t('homePage.useCases.studyGroup'),
                                t('homePage.useCases.eventPlanning'),
                                t('homePage.useCases.meeting')
                            ].map(
                                (useCase) => (
                                    <Paper
                                        key={useCase}
                                        elevation={0}
                                        sx={{
                                            px: 4,
                                            py: 2,
                                            borderRadius: 30,
                                            backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#2D2D2D' : 'white',
                                            border: (theme) => theme.palette.mode === 'dark'
                                                ? '1px solid #444'
                                                : '2px solid #E7E0EC',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#383838' : '#F6EDFF',
                                                borderColor: (theme) => theme.palette.mode === 'dark' ? '#BB86FC' : '#6750A4',
                                                transform: 'scale(1.05)',
                                            }
                                        }}
                                    >
                                        <Typography variant="body1" sx={{ fontWeight: 500, color: (theme) => theme.palette.text.primary }}>
                                            {useCase}
                                        </Typography>
                                    </Paper>
                                )
                            )}
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

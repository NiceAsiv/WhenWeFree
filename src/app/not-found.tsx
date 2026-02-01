'use client';

import { Container, Typography, Box, Button, Paper } from "@mui/material";
import Link from "next/link";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HomeIcon from "@mui/icons-material/Home";
import { useTranslation } from "@/hooks/useTranslation";

export default function NotFound() {
    const { t } = useTranslation();
    
    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 4, sm: 6 },
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    textAlign: 'center',
                }}
            >
                <Box sx={{ mb: 4 }}>
                    <ErrorOutlineIcon
                        sx={{
                            fontSize: 100,
                            color: 'text.secondary',
                            mb: 3,
                            opacity: 0.5,
                        }}
                    />
                    <Typography
                        variant="h1"
                        component="h1"
                        sx={{
                            fontWeight: 700,
                            fontSize: { xs: '3rem', sm: '4rem' },
                            mb: 2,
                            background: 'linear-gradient(135deg, #888888 0%, #AAAAAA 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        404
                    </Typography>
                    <Typography
                        variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontWeight: 600,
                            mb: 2,
                            color: 'text.primary',
                        }}
                    >
                        {t('notFound.title')}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                        {t('notFound.description')}
                        <br />
                        {t('notFound.hint')}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 300, mx: 'auto' }}>
                    <Link href="/" passHref style={{ textDecoration: 'none' }}>
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            startIcon={<HomeIcon />}
                            sx={{
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 600,
                                borderRadius: 2.5,
                                boxShadow: '0 4px 12px rgba(26, 173, 25, 0.3)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 16px rgba(26, 173, 25, 0.4)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            {t('notFound.backToHome')}
                        </Button>
                    </Link>
                </Box>
            </Paper>
        </Container>
    );
}

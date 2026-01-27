'use client';

import { useEffect } from 'react';
import { Container, Typography, Box, Button, Paper } from "@mui/material";
import Link from "next/link";
import ErrorIcon from "@mui/icons-material/Error";
import HomeIcon from "@mui/icons-material/Home";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error);
    }, [error]);

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 4, sm: 6 },
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'error.main',
                    textAlign: 'center',
                    backgroundColor: 'error.lighter',
                }}
            >
                <Box sx={{ mb: 4 }}>
                    <ErrorIcon
                        sx={{
                            fontSize: 100,
                            color: 'error.main',
                            mb: 3,
                        }}
                    />
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            mb: 2,
                            color: 'error.main',
                        }}
                    >
                        出错了
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2, maxWidth: 500, mx: 'auto' }}>
                        抱歉，应用程序遇到了一个错误。
                    </Typography>
                    {error.message && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: 4,
                                maxWidth: 500,
                                mx: 'auto',
                                fontFamily: 'monospace',
                                backgroundColor: 'background.paper',
                                p: 2,
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            {error.message}
                        </Typography>
                    )}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 300, mx: 'auto' }}>
                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        startIcon={<RefreshIcon />}
                        onClick={reset}
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
                        重试
                    </Button>
                    <Link href="/" passHref style={{ textDecoration: 'none' }}>
                        <Button
                            variant="outlined"
                            size="large"
                            fullWidth
                            startIcon={<HomeIcon />}
                            sx={{
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 600,
                                borderRadius: 2.5,
                                borderWidth: 1.5,
                                '&:hover': {
                                    borderWidth: 1.5,
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(26, 173, 25, 0.2)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            返回首页
                        </Button>
                    </Link>
                </Box>
            </Paper>
        </Container>
    );
}

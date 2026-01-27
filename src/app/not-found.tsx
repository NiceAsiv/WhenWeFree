'use client';

import { Container, Typography, Box, Button, Paper } from "@mui/material";
import Link from "next/link";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HomeIcon from "@mui/icons-material/Home";

export default function NotFound() {
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
                        页面不存在
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                        抱歉，您访问的页面不存在或已被删除。
                        <br />
                        请检查网址是否正确，或返回首页。
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
                            返回首页
                        </Button>
                    </Link>
                </Box>
            </Paper>
        </Container>
    );
}

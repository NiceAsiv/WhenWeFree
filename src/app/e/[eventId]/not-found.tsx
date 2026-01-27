'use client';

import { Container, Typography, Box, Button, Paper } from "@mui/material";
import Link from "next/link";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export default function EventNotFound() {
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
                    <EventBusyIcon
                        sx={{
                            fontSize: 100,
                            color: 'text.secondary',
                            mb: 3,
                            opacity: 0.5,
                        }}
                    />
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            mb: 2,
                            background: 'linear-gradient(135deg, #888888 0%, #AAAAAA 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        活动不存在
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto', lineHeight: 1.8 }}>
                        抱歉，您访问的活动不存在或已被删除。
                        <br />
                        可能的原因：
                    </Typography>
                    <Box sx={{ mb: 4, textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, pl: 2 }}>
                            • 活动链接不正确
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, pl: 2 }}>
                            • 活动已被创建者删除
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, pl: 2 }}>
                            • 活动链接已过期
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 300, mx: 'auto' }}>
                    <Link href="/" passHref style={{ textDecoration: 'none' }}>
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            startIcon={<AddCircleOutlineIcon />}
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
                            创建新活动
                        </Button>
                    </Link>
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

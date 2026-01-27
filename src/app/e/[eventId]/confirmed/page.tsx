'use client';

import { useState, use } from 'react';
import { Container, Typography, Box, Button, Paper } from "@mui/material";
import Link from "next/link";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShareIcon from "@mui/icons-material/Share";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ShareDialog from "@/components/ShareDialog";

interface ConfirmedPageProps {
    params: Promise<{
        eventId: string;
    }>;
}

export default function ConfirmedPage({ params }: ConfirmedPageProps) {
    const { eventId } = use(params);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);

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
                    <CheckCircleIcon
                        sx={{
                            fontSize: 80,
                            color: 'success.main',
                            mb: 2,
                        }}
                    />
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #1AAD19 0%, #2BA245 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        活动创建成功！
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        现在可以分享活动链接给参与者，让他们填写自己的空闲时间
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, mx: 'auto' }}>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<ShareIcon />}
                        onClick={() => setShareDialogOpen(true)}
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
                        分享活动链接
                    </Button>
                    <Link href={`/e/${eventId}`} passHref style={{ textDecoration: 'none' }}>
                        <Button
                            variant="outlined"
                            size="large"
                            fullWidth
                            startIcon={<EventAvailableIcon />}
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
                            查看活动页面
                        </Button>
                    </Link>
                </Box>
            </Paper>

            {/* Share Dialog */}
            <ShareDialog
                open={shareDialogOpen}
                onClose={() => setShareDialogOpen(false)}
                eventId={eventId}
                eventTitle="活动"
            />
        </Container>
    );
}

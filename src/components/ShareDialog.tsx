'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    IconButton,
    Alert,
    InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';

interface ShareDialogProps {
    open: boolean;
    onClose: () => void;
    eventId: string;
    eventTitle: string;
}

export default function ShareDialog({ open, onClose, eventId, eventTitle }: ShareDialogProps) {
    const [copied, setCopied] = useState(false);
    const { language } = useApp();

    const shareUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/e/${eventId}`
        : '';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                },
            }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {t(language, 'shareDialog.title')}
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {t(language, 'shareDialog.description')}
                </Typography>

                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        {eventTitle}
                    </Typography>
                    <TextField
                        fullWidth
                        value={shareUrl}
                        InputProps={{
                            readOnly: true,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleCopy} edge="end">
                                        {copied ? <CheckIcon color="success" /> : <ContentCopyIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#f5f5f5',
                            },
                        }}
                    />
                </Box>

                {copied && (
                    <Alert severity="success" sx={{ borderRadius: 2 }}>
                        {t(language, 'shareDialog.linkCopied')}
                    </Alert>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
                    {t(language, 'cancel')}
                </Button>
                <Button
                    onClick={handleCopy}
                    variant="contained"
                    startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
                    sx={{ borderRadius: 2 }}
                >
                    {copied ? t(language, 'copied') : t(language, 'shareDialog.copyLink')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

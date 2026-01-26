'use client';

import { useState, useEffect } from 'react';
import { Paper, TextField, Button, Box, Alert, Typography, CircularProgress } from '@mui/material';
import Link from 'next/link';
import TimeGrid from './TimeGrid';
import { Event } from '@/types';

interface ParticipantFormProps {
    event: Event;
}

export default function ParticipantForm({ event }: ParticipantFormProps) {
    const [name, setName] = useState('');
    const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingExisting, setLoadingExisting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [existingResponseId, setExistingResponseId] = useState<string | null>(null);

    // Load saved name from localStorage on mount
    useEffect(() => {
        const savedName = localStorage.getItem(`userName_${event.id}`);
        if (savedName) {
            setName(savedName);
            // Auto-load existing data
            loadExistingResponse(savedName);
        }
    }, [event.id]);

    // Load existing response when name changes (after debounce)
    useEffect(() => {
        if (!name || name.length < 2) {
            setSelectedSlots([]);
            setIsUpdate(false);
            setExistingResponseId(null);
            return;
        }

        const timer = setTimeout(() => {
            loadExistingResponse(name);
        }, 500); // Debounce 500ms

        return () => clearTimeout(timer);
    }, [name, event.id]);

    const loadExistingResponse = async (userName: string) => {
        if (!userName || userName.length < 2) return;

        setLoadingExisting(true);
        try {
            const response = await fetch(`/api/events/${event.id}/responses?name=${encodeURIComponent(userName)}`);

            if (response.ok) {
                const data = await response.json();
                if (data.response) {
                    // Found existing response
                    setSelectedSlots(data.response.availabilitySlots);
                    setIsUpdate(true);
                    setExistingResponseId(data.response.id);
                } else {
                    // No existing response
                    setSelectedSlots([]);
                    setIsUpdate(false);
                    setExistingResponseId(null);
                }
            }
        } catch (err) {
            console.error('Error loading existing response:', err);
        } finally {
            setLoadingExisting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || name.trim().length < 2) {
            setError('请输入至少2个字符的昵称');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const response = await fetch(`/api/events/${event.id}/responses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name.trim(),
                    availabilitySlots: selectedSlots,
                    responseId: existingResponseId,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || '提交失败');
            }

            const data = await response.json();

            // Save name to localStorage
            localStorage.setItem(`userName_${event.id}`, name.trim());

            if (data.response) {
                setExistingResponseId(data.response.id);
            }

            setSuccess(true);
            setIsUpdate(data.isUpdate);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ position: 'relative' }}>
                        <TextField
                            fullWidth
                            required
                            label="你的昵称"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="输入昵称（至少2个字符）"
                            sx={{ mb: 1 }}
                            helperText={
                                loadingExisting
                                    ? "正在加载已有数据..."
                                    : isUpdate
                                        ? "✓ 已找到你之前的选择，修改后重新提交即可"
                                        : "输入昵称后自动保存，下次可以继续修改"
                            }
                            InputProps={{
                                endAdornment: loadingExisting && <CircularProgress size={20} />,
                            }}
                        />
                    </Box>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        选择你的空闲时间
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        点击或拖拽选择时间段
                    </Typography>

                    <TimeGrid
                        event={event}
                        selectedSlots={selectedSlots}
                        onSlotsChange={setSelectedSlots}
                    />
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        <Box>
                            {isUpdate ? `已更新 "${name}" 的空闲时间！` : `已保存 "${name}" 的空闲时间！`}
                            <Box sx={{ mt: 1 }}>
                                <Link href={`/e/${event.id}/results`} style={{ color: 'inherit', fontWeight: 600 }}>
                                    → 点击查看所有人的结果
                                </Link>
                            </Box>
                        </Box>
                    </Alert>
                )}

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || selectedSlots.length === 0 || !name || name.trim().length < 2}
                        size="large"
                    >
                        {loading ? '提交中...' : isUpdate ? '更新我的空闲时间' : '提交我的空闲时间'}
                    </Button>
                </Box>
            </form>
        </Paper>
    );
}

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Paper, TextField, Button, Box, Alert, Typography, CircularProgress, Chip, Divider, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import Link from 'next/link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PublicIcon from '@mui/icons-material/Public';
import TimeGrid from './TimeGrid';
import { Event } from '@/types';
import { format, addDays } from 'date-fns';
import { storeEmailLocally, getStoredEmail } from '@/lib/crypto';
import { getTimezoneLabel, getUserTimezone, TIMEZONES } from '@/lib/timezones';

interface ParticipantFormProps {
    event: Event;
}

export default function ParticipantForm({ event }: ParticipantFormProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingExisting, setLoadingExisting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [existingResponseId, setExistingResponseId] = useState<string | null>(null);
    // 用户选择的查看时区，默认使用活动时区
    const [viewTimezone, setViewTimezone] = useState<string>(event.timezone);

    // 初始化时设置默认查看时区为活动时区
    useEffect(() => {
        setViewTimezone(event.timezone);
    }, [event.timezone]);

    // Email validation
    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Load saved email from localStorage on mount
    useEffect(() => {
        const savedEmail = getStoredEmail(event.id);
        if (savedEmail) {
            setEmail(savedEmail);
            // Auto-load existing data
            loadExistingResponse(savedEmail);
        }
    }, [event.id]);

    // Load existing response when email changes (after debounce)
    useEffect(() => {
        if (!email || !isValidEmail(email)) {
            // Only clear if email is invalid, not if user is typing
            if (email && !isValidEmail(email)) {
                setIsUpdate(false);
                setExistingResponseId(null);
            }
            return;
        }

        const timer = setTimeout(() => {
            loadExistingResponse(email);
        }, 500); // Debounce 500ms

        return () => clearTimeout(timer);
    }, [email, event.id]);

    const loadExistingResponse = async (userEmail: string) => {
        if (!userEmail || !isValidEmail(userEmail)) return;

        setLoadingExisting(true);
        try {
            // Use PUT method with email in body instead of URL params for security
            const response = await fetch(`/api/events/${event.id}/responses`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userEmail.trim().toLowerCase(),
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.response) {
                    // Found existing response
                    setName(data.response.name || '');
                    setSelectedSlots(data.response.availabilitySlots);
                    setIsUpdate(true);
                    setExistingResponseId(data.response.id);
                } else {
                    // No existing response - DON'T clear slots if user is selecting
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

    // Calculate selected time slots details for display
    const selectedSlotsDetails = useMemo(() => {
        if (selectedSlots.length === 0) return [];

        const startDate = new Date(event.startDate);

        // Calculate slots per day
        let slotsPerDay = 0;
        let getSlotLabel = (slotInDay: number): string => '';

        if (event.mode === 'fullDay') {
            slotsPerDay = 1;
            getSlotLabel = () => '全天';
        } else if (event.timeMode === 'period') {
            slotsPerDay = 3;
            const labels = ['上午 9-12', '下午 12-18', '晚上 18-22'];
            getSlotLabel = (slotInDay) => labels[slotInDay] || '';
        } else if (event.timeMode === 'custom' && event.customTimeSlots) {
            slotsPerDay = event.customTimeSlots.length;
            getSlotLabel = (slotInDay) => {
                const slot = event.customTimeSlots![slotInDay];
                return slot ? `${slot.label} ${slot.startTime}-${slot.endTime}` : '';
            };
        } else if (event.dayStartTime && event.dayEndTime && event.slotMinutes) {
            const [startHour, startMin] = event.dayStartTime.split(':').map(Number);
            const [endHour, endMin] = event.dayEndTime.split(':').map(Number);
            const totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
            const slotMinutes = event.slotMinutes;
            slotsPerDay = Math.floor(totalMinutes / slotMinutes);
            getSlotLabel = (slotInDay) => {
                const minutes = startHour * 60 + startMin + slotInDay * slotMinutes;
                const hour = Math.floor(minutes / 60);
                const min = minutes % 60;
                const endMinutes = minutes + slotMinutes;
                const endHour = Math.floor(endMinutes / 60);
                const endMin = endMinutes % 60;
                return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}-${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
            };
        }

        if (slotsPerDay === 0) return [];

        // Group slots by day
        const slotsByDay: { [key: string]: string[] } = {};
        selectedSlots.forEach(slotIndex => {
            const dayIndex = Math.floor(slotIndex / slotsPerDay);
            const slotInDay = slotIndex % slotsPerDay;
            const currentDay = addDays(startDate, dayIndex);
            const dateKey = format(currentDay, 'yyyy-MM-dd');
            const dateLabel = format(currentDay, 'M月d日 (EEE)');
            const timeLabel = getSlotLabel(slotInDay);

            if (!slotsByDay[dateKey]) {
                slotsByDay[dateKey] = [];
            }
            slotsByDay[dateKey].push(timeLabel);
        });

        // Convert to array and sort by date
        return Object.entries(slotsByDay)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([dateKey, times]) => {
                const date = new Date(dateKey);
                return {
                    date: format(date, 'M月d日 (EEE)'),
                    times: times.sort(),
                };
            });
    }, [selectedSlots, event]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (selectedSlots.length === 0) {
            setError('请至少选择一个时间段');
            return;
        }

        if (!name || name.trim().length < 2) {
            setError('请输入至少2个字符的昵称');
            return;
        }

        if (!email || !isValidEmail(email)) {
            setError('请输入有效的邮箱地址');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`/api/events/${event.id}/responses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    availabilitySlots: selectedSlots,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || '提交失败');
            }

            const data = await response.json();
            setSuccess(true);
            setIsUpdate(data.isUpdate);
            setExistingResponseId(data.response.id);

            // Save email to localStorage for next time (using secure storage)
            storeEmailLocally(event.id, email.trim().toLowerCase());
        } catch (err) {
            setError(err instanceof Error ? err.message : '提交失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2.5, sm: 4 },
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    background: 'linear-gradient(to bottom, #ffffff, #fafafa)',
                }}
            >
                {/* Timezone Selector */}
                <Paper
                    elevation={1}
                    sx={{ 
                        mb: 3,
                        p: 2.5,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                                color: 'white',
                            }}
                        >
                            <PublicIcon sx={{ fontSize: 18 }} />
                        </Box>
                        <Typography 
                            variant="subtitle1" 
                            sx={{ 
                                fontWeight: 600, 
                                color: 'text.primary',
                            }}
                        >
                            时区设置
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                            活动时区：<Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>{getTimezoneLabel(event.timezone)}</Box>
                        </Typography>
                        <FormControl fullWidth size="small">
                            <InputLabel>选择你查看时间的时区</InputLabel>
                            <Select
                                value={viewTimezone}
                                label="选择你查看时间的时区"
                                onChange={(e) => setViewTimezone(e.target.value)}
                            >
                                {TIMEZONES.map((tz) => (
                                    <MenuItem key={tz.value} value={tz.value}>
                                        {tz.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {viewTimezone !== event.timezone && (
                        <Alert severity="info" sx={{ fontSize: '0.875rem' }}>
                            你正在以 <strong>{getTimezoneLabel(viewTimezone)}</strong> 查看时间。你选择的时间会自动转换为活动时区保存。
                        </Alert>
                    )}
                </Paper>

                <form onSubmit={handleSubmit}>
                    {/* Name Input Section */}
                    <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                        <Typography
                            variant="h6"
                            sx={{
                                mb: 2,
                                fontWeight: 600,
                                color: 'text.primary',
                                fontSize: { xs: '1rem', sm: '1.25rem' },
                            }}
                        >
                            你的信息
                        </Typography>
                        <Box sx={{ position: 'relative' }}>
                            <TextField
                                fullWidth
                                required
                                label="昵称"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="输入你的昵称"
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#fff',
                                    }
                                }}
                            />
                            <TextField
                                fullWidth
                                required
                                type="email"
                                label="邮箱"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="输入你的邮箱"
                                error={email.length > 0 && !isValidEmail(email)}
                                sx={{
                                    mb: 1,
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#fff',
                                    }
                                }}
                                helperText={
                                    loadingExisting
                                        ? "正在加载已有数据..."
                                        : isUpdate
                                            ? "✓ 已找到你之前的选择，修改后重新提交即可"
                                            : "输入邮箱后自动保存，下次可以继续修改"
                                }
                                InputProps={{
                                    endAdornment: loadingExisting && <CircularProgress size={20} />,
                                }}
                            />
                        </Box>
                    </Box>

                    <Divider sx={{ my: { xs: 3, sm: 4 } }} />

                    {/* Time Selection Section */}
                    <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                        <Typography
                            variant="h6"
                            sx={{
                                mb: 1,
                                fontWeight: 600,
                                color: 'text.primary',
                                fontSize: { xs: '1rem', sm: '1.25rem' },
                            }}
                        >
                            选择你的空闲时间
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 2, sm: 3 } }}>
                            点击或拖拽选择时间段，绿色表示已选中
                            {viewTimezone !== event.timezone && (
                                <Box component="span" sx={{ 
                                    display: 'block', 
                                    mt: 1, 
                                    px: 1.5, 
                                    py: 0.5, 
                                    borderRadius: 1, 
                                    bgcolor: 'rgba(16, 174, 255, 0.08)', 
                                    color: 'info.main', 
                                    fontWeight: 500, 
                                    fontSize: '0.8125rem',
                                    border: '1px solid',
                                    borderColor: 'rgba(16, 174, 255, 0.2)',
                                }}>
                                    当前显示时区：{getTimezoneLabel(viewTimezone)}
                                </Box>
                            )}
                        </Typography>

                        <TimeGrid
                            event={event}
                            selectedSlots={selectedSlots}
                            onSlotsChange={setSelectedSlots}
                            viewTimezone={viewTimezone}
                        />
                    </Box>

                    {/* Selected Slots Summary */}
                    {selectedSlots.length > 0 && (
                        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: { xs: 2.5, sm: 3 },
                                    borderRadius: 2.5,
                                    background: 'linear-gradient(135deg, #1AAD19 0%, #2BA245 100%)',
                                    color: '#fff',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        width: '200px',
                                        height: '200px',
                                        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                                        borderRadius: '50%',
                                        transform: 'translate(50%, -50%)',
                                    }
                                }}
                            >
                                <Box sx={{ position: 'relative', zIndex: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <CheckCircleIcon sx={{ mr: 1.5, fontSize: { xs: 24, sm: 28 } }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                                            已选择 {selectedSlots.length} 个时间段
                                        </Typography>
                                    </Box>

                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                        maxHeight: { xs: '250px', sm: '300px' },
                                        overflowY: 'auto',
                                        pr: 1,
                                        '&::-webkit-scrollbar': {
                                            width: '6px',
                                        },
                                        '&::-webkit-scrollbar-track': {
                                            background: 'rgba(255,255,255,0.1)',
                                            borderRadius: '3px',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            background: 'rgba(255,255,255,0.3)',
                                            borderRadius: '3px',
                                            '&:hover': {
                                                background: 'rgba(255,255,255,0.4)',
                                            },
                                        },
                                    }}>
                                        {selectedSlotsDetails.map((day, index) => (
                                            <Box key={index}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <EventAvailableIcon sx={{ mr: 1, fontSize: { xs: 16, sm: 18 }, opacity: 0.9 }} />
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            fontWeight: 600,
                                                            opacity: 0.95,
                                                            fontSize: { xs: '0.9375rem', sm: '1rem' },
                                                        }}
                                                    >
                                                        {day.date}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: 1,
                                                    ml: { xs: 3, sm: 4 },
                                                }}>
                                                    {day.times.map((time, timeIndex) => (
                                                        <Chip
                                                            key={timeIndex}
                                                            label={time}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: 'rgba(255,255,255,0.25)',
                                                                color: '#fff',
                                                                fontWeight: 500,
                                                                fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                                                                backdropFilter: 'blur(10px)',
                                                                border: '1px solid rgba(255,255,255,0.2)',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(255,255,255,0.35)',
                                                                },
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </Paper>
                        </Box>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert
                            severity="success"
                            sx={{
                                mb: 2,
                                borderRadius: 2,
                                '& .MuiAlert-message': {
                                    width: '100%',
                                }
                            }}
                        >
                            <Box>
                                <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, fontSize: { xs: '0.9375rem', sm: '1rem' } }}>
                                    {isUpdate ? `已更新 "${name}" 的空闲时间！` : `已保存 "${name}" 的空闲时间！`}
                                </Typography>
                                <Link href={`/e/${event.id}/results`} style={{ color: 'inherit', fontWeight: 600, textDecoration: 'none' }}>
                                    <Box sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        '&:hover': {
                                            textDecoration: 'underline',
                                        }
                                    }}>
                                        → 点击查看所有人的结果
                                    </Box>
                                </Link>
                            </Box>
                        </Alert>
                    )}

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading || selectedSlots.length === 0 || !name || name.trim().length < 2 || !email || !isValidEmail(email)}
                            size="large"
                            sx={{
                                minWidth: { xs: '100%', sm: 200 },
                                py: 1.5,
                                fontSize: { xs: '0.9375rem', sm: '1rem' },
                                fontWeight: 600,
                                borderRadius: 2.5,
                                boxShadow: selectedSlots.length > 0 && name.trim().length >= 2 && isValidEmail(email)
                                    ? '0 4px 12px rgba(26, 173, 25, 0.3)'
                                    : 'none',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 16px rgba(26, 173, 25, 0.4)',
                                },
                                '&:active': {
                                    transform: 'translateY(0)',
                                },
                            }}
                        >
                            {loading ? '提交中...' : isUpdate ? '更新我的空闲时间' : '提交我的空闲时间'}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Paper, TextField, Button, Box, Alert, Typography, CircularProgress, Chip, Divider, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import Link from 'next/link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PublicIcon from '@mui/icons-material/Public';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import TimeGrid from './TimeGrid';
import { Event } from '@/types';
import { format, addDays } from 'date-fns';
import { storeEmailLocally, getStoredEmail } from '@/lib/crypto';
import { getTimezoneLabel, getUserTimezone, TIMEZONES } from '@/lib/timezones';
import { useTranslation } from '@/hooks/useTranslation';

interface ParticipantFormProps {
    event: Event;
}

export default function ParticipantForm({ event }: ParticipantFormProps) {
    const { t, language } = useTranslation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingExisting, setLoadingExisting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [existingResponseId, setExistingResponseId] = useState<string | null>(null);
    // 用户选择的查看时区，默认使用北京时间
    const [viewTimezone, setViewTimezone] = useState<string>('Asia/Shanghai');

    // 初始化时设置默认查看时区为北京时间
    useEffect(() => {
        setViewTimezone('Asia/Shanghai');
    }, []);

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
            getSlotLabel = () => t('participantForm.fullDay');
        } else if (event.timeMode === 'period') {
            slotsPerDay = 3;
            const labels = [t('participantForm.morning'), t('participantForm.afternoon'), t('participantForm.evening')];
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
        const dateFormat = language === 'zh' ? 'M月d日 (EEE)' : 'MMM d (EEE)';
        
        selectedSlots.forEach(slotIndex => {
            const dayIndex = Math.floor(slotIndex / slotsPerDay);
            const slotInDay = slotIndex % slotsPerDay;
            const currentDay = addDays(startDate, dayIndex);
            const dateKey = format(currentDay, 'yyyy-MM-dd');
            const dateLabel = format(currentDay, dateFormat);
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
                    date: format(date, dateFormat),
                    times: times.sort(),
                };
            });
    }, [selectedSlots, event, language]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (selectedSlots.length === 0) {
            setError(t('participantForm.errorSelectSlots'));
            return;
        }

        if (!name || name.trim().length < 2) {
            setError(t('participantForm.errorNameMinLength'));
            return;
        }

        if (!email || !isValidEmail(email)) {
            setError(t('participantForm.errorInvalidEmail'));
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
                throw new Error(data.error || t('participantForm.errorSubmitFailed'));
            }

            const data = await response.json();
            setSuccess(true);
            setIsUpdate(data.isUpdate);
            setExistingResponseId(data.response.id);

            // Save email to localStorage for next time (using secure storage)
            storeEmailLocally(event.id, email.trim().toLowerCase());
        } catch (err) {
            setError(err instanceof Error ? err.message : t('participantForm.errorSubmitRetry'));
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
                    elevation={0}
                    sx={{ 
                        mb: 3,
                        p: 2.5,
                        borderRadius: 2.5,
                        border: '1px solid',
                        borderColor: 'rgba(26, 173, 25, 0.2)',
                        background: 'linear-gradient(135deg, rgba(26, 173, 25, 0.03) 0%, rgba(43, 162, 69, 0.05) 100%)',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 36,
                                height: 36,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #1AAD19 0%, #2BA245 100%)',
                                color: 'white',
                                boxShadow: '0 2px 8px rgba(26, 173, 25, 0.25)',
                            }}
                        >
                            <PublicIcon sx={{ fontSize: 20 }} />
                        </Box>
                        <Typography 
                            variant="subtitle1" 
                            sx={{ 
                                fontWeight: 600, 
                                color: 'text.primary',
                            }}
                        >
                            {t('participantForm.timezoneSettings')}
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>{t('participantForm.selectTimezone')}</InputLabel>
                            <Select
                                value={viewTimezone}
                                label={t('participantForm.selectTimezone')}
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
                        <Alert 
                            severity="success" 
                            sx={{ 
                                fontSize: '0.875rem',
                                bgcolor: 'rgba(26, 173, 25, 0.08)',
                                color: 'primary.main',
                                borderRadius: 2,
                                border: '1px solid rgba(26, 173, 25, 0.2)',
                                '& .MuiAlert-icon': {
                                    color: 'primary.main',
                                },
                            }}
                        >
                            <span dangerouslySetInnerHTML={{ 
                                __html: t('participantForm.timezoneNotice', { 
                                    timezone: getTimezoneLabel(viewTimezone) 
                                }) 
                            }} />
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
                            {t('participantForm.yourInfo')}
                        </Typography>
                        <Box sx={{ position: 'relative' }}>
                            <TextField
                                fullWidth
                                required
                                label={t('participantForm.name')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('participantForm.namePlaceholder')}
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
                                label={t('participantForm.email')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('participantForm.emailPlaceholder')}
                                error={email.length > 0 && !isValidEmail(email)}
                                sx={{
                                    mb: 1,
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#fff',
                                    }
                                }}
                                helperText={
                                    loadingExisting
                                        ? t('participantForm.loadingData')
                                        : isUpdate
                                            ? t('participantForm.foundPrevious')
                                            : t('participantForm.autoSave')
                                }
                                InputProps={{
                                    endAdornment: loadingExisting && <CircularProgress size={20} />,
                                }}
                            />
                        </Box>
                    </Box>

                    <Divider 
                        sx={{ 
                            my: { xs: 3, sm: 4 },
                            borderColor: 'rgba(26, 173, 25, 0.25)',
                            '&::before, &::after': {
                                borderColor: 'rgba(26, 173, 25, 0.25)',
                            }
                        }} 
                    />

                    {/* Time Selection Section */}
                    <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                        <Typography
                            variant="h6"
                            sx={{
                                mb: 1,
                                fontWeight: 600,
                                color: 'text.primary',
                                fontSize: { xs: '1rem', sm: '1.25rem' },
                                textAlign: 'center',
                            }}
                        >
                            {t('participantForm.selectTime')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 2, sm: 3 }, textAlign: 'center' }}>
                            {t('participantForm.selectTimeHint')}
                            {viewTimezone !== event.timezone && (
                                <Box component="span" sx={{ 
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    mt: 1.5, 
                                    px: 2, 
                                    py: 0.75, 
                                    borderRadius: 2, 
                                    background: 'linear-gradient(135deg, rgba(26, 173, 25, 0.08) 0%, rgba(43, 162, 69, 0.12) 100%)',
                                    color: 'primary.main', 
                                    fontWeight: 600, 
                                    fontSize: '0.8125rem',
                                    border: '1px solid',
                                    borderColor: 'rgba(26, 173, 25, 0.25)',
                                    boxShadow: '0 2px 4px rgba(26, 173, 25, 0.1)',
                                }}>
                                    <LocationOnIcon sx={{ fontSize: 16 }} />
                                    {t('participantForm.currentTimezone')}: {getTimezoneLabel(viewTimezone)}
                                </Box>
                            )}
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <TimeGrid
                                event={event}
                                selectedSlots={selectedSlots}
                                onSlotsChange={setSelectedSlots}
                                viewTimezone={viewTimezone}
                            />
                        </Box>
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
                                            {t('participantForm.selectedSlots', { count: selectedSlots.length })}
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
                                <Typography variant="body1" sx={{ fontWeight: 600, mb: 1.5, fontSize: { xs: '0.9375rem', sm: '1rem' } }}>
                                    {isUpdate ? t('participantForm.updated', { name }) : t('participantForm.saved', { name })}
                                </Typography>
                                <Link href={`/e/${event.id}/results`} style={{ textDecoration: 'none' }}>
                                    <Box sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        px: 2,
                                        py: 1,
                                        backgroundColor: 'rgba(46, 125, 50, 0.12)',
                                        borderRadius: 1,
                                        color: 'success.dark',
                                        fontWeight: 500,
                                        fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            backgroundColor: 'rgba(46, 125, 50, 0.2)',
                                            transform: 'translateX(2px)',
                                        }
                                    }}>
                                        <span>{t('participantForm.viewAllResults').replace('→ ', '')}</span>
                                        <span style={{ fontSize: '1.1em' }}>→</span>
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
                            {loading ? t('participantForm.submitting') : isUpdate ? t('participantForm.updateTime') : t('participantForm.submitTime')}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}

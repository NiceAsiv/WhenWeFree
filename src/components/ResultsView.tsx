'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    Chip,
    CircularProgress,
    Alert,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
} from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import { addDays } from 'date-fns';
import TimeGrid from './TimeGrid';
import { useTranslation } from "@/hooks/useTranslation";
import { Event, Response } from '@/types';
import { TIMEZONES, getTimezoneLabel } from '@/lib/timezones';

interface ResultsViewProps {
    event: Event;
    responses: Response[];
}

export default function ResultsView({ event, responses }: ResultsViewProps) {
    const { t } = useTranslation();
    const [tabValue, setTabValue] = useState(0);
    const [resultsData, setResultsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [viewTimezone, setViewTimezone] = useState<string>(event.timezone);

    useEffect(() => {
        fetchResults();
    }, [event.id]);

    const fetchResults = async () => {
        try {
            const response = await fetch(`/api/events/${event.id}/results`);
            const data = await response.json();
            setResultsData(data);
        } catch (error) {
            console.error('Failed to fetch results:', error);
        } finally {
            setLoading(false);
        }
    };

    // Convert slot index to readable time range
    const getSlotTimeRange = (slotIndex: number): string => {
        try {
            // Helper function to parse time string (HH:mm) to minutes
            const parseTimeToMinutes = (timeStr: string | null): number => {
                if (!timeStr) return 540; // Default 9:00 AM
                const [hours, minutes] = timeStr.split(':').map(Number);
                return hours * 60 + minutes;
            };

            // Parse dates - handle both string and Date objects
            const startDate = typeof event.startDate === 'string'
                ? new Date(event.startDate)
                : event.startDate;
            const endDate = typeof event.endDate === 'string'
                ? new Date(event.endDate)
                : event.endDate;

            // Validate dates
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                console.error('Invalid date:', { startDate: event.startDate, endDate: event.endDate });
                return `时间段 ${slotIndex + 1}`;
            }

            const slotMinutes = event.slotMinutes || 30;
            // Parse time strings to minutes
            const dayStartTime = parseTimeToMinutes(event.dayStartTime);
            const dayEndTime = parseTimeToMinutes(event.dayEndTime);

            // Calculate slots per day
            const startHour = Math.floor(dayStartTime / 60);
            const startMinute = dayStartTime % 60;
            const endHour = Math.floor(dayEndTime / 60);
            const endMinute = dayEndTime % 60;
            const totalMinutesPerDay = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
            const slotsPerDay = Math.ceil(totalMinutesPerDay / slotMinutes);

            // Calculate which day and which slot within that day
            const dayIndex = Math.floor(slotIndex / slotsPerDay);
            const slotInDay = slotIndex % slotsPerDay;

            // Calculate the actual date
            const slotDate = addDays(startDate, dayIndex);

            // Validate the calculated date
            if (isNaN(slotDate.getTime())) {
                console.error('Invalid slot date:', { slotIndex, dayIndex, startDate });
                return `时间段 ${slotIndex + 1}`;
            }

            // Calculate the start time of this slot
            const slotStartMinutes = dayStartTime + (slotInDay * slotMinutes);
            const slotStartHour = Math.floor(slotStartMinutes / 60);
            const slotStartMin = slotStartMinutes % 60;

            // Calculate the end time of this slot
            const slotEndMinutes = slotStartMinutes + slotMinutes;
            const slotEndHour = Math.floor(slotEndMinutes / 60);
            const slotEndMin = slotEndMinutes % 60;

            // Format the date and time manually to avoid locale issues
            const month = slotDate.getMonth() + 1;
            const day = slotDate.getDate();
            const dateStr = `${month}月${day}日`;
            const timeStr = `${String(slotStartHour).padStart(2, '0')}:${String(slotStartMin).padStart(2, '0')}-${String(slotEndHour).padStart(2, '0')}:${String(slotEndMin).padStart(2, '0')}`;

            return `${dateStr} ${timeStr}`;
        } catch (error) {
            console.error('Error formatting slot time:', error, { slotIndex, event });
            return `时间段 ${slotIndex + 1}`;
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!resultsData) {
        return (
            <Alert severity="error">无法加载结果数据</Alert>
        );
    }

    const { slotCounts, commonSlots, recommendedSlots, totalParticipants } = resultsData;
    const maxCount = Math.max(...slotCounts, 1);

    return (
        <Box>
            {/* Timezone Selector */}
            <Paper elevation={1} sx={{ p: 2.5, mb: 3, border: '1px solid', borderColor: 'divider' }}>
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
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        查看时区
                    </Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        活动时区：<Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>{getTimezoneLabel(event.timezone)}</Box>
                    </Typography>
                    <FormControl fullWidth size="small">
                        <InputLabel>选择查看时间的时区</InputLabel>
                        <Select
                            value={viewTimezone}
                            label="选择查看时间的时区"
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
                    <Alert severity="info" sx={{ mt: 1.5, fontSize: '0.875rem' }}>
                        你正在以 <strong>{getTimezoneLabel(viewTimezone)}</strong> 查看结果。所有时间已从活动时区转换。
                    </Alert>
                )}
            </Paper>

            <Paper sx={{ mb: 3 }}>
                <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
                    <Tab label={t('resultsPage.heatmap')} />
                    <Tab label={t('resultsPage.allAvailable')} />
                    <Tab label={t('resultsPage.recommended')} />
                </Tabs>
            </Paper>

            {tabValue === 0 && (
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        {t('resultsPage.heatmapTitle')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {t('resultsPage.heatmapDescription')}
                    </Typography>
                    <TimeGrid
                        event={event}
                        selectedSlots={[]}
                        onSlotsChange={() => { }}
                        heatmapData={slotCounts}
                        maxCount={maxCount}
                        viewTimezone={viewTimezone}
                    />
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" color="text.secondary">0 {t('resultsPage.people')}</Typography>
                        <Box
                            sx={{
                                flex: 1,
                                height: 20,
                                background: 'linear-gradient(to right, rgba(26, 173, 25, 0.15), rgba(26, 173, 25, 0.85))',
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                            }}
                        />
                        <Typography variant="body2" color="text.secondary">{totalParticipants} {t('resultsPage.people')}</Typography>
                    </Box>
                </Paper>
            )}

            {tabValue === 1 && (
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        {t('resultsPage.allAvailableTitle')}
                    </Typography>
                    {commonSlots.length === 0 ? (
                        <Typography color="text.secondary">
                            {t('resultsPage.noCommonSlots')}
                        </Typography>
                    ) : (
                        <List>
                            {commonSlots.map((slotIndex: number, idx: number) => (
                                <ListItem
                                    key={idx}
                                    sx={{
                                        borderRadius: 2,
                                        mb: 1,
                                        backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(26, 173, 25, 0.1)' : 'rgba(26, 173, 25, 0.08)',
                                        '&:hover': {
                                            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(26, 173, 25, 0.2)' : 'rgba(26, 173, 25, 0.16)',
                                        },
                                    }}
                                >
                                    <ListItemText
                                        primary={getSlotTimeRange(slotIndex)}
                                        secondary={t('resultsPage.allParticipantsAvailable')}
                                        primaryTypographyProps={{
                                            fontWeight: 600,
                                            fontSize: '1.1rem',
                                        }}
                                    />
                                    <Chip
                                        label={`${totalParticipants}/${totalParticipants} ${t('resultsPage.people')}`}
                                        color="success"
                                        sx={{ fontWeight: 600 }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Paper>
            )}

            {tabValue === 2 && (
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        {t('resultsPage.recommendedTitle')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {t('resultsPage.recommendedDescription')}
                    </Typography>
                    {recommendedSlots.length === 0 ? (
                        <Typography color="text.secondary">
                            {t('resultsPage.noRecommendedSlots')}
                        </Typography>
                    ) : (
                        <List>
                            {recommendedSlots.map((slot: any, idx: number) => {
                                // Get the slot index with minimum count
                                const slotIndex = slot.slots[0];
                                return (
                                    <ListItem
                                        key={idx}
                                        sx={{
                                            borderRadius: 2,
                                            mb: 1,
                                            backgroundColor: idx === 0 ? 'primary.lighter' : 'background.paper',
                                            border: '1px solid',
                                            borderColor: idx === 0 ? 'primary.main' : 'divider',
                                            '&:hover': {
                                                backgroundColor: idx === 0 ? 'primary.light' : 'action.hover',
                                            },
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Box>
                                                    <Typography variant="body1" fontWeight={600}>
                                                        {idx === 0 && '🏆 '}{t('resultsPage.recommended')} {idx + 1}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                        {slot.slots.map((si: number) => getSlotTimeRange(si)).join(', ')}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={`${t('resultsPage.minCount', { count: slot.minCount })}，${t('resultsPage.avgCount', { count: slot.averageCount.toFixed(1) })}`}
                                        />
                                        <Chip
                                            label={`${slot.minCount}/${totalParticipants} ${t('resultsPage.people')}`}
                                            color={idx === 0 ? "primary" : "default"}
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                    )}
                </Paper>
            )}

            <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                    {t('resultsPage.participantsList')}
                </Typography>
                <List>
                    {responses.map((response) => (
                        <ListItem key={response.id}>
                            <ListItemText
                                primary={response.name || t('resultsPage.anonymousParticipant')}
                                secondary={t('resultsPage.slotsSelected', { count: response.availabilitySlots.length })}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
}

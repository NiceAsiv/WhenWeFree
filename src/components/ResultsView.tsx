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
} from '@mui/material';
import { addDays } from 'date-fns';
import TimeGrid from './TimeGrid';
import { Event, Response } from '@/types';

interface ResultsViewProps {
    event: Event;
    responses: Response[];
}

export default function ResultsView({ event, responses }: ResultsViewProps) {
    const [tabValue, setTabValue] = useState(0);
    const [resultsData, setResultsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
            <Paper sx={{ mb: 3 }}>
                <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
                    <Tab label="热力图" />
                    <Tab label="全员可用" />
                    <Tab label="推荐时间" />
                </Tabs>
            </Paper>

            {tabValue === 0 && (
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        可用人数热力图
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        颜色越深表示可用人数越多
                    </Typography>
                    <TimeGrid
                        event={event}
                        selectedSlots={[]}
                        onSlotsChange={() => { }}
                        heatmapData={slotCounts}
                        maxCount={maxCount}
                    />
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" color="text.secondary">0 人</Typography>
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
                        <Typography variant="body2" color="text.secondary">{totalParticipants} 人</Typography>
                    </Box>
                </Paper>
            )}

            {tabValue === 1 && (
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        全员共同可用时间段
                    </Typography>
                    {commonSlots.length === 0 ? (
                        <Typography color="text.secondary">
                            暂无全员共同可用的时间段
                        </Typography>
                    ) : (
                        <List>
                            {commonSlots.map((slotIndex: number, idx: number) => (
                                <ListItem
                                    key={idx}
                                    sx={{
                                        borderRadius: 2,
                                        mb: 1,
                                        backgroundColor: 'success.lighter',
                                        '&:hover': {
                                            backgroundColor: 'success.light',
                                        },
                                    }}
                                >
                                    <ListItemText
                                        primary={getSlotTimeRange(slotIndex)}
                                        secondary="所有参与者都有空"
                                        primaryTypographyProps={{
                                            fontWeight: 600,
                                            fontSize: '1.1rem',
                                        }}
                                    />
                                    <Chip
                                        label={`${totalParticipants}/${totalParticipants} 人`}
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
                        推荐时间段（按人数排序）
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        显示参与人数最多的时间段
                    </Typography>
                    {recommendedSlots.length === 0 ? (
                        <Typography color="text.secondary">
                            暂无推荐时间段
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
                                                        {idx === 0 && '🏆 '}推荐 {idx + 1}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                        {slot.slots.map((si: number) => getSlotTimeRange(si)).join(', ')}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={`最少 ${slot.minCount} 人，平均 ${slot.averageCount.toFixed(1)} 人可用`}
                                        />
                                        <Chip
                                            label={`${slot.minCount}/${totalParticipants} 人`}
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
                    参与者列表
                </Typography>
                <List>
                    {responses.map((response) => (
                        <ListItem key={response.id}>
                            <ListItemText
                                primary={response.name || '匿名参与者'}
                                secondary={`已选择 ${response.availabilitySlots.length} 个时间段`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
}

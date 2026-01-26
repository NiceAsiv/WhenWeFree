'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Event } from '@/types';
import { format, addDays } from 'date-fns';

interface TimeGridProps {
    event: Event;
    selectedSlots: number[];
    onSlotsChange: (slots: number[]) => void;
    heatmapData?: number[];
    maxCount?: number;
}

export default function TimeGrid({
    event,
    selectedSlots,
    onSlotsChange,
    heatmapData,
    maxCount,
}: TimeGridProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragMode, setDragMode] = useState<'select' | 'deselect'>('select');

    // Calculate grid dimensions
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Calculate slots per day based on mode
    const { slotsPerDay, slotLabels } = useMemo(() => {
        if (event.mode === 'fullDay') {
            return { slotsPerDay: 1, slotLabels: ['全天'] };
        }

        if (event.timeMode === 'period') {
            return {
                slotsPerDay: 3,
                slotLabels: ['上午\n9-12', '下午\n12-18', '晚上\n18-22']
            };
        }

        if (event.timeMode === 'custom' && event.customTimeSlots) {
            return {
                slotsPerDay: event.customTimeSlots.length,
                slotLabels: event.customTimeSlots.map(slot => `${slot.label}\n${slot.startTime}-${slot.endTime}`)
            };
        }

        // Standard mode
        if (event.dayStartTime && event.dayEndTime && event.slotMinutes) {
            const [startHour, startMin] = event.dayStartTime.split(':').map(Number);
            const [endHour, endMin] = event.dayEndTime.split(':').map(Number);
            const totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
            const count = Math.floor(totalMinutes / event.slotMinutes);
            const labels = Array.from({ length: count }).map((_, i) => {
                const minutes = startHour * 60 + startMin + i * event.slotMinutes;
                const hour = Math.floor(minutes / 60);
                const min = minutes % 60;
                return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
            });
            return { slotsPerDay: count, slotLabels: labels };
        }

        return { slotsPerDay: 0, slotLabels: [] };
    }, [event]);

    const toggleSlot = useCallback((slotIndex: number) => {
        const isSelected = selectedSlots.includes(slotIndex);
        if (isSelected) {
            onSlotsChange(selectedSlots.filter(s => s !== slotIndex));
        } else {
            onSlotsChange([...selectedSlots, slotIndex].sort((a, b) => a - b));
        }
    }, [selectedSlots, onSlotsChange]);

    const handleMouseDown = (slotIndex: number) => {
        setIsDragging(true);
        const isSelected = selectedSlots.includes(slotIndex);
        setDragMode(isSelected ? 'deselect' : 'select');
        toggleSlot(slotIndex);
    };

    const handleMouseEnter = (slotIndex: number) => {
        if (!isDragging) return;

        const isSelected = selectedSlots.includes(slotIndex);
        if (dragMode === 'select' && !isSelected) {
            onSlotsChange([...selectedSlots, slotIndex].sort((a, b) => a - b));
        } else if (dragMode === 'deselect' && isSelected) {
            onSlotsChange(selectedSlots.filter(s => s !== slotIndex));
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const getSlotColor = (slotIndex: number) => {
        if (heatmapData && maxCount) {
            const count = heatmapData[slotIndex] || 0;
            if (count === 0) return '#f0f0f0';
            const intensity = count / maxCount;
            return `rgba(14, 165, 233, ${0.2 + intensity * 0.8})`;
        }
        return selectedSlots.includes(slotIndex) ? '#0ea5e9' : '#f0f0f0';
    };

    const getSlotLabel = (slotIndex: number) => {
        if (heatmapData) {
            return heatmapData[slotIndex] || 0;
        }
        return '';
    };

    // Determine if we should show abbreviated view (more than 3 slots per day)
    const isAbbreviated = slotsPerDay > 3;

    return (
        <Box onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    overflowX: 'auto',
                    backgroundColor: '#fafafa',
                }}
            >
                <Box sx={{ display: 'flex', minWidth: 'max-content' }}>
                    {/* Time labels column */}
                    {!isAbbreviated && (
                        <Box sx={{ pr: 2, minWidth: event.mode === 'fullDay' ? 40 : 80 }}>
                            <Box sx={{ height: 40 }} /> {/* Header spacer */}
                            {slotLabels.map((label, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        height: isAbbreviated ? 24 : 40,
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '0.75rem',
                                        color: 'text.secondary',
                                        whiteSpace: 'pre-line',
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {label}
                                </Box>
                            ))}
                        </Box>
                    )}

                    {/* Grid columns for each day */}
                    {Array.from({ length: daysDiff }).map((_, dayIndex) => {
                        const currentDay = addDays(startDate, dayIndex);
                        return (
                            <Box key={dayIndex} sx={{ minWidth: isAbbreviated ? 50 : 70 }}>
                                {/* Day header */}
                                <Box
                                    sx={{
                                        height: 40,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        borderBottom: '2px solid #ddd',
                                        mb: 0.5,
                                    }}
                                >
                                    <div>
                                        <div>{format(currentDay, 'EEE')}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#666' }}>
                                            {format(currentDay, 'M/d')}
                                        </div>
                                    </div>
                                </Box>

                                {/* Time slots for this day */}
                                {Array.from({ length: slotsPerDay }).map((_, slotInDay) => {
                                    const slotIndex = dayIndex * slotsPerDay + slotInDay;
                                    return (
                                        <Box
                                            key={slotIndex}
                                            className="time-grid-cell"
                                            onMouseDown={() => handleMouseDown(slotIndex)}
                                            onMouseEnter={() => handleMouseEnter(slotIndex)}
                                            sx={{
                                                height: isAbbreviated ? 22 : 38,
                                                m: 0.25,
                                                backgroundColor: getSlotColor(slotIndex),
                                                border: '1px solid #ddd',
                                                borderRadius: 1,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: isAbbreviated ? '0.65rem' : '0.75rem',
                                                fontWeight: 600,
                                                userSelect: 'none',
                                                transition: 'all 0.15s ease',
                                                '&:hover': {
                                                    opacity: 0.8,
                                                    transform: 'scale(1.05)',
                                                },
                                            }}
                                        >
                                            {getSlotLabel(slotIndex)}
                                        </Box>
                                    );
                                })}
                            </Box>
                        );
                    })}
                </Box>
            </Paper>
        </Box>
    );
}

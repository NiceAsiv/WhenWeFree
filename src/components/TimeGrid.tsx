'use client';

import { useState, useRef, useCallback } from 'react';
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

    const [startHour, startMin] = event.dayStartTime.split(':').map(Number);
    const [endHour, endMin] = event.dayEndTime.split(':').map(Number);
    const totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    const slotsPerDay = Math.floor(totalMinutes / event.slotMinutes);

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
                    <Box sx={{ pr: 2, minWidth: 60 }}>
                        <Box sx={{ height: 40 }} /> {/* Header spacer */}
                        {Array.from({ length: slotsPerDay }).map((_, slotInDay) => {
                            const minutes = startHour * 60 + startMin + slotInDay * event.slotMinutes;
                            const hour = Math.floor(minutes / 60);
                            const min = minutes % 60;
                            return (
                                <Box
                                    key={slotInDay}
                                    sx={{
                                        height: 32,
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '0.75rem',
                                        color: 'text.secondary',
                                    }}
                                >
                                    {`${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`}
                                </Box>
                            );
                        })}
                    </Box>

                    {/* Grid columns for each day */}
                    {Array.from({ length: daysDiff }).map((_, dayIndex) => {
                        const currentDay = addDays(startDate, dayIndex);
                        return (
                            <Box key={dayIndex} sx={{ minWidth: 60 }}>
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
                                                height: 30,
                                                m: 0.25,
                                                backgroundColor: getSlotColor(slotIndex),
                                                border: '1px solid #ddd',
                                                borderRadius: 1,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.75rem',
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

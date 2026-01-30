'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Event } from '@/types';
import { format, addDays } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

interface TimeGridProps {
    event: Event;
    selectedSlots: number[];
    onSlotsChange: (slots: number[]) => void;
    heatmapData?: number[];
    maxCount?: number;
    viewTimezone?: string; // 用户选择的查看时区
}

export default function TimeGrid({
    event,
    selectedSlots,
    onSlotsChange,
    heatmapData,
    maxCount,
    viewTimezone,
}: TimeGridProps) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const [isDragging, setIsDragging] = useState(false);
    const [dragMode, setDragMode] = useState<'select' | 'deselect'>('select');

    // 使用的时区，默认为活动时区
    const displayTimezone = viewTimezone || event.timezone;
    const isTimezoneConverted = displayTimezone !== event.timezone;

    // Calculate grid dimensions
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // 计算日期标签，考虑时区转换
    const dayLabels = useMemo(() => {
        return Array.from({ length: daysDiff }).map((_, i) => {
            const currentDay = addDays(startDate, i);
            // 如果需要时区转换，将日期转换到显示时区
            if (isTimezoneConverted) {
                const zonedDate = toZonedTime(currentDay, displayTimezone);
                return format(zonedDate, 'M/d\nEEE');
            }
            return format(currentDay, 'M/d\nEEE');
        });
    }, [startDate, daysDiff, displayTimezone, isTimezoneConverted]);

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
                const minutes = startHour * 60 + startMin + i * event.slotMinutes!;
                let hour = Math.floor(minutes / 60);
                let min = minutes % 60;
                
                // 如果需要时区转换，转换时间
                if (isTimezoneConverted) {
                    // 创建活动时区的时间
                    const eventDate = new Date();
                    eventDate.setHours(hour, min, 0, 0);
                    // 转换到显示时区
                    const zonedDate = toZonedTime(eventDate, displayTimezone);
                    hour = zonedDate.getHours();
                    min = zonedDate.getMinutes();
                }
                
                return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
            });
            return { slotsPerDay: count, slotLabels: labels };
        }

        return { slotsPerDay: 0, slotLabels: [] };
    }, [event, displayTimezone, isTimezoneConverted]);

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

    const handleTouchStart = (slotIndex: number) => {
        // For touch devices, just toggle the slot without dragging
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
            if (count === 0) return isDark ? 'rgba(255, 255, 255, 0.05)' : '#f5f5f5';
            const intensity = count / maxCount;
            // Use WeChat green gradient for heatmap
            return `rgba(26, 173, 25, ${0.15 + intensity * 0.7})`;
        }
        return selectedSlots.includes(slotIndex) ? '#1AAD19' : (isDark ? 'rgba(255, 255, 255, 0.05)' : '#f5f5f5');
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
        <Box 
            onMouseUp={handleMouseUp} 
            onMouseLeave={handleMouseUp}
        >
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 1.5, sm: 2.5 },
                    overflowX: 'auto',
                    backgroundColor: 'background.paper',
                    borderRadius: 2.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    // Improve mobile scrolling
                    WebkitOverflowScrolling: 'touch',
                    '&::-webkit-scrollbar': {
                        height: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: isDark ? '#333' : '#f5f5f5',
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: isDark ? '#555' : '#d0d0d0',
                        borderRadius: '4px',
                        '&:hover': {
                            background: isDark ? '#777' : '#b0b0b0',
                        },
                    },
                }}
            >
                <Box sx={{
                    display: 'flex',
                    minWidth: 'max-content',
                }}>
                    {/* Time labels column - Always show */}
                    <Box sx={{
                        pr: { xs: 1.5, sm: 2.5 },
                        minWidth: { xs: 70, sm: event.mode === 'fullDay' ? 60 : 100 },
                        flexShrink: 0,
                    }}>
                        <Box sx={{ height: { xs: 44, sm: 48 }, mb: 0.5 }} /> {/* Header spacer */}
                        {slotLabels.map((label, i) => (
                            <Box
                                key={i}
                                sx={{
                                    // Match the exact height of time slots including margin
                                    height: isAbbreviated ? 26 : 42,
                                    my: 0.5, // Same margin as time slots
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    fontSize: {
                                        xs: isAbbreviated ? '0.6875rem' : '0.75rem',
                                        sm: isAbbreviated ? '0.75rem' : '0.8125rem'
                                    },
                                    color: 'text.secondary',
                                    whiteSpace: 'pre-line',
                                    lineHeight: 1.3,
                                    fontWeight: 500,
                                    textAlign: 'right',
                                    pr: 0.5,
                                }}
                            >
                                {label}
                            </Box>
                        ))}
                    </Box>

                    {/* Grid columns for each day */}
                    {Array.from({ length: daysDiff }).map((_, dayIndex) => {
                        const currentDay = addDays(startDate, dayIndex);
                        return (
                            <Box key={dayIndex} sx={{ minWidth: { xs: 52, sm: isAbbreviated ? 56 : 76 } }}>
                                {/* Day header */}
                                <Box
                                    sx={{
                                        height: { xs: 44, sm: 48 },
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 600,
                                        fontSize: { xs: '0.8125rem', sm: '0.9375rem' },
                                        borderBottom: '2px solid',
                                        borderColor: 'divider',
                                        mb: 0.5,
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 600 }}>
                                            {dayLabels[dayIndex].split('\n')[1]}
                                        </div>
                                        <div style={{
                                            fontSize: window.innerWidth < 600 ? '0.75rem' : '0.8125rem',
                                            color: isDark ? '#aaa' : '#888',
                                            fontWeight: 500
                                        }}>
                                            {dayLabels[dayIndex].split('\n')[0]}
                                        </div>
                                    </div>
                                </Box>

                                {/* Time slots for this day */}
                                {Array.from({ length: slotsPerDay }).map((_, slotInDay) => {
                                    const slotIndex = dayIndex * slotsPerDay + slotInDay;
                                    const isSelected = selectedSlots.includes(slotIndex);
                                    return (
                                        <Box
                                            key={slotIndex}
                                            className="time-grid-cell"
                                            onMouseDown={(e) => {
                                                // Only handle mouse events on non-touch devices
                                                if (e.type === 'mousedown' && 'ontouchstart' in window) {
                                                    console.log('[TimeGrid] Ignoring mousedown on touch device');
                                                    return;
                                                }
                                                handleMouseDown(slotIndex);
                                            }}
                                            onMouseEnter={() => handleMouseEnter(slotIndex)}
                                            onTouchStart={(e) => {
                                                e.stopPropagation();
                                                handleTouchStart(slotIndex);
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                            sx={{
                                                height: isAbbreviated ? 26 : 42,
                                                m: 0.5,
                                                backgroundColor: getSlotColor(slotIndex),
                                                border: '1.5px solid',
                                                borderColor: isSelected ? '#1AAD19' : 'divider',
                                                borderRadius: 1.5,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: {
                                                    xs: isAbbreviated ? '0.625rem' : '0.75rem',
                                                    sm: isAbbreviated ? '0.6875rem' : '0.8125rem'
                                                },
                                                fontWeight: isSelected ? 700 : 600,
                                                color: isSelected ? '#fff' : 'text.secondary',
                                                userSelect: 'none',
                                                WebkitTapHighlightColor: 'transparent',
                                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                '&::before': isSelected ? {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%)',
                                                    pointerEvents: 'none',
                                                } : {},
                                                '&:hover': {
                                                    transform: 'scale(1.08)',
                                                    boxShadow: isSelected
                                                        ? '0 4px 12px rgba(26, 173, 25, 0.35)'
                                                        : '0 2px 8px rgba(0, 0, 0, 0.12)',
                                                    borderColor: isSelected ? '#2BA245' : '#1AAD19',
                                                    zIndex: 10,
                                                },
                                                '&:active': {
                                                    transform: 'scale(0.98)',
                                                },
                                                // Mobile touch optimization
                                                '@media (hover: none)': {
                                                    '&:hover': {
                                                        transform: 'none',
                                                        boxShadow: 'none',
                                                    },
                                                    '&:active': {
                                                        transform: 'scale(0.95)',
                                                        opacity: 0.9,
                                                    },
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

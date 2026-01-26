import { format, addMinutes, differenceInMinutes } from "date-fns";

interface Event {
    startDate: Date;
    endDate: Date;
    dayStartTime: string;
    dayEndTime: string;
    slotMinutes: number;
    timezone: string;
}

interface TimeSlot {
    slotIndex: number;
    startTime: Date;
    endTime: Date;
    count: number;
}

interface RecommendedSlot {
    slots: number[];
    startTime: Date;
    endTime: Date;
    averageCount: number;
    minCount: number;
}

/**
 * Calculate total number of time slots for an event
 */
export function calculateSlotCounts(event: Event): number {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    const days = Math.ceil(differenceInMinutes(end, start) / (60 * 24)) + 1;

    const [startHour, startMin] = event.dayStartTime.split(":").map(Number);
    const [endHour, endMin] = event.dayEndTime.split(":").map(Number);
    const dailyMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    const slotsPerDay = Math.floor(dailyMinutes / event.slotMinutes);

    return days * slotsPerDay;
}

/**
 * Convert slot index to datetime
 */
export function slotIndexToDateTime(
    slotIndex: number,
    event: Event
): Date {
    const start = new Date(event.startDate);
    const [startHour, startMin] = event.dayStartTime.split(":").map(Number);
    const dailyMinutes = getDailyMinutes(event);
    const slotsPerDay = Math.floor(dailyMinutes / event.slotMinutes);

    const dayOffset = Math.floor(slotIndex / slotsPerDay);
    const slotInDay = slotIndex % slotsPerDay;

    const dayStart = new Date(start);
    dayStart.setDate(dayStart.getDate() + dayOffset);
    dayStart.setHours(startHour, startMin, 0, 0);

    return addMinutes(dayStart, slotInDay * event.slotMinutes);
}

/**
 * Get daily minutes
 */
function getDailyMinutes(event: Event): number {
    const [startHour, startMin] = event.dayStartTime.split(":").map(Number);
    const [endHour, endMin] = event.dayEndTime.split(":").map(Number);
    return (endHour * 60 + endMin) - (startHour * 60 + startMin);
}

/**
 * Find slots where all participants are available
 */
export function findCommonSlots(
    slotCounts: number[],
    totalParticipants: number
): number[] {
    const commonSlots: number[] = [];

    for (let i = 0; i < slotCounts.length; i++) {
        if (slotCounts[i] === totalParticipants && totalParticipants > 0) {
            commonSlots.push(i);
        }
    }

    return commonSlots;
}

/**
 * Merge continuous slot indices into ranges
 */
export function mergeContinuousSlots(slotIndices: number[]): number[][] {
    if (slotIndices.length === 0) return [];

    const ranges: number[][] = [];
    let currentRange = [slotIndices[0]];

    for (let i = 1; i < slotIndices.length; i++) {
        if (slotIndices[i] === slotIndices[i - 1] + 1) {
            currentRange.push(slotIndices[i]);
        } else {
            ranges.push(currentRange);
            currentRange = [slotIndices[i]];
        }
    }
    ranges.push(currentRange);

    return ranges;
}

/**
 * Find recommended time slots
 */
export function findRecommendedSlots(
    slotCounts: number[],
    slotMinutes: number,
    minDurationMinutes: number,
    topN: number = 5
): RecommendedSlot[] {
    const minSlots = Math.ceil(minDurationMinutes / slotMinutes);
    const recommendations: RecommendedSlot[] = [];

    // Sliding window to find continuous slots
    for (let i = 0; i <= slotCounts.length - minSlots; i++) {
        const window = slotCounts.slice(i, i + minSlots);
        const minCount = Math.min(...window);
        const averageCount = window.reduce((a, b) => a + b, 0) / window.length;

        if (minCount > 0) {
            recommendations.push({
                slots: Array.from({ length: minSlots }, (_, idx) => i + idx),
                startTime: new Date(), // Will be set by caller
                endTime: new Date(), // Will be set by caller
                averageCount,
                minCount,
            });
        }
    }

    // Sort by minCount (descending), then averageCount (descending)
    recommendations.sort((a, b) => {
        if (b.minCount !== a.minCount) {
            return b.minCount - a.minCount;
        }
        return b.averageCount - a.averageCount;
    });

    return recommendations.slice(0, topN);
}

/**
 * Format time range for display
 */
export function formatTimeRange(start: Date, end: Date, timezone: string): string {
    // For now, use simple formatting without timezone conversion
    // In production, you'd want proper timezone handling
    return `${format(start, "MM-dd HH:mm")} - ${format(end, "HH:mm")}`;
}

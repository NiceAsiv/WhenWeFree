export interface CustomTimeSlot {
    label: string;        // 如 "下午 4-5"
    startTime: string;    // HH:mm format, 如 "16:00"
    endTime: string;      // HH:mm format, 如 "17:00"
}

export interface Event {
    id: string;
    title: string;
    description: string | null;
    timezone: string;
    startDate: Date;
    endDate: Date;
    mode: 'timeRange' | 'fullDay';
    timeMode: 'standard' | 'period' | 'custom';
    dayStartTime: string | null;
    dayEndTime: string | null;
    slotMinutes: number | null;
    minDurationMinutes: number | null;
    customTimeSlots: CustomTimeSlot[] | null;
    adminToken: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Response {
    id: string;
    eventId: string;
    name: string | null;
    availabilitySlots: number[];
    sessionToken: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface TimeSlot {
    slotIndex: number;
    startTime: Date;
    endTime: Date;
    dayOfWeek: string;
    timeLabel: string;
}

export interface EventFormData {
    title: string;
    description?: string;
    timezone: string;
    startDate: string;
    endDate: string;
    mode: 'timeRange' | 'fullDay';
    timeMode?: 'standard' | 'period' | 'custom';
    dayStartTime?: string;
    dayEndTime?: string;
    slotMinutes?: number;
    minDurationMinutes?: number;
    customTimeSlots?: CustomTimeSlot[];
}

export interface RecommendedSlot {
    slots: number[];
    startTime: Date;
    endTime: Date;
    averageCount: number;
    minCount: number;
}

export interface SlotAvailability {
    available: string[];
    unavailable: string[];
}

export interface ResultsData {
    event: Event;
    slotCounts: number[];
    commonSlots: number[];
    recommendedSlots: RecommendedSlot[];
    totalParticipants: number;
    slotAvailability: Record<number, SlotAvailability>;
}

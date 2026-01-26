export interface Event {
    id: string;
    title: string;
    description: string | null;
    timezone: string;
    startDate: Date;
    endDate: Date;
    dayStartTime: string;
    dayEndTime: string;
    slotMinutes: number;
    minDurationMinutes: number;
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
    dayStartTime: string;
    dayEndTime: string;
    slotMinutes: number;
    minDurationMinutes: number;
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Event as AppEvent } from "@/types"; // Import AppEvent for type casting
import { calculateSlotCounts, findCommonSlots, findRecommendedSlots } from "@/lib/timeUtils";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const { eventId } = await params;
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                responses: true,
            },
        });

        if (!event) {
            return NextResponse.json(
                { error: "活动不存在" },
                { status: 404 }
            );
        }

        // Calculate total number of slots
        // Cast event to AppEvent to match the interface expected by calculateSlotCounts
        // (Prisma types for enums/JSON are looser than our strict AppEvent type)
        const totalSlots = calculateSlotCounts(event as unknown as AppEvent);

        // Aggregate availability data
        const slotCounts = new Array(totalSlots).fill(0);
        // Track which users are available for each slot
        const slotAvailability: Map<number, { available: string[], unavailable: string[] }> = new Map();
        
        // Initialize slot availability
        for (let i = 0; i < totalSlots; i++) {
            slotAvailability.set(i, { available: [], unavailable: [] });
        }
        
        event.responses.forEach((response) => {
            const userName = response.name || response.email;
            const availableSlots = new Set(response.availabilitySlots as number[]);
            
            for (let slotIndex = 0; slotIndex < totalSlots; slotIndex++) {
                const slotInfo = slotAvailability.get(slotIndex)!;
                if (availableSlots.has(slotIndex)) {
                    slotInfo.available.push(userName);
                    slotCounts[slotIndex]++;
                } else {
                    slotInfo.unavailable.push(userName);
                }
            }
        });

        // Find common slots (all participants available)
        const totalParticipants = event.responses.length;
        const commonSlots = findCommonSlots(slotCounts, totalParticipants);

        // Find recommended slots
        const recommendedSlots = findRecommendedSlots(
            slotCounts,
            event.slotMinutes || 30, // Provide default if null
            event.minDurationMinutes || 30 // Provide default if null
        );

        // Convert slotAvailability Map to object for JSON serialization
        const slotAvailabilityObj: Record<number, { available: string[], unavailable: string[] }> = {};
        slotAvailability.forEach((value, key) => {
            slotAvailabilityObj[key] = value;
        });

        return NextResponse.json({
            event,
            slotCounts,
            commonSlots,
            recommendedSlots,
            totalParticipants,
            slotAvailability: slotAvailabilityObj,
        });
    } catch (error) {
        console.error("Error fetching results:", error);
        return NextResponse.json(
            { error: "获取结果失败" },
            { status: 500 }
        );
    }
}

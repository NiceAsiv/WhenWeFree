import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Response as EventResponse } from "@prisma/client"; // Keep this for Prisma Response type
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
        event.responses.forEach((response: EventResponse) => {
            response.availabilitySlots.forEach((slotIndex: number) => {
                if (slotIndex >= 0 && slotIndex < totalSlots) {
                    slotCounts[slotIndex]++;
                }
            });
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

        return NextResponse.json({
            event,
            slotCounts,
            commonSlots,
            recommendedSlots,
            totalParticipants,
        });
    } catch (error) {
        console.error("Error fetching results:", error);
        return NextResponse.json(
            { error: "获取结果失败" },
            { status: 500 }
        );
    }
}

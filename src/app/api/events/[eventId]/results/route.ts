import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Response as EventResponse } from "@prisma/client";
import { calculateSlotCounts, findCommonSlots, findRecommendedSlots } from "@/lib/timeUtils";

export async function GET(
    request: Request,
    { params }: { params: { eventId: string } }
) {
    try {
        const event = await prisma.event.findUnique({
            where: { id: params.eventId },
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
        const totalSlots = calculateSlotCounts(event);

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
            event.slotMinutes,
            event.minDurationMinutes
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

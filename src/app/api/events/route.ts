import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateAdminToken } from "@/lib/tokenUtils";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            title,
            description,
            timezone,
            startDate,
            endDate,
            dayStartTime,
            dayEndTime,
            slotMinutes,
            minDurationMinutes,
        } = body;

        // Validate required fields
        if (!title || !timezone || !startDate || !endDate || !dayStartTime || !dayEndTime || !slotMinutes || !minDurationMinutes) {
            return NextResponse.json(
                { error: "缺少必填字段" },
                { status: 400 }
            );
        }

        // Generate admin token
        const adminToken = generateAdminToken();

        // Create event
        const event = await prisma.event.create({
            data: {
                title,
                description: description || null,
                timezone,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                dayStartTime,
                dayEndTime,
                slotMinutes: parseInt(slotMinutes),
                minDurationMinutes: parseInt(minDurationMinutes),
                adminToken,
            },
        });

        return NextResponse.json({
            event,
            shareUrl: `/e/${event.id}`,
            resultsUrl: `/e/${event.id}/results?token=${adminToken}`,
        });
    } catch (error) {
        console.error("Error creating event:", error);
        return NextResponse.json(
            { error: "创建活动失败" },
            { status: 500 }
        );
    }
}

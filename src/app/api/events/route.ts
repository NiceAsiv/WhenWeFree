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
            mode = 'timeRange',
            timeMode = 'standard',
            dayStartTime,
            dayEndTime,
            slotMinutes,
            minDurationMinutes,
            customTimeSlots,
        } = body;

        // Validate required fields
        if (!title || !timezone || !startDate || !endDate) {
            return NextResponse.json(
                { error: "缺少必填字段" },
                { status: 400 }
            );
        }

        // For timeRange mode with standard timeMode, validate standard fields
        if (mode === 'timeRange' && timeMode === 'standard') {
            if (!dayStartTime || !dayEndTime || !slotMinutes || !minDurationMinutes) {
                return NextResponse.json(
                    { error: "标准模式缺少必填字段" },
                    { status: 400 }
                );
            }
        }

        // For timeRange mode with period timeMode, set default period values
        let finalDayStartTime = dayStartTime;
        let finalDayEndTime = dayEndTime;
        let finalSlotMinutes = slotMinutes;
        let finalMinDurationMinutes = minDurationMinutes;

        if (mode === 'timeRange' && timeMode === 'period') {
            finalDayStartTime = '09:00';
            finalDayEndTime = '22:00';
            finalSlotMinutes = 180; // 3 hours per period
            finalMinDurationMinutes = 180;
        }

        // For custom mode, validate customTimeSlots
        if (mode === 'timeRange' && timeMode === 'custom') {
            if (!customTimeSlots || !Array.isArray(customTimeSlots) || customTimeSlots.length === 0) {
                return NextResponse.json(
                    { error: "自定义模式需要至少一个时间段" },
                    { status: 400 }
                );
            }
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
                mode,
                timeMode: mode === 'timeRange' ? timeMode : 'standard',
                dayStartTime: finalDayStartTime || null,
                dayEndTime: finalDayEndTime || null,
                slotMinutes: finalSlotMinutes ? parseInt(finalSlotMinutes) : null,
                minDurationMinutes: finalMinDurationMinutes ? parseInt(finalMinDurationMinutes) : null,
                customTimeSlots: customTimeSlots || null,
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

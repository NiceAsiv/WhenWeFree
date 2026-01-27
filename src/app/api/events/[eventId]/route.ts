import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: { eventId: string } }
) {
    try {
        const event = await prisma.event.findUnique({
            where: { id: params.eventId },
        });

        if (!event) {
            return NextResponse.json(
                { error: "活动不存在" },
                { status: 404 }
            );
        }

        return NextResponse.json(event);
    } catch (error) {
        console.error("Error fetching event:", error);
        return NextResponse.json(
            { error: "获取活动失败" },
            { status: 500 }
        );
    }
}

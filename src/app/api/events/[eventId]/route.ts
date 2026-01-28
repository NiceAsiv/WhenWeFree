import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ eventId: string }> }
) {
    const startTime = Date.now();
    try {
        const { eventId } = await params;
        console.log(`[API] Fetching event ${eventId} from ${request.headers.get('x-forwarded-for') || 'unknown IP'}`);
        
        const event = await prisma.event.findUnique({
            where: { id: eventId },
        });

        const duration = Date.now() - startTime;
        console.log(`[API] Event query completed in ${duration}ms, found: ${!!event}`);

        if (!event) {
            console.warn(`[API] Event not found: ${eventId}`);
            return NextResponse.json(
                { error: "活动不存在" },
                { status: 404 }
            );
        }

        return NextResponse.json(event);
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error("[API] Error fetching event:", {
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString(),
        });
        return NextResponse.json(
            { error: "获取活动失败" },
            { status: 500 }
        );
    }
}

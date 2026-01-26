import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Query response by name
export async function GET(
    request: Request,
    { params }: { params: { eventId: string } }
) {
    try {
        const { searchParams } = new URL(request.url);
        const name = searchParams.get('name');

        if (!name) {
            return NextResponse.json(
                { error: "缺少昵称参数" },
                { status: 400 }
            );
        }

        // Find response by event ID and name
        const response = await prisma.response.findFirst({
            where: {
                eventId: params.eventId,
                name: name.trim(),
            },
            orderBy: {
                updatedAt: 'desc', // Get the most recent one if multiple exist
            },
        });

        return NextResponse.json({ response });
    } catch (error) {
        console.error("Error fetching response:", error);
        return NextResponse.json(
            { error: "查询失败" },
            { status: 500 }
        );
    }
}

// POST - Create or update response
export async function POST(
    request: Request,
    { params }: { params: { eventId: string } }
) {
    try {
        const body = await request.json();
        const { name, availabilitySlots, responseId } = body;

        // Validate required fields
        if (!name || name.trim().length < 2) {
            return NextResponse.json(
                { error: "请输入至少2个字符的昵称" },
                { status: 400 }
            );
        }

        if (!availabilitySlots || !Array.isArray(availabilitySlots)) {
            return NextResponse.json(
                { error: "无效的时间段数据" },
                { status: 400 }
            );
        }

        // Check if event exists
        const event = await prisma.event.findUnique({
            where: { id: params.eventId },
        });

        if (!event) {
            return NextResponse.json(
                { error: "活动不存在" },
                { status: 404 }
            );
        }

        const trimmedName = name.trim();

        // Check if we should update existing response
        if (responseId) {
            // Update by responseId
            const existingResponse = await prisma.response.findUnique({
                where: { id: responseId },
            });

            if (existingResponse && existingResponse.eventId === params.eventId) {
                const updatedResponse = await prisma.response.update({
                    where: { id: responseId },
                    data: {
                        name: trimmedName,
                        availabilitySlots,
                    },
                });
                return NextResponse.json({ response: updatedResponse, isUpdate: true });
            }
        }

        // Try to find existing response by name
        const existingResponse = await prisma.response.findFirst({
            where: {
                eventId: params.eventId,
                name: trimmedName,
            },
        });

        if (existingResponse) {
            // Update existing response
            const updatedResponse = await prisma.response.update({
                where: { id: existingResponse.id },
                data: {
                    availabilitySlots,
                },
            });
            return NextResponse.json({ response: updatedResponse, isUpdate: true });
        }

        // Create new response
        const response = await prisma.response.create({
            data: {
                eventId: params.eventId,
                name: trimmedName,
                availabilitySlots,
                sessionToken: `session_${Date.now()}_${Math.random().toString(36)}`, // Still generate for compatibility
            },
        });

        return NextResponse.json({ response, isUpdate: false });
    } catch (error) {
        console.error("Error creating response:", error);
        return NextResponse.json(
            { error: "提交失败" },
            { status: 500 }
        );
    }
}

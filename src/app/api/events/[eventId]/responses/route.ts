import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Simple email validation
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// GET - Query response by email
export async function GET(
    request: Request,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const { eventId } = await params;
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json(
                { error: "缺少邮箱参数" },
                { status: 400 }
            );
        }

        if (!isValidEmail(email)) {
            return NextResponse.json(
                { error: "邮箱格式不正确" },
                { status: 400 }
            );
        }

        // Find response by event ID and email
        const response = await prisma.response.findUnique({
            where: {
                eventId_email: {
                    eventId: eventId,
                    email: email.trim().toLowerCase(),
                },
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
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const { eventId } = await params;
        const body = await request.json();
        const { name, email, availabilitySlots } = body;

        // Validate required fields
        if (!email || !isValidEmail(email)) {
            return NextResponse.json(
                { error: "请输入有效的邮箱地址" },
                { status: 400 }
            );
        }

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
            where: { id: eventId },
        });

        if (!event) {
            return NextResponse.json(
                { error: "活动不存在" },
                { status: 404 }
            );
        }

        const trimmedName = name.trim();
        const normalizedEmail = email.trim().toLowerCase();

        // Try to find existing response by email (using unique constraint)
        const existingResponse = await prisma.response.findUnique({
            where: {
                eventId_email: {
                    eventId: eventId,
                    email: normalizedEmail,
                },
            },
        });

        if (existingResponse) {
            // Update existing response
            const updatedResponse = await prisma.response.update({
                where: { id: existingResponse.id },
                data: {
                    name: trimmedName,
                    availabilitySlots,
                },
            });
            return NextResponse.json({ response: updatedResponse, isUpdate: true });
        }

        // Create new response
        const response = await prisma.response.create({
            data: {
                eventId: eventId,
                name: trimmedName,
                email: normalizedEmail,
                availabilitySlots,
                sessionToken: `session_${Date.now()}_${Math.random().toString(36)}`,
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

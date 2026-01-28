import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Simple email validation
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// GET - Query response by email (fallback for backward compatibility)
export async function GET(
    request: Request,
    { params }: { params: Promise<{ eventId: string }> }
) {
    const startTime = Date.now();
    try {
        const { eventId } = await params;
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        console.log(`[API] Querying response for event ${eventId} (via GET - deprecated)`);

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

        const normalizedEmail = email.trim().toLowerCase();

        // Find response by event ID and email
        const response = await prisma.response.findUnique({
            where: {
                eventId_email: {
                    eventId: eventId,
                    email: normalizedEmail,
                },
            },
        });

        const duration = Date.now() - startTime;
        console.log(`[API] Response query completed in ${duration}ms, found: ${!!response}`);

        return NextResponse.json({ response });
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error("[API] Error fetching response:", {
            error: error instanceof Error ? error.message : error,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString(),
        });
        return NextResponse.json(
            { error: "查询失败" },
            { status: 500 }
        );
    }
}

// PUT - Query response by email (secure method using request body instead of URL params)
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ eventId: string }> }
) {
    const startTime = Date.now();
    try {
        const { eventId } = await params;
        const body = await request.json();
        const { email } = body;

        console.log(`[API] Querying response for event ${eventId} (via PUT - secure)`);

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

        const normalizedEmail = email.trim().toLowerCase();

        // Find response by event ID and email
        const response = await prisma.response.findUnique({
            where: {
                eventId_email: {
                    eventId: eventId,
                    email: normalizedEmail,
                },
            },
        });

        const duration = Date.now() - startTime;
        console.log(`[API] Response query completed in ${duration}ms, found: ${!!response}`);

        return NextResponse.json({ response });
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error("[API] Error fetching response:", {
            error: error instanceof Error ? error.message : error,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString(),
        });
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

        console.log(`[API] Creating/updating response for event ${eventId}`);
        const dbStartTime = Date.now();

        // Check if event exists
        const event = await prisma.event.findUnique({
            where: { id: eventId },
        });

        console.log(`[API] Event lookup took ${Date.now() - dbStartTime}ms, found: ${!!event}`);

        if (!event) {
            console.warn(`[API] Event not found during response creation: ${eventId}`);
            return NextResponse.json(
                { error: "活动不存在" },
                { status: 404 }
            );
        }

        const trimmedName = name.trim();
        const normalizedEmail = email.trim().toLowerCase();

        // Try to find existing response by email (using unique constraint)
        const existingCheckStart = Date.now();
        const existingResponse = await prisma.response.findUnique({
            where: {
                eventId_email: {
                    eventId: eventId,
                    email: normalizedEmail,
                },
            },
        });

        console.log(`[API] Existing response check took ${Date.now() - existingCheckStart}ms, found: ${!!existingResponse}`);

        if (existingResponse) {
            // Update existing response
            const updateStart = Date.now();
            const updatedResponse = await prisma.response.update({
                where: { id: existingResponse.id },
                data: {
                    name: trimmedName,
                    availabilitySlots,
                },
            });
            console.log(`[API] Response update took ${Date.now() - updateStart}ms`);
            return NextResponse.json({ response: updatedResponse, isUpdate: true });
        }

        // Create new response
        const createStart = Date.now();
        const response = await prisma.response.create({
            data: {
                eventId: eventId,
                name: trimmedName,
                email: normalizedEmail,
                availabilitySlots,
                sessionToken: `session_${Date.now()}_${Math.random().toString(36)}`,
            },
        });
        console.log(`[API] Response creation took ${Date.now() - createStart}ms`);

        return NextResponse.json({ response, isUpdate: false });
    } catch (error) {
        console.error("[API] Error creating response:", {
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString(),
        });
        return NextResponse.json(
            { error: "提交失败" },
            { status: 500 }
        );
    }
}

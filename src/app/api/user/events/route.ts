import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUserId } from '@/lib/auth';

// GET /api/user/events - Get all events created by the authenticated user
export async function GET() {
    try {
        const userId = await getAuthUserId();
        
        if (!userId) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const events = await prisma.event.findMany({
            where: { userId },
            include: {
                responses: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        createdAt: true,
                    },
                },
                _count: {
                    select: {
                        responses: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Format response
        const formattedEvents = events.map(event => ({
            id: event.id,
            title: event.title,
            description: event.description,
            timezone: event.timezone,
            startDate: event.startDate,
            endDate: event.endDate,
            mode: event.mode,
            createdAt: event.createdAt,
            responseCount: event._count.responses,
            participantCount: event.responses.length,
        }));

        return NextResponse.json({
            success: true,
            events: formattedEvents,
        });
    } catch (error) {
        console.error('Get user events error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

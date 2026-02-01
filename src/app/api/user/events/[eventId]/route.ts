import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUserId } from '@/lib/auth';

// DELETE /api/user/events/[eventId] - Delete an event
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const userId = await getAuthUserId();
        
        if (!userId) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const { eventId } = await params;

        // Check if event exists and belongs to user
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { userId: true },
        });

        if (!event) {
            return NextResponse.json(
                { error: 'Event not found' },
                { status: 404 }
            );
        }

        if (event.userId !== userId) {
            return NextResponse.json(
                { error: 'Unauthorized to delete this event' },
                { status: 403 }
            );
        }

        // Delete event (responses will be cascade deleted)
        await prisma.event.delete({
            where: { id: eventId },
        });

        return NextResponse.json({
            success: true,
            message: 'Event deleted successfully',
        });
    } catch (error) {
        console.error('Delete event error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

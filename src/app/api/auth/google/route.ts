import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import prisma from '@/lib/prisma';
import { setAuthCookie } from '@/lib/auth';

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

// POST: Handle Google OAuth token verification
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { credential } = body;

        if (!credential) {
            return NextResponse.json(
                { error: 'Credential is required' },
                { status: 400 }
            );
        }

        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.sub || !payload.email) {
            return NextResponse.json(
                { error: 'Invalid token payload' },
                { status: 400 }
            );
        }

        const googleId = payload.sub;
        const email = payload.email;
        const name = payload.name || email.split('@')[0];
        const emailVerified = payload.email_verified;

        if (!emailVerified) {
            return NextResponse.json(
                { error: 'Email not verified by Google' },
                { status: 400 }
            );
        }

        // Check if user exists by Google ID or email
        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { googleId },
                    { email },
                ],
            },
            select: {
                id: true,
                email: true,
                name: true,
                googleId: true,
                createdAt: true,
            },
        });

        if (user) {
            // Update Google ID if not set
            if (!user.googleId) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { googleId },
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        googleId: true,
                        createdAt: true,
                    },
                });
            }
        } else {
            // Create new user
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    googleId,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    googleId: true,
                    createdAt: true,
                },
            });
        }

        // Set auth cookie
        const token = await setAuthCookie(user.id);

        return NextResponse.json({
            success: true,
            user,
            token,
        });
    } catch (error) {
        console.error('Google auth error:', error);
        return NextResponse.json(
            { error: 'Authentication failed. Please try again.' },
            { status: 500 }
        );
    }
}

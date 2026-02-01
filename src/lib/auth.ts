import { nanoid } from 'nanoid';
import { cookies } from 'next/headers';

// Simple password hashing (在生产环境应使用bcrypt)
export async function hashPassword(password: string): Promise<string> {
    // TODO: 在生产环境使用 bcrypt
    // import bcrypt from 'bcrypt';
    // return await bcrypt.hash(password, 10);
    
    // 临时使用简单的hash（仅用于开发）
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    // TODO: 在生产环境使用 bcrypt
    // import bcrypt from 'bcrypt';
    // return await bcrypt.compare(password, hash);
    
    const passwordHash = await hashPassword(password);
    return passwordHash === hash;
}

// JWT token generation (简化版本)
export function generateAuthToken(userId: string): string {
    // TODO: 在生产环境使用真正的JWT
    // import jwt from 'jsonwebtoken';
    // return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    
    // 临时使用简单的token
    const token = `${userId}.${nanoid(32)}`;
    return Buffer.from(token).toString('base64');
}

export function verifyAuthToken(token: string): string | null {
    try {
        // TODO: 在生产环境使用真正的JWT验证
        // import jwt from 'jsonwebtoken';
        // const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        // return decoded.userId;
        
        // 临时验证
        const decoded = Buffer.from(token, 'base64').toString();
        const userId = decoded.split('.')[0];
        return userId || null;
    } catch (error) {
        return null;
    }
}

// Cookie helpers
export async function setAuthCookie(userId: string) {
    const token = generateAuthToken(userId);
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });
    return token;
}

export async function getAuthUserId(): Promise<string | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');
    if (!token) return null;
    return verifyAuthToken(token.value);
}

export async function clearAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
}

import { nanoid } from "nanoid";

/**
 * Generate a secure admin token for event management
 */
export function generateAdminToken(): string {
    return `admin_${nanoid(32)}`;
}

/**
 * Generate a session token for participant responses
 */
export function generateSessionToken(): string {
    return `session_${nanoid(32)}`;
}

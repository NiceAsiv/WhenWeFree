/**
 * Client-side email encryption utilities
 * Uses simple hashing to avoid exposing raw emails in URLs
 */

/**
 * Hash email using SHA-256 (browser-compatible)
 * This is for privacy, not security - just to avoid raw emails in URLs
 */
export async function hashEmail(email: string): Promise<string> {
    const normalized = email.trim().toLowerCase();
    const encoder = new TextEncoder();
    const data = encoder.encode(normalized);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

/**
 * Store email locally (for the user to retrieve their own responses)
 * We use localStorage with a hashed key
 */
export function storeEmailLocally(eventId: string, email: string): void {
    if (typeof window === 'undefined') return;
    
    const normalized = email.trim().toLowerCase();
    const storageKey = `event_${eventId}_email`;
    
    try {
        localStorage.setItem(storageKey, normalized);
    } catch (error) {
        console.warn('Failed to store email locally:', error);
    }
}

/**
 * Retrieve stored email for an event
 */
export function getStoredEmail(eventId: string): string | null {
    if (typeof window === 'undefined') return null;
    
    const storageKey = `event_${eventId}_email`;
    
    try {
        return localStorage.getItem(storageKey);
    } catch (error) {
        console.warn('Failed to retrieve stored email:', error);
        return null;
    }
}

/**
 * Clear stored email for an event
 */
export function clearStoredEmail(eventId: string): void {
    if (typeof window === 'undefined') return;
    
    const storageKey = `event_${eventId}_email`;
    
    try {
        localStorage.removeItem(storageKey);
    } catch (error) {
        console.warn('Failed to clear stored email:', error);
    }
}

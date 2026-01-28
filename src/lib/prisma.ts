import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === "development" 
        ? ["query", "info", "warn", "error"] 
        : ["error"],
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Helper function for database operations with timeout and retry
export async function withRetry<T>(
    operation: () => Promise<T>,
    operationName: string,
    maxRetries = 2,
    timeout = 60000 // 60 seconds
): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const result = await Promise.race([
                operation(),
                new Promise<never>((_, reject) => 
                    setTimeout(() => reject(new Error(`Timeout after ${timeout}ms`)), timeout)
                )
            ]);
            
            if (attempt > 0) {
                console.log(`[DB Success] ${operationName} succeeded on attempt ${attempt + 1}`);
            }
            
            return result;
        } catch (error) {
            lastError = error as Error;
            console.error(`[DB Error] ${operationName} failed (attempt ${attempt + 1}/${maxRetries + 1}):`, {
                error: error instanceof Error ? error.message : error,
                timestamp: new Date().toISOString(),
            });
            
            if (attempt < maxRetries) {
                const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
                console.log(`[DB Retry] Retrying ${operationName} in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    
    throw lastError;
}

export default prisma;

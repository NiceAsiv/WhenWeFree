const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

console.log('User model exists:', typeof prisma.user !== 'undefined');
console.log('User methods:', prisma.user ? Object.keys(prisma.user).slice(0, 5) : 'N/A');

prisma.$disconnect().then(() => {
    console.log('Prisma disconnected');
    process.exit(0);
});

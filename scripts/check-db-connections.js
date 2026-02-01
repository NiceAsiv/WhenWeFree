// 检查数据库连接状态
const { PrismaClient } = require('@prisma/client');

async function checkConnections() {
    const prisma = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
    });

    try {
        console.log('=== 检查数据库连接 ===\n');

        // 查询当前连接数
        const totalConnections = await prisma.$queryRaw`
            SELECT count(*) as count FROM pg_stat_activity;
        `;
        console.log('📊 当前总连接数:', totalConnections[0].count);

        // 查询最大连接数
        const maxConnections = await prisma.$queryRaw`
            SHOW max_connections;
        `;
        console.log('🔢 最大允许连接数:', maxConnections[0].max_connections);

        // 查询当前数据库的活跃连接
        const activeConnections = await prisma.$queryRaw`
            SELECT 
                pid,
                usename,
                application_name,
                client_addr,
                state,
                query_start
            FROM pg_stat_activity 
            WHERE datname = current_database()
            ORDER BY query_start DESC;
        `;
        
        console.log('\n📋 当前数据库的活跃连接:', activeConnections.length);
        console.table(activeConnections);

        // 按状态分组
        const byState = await prisma.$queryRaw`
            SELECT state, count(*) as count
            FROM pg_stat_activity 
            WHERE datname = current_database()
            GROUP BY state;
        `;
        
        console.log('\n📈 按状态分组的连接数:');
        console.table(byState);

        // 检查是否有空闲连接
        const idleConnections = await prisma.$queryRaw`
            SELECT count(*) as count
            FROM pg_stat_activity 
            WHERE datname = current_database() 
            AND state = 'idle';
        `;
        console.log('\n💤 空闲连接数:', idleConnections[0].count);

        // 检查长时间运行的查询
        const longRunning = await prisma.$queryRaw`
            SELECT 
                pid,
                now() - query_start as duration,
                state,
                query
            FROM pg_stat_activity 
            WHERE datname = current_database()
            AND state != 'idle'
            AND query_start < now() - interval '1 minute'
            ORDER BY query_start;
        `;
        
        if (longRunning.length > 0) {
            console.log('\n⚠️  长时间运行的查询（超过1分钟）:');
            console.table(longRunning);
        } else {
            console.log('\n✅ 没有长时间运行的查询');
        }

    } catch (error) {
        console.error('❌ 错误:', error.message);
    } finally {
        await prisma.$disconnect();
        console.log('\n✅ 已断开连接');
    }
}

checkConnections();

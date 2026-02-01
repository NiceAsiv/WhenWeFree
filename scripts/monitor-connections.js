// 实时监控数据库连接
const { PrismaClient } = require('@prisma/client');

async function monitorConnections() {
    const prisma = new PrismaClient();
    
    console.log('🔍 开始监控数据库连接... (按 Ctrl+C 退出)\n');
    
    setInterval(async () => {
        try {
            const [total, byState] = await Promise.all([
                prisma.$queryRaw`SELECT count(*) as count FROM pg_stat_activity WHERE datname = current_database()`,
                prisma.$queryRaw`SELECT state, count(*) as count FROM pg_stat_activity WHERE datname = current_database() GROUP BY state`,
            ]);
            
            const timestamp = new Date().toLocaleTimeString('zh-CN');
            console.log(`[${timestamp}] 总连接: ${total[0].count}`);
            byState.forEach(s => {
                console.log(`  - ${s.state || 'null'}: ${s.count}`);
            });
            console.log('');
        } catch (error) {
            console.error('❌ 查询失败:', error.message);
        }
    }, 3000); // 每3秒检查一次
}

monitorConnections();

process.on('SIGINT', () => {
    console.log('\n👋 停止监控');
    process.exit(0);
});

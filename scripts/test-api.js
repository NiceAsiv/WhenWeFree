/**
 * API 端点测试脚本
 * 测试邮箱查询的新旧两种方法
 * 
 * 使用方法:
 * 1. 确保开发服务器正在运行: npm run dev
 * 2. 运行此脚本: node scripts/test-api.js
 */

const baseUrl = 'http://localhost:3000';

async function testAPI() {
  console.log('=== 测试 API 端点 ===\n');

  // 替换为你的实际 eventId 和 email
  const eventId = 'YOUR_EVENT_ID_HERE';
  const testEmail = 'test@example.com';

  try {
    // 测试1: 获取活动信息
    console.log('测试1: 获取活动信息...');
    const eventResponse = await fetch(`${baseUrl}/api/events/${eventId}`);
    const eventData = await eventResponse.json();
    
    if (eventResponse.ok) {
      console.log(`✅ 成功获取活动: ${eventData.title}`);
      console.log(`   时区: ${eventData.timezone}`);
      console.log(`   模式: ${eventData.mode}\n`);
    } else {
      console.log(`❌ 获取活动失败: ${eventData.error}\n`);
    }

    // 测试2: 使用旧方法查询响应 (GET with URL params)
    console.log('测试2: 使用旧方法查询响应 (GET)...');
    const oldMethodResponse = await fetch(
      `${baseUrl}/api/events/${eventId}/responses?email=${encodeURIComponent(testEmail)}`
    );
    const oldMethodData = await oldMethodResponse.json();
    
    if (oldMethodResponse.ok) {
      console.log(`✅ 旧方法成功, 找到响应: ${!!oldMethodData.response}`);
      console.log(`   ⚠️  警告: 邮箱暴露在 URL 中\n`);
    } else {
      console.log(`❌ 旧方法失败: ${oldMethodData.error}\n`);
    }

    // 测试3: 使用新方法查询响应 (PUT with body)
    console.log('测试3: 使用新方法查询响应 (PUT)...');
    const newMethodResponse = await fetch(
      `${baseUrl}/api/events/${eventId}/responses`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: testEmail }),
      }
    );
    const newMethodData = await newMethodResponse.json();
    
    if (newMethodResponse.ok) {
      console.log(`✅ 新方法成功, 找到响应: ${!!newMethodData.response}`);
      console.log(`   ✓ 安全: 邮箱在请求体中,不暴露在 URL\n`);
    } else {
      console.log(`❌ 新方法失败: ${newMethodData.error}\n`);
    }

    // 测试4: 提交响应
    console.log('测试4: 提交新响应...');
    const submitResponse = await fetch(
      `${baseUrl}/api/events/${eventId}/responses`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: '测试用户',
          email: testEmail,
          availabilitySlots: [0, 1, 2],
        }),
      }
    );
    const submitData = await submitResponse.json();
    
    if (submitResponse.ok) {
      console.log(`✅ 响应提交成功`);
      console.log(`   类型: ${submitData.isUpdate ? '更新' : '新建'}`);
      console.log(`   ID: ${submitData.response.id}\n`);
    } else {
      console.log(`❌ 提交失败: ${submitData.error}\n`);
    }

    console.log('=== 测试完成 ===');
    console.log('\n建议:');
    console.log('1. 检查服务器日志查看详细的调试信息');
    console.log('2. 所有新代码应该使用 PUT 方法查询邮箱');
    console.log('3. 监控 API 响应时间,正常应该 < 500ms');

  } catch (error) {
    console.error('❌ 测试出错:', error.message);
    console.error('\n请确保:');
    console.error('1. 开发服务器正在运行 (npm run dev)');
    console.error('2. eventId 是有效的活动 ID');
    console.error('3. 数据库连接正常');
  }
}

// 检查是否提供了 eventId
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('使用方法:');
  console.log('  node scripts/test-api.js');
  console.log('\n在运行前,请编辑脚本中的 eventId 和 testEmail 变量');
  process.exit(0);
}

testAPI();

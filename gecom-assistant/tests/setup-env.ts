/**
 * 测试环境变量配置
 *
 * 必须在所有imports之前加载，确保process.env在模块加载时可用
 */
import { config } from 'dotenv';

// 加载.env.local文件
config({ path: '.env.local' });

// 验证关键环境变量
const requiredVars = ['LLM_BASE_URL', 'LLM_API_KEY'];
const missing = requiredVars.filter((v) => !process.env[v]);

if (missing.length > 0) {
  console.warn(`⚠️ 缺少环境变量: ${missing.join(', ')}`);
  console.warn('将使用Fallback规则引擎代替DeepSeek API');
} else {
  console.log('✅ 环境变量加载成功');
  console.log(`   LLM_BASE_URL: ${process.env.LLM_BASE_URL}`);
  console.log(`   LLM_API_KEY: ${process.env.LLM_API_KEY?.substring(0, 20)}...`);
}

export {}; // 确保这是一个模块

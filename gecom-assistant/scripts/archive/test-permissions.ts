/**
 * 测试API Key具体权限
 */

import { config } from 'dotenv';
import { Client, Databases } from 'node-appwrite';

config({ path: '.env.local' });

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '';
const APPWRITE_PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT || '';
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE || '';
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || '';

console.log('🔑 API Key权限测试\n');
console.log(`Endpoint: ${APPWRITE_ENDPOINT}`);
console.log(`Project: ${APPWRITE_PROJECT}`);
console.log(`Database: ${APPWRITE_DATABASE_ID}`);
console.log(`API Key: ${APPWRITE_API_KEY.substring(0, 50)}...\n`);

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

async function testPermissions() {
  // Test 1: List databases
  console.log('测试 1: 列出所有databases...');
  try {
    const result = await databases.list();
    console.log(`✅ 成功！找到 ${result.total} 个databases\n`);
  } catch (error: any) {
    console.log(`❌ 失败: ${error.message}\n`);
  }

  // Test 2: Get specific database
  console.log('测试 2: 获取指定database...');
  try {
    const db = await databases.get(APPWRITE_DATABASE_ID);
    console.log(`✅ 成功！Database名称: ${db.name}\n`);
  } catch (error: any) {
    console.log(`❌ 失败: ${error.message}\n`);
  }

  // Test 3: List collections
  console.log('测试 3: 列出database中的collections...');
  try {
    const collections = await databases.listCollections(APPWRITE_DATABASE_ID);
    console.log(`✅ 成功！找到 ${collections.total} 个collections`);
    collections.collections.forEach((col: any) => {
      console.log(`  - ${col.$id}: ${col.name} (${col.attributes?.length || 0} 属性)`);
    });
    console.log('');
  } catch (error: any) {
    console.log(`❌ 失败: ${error.message}\n`);
  }

  // Test 4: Try to create a test collection
  console.log('测试 4: 尝试创建测试collection...');
  try {
    const testCol = await databases.createCollection(
      APPWRITE_DATABASE_ID,
      'test_permission_check',
      '权限测试Collection'
    );
    console.log(`✅ 成功！创建了测试collection: ${testCol.$id}\n`);

    // Clean up
    console.log('清理测试collection...');
    await databases.deleteCollection(APPWRITE_DATABASE_ID, 'test_permission_check');
    console.log('✅ 测试collection已删除\n');
  } catch (error: any) {
    console.log(`❌ 失败: ${error.message}\n`);
  }
}

testPermissions().catch(console.error);

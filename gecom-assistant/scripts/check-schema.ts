/**
 * 检查Appwrite cost_factors表的实际Schema
 * 用于验证Week 1创建了哪些字段，Week 2需要新增哪些
 */

import { config } from 'dotenv';
import { Client, Databases } from 'node-appwrite';

// 加载.env.local文件
config({ path: '.env.local' });

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://apps.aotsea.com/v1';
const APPWRITE_PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT || '';
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE || '';
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || '';

if (!APPWRITE_API_KEY) {
  console.error('❌ 错误：未找到APPWRITE_API_KEY环境变量');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

async function checkSchema() {
  try {
    console.log('\n🔍 检查cost_factors表Schema...\n');

    // 获取collection信息
    const collection = await databases.getCollection(
      APPWRITE_DATABASE_ID,
      'cost_factors'
    );

    console.log(`✅ Collection名称: ${collection.name}`);
    console.log(`✅ Collection ID: ${collection.$id}`);
    console.log(`✅ 总字段数: ${collection.attributes.length}`);
    console.log('\n📋 现有字段列表:\n');

    // 按模块分组统计
    const fieldsByModule: Record<string, any[]> = {
      '基础': [],
      'M1': [],
      'M2': [],
      'M3': [],
      'M4': [],
      'M5': [],
      'M6': [],
      'M7': [],
      'M8': [],
      '其他': []
    };

    collection.attributes.forEach((attr: any) => {
      const key = attr.key;
      if (key.startsWith('m1_')) {
        fieldsByModule['M1'].push(attr);
      } else if (key.startsWith('m2_')) {
        fieldsByModule['M2'].push(attr);
      } else if (key.startsWith('m3_')) {
        fieldsByModule['M3'].push(attr);
      } else if (key.startsWith('m4_')) {
        fieldsByModule['M4'].push(attr);
      } else if (key.startsWith('m5_')) {
        fieldsByModule['M5'].push(attr);
      } else if (key.startsWith('m6_')) {
        fieldsByModule['M6'].push(attr);
      } else if (key.startsWith('m7_')) {
        fieldsByModule['M7'].push(attr);
      } else if (key.startsWith('m8_')) {
        fieldsByModule['M8'].push(attr);
      } else if (['country', 'country_name_cn', 'country_flag', 'industry', 'version'].includes(key)) {
        fieldsByModule['基础'].push(attr);
      } else {
        fieldsByModule['其他'].push(attr);
      }
    });

    // 打印各模块字段
    Object.entries(fieldsByModule).forEach(([module, fields]) => {
      if (fields.length > 0) {
        console.log(`${module}模块（${fields.length}个字段）:`);
        fields.forEach((attr: any) => {
          console.log(`  - ${attr.key} (${attr.type}, required: ${attr.required || false})`);
        });
        console.log('');
      }
    });

    console.log(`\n📊 统计:`);
    console.log(`基础字段: ${fieldsByModule['基础'].length}`);
    console.log(`M1: ${fieldsByModule['M1'].length}`);
    console.log(`M2: ${fieldsByModule['M2'].length}`);
    console.log(`M3: ${fieldsByModule['M3'].length}`);
    console.log(`M4: ${fieldsByModule['M4'].length}`);
    console.log(`M5: ${fieldsByModule['M5'].length}`);
    console.log(`M6: ${fieldsByModule['M6'].length}`);
    console.log(`M7: ${fieldsByModule['M7'].length}`);
    console.log(`M8: ${fieldsByModule['M8'].length}`);
    console.log(`其他: ${fieldsByModule['其他'].length}`);
    console.log(`总计: ${collection.attributes.length}`);

  } catch (error: any) {
    console.error('❌ 检查失败:', error.message);
  }
}

checkSchema();

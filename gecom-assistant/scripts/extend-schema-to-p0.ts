/**
 * 扩展Appwrite cost_factors Schema（36→67字段P0）
 * Week 2 Day 6 - Task 6.0.1
 *
 * 根据DATA-COLLECTION-STANDARD.md的P0字段要求，新增31个字段
 */

import { config } from 'dotenv';
import { Client, Databases } from 'node-appwrite';

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

const COLLECTION_ID = 'cost_factors';

/**
 * 安全创建字段的辅助函数
 */
async function safeCreateAttribute(
  type: 'string' | 'float' | 'datetime',
  key: string,
  sizeOrOptions?: number | any,
  required: boolean = false,
  defaultValue?: any
) {
  try {
    if (type === 'string') {
      await databases.createStringAttribute(
        APPWRITE_DATABASE_ID,
        COLLECTION_ID,
        key,
        sizeOrOptions || 512,
        required,
        defaultValue
      );
    } else if (type === 'float') {
      await databases.createFloatAttribute(
        APPWRITE_DATABASE_ID,
        COLLECTION_ID,
        key,
        required,
        undefined,
        undefined,
        defaultValue
      );
    } else if (type === 'datetime') {
      await databases.createDatetimeAttribute(
        APPWRITE_DATABASE_ID,
        COLLECTION_ID,
        key,
        required,
        defaultValue
      );
    }
    console.log(`  ✅ ${key}`);
    return true;
  } catch (error: any) {
    if (error.code === 409) {
      console.log(`  ⏭️  ${key} (已存在)`);
      return true;
    }
    console.error(`  ❌ ${key}: ${error.message}`);
    return false;
  }
}

async function extendSchema() {
  console.log('\n🔧 扩展cost_factors Schema（36→67字段P0）\n');

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  // ========== M1模块新增字段（+3个）==========
  console.log('\n📌 M1模块新增字段（+3个）:');
  if (await safeCreateAttribute('float', 'm1_industry_license_usd')) successCount++;
  if (await safeCreateAttribute('string', 'm1_industry_data_source', 512)) successCount++;
  if (await safeCreateAttribute('string', 'm1_industry_tier', 50)) successCount++;

  // ========== M1模块扩展字段（补充完整P0）==========
  console.log('\n📌 M1模块补充P0字段:');
  if (await safeCreateAttribute('float', 'm1_tax_registration_usd')) successCount++;
  if (await safeCreateAttribute('float', 'm1_legal_consulting_usd')) successCount++;
  if (await safeCreateAttribute('string', 'm1_tier', 50)) successCount++;
  if (await safeCreateAttribute('string', 'm1_notes', 1024)) successCount++;

  // ========== M2模块新增字段（+5个，m2_product_certification_usd已存在）==========
  console.log('\n📌 M2模块新增字段（+5个）:');
  if (await safeCreateAttribute('string', 'm2_product_certification_data_source', 512)) successCount++;
  if (await safeCreateAttribute('string', 'm2_product_certification_tier', 50)) successCount++;
  if (await safeCreateAttribute('float', 'm2_trademark_registration_usd')) successCount++;
  if (await safeCreateAttribute('string', 'm2_trademark_data_source', 512)) successCount++;
  if (await safeCreateAttribute('string', 'm2_trademark_tier', 50)) successCount++;

  // ========== M2模块补充P0字段==========
  console.log('\n📌 M2模块补充P0字段:');
  if (await safeCreateAttribute('float', 'm2_compliance_testing_usd')) successCount++;
  if (await safeCreateAttribute('string', 'm2_tier', 50)) successCount++;
  if (await safeCreateAttribute('string', 'm2_notes', 1024)) successCount++;

  // ========== M3模块补充P0字段==========
  console.log('\n📌 M3模块补充P0字段:');
  if (await safeCreateAttribute('float', 'm3_initial_inventory_usd')) successCount++;
  if (await safeCreateAttribute('float', 'm3_system_setup_usd')) successCount++;
  if (await safeCreateAttribute('string', 'm3_tier', 50)) successCount++;
  if (await safeCreateAttribute('string', 'm3_notes', 1024)) successCount++;

  // ========== M4模块新增字段（+4个）==========
  console.log('\n📌 M4模块新增字段（+4个）:');
  if (await safeCreateAttribute('string', 'm4_hs_code', 16)) successCount++;
  if (await safeCreateAttribute('string', 'm4_logistics', 2048)) successCount++; // JSON格式
  if (await safeCreateAttribute('string', 'm4_logistics_data_source', 512)) successCount++;
  if (await safeCreateAttribute('string', 'm4_logistics_tier', 50)) successCount++;

  // ========== M4模块补充P0字段==========
  console.log('\n📌 M4模块补充P0字段:');
  if (await safeCreateAttribute('string', 'm4_vat_data_source', 512)) successCount++;
  if (await safeCreateAttribute('string', 'm4_vat_tier', 50)) successCount++;
  if (await safeCreateAttribute('datetime', 'm4_vat_updated_at')) successCount++;
  if (await safeCreateAttribute('string', 'm4_tier', 50)) successCount++;
  if (await safeCreateAttribute('datetime', 'm4_collected_at')) successCount++;

  // ========== M5模块新增字段（+2个）==========
  console.log('\n📌 M5模块新增字段（+2个）:');
  if (await safeCreateAttribute('float', 'm5_delivery_cost_usd')) successCount++;
  if (await safeCreateAttribute('float', 'm5_return_cost_rate')) successCount++;

  // ========== M5模块补充P0字段==========
  console.log('\n📌 M5模块补充P0字段:');
  if (await safeCreateAttribute('float', 'm5_return_rate')) successCount++;
  if (await safeCreateAttribute('float', 'm5_fba_fee_usd')) successCount++;
  if (await safeCreateAttribute('string', 'm5_tier', 50)) successCount++;
  if (await safeCreateAttribute('string', 'm5_notes', 1024)) successCount++;
  if (await safeCreateAttribute('datetime', 'm5_collected_at')) successCount++;

  // ========== M6模块补充P0字段==========
  console.log('\n📌 M6模块补充P0字段:');
  if (await safeCreateAttribute('float', 'm6_marketing_rate')) successCount++;
  if (await safeCreateAttribute('string', 'm6_tier', 50)) successCount++;
  if (await safeCreateAttribute('string', 'm6_notes', 1024)) successCount++;
  if (await safeCreateAttribute('datetime', 'm6_collected_at')) successCount++;

  // ========== M7模块新增字段（+1个）==========
  console.log('\n📌 M7模块新增字段（+1个）:');
  if (await safeCreateAttribute('float', 'm7_payment_rate')) successCount++;

  // ========== M7模块补充P0字段==========
  console.log('\n📌 M7模块补充P0字段:');
  if (await safeCreateAttribute('float', 'm7_platform_commission_rate')) successCount++;
  if (await safeCreateAttribute('string', 'm7_tier', 50)) successCount++;
  if (await safeCreateAttribute('string', 'm7_notes', 1024)) successCount++;
  if (await safeCreateAttribute('datetime', 'm7_collected_at')) successCount++;

  // ========== M8模块新增字段（+1个）==========
  console.log('\n📌 M8模块新增字段（+1个）:');
  if (await safeCreateAttribute('float', 'm8_ga_rate')) successCount++;

  // ========== M8模块补充P0字段==========
  console.log('\n📌 M8模块补充P0字段:');
  if (await safeCreateAttribute('string', 'm8_tier', 50)) successCount++;
  if (await safeCreateAttribute('string', 'm8_notes', 1024)) successCount++;
  if (await safeCreateAttribute('datetime', 'm8_collected_at')) successCount++;

  // ========== 顶层溯源字段（全局）==========
  console.log('\n📌 顶层溯源字段（全局）:');
  if (await safeCreateAttribute('datetime', 'collected_at')) successCount++;
  if (await safeCreateAttribute('string', 'collected_by', 100)) successCount++;
  if (await safeCreateAttribute('datetime', 'verified_at')) successCount++;
  if (await safeCreateAttribute('string', 'next_update_due', 20)) successCount++; // 格式：2025-04-01

  // ========== 最终统计 ==========
  console.log('\n' + '='.repeat(60));
  console.log('📊 Schema扩展完成统计:');
  console.log('='.repeat(60));
  console.log(`✅ 新增字段: ${successCount}个`);
  console.log(`⏭️  已存在字段: ${skipCount}个`);
  console.log(`❌ 失败字段: ${failCount}个`);
  console.log(`🎯 目标字段数: 67个P0字段`);
  console.log('='.repeat(60));

  // 验证最终字段数
  console.log('\n🔍 验证最终Schema...');
  const collection = await databases.getCollection(APPWRITE_DATABASE_ID, COLLECTION_ID);
  console.log(`✅ 当前总字段数: ${collection.attributes.length}`);

  if (collection.attributes.length >= 67) {
    console.log('🎉 Schema扩展成功！已达到67个P0字段');
  } else {
    console.log(`⚠️ 当前字段数不足67个，可能需要手动检查`);
  }
}

extendSchema().catch(console.error);

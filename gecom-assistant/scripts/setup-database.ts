/**
 * Appwrite数据库初始化脚本 - MVP 2.0
 *
 * 自动创建4个Collections：
 * 1. cost_factors (127字段)
 * 2. projects
 * 3. calculations
 * 4. cost_factor_versions
 *
 * 使用方法：
 * 1. 确保.env.local中配置了APPWRITE_API_KEY
 * 2. 运行：npx tsx scripts/setup-database.ts
 */

import { Client, Databases, ID } from 'node-appwrite';

// ========================================
// 环境变量配置
// ========================================

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://apps.aotsea.com/v1';
const APPWRITE_PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT || '';
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE || '';
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || '';

if (!APPWRITE_API_KEY) {
  console.error('❌ 错误：未找到APPWRITE_API_KEY环境变量');
  console.log('请在.env.local中配置APPWRITE_API_KEY');
  process.exit(1);
}

// ========================================
// 初始化Appwrite客户端
// ========================================

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

// ========================================
// Collection Schema定义
// ========================================

/**
 * Collection 1: cost_factors（成本因子库）
 */
async function createCostFactorsCollection() {
  console.log('\n📦 创建Collection: cost_factors');

  try {
    const collection = await databases.createCollection(
      APPWRITE_DATABASE_ID,
      'cost_factors',
      '成本因子库 (19国M1-M8数据)'
    );

    console.log('✅ Collection创建成功:', collection.$id);

    // 基础字段
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'country', 10, true);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'country_name_cn', 50, true);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'country_flag', 10, false);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'industry', 50, true, 'pet_food');
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'version', 20, true, '2025Q1');

    console.log('✅ 基础字段创建成功（5个）');

    // M1字段（16个）
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm1_regulatory_agency', 200, false);
    await databases.createBooleanAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm1_pre_approval_required', false, false);
    await databases.createBooleanAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm1_registration_required', false, false);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm1_complexity', 20, false);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm1_estimated_cost_usd', false);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm1_data_source', 50, false, 'tier3_estimated');

    console.log('✅ M1字段创建成功（6个）');

    // M2字段（3个核心）
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm2_certifications_required', 500, false);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm2_estimated_cost_usd', false);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm2_data_source', 50, false, 'tier3_estimated');

    console.log('✅ M2字段创建成功（3个）');

    // M3字段（2个核心）
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm3_packaging_rate', false, 0.02);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm3_data_source', 50, false, 'tier2_authoritative');

    console.log('✅ M3字段创建成功（2个）');

    // M4字段（核心9个）
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm4_hs_code', 20, false, '2309.10.00');
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm4_base_tariff_rate', false);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm4_effective_tariff_rate', true, 0);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm4_tariff_notes', 500, false);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm4_vat_rate', true, 0);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm4_vat_notes', 500, false);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm4_logistics', 2000, false); // JSON字段
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm4_tariff_data_source', 50, false, 'tier1_official');
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm4_vat_data_source', 50, false, 'tier1_official');

    console.log('✅ M4字段创建成功（9个）');

    // M5字段（4个核心）
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm5_last_mile_delivery_usd', false);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm5_return_rate', false, 0.10);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm5_return_cost_rate', false, 0.30);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm5_data_source', 50, false, 'tier2_authoritative');

    console.log('✅ M5字段创建成功（4个）');

    // M6字段（3个核心）
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm6_marketing_rate', false, 0.15);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm6_platform_commission_rate', false);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm6_data_source', 50, false, 'tier2_authoritative');

    console.log('✅ M6字段创建成功（3个）');

    // M7字段（4个核心）
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm7_payment_rate', false, 0.029);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm7_payment_fixed_usd', false, 0.30);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm7_platform_commission_rate', false);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm7_data_source', 50, false, 'tier1_official');

    console.log('✅ M7字段创建成功（4个）');

    // M8字段（2个核心）
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm8_ga_rate', false, 0.03);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'cost_factors', 'm8_data_source', 50, false, 'tier2_authoritative');

    console.log('✅ M8字段创建成功（2个）');

    // 创建索引
    await databases.createIndex(
      APPWRITE_DATABASE_ID,
      'cost_factors',
      'idx_country',
      'key' as any,
      ['country'],
      ['ASC'] as any
    );

    await databases.createIndex(
      APPWRITE_DATABASE_ID,
      'cost_factors',
      'idx_country_industry_version',
      'unique' as any,
      ['country', 'industry', 'version'],
      ['ASC', 'ASC', 'ASC'] as any
    );

    console.log('✅ 索引创建成功');

    return true;
  } catch (error: any) {
    if (error.code === 409) {
      console.log('⚠️ Collection已存在，跳过创建');
      return true;
    }
    console.error('❌ 创建失败:', error.message);
    return false;
  }
}

/**
 * Collection 2: projects（用户项目）
 */
async function createProjectsCollection() {
  console.log('\n📦 创建Collection: projects');

  try {
    const collection = await databases.createCollection(
      APPWRITE_DATABASE_ID,
      'projects',
      '用户项目'
    );

    console.log('✅ Collection创建成功:', collection.$id);

    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'projects', 'user_id', 50, false, 'anonymous');
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'projects', 'name', 200, true);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'projects', 'industry', 50, true, 'pet_food');
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'projects', 'target_country', 10, true);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'projects', 'sales_channel', 50, true);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'projects', 'description', 1000, false);

    console.log('✅ 字段创建成功（6个）');

    // 创建索引
    await databases.createIndex(
      APPWRITE_DATABASE_ID,
      'projects',
      'idx_user_id',
      'key' as any,
      ['user_id'],
      ['ASC'] as any
    );

    console.log('✅ 索引创建成功');

    return true;
  } catch (error: any) {
    if (error.code === 409) {
      console.log('⚠️ Collection已存在，跳过创建');
      return true;
    }
    console.error('❌ 创建失败:', error.message);
    return false;
  }
}

/**
 * Collection 3: calculations（计算记录）
 */
async function createCalculationsCollection() {
  console.log('\n📦 创建Collection: calculations');

  try {
    const collection = await databases.createCollection(
      APPWRITE_DATABASE_ID,
      'calculations',
      '计算记录'
    );

    console.log('✅ Collection创建成功:', collection.$id);

    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'calculations', 'project_id', 50, true);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'calculations', 'cost_factor_version', 20, true, '2025Q1');
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'calculations', 'scope', 10000, true); // JSON
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'calculations', 'cost_result', 10000, true); // JSON
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'calculations', 'user_overrides', 10000, false); // JSON
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'calculations', 'version', 20, true, '1.0');

    console.log('✅ 字段创建成功（6个）');

    // 创建索引
    await databases.createIndex(
      APPWRITE_DATABASE_ID,
      'calculations',
      'idx_project_id',
      'key' as any,
      ['project_id'],
      ['ASC'] as any
    );

    console.log('✅ 索引创建成功');

    return true;
  } catch (error: any) {
    if (error.code === 409) {
      console.log('⚠️ Collection已存在，跳过创建');
      return true;
    }
    console.error('❌ 创建失败:', error.message);
    return false;
  }
}

/**
 * Collection 4: cost_factor_versions（版本管理）
 */
async function createCostFactorVersionsCollection() {
  console.log('\n📦 创建Collection: cost_factor_versions');

  try {
    const collection = await databases.createCollection(
      APPWRITE_DATABASE_ID,
      'cost_factor_versions',
      '成本因子版本管理'
    );

    console.log('✅ Collection创建成功:', collection.$id);

    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'cost_factor_versions', 'version', 20, true);
    await databases.createDatetimeAttribute(APPWRITE_DATABASE_ID, 'cost_factor_versions', 'effective_date', true);
    await databases.createBooleanAttribute(APPWRITE_DATABASE_ID, 'cost_factor_versions', 'is_current', true, true);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, 'cost_factor_versions', 'changelog', 5000, false);

    console.log('✅ 字段创建成功（4个）');

    // 创建索引
    await databases.createIndex(
      APPWRITE_DATABASE_ID,
      'cost_factor_versions',
      'idx_version',
      'unique' as any,
      ['version'],
      ['ASC'] as any
    );

    console.log('✅ 索引创建成功');

    return true;
  } catch (error: any) {
    if (error.code === 409) {
      console.log('⚠️ Collection已存在，跳过创建');
      return true;
    }
    console.error('❌ 创建失败:', error.message);
    return false;
  }
}

// ========================================
// 主函数
// ========================================

async function main() {
  console.log('🚀 开始创建Appwrite数据库架构 - MVP 2.0');
  console.log('='.repeat(50));
  console.log(`Endpoint: ${APPWRITE_ENDPOINT}`);
  console.log(`Project: ${APPWRITE_PROJECT}`);
  console.log(`Database: ${APPWRITE_DATABASE_ID}`);
  console.log('='.repeat(50));

  const results = await Promise.all([
    createCostFactorsCollection(),
    createProjectsCollection(),
    createCalculationsCollection(),
    createCostFactorVersionsCollection(),
  ]);

  const successCount = results.filter(r => r).length;

  console.log('\n' + '='.repeat(50));
  console.log(`✅ 完成！成功创建 ${successCount}/4 个Collections`);
  console.log('='.repeat(50));

  if (successCount === 4) {
    console.log('\n🎉 数据库架构创建完成！');
    console.log('\n下一步：');
    console.log('1. 运行数据导入脚本：npx tsx scripts/import-data.ts');
    console.log('2. 启动开发服务器：npm run dev');
  } else {
    console.log('\n⚠️ 部分Collections创建失败，请检查错误信息');
    process.exit(1);
  }
}

main().catch(console.error);

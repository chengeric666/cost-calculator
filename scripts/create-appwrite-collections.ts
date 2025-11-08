/**
 * Appwrite Collections创建脚本
 *
 * 自动创建MVP 2.0所需的4个Collection：
 * 1. cost_factors（成本因子库）
 * 2. projects（项目）
 * 3. calculations（计算记录）
 * 4. cost_factor_versions（版本管理）
 *
 * 使用方法：
 * ```bash
 * npx tsx scripts/create-appwrite-collections.ts
 * ```
 *
 * @requires node-appwrite
 * @requires dotenv
 */

import { Client, Databases, ID } from 'node-appwrite';
import * as dotenv from 'dotenv';
import * as path from 'path';

// 加载环境变量
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// ============================================
// 配置
// ============================================

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://apps.aotsea.com/v1';
const APPWRITE_PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT || '';
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || '';
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE || '';

// ============================================
// 初始化Appwrite客户端
// ============================================

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

// ============================================
// Collection创建函数
// ============================================

/**
 * 创建cost_factors Collection
 */
async function createCostFactorsCollection() {
  console.log('\n📊 创建cost_factors Collection...');

  try {
    const collectionId = 'cost_factors';

    // 创建Collection
    const collection = await databases.createCollection(
      APPWRITE_DATABASE_ID,
      collectionId,
      '成本因子库（19国M1-M8数据）',
      []  // 权限稍后设置
    );

    console.log('✅ Collection创建成功:', collection.$id);

    // 创建属性（分批创建，避免超时）
    console.log('⏳ 创建属性中...');

    // 基础字段
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'country', 10, true);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'country_name_cn', 50, true);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'country_flag', 10, false);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'industry', 50, true, 'pet_food');
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'version', 20, true, '2025Q1');

    // M1字段（16个）
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm1_regulatory_agency', 200, false);
    await databases.createBooleanAttribute(APPWRITE_DATABASE_ID, collectionId, 'm1_pre_approval_required', false, false);
    await databases.createBooleanAttribute(APPWRITE_DATABASE_ID, collectionId, 'm1_registration_required', false, false);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm1_complexity', 20, false);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm1_company_registration_usd', false);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm1_business_license_usd', false);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm1_legal_consulting_usd', false);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm1_tax_registration_usd', false);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm1_estimated_cost_usd', false);
    await databases.createIntegerAttribute(APPWRITE_DATABASE_ID, collectionId, 'm1_timeline_days_min', false);
    await databases.createIntegerAttribute(APPWRITE_DATABASE_ID, collectionId, 'm1_timeline_days_max', false);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm1_key_documents', 500, false);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm1_notes', 1000, false);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm1_data_source', 50, false, 'tier3_estimated');
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm1_data_updated_at', 50, false);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm1_reference_url', 500, false);

    console.log('✅ M1字段创建完成');

    // M2字段（12个）
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm2_certifications_required', 500, false);
    await databases.createBooleanAttribute(APPWRITE_DATABASE_ID, collectionId, 'm2_fda_required', false, false);
    await databases.createBooleanAttribute(APPWRITE_DATABASE_ID, collectionId, 'm2_ce_required', false, false);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm2_trademark_registration_usd', false);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm2_patent_filing_usd', false);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm2_estimated_cost_usd', false);
    await databases.createIntegerAttribute(APPWRITE_DATABASE_ID, collectionId, 'm2_timeline_days_min', false);
    await databases.createIntegerAttribute(APPWRITE_DATABASE_ID, collectionId, 'm2_timeline_days_max', false);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm2_notes', 1000, false);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm2_data_source', 50, false, 'tier3_estimated');
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm2_data_updated_at', 50, false);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm2_reference_url', 500, false);

    console.log('✅ M2字段创建完成');

    // M3字段（10个）
    await databases.createBooleanAttribute(APPWRITE_DATABASE_ID, collectionId, 'm3_packaging_localization_required', false, false);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm3_packaging_rate', false, 0.02);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm3_warehouse_deposit_usd', false);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm3_equipment_purchase_usd', false);
    await databases.createIntegerAttribute(APPWRITE_DATABASE_ID, collectionId, 'm3_initial_inventory_units', false);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm3_system_setup_usd', false);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm3_estimated_cost_usd', false);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm3_notes', 1000, false);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm3_data_source', 50, false, 'tier2_authoritative');
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm3_data_updated_at', 50, false);

    console.log('✅ M3字段创建完成');

    // M4字段（32个）
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm4_hs_code', 20, false, '2309.10.00');
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm4_base_tariff_rate', false);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm4_effective_tariff_rate', true, 0);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm4_tariff_notes', 500, false);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm4_tariff_data_source', 50, false, 'tier1_official');
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm4_tariff_updated_at', 50, false);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm4_tariff_reference_url', 500, false);

    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm4_vat_rate', true, 0);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm4_vat_notes', 500, false);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm4_vat_data_source', 50, false, 'tier1_official');
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm4_vat_updated_at', 50, false);

    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm4_excise_tax_rate', false);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm4_excise_tax_notes', 500, false);

    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm4_logistics', 2000, false); // JSON字段

    console.log('✅ M4字段创建完成');

    // M5字段（9个）
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm5_last_mile_delivery_usd', false);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm5_fba_fee_usd', false);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm5_warehouse_fee_usd_per_month', false);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm5_return_rate', false, 0.10);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm5_return_cost_rate', false, 0.30);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm5_notes', 1000, false);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm5_data_source', 50, false, 'tier2_authoritative');
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm5_data_updated_at', 50, false);

    console.log('✅ M5字段创建完成');

    // M6字段（9个）
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm6_marketing_rate', false, 0.15);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm6_avg_cac_usd', false);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm6_platform_ads_rate', false);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm6_influencer_rate', false);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm6_notes', 1000, false);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm6_data_source', 50, false, 'tier2_authoritative');
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm6_data_updated_at', 50, false);

    console.log('✅ M6字段创建完成');

    // M7字段（10个）
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm7_payment_rate', false, 0.029);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm7_payment_fixed_usd', false, 0.30);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm7_platform_commission_rate', false);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm7_currency_conversion_rate', false);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm7_chargeback_rate', false);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm7_notes', 1000, false);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm7_data_source', 50, false, 'tier1_official');
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm7_data_updated_at', 50, false);

    console.log('✅ M7字段创建完成');

    // M8字段（9个）
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm8_ga_rate', false, 0.03);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm8_customer_service_rate', false);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm8_software_subscription_usd_per_month', false);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'm8_office_rent_usd_per_month', false);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm8_notes', 1000, false);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm8_data_source', 50, false, 'tier2_authoritative');
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'm8_data_updated_at', 50, false);

    console.log('✅ M8字段创建完成');

    // 创建索引
    console.log('⏳ 创建索引中...');

    await databases.createIndex(
      APPWRITE_DATABASE_ID,
      collectionId,
      'idx_country',
      'key',
      ['country'],
      ['ASC']
    );

    await databases.createIndex(
      APPWRITE_DATABASE_ID,
      collectionId,
      'idx_country_industry_version',
      'unique',
      ['country', 'industry', 'version'],
      ['ASC', 'ASC', 'ASC']
    );

    console.log('✅ 索引创建完成');
    console.log('🎉 cost_factors Collection创建完成！\n');

    return collection.$id;
  } catch (error: any) {
    console.error('❌ 创建cost_factors Collection失败:', error.message);
    throw error;
  }
}

/**
 * 创建projects Collection（更新为MVP 2.0版本）
 */
async function createProjectsCollection() {
  console.log('\n📁 创建projects Collection...');

  try {
    const collectionId = 'projects';

    // 检查Collection是否已存在
    try {
      await databases.getCollection(APPWRITE_DATABASE_ID, collectionId);
      console.log('⚠️  Collection已存在，跳过创建');
      return collectionId;
    } catch (error) {
      // Collection不存在，继续创建
    }

    // 创建Collection
    const collection = await databases.createCollection(
      APPWRITE_DATABASE_ID,
      collectionId,
      '用户项目',
      []
    );

    console.log('✅ Collection创建成功:', collection.$id);

    // 创建属性
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'userId', 255, true, 'anonymous');
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'name', 255, true);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'industry', 50, true);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'targetCountry', 10, true);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'salesChannel', 50, true);

    // 创建索引
    await databases.createIndex(
      APPWRITE_DATABASE_ID,
      collectionId,
      'idx_userId',
      'key',
      ['userId'],
      ['ASC']
    );

    console.log('🎉 projects Collection创建完成！\n');

    return collection.$id;
  } catch (error: any) {
    console.error('❌ 创建projects Collection失败:', error.message);
    throw error;
  }
}

/**
 * 创建calculations Collection（更新为MVP 2.0版本）
 */
async function createCalculationsCollection() {
  console.log('\n📊 创建calculations Collection...');

  try {
    const collectionId = 'calculations';

    // 检查Collection是否已存在
    try {
      await databases.getCollection(APPWRITE_DATABASE_ID, collectionId);
      console.log('⚠️  Collection已存在，跳过创建');
      return collectionId;
    } catch (error) {
      // Collection不存在，继续创建
    }

    // 创建Collection
    const collection = await databases.createCollection(
      APPWRITE_DATABASE_ID,
      collectionId,
      '成本计算记录',
      []
    );

    console.log('✅ Collection创建成功:', collection.$id);

    // 创建属性
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'projectId', 255, true);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'scope', 10000, true); // JSON
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'costResult', 10000, true); // JSON
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'userOverrides', 10000, false); // JSON，用户覆盖值
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'version', 20, true, '2.0');

    // 创建索引
    await databases.createIndex(
      APPWRITE_DATABASE_ID,
      collectionId,
      'idx_projectId',
      'key',
      ['projectId'],
      ['ASC']
    );

    console.log('🎉 calculations Collection创建完成！\n');

    return collection.$id;
  } catch (error: any) {
    console.error('❌ 创建calculations Collection失败:', error.message);
    throw error;
  }
}

/**
 * 创建cost_factor_versions Collection
 */
async function createCostFactorVersionsCollection() {
  console.log('\n📜 创建cost_factor_versions Collection...');

  try {
    const collectionId = 'cost_factor_versions';

    // 创建Collection
    const collection = await databases.createCollection(
      APPWRITE_DATABASE_ID,
      collectionId,
      '成本因子版本管理',
      []
    );

    console.log('✅ Collection创建成功:', collection.$id);

    // 创建属性
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'version', 20, true);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'release_date', 50, true);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'changelog', 5000, false); // Markdown格式
    await databases.createIntegerAttribute(APPWRITE_DATABASE_ID, collectionId, 'countries_count', true, 19);
    await databases.createFloatAttribute(APPWRITE_DATABASE_ID, collectionId, 'data_completeness', true, 85.0);
    await databases.createStringAttribute(APPWRITE_DATABASE_ID, collectionId, 'notes', 1000, false);

    // 创建索引
    await databases.createIndex(
      APPWRITE_DATABASE_ID,
      collectionId,
      'idx_version',
      'unique',
      ['version'],
      ['ASC']
    );

    console.log('🎉 cost_factor_versions Collection创建完成！\n');

    return collection.$id;
  } catch (error: any) {
    console.error('❌ 创建cost_factor_versions Collection失败:', error.message);
    throw error;
  }
}

// ============================================
// 主函数
// ============================================

async function main() {
  console.log('🚀 开始创建Appwrite Collections...\n');
  console.log(`📍 Endpoint: ${APPWRITE_ENDPOINT}`);
  console.log(`📍 Project: ${APPWRITE_PROJECT}`);
  console.log(`📍 Database: ${APPWRITE_DATABASE_ID}\n`);

  // 验证配置
  if (!APPWRITE_API_KEY) {
    console.error('❌ 错误: APPWRITE_API_KEY未设置');
    console.error('请在.env.local中配置APPWRITE_API_KEY');
    process.exit(1);
  }

  try {
    // 按顺序创建Collections
    await createCostFactorsCollection();
    await createProjectsCollection();
    await createCalculationsCollection();
    await createCostFactorVersionsCollection();

    console.log('\n✅ 所有Collections创建完成！');
    console.log('\n📝 下一步：');
    console.log('   1. 运行数据导入脚本：npx tsx scripts/import-cost-data.ts');
    console.log('   2. 验证数据导入：检查Appwrite Console');
    console.log('   3. 开始开发MVP 2.0界面\n');
  } catch (error: any) {
    console.error('\n❌ 创建Collections失败:', error.message);
    process.exit(1);
  }
}

// 运行主函数
main();

#!/usr/bin/env tsx
/**
 * 8个开放市场Vape数据导入脚本（过滤版）
 *
 * 只导入Appwrite数据库schema中已定义的38个核心字段
 * 过滤掉未定义的字段以避免"Unknown attribute"错误
 *
 * 核心38字段：
 * - 基础5字段：country, country_name_cn, country_flag, industry, version
 * - M1-M8各模块的核心字段
 */

import { config } from 'dotenv';
import { Client, Databases, ID, Query } from 'node-appwrite';
import fs from 'fs';
import path from 'path';

config({ path: '.env.local' });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;

// 8个开放市场国家
const VAPE_COUNTRIES = ['US', 'ID', 'PH', 'CA', 'AE', 'SA', 'IT', 'ES'];

// Appwrite数据库schema中实际存在的88个字段（从check-database-schema.ts查询得到）
const ALLOWED_FIELDS = new Set([
  // BASE字段（5个）
  'country',
  'country_flag',
  'country_name_cn',
  'industry',
  'version',
  // M1字段（12个）
  'm1_business_license_usd',
  'm1_company_registration_usd',
  'm1_complexity',
  'm1_data_source',
  'm1_industry_data_source',
  'm1_industry_license_usd',
  'm1_industry_tier',
  'm1_legal_consulting_usd',
  'm1_notes',
  'm1_tax_registration_usd',
  'm1_tier',
  'm1_total_capex_usd',
  // M2字段（12个）
  'm2_complexity',
  'm2_compliance_testing_usd',
  'm2_data_source',
  'm2_notes',
  'm2_product_certification_data_source',
  'm2_product_certification_tier',
  'm2_product_certification_usd',
  'm2_tier',
  'm2_total_capex_usd',
  'm2_trademark_data_source',
  'm2_trademark_registration_usd',
  'm2_trademark_tier',
  // M3字段（7个）
  'm3_data_source',
  'm3_initial_inventory_usd',
  'm3_notes',
  'm3_system_setup_usd',
  'm3_tier',
  'm3_total_capex_usd',
  'm3_warehouse_deposit_usd',
  // M4字段（17个）
  'm4_collected_at',
  'm4_effective_tariff_rate',
  'm4_hs_code',
  'm4_import_tax_usd',
  'm4_logistics',
  'm4_logistics_data_source',
  'm4_logistics_tier',
  'm4_tariff_data_source',
  'm4_tariff_notes',
  'm4_tariff_tier',
  'm4_tariff_updated_at',
  'm4_tier',
  'm4_vat_data_source',
  'm4_vat_notes',
  'm4_vat_rate',
  'm4_vat_tier',
  'm4_vat_updated_at',
  // M5字段（11个）
  'm5_collected_at',
  'm5_data_source',
  'm5_delivery_cost_usd',
  'm5_fba_fee_usd',
  'm5_international_shipping_usd',
  'm5_last_mile_delivery_usd',
  'm5_notes',
  'm5_return_cost_rate',
  'm5_return_rate',
  'm5_tier',
  'm5_total_logistics_usd',
  // M6字段（7个）
  'm6_cac_usd',
  'm6_collected_at',
  'm6_data_source',
  'm6_marketing_rate',
  'm6_notes',
  'm6_platform_commission_rate',
  'm6_tier',
  // M7字段（7个）
  'm7_collected_at',
  'm7_data_source',
  'm7_notes',
  'm7_payment_gateway_rate',
  'm7_payment_rate',
  'm7_platform_commission_rate',
  'm7_tier',
  // M8字段（6个）
  'm8_collected_at',
  'm8_customer_service_usd',
  'm8_data_source',
  'm8_ga_rate',
  'm8_notes',
  'm8_tier',
  // OTHER字段（4个）
  'collected_at',
  'collected_by',
  'next_update_due',
  'verified_at',
]);

/**
 * 过滤数据，只保留已定义的字段
 */
function filterAllowedFields(data: any): any {
  const filtered: any = {};
  for (const key of Object.keys(data)) {
    if (ALLOWED_FIELDS.has(key)) {
      filtered[key] = data[key];
    }
  }
  return filtered;
}

/**
 * 读取TypeScript数据文件并提取导出的对象
 */
async function readTSDataFile(filePath: string): Promise<any> {
  const { default: data, ...namedExports } = await import(filePath);
  const exportedData = Object.values(namedExports)[0];
  return exportedData || data;
}

/**
 * 导入单个国家的vape数据（过滤版）
 */
async function importCountryVapeDataFiltered(countryCode: string) {
  console.log(`\n📝 处理 ${countryCode}-vape...`);

  const mergedDataPath = path.join(
    process.cwd(),
    'data/cost-factors',
    `${countryCode}-vape.ts`
  );

  if (!fs.existsSync(mergedDataPath)) {
    console.log(`⚠️  ${countryCode}: vape数据文件不存在，跳过`);
    return { success: false, reason: 'file_not_found' };
  }

  try {
    // 读取合并数据
    const mergedData = await readTSDataFile(mergedDataPath);
    console.log(`   ✅ 读取文件成功（原始${Object.keys(mergedData || {}).length}字段）`);

    // 过滤只保留已定义字段
    const filteredData = filterAllowedFields(mergedData);
    console.log(`   ✅ 过滤后保留${Object.keys(filteredData).length}个核心字段`);

    // 确保industry字段是'vape'
    filteredData.industry = 'vape';

    // 导入到cost_factors
    const existing = await databases.listDocuments(DB_ID, 'cost_factors', [
      Query.equal('country', [countryCode]),
      Query.equal('industry', ['vape']),
    ]);

    let costFactorId: string;
    if (existing.total > 0) {
      costFactorId = existing.documents[0].$id;
      await databases.updateDocument(DB_ID, 'cost_factors', costFactorId, filteredData);
      console.log(`   ✅ 更新cost_factors成功 (${costFactorId})`);
    } else {
      const result = await databases.createDocument(
        DB_ID,
        'cost_factors',
        ID.unique(),
        filteredData
      );
      costFactorId = result.$id;
      console.log(`   ✅ 创建cost_factors成功 (${costFactorId})`);
    }

    return { success: true, costFactorId };
  } catch (error: any) {
    console.error(`   ❌ ${countryCode}: 导入失败 - ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║   8国Vape数据导入（过滤版-38核心字段）        ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log('\n⚠️  当前数据库schema只有38个核心字段');
  console.log('   完整数据（115-148字段）将在未来扩展后导入');
  console.log('   本次只导入38个核心字段到Appwrite\n');

  const results = {
    success: 0,
    failed: 0,
  };

  for (const country of VAPE_COUNTRIES) {
    const result = await importCountryVapeDataFiltered(country);
    if (result.success) {
      results.success++;
    } else {
      results.failed++;
    }
    // 等待300ms避免Appwrite限流
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║   导入完成                                     ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log(`\n✅ 成功: ${results.success}/${VAPE_COUNTRIES.length} 个国家`);
  console.log(`❌ 失败: ${results.failed}/${VAPE_COUNTRIES.length} 个国家`);
  console.log('\n📊 下一步：');
  console.log('   1. ✅ 完成38个核心字段导入');
  console.log('   2. ⏳ 未来扩展数据库schema到127字段');
  console.log('   3. ⏳ 重新导入完整数据');
  console.log('\n✅ 8国vape核心数据导入完成！\n');
}

main().catch((error) => {
  console.error('❌ 导入失败:', error);
  process.exit(1);
});

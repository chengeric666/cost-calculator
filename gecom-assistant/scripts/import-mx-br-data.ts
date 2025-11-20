#!/usr/bin/env tsx
/**
 * MX/BR Pet Food数据导入脚本
 *
 * 目的：导入墨西哥和巴西的宠物食品成本数据到Appwrite
 * 策略：复用现有88字段schema，只导入核心字段
 */

import { config } from 'dotenv';
import { Client, Databases } from 'node-appwrite';

config({ path: '.env.local' });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
const COLLECTION_ID = 'cost_factors';

async function importCountryData(country: string) {
  console.log(`\n📝 导入 ${country} pet_food数据...`);

  try {
    // 动态导入数据文件
    const dataModule = await import(`../data/cost-factors/${country}-pet-food.ts`);
    const countryData = dataModule[`${country}_PET_FOOD`];

    if (!countryData) {
      throw new Error(`数据文件中未找到 ${country}_PET_FOOD 导出`);
    }

    console.log(`   ✅ 读取数据成功（${Object.keys(countryData).length}字段）`);

    // 过滤出核心88字段（Appwrite schema已有字段）
    const coreFields = extractCoreFields(countryData);
    console.log(`   ✅ 过滤核心字段（${Object.keys(coreFields).length}字段）`);

    // 检查是否已存在
    const existingDocs = await databases.listDocuments(DB_ID, COLLECTION_ID, [
      // 使用Query来过滤
    ]);

    const exists = existingDocs.documents.find(
      (doc: any) => doc.country === country && doc.industry === 'pet_food'
    );

    if (exists) {
      console.log(`   ⚠️  ${country} pet_food数据已存在，跳过导入`);
      return { success: true, skipped: true };
    }

    // 创建文档
    const docId = `${country.toLowerCase()}-pet-food-2025q1`;
    await databases.createDocument(DB_ID, COLLECTION_ID, docId, coreFields);

    console.log(`   ✅ 导入成功：${docId}`);
    return { success: true, skipped: false };

  } catch (error: any) {
    console.error(`   ❌ 导入失败：${error.message}`);
    return { success: false, error: error.message };
  }
}

function extractCoreFields(fullData: any): any {
  // 核心88字段（从analyze-pet-completeness.ts的CORE_FIELDS）
  const CORE_FIELDS = new Set([
    // BASE字段
    'country', 'country_flag', 'country_name_cn', 'industry', 'version',
    // M1字段
    'm1_business_license_usd', 'm1_company_registration_usd', 'm1_complexity',
    'm1_data_source', 'm1_industry_data_source', 'm1_industry_license_usd',
    'm1_industry_tier', 'm1_legal_consulting_usd', 'm1_notes',
    'm1_tax_registration_usd', 'm1_tier', 'm1_total_capex_usd',
    // M2字段
    'm2_complexity', 'm2_compliance_testing_usd', 'm2_data_source',
    'm2_notes', 'm2_product_certification_data_source',
    'm2_product_certification_tier', 'm2_product_certification_usd',
    'm2_tier', 'm2_total_capex_usd', 'm2_trademark_data_source',
    'm2_trademark_registration_usd', 'm2_trademark_tier',
    // M3字段
    'm3_data_source', 'm3_initial_inventory_usd', 'm3_notes',
    'm3_system_setup_usd', 'm3_tier', 'm3_total_capex_usd',
    'm3_warehouse_deposit_usd',
    // M4字段
    'm4_collected_at', 'm4_effective_tariff_rate', 'm4_hs_code',
    'm4_import_tax_usd', 'm4_logistics', 'm4_logistics_data_source',
    'm4_logistics_tier', 'm4_tariff_data_source', 'm4_tariff_notes',
    'm4_tariff_tier', 'm4_tariff_updated_at', 'm4_tier',
    'm4_vat_data_source', 'm4_vat_notes', 'm4_vat_rate',
    'm4_vat_tier', 'm4_vat_updated_at',
    // M5字段
    'm5_collected_at', 'm5_data_source', 'm5_delivery_cost_usd',
    'm5_fba_fee_usd', 'm5_international_shipping_usd',
    'm5_last_mile_delivery_usd', 'm5_notes', 'm5_return_cost_rate',
    'm5_return_rate', 'm5_tier', 'm5_total_logistics_usd',
    // M6字段
    'm6_cac_usd', 'm6_collected_at', 'm6_data_source',
    'm6_marketing_rate', 'm6_notes', 'm6_platform_commission_rate',
    'm6_tier',
    // M7字段
    'm7_collected_at', 'm7_data_source', 'm7_notes',
    'm7_payment_gateway_rate', 'm7_payment_rate',
    'm7_platform_commission_rate', 'm7_tier',
    // M8字段
    'm8_collected_at', 'm8_customer_service_usd', 'm8_data_source',
    'm8_ga_rate', 'm8_notes', 'm8_tier',
    // OTHER字段
    'collected_at', 'collected_by', 'next_update_due', 'verified_at',
  ]);

  const coreData: any = {};
  for (const [key, value] of Object.entries(fullData)) {
    if (CORE_FIELDS.has(key)) {
      // 处理JSON对象（如m4_logistics）
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        coreData[key] = JSON.stringify(value);
      } else {
        coreData[key] = value;
      }
    }
  }

  return coreData;
}

async function main() {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║   MX/BR Pet Food数据导入                       ║');
  console.log('╚════════════════════════════════════════════════╝');

  const countries = ['MX', 'BR'];
  const results = {
    success: 0,
    skipped: 0,
    failed: 0,
  };

  for (const country of countries) {
    const result = await importCountryData(country);
    if (result.success) {
      if (result.skipped) {
        results.skipped++;
      } else {
        results.success++;
      }
    } else {
      results.failed++;
    }
  }

  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║   导入完成                                     ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log(`\n✅ 成功: ${results.success}/2`);
  console.log(`⏭️  跳过: ${results.skipped}/2`);
  console.log(`❌ 失败: ${results.failed}/2`);
  console.log('\n✅ MX/BR数据导入完成！\n');
}

main().catch((error) => {
  console.error('❌ 导入失败:', error);
  process.exit(1);
});

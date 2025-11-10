#!/usr/bin/env tsx
/**
 * Pet Food扩展数据导出脚本
 *
 * 目的：将本地TypeScript文件中的71个扩展字段导出为JSON文件
 * 解决：Appwrite仅存储88核心字段，本地有144字段的数据完整性问题
 *
 * 策略：三层数据架构
 * - Layer 1: TypeScript源文件 (144字段) - Git版本控制
 * - Layer 2: Appwrite数据库 (88字段) - 生产环境核心计算
 * - Layer 3: JSON扩展文件 (71字段) - 静态资源，按需加载
 *
 * 使用：npm run export:pet-extended
 */

import fs from 'fs';
import path from 'path';

// 19个国家（所有pet_food数据）
const PET_COUNTRIES = [
  'US', 'CA', 'UK', 'DE', 'FR', 'IT', 'ES', 'JP', 'KR',
  'AU', 'SG', 'MY', 'TH', 'ID', 'PH', 'VN', 'IN', 'AE', 'SA'
];

// Appwrite数据库schema中实际存在的88个字段（从analyze-pet-completeness.ts查询得到）
const CORE_FIELDS = new Set([
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
 * 过滤数据，只保留扩展字段（非核心字段）
 */
function extractExtendedFields(fullData: any): any {
  const extendedData: any = {
    _metadata: {
      source_file: fullData.country + '-pet-food.ts',
      total_fields: 0,
      core_fields: 0,
      extended_fields: 0,
      exported_at: new Date().toISOString(),
    },
  };

  let coreCount = 0;
  let extendedCount = 0;

  for (const [key, value] of Object.entries(fullData)) {
    if (CORE_FIELDS.has(key)) {
      coreCount++;
    } else {
      // 这是扩展字段，需要导出
      extendedData[key] = value;
      extendedCount++;
    }
  }

  extendedData._metadata.total_fields = Object.keys(fullData).length;
  extendedData._metadata.core_fields = coreCount;
  extendedData._metadata.extended_fields = extendedCount;

  return extendedData;
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
 * 导出单个国家的pet扩展数据
 */
async function exportCountryPetExtendedData(countryCode: string) {
  console.log(`\n📝 处理 ${countryCode}-pet-food...`);

  const petFilePath = path.join(
    process.cwd(),
    'data/cost-factors',
    `${countryCode}-pet-food.ts`
  );

  if (!fs.existsSync(petFilePath)) {
    console.log(`   ⚠️  ${countryCode}: pet-food数据文件不存在，跳过`);
    return { success: false, reason: 'file_not_found' };
  }

  try {
    // 读取完整数据
    const fullData = await readTSDataFile(petFilePath);
    console.log(`   ✅ 读取文件成功（原始${Object.keys(fullData || {}).length}字段）`);

    // 提取扩展字段
    const extendedData = extractExtendedFields(fullData);
    console.log(`   ✅ 提取扩展字段（${extendedData._metadata.extended_fields}个）`);

    // 创建输出目录
    const outputDir = path.join(process.cwd(), 'public/data/pet-extended');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`   ✅ 创建输出目录: ${outputDir}`);
    }

    // 写入JSON文件
    const outputPath = path.join(outputDir, `${countryCode}-pet-extended.json`);
    fs.writeFileSync(outputPath, JSON.stringify(extendedData, null, 2));
    console.log(`   ✅ 导出成功: ${outputPath}`);
    console.log(`   📊 字段统计: 核心${extendedData._metadata.core_fields} + 扩展${extendedData._metadata.extended_fields} = 总计${extendedData._metadata.total_fields}`);

    return {
      success: true,
      extendedFields: extendedData._metadata.extended_fields,
      outputPath
    };
  } catch (error: any) {
    console.error(`   ❌ ${countryCode}: 导出失败 - ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║   Pet Food扩展数据导出（三层架构-Layer 3）    ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log('\n🎯 导出策略：');
  console.log('   Layer 1: TypeScript源文件 (144字段) - 单一真相来源');
  console.log('   Layer 2: Appwrite数据库 (88字段) - 核心计算查询');
  console.log('   Layer 3: JSON扩展文件 (71字段) - 详细数据按需加载\n');

  const results = {
    success: 0,
    failed: 0,
    totalExtendedFields: 0,
  };

  for (const country of PET_COUNTRIES) {
    const result = await exportCountryPetExtendedData(country);
    if (result.success) {
      results.success++;
      results.totalExtendedFields += result.extendedFields || 0;
    } else {
      results.failed++;
    }
  }

  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║   导出完成                                     ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log(`\n✅ 成功: ${results.success}/${PET_COUNTRIES.length} 个国家`);
  console.log(`❌ 失败: ${results.failed}/${PET_COUNTRIES.length} 个国家`);
  console.log(`📊 平均扩展字段: ${Math.round(results.totalExtendedFields / results.success)} 个/国`);
  console.log('\n📂 输出位置: public/data/pet-extended/');
  console.log('📝 使用方式: fetch(\`/data/pet-extended/\${country}-pet-extended.json\`)');
  console.log('\n✅ Pet Food扩展数据导出完成！\n');
}

main().catch((error) => {
  console.error('❌ 导出失败:', error);
  process.exit(1);
});

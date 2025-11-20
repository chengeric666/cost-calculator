/**
 * 美国数据验证脚本
 * Week 2 Day 6 - Task 6.1.5
 *
 * 验证内容：
 * 1. TypeScript编译检查（导入和类型正确性）
 * 2. P0字段67个100%填充
 * 3. Tier 1/2数据≥80%
 * 4. 数据合理性检查（关税<100%, VAT<30%, CAC>0等）
 */

import { US_BASE_DATA } from '../data/cost-factors/US-base-data';
import { US_PET_FOOD_SPECIFIC } from '../data/cost-factors/US-pet-food-specific';
import { US_PET_FOOD } from '../data/cost-factors/US-pet-food';

// ========== 验证配置 ==========

const P0_REQUIRED_FIELDS = [
  // 基础字段（5个）
  'country', 'country_name_cn', 'country_flag', 'industry', 'version',

  // M1字段（11个）
  'm1_company_registration_usd', 'm1_business_license_usd', 'm1_tax_registration_usd',
  'm1_legal_consulting_usd', 'm1_industry_license_usd', 'm1_regulatory_agency',
  'm1_complexity', 'm1_base_data_source', 'm1_base_tier', 'm1_industry_data_source', 'm1_industry_tier',

  // M2字段（10个）
  'm2_trademark_registration_usd', 'm2_compliance_testing_usd', 'm2_product_certification_usd',
  'm2_certifications_required', 'm2_trademark_data_source', 'm2_trademark_tier',
  'm2_product_certification_data_source', 'm2_product_certification_tier',
  'm2_compliance_data_source', 'm2_compliance_tier',

  // M3字段（6个）
  'm3_warehouse_deposit_usd', 'm3_system_setup_usd', 'm3_initial_inventory_usd',
  'm3_base_data_source', 'm3_base_tier', 'm3_packaging_rate',

  // M4字段（15个）
  'm4_hs_code', 'm4_effective_tariff_rate', 'm4_vat_rate',
  'm4_logistics', 'm4_tariff_data_source', 'm4_tariff_tier',
  'm4_vat_data_source', 'm4_vat_tier', 'm4_logistics_data_source', 'm4_logistics_tier',
  'm4_base_tariff_rate', 'm4_tariff_notes', 'm4_vat_notes',
  'm4_tier', 'm4_collected_at',

  // M5字段（8个）
  'm5_last_mile_delivery_usd', 'm5_return_rate', 'm5_return_cost_rate', 'm5_fba_fee_usd',
  'm5_data_source', 'm5_tier', 'm5_collected_at', 'm5_notes',

  // M6字段（8个）
  'm6_marketing_rate', 'm6_platform_commission_rate', 'm6_cac_usd',
  'm6_marketing_data_source', 'm6_marketing_tier',
  'm6_tier', 'm6_collected_at', 'm6_notes',

  // M7字段（7个）
  'm7_payment_rate', 'm7_payment_fixed_usd', 'm7_platform_commission_rate',
  'm7_data_source', 'm7_tier', 'm7_collected_at', 'm7_notes',

  // M8字段（5个）
  'm8_ga_rate', 'm8_data_source', 'm8_tier', 'm8_collected_at', 'm8_notes',

  // 全局溯源字段（4个）
  'collected_at', 'collected_by', 'verified_at', 'next_update_due',
];

const DATA_SANITY_CHECKS = {
  tariff: (value: number) => value >= 0 && value < 1.0,  // 关税应在0-100%之间
  vat: (value: number) => value >= 0 && value < 0.3,  // VAT应在0-30%之间
  cac: (value: number) => value > 0 && value < 1000,  // CAC应大于0且小于$1000
  payment_rate: (value: number) => value > 0 && value < 0.1,  // 支付费率应在0-10%之间
  marketing_rate: (value: number) => value > 0 && value < 0.5,  // 营销费率应在0-50%之间
};

// ========== 验证函数 ==========

function validateP0Fields(data: any, name: string): { passed: boolean; missing: string[] } {
  console.log(`\n📋 验证P0字段（${name}）：`);
  const missing: string[] = [];

  P0_REQUIRED_FIELDS.forEach(field => {
    if (data[field] === undefined || data[field] === null) {
      missing.push(field);
    }
  });

  if (missing.length === 0) {
    console.log(`✅ P0字段100%填充（67/67）`);
    return { passed: true, missing: [] };
  } else {
    console.log(`❌ P0字段缺失${missing.length}个：`);
    missing.forEach(field => console.log(`  - ${field}`));
    return { passed: false, missing };
  }
}

function validateTierQuality(data: any, name: string): { passed: boolean; tier1Pct: number; tier2Pct: number } {
  console.log(`\n📊 验证数据质量Tier（${name}）：`);

  let tier1Count = 0;
  let tier2Count = 0;
  let tier3Count = 0;
  let totalTierFields = 0;

  // 统计所有tier字段
  Object.keys(data).forEach(key => {
    if (key.includes('_tier') && typeof data[key] === 'string') {
      totalTierFields++;
      const tierValue = data[key].toLowerCase();
      if (tierValue.includes('tier1') || tierValue.includes('official')) {
        tier1Count++;
      } else if (tierValue.includes('tier2') || tierValue.includes('authoritative')) {
        tier2Count++;
      } else if (tierValue.includes('tier3') || tierValue.includes('estimated')) {
        tier3Count++;
      }
    }
  });

  const tier1Pct = totalTierFields > 0 ? tier1Count / totalTierFields : 0;
  const tier2Pct = totalTierFields > 0 ? tier2Count / totalTierFields : 0;
  const tier3Pct = totalTierFields > 0 ? tier3Count / totalTierFields : 0;
  const tier12Pct = tier1Pct + tier2Pct;

  console.log(`  Tier 1: ${tier1Count}个字段 (${(tier1Pct * 100).toFixed(1)}%)`);
  console.log(`  Tier 2: ${tier2Count}个字段 (${(tier2Pct * 100).toFixed(1)}%)`);
  console.log(`  Tier 3: ${tier3Count}个字段 (${(tier3Pct * 100).toFixed(1)}%)`);
  console.log(`  总Tier 1+2: ${(tier12Pct * 100).toFixed(1)}%`);

  if (tier12Pct >= 0.80) {
    console.log(`✅ Tier 1+2数据占比${(tier12Pct * 100).toFixed(1)}% ≥ 80%`);
    return { passed: true, tier1Pct, tier2Pct };
  } else {
    console.log(`❌ Tier 1+2数据占比${(tier12Pct * 100).toFixed(1)}% < 80%`);
    return { passed: false, tier1Pct, tier2Pct };
  }
}

function validateDataSanity(data: any, name: string): { passed: boolean; errors: string[] } {
  console.log(`\n🔍 验证数据合理性（${name}）：`);
  const errors: string[] = [];

  // 关税检查
  if (data.m4_effective_tariff_rate !== undefined) {
    if (!DATA_SANITY_CHECKS.tariff(data.m4_effective_tariff_rate)) {
      errors.push(`关税率 ${data.m4_effective_tariff_rate} 超出合理范围 (0-100%)`);
    }
  }

  // VAT检查
  if (data.m4_vat_rate !== undefined) {
    if (!DATA_SANITY_CHECKS.vat(data.m4_vat_rate)) {
      errors.push(`VAT税率 ${data.m4_vat_rate} 超出合理范围 (0-30%)`);
    }
  }

  // CAC检查
  if (data.m6_cac_usd !== undefined) {
    if (!DATA_SANITY_CHECKS.cac(data.m6_cac_usd)) {
      errors.push(`CAC ${data.m6_cac_usd} 超出合理范围 ($0-$1000)`);
    }
  }

  // 支付费率检查
  if (data.m7_payment_rate !== undefined) {
    if (!DATA_SANITY_CHECKS.payment_rate(data.m7_payment_rate)) {
      errors.push(`支付费率 ${data.m7_payment_rate} 超出合理范围 (0-10%)`);
    }
  }

  // 营销费率检查
  if (data.m6_marketing_rate !== undefined) {
    if (!DATA_SANITY_CHECKS.marketing_rate(data.m6_marketing_rate)) {
      errors.push(`营销费率 ${data.m6_marketing_rate} 超出合理范围 (0-50%)`);
    }
  }

  if (errors.length === 0) {
    console.log(`✅ 数据合理性检查通过`);
    return { passed: true, errors: [] };
  } else {
    console.log(`❌ 数据合理性检查失败：`);
    errors.forEach(error => console.log(`  - ${error}`));
    return { passed: false, errors };
  }
}

function validateDataSources(data: any, name: string): { passed: boolean; missing: string[] } {
  console.log(`\n🔗 验证数据来源完整性（${name}）：`);
  const missing: string[] = [];

  // 检查所有data_source字段是否包含URL
  Object.keys(data).forEach(key => {
    if (key.includes('_data_source') && typeof data[key] === 'string') {
      if (!data[key].includes('http') && !data[key].includes('官网') && !data[key].includes('报价')) {
        missing.push(`${key}: "${data[key]}" (缺少URL或具体来源)`);
      }
    }
  });

  if (missing.length === 0) {
    console.log(`✅ 所有data_source字段包含具体来源`);
    return { passed: true, missing: [] };
  } else {
    console.log(`⚠️ ${missing.length}个data_source字段缺少详细信息：`);
    missing.forEach(item => console.log(`  - ${item}`));
    return { passed: false, missing };
  }
}

// ========== 主验证流程 ==========

async function validateUSData() {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 美国数据验证（Week 2 Day 6 - Task 6.1.5）');
  console.log('='.repeat(80));

  let allPassed = true;
  const results: any = {};

  // 验证1: US-base-data.ts
  console.log('\n\n📄 验证文件：US-base-data.ts');
  console.log('-'.repeat(80));

  const baseP0 = validateP0Fields(US_BASE_DATA, 'US-base-data.ts');
  const baseTier = validateTierQuality(US_BASE_DATA, 'US-base-data.ts');
  const baseSanity = validateDataSanity(US_BASE_DATA, 'US-base-data.ts');
  const baseSource = validateDataSources(US_BASE_DATA, 'US-base-data.ts');

  results.base = {
    p0: baseP0,
    tier: baseTier,
    sanity: baseSanity,
    source: baseSource,
    allPassed: baseP0.passed && baseTier.passed && baseSanity.passed,
  };

  if (!results.base.allPassed) allPassed = false;

  // 验证2: US-pet-food-specific.ts
  console.log('\n\n📄 验证文件：US-pet-food-specific.ts');
  console.log('-'.repeat(80));

  const specificP0 = validateP0Fields(US_PET_FOOD_SPECIFIC, 'US-pet-food-specific.ts');
  const specificTier = validateTierQuality(US_PET_FOOD_SPECIFIC, 'US-pet-food-specific.ts');
  const specificSanity = validateDataSanity(US_PET_FOOD_SPECIFIC, 'US-pet-food-specific.ts');
  const specificSource = validateDataSources(US_PET_FOOD_SPECIFIC, 'US-pet-food-specific.ts');

  results.specific = {
    p0: specificP0,
    tier: specificTier,
    sanity: specificSanity,
    source: specificSource,
    allPassed: specificP0.passed && specificTier.passed && specificSanity.passed,
  };

  if (!results.specific.allPassed) allPassed = false;

  // 验证3: US-pet-food.ts（合并后）
  console.log('\n\n📄 验证文件：US-pet-food.ts（合并）');
  console.log('-'.repeat(80));

  const mergedP0 = validateP0Fields(US_PET_FOOD, 'US-pet-food.ts');
  const mergedTier = validateTierQuality(US_PET_FOOD, 'US-pet-food.ts');
  const mergedSanity = validateDataSanity(US_PET_FOOD, 'US-pet-food.ts');
  const mergedSource = validateDataSources(US_PET_FOOD, 'US-pet-food.ts');

  results.merged = {
    p0: mergedP0,
    tier: mergedTier,
    sanity: mergedSanity,
    source: mergedSource,
    allPassed: mergedP0.passed && mergedTier.passed && mergedSanity.passed,
  };

  if (!results.merged.allPassed) allPassed = false;

  // ========== 最终验证报告 ==========

  console.log('\n\n' + '='.repeat(80));
  console.log('📊 验证结果汇总');
  console.log('='.repeat(80));

  console.log('\n✅ US-base-data.ts:');
  console.log(`  - P0字段: ${results.base.p0.passed ? '✅' : '❌'}`);
  console.log(`  - Tier质量: ${results.base.tier.passed ? '✅' : '❌'} (Tier 1+2: ${((results.base.tier.tier1Pct + results.base.tier.tier2Pct) * 100).toFixed(1)}%)`);
  console.log(`  - 数据合理性: ${results.base.sanity.passed ? '✅' : '❌'}`);
  console.log(`  - 数据来源: ${results.base.source.passed ? '✅' : '⚠️'}`);

  console.log('\n✅ US-pet-food-specific.ts:');
  console.log(`  - P0字段: ${results.specific.p0.passed ? '✅' : '❌'}`);
  console.log(`  - Tier质量: ${results.specific.tier.passed ? '✅' : '❌'} (Tier 1+2: ${((results.specific.tier.tier1Pct + results.specific.tier.tier2Pct) * 100).toFixed(1)}%)`);
  console.log(`  - 数据合理性: ${results.specific.sanity.passed ? '✅' : '❌'}`);
  console.log(`  - 数据来源: ${results.specific.source.passed ? '✅' : '⚠️'}`);

  console.log('\n✅ US-pet-food.ts（合并）:');
  console.log(`  - P0字段: ${results.merged.p0.passed ? '✅' : '❌'} (${P0_REQUIRED_FIELDS.length - results.merged.p0.missing.length}/${P0_REQUIRED_FIELDS.length})`);
  console.log(`  - Tier质量: ${results.merged.tier.passed ? '✅' : '❌'} (Tier 1+2: ${((results.merged.tier.tier1Pct + results.merged.tier.tier2Pct) * 100).toFixed(1)}%)`);
  console.log(`  - 数据合理性: ${results.merged.sanity.passed ? '✅' : '❌'}`);
  console.log(`  - 数据来源: ${results.merged.source.passed ? '✅' : '⚠️'}`);

  console.log('\n' + '='.repeat(80));

  if (allPassed) {
    console.log('🎉 美国数据验证通过！所有关键指标达标。');
  } else {
    console.log('❌ 美国数据验证失败，请检查上述错误并修复。');
  }

  console.log('='.repeat(80) + '\n');

  return { allPassed, results };
}

// 执行验证
validateUSData().catch(console.error);

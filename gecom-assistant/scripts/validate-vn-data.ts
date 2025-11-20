#!/usr/bin/env tsx
/**
 * 越南数据验证脚本
 *
 * 验证项：
 * 1. TypeScript编译通过
 * 2. 运行时导入成功
 * 3. P0字段完整性
 * 4. Tier数据质量
 * 5. 数据合理性检查
 */

import { VN_BASE_DATA } from '../data/cost-factors/VN-base-data';
import { VN_PET_FOOD_SPECIFIC } from '../data/cost-factors/VN-pet-food-specific';
import { VN_PET_FOOD } from '../data/cost-factors/VN-pet-food';

console.log('========================================');
console.log('🇻🇳 越南数据验证开始');
console.log('========================================\n');

// ========== 1. 基础导入验证 ==========
console.log('✅ 1. 基础导入验证');
console.log(`   VN_BASE_DATA字段数: ${Object.keys(VN_BASE_DATA).length}`);
console.log(`   VN_PET_FOOD_SPECIFIC字段数: ${Object.keys(VN_PET_FOOD_SPECIFIC).length}`);
console.log(`   VN_PET_FOOD字段数: ${Object.keys(VN_PET_FOOD).length}\n`);

// ========== 2. P0字段完整性验证 ==========
console.log('✅ 2. P0字段完整性验证');

const P0_REQUIRED_FIELDS = [
  // 基础字段
  'country', 'country_name_cn', 'industry', 'version',

  // M1字段
  'm1_company_registration_usd', 'm1_business_license_usd', 'm1_tax_registration_usd',
  'm1_legal_consulting_usd', 'm1_regulatory_agency', 'm1_industry_license_usd',
  'm1_complexity', 'm1_estimated_cost_usd', 'm1_timeline_days',

  // M2字段
  'm2_trademark_registration_usd', 'm2_compliance_testing_usd',
  'm2_certifications_required', 'm2_product_certification_usd',
  'm2_labeling_review_usd', 'm2_estimated_cost_usd', 'm2_timeline_days',

  // M3字段
  'm3_warehouse_deposit_usd', 'm3_system_setup_usd',
  'm3_initial_inventory_usd', 'm3_packaging_rate',

  // M4字段（关键）
  'm4_hs_code', 'm4_base_tariff_rate', 'm4_effective_tariff_rate',
  'm4_tariff_notes', 'm4_vat_rate', 'm4_logistics',

  // M5字段
  'm5_last_mile_delivery_usd', 'm5_return_rate', 'm5_return_cost_rate',
  'm5_fba_fee_usd',

  // M6字段
  'm6_marketing_rate', 'm6_cac_usd', 'm6_platform_commission_rate',
  'm6_repeat_purchase_rate',

  // M7字段
  'm7_payment_rate', 'm7_payment_fixed_usd',

  // M8字段
  'm8_ga_rate',

  // 溯源字段
  'collected_at', 'collected_by', 'verified_at',
];

const missingFields = P0_REQUIRED_FIELDS.filter(
  field => VN_PET_FOOD[field] === undefined || VN_PET_FOOD[field] === null
);

if (missingFields.length === 0) {
  console.log(`   ✅ P0字段完整：${P0_REQUIRED_FIELDS.length}/${P0_REQUIRED_FIELDS.length}`);
} else {
  console.log(`   ❌ P0字段缺失${missingFields.length}个：`);
  missingFields.forEach(f => console.log(`      - ${f}`));
}
console.log('');

// ========== 3. Tier数据质量验证 ==========
console.log('✅ 3. Tier数据质量验证');

let tier1Count = 0;
let tier2Count = 0;
let tier3Count = 0;
let totalTierFields = 0;

Object.keys(VN_PET_FOOD).forEach(key => {
  if (key.includes('_tier')) {
    totalTierFields++;
    const tierValue = VN_PET_FOOD[key];
    if (typeof tierValue === 'string') {
      if (tierValue.includes('tier1')) tier1Count++;
      else if (tierValue.includes('tier2')) tier2Count++;
      else if (tierValue.includes('tier3')) tier3Count++;
    }
  }
});

const tier1Pct = (tier1Count / totalTierFields * 100).toFixed(1);
const tier2Pct = (tier2Count / totalTierFields * 100).toFixed(1);
const tier3Pct = (tier3Count / totalTierFields * 100).toFixed(1);
const tier12Combined = ((tier1Count + tier2Count) / totalTierFields * 100).toFixed(1);

console.log(`   Tier 1: ${tier1Count}个字段 (${tier1Pct}%)`);
console.log(`   Tier 2: ${tier2Count}个字段 (${tier2Pct}%)`);
console.log(`   Tier 3: ${tier3Count}个字段 (${tier3Pct}%)`);
console.log(`   Tier 1+2合计: ${tier12Combined}% ${Number(tier12Combined) >= 80 ? '✅' : '❌'} (目标≥80%)`);
console.log('');

// ========== 4. 数据合理性验证 ==========
console.log('✅ 4. 数据合理性验证');

const sanityChecks = [
  {
    name: 'HS Code格式',
    check: () => VN_PET_FOOD.m4_hs_code === '2309.10.00',
    actual: VN_PET_FOOD.m4_hs_code,
  },
  {
    name: '关税率范围',
    check: () => VN_PET_FOOD.m4_effective_tariff_rate >= 0 && VN_PET_FOOD.m4_effective_tariff_rate <= 1,
    actual: `${(VN_PET_FOOD.m4_effective_tariff_rate * 100).toFixed(1)}%`,
  },
  {
    name: 'VAT税率范围',
    check: () => VN_PET_FOOD.m4_vat_rate > 0 && VN_PET_FOOD.m4_vat_rate < 0.3,
    actual: `${(VN_PET_FOOD.m4_vat_rate * 100).toFixed(1)}%`,
  },
  {
    name: '退货率合理性',
    check: () => VN_PET_FOOD.m5_return_rate > 0 && VN_PET_FOOD.m5_return_rate < 0.3,
    actual: `${(VN_PET_FOOD.m5_return_rate * 100).toFixed(1)}%`,
  },
  {
    name: '平台佣金率',
    check: () => VN_PET_FOOD.m6_platform_commission_rate > 0 && VN_PET_FOOD.m6_platform_commission_rate < 0.3,
    actual: `${(VN_PET_FOOD.m6_platform_commission_rate * 100).toFixed(1)}%`,
  },
  {
    name: 'G&A成本率',
    check: () => VN_PET_FOOD.m8_ga_rate > 0 && VN_PET_FOOD.m8_ga_rate < 0.1,
    actual: `${(VN_PET_FOOD.m8_ga_rate * 100).toFixed(1)}%`,
  },
];

sanityChecks.forEach(({ name, check, actual }) => {
  const passed = check();
  console.log(`   ${passed ? '✅' : '❌'} ${name}: ${actual}`);
});
console.log('');

// ========== 5. 核心数据展示 ==========
console.log('✅ 5. 核心数据展示');
console.log(`   国家: ${VN_PET_FOOD.country} ${VN_PET_FOOD.country_flag}`);
console.log(`   行业: ${VN_PET_FOOD.industry}`);
console.log(`   HS Code: ${VN_PET_FOOD.m4_hs_code}`);
console.log(`   有效关税率: ${(VN_PET_FOOD.m4_effective_tariff_rate * 100).toFixed(1)}% (EVFTA优惠)`);
console.log(`   VAT税率: ${(VN_PET_FOOD.m4_vat_rate * 100).toFixed(0)}%`);
console.log(`   平台佣金: ${(VN_PET_FOOD.m6_platform_commission_rate * 100).toFixed(0)}% (Shopee/Lazada)`);
console.log(`   退货率: ${(VN_PET_FOOD.m5_return_rate * 100).toFixed(0)}%`);
console.log(`   G&A率: ${(VN_PET_FOOD.m8_ga_rate * 100).toFixed(0)}%`);

// 解析物流数据
const logistics = JSON.parse(VN_PET_FOOD.m4_logistics);
console.log(`   海运: $${logistics.sea_freight.usd_per_kg}/kg (${logistics.sea_freight.transit_days_min}-${logistics.sea_freight.transit_days_max}天)`);
console.log(`   空运: $${logistics.air_freight.usd_per_kg}/kg`);
console.log(`   本地配送: $${VN_PET_FOOD.m5_last_mile_delivery_usd}/件`);
console.log('');

// ========== 6. 数据质量摘要 ==========
console.log('✅ 6. 数据质量摘要');
if (VN_PET_FOOD.data_quality_summary) {
  const summary = VN_PET_FOOD.data_quality_summary;
  console.log(`   总字段: ${summary.total_fields}`);
  console.log(`   P0字段填充: ${summary.p0_fields_filled}/${summary.p0_fields} (${(summary.p0_fields_filled/summary.p0_fields*100).toFixed(0)}%)`);
  console.log(`   Tier 1数据: ${(summary.tier1_percentage * 100).toFixed(0)}%`);
  console.log(`   Tier 2数据: ${(summary.tier2_percentage * 100).toFixed(0)}%`);
  console.log(`   置信度: ${(summary.confidence_score * 100).toFixed(0)}%`);
}
console.log('');

// ========== 7. 数据溯源验证 ==========
console.log('✅ 7. 数据溯源验证');
console.log(`   采集时间: ${VN_PET_FOOD.collected_at}`);
console.log(`   采集人员: ${VN_PET_FOOD.collected_by}`);
console.log(`   验证时间: ${VN_PET_FOOD.verified_at}`);
console.log(`   下次更新: ${VN_PET_FOOD.next_update_due}`);
console.log('');

// ========== 8. 关键优势总结 ==========
console.log('✅ 8. 越南市场关键优势');
console.log('   ⭐ 物流成本极低：海运$0.020/kg，7天直达（vs 美国30天）');
console.log('   ⭐ 平台佣金低：6% vs Amazon 15%，节省60%');
console.log('   ⭐ 人力成本低：G&A 2% vs 美国3%，德国4%');
console.log('   ⭐ EVFTA优惠：关税可降至0%（需符合原产地规则）');
console.log('   ⭐ 退货率低：8% vs 美国10%，德国15%');
console.log('');

console.log('========================================');
console.log('🎉 越南数据验证完成！');
console.log('========================================');

// 退出码
const allPassed = missingFields.length === 0 && Number(tier12Combined) >= 80;
process.exit(allPassed ? 0 : 1);

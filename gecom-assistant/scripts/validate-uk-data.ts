#!/usr/bin/env tsx
/**
 * 英国数据验证脚本
 */

import { UK_BASE_DATA } from '../data/cost-factors/UK-base-data';
import { UK_PET_FOOD_SPECIFIC } from '../data/cost-factors/UK-pet-food-specific';
import { UK_PET_FOOD } from '../data/cost-factors/UK-pet-food';

console.log('========================================');
console.log('🇬🇧 英国数据验证开始');
console.log('========================================\n');

// 基础导入验证
console.log('✅ 1. 基础导入验证');
console.log(`   UK_BASE_DATA字段数: ${Object.keys(UK_BASE_DATA).length}`);
console.log(`   UK_PET_FOOD_SPECIFIC字段数: ${Object.keys(UK_PET_FOOD_SPECIFIC).length}`);
console.log(`   UK_PET_FOOD字段数: ${Object.keys(UK_PET_FOOD).length}\n`);

// P0字段完整性验证
console.log('✅ 2. P0字段完整性验证');
const P0_REQUIRED_FIELDS = [
  'country', 'country_name_cn', 'industry', 'version',
  'm1_company_registration_usd', 'm1_industry_license_usd', 'm1_complexity',
  'm2_trademark_registration_usd', 'm2_certifications_required',
  'm3_warehouse_deposit_usd', 'm3_initial_inventory_usd', 'm3_packaging_rate',
  'm4_hs_code', 'm4_effective_tariff_rate', 'm4_vat_rate', 'm4_logistics',
  'm5_last_mile_delivery_usd', 'm5_return_rate',
  'm6_marketing_rate', 'm6_platform_commission_rate',
  'm7_payment_rate', 'm8_ga_rate',
  'collected_at', 'collected_by', 'verified_at',
];

const missingFields = P0_REQUIRED_FIELDS.filter(
  field => UK_PET_FOOD[field] === undefined || UK_PET_FOOD[field] === null
);

if (missingFields.length === 0) {
  console.log(`   ✅ P0字段完整：${P0_REQUIRED_FIELDS.length}/${P0_REQUIRED_FIELDS.length}`);
} else {
  console.log(`   ❌ P0字段缺失${missingFields.length}个：`);
  missingFields.forEach(f => console.log(`      - ${f}`));
}
console.log('');

// Tier数据质量验证
console.log('✅ 3. Tier数据质量验证');
let tier1Count = 0, tier2Count = 0, tier3Count = 0, totalTierFields = 0;

Object.keys(UK_PET_FOOD).forEach(key => {
  if (key.includes('_tier')) {
    totalTierFields++;
    const tierValue = UK_PET_FOOD[key];
    if (typeof tierValue === 'string') {
      if (tierValue.includes('tier1')) tier1Count++;
      else if (tierValue.includes('tier2')) tier2Count++;
      else if (tierValue.includes('tier3')) tier3Count++;
    }
  }
});

const tier12Combined = ((tier1Count + tier2Count) / totalTierFields * 100).toFixed(1);
console.log(`   Tier 1: ${tier1Count}个字段 (${(tier1Count/totalTierFields*100).toFixed(1)}%)`);
console.log(`   Tier 2: ${tier2Count}个字段 (${(tier2Count/totalTierFields*100).toFixed(1)}%)`);
console.log(`   Tier 3: ${tier3Count}个字段 (${(tier3Count/totalTierFields*100).toFixed(1)}%)`);
console.log(`   Tier 1+2合计: ${tier12Combined}% ${Number(tier12Combined) >= 80 ? '✅' : '❌'} (目标≥80%)`);
console.log('');

// 数据合理性验证
console.log('✅ 4. 数据合理性验证');
const sanityChecks = [
  { name: 'HS Code格式', check: () => UK_PET_FOOD.m4_hs_code === '2309.10.00', actual: UK_PET_FOOD.m4_hs_code },
  { name: '关税率范围', check: () => UK_PET_FOOD.m4_effective_tariff_rate >= 0 && UK_PET_FOOD.m4_effective_tariff_rate <= 1, actual: `${(UK_PET_FOOD.m4_effective_tariff_rate * 100).toFixed(1)}%` },
  { name: 'VAT税率范围', check: () => UK_PET_FOOD.m4_vat_rate > 0 && UK_PET_FOOD.m4_vat_rate < 0.3, actual: `${(UK_PET_FOOD.m4_vat_rate * 100).toFixed(1)}%` },
  { name: '退货率合理性', check: () => UK_PET_FOOD.m5_return_rate > 0 && UK_PET_FOOD.m5_return_rate < 0.3, actual: `${(UK_PET_FOOD.m5_return_rate * 100).toFixed(1)}%` },
];

sanityChecks.forEach(({ name, check, actual }) => {
  console.log(`   ${check() ? '✅' : '❌'} ${name}: ${actual}`);
});
console.log('');

// 核心数据展示
console.log('✅ 5. 核心数据展示');
console.log(`   国家: ${UK_PET_FOOD.country} ${UK_PET_FOOD.country_flag}`);
console.log(`   HS Code: ${UK_PET_FOOD.m4_hs_code}`);
console.log(`   有效关税率: ${(UK_PET_FOOD.m4_effective_tariff_rate * 100).toFixed(1)}% (脱欧后继承EU)`);
console.log(`   VAT税率: ${(UK_PET_FOOD.m4_vat_rate * 100).toFixed(0)}%`);
console.log(`   平台佣金: ${(UK_PET_FOOD.m6_platform_commission_rate * 100).toFixed(0)}%`);
console.log(`   退货率: ${(UK_PET_FOOD.m5_return_rate * 100).toFixed(0)}% (欧洲最高)`);
console.log(`   Stripe费率: ${(UK_PET_FOOD.m7_payment_rate * 100).toFixed(1)}% (最优)`);

const logistics = JSON.parse(UK_PET_FOOD.m4_logistics);
console.log(`   海运: $${logistics.sea_freight.usd_per_kg}/kg (${logistics.sea_freight.transit_days_min}-${logistics.sea_freight.transit_days_max}天)`);
console.log('');

console.log('✅ 6. 数据质量摘要');
if (UK_PET_FOOD.data_quality_summary) {
  const summary = UK_PET_FOOD.data_quality_summary;
  console.log(`   P0字段填充: ${summary.p0_fields_filled}/${summary.p0_fields} (${(summary.p0_fields_filled/summary.p0_fields*100).toFixed(0)}%)`);
  console.log(`   Tier 1数据: ${(summary.tier1_percentage * 100).toFixed(0)}%`);
  console.log(`   置信度: ${(summary.confidence_score * 100).toFixed(0)}%`);
}
console.log('');

console.log('✅ 7. 英国市场关键特点');
console.log('   ⭐ 关税优势：6.5% vs 美国55%（同德国，节省88%）');
console.log('   ⭐ Stripe费率最优：1.4% vs 美国2.9%');
console.log('   ⭐ 英语市场：无语言障碍');
console.log('   ⚠️ VAT极高：20%（欧洲最高之一）');
console.log('   ⚠️ 退货率极高：18%（Consumer Rights Act 2015）');
console.log('');

console.log('========================================');
console.log('🎉 英国数据验证完成！');
console.log('========================================');

process.exit(missingFields.length === 0 && Number(tier12Combined) >= 80 ? 0 : 1);

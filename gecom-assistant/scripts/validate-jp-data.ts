#!/usr/bin/env tsx
import { JP_BASE_DATA } from '../data/cost-factors/JP-base-data';
import { JP_PET_FOOD_SPECIFIC } from '../data/cost-factors/JP-pet-food-specific';
import { JP_PET_FOOD } from '../data/cost-factors/JP-pet-food';

console.log('========================================');
console.log('🇯🇵 日本数据验证开始');
console.log('========================================\n');

console.log('✅ 1. 基础导入验证');
console.log(`   JP_BASE_DATA字段数: ${Object.keys(JP_BASE_DATA).length}`);
console.log(`   JP_PET_FOOD_SPECIFIC字段数: ${Object.keys(JP_PET_FOOD_SPECIFIC).length}`);
console.log(`   JP_PET_FOOD字段数: ${Object.keys(JP_PET_FOOD).length}\n`);

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
  field => JP_PET_FOOD[field] === undefined || JP_PET_FOOD[field] === null
);

console.log('✅ 2. P0字段完整性验证');
if (missingFields.length === 0) {
  console.log(`   ✅ P0字段完整：${P0_REQUIRED_FIELDS.length}/${P0_REQUIRED_FIELDS.length}`);
} else {
  console.log(`   ❌ P0字段缺失${missingFields.length}个：`);
  missingFields.forEach(f => console.log(`      - ${f}`));
}
console.log('');

console.log('✅ 3. Tier数据质量验证');
let tier1Count = 0, tier2Count = 0, tier3Count = 0, totalTierFields = 0;
Object.keys(JP_PET_FOOD).forEach(key => {
  if (key.includes('_tier')) {
    totalTierFields++;
    const tierValue = JP_PET_FOOD[key];
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
console.log(`   Tier 1+2合计: ${tier12Combined}% ${Number(tier12Combined) >= 80 ? '✅' : '❌'}\n`);

console.log('✅ 4. 数据合理性验证');
[
  { name: 'HS Code', check: () => JP_PET_FOOD.m4_hs_code === '2309.10.00', actual: JP_PET_FOOD.m4_hs_code },
  { name: '关税率', check: () => JP_PET_FOOD.m4_effective_tariff_rate >= 0 && JP_PET_FOOD.m4_effective_tariff_rate <= 1, actual: `${(JP_PET_FOOD.m4_effective_tariff_rate * 100).toFixed(1)}%` },
  { name: '消费税率', check: () => JP_PET_FOOD.m4_vat_rate > 0 && JP_PET_FOOD.m4_vat_rate < 0.3, actual: `${(JP_PET_FOOD.m4_vat_rate * 100).toFixed(1)}%` },
  { name: '退货率', check: () => JP_PET_FOOD.m5_return_rate > 0 && JP_PET_FOOD.m5_return_rate < 0.3, actual: `${(JP_PET_FOOD.m5_return_rate * 100).toFixed(1)}%` },
].forEach(({ name, check, actual }) => {
  console.log(`   ${check() ? '✅' : '❌'} ${name}: ${actual}`);
});
console.log('');

console.log('✅ 5. 核心数据展示');
console.log(`   国家: ${JP_PET_FOOD.country} ${JP_PET_FOOD.country_flag}`);
console.log(`   HS Code: ${JP_PET_FOOD.m4_hs_code}`);
console.log(`   关税率: ${(JP_PET_FOOD.m4_effective_tariff_rate * 100).toFixed(1)}%`);
console.log(`   消费税: ${(JP_PET_FOOD.m4_vat_rate * 100).toFixed(0)}%`);
console.log(`   退货率: ${(JP_PET_FOOD.m5_return_rate * 100).toFixed(0)}% (全球最低)`);
console.log(`   复购率: ${(JP_PET_FOOD.m6_repeat_purchase_rate * 100).toFixed(0)}% (最高)`);
console.log(`   FBA: $${JP_PET_FOOD.m5_fba_fee_usd} (最低)`);

const logistics = JSON.parse(JP_PET_FOOD.m4_logistics);
console.log(`   海运: $${logistics.sea_freight.usd_per_kg}/kg (${logistics.sea_freight.transit_days_min}-${logistics.sea_freight.transit_days_max}天)`);
console.log('');

if (JP_PET_FOOD.data_quality_summary) {
  console.log('✅ 6. 数据质量摘要');
  const s = JP_PET_FOOD.data_quality_summary;
  console.log(`   P0字段填充: ${s.p0_fields_filled}/${s.p0_fields} (${(s.p0_fields_filled/s.p0_fields*100).toFixed(0)}%)`);
  console.log(`   Tier 1数据: ${(s.tier1_percentage * 100).toFixed(0)}%`);
  console.log(`   置信度: ${(s.confidence_score * 100).toFixed(0)}%\n`);
}

console.log('✅ 7. 日本市场关键优势');
console.log('   ⭐ 退货率极低：5%（文化优势，全球最低）');
console.log('   ⭐ 复购率最高：68%（品牌忠诚度极强）');
console.log('   ⭐ FBA费用最低：$4.55（节省39% vs 美国）');
console.log('   ⭐ 物流时效快：海运10天（地理优势）');
console.log('   ⚠️ 标准严格：FAMIC认证，日文标签强制\n');

console.log('========================================');
console.log('🎉 日本数据验证完成！');
console.log('========================================');
process.exit(missingFields.length === 0 && Number(tier12Combined) >= 80 ? 0 : 1);

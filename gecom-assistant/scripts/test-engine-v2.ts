#!/usr/bin/env tsx
/**
 * GECOM计算引擎v2.0集成测试
 *
 * 目标：
 * 1. 使用真实19国数据测试计算引擎
 * 2. 验证CAPEX/OPEX计算准确性
 * 3. 验证用户覆盖值功能
 * 4. 生成测试报告
 */

import { config } from 'dotenv';
import { Client, Databases, Query } from 'node-appwrite';
import { calculateCost } from '../lib/gecom-engine-v2';
import type { CostFactor, Scope } from '../types/gecom';

config({ path: '.env.local' });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
const COL_ID = 'cost_factors';

/**
 * 测试场景1：美国宠物食品（Amazon FBA）
 */
async function testUSPetFood() {
  console.log('\n📊 测试场景1：美国宠物食品（Amazon FBA）');
  console.log('========================================');

  // 从数据库加载美国数据
  const result = await databases.listDocuments(DB_ID, COL_ID, [
    Query.equal('country', ['US']),
    Query.equal('industry', ['pet_food']),
  ]);

  if (result.total === 0) {
    console.log('❌ 未找到美国宠物食品数据');
    return;
  }

  const usCostFactor = result.documents[0] as unknown as CostFactor;

  // 定义业务场景
  const scope: Scope = {
    productName: 'Premium Dog Food 5kg',
    productWeightKg: 5,
    cogsUsd: 10,
    sellingPriceUsd: 35,
    monthlyVolume: 500,
    targetCountry: 'US',
    salesChannel: 'amazon_fba',
    industry: 'pet_food',
    opex: {
      shippingMethod: 'sea',
    },
  };

  // 计算成本
  const costResult = calculateCost(usCostFactor, scope);

  console.log('\n📦 产品信息：');
  console.log(`   - 产品名称: ${scope.productName}`);
  console.log(`   - COGS: $${scope.cogsUsd}`);
  console.log(`   - 售价: $${scope.sellingPriceUsd}`);
  console.log(`   - 月销量: ${scope.monthlyVolume} 件`);
  console.log(`   - 运输方式: 海运`);

  console.log('\n💰 CAPEX（一次性启动成本）：');
  console.log(`   - M1 市场准入: $${costResult.capex.m1.toFixed(2)}`);
  console.log(`   - M2 技术合规: $${costResult.capex.m2.toFixed(2)}`);
  console.log(`   - M3 供应链搭建: $${costResult.capex.m3.toFixed(2)}`);
  console.log(`   - 总计: $${costResult.capex.total.toFixed(2)}`);

  console.log('\n💵 OPEX（单位运营成本）：');
  console.log(`   - M4 货物成本: $${costResult.opex.m4_cogs.toFixed(2)}`);
  console.log(`   - M4 进口关税: $${costResult.opex.m4_tariff.toFixed(2)}`);
  console.log(`   - M4 头程物流: $${costResult.opex.m4_logistics.toFixed(2)}`);
  console.log(`   - M4 VAT/GST: $${costResult.opex.m4_vat.toFixed(2)}`);
  console.log(`   - M5 本地配送: $${costResult.opex.m5_last_mile.toFixed(2)}`);
  console.log(`   - M5 退货成本: $${costResult.opex.m5_return.toFixed(2)}`);
  console.log(`   - M6 营销获客: $${costResult.opex.m6_marketing.toFixed(2)}`);
  console.log(`   - M7 支付手续费: $${costResult.opex.m7_payment.toFixed(2)}`);
  console.log(`   - M7 平台佣金: $${costResult.opex.m7_platform_commission.toFixed(2)}`);
  console.log(`   - M8 运营管理: $${costResult.opex.m8_ga.toFixed(2)}`);
  console.log(`   - 总计: $${costResult.opex.total.toFixed(2)}`);

  console.log('\n📈 单位经济模型：');
  console.log(`   - 单位收入: $${costResult.unit_economics.revenue.toFixed(2)}`);
  console.log(`   - 单位成本: $${costResult.unit_economics.cost.toFixed(2)}`);
  console.log(`   - 单位毛利: $${costResult.unit_economics.gross_profit.toFixed(2)}`);
  console.log(
    `   - 毛利率: ${(costResult.unit_economics.gross_margin * 100).toFixed(2)}%`
  );

  console.log('\n📊 关键KPI：');
  console.log(`   - ROI: ${costResult.kpis.roi.toFixed(2)}%`);
  console.log(
    `   - 回本周期: ${
      isFinite(costResult.kpis.payback_period_months)
        ? costResult.kpis.payback_period_months.toFixed(2) + ' 个月'
        : '无法回本'
    }`
  );
  console.log(`   - 盈亏平衡价: $${costResult.kpis.breakeven_price.toFixed(2)}`);
  console.log(
    `   - 盈亏平衡量: ${
      isFinite(costResult.kpis.breakeven_volume)
        ? costResult.kpis.breakeven_volume.toFixed(0) + ' 件'
        : '无法盈亏平衡'
    }`
  );

  console.log('\n✅ 美国测试完成');
}

/**
 * 测试场景2：越南宠物食品（Shopee）
 */
async function testVNPetFood() {
  console.log('\n📊 测试场景2：越南宠物食品（Shopee）');
  console.log('========================================');

  const result = await databases.listDocuments(DB_ID, COL_ID, [
    Query.equal('country', ['VN']),
    Query.equal('industry', ['pet_food']),
  ]);

  if (result.total === 0) {
    console.log('❌ 未找到越南宠物食品数据');
    return;
  }

  const vnCostFactor = result.documents[0] as unknown as CostFactor;

  const scope: Scope = {
    productName: '越南宠物零食 500g',
    productWeightKg: 0.5,
    cogsUsd: 3,
    sellingPriceUsd: 12,
    monthlyVolume: 1000,
    targetCountry: 'VN',
    salesChannel: 'shopee',
    industry: 'pet_food',
    opex: {
      shippingMethod: 'air',
    },
  };

  const costResult = calculateCost(vnCostFactor, scope);

  console.log('\n📦 产品信息：');
  console.log(`   - 产品名称: ${scope.productName}`);
  console.log(`   - COGS: $${scope.cogsUsd}`);
  console.log(`   - 售价: $${scope.sellingPriceUsd}`);
  console.log(`   - 月销量: ${scope.monthlyVolume} 件`);
  console.log(`   - 运输方式: 空运`);

  console.log('\n💰 CAPEX总计: $${costResult.capex.total.toFixed(2)}');
  console.log(`💵 OPEX总计: $${costResult.opex.total.toFixed(2)}`);
  console.log(
    `📈 毛利率: ${(costResult.unit_economics.gross_margin * 100).toFixed(2)}%`
  );
  console.log(
    `📊 ROI: ${costResult.kpis.roi.toFixed(2)}% | 回本周期: ${
      isFinite(costResult.kpis.payback_period_months)
        ? costResult.kpis.payback_period_months.toFixed(2) + ' 个月'
        : '无法回本'
    }`
  );

  console.log('\n✅ 越南测试完成');
}

/**
 * 测试场景3：用户覆盖值测试
 */
async function testUserOverrides() {
  console.log('\n📊 测试场景3：用户覆盖值功能');
  console.log('========================================');

  const result = await databases.listDocuments(DB_ID, COL_ID, [
    Query.equal('country', ['DE']),
    Query.equal('industry', ['pet_food']),
  ]);

  if (result.total === 0) {
    console.log('❌ 未找到德国宠物食品数据');
    return;
  }

  const deCostFactor = result.documents[0] as unknown as CostFactor;

  const scope: Scope = {
    productName: 'German Pet Treats',
    productWeightKg: 1,
    cogsUsd: 5,
    sellingPriceUsd: 20,
    monthlyVolume: 300,
    targetCountry: 'DE',
    salesChannel: 'dtc',
    industry: 'pet_food',
  };

  // 测试1：系统默认值
  const defaultResult = calculateCost(deCostFactor, scope);
  console.log('\n🔹 系统默认值：');
  console.log(`   - 关税率: ${(deCostFactor.m4_effective_tariff_rate * 100).toFixed(1)}%`);
  console.log(`   - VAT税率: ${(deCostFactor.m4_vat_rate * 100).toFixed(1)}%`);
  console.log(`   - 关税金额: $${defaultResult.opex.m4_tariff.toFixed(2)}`);
  console.log(`   - VAT金额: $${defaultResult.opex.m4_vat.toFixed(2)}`);

  // 测试2：用户覆盖关税率
  const customTariffResult = calculateCost(deCostFactor, scope, {
    m4_effective_tariff_rate: 0.15, // 自定义15%关税
  });
  console.log('\n🔹 用户覆盖关税率（15%）：');
  console.log(`   - 关税金额: $${customTariffResult.opex.m4_tariff.toFixed(2)}`);
  console.log(
    `   - 差异: $${(
      customTariffResult.opex.m4_tariff - defaultResult.opex.m4_tariff
    ).toFixed(2)}`
  );

  // 测试3：用户覆盖VAT率
  const customVATResult = calculateCost(deCostFactor, scope, {
    m4_vat_rate: 0.10, // 自定义10% VAT
  });
  console.log('\n🔹 用户覆盖VAT率（10%）：');
  console.log(`   - VAT金额: $${customVATResult.opex.m4_vat.toFixed(2)}`);
  console.log(
    `   - 差异: $${(customVATResult.opex.m4_vat - defaultResult.opex.m4_vat).toFixed(
      2
    )}`
  );

  console.log('\n✅ 用户覆盖值测试完成');
}

/**
 * 测试场景4：19国批量测试
 */
async function testAllCountries() {
  console.log('\n📊 测试场景4：19国批量测试');
  console.log('========================================');

  const result = await databases.listDocuments(DB_ID, COL_ID, [
    Query.equal('industry', ['pet_food']),
  ]);

  console.log(`\n找到 ${result.total} 个国家的数据，开始批量测试...\n`);

  const standardScope: Scope = {
    productName: 'Standard Pet Food 2kg',
    productWeightKg: 2,
    cogsUsd: 8,
    sellingPriceUsd: 25,
    monthlyVolume: 500,
    targetCountry: 'US',
    salesChannel: 'amazon_fba',
    industry: 'pet_food',
  };

  const results: Array<{
    country: string;
    flag: string;
    tariff_rate: number;
    vat_rate: number;
    total_opex: number;
    gross_margin: number;
    roi: number;
  }> = [];

  for (const doc of result.documents) {
    const costFactor = doc as unknown as CostFactor;
    const scope: Scope = {
      ...standardScope,
      targetCountry: costFactor.country,
    };

    try {
      const costResult = calculateCost(costFactor, scope);

      results.push({
        country: costFactor.country,
        flag: costFactor.country_flag || '',
        tariff_rate: costFactor.m4_effective_tariff_rate,
        vat_rate: costFactor.m4_vat_rate,
        total_opex: costResult.opex.total,
        gross_margin: costResult.unit_economics.gross_margin,
        roi: costResult.kpis.roi,
      });
    } catch (error: any) {
      console.log(`❌ ${costFactor.country}: 计算失败 - ${error.message}`);
    }
  }

  // 按毛利率排序
  results.sort((a, b) => b.gross_margin - a.gross_margin);

  console.log('\n📊 19国成本对比（按毛利率排序）：\n');
  console.log(
    '国家  关税    VAT     单位成本   毛利率    ROI'
  );
  console.log('----  ------  ------  --------  --------  --------');

  results.forEach((r) => {
    console.log(
      `${r.flag}${r.country}  ${(r.tariff_rate * 100).toFixed(1).padStart(5)}%  ${(
        r.vat_rate * 100
      )
        .toFixed(1)
        .padStart(5)}%  $${r.total_opex.toFixed(2).padStart(6)}  ${(
        r.gross_margin * 100
      )
        .toFixed(2)
        .padStart(6)}%  ${r.roi.toFixed(1).padStart(7)}%`
    );
  });

  // 最佳/最差市场
  console.log('\n🏆 最佳市场（毛利率最高）：');
  const best = results[0];
  console.log(
    `   ${best.flag}${best.country} - 毛利率 ${(best.gross_margin * 100).toFixed(2)}%`
  );

  console.log('\n⚠️ 最差市场（毛利率最低）：');
  const worst = results[results.length - 1];
  console.log(
    `   ${worst.flag}${worst.country} - 毛利率 ${(worst.gross_margin * 100).toFixed(
      2
    )}%`
  );

  console.log('\n✅ 19国批量测试完成');
}

/**
 * 主函数
 */
async function main() {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║   GECOM计算引擎v2.0集成测试                   ║');
  console.log('╚════════════════════════════════════════════════╝');

  try {
    await testUSPetFood();
    await testVNPetFood();
    await testUserOverrides();
    await testAllCountries();

    console.log('\n╔════════════════════════════════════════════════╗');
    console.log('║   ✅ 所有测试完成                             ║');
    console.log('╚════════════════════════════════════════════════╝\n');
  } catch (error: any) {
    console.error('\n❌ 测试失败:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();

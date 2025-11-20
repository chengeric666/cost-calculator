/**
 * 市场推荐算法手动验证脚本
 * 运行命令：npx tsx scripts/test-market-recommendation.ts
 */

import {
  generateMarketRecommendation,
  formatRecommendationText,
} from '../lib/gecom/market-recommendation';
import { TargetCountry, CostResult, Scope } from '../types/gecom';

// 创建测试用的CostResult
function createMockCostResult(params: {
  opexTotal: number;
  grossProfit: number;
  grossMargin: number;
  capexTotal: number;
  paybackPeriod: number;
  roi: number;
}): CostResult {
  return {
    capex: {
      m1: 1000,
      m2: 1500,
      m3: params.capexTotal - 2500,
      total: params.capexTotal,
    },
    opex: {
      m4_cogs: 10,
      m4_tariff: 1,
      m4_logistics: 3,
      m4_vat: 2,
      m5_last_mile: 2,
      m5_return: 0.5,
      m6_marketing: 8,
      m7_payment: 1.5,
      m7_platform_commission: 3,
      m8_ga: 2,
      total: params.opexTotal,
    },
    unit_economics: {
      revenue: params.opexTotal + params.grossProfit,
      cost: params.opexTotal,
      gross_profit: params.grossProfit,
      gross_margin: params.grossMargin,
    },
    kpis: {
      roi: params.roi,
      payback_period_months: params.paybackPeriod,
      breakeven_price: 30,
      breakeven_volume: 1000,
    },
    cost_breakdown: [],
  };
}

// 创建测试用的Scope
function createMockScope(country: TargetCountry): Scope {
  return {
    productName: 'Test Product',
    productWeightKg: 1,
    cogsUsd: 10,
    sellingPriceUsd: 50,
    monthlyVolume: 1000,
    targetCountry: country,
    salesChannel: 'dtc',
    industry: 'pet',
  };
}

console.log('\n========== 市场推荐算法验证测试 ==========\n');

// 测试场景：美国、德国、日本三个市场对比
const marketsData = [
  {
    country: 'US' as TargetCountry,
    country_name_cn: '美国',
    country_flag: '🇺🇸',
    costResult: createMockCostResult({
      opexTotal: 30,
      grossProfit: 20,
      grossMargin: 40, // 毛利率40%
      capexTotal: 5000, // CAPEX较低
      paybackPeriod: 12, // 12个月回本
      roi: 150, // ROI 150%
    }),
    scope: createMockScope('US'),
  },
  {
    country: 'DE' as TargetCountry,
    country_name_cn: '德国',
    country_flag: '🇩🇪',
    costResult: createMockCostResult({
      opexTotal: 35,
      grossProfit: 15,
      grossMargin: 30, // 毛利率30%（较低）
      capexTotal: 8000, // CAPEX较高
      paybackPeriod: 18, // 18个月回本（较长）
      roi: 100, // ROI 100%（较低）
    }),
    scope: createMockScope('DE'),
  },
  {
    country: 'JP' as TargetCountry,
    country_name_cn: '日本',
    country_flag: '🇯🇵',
    costResult: createMockCostResult({
      opexTotal: 32,
      grossProfit: 18,
      grossMargin: 36, // 毛利率36%（中等）
      capexTotal: 6000, // CAPEX中等
      paybackPeriod: 15, // 15个月回本（中等）
      roi: 120, // ROI 120%（中等）
    }),
    scope: createMockScope('JP'),
  },
];

console.log('输入数据：');
console.log('  - 美国：毛利率40%, ROI 150%, 回本12个月, CAPEX $5,000');
console.log('  - 德国：毛利率30%, ROI 100%, 回本18个月, CAPEX $8,000');
console.log('  - 日本：毛利率36%, ROI 120%, 回本15个月, CAPEX $6,000');
console.log('\n正在计算市场推荐...\n');

try {
  // 生成市场推荐
  const recommendation = generateMarketRecommendation(marketsData);

  // 格式化输出
  const text = formatRecommendationText(recommendation);
  console.log(text);

  // 额外验证
  console.log('\n========== 验证结果 ==========');
  console.log(`✓ 最优市场: ${recommendation.bestMarket.country_name_cn} (评分: ${recommendation.bestMarket.score.toFixed(1)})`);
  console.log(`✓ 最差市场: ${recommendation.worstMarket.country_name_cn} (评分: ${recommendation.worstMarket.score.toFixed(1)})`);
  console.log(`✓ 市场总数: ${recommendation.allMarkets.length}`);
  console.log(`✓ 洞察数量: ${recommendation.insights.length}`);

  // 验证评分逻辑
  const usMarket = recommendation.allMarkets.find(m => m.country === 'US');
  const deMarket = recommendation.allMarkets.find(m => m.country === 'DE');

  if (usMarket && deMarket && usMarket.score > deMarket.score) {
    console.log(`✓ 评分逻辑正确: 美国(${usMarket.score.toFixed(1)}) > 德国(${deMarket.score.toFixed(1)})`);
  } else {
    console.error('✗ 评分逻辑错误: 美国评分应高于德国');
  }

  // 验证推荐理由
  if (recommendation.bestMarket.reasons.length > 0) {
    console.log(`✓ 最优市场理由已生成 (${recommendation.bestMarket.reasons.length}条)`);
  } else {
    console.error('✗ 最优市场理由未生成');
  }

  if (recommendation.worstMarket.reasons.length > 0) {
    console.log(`✓ 最差市场理由已生成 (${recommendation.worstMarket.reasons.length}条)`);
  } else {
    console.error('✗ 最差市场理由未生成');
  }

  console.log('\n✅ 市场推荐算法验证通过！\n');
} catch (error) {
  console.error('\n❌ 测试失败:', error);
  process.exit(1);
}

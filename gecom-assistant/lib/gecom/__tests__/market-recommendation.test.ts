/**
 * Market Recommendation Algorithm Unit Tests
 * 测试S4.3智能推荐算法的各个函数
 */

import {
  generateMarketRecommendation,
  calculateMarketScores,
  assignRecommendationLevels,
  generateReasons,
  generateInsights,
  formatRecommendationText,
  MarketComparisonResult,
} from '../market-recommendation';
import { TargetCountry, CostResult, Scope } from '@/types/gecom';

// ============================================
// 测试数据构造
// ============================================

/**
 * 创建测试用的CostResult
 */
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

/**
 * 创建测试用的Scope
 */
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

// ============================================
// 测试用例
// ============================================

describe('Market Recommendation Algorithm', () => {
  // 测试1：综合评分计算
  test('calculateMarketScores should correctly calculate scores', () => {
    const markets = [
      {
        country: 'US' as TargetCountry,
        country_name_cn: '美国',
        unitCost: 30,
        grossProfit: 20,
        grossMargin: 40, // 毛利率40%
        capexTotal: 5000,
        paybackPeriod: 12, // 12个月回本
        roi: 150, // ROI 150%
        costResult: createMockCostResult({
          opexTotal: 30,
          grossProfit: 20,
          grossMargin: 40,
          capexTotal: 5000,
          paybackPeriod: 12,
          roi: 150,
        }),
        scope: createMockScope('US'),
      },
      {
        country: 'DE' as TargetCountry,
        country_name_cn: '德国',
        unitCost: 35,
        grossProfit: 15,
        grossMargin: 30, // 毛利率30%（较低）
        capexTotal: 8000, // CAPEX较高
        paybackPeriod: 18, // 18个月回本（较长）
        roi: 100, // ROI 100%（较低）
        costResult: createMockCostResult({
          opexTotal: 35,
          grossProfit: 15,
          grossMargin: 30,
          capexTotal: 8000,
          paybackPeriod: 18,
          roi: 100,
        }),
        scope: createMockScope('DE'),
      },
    ];

    const scored = calculateMarketScores(markets);

    // 验证返回数组长度
    expect(scored.length).toBe(2);

    // 验证美国评分应高于德国（因为所有指标都更优）
    const usScore = scored.find(m => m.country === 'US')?.score || 0;
    const deScore = scored.find(m => m.country === 'DE')?.score || 0;
    expect(usScore).toBeGreaterThan(deScore);

    // 验证评分在0-100范围内
    scored.forEach(market => {
      expect(market.score).toBeGreaterThanOrEqual(0);
      expect(market.score).toBeLessThanOrEqual(100);
    });
  });

  // 测试2：排名分配
  test('assignRecommendationLevels should correctly assign levels', () => {
    const markets: MarketComparisonResult[] = [
      {
        country: 'US' as TargetCountry,
        country_name_cn: '美国',
        unitCost: 30,
        grossProfit: 20,
        grossMargin: 40,
        capexTotal: 5000,
        paybackPeriod: 12,
        roi: 150,
        score: 90,
        rank: 1,
        recommendation: 'average',
        reasons: [],
        costResult: createMockCostResult({
          opexTotal: 30,
          grossProfit: 20,
          grossMargin: 40,
          capexTotal: 5000,
          paybackPeriod: 12,
          roi: 150,
        }),
        scope: createMockScope('US'),
      },
      {
        country: 'DE' as TargetCountry,
        country_name_cn: '德国',
        unitCost: 35,
        grossProfit: 15,
        grossMargin: 30,
        capexTotal: 8000,
        paybackPeriod: 18,
        roi: 100,
        score: 60,
        rank: 2,
        recommendation: 'average',
        reasons: [],
        costResult: createMockCostResult({
          opexTotal: 35,
          grossProfit: 15,
          grossMargin: 30,
          capexTotal: 8000,
          paybackPeriod: 18,
          roi: 100,
        }),
        scope: createMockScope('DE'),
      },
    ];

    const leveled = assignRecommendationLevels(markets);

    // 验证第1名为'best'
    expect(leveled.find(m => m.rank === 1)?.recommendation).toBe('best');

    // 验证最后1名为'worst'
    expect(leveled[leveled.length - 1].recommendation).toBe('worst');
  });

  // 测试3：推荐理由生成
  test('generateReasons should generate appropriate reasons', () => {
    const market: MarketComparisonResult = {
      country: 'US' as TargetCountry,
      country_name_cn: '美国',
      unitCost: 30,
      grossProfit: 20,
      grossMargin: 50, // 高毛利率
      capexTotal: 5000,
      paybackPeriod: 10, // 快速回本
      roi: 180, // 高ROI
      score: 95,
      rank: 1,
      recommendation: 'best',
      reasons: [],
      costResult: createMockCostResult({
        opexTotal: 30,
        grossProfit: 20,
        grossMargin: 50,
        capexTotal: 5000,
        paybackPeriod: 10,
        roi: 180,
      }),
      scope: createMockScope('US'),
    };

    const allMarkets: MarketComparisonResult[] = [
      market,
      {
        country: 'DE' as TargetCountry,
        country_name_cn: '德国',
        unitCost: 35,
        grossProfit: 15,
        grossMargin: 30,
        capexTotal: 8000,
        paybackPeriod: 18,
        roi: 100,
        score: 60,
        rank: 2,
        recommendation: 'worst',
        reasons: [],
        costResult: createMockCostResult({
          opexTotal: 35,
          grossProfit: 15,
          grossMargin: 30,
          capexTotal: 8000,
          paybackPeriod: 18,
          roi: 100,
        }),
        scope: createMockScope('DE'),
      },
    ];

    const withReasons = generateReasons(market, allMarkets);

    // 验证推荐理由已生成
    expect(withReasons.reasons.length).toBeGreaterThan(0);
    expect(withReasons.reasons_en?.length).toBeGreaterThan(0);

    // 验证理由包含关键指标
    const reasonsText = withReasons.reasons.join(' ');
    expect(reasonsText).toMatch(/毛利率|ROI|回本|启动成本|综合评分/);
  });

  // 测试4：整体洞察生成
  test('generateInsights should generate market insights', () => {
    const markets: MarketComparisonResult[] = [
      {
        country: 'US' as TargetCountry,
        country_name_cn: '美国',
        unitCost: 30,
        grossProfit: 20,
        grossMargin: 40,
        capexTotal: 5000,
        paybackPeriod: 12,
        roi: 150,
        score: 90,
        rank: 1,
        recommendation: 'best',
        reasons: [],
        costResult: createMockCostResult({
          opexTotal: 30,
          grossProfit: 20,
          grossMargin: 40,
          capexTotal: 5000,
          paybackPeriod: 12,
          roi: 150,
        }),
        scope: createMockScope('US'),
      },
      {
        country: 'DE' as TargetCountry,
        country_name_cn: '德国',
        unitCost: 35,
        grossProfit: 15,
        grossMargin: 30,
        capexTotal: 8000,
        paybackPeriod: 18,
        roi: 100,
        score: 60,
        rank: 2,
        recommendation: 'worst',
        reasons: [],
        costResult: createMockCostResult({
          opexTotal: 35,
          grossProfit: 15,
          grossMargin: 30,
          capexTotal: 8000,
          paybackPeriod: 18,
          roi: 100,
        }),
        scope: createMockScope('DE'),
      },
    ];

    const { insights, insights_en } = generateInsights(markets);

    // 验证洞察已生成
    expect(insights.length).toBeGreaterThan(0);
    expect(insights_en.length).toBeGreaterThan(0);

    // 验证洞察包含关键信息
    const insightsText = insights.join(' ');
    expect(insightsText).toMatch(/平均毛利率|平均ROI|平均回本周期|平均启动成本/);
  });

  // 测试5：完整推荐流程
  test('generateMarketRecommendation should generate complete recommendation', () => {
    const marketsData = [
      {
        country: 'US' as TargetCountry,
        country_name_cn: '美国',
        costResult: createMockCostResult({
          opexTotal: 30,
          grossProfit: 20,
          grossMargin: 40,
          capexTotal: 5000,
          paybackPeriod: 12,
          roi: 150,
        }),
        scope: createMockScope('US'),
      },
      {
        country: 'DE' as TargetCountry,
        country_name_cn: '德国',
        costResult: createMockCostResult({
          opexTotal: 35,
          grossProfit: 15,
          grossMargin: 30,
          capexTotal: 8000,
          paybackPeriod: 18,
          roi: 100,
        }),
        scope: createMockScope('DE'),
      },
      {
        country: 'JP' as TargetCountry,
        country_name_cn: '日本',
        costResult: createMockCostResult({
          opexTotal: 32,
          grossProfit: 18,
          grossMargin: 36,
          capexTotal: 6000,
          paybackPeriod: 15,
          roi: 120,
        }),
        scope: createMockScope('JP'),
      },
    ];

    const recommendation = generateMarketRecommendation(marketsData);

    // 验证返回结构完整
    expect(recommendation.bestMarket).toBeDefined();
    expect(recommendation.worstMarket).toBeDefined();
    expect(recommendation.allMarkets.length).toBe(3);
    expect(recommendation.insights.length).toBeGreaterThan(0);

    // 验证最优市场评分最高
    expect(recommendation.bestMarket.score).toBeGreaterThanOrEqual(
      recommendation.allMarkets[1].score
    );

    // 验证最差市场评分最低
    expect(recommendation.worstMarket.score).toBeLessThanOrEqual(
      recommendation.allMarkets[1].score
    );

    // 验证排名正确分配
    expect(recommendation.bestMarket.rank).toBe(1);
    expect(recommendation.worstMarket.rank).toBe(3);
  });

  // 测试6：格式化文本输出
  test('formatRecommendationText should format recommendation as readable text', () => {
    const marketsData = [
      {
        country: 'US' as TargetCountry,
        country_name_cn: '美国',
        costResult: createMockCostResult({
          opexTotal: 30,
          grossProfit: 20,
          grossMargin: 40,
          capexTotal: 5000,
          paybackPeriod: 12,
          roi: 150,
        }),
        scope: createMockScope('US'),
      },
      {
        country: 'DE' as TargetCountry,
        country_name_cn: '德国',
        costResult: createMockCostResult({
          opexTotal: 35,
          grossProfit: 15,
          grossMargin: 30,
          capexTotal: 8000,
          paybackPeriod: 18,
          roi: 100,
        }),
        scope: createMockScope('DE'),
      },
    ];

    const recommendation = generateMarketRecommendation(marketsData);
    const text = formatRecommendationText(recommendation);

    // 验证文本包含关键部分
    expect(text).toContain('市场推荐报告');
    expect(text).toContain('最优市场');
    expect(text).toContain('最差市场');
    expect(text).toContain('整体洞察');
    expect(text).toContain('完整排名');
    expect(text).toContain('美国');
    expect(text).toContain('德国');
  });

  // 测试7：边界情况 - 空数组
  test('should handle empty markets array', () => {
    const recommendation = generateMarketRecommendation([]);

    // 应该不报错，返回合理的默认值
    expect(recommendation.allMarkets.length).toBe(0);
  });

  // 测试8：边界情况 - 单个市场
  test('should handle single market', () => {
    const marketsData = [
      {
        country: 'US' as TargetCountry,
        country_name_cn: '美国',
        costResult: createMockCostResult({
          opexTotal: 30,
          grossProfit: 20,
          grossMargin: 40,
          capexTotal: 5000,
          paybackPeriod: 12,
          roi: 150,
        }),
        scope: createMockScope('US'),
      },
    ];

    const recommendation = generateMarketRecommendation(marketsData);

    // 验证单个市场既是最优也是最差
    expect(recommendation.bestMarket.country).toBe('US');
    expect(recommendation.worstMarket.country).toBe('US');
    expect(recommendation.allMarkets.length).toBe(1);
  });
});

// ============================================
// 手动测试示例（可在console运行）
// ============================================

/**
 * 手动测试函数（用于调试）
 * 在Node.js环境中运行：npx tsx lib/gecom/__tests__/market-recommendation.test.ts
 */
export function manualTest() {
  console.log('\n========== 市场推荐算法手动测试 ==========\n');

  const marketsData = [
    {
      country: 'US' as TargetCountry,
      country_name_cn: '美国',
      costResult: createMockCostResult({
        opexTotal: 30,
        grossProfit: 20,
        grossMargin: 40,
        capexTotal: 5000,
        paybackPeriod: 12,
        roi: 150,
      }),
      scope: createMockScope('US'),
    },
    {
      country: 'DE' as TargetCountry,
      country_name_cn: '德国',
      costResult: createMockCostResult({
        opexTotal: 35,
        grossProfit: 15,
        grossMargin: 30,
        capexTotal: 8000,
        paybackPeriod: 18,
        roi: 100,
      }),
      scope: createMockScope('DE'),
    },
    {
      country: 'JP' as TargetCountry,
      country_name_cn: '日本',
      costResult: createMockCostResult({
        opexTotal: 32,
        grossProfit: 18,
        grossMargin: 36,
        capexTotal: 6000,
        paybackPeriod: 15,
        roi: 120,
      }),
      scope: createMockScope('JP'),
    },
  ];

  const recommendation = generateMarketRecommendation(marketsData);
  const text = formatRecommendationText(recommendation);

  console.log(text);

  return recommendation;
}

// 如果直接运行此文件，执行手动测试
if (require.main === module) {
  manualTest();
}

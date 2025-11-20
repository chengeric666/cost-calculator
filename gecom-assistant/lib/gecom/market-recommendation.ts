/**
 * Market Recommendation Algorithm - S4.3智能推荐算法
 *
 * 功能：多国成本对比与智能市场推荐
 * 应用场景：Step 4 Scenario Analysis页面
 *
 * 核心算法：
 * - 综合评分系统（毛利率40% + ROI30% + 回本周期20% + CAPEX10%）
 * - 最优/最差市场识别
 * - 中英文推荐理由生成
 *
 * @author GECOM Team
 * @version 1.0
 * @date 2025-11-12
 */

import { TargetCountry, CostResult, Scope } from '@/types/gecom';

// ============================================
// 数据结构定义
// ============================================

/**
 * 市场对比结果
 */
export interface MarketComparisonResult {
  country: TargetCountry;
  country_name_cn: string;
  country_flag?: string;

  // 核心财务指标
  unitCost: number;           // 单位OPEX成本
  grossProfit: number;        // 毛利润
  grossMargin: number;        // 毛利率（%）
  capexTotal: number;         // CAPEX总计
  paybackPeriod: number;      // 回本周期（月）
  roi: number;                // ROI（%）

  // 评分与排名
  score: number;              // 综合评分（0-100）
  rank: number;               // 排名（1-N）
  recommendation: 'best' | 'good' | 'average' | 'poor' | 'worst';

  // 推荐理由
  reasons: string[];          // 推荐/警告理由（中文）
  reasons_en?: string[];      // 英文理由（可选）

  // 原始计算结果（用于进一步分析）
  costResult: CostResult;
  scope: Scope;
}

/**
 * 市场推荐汇总
 */
export interface MarketRecommendation {
  bestMarket: MarketComparisonResult;
  worstMarket: MarketComparisonResult;
  allMarkets: MarketComparisonResult[];
  insights: string[];         // 整体洞察（中文）
  insights_en?: string[];     // 英文洞察（可选）
}

/**
 * 评分权重配置
 */
interface ScoringWeights {
  grossMargin: number;        // 毛利率权重（默认40%）
  roi: number;                // ROI权重（默认30%）
  paybackPeriod: number;      // 回本周期权重（默认20%）
  capex: number;              // CAPEX权重（默认10%）
}

const DEFAULT_WEIGHTS: ScoringWeights = {
  grossMargin: 0.4,
  roi: 0.3,
  paybackPeriod: 0.2,
  capex: 0.1,
};

// ============================================
// 核心算法实现
// ============================================

/**
 * 归一化函数（将值映射到0-1区间）
 * @param value 当前值
 * @param min 最小值
 * @param max 最大值
 * @returns 归一化后的值（0-1）
 */
function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0.5; // 避免除零
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

/**
 * 计算市场综合评分
 *
 * 评分公式：
 * score = (毛利率_normalized * 0.4 + ROI_normalized * 0.3 +
 *          (1 - 回本周期_normalized) * 0.2 + (1 - CAPEX_normalized) * 0.1) * 100
 *
 * @param markets 市场对比数组
 * @param weights 评分权重（可选）
 * @returns 带评分的市场数组
 */
export function calculateMarketScores(
  markets: Omit<MarketComparisonResult, 'score' | 'rank' | 'recommendation' | 'reasons'>[],
  weights: ScoringWeights = DEFAULT_WEIGHTS
): MarketComparisonResult[] {
  if (markets.length === 0) {
    return [];
  }

  // Step 1: 提取各指标的最小值和最大值（用于归一化）
  const grossMargins = markets.map(m => m.grossMargin);
  const rois = markets.map(m => m.roi);
  const paybackPeriods = markets.map(m => m.paybackPeriod);
  const capexTotals = markets.map(m => m.capexTotal);

  const minGrossMargin = Math.min(...grossMargins);
  const maxGrossMargin = Math.max(...grossMargins);

  const minROI = Math.min(...rois);
  const maxROI = Math.max(...rois);

  const minPayback = Math.min(...paybackPeriods);
  const maxPayback = Math.max(...paybackPeriods);

  const minCapex = Math.min(...capexTotals);
  const maxCapex = Math.max(...capexTotals);

  // Step 2: 计算每个市场的综合评分
  const scoredMarkets = markets.map(market => {
    // 归一化各指标（0-1）
    const grossMarginNorm = normalize(market.grossMargin, minGrossMargin, maxGrossMargin);
    const roiNorm = normalize(market.roi, minROI, maxROI);
    const paybackNorm = normalize(market.paybackPeriod, minPayback, maxPayback);
    const capexNorm = normalize(market.capexTotal, minCapex, maxCapex);

    // 计算综合评分（0-100）
    // 注意：回本周期和CAPEX越小越好，所以用(1 - normalized)
    const score = (
      grossMarginNorm * weights.grossMargin +
      roiNorm * weights.roi +
      (1 - paybackNorm) * weights.paybackPeriod +
      (1 - capexNorm) * weights.capex
    ) * 100;

    return {
      ...market,
      score: Math.round(score * 10) / 10, // 保留1位小数
      rank: 0, // 排名稍后计算
      recommendation: 'average' as const, // 推荐等级稍后计算
      reasons: [], // 理由稍后生成
    };
  });

  // Step 3: 按评分降序排序并分配排名
  scoredMarkets.sort((a, b) => b.score - a.score);
  scoredMarkets.forEach((market, index) => {
    market.rank = index + 1;
  });

  return scoredMarkets;
}

/**
 * 生成推荐等级
 * @param markets 已评分的市场数组
 * @returns 带推荐等级的市场数组
 */
export function assignRecommendationLevels(
  markets: MarketComparisonResult[]
): MarketComparisonResult[] {
  if (markets.length === 0) {
    return [];
  }

  const totalCount = markets.length;

  return markets.map(market => {
    let recommendation: MarketComparisonResult['recommendation'];

    if (market.rank === 1) {
      recommendation = 'best'; // 第1名：最优
    } else if (market.rank === totalCount) {
      recommendation = 'worst'; // 最后1名：最差
    } else if (market.rank <= Math.ceil(totalCount * 0.3)) {
      recommendation = 'good'; // 前30%：良好
    } else if (market.rank >= Math.floor(totalCount * 0.7)) {
      recommendation = 'poor'; // 后30%：较差
    } else {
      recommendation = 'average'; // 中间：一般
    }

    return {
      ...market,
      recommendation,
    };
  });
}

/**
 * 生成推荐理由（中英文）
 * @param market 市场对比结果
 * @param allMarkets 所有市场（用于对比参考）
 * @returns 带理由的市场对比结果
 */
export function generateReasons(
  market: MarketComparisonResult,
  allMarkets: MarketComparisonResult[]
): MarketComparisonResult {
  const reasons: string[] = [];
  const reasons_en: string[] = [];

  const avgGrossMargin = allMarkets.reduce((sum, m) => sum + m.grossMargin, 0) / allMarkets.length;
  const avgROI = allMarkets.reduce((sum, m) => sum + m.roi, 0) / allMarkets.length;
  const avgPayback = allMarkets.reduce((sum, m) => sum + m.paybackPeriod, 0) / allMarkets.length;
  const avgCapex = allMarkets.reduce((sum, m) => sum + m.capexTotal, 0) / allMarkets.length;

  // ========== 最优市场理由 ==========
  if (market.recommendation === 'best') {
    // 毛利率
    if (market.grossMargin > avgGrossMargin) {
      reasons.push(`✅ 毛利率高达 ${market.grossMargin.toFixed(1)}%，高于平均水平 ${(market.grossMargin - avgGrossMargin).toFixed(1)} 个百分点`);
      reasons_en.push(`✅ High gross margin of ${market.grossMargin.toFixed(1)}%, ${(market.grossMargin - avgGrossMargin).toFixed(1)}pp above average`);
    }

    // ROI
    if (market.roi > avgROI) {
      reasons.push(`✅ ROI达到 ${market.roi.toFixed(1)}%，投资回报率优秀`);
      reasons_en.push(`✅ Excellent ROI of ${market.roi.toFixed(1)}%`);
    }

    // 回本周期
    if (market.paybackPeriod < avgPayback) {
      reasons.push(`✅ 仅需 ${market.paybackPeriod.toFixed(1)} 个月回本，快于平均水平`);
      reasons_en.push(`✅ Fast payback period of ${market.paybackPeriod.toFixed(1)} months`);
    }

    // CAPEX
    if (market.capexTotal < avgCapex) {
      reasons.push(`✅ 启动成本相对较低（${market.capexTotal.toLocaleString()} USD）`);
      reasons_en.push(`✅ Lower initial investment (${market.capexTotal.toLocaleString()} USD)`);
    }

    // 如果没有明显优势，给出综合评价
    if (reasons.length === 0) {
      reasons.push(`✅ 综合评分最高（${market.score.toFixed(1)}分），整体表现最佳`);
      reasons_en.push(`✅ Highest overall score (${market.score.toFixed(1)})`);
    }
  }

  // ========== 最差市场警告 ==========
  else if (market.recommendation === 'worst') {
    // 毛利率
    if (market.grossMargin < avgGrossMargin) {
      reasons.push(`⚠️ 毛利率仅为 ${market.grossMargin.toFixed(1)}%，低于平均水平 ${(avgGrossMargin - market.grossMargin).toFixed(1)} 个百分点`);
      reasons_en.push(`⚠️ Low gross margin of ${market.grossMargin.toFixed(1)}%, ${(avgGrossMargin - market.grossMargin).toFixed(1)}pp below average`);
    }

    // ROI
    if (market.roi < avgROI) {
      reasons.push(`⚠️ ROI不足 ${market.roi.toFixed(1)}%，投资回报率偏低`);
      reasons_en.push(`⚠️ Poor ROI of ${market.roi.toFixed(1)}%`);
    }

    // 回本周期
    if (market.paybackPeriod > avgPayback) {
      reasons.push(`⚠️ 回本周期过长（${market.paybackPeriod.toFixed(1)} 个月），资金压力大`);
      reasons_en.push(`⚠️ Long payback period (${market.paybackPeriod.toFixed(1)} months)`);
    }

    // CAPEX
    if (market.capexTotal > avgCapex) {
      reasons.push(`⚠️ 启动成本过高（${market.capexTotal.toLocaleString()} USD）`);
      reasons_en.push(`⚠️ High initial investment (${market.capexTotal.toLocaleString()} USD)`);
    }

    // 如果没有明显劣势，给出综合评价
    if (reasons.length === 0) {
      reasons.push(`⚠️ 综合评分最低（${market.score.toFixed(1)}分），整体表现欠佳`);
      reasons_en.push(`⚠️ Lowest overall score (${market.score.toFixed(1)})`);
    }
  }

  // ========== 良好市场理由 ==========
  else if (market.recommendation === 'good') {
    reasons.push(`👍 综合评分 ${market.score.toFixed(1)} 分，表现良好`);
    reasons_en.push(`👍 Good overall score of ${market.score.toFixed(1)}`);

    if (market.grossMargin > avgGrossMargin) {
      reasons.push(`毛利率高于平均水平（${market.grossMargin.toFixed(1)}%）`);
      reasons_en.push(`Above-average gross margin (${market.grossMargin.toFixed(1)}%)`);
    }
  }

  // ========== 较差市场理由 ==========
  else if (market.recommendation === 'poor') {
    reasons.push(`⚡ 综合评分 ${market.score.toFixed(1)} 分，表现一般`);
    reasons_en.push(`⚡ Below-average score of ${market.score.toFixed(1)}`);

    if (market.grossMargin < avgGrossMargin) {
      reasons.push(`毛利率低于平均水平（${market.grossMargin.toFixed(1)}%）`);
      reasons_en.push(`Below-average gross margin (${market.grossMargin.toFixed(1)}%)`);
    }
  }

  // ========== 一般市场理由 ==========
  else {
    reasons.push(`📊 综合评分 ${market.score.toFixed(1)} 分，表现中等`);
    reasons_en.push(`📊 Average score of ${market.score.toFixed(1)}`);
  }

  return {
    ...market,
    reasons,
    reasons_en,
  };
}

/**
 * 生成整体洞察（对比所有市场）
 * @param markets 所有市场对比结果
 * @returns 洞察列表（中英文）
 */
export function generateInsights(
  markets: MarketComparisonResult[]
): { insights: string[]; insights_en: string[] } {
  const insights: string[] = [];
  const insights_en: string[] = [];

  if (markets.length === 0) {
    return { insights, insights_en };
  }

  // 计算平均值
  const avgGrossMargin = markets.reduce((sum, m) => sum + m.grossMargin, 0) / markets.length;
  const avgROI = markets.reduce((sum, m) => sum + m.roi, 0) / markets.length;
  const avgPayback = markets.reduce((sum, m) => sum + m.paybackPeriod, 0) / markets.length;
  const avgCapex = markets.reduce((sum, m) => sum + m.capexTotal, 0) / markets.length;

  // 找出毛利率最高和最低的市场
  const maxMarginMarket = markets.reduce((max, m) => m.grossMargin > max.grossMargin ? m : max);
  const minMarginMarket = markets.reduce((min, m) => m.grossMargin < min.grossMargin ? m : min);

  // 洞察1：毛利率分析
  insights.push(
    `📊 ${markets.length}个市场平均毛利率为 ${avgGrossMargin.toFixed(1)}%，` +
    `${maxMarginMarket.country_name_cn}最高（${maxMarginMarket.grossMargin.toFixed(1)}%），` +
    `${minMarginMarket.country_name_cn}最低（${minMarginMarket.grossMargin.toFixed(1)}%）`
  );
  insights_en.push(
    `📊 Average gross margin across ${markets.length} markets: ${avgGrossMargin.toFixed(1)}%, ` +
    `highest in ${maxMarginMarket.country} (${maxMarginMarket.grossMargin.toFixed(1)}%), ` +
    `lowest in ${minMarginMarket.country} (${minMarginMarket.grossMargin.toFixed(1)}%)`
  );

  // 洞察2：ROI分析
  const maxROIMarket = markets.reduce((max, m) => m.roi > max.roi ? m : max);
  insights.push(
    `💰 平均ROI为 ${avgROI.toFixed(1)}%，${maxROIMarket.country_name_cn}表现最佳（${maxROIMarket.roi.toFixed(1)}%）`
  );
  insights_en.push(
    `💰 Average ROI: ${avgROI.toFixed(1)}%, best performance in ${maxROIMarket.country} (${maxROIMarket.roi.toFixed(1)}%)`
  );

  // 洞察3：回本周期分析
  const minPaybackMarket = markets.reduce((min, m) => m.paybackPeriod < min.paybackPeriod ? m : min);
  insights.push(
    `⏱️ 平均回本周期为 ${avgPayback.toFixed(1)} 个月，${minPaybackMarket.country_name_cn}最快（${minPaybackMarket.paybackPeriod.toFixed(1)} 个月）`
  );
  insights_en.push(
    `⏱️ Average payback period: ${avgPayback.toFixed(1)} months, fastest in ${minPaybackMarket.country} (${minPaybackMarket.paybackPeriod.toFixed(1)} months)`
  );

  // 洞察4：CAPEX分析
  const minCapexMarket = markets.reduce((min, m) => m.capexTotal < min.capexTotal ? m : min);
  insights.push(
    `🏗️ 平均启动成本为 ${avgCapex.toLocaleString()} USD，${minCapexMarket.country_name_cn}最低（${minCapexMarket.capexTotal.toLocaleString()} USD）`
  );
  insights_en.push(
    `🏗️ Average initial investment: ${avgCapex.toLocaleString()} USD, lowest in ${minCapexMarket.country} (${minCapexMarket.capexTotal.toLocaleString()} USD)`
  );

  return { insights, insights_en };
}

// ============================================
// 主函数：生成完整市场推荐
// ============================================

/**
 * 生成完整的市场推荐报告
 *
 * @param marketsData 市场数据数组（需包含country, costResult, scope等）
 * @param weights 评分权重（可选）
 * @returns 完整的市场推荐报告
 *
 * @example
 * ```typescript
 * const recommendation = generateMarketRecommendation([
 *   {
 *     country: 'US',
 *     country_name_cn: '美国',
 *     costResult: usaCostResult,
 *     scope: usaScope,
 *   },
 *   {
 *     country: 'DE',
 *     country_name_cn: '德国',
 *     costResult: deCostResult,
 *     scope: deScope,
 *   },
 * ]);
 *
 * console.log('最优市场:', recommendation.bestMarket.country_name_cn);
 * console.log('推荐理由:', recommendation.bestMarket.reasons);
 * ```
 */
export function generateMarketRecommendation(
  marketsData: Array<{
    country: TargetCountry;
    country_name_cn: string;
    country_flag?: string;
    costResult: CostResult;
    scope: Scope;
  }>,
  weights?: ScoringWeights
): MarketRecommendation {
  // Step 1: 提取核心财务指标
  const markets = marketsData.map(data => ({
    country: data.country,
    country_name_cn: data.country_name_cn,
    country_flag: data.country_flag,
    unitCost: data.costResult.opex.total,
    grossProfit: data.costResult.unit_economics.gross_profit,
    grossMargin: data.costResult.unit_economics.gross_margin,
    capexTotal: data.costResult.capex.total,
    paybackPeriod: data.costResult.kpis.payback_period_months,
    roi: data.costResult.kpis.roi,
    costResult: data.costResult,
    scope: data.scope,
  }));

  // Step 2: 计算评分
  let scoredMarkets = calculateMarketScores(markets, weights);

  // Step 3: 分配推荐等级
  scoredMarkets = assignRecommendationLevels(scoredMarkets);

  // Step 4: 生成推荐理由
  scoredMarkets = scoredMarkets.map(market => generateReasons(market, scoredMarkets));

  // Step 5: 生成整体洞察
  const { insights, insights_en } = generateInsights(scoredMarkets);

  // Step 6: 提取最优和最差市场
  const bestMarket = scoredMarkets[0]; // 已按score降序排序
  const worstMarket = scoredMarkets[scoredMarkets.length - 1];

  return {
    bestMarket,
    worstMarket,
    allMarkets: scoredMarkets,
    insights,
    insights_en,
  };
}

// ============================================
// 辅助函数：格式化输出
// ============================================

/**
 * 格式化市场推荐为可读文本
 * @param recommendation 市场推荐
 * @returns 格式化文本
 */
export function formatRecommendationText(recommendation: MarketRecommendation): string {
  let text = `\n========== 市场推荐报告 ==========\n\n`;

  text += `🏆 最优市场：${recommendation.bestMarket.country_name_cn} (${recommendation.bestMarket.country})\n`;
  text += `   综合评分：${recommendation.bestMarket.score.toFixed(1)} 分\n`;
  text += `   推荐理由：\n`;
  recommendation.bestMarket.reasons.forEach(reason => {
    text += `   ${reason}\n`;
  });

  text += `\n⚠️ 最差市场：${recommendation.worstMarket.country_name_cn} (${recommendation.worstMarket.country})\n`;
  text += `   综合评分：${recommendation.worstMarket.score.toFixed(1)} 分\n`;
  text += `   警告理由：\n`;
  recommendation.worstMarket.reasons.forEach(reason => {
    text += `   ${reason}\n`;
  });

  text += `\n📊 整体洞察：\n`;
  recommendation.insights.forEach(insight => {
    text += `   ${insight}\n`;
  });

  text += `\n========== 完整排名 ==========\n`;
  recommendation.allMarkets.forEach(market => {
    text += `   ${market.rank}. ${market.country_name_cn} - ${market.score.toFixed(1)}分 (${market.recommendation})\n`;
  });

  return text;
}

/**
 * AI工具函数：生成成本优化建议
 *
 * 功能：基于当前成本结构生成可行的优化建议
 * 参数：
 *  - focus_area: 可选，优化重点领域（定价/物流/市场选择/成本削减）
 *  - project: 项目基本信息
 *
 * 返回：优化建议列表JSON
 *
 * @module lib/ai/tools/getOptimizationSuggestions
 */

import { Project, ProjectScope, CostResult } from '@/types/gecom';
import { calculateCostModel } from '@/lib/gecom/calculator';

// ============================================
// 类型定义
// ============================================

export interface GetOptimizationSuggestionsParams {
  focus_area?: 'pricing' | 'logistics' | 'market_selection' | 'cost_reduction' | 'all';
}

export interface OptimizationSuggestion {
  area: string;
  priority: 'high' | 'medium' | 'low';
  issue: string;
  suggestion: string;
  impact: string;
}

export interface OptimizationSuggestionsResult {
  total_suggestions: number;
  suggestions: OptimizationSuggestion[];
  error?: string;
}

// ============================================
// 工具函数
// ============================================

/**
 * 生成成本优化建议
 *
 * @param params - 优化参数
 * @param project - 项目信息
 * @returns 优化建议结果
 *
 * @example
 * ```typescript
 * // 获取全面优化建议
 * const result = getOptimizationSuggestions({
 *   focus_area: 'all'
 * }, project);
 *
 * // 仅获取定价策略建议
 * const pricingResult = getOptimizationSuggestions({
 *   focus_area: 'pricing'
 * }, project);
 * ```
 */
export function getOptimizationSuggestions(
  params: GetOptimizationSuggestionsParams,
  project: Partial<Project>
): OptimizationSuggestionsResult {
  const { focus_area = 'all' } = params;

  // 参数验证
  if (!project.scope) {
    return {
      total_suggestions: 0,
      suggestions: [],
      error: '缺少项目基本信息（scope），请先完成Step 1'
    };
  }

  // 计算成本
  let costResult: CostResult;
  try {
    const fullProject: Project = {
      id: project.id || 'temp',
      name: project.name || 'temp-project',
      industry: project.industry || 'pet',
      targetCountry: project.targetCountry as any || 'US',
      salesChannel: project.salesChannel as any || 'amazon_fba',
      scope: project.scope as ProjectScope,
      createdAt: project.createdAt || new Date(),
      updatedAt: project.updatedAt || new Date()
    };

    costResult = calculateCostModel(fullProject);
  } catch (error) {
    console.error('成本计算失败:', error);
    return {
      total_suggestions: 0,
      suggestions: [],
      error: '成本计算失败，请检查项目参数是否完整'
    };
  }

  // 收集优化建议
  const suggestions: OptimizationSuggestion[] = [];

  // 定价优化建议
  if (focus_area === 'pricing' || focus_area === 'all') {
    const pricingSuggestions = analyzePricing(costResult);
    suggestions.push(...pricingSuggestions);
  }

  // 物流优化建议
  if (focus_area === 'logistics' || focus_area === 'all') {
    const logisticsSuggestions = analyzeLogistics(costResult);
    suggestions.push(...logisticsSuggestions);
  }

  // 市场选择建议
  if (focus_area === 'market_selection' || focus_area === 'all') {
    const marketSuggestions = analyzeMarketSelection(costResult);
    suggestions.push(...marketSuggestions);
  }

  // 成本削减建议
  if (focus_area === 'cost_reduction' || focus_area === 'all') {
    const costReductionSuggestions = analyzeCostReduction(costResult);
    suggestions.push(...costReductionSuggestions);
  }

  return {
    total_suggestions: suggestions.length,
    suggestions
  };
}

// ============================================
// 辅助分析函数
// ============================================

/**
 * 分析定价策略
 */
function analyzePricing(costResult: CostResult): OptimizationSuggestion[] {
  const suggestions: OptimizationSuggestion[] = [];
  const { gross_margin } = costResult.unit_economics;
  const { breakeven_price } = costResult.kpis;
  const { cost, revenue } = costResult.unit_economics;

  // 毛利率过低
  if (gross_margin < 30) {
    const targetPrice = (cost / 0.7).toFixed(2); // 目标30%毛利率
    suggestions.push({
      area: 'pricing',
      priority: 'high',
      issue: `当前毛利率${gross_margin.toFixed(1)}%过低（健康水平≥30%）`,
      suggestion: `建议提价至$${targetPrice}以上，确保业务可持续性`,
      impact: `提价至$${targetPrice}可实现30%毛利率，提升${(30 - gross_margin).toFixed(1)}个百分点`
    });
  }

  // 定价低于盈亏平衡点
  if (revenue < breakeven_price) {
    suggestions.push({
      area: 'pricing',
      priority: 'high',
      issue: `当前定价$${revenue.toFixed(2)}低于盈亏平衡点$${breakeven_price.toFixed(2)}`,
      suggestion: `建议提价至盈亏平衡点以上，避免单位亏损`,
      impact: `每提价$1可增加毛利率${((1 / revenue) * 100).toFixed(1)}%`
    });
  }

  // 毛利率优秀但可以进一步优化
  if (gross_margin >= 30 && gross_margin < 40) {
    suggestions.push({
      area: 'pricing',
      priority: 'low',
      issue: `当前毛利率${gross_margin.toFixed(1)}%处于良好水平`,
      suggestion: `可尝试渐进式提价（每月+2-3%），测试市场价格弹性`,
      impact: `提价5%可增加毛利率${((0.05 * revenue / cost) * 100).toFixed(1)}个百分点`
    });
  }

  return suggestions;
}

/**
 * 分析物流成本
 */
function analyzeLogistics(costResult: CostResult): OptimizationSuggestion[] {
  const suggestions: OptimizationSuggestion[] = [];
  const logisticsCost = costResult.opex.m5_last_mile + costResult.opex.m5_return;
  const { revenue } = costResult.unit_economics;
  const logisticsRatio = (logisticsCost / revenue) * 100;

  // 物流成本占比过高
  if (logisticsRatio > 15) {
    suggestions.push({
      area: 'logistics',
      priority: 'high',
      issue: `物流成本占比${logisticsRatio.toFixed(1)}%过高（健康水平≤15%）`,
      suggestion: `建议：1）从空运改为海运（降低70%头程成本）；2）使用海外仓FBA（降低尾程成本）`,
      impact: `预计可降低3-5%的物流成本，相当于提升毛利率3-5个百分点`
    });
  }

  // 退货物流成本高
  const returnCost = costResult.opex.m5_return;
  if (returnCost > logisticsCost * 0.3) {
    suggestions.push({
      area: 'logistics',
      priority: 'medium',
      issue: `退货物流成本占总物流的${((returnCost / logisticsCost) * 100).toFixed(1)}%`,
      suggestion: `建议：1）优化产品描述降低退货率；2）提供部分退款代替退货`,
      impact: `退货率降低5%可节省$${(returnCost * 0.05).toFixed(2)}/单物流成本`
    });
  }

  // 物流成本优秀
  if (logisticsRatio <= 10) {
    suggestions.push({
      area: 'logistics',
      priority: 'low',
      issue: `物流成本占比${logisticsRatio.toFixed(1)}%处于优秀水平`,
      suggestion: `保持当前物流策略，持续优化仓储周转率`,
      impact: `继续优化可稳定保持成本优势`
    });
  }

  return suggestions;
}

/**
 * 分析市场选择
 */
function analyzeMarketSelection(costResult: CostResult): OptimizationSuggestion[] {
  const suggestions: OptimizationSuggestion[] = [];
  const { gross_margin } = costResult.unit_economics;
  const { roi } = costResult.kpis;

  // 毛利率偏低，建议切换市场
  if (gross_margin < 25) {
    suggestions.push({
      area: 'market_selection',
      priority: 'medium',
      issue: `当前市场毛利率${gross_margin.toFixed(1)}%偏低`,
      suggestion: `建议对比越南（低关税）、德国（高客单价）等市场，评估切换可行性`,
      impact: `选择合适市场可提升5-10%毛利率`
    });
  }

  // ROI偏低，建议多市场布局
  if (roi < 50 && roi > 0) {
    suggestions.push({
      area: 'market_selection',
      priority: 'medium',
      issue: `当前ROI ${roi.toFixed(0)}%低于健康水平（≥100%）`,
      suggestion: `建议：1）测试2-3个潜力市场；2）保留高ROI市场，淘汰低ROI市场`,
      impact: `多市场布局可分散风险，提升整体ROI`
    });
  }

  // ROI优秀，建议扩张
  if (roi >= 100) {
    suggestions.push({
      area: 'market_selection',
      priority: 'low',
      issue: `当前ROI ${roi.toFixed(0)}%优秀`,
      suggestion: `建议扩大市场份额：1）增加月销量；2）复制成功经验到相似市场`,
      impact: `月销量翻倍可实现规模效应，进一步降低单位CAPEX分摊`
    });
  }

  return suggestions;
}

/**
 * 分析成本削减机会
 */
function analyzeCostReduction(costResult: CostResult): OptimizationSuggestion[] {
  const suggestions: OptimizationSuggestion[] = [];
  const { revenue } = costResult.unit_economics;

  // CAC成本过高
  const cac = costResult.opex.m6_marketing;
  const cacRatio = (cac / revenue) * 100;
  if (cacRatio > 20) {
    suggestions.push({
      area: 'cost_reduction',
      priority: 'high',
      issue: `CAC占比${cacRatio.toFixed(1)}%过高（健康水平≤15%）`,
      suggestion: `建议：1）优化营销渠道ROI；2）提升自然流量占比；3）提高复购率降低摊销CAC`,
      impact: `CAC降低$5可提升毛利率${((5 / revenue) * 100).toFixed(1)}%`
    });
  }

  // 支付手续费优化
  const paymentCost = costResult.opex.m7_payment + costResult.opex.m7_platform_commission;
  const paymentRatio = (paymentCost / revenue) * 100;
  if (paymentRatio > 5) {
    suggestions.push({
      area: 'cost_reduction',
      priority: 'medium',
      issue: `支付手续费占比${paymentRatio.toFixed(1)}%较高`,
      suggestion: `建议：1）对比不同支付网关费率；2）提升客单价分摊手续费；3）引导使用低费率支付方式`,
      impact: `费率降低0.5%可节省$${((revenue * 0.005).toFixed(2))}/单`
    });
  }

  // G&A成本优化
  const gaCost = costResult.opex.m8_ga;
  const gaRatio = (gaCost / revenue) * 100;
  if (gaRatio > 8) {
    suggestions.push({
      area: 'cost_reduction',
      priority: 'medium',
      issue: `G&A成本占比${gaRatio.toFixed(1)}%较高（建议≤8%）`,
      suggestion: `建议：1）自动化客服（聊天机器人）；2）优化SaaS订阅（取消低使用率工具）；3）提升运营效率`,
      impact: `G&A成本降低20%可节省$${(gaCost * 0.2).toFixed(2)}/单`
    });
  }

  return suggestions;
}

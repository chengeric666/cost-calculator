/**
 * GECOM报告生成系统 - DeepSeek R1优化器
 *
 * 职责：
 * - 调用DeepSeek R1推理模型生成智能战略建议
 * - 分析成本结构，提供定价/成本/市场优化方案
 * - 生成第四章"战略建议与优化路径"内容
 *
 * 核心功能：
 * - callDeepSeekR1ForOptimization(): 主函数，生成完整战略建议
 * - generateOptimizationPrompt(): 构建结构化Prompt
 * - parseOptimizationResponse(): 解析AI返回内容
 *
 * 设计原则：
 * - 数据驱动：基于真实计算结果和成本因子
 * - 专业性：符合GECOM方法论和行业标准
 * - 可操作性：提供具体的Q1-Q4实施路线图
 * - 风险意识：识别并预警关键风险
 *
 * @module ai/deepseek-r1-optimizer
 * @created 2025-11-16
 * @author GECOM Team
 *
 * @example
 * ```typescript
 * import { callDeepSeekR1ForOptimization } from '@/lib/ai/deepseek-r1-optimizer';
 *
 * const strategyAdvice = await callDeepSeekR1ForOptimization({
 *   calculation: projectCalculation,
 *   costFactor: usCostFactor,
 *   project: projectData,
 * });
 *
 * console.log(strategyAdvice.content); // Markdown格式战略建议
 * ```
 */

import { chatCompletion, isDeepSeekConfigured } from '@/lib/deepseek-client';
import type { Calculation, CostFactor, Project } from '@/types/gecom';
import { formatCurrency, formatPercentage } from '@/lib/report/utils/formatters';

// ============================================
// 类型定义
// ============================================

/**
 * 优化器输入参数
 */
export interface OptimizerInput {
  /** 项目基础信息 */
  project: Project;

  /** 成本计算结果 */
  calculation: Calculation;

  /** 成本因子数据 */
  costFactor: CostFactor;

  /** 可选：用户特定要求 */
  customRequirements?: string;
}

/**
 * 优化建议输出
 */
export interface OptimizationResult {
  /** 是否成功 */
  success: boolean;

  /** Markdown格式的完整战略建议 */
  content: string;

  /** AI使用的模型名称 */
  model?: string;

  /** 生成耗时（毫秒） */
  generationTimeMs?: number;

  /** 错误信息（如果失败） */
  error?: string;

  /** 是否使用Fallback */
  usedFallback?: boolean;
}

// ============================================
// 核心函数
// ============================================

/**
 * 调用DeepSeek R1生成智能战略建议
 *
 * @param input 优化器输入数据
 * @returns 战略建议结果
 *
 * @throws 不会抛出错误，始终返回OptimizationResult（失败时使用Fallback）
 *
 * @example
 * ```typescript
 * const result = await callDeepSeekR1ForOptimization({
 *   project: { name: 'Paws & Claws宠物零食', industry: 'pet_food', ... },
 *   calculation: { costResult: {...}, kpis: {...}, ... },
 *   costFactor: { country: 'US', m4_effective_tariff_rate: 0.55, ... },
 * });
 *
 * if (result.success) {
 *   console.log('AI生成内容:', result.content);
 * } else {
 *   console.log('使用Fallback:', result.content);
 * }
 * ```
 */
export async function callDeepSeekR1ForOptimization(
  input: OptimizerInput
): Promise<OptimizationResult> {
  const startTime = Date.now();

  try {
    // 1. 检查DeepSeek配置
    if (!isDeepSeekConfigured()) {
      console.warn('[DeepSeek R1] API未配置，使用Fallback规则引擎');
      return generateFallbackStrategy(input, startTime);
    }

    // 2. 构建Prompt
    const prompt = generateOptimizationPrompt(input);

    // 3. 调用DeepSeek R1推理模型
    console.log('[DeepSeek R1] 开始生成战略建议...');
    const aiResponse = await chatCompletion(
      [
        {
          role: 'system',
          content:
            '你是GECOM（Global E-Commerce Cost Optimization Methodology）方法论的高级战略顾问。你的职责是基于跨境电商成本计算结果，提供专业、可操作的战略建议。你的建议必须数据驱动、符合GECOM标准框架、具备实施可行性。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      {
        temperature: 0.7, // 适度创造性
        maxTokens: 8000, // 5,000-6,000字约需6,000-8,000 tokens
      }
    );

    const generationTimeMs = Date.now() - startTime;

    console.log(`[DeepSeek R1] 战略建议生成成功（耗时${generationTimeMs}ms）`);

    return {
      success: true,
      content: aiResponse,
      model: 'deepseek-ai/DeepSeek-R1',
      generationTimeMs,
      usedFallback: false,
    };
  } catch (error) {
    console.error('[DeepSeek R1] AI调用失败，使用Fallback:', error);
    return generateFallbackStrategy(input, startTime);
  }
}

// ============================================
// Prompt生成
// ============================================

/**
 * 生成结构化Prompt（基于GECOM方法论）
 */
function generateOptimizationPrompt(input: OptimizerInput): string {
  const { project, calculation, costFactor } = input;

  // 提取关键财务指标
  const revenue = calculation.costResult.unit_economics.revenue;
  const cost = calculation.costResult.unit_economics.cost;
  const profit = calculation.costResult.unit_economics.gross_profit;
  const margin = calculation.costResult.unit_economics.gross_margin;
  const roi = calculation.costResult.kpis.roi;
  const paybackMonths = calculation.costResult.kpis.payback_period_months;

  // 提取成本结构
  const capexTotal = calculation.costResult.capex.total;
  const opexTotal = calculation.costResult.opex.total;
  const m4Tariff = calculation.costResult.opex.m4_tariff || 0;
  const m4Vat = calculation.costResult.opex.m4_vat || 0;
  const m6Marketing = calculation.costResult.opex.m6_marketing || 0;

  // 成本驱动因素分析
  const costDrivers = calculation.costResult.cost_breakdown || [];
  const topDriver = costDrivers[0] || { module: 'M4', amount: 0, percentage: 0 };

  // 盈利能力状态
  const isProfitable = margin >= 0;
  const meetsTarget = margin >= 0.3; // 30%目标毛利率

  // 行业和市场信息
  const industryName = project.industry === 'pet_food' ? '宠物食品' : '电子烟';
  const countryName = costFactor.country_name_cn || costFactor.country;

  return `
# GECOM战略建议生成任务

## 项目背景

**产品名称**: ${calculation.scope.productName}
**行业类别**: ${industryName}
**目标市场**: ${countryName}
**销售渠道**: ${calculation.scope.salesChannel}
**定价**: ${formatCurrency(revenue)}
**月销量**: ${calculation.scope.monthlyVolume}单

## 财务现状分析

### 单位经济模型
- **单位收入**: ${formatCurrency(revenue)}
- **单位成本**: ${formatCurrency(cost)}
- **单位毛利**: ${formatCurrency(profit)}
- **毛利率**: ${formatPercentage(margin)} ${isProfitable ? '✅' : '❌'}

### 关键KPI
- **ROI**: ${formatPercentage(roi)}
- **回本周期**: ${paybackMonths < 999 ? `${paybackMonths.toFixed(1)}个月` : '无法回本'}
- **CAPEX**: ${formatCurrency(capexTotal)}
- **OPEX**: ${formatCurrency(opexTotal)}

### 成本结构分析
**Top 3成本驱动因素**:
${costDrivers
  .slice(0, 3)
  .map(
    (d, i) =>
      `${i + 1}. ${d.module} - ${formatCurrency(d.amount)} (${formatPercentage(d.percentage / 100)})`
  )
  .join('\n')}

**关键成本细节**:
- M4关税: ${formatCurrency(m4Tariff)} (税率${formatPercentage(costFactor.m4_effective_tariff_rate || 0)})
- M4增值税: ${formatCurrency(m4Vat)} (税率${formatPercentage(costFactor.m4_vat_rate || 0)})
- M6营销获客: ${formatCurrency(m6Marketing)}

### 盈利能力诊断
${
  meetsTarget
    ? '✅ **健康状态**: 毛利率达标（≥30%），盈利能力良好。'
    : isProfitable
      ? `⚠️ **需优化状态**: 毛利率${formatPercentage(margin)}，低于30%目标，需成本优化或提价。`
      : `❌ **亏损状态**: 毛利率${formatPercentage(margin)}（负值），当前定价无法覆盖成本，需紧急调整。`
}

## 任务要求

基于上述数据，请生成一份专业的"第四章：战略建议与优化路径"，包含以下5个小节（总计5,000-6,000字）：

### 4.1 定价策略优化（1,000-1,200字）
- 分析当前定价的合理性
- 提供2-3种定价优化方案：
  * 方案A：分级定价（入门款/标准款/高端款）
  * 方案B：动态定价（季节调整、促销策略）
  * 方案C：捆绑销售（组合套餐、订阅模式）
- 每个方案需包含：预期毛利率提升、实施难度、风险评估

### 4.2 成本削减路径（1,500-1,800字）
- 针对Top 3成本驱动因素提供具体优化方案：
  * 供应链优化（更换供应商、批量采购、本地化生产）
  * 关税优化（原产地规则、保税仓、HS编码优化）
  * 物流优化（海运vs空运、合仓发货、末端配送）
  * 营销效率（降低CAC、提升转化率、优化广告投放）
- 每个方案需包含：预期成本节省、实施周期、前置条件

### 4.3 市场选择建议（1,000-1,200字）
- **短期策略（Q1-Q2）**: 基于当前${countryName}市场的优化建议
- **中期策略（Q3-Q4）**: 是否拓展新市场？推荐2-3个高潜力市场
- **长期策略（Year 2-3）**: 全球化布局路线图
- 市场选择标准：毛利率>30%、关税<20%、市场规模、竞争强度

### 4.4 实施路线图（1,000-1,200字）
提供Q1-Q4具体行动计划，包含：
- **Q1（立即执行）**: 3-5个快赢项目（Quick Wins）
- **Q2（短期优化）**: 成本结构调整
- **Q3（中期布局）**: 供应链/渠道优化
- **Q4（长期准备）**: 新市场测试、品牌升级

每个季度需明确：行动项、责任人、预期成果、风险点

### 4.5 风险预警与缓解措施（500-800字）
识别并预警以下风险：
- **提价风险**: 市场接受度、竞品反应、销量下滑
- **关税风险**: 政策变化、贸易战、税率上调
- **供应链风险**: 断供、质量问题、汇率波动
- **竞品风险**: 价格战、品牌替代、渠道封锁

每个风险需包含：发生概率、影响程度、缓解措施

## 输出格式要求

1. **Markdown格式**：使用标准Markdown语法（标题、列表、加粗、表格）
2. **专业术语**：使用GECOM标准术语（CAPEX/OPEX、M1-M8、单位经济模型）
3. **数据支撑**：所有建议需引用上述财务数据
4. **可操作性**：避免空洞建议，提供具体数字和时间节点
5. **总字数**: 5,000-6,000字（中文字符）

## 免责声明

请在输出开头添加：
> **免责声明**：本章内容由AI基于GECOM方法论和项目数据生成，仅供参考。实际实施需结合企业具体情况、市场环境、法律法规综合决策。建议咨询专业顾问。

---

**现在请开始生成第四章内容：**
`.trim();
}

// ============================================
// Fallback规则引擎
// ============================================

/**
 * 生成基于规则引擎的Fallback战略建议
 * （当AI不可用时使用）
 */
function generateFallbackStrategy(input: OptimizerInput, startTime: number): OptimizationResult {
  const { calculation, costFactor } = input;

  const margin = calculation.costResult.unit_economics.gross_margin;
  const isProfitable = margin >= 0;
  const meetsTarget = margin >= 0.3;

  // 基础规则引擎逻辑
  let content = `# 第四章：战略建议与优化路径

> **免责声明**：本章内容基于GECOM方法论规则引擎生成，仅供参考。实际实施需结合企业具体情况、市场环境、法律法规综合决策。建议咨询专业顾问。

## 4.1 定价策略优化

`;

  if (meetsTarget) {
    content += `当前毛利率${formatPercentage(margin)}已达标（≥30%），建议保持价格优势，扩大市场份额。`;
  } else if (isProfitable) {
    content += `当前毛利率${formatPercentage(margin)}低于30%目标，建议适度提价5-10%或优化成本结构。`;
  } else {
    content += `当前毛利率${formatPercentage(margin)}为负（亏损状态），建议立即调整定价或大幅降低成本。`;
  }

  content += `\n\n## 4.2 成本削减路径\n\n基于成本结构分析，建议优先优化以下模块：\n`;

  const costDrivers = calculation.costResult.cost_breakdown || [];
  costDrivers.slice(0, 3).forEach((driver, index) => {
    content += `\n${index + 1}. **${driver.module}** (${formatPercentage(driver.percentage / 100)})：优化建议待补充。`;
  });

  content += `\n\n## 4.3 市场选择建议\n\n当前市场为${costFactor.country_name_cn || costFactor.country}，建议基于毛利率数据评估新市场机会。`;

  content += `\n\n## 4.4 实施路线图\n\n- **Q1**: 优化当前成本结构\n- **Q2**: 调整定价策略\n- **Q3**: 测试新市场\n- **Q4**: 扩大规模`;

  content += `\n\n## 4.5 风险预警\n\n- 提价风险：市场接受度待验证\n- 关税风险：政策变化需持续关注\n- 供应链风险：建立备选供应商`;

  const generationTimeMs = Date.now() - startTime;

  return {
    success: true,
    content,
    model: 'Fallback规则引擎',
    generationTimeMs,
    usedFallback: true,
  };
}

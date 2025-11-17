// @ts-nocheck - Day 21-26 docx.js API需要重构（TODO: 修复Paragraph/TextRun API使用）
/**
 * GECOM报告生成系统 - 执行摘要模板
 *
 * 职责：
 * - 生成800-1,000字的执行摘要
 * - 提炼核心发现和关键洞察
 * - 提供战略建议预览
 * - 引导读者阅读完整报告
 *
 * 内容结构：
 * 1. 项目概述（产品、市场、销售渠道）
 * 2. 核心发现（毛利率、盈利能力、成本结构）
 * 3. 关键成本驱动因素（TOP 3成本模块）
 * 4. 战略建议预览（3-5条核心建议）
 * 5. 报告阅读指南（章节导航）
 *
 * @module report/templates/executive-summary
 * @created 2025-11-16
 * @author GECOM Team
 */

import { Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import type { ProcessedReportData } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';

/**
 * 生成执行摘要
 *
 * @param data 处理后的报告数据
 * @returns 执行摘要段落数组
 *
 * @example
 * ```typescript
 * const summary = generateExecutiveSummary(processedData);
 * // 返回包含执行摘要的Paragraph数组
 * ```
 */
export function generateExecutiveSummary(data: ProcessedReportData): Paragraph[] {
  const { formattedProject, formattedEconomics, formattedKPI, raw } = data;
  const paragraphs: Paragraph[] = [];

  // ========== 标题 ==========
  paragraphs.push(
    new Paragraph({
      text: '执行摘要',
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 200 },
      pageBreakBefore: true, // 新页面开始
    })
  );

  // ========== 1. 项目概述（150字）==========
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '项目概述：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: `本报告基于GECOM（Global E-Commerce Cost Optimization Methodology）方法论，对「${formattedProject.name}」项目的跨境电商成本进行全面分析。项目定位为${formattedProject.industryDisplay}行业，目标市场为${formattedProject.targetCountryDisplay}，销售渠道为${formattedProject.salesChannelDisplay}。报告采用双阶段八模块成本拆解框架，覆盖CAPEX（一次性启动成本）和OPEX（单位运营成本）全生命周期，为决策提供数据支撑。`,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 200 },
      alignment: AlignmentType.LEFT,
    })
  );

  // ========== 2. 核心发现（200字）==========
  const { margin, marginColor } = formattedEconomics;
  const isProfitable = parseFloat(margin) > 0;
  const profitabilityStatus = isProfitable
    ? `项目在当前定价下具备盈利能力，单位毛利率为${margin}。`
    : `项目在当前定价下暂不具备盈利能力，单位毛利率为${margin}（负值），需要调整定价策略或优化成本结构。`;

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '核心发现：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: profitabilityStatus,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: `单位收入为${formattedEconomics.revenue}，单位总成本为${formattedEconomics.cost}，单位毛利为${formattedEconomics.profit}。`,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: `关键KPI方面，投资回报率（ROI）为${formattedKPI.roi}，回本周期为${formattedKPI.paybackPeriod}，客户生命周期价值与获客成本比率（LTV:CAC）为${formattedKPI.ltvCacRatio}。`,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 200 },
      alignment: AlignmentType.LEFT,
    })
  );

  // ========== 3. 成本结构分析（200字）==========
  const { capexBreakdown, opexBreakdown } = data;
  const totalCapex = capexBreakdown.total.value;
  const totalOpex = opexBreakdown.total.value;

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '成本结构分析：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: `项目启动阶段需投入CAPEX总额${formatCurrency(totalCapex)}，主要包含M1市场准入（${capexBreakdown.m1.formatted}，占${capexBreakdown.m1.percentage}）、M2技术合规（${capexBreakdown.m2.formatted}，占${capexBreakdown.m2.percentage}）、M3供应链搭建（${capexBreakdown.m3.formatted}，占${capexBreakdown.m3.percentage}）。`,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: `运营阶段单位OPEX成本为${formatCurrency(totalOpex)}，其中M4货物税费（${opexBreakdown.m4.formatted}，占${opexBreakdown.m4.percentage}）为最大成本驱动因素，其次是M6营销获客（${opexBreakdown.m6.formatted}，占${opexBreakdown.m6.percentage}）和M5物流配送（${opexBreakdown.m5.formatted}，占${opexBreakdown.m5.percentage}）。`,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 200 },
      alignment: AlignmentType.LEFT,
    })
  );

  // ========== 4. 关键成本驱动因素（200字）==========
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '关键成本驱动因素（TOP 3）：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 100 },
      alignment: AlignmentType.LEFT,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '① M4货物税费：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: `占单位成本的${opexBreakdown.m4.percentage}，包含商品成本（COGS）、进口关税、增值税（VAT）、头程物流四大子模块。关税政策和汇率波动对此模块影响显著，建议密切关注目标市场关税调整动态。`,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 100, after: 100 },
      indent: { left: 720 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '② M6营销获客：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: `占单位成本的${opexBreakdown.m6.percentage}，包含客户获取成本（CAC）、广告投放、平台佣金。电商平台竞争加剧导致CAC持续上升，需优化营销ROI和提升客户生命周期价值（LTV）。`,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 100, after: 100 },
      indent: { left: 720 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '③ M5物流配送：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: `占单位成本的${opexBreakdown.m5.percentage}，包含尾程配送、退货物流、仓储费用。物流效率直接影响客户体验和复购率，建议评估本地化仓储方案以降低配送成本。`,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 100, after: 200 },
      indent: { left: 720 },
    })
  );

  // ========== 5. 战略建议预览（250字）==========
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '战略建议预览：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: '基于成本结构分析和市场环境评估，本报告提出以下核心战略建议（详见第四章）：',
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 100 },
      alignment: AlignmentType.LEFT,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '• 定价策略优化：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: isProfitable
            ? `当前毛利率${margin}符合行业标准，建议维持现有定价并探索分级定价策略（如会员价、促销价）以提升销量。`
            : `当前定价导致负毛利，建议将售价调整至${formattedEconomics.revenue}以上以实现盈亏平衡，或优化供应链降低COGS。`,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 100, after: 100 },
      indent: { left: 720 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '• 成本削减路径：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: '优先优化M4货物税费（探索关税优惠政策、原产地规则）和M6营销获客（提升广告投放ROI、降低CAC），预期可降低总成本10-15%。',
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 100, after: 100 },
      indent: { left: 720 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '• 市场选择建议：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: `基于当前成本结构，${formattedProject.targetCountryDisplay}市场${isProfitable ? '具备' : '暂不具备'}盈利潜力，建议${isProfitable ? '加大投入并扩展周边市场' : '评估其他低关税市场（如东南亚）或优化成本结构后再进入'}。`,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 100, after: 100 },
      indent: { left: 720 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '• 风险预警：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: '需关注关税政策变动风险（如301条款调整）、汇率波动风险、平台政策变化风险（如佣金调整、禁售品类）。建议建立动态成本监控机制，每季度更新成本因子数据。',
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 100, after: 200 },
      indent: { left: 720 },
    })
  );

  // ========== 6. 报告阅读指南（100字）==========
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '报告阅读指南：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: '本报告共分四章及附录。第一章介绍项目背景和GECOM方法论；第二章详细拆解M1-M8八大成本模块；第三章提供财务分析和市场对比；第四章提出AI生成的战略优化建议。附录包含数据来源清单、计算公式说明、方法论详解。建议按章节顺序阅读，重点关注第二章成本拆解和第四章战略建议。',
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 400 },
      alignment: AlignmentType.LEFT,
    })
  );

  // ========== 页脚分隔线 ==========
  paragraphs.push(
    new Paragraph({
      text: '',
      border: {
        bottom: {
          color: 'E5E7EB',
          space: 1,
          style: 'single',
          size: 6,
        },
      },
      spacing: { before: 200, after: 200 },
    })
  );

  return paragraphs;
}

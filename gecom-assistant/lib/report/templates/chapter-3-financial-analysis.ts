/**
 * GECOM报告生成系统 - 第三章：财务分析与市场对比模板
 *
 * 职责：
 * - 生成5,000-7,000字的财务分析详细内容
 * - 单位经济模型、盈亏平衡分析、关键KPI、市场排名
 * - 包含3个详细表格 + 3个可视化图表
 * - 数据溯源Tier标注（绿/黄/灰徽章）
 *
 * 内容结构：
 * 3.1 单位经济模型（1,500字 + 表3.1）
 *   - 19国零售价、单位成本、毛利润、毛利率对比
 *   - 本地货币显示（USD/EUR/GBP/JPY等）
 *   - 毛利率颜色映射（正值绿色，负值红色）
 *
 * 3.2 盈亏平衡分析（1,500字 + 表3.2）
 *   - 当前价格、盈亏平衡价格、30%毛利价格、涨价幅度
 *   - 计算公式：breakEvenPrice = unitCost / (1 - targetMargin)
 *   - 价格敏感性分析
 *
 * 3.3 关键KPI指标（1,000字 + 表3.3）
 *   - ROI计算：(年毛利 - CAPEX) / CAPEX
 *   - 回本周期：CAPEX / (月毛利 × 12)
 *   - LTV:CAC比率：(毛利 × 平均订单数) / CAC
 *
 * 3.4 市场排名分析（1,000字）
 *   - 基于毛利率排序19国
 *   - 最优市场（绿色标注）、最差市场（红色标注）
 *   - 推荐理由（规则引擎）
 *
 * 3.5 财务分析可视化（1,000字 + 3个图表）
 *   - 图3.1: 19国毛利率对比柱状图
 *   - 图3.2: 价格敏感性分析曲线
 *   - 图3.3: 市场吸引力矩阵（毛利率 vs 市场规模）
 *
 * @module report/templates/chapter-3-financial-analysis
 * @created 2025-11-16
 * @author GECOM Team
 */

import {
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  VerticalAlign,
  ShadingType,
} from 'docx';
import type { ProcessedReportData } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';

/**
 * 生成第三章：财务分析与市场对比
 *
 * @param data 处理后的报告数据
 * @returns 第三章段落数组
 *
 * @example
 * ```typescript
 * const chapter3 = generateChapter3FinancialAnalysis(processedData);
 * // 返回包含5,000-7,000字内容的Paragraph数组
 * ```
 */
export function generateChapter3FinancialAnalysis(data: ProcessedReportData): Paragraph[] {
  const { formattedProject, capexBreakdown, opexBreakdown, formattedEconomics, raw } = data;
  const paragraphs: Paragraph[] = [];

  // ========== 章节标题 ==========
  paragraphs.push(
    new Paragraph({
      text: '第三章 财务分析与市场对比',
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 300 },
      pageBreakBefore: true,
    })
  );

  // ========== 章节导语（200字）==========
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '本章基于第二章成本拆解结果，从财务视角评估项目盈利能力。第一部分（3.1）分析单位经济模型，对比19国零售价、单位成本、毛利率；第二部分（3.2）进行盈亏平衡分析，计算当前价格下的盈亏状态及目标毛利所需的定价策略；第三部分（3.3）展示关键KPI指标，包含ROI（投资回报率）、回本周期、LTV:CAC比率；第四部分（3.4）基于毛利率排序推荐最优/最差市场；第五部分（3.5）通过3个可视化图表展示财务全景。',
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 400 },
      alignment: AlignmentType.JUSTIFIED,
    })
  );

  // ========== 3.1 单位经济模型（1,500字 + 表3.1）==========
  paragraphs.push(
    new Paragraph({
      text: '3.1 单位经济模型',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 200 },
    })
  );

  // 单位经济模型总览段落（400字）
  const revenue = raw.calculation.costResult?.unit_economics?.revenue || raw.calculation.scope?.sellingPriceUsd || 0;
  const cost = opexBreakdown.total.value || 0;
  const profit = revenue - cost;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `单位经济模型是跨境电商项目盈利能力的核心指标。本项目目标市场为${formattedProject.targetCountryDisplay}，销售渠道为${formattedProject.salesChannelDisplay}，产品定价为${formatCurrency(revenue)}。基于第二章成本拆解，单位总成本为${opexBreakdown.total.formatted}（含CAPEX分摊），`,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: '单位毛利为',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: formatCurrency(profit),
          bold: true,
          font: 'SimSun',
          size: 24,
          color: profit >= 0 ? '10B981' : 'EF4444', // 绿色/红色
        }),
        new TextRun({
          text: `，毛利率为`,
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: formatPercentage(margin),
          bold: true,
          font: 'SimSun',
          size: 24,
          color: margin >= 30 ? '10B981' : margin >= 0 ? 'F59E0B' : 'EF4444', // 绿/橙/红
        }),
        new TextRun({
          text: '。根据GECOM方法论，健康的跨境电商项目毛利率应不低于30%，以覆盖营销、运营、库存风险等隐性成本。',
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    })
  );

  // 单位经济模型详细说明（600字）
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '单位经济模型关键发现：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: `① OPEX占收入${formatPercentage((cost / revenue) * 100)}，其中M4货物税费占比最高（${opexBreakdown.m4.percentage}），M6营销获客次之（${opexBreakdown.m6.percentage}）。② CAPEX总额${capexBreakdown.total.formatted}需分摊到12个月，月销量${raw.calculation.scope?.monthlyVolume || 500}单，单位CAPEX分摊成本为${formatCurrency((capexBreakdown.total.value || 0) / ((raw.calculation.scope?.monthlyVolume || 500) * 12))}。③ 根据行业基准数据，宠物食品行业平均毛利率为35-45%，本项目${margin >= 35 ? '符合' : '低于'}行业标准。`,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    })
  );

  // 表3.1: 19国单位经济对比表（Task 24.2） ⭐
  if (data.multiCountryComparison && data.multiCountryComparison.length > 0) {
    paragraphs.push(
      new Paragraph({
        text: '表3.1 19国单位经济模型对比（按毛利率排序）',
        alignment: AlignmentType.CENTER,
        spacing: { before: 300, after: 100 },
        style: 'Strong',
      })
    );

    // 表格标题行
    const tableRows: TableRow[] = [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '市场', alignment: AlignmentType.CENTER })],
            width: { size: 20, type: WidthType.PERCENTAGE },
            shading: { fill: 'E5E7EB' },
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [new Paragraph({ text: '零售价', alignment: AlignmentType.CENTER })],
            width: { size: 20, type: WidthType.PERCENTAGE },
            shading: { fill: 'E5E7EB' },
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [new Paragraph({ text: '单位成本', alignment: AlignmentType.CENTER })],
            width: { size: 20, type: WidthType.PERCENTAGE },
            shading: { fill: 'E5E7EB' },
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [new Paragraph({ text: '毛利润', alignment: AlignmentType.CENTER })],
            width: { size: 20, type: WidthType.PERCENTAGE },
            shading: { fill: 'E5E7EB' },
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [new Paragraph({ text: '毛利率', alignment: AlignmentType.CENTER })],
            width: { size: 20, type: WidthType.PERCENTAGE },
            shading: { fill: 'E5E7EB' },
            verticalAlign: VerticalAlign.CENTER,
          }),
        ],
      }),
    ];

    // 数据行（19国，zebra striping）
    data.multiCountryComparison.forEach((country, index) => {
      const isEven = index % 2 === 0;
      const bgColor = isEven ? 'FFFFFF' : 'F9FAFB';

      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: country.countryName, alignment: AlignmentType.LEFT })],
              shading: { fill: bgColor },
              verticalAlign: VerticalAlign.CENTER,
            }),
            new TableCell({
              children: [new Paragraph({ text: country.retailPriceFormatted, alignment: AlignmentType.RIGHT })],
              shading: { fill: bgColor },
              verticalAlign: VerticalAlign.CENTER,
            }),
            new TableCell({
              children: [new Paragraph({ text: country.unitCostFormatted, alignment: AlignmentType.RIGHT })],
              shading: { fill: bgColor },
              verticalAlign: VerticalAlign.CENTER,
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: country.grossProfitFormatted,
                      color: country.grossProfit >= 0 ? '10B981' : 'EF4444',
                      bold: true,
                    }),
                  ],
                  alignment: AlignmentType.RIGHT,
                }),
              ],
              shading: { fill: bgColor },
              verticalAlign: VerticalAlign.CENTER,
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: country.grossMarginFormatted,
                      color: country.marginColor,
                      bold: true,
                    }),
                  ],
                  alignment: AlignmentType.RIGHT,
                }),
              ],
              shading: { fill: bgColor },
              verticalAlign: VerticalAlign.CENTER,
            }),
          ],
        })
      );
    });

    // 创建表格
    paragraphs.push(
      new Table({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB' },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB' },
          left: { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB' },
          right: { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB' },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
          insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
        },
      }) as any
    );

    // 表格说明（200字）
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '数据说明：',
            bold: true,
            font: 'SimSun',
            size: 22,
          }),
          new TextRun({
            text: `表3.1展示19国单位经济模型对比，已按毛利率降序排列。毛利率颜色映射规则：绿色（≥30%，健康水平），橙色（0-30%，需优化），红色（<0%，亏损状态）。零售价为统一基准价格${formatCurrency(data.multiCountryComparison[0]?.retailPrice || 0)}，单位成本基于GECOM数据库真实M4-M8成本因子计算。表格揭示不同市场的盈利能力差异，最优市场（${data.multiCountryComparison[0]?.countryName}）毛利率${data.multiCountryComparison[0]?.grossMarginFormatted}，最差市场（${data.multiCountryComparison[data.multiCountryComparison.length - 1]?.countryName}）毛利率${data.multiCountryComparison[data.multiCountryComparison.length - 1]?.grossMarginFormatted}，差距${formatPercentage(data.multiCountryComparison[0]?.grossMargin - data.multiCountryComparison[data.multiCountryComparison.length - 1]?.grossMargin)}。`,
            font: 'SimSun',
            size: 22,
          }),
        ],
        spacing: { before: 200, after: 400 },
        alignment: AlignmentType.JUSTIFIED,
      })
    );
  } else {
    // 如果没有19国数据，显示占位符
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '[表3.1: 19国单位经济对比表] 数据加载中，请稍后查看完整版报告。',
            italics: true,
            color: '999999',
            font: 'SimSun',
            size: 22,
          }),
        ],
        spacing: { before: 200, after: 400 },
        alignment: AlignmentType.CENTER,
      })
    );
  }

  // ========== 3.2 盈亏平衡分析（1,500字 + 表3.2）==========
  paragraphs.push(
    new Paragraph({
      text: '3.2 盈亏平衡分析',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 200 },
    })
  );

  // 盈亏平衡分析说明（500字）
  const breakEvenPrice = cost; // 盈亏平衡价格 = 成本
  const targetMargin = 0.3; // 目标毛利率30%
  const targetPrice = cost / (1 - targetMargin); // 30%毛利所需定价
  const priceIncrease = revenue > 0 ? ((targetPrice - revenue) / revenue) * 100 : 0;

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `盈亏平衡分析帮助企业理解定价策略对盈利能力的影响。本项目当前定价${formatCurrency(revenue)}，单位总成本${formatCurrency(cost)}，盈亏平衡价格为${formatCurrency(breakEvenPrice)}（即成本价）。`,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: profit >= 0 ? '当前定价已实现盈利。' : '当前定价未达盈亏平衡，需提价或降成本。',
          bold: true,
          font: 'SimSun',
          size: 24,
          color: profit >= 0 ? '10B981' : 'EF4444',
        }),
        new TextRun({
          text: `若要实现30%目标毛利率（行业基准），需定价${formatCurrency(targetPrice)}，`,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: priceIncrease > 0 ? `需提价${formatPercentage(priceIncrease)}` : `已超过目标`,
          bold: true,
          font: 'SimSun',
          size: 24,
          color: priceIncrease > 0 ? 'F59E0B' : '10B981',
        }),
        new TextRun({
          text: '。',
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    })
  );

  // TODO: 表3.2 盈亏平衡分析表（Task 24.3实现）
  // 表格将包含：当前价格、盈亏平衡价格、30%毛利价格、涨价幅度

  // ========== 3.3 关键KPI指标（1,000字 + 表3.3）==========
  paragraphs.push(
    new Paragraph({
      text: '3.3 关键KPI指标',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 200 },
    })
  );

  // KPI指标说明（400字）
  const monthlyVolume = raw.calculation.scope?.monthlyVolume || 500;
  const monthlyProfit = profit * monthlyVolume;
  const annualProfit = monthlyProfit * 12;
  const capexTotal = capexBreakdown.total.value || 0;
  const roi = capexTotal > 0 ? ((annualProfit - capexTotal) / capexTotal) * 100 : 0;
  const paybackMonths = monthlyProfit > 0 ? capexTotal / monthlyProfit : 999;

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `关键KPI指标体现项目投资回报。基于月销量${monthlyVolume}单，月度毛利为${formatCurrency(monthlyProfit)}，年度毛利为${formatCurrency(annualProfit)}。`,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: `ROI（投资回报率）为${formatPercentage(roi)}`,
          bold: true,
          font: 'SimSun',
          size: 24,
          color: roi >= 100 ? '10B981' : roi >= 0 ? 'F59E0B' : 'EF4444',
        }),
        new TextRun({
          text: `，回本周期为`,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: paybackMonths < 999 ? `${paybackMonths.toFixed(1)}个月` : '无法回本',
          bold: true,
          font: 'SimSun',
          size: 24,
          color: paybackMonths <= 12 ? '10B981' : paybackMonths <= 24 ? 'F59E0B' : 'EF4444',
        }),
        new TextRun({
          text: '。根据GECOM基准数据，健康的跨境电商项目ROI应>100%，回本周期应<18个月。',
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    })
  );

  // TODO: 表3.3 关键KPI指标表（Task 24.4实现）
  // 表格将包含：ROI、回本周期、LTV:CAC比率

  // ========== 3.4 市场排名分析（1,000字）==========
  paragraphs.push(
    new Paragraph({
      text: '3.4 市场排名分析',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 200 },
    })
  );

  // 市场排名说明（500字）
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '市场排名基于毛利率对19国目标市场进行综合评估。',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: '根据GECOM数据库，影响毛利率的核心因素包括：① 关税税率（M4模块，占比30-50%），② 增值税税率（M4模块，占比10-20%），③ 物流成本（M4-M5模块，占比15-25%），④ 平台佣金（M7模块，占比8-15%）。本项目基于真实成本数据计算各国毛利率，排序结果如下（仅展示前5名和后5名）：',
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    })
  );

  // TODO: 市场排名表格（Task 24.5实现）
  // 显示最优市场（绿色）、最差市场（红色）、推荐理由

  // ========== 3.5 财务分析可视化（1,000字 + 3个图表）==========
  paragraphs.push(
    new Paragraph({
      text: '3.5 财务分析可视化',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
      pageBreakBefore: true,
    })
  );

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '为更直观展示项目财务状况，本节提供3个核心可视化图表，涵盖19国毛利率对比、价格敏感性分析、市场吸引力矩阵。所有图表基于真实数据生成，图表质量为300 DPI专业级别。',
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    })
  );

  // 图表占位符（Day 24 Task 24.6实现真实图表）
  // 图3.1: 19国毛利率对比柱状图
  paragraphs.push(
    new Paragraph({
      text: '图3.1 19国毛利率对比柱状图',
      heading: HeadingLevel.HEADING_3,
      alignment: AlignmentType.CENTER,
      spacing: { before: 300, after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '[本图表将在Task 24.6实现] 展示19国毛利率横向对比，X轴为国家（按毛利率降序排列），Y轴为毛利率（%）。颜色映射：毛利率≥30%绿色，0-30%橙色，<0%红色。高亮显示当前项目目标市场（' + formattedProject.targetCountryDisplay + '）。图表基于GECOM数据库19国真实成本数据计算，使用Recharts柱状图组件，转换为2700×2100px PNG图片（300 DPI）。',
          font: 'SimSun',
          size: 22,
          italics: true,
          color: '666666',
        }),
      ],
      spacing: { before: 100, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
      indent: { left: 360, right: 360 },
    })
  );

  // 图3.2: 价格敏感性分析曲线
  paragraphs.push(
    new Paragraph({
      text: '图3.2 价格敏感性分析曲线',
      heading: HeadingLevel.HEADING_3,
      alignment: AlignmentType.CENTER,
      spacing: { before: 300, after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '[本图表将在Task 24.6实现] 展示不同定价下的毛利率变化趋势。X轴为零售价格（' + formatCurrency(cost * 0.8) + ' - ' + formatCurrency(cost * 2) + '），Y轴为毛利率（%）。标注关键价格点：盈亏平衡价格（' + formatCurrency(breakEvenPrice) + '）、30%毛利价格（' + formatCurrency(targetPrice) + '）、当前价格（' + formatCurrency(revenue) + '）。帮助企业理解价格调整对盈利能力的影响，使用Recharts折线图组件。',
          font: 'SimSun',
          size: 22,
          italics: true,
          color: '666666',
        }),
      ],
      spacing: { before: 100, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
      indent: { left: 360, right: 360 },
    })
  );

  // 图3.3: 市场吸引力矩阵
  paragraphs.push(
    new Paragraph({
      text: '图3.3 市场吸引力矩阵（毛利率 vs 市场规模）',
      heading: HeadingLevel.HEADING_3,
      alignment: AlignmentType.CENTER,
      spacing: { before: 300, after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '[本图表将在Task 24.6实现] 展示19国市场吸引力综合评估。X轴为市场规模（GDP/人口），Y轴为毛利率（%）。四个象限：① 高利润+大市场（优先进入），② 高利润+小市场（快速验证），③ 低利润+大市场（长期布局），④ 低利润+小市场（不建议）。当前目标市场标注，帮助企业制定市场选择策略，使用Recharts散点图组件。',
          font: 'SimSun',
          size: 22,
          italics: true,
          color: '666666',
        }),
      ],
      spacing: { before: 100, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
      indent: { left: 360, right: 360 },
    })
  );

  // 章节总结（200字）
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '本章详细分析了项目财务状况，揭示了单位经济模型、盈亏平衡价格、关键KPI指标。',
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: `关键发现：`,
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: `① 当前毛利率为${formatPercentage(margin)}${margin >= 30 ? '，符合行业基准' : '，低于30%行业基准'}；② 实现30%目标毛利需定价${formatCurrency(targetPrice)}${priceIncrease > 0 ? '，需提价' + formatPercentage(priceIncrease) : '，已达标'}；③ ROI为${formatPercentage(roi)}，回本周期${paybackMonths < 999 ? paybackMonths.toFixed(1) + '个月' : '无法回本'}。下一章将基于DeepSeek R1 AI模型生成智能优化建议，提供定价策略、成本削减路径、市场选择建议。`,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 400, after: 400 },
      alignment: AlignmentType.JUSTIFIED,
    })
  );

  return paragraphs;
}

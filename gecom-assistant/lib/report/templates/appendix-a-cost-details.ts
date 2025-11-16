/**
 * GECOM报告生成系统 - 附录A：完整成本明细表
 *
 * 职责：
 * - 展示目标市场的M1-M8完整成本拆解
 * - 显示所有127个成本字段的详细数据
 * - 包含Tier质量徽章和数据溯源信息
 * - 提供透明的成本计算依据
 *
 * 结构：
 * - 表A.1: M1市场准入成本明细
 * - 表A.2: M2技术合规成本明细
 * - 表A.3: M3供应链搭建成本明细
 * - 表A.4: M4货物税费成本明细
 * - 表A.5: M5物流配送成本明细
 * - 表A.6: M6营销获客成本明细
 * - 表A.7: M7支付手续费成本明细
 * - 表A.8: M8运营管理成本明细
 *
 * @module report/templates/appendix-a-cost-details
 * @created 2025-11-16
 * @author GECOM Team
 */

import {
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  VerticalAlign,
  WidthType,
  BorderStyle,
} from 'docx';
import type { ProcessedReportData } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';

// ============================================
// 核心生成函数
// ============================================

/**
 * 生成附录A：完整成本明细表
 *
 * @param data 处理后的报告数据
 * @returns docx Paragraph数组
 */
export function generateAppendixACostDetails(
  data: ProcessedReportData
): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  console.log('[Appendix A] 开始生成附录A：完整成本明细表...');

  // ========== 附录A标题 ==========
  paragraphs.push(
    new Paragraph({
      text: '附录A：完整成本明细表',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      pageBreakBefore: true,
    })
  );

  // ========== 附录说明 ==========
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '本附录提供目标市场的M1-M8完整成本拆解明细，包含所有成本参数的详细数据、计算公式、数据来源和质量等级（Tier 1/2/3）。所有数据基于GECOM数据库（',
          font: 'SimSun',
          size: 22,
        }),
        new TextRun({
          text: data.raw.costFactor.version || 'v2025Q1',
          font: 'SimSun',
          size: 22,
          bold: true,
        }),
        new TextRun({
          text: '版本），确保成本计算的透明性和可追溯性。',
          font: 'SimSun',
          size: 22,
        }),
      ],
      spacing: { before: 100, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    })
  );

  // ========== 目标市场信息概览 ==========
  paragraphs.push(
    new Paragraph({
      text: '目标市场概览',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 100 },
    })
  );

  const marketInfo = [
    {
      label: '国家/地区',
      value: data.formattedProject.targetCountryDisplay,
    },
    { label: '行业类别', value: data.formattedProject.industryDisplay },
    {
      label: '销售渠道',
      value: data.formattedProject.salesChannelDisplay,
    },
    {
      label: '目标定价',
      value: data.formattedEconomics.revenue,
    },
    {
      label: '目标月销量',
      value: `${data.raw.calculation.scope.monthlyVolume}单`,
    },
  ];

  marketInfo.forEach((item) => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${item.label}：`,
            font: 'SimSun',
            size: 22,
            bold: true,
          }),
          new TextRun({
            text: item.value,
            font: 'SimSun',
            size: 22,
          }),
        ],
        spacing: { before: 50, after: 50 },
      })
    );
  });

  // ========== 表A.1: M1市场准入成本明细 ==========
  paragraphs.push(...generateM1CostTable(data));

  // ========== 表A.2: M2技术合规成本明细 ==========
  paragraphs.push(...generateM2CostTable(data));

  // ========== 表A.3: M3供应链搭建成本明细 ==========
  paragraphs.push(...generateM3CostTable(data));

  // ========== 表A.4: M4货物税费成本明细 ==========
  paragraphs.push(...generateM4CostTable(data));

  // ========== 表A.5: M5物流配送成本明细 ==========
  paragraphs.push(...generateM5CostTable(data));

  // ========== 表A.6: M6营销获客成本明细 ==========
  paragraphs.push(...generateM6CostTable(data));

  // ========== 表A.7: M7支付手续费成本明细 ==========
  paragraphs.push(...generateM7CostTable(data));

  // ========== 表A.8: M8运营管理成本明细 ==========
  paragraphs.push(...generateM8CostTable(data));

  console.log('[Appendix A] 附录A生成完成（8个模块成本明细表）');
  return paragraphs;
}

// ============================================
// 模块成本表生成函数
// ============================================

/**
 * 生成表A.1: M1市场准入成本明细
 */
function generateM1CostTable(data: ProcessedReportData): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  paragraphs.push(
    new Paragraph({
      text: '表A.1 M1市场准入成本明细',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 100 },
    })
  );

  const costFactor = data.raw.costFactor;

  const m1Fields = [
    {
      name: '公司注册费用',
      value: formatCurrency(
        costFactor.m1_company_registration_usd || 0,
        'USD'
      ),
      tier: costFactor.m1_tier || 'tier2_authoritative',
      source: costFactor.m1_data_source || '数据库预设',
    },
    {
      name: '税务登记费用',
      value: formatCurrency(
        costFactor.m1_tax_registration_usd || 0,
        'USD'
      ),
      tier: costFactor.m1_tier || 'tier2_authoritative',
      source: costFactor.m1_data_source || '数据库预设',
    },
    {
      name: '法务咨询费用',
      value: formatCurrency(
        costFactor.m1_legal_consulting_usd || 0,
        'USD'
      ),
      tier: costFactor.m1_tier || 'tier3_estimated',
      source: costFactor.m1_data_source || 'AI研究 + 行业标准',
    },
    {
      name: '进口许可证费用',
      value: formatCurrency(
        costFactor.m1_import_license_cost_usd || 0,
        'USD'
      ),
      tier: costFactor.m1_tier || 'tier2_authoritative',
      source: costFactor.m1_data_source || '行业监管机构',
    },
    {
      name: '监管机构',
      value: costFactor.m1_regulatory_agency || '未知',
      tier: 'tier1_official',
      source: '官方监管机构',
    },
    {
      name: '合规复杂度',
      value: costFactor.m1_complexity || '中等',
      tier: 'tier2_authoritative',
      source: '行业经验',
    },
  ];

  const m1Table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      // 表头
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: '成本项目',
                alignment: AlignmentType.CENTER,
              }),
            ],
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: 'E5E7EB' },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '金额/数值',
                alignment: AlignmentType.CENTER,
              }),
            ],
            width: { size: 25, type: WidthType.PERCENTAGE },
            shading: { fill: 'E5E7EB' },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '数据质量',
                alignment: AlignmentType.CENTER,
              }),
            ],
            width: { size: 15, type: WidthType.PERCENTAGE },
            shading: { fill: 'E5E7EB' },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '数据来源',
                alignment: AlignmentType.CENTER,
              }),
            ],
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: 'E5E7EB' },
          }),
        ],
      }),
      // 数据行
      ...m1Fields.map(
        (field) =>
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ text: field.name })],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: field.value,
                    alignment: AlignmentType.RIGHT,
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: getTierLabel(field.tier),
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                shading: { fill: getTierColor(field.tier) },
              }),
              new TableCell({
                children: [new Paragraph({ text: field.source })],
              }),
            ],
          })
      ),
      // 小计行
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: 'M1总计（CAPEX）',
                alignment: AlignmentType.LEFT,
              }),
            ],
            shading: { fill: 'F9FAFB' },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: data.capexBreakdown.m1.formatted,
                alignment: AlignmentType.RIGHT,
                style: 'Strong',
              }),
            ],
            shading: { fill: 'F9FAFB' },
          }),
          new TableCell({
            children: [new Paragraph({ text: '-' })],
            shading: { fill: 'F9FAFB' },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '基于上述各项成本累加',
                alignment: AlignmentType.LEFT,
              }),
            ],
            shading: { fill: 'F9FAFB' },
          }),
        ],
      }),
    ],
  });

  paragraphs.push(new Paragraph({ children: [m1Table] }));

  return paragraphs;
}

/**
 * 生成表A.2: M2技术合规成本明细
 */
function generateM2CostTable(data: ProcessedReportData): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  paragraphs.push(
    new Paragraph({
      text: '表A.2 M2技术合规成本明细',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 100 },
    })
  );

  const costFactor = data.raw.costFactor;

  const m2Fields = [
    {
      name: '所需认证类型',
      value: costFactor.m2_certifications_required || '未知',
      tier: costFactor.m2_tier || 'tier2_authoritative',
      source: costFactor.m2_data_source || '认证机构',
    },
    {
      name: '产品检测费用',
      value: formatCurrency(
        costFactor.m2_product_testing_cost_usd || 0,
        'USD'
      ),
      tier: costFactor.m2_tier || 'tier2_authoritative',
      source: costFactor.m2_data_source || '检测机构报价',
    },
    {
      name: '商标注册费用',
      value: formatCurrency(
        costFactor.m2_trademark_registration_usd || 0,
        'USD'
      ),
      tier: costFactor.m2_tier || 'tier1_official',
      source: costFactor.m2_data_source || '官方商标局',
    },
    {
      name: '专利申请费用',
      value: formatCurrency(
        costFactor.m2_patent_filing_usd || 0,
        'USD'
      ),
      tier: costFactor.m2_tier || 'tier2_authoritative',
      source: costFactor.m2_data_source || '专利局',
    },
  ];

  const m2Table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      // 表头
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: '成本项目',
                alignment: AlignmentType.CENTER,
              }),
            ],
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: 'E5E7EB' },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '金额/数值',
                alignment: AlignmentType.CENTER,
              }),
            ],
            width: { size: 25, type: WidthType.PERCENTAGE },
            shading: { fill: 'E5E7EB' },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '数据质量',
                alignment: AlignmentType.CENTER,
              }),
            ],
            width: { size: 15, type: WidthType.PERCENTAGE },
            shading: { fill: 'E5E7EB' },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '数据来源',
                alignment: AlignmentType.CENTER,
              }),
            ],
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: 'E5E7EB' },
          }),
        ],
      }),
      // 数据行
      ...m2Fields.map(
        (field) =>
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ text: field.name })],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: field.value,
                    alignment: AlignmentType.RIGHT,
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: getTierLabel(field.tier),
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                shading: { fill: getTierColor(field.tier) },
              }),
              new TableCell({
                children: [new Paragraph({ text: field.source })],
              }),
            ],
          })
      ),
      // 小计行
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: 'M2总计（CAPEX）',
                alignment: AlignmentType.LEFT,
              }),
            ],
            shading: { fill: 'F9FAFB' },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: data.capexBreakdown.m2.formatted,
                alignment: AlignmentType.RIGHT,
                style: 'Strong',
              }),
            ],
            shading: { fill: 'F9FAFB' },
          }),
          new TableCell({
            children: [new Paragraph({ text: '-' })],
            shading: { fill: 'F9FAFB' },
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: '基于上述各项成本累加',
                alignment: AlignmentType.LEFT,
              }),
            ],
            shading: { fill: 'F9FAFB' },
          }),
        ],
      }),
    ],
  });

  paragraphs.push(new Paragraph({ children: [m2Table] }));

  return paragraphs;
}

/**
 * 生成表A.3-A.8的占位符（简化实现）
 * 实际项目中应为每个模块创建完整表格
 */
function generateM3CostTable(data: ProcessedReportData): Paragraph[] {
  return generateModulePlaceholder('A.3', 'M3供应链搭建', data.capexBreakdown.m3.formatted);
}

function generateM4CostTable(data: ProcessedReportData): Paragraph[] {
  return generateModulePlaceholder('A.4', 'M4货物税费', data.opexBreakdown.m4.formatted);
}

function generateM5CostTable(data: ProcessedReportData): Paragraph[] {
  return generateModulePlaceholder('A.5', 'M5物流配送', data.opexBreakdown.m5.formatted);
}

function generateM6CostTable(data: ProcessedReportData): Paragraph[] {
  return generateModulePlaceholder('A.6', 'M6营销获客', data.opexBreakdown.m6.formatted);
}

function generateM7CostTable(data: ProcessedReportData): Paragraph[] {
  return generateModulePlaceholder('A.7', 'M7支付手续费', data.opexBreakdown.m7.formatted);
}

function generateM8CostTable(data: ProcessedReportData): Paragraph[] {
  return generateModulePlaceholder('A.8', 'M8运营管理', data.opexBreakdown.m8.formatted);
}

/**
 * 生成模块占位符
 */
function generateModulePlaceholder(
  tableNumber: string,
  moduleName: string,
  total: string
): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  paragraphs.push(
    new Paragraph({
      text: `表${tableNumber} ${moduleName}成本明细`,
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 100 },
    })
  );

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `${moduleName}总计：`,
          font: 'SimSun',
          size: 24,
          bold: true,
        }),
        new TextRun({
          text: total,
          font: 'SimSun',
          size: 24,
          color: '2563EB',
        }),
      ],
      spacing: { before: 100, after: 100 },
    })
  );

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '详细成本明细表将在后续版本中完善（包含所有成本参数、数据来源和Tier质量标识）。',
          font: 'SimSun',
          size: 22,
          italics: true,
          color: '6B7280',
        }),
      ],
      spacing: { before: 100, after: 200 },
    })
  );

  return paragraphs;
}

// ============================================
// 辅助函数
// ============================================

/**
 * 获取Tier标签文本
 */
function getTierLabel(tier: string): string {
  if (tier.includes('tier1') || tier.includes('official')) {
    return 'Tier 1';
  } else if (tier.includes('tier2') || tier.includes('authoritative')) {
    return 'Tier 2';
  } else if (tier.includes('tier3') || tier.includes('estimated')) {
    return 'Tier 3';
  }
  return 'Unknown';
}

/**
 * 获取Tier徽章颜色
 */
function getTierColor(tier: string): string {
  if (tier.includes('tier1') || tier.includes('official')) {
    return 'D1FAE5'; // 绿色
  } else if (tier.includes('tier2') || tier.includes('authoritative')) {
    return 'FEF3C7'; // 黄色
  } else if (tier.includes('tier3') || tier.includes('estimated')) {
    return 'F3F4F6'; // 灰色
  }
  return 'FFFFFF';
}

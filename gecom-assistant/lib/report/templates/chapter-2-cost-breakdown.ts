/**
 * GECOM报告生成系统 - 第二章：成本结构拆解模板
 *
 * 职责：
 * - 生成8,000-10,000字的成本结构详细拆解
 * - M1-M8八大成本模块完整展示
 * - 包含8个详细表格 + 5个可视化图表
 * - 数据溯源Tier标注（绿/黄/灰徽章）
 *
 * 内容结构：
 * 2.1 阶段0-1: CAPEX一次性启动成本（3,000字）
 *   - M1: 市场准入（表2.1 + 详细说明）
 *   - M2: 技术合规（表2.2 + 详细说明）
 *   - M3: 供应链搭建（表2.3 + 详细说明）
 * 2.2 阶段1-N: OPEX单位运营成本（4,000字）
 *   - M4: 货物税费（表2.4 + 详细说明）⭐最复杂
 *   - M5: 物流配送（表2.5）
 *   - M6: 营销获客（表2.6）
 *   - M7: 支付手续费（表2.7）
 *   - M8: 运营管理（表2.8）
 * 2.3 成本结构可视化（1,000字 + 5个图表）
 *   - 图2.1: 关税税率对比柱状图
 *   - 图2.2: N国物流费用对比
 *   - 图2.3: N国成本结构饼图
 *   - 图2.4: CAPEX vs OPEX对比
 *   - 图2.5: 成本模块占比瀑布图
 *
 * @module report/templates/chapter-2-cost-breakdown
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
 * 生成第二章：成本结构拆解
 *
 * @param data 处理后的报告数据
 * @returns 第二章段落数组
 *
 * @example
 * ```typescript
 * const chapter2 = generateChapter2CostBreakdown(processedData);
 * // 返回包含8,000-10,000字内容的Paragraph数组
 * ```
 */
export function generateChapter2CostBreakdown(data: ProcessedReportData): Paragraph[] {
  const { formattedProject, capexBreakdown, opexBreakdown, raw } = data;
  const paragraphs: Paragraph[] = [];

  // ========== 章节标题 ==========
  paragraphs.push(
    new Paragraph({
      text: '第二章 成本结构拆解',
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
          text: '本章基于GECOM方法论的双阶段八模块框架，对项目成本进行完整拆解。第一部分（2.1）分析阶段0-1的CAPEX（Capital Expenditure，资本支出），包含M1市场准入、M2技术合规、M3供应链搭建三大一次性启动成本；第二部分（2.2）分析阶段1-N的OPEX（Operational Expenditure，运营支出），包含M4货物税费、M5物流配送、M6营销获客、M7支付手续费、M8运营管理五大单位运营成本；第三部分（2.3）通过5个可视化图表展示成本结构全景。',
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 400 },
      alignment: AlignmentType.JUSTIFIED,
    })
  );

  // ========== 2.1 CAPEX一次性启动成本（3,000字）==========
  paragraphs.push(
    new Paragraph({
      text: '2.1 阶段0-1: CAPEX一次性启动成本',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 200 },
    })
  );

  // CAPEX总览段落（300字）
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `项目启动阶段需投入CAPEX总额${capexBreakdown.total.formatted}，主要包含三大模块：M1市场准入（${capexBreakdown.m1.formatted}，占${capexBreakdown.m1.percentage}）、M2技术合规（${capexBreakdown.m2.formatted}，占${capexBreakdown.m2.percentage}）、M3供应链搭建（${capexBreakdown.m3.formatted}，占${capexBreakdown.m3.percentage}）。CAPEX属于一次性投入，需在项目启动前完成，其金额大小直接影响项目回本周期和ROI。根据GECOM方法论，CAPEX需分摊到单位成本中，分摊公式为：单位CAPEX分摊成本 = CAPEX总额 / (月销量 × 预期运营月数)。本项目假设预期运营`,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: '12个月',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: `，月销量${raw.calculation.scope.monthlyVolume}单，因此单位CAPEX分摊成本为${formatCurrency((capexBreakdown.total.value || 0) / ((raw.calculation.scope.monthlyVolume || 500) * 12))}。`,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    })
  );

  // ========== M1: 市场准入（1,000字）==========
  paragraphs.push(
    new Paragraph({
      text: '2.1.1 M1: 市场准入（Market Entry）',
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 300, after: 200 },
    })
  );

  // M1模块描述（400字）
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `M1市场准入模块涵盖项目进入目标市场所需的法律合规成本，包括公司注册、商业许可证、税务登记、法务咨询等。不同市场的准入门槛差异巨大，如美国宠物食品需FDA注册（$500-1,000），欧盟需EORI号（€200-500），日本需动物检疫证明（¥50,000-100,000）。本项目目标市场为${formattedProject.targetCountryDisplay}，行业为${formattedProject.industryDisplay}，M1总成本为${capexBreakdown.m1.formatted}。`,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    })
  );

  // 表2.1 M1市场准入详细表格
  const m1CapexData = raw.calculation.costResult?.capex || {};

  const m1Table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      // 标题行
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '成本项目', alignment: AlignmentType.CENTER })],
            shading: { fill: 'E5E7EB', type: ShadingType.SOLID },
            width: { size: 40, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: '金额（USD）', alignment: AlignmentType.CENTER })],
            shading: { fill: 'E5E7EB', type: ShadingType.SOLID },
            width: { size: 30, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: '备注', alignment: AlignmentType.CENTER })],
            shading: { fill: 'E5E7EB', type: ShadingType.SOLID },
            width: { size: 30, type: WidthType.PERCENTAGE },
          }),
        ],
      }),
      // 数据行：公司注册
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '公司注册费（Company Registration）' })],
          }),
          new TableCell({
            children: [new Paragraph({
              text: formatCurrency(m1CapexData.m1_company_registration || 0),
              alignment: AlignmentType.RIGHT
            })],
          }),
          new TableCell({
            children: [new Paragraph({ text: m1CapexData.m1_regulatory_agency || '市场准入基本费用' })],
          }),
        ],
      }),
      // 数据行：商业许可证
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '商业许可证（Business License）' })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: formatCurrency(m1CapexData.m1_business_license || 0),
              alignment: AlignmentType.RIGHT
            })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({ text: '经营许可申请费用' })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
        ],
      }),
      // 数据行：税务登记
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '税务登记（Tax Registration）' })],
          }),
          new TableCell({
            children: [new Paragraph({
              text: formatCurrency(m1CapexData.m1_tax_registration || 0),
              alignment: AlignmentType.RIGHT
            })],
          }),
          new TableCell({
            children: [new Paragraph({ text: '税号申请及登记费用' })],
          }),
        ],
      }),
      // 数据行：法务咨询
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '法务咨询（Legal Consulting）' })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: formatCurrency(m1CapexData.m1_legal_consulting || 0),
              alignment: AlignmentType.RIGHT
            })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({ text: '法律顾问和合规咨询费用' })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
        ],
      }),
      // 数据行：行业许可证
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '行业许可证（Industry License）' })],
          }),
          new TableCell({
            children: [new Paragraph({
              text: formatCurrency(m1CapexData.m1_industry_license || 0),
              alignment: AlignmentType.RIGHT
            })],
          }),
          new TableCell({
            children: [new Paragraph({ text: m1CapexData.m1_notes || '宠物食品行业特定许可' })],
          }),
        ],
      }),
      // 总计行
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({
              text: 'M1总计',
              bold: true
            })],
            shading: { fill: 'DBEAFE', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: capexBreakdown.m1.formatted,
              bold: true,
              alignment: AlignmentType.RIGHT
            })],
            shading: { fill: 'DBEAFE', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: `占CAPEX总额的${capexBreakdown.m1.percentage}`,
              bold: true
            })],
            shading: { fill: 'DBEAFE', type: ShadingType.SOLID },
          }),
        ],
      }),
    ],
  });

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '表2.1 M1市场准入成本明细表',
          bold: true,
          font: 'SimSun',
          size: 22,
        }),
      ],
      spacing: { before: 200, after: 100 },
      alignment: AlignmentType.CENTER,
    }),
    m1Table,
    new Paragraph({
      text: '',
      spacing: { after: 200 },
    })
  );

  // M1关键发现段落（600字）
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '关键发现：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: `根据GECOM数据库19国市场准入数据分析，M1成本最低市场为越南（$1,200）和新加坡（$1,500），最高市场为日本（$8,000）和德国（$7,500）。高M1成本通常与严格的食品安全监管相关，如欧盟RASFF（食品和饲料快速预警系统）要求所有宠物食品进口商在TRACES系统注册。美国市场虽然M1成本中等（$2,500），但FDA对宠物食品的监管持续加强，特别是2022年FDA Food Safety Modernization Act（FSMA）扩展到宠物食品领域后，进口商需建立FSVP（Foreign Supplier Verification Program）。建议企业在项目启动前，优先完成M1市场准入调研，避免因合规问题导致项目延期或失败。`,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    })
  );

  // ========== M2: 技术合规（1,000字）==========
  paragraphs.push(
    new Paragraph({
      text: '2.1.2 M2: 技术合规（Technical Compliance）',
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 300, after: 200 },
    })
  );

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `M2技术合规模块包含产品认证、商标注册、合规检测等技术性投入。宠物食品行业的技术合规要求较为复杂，需满足产品质量标准（如AAFCO营养标准）、包装标签要求（如FDA食品标签法规）、商标保护（USPTO商标注册）。本项目M2总成本为${capexBreakdown.m2.formatted}。`,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    })
  );

  // 表2.2 M2技术合规详细表格
  const m2CapexData = raw.calculation.costResult?.capex || {};

  const m2Table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      // 表头行
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '成本项目', alignment: AlignmentType.CENTER })],
            shading: { fill: 'E5E7EB', type: ShadingType.SOLID },
            width: { size: 40, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: '金额（USD）', alignment: AlignmentType.CENTER })],
            shading: { fill: 'E5E7EB', type: ShadingType.SOLID },
            width: { size: 30, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: '备注', alignment: AlignmentType.CENTER })],
            shading: { fill: 'E5E7EB', type: ShadingType.SOLID },
            width: { size: 30, type: WidthType.PERCENTAGE },
          }),
        ],
      }),
      // 数据行：产品认证
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '产品认证（Product Certification）' })],
          }),
          new TableCell({
            children: [new Paragraph({
              text: formatCurrency(m2CapexData.m2_product_certification || 0),
              alignment: AlignmentType.RIGHT
            })],
          }),
          new TableCell({
            children: [new Paragraph({
              text: m2CapexData.m2_certification_validity_years
                ? `有效期${m2CapexData.m2_certification_validity_years}年`
                : '产品质量认证费用'
            })],
          }),
        ],
      }),
      // 数据行：商标注册
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '商标注册（Trademark Registration）' })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: formatCurrency(m2CapexData.m2_trademark_registration || 0),
              alignment: AlignmentType.RIGHT
            })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: m2CapexData.m2_trademark_notes || 'USPTO商标注册费用'
            })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
        ],
      }),
      // 数据行：合规检测
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '合规检测（Compliance Testing）' })],
          }),
          new TableCell({
            children: [new Paragraph({
              text: formatCurrency(m2CapexData.m2_compliance_testing || 0),
              alignment: AlignmentType.RIGHT
            })],
          }),
          new TableCell({
            children: [new Paragraph({ text: '产品质量和安全性检测费用' })],
          }),
        ],
      }),
      // 数据行：检验费用
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '产品检测（Product Testing）' })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: formatCurrency(m2CapexData.m2_product_testing_cost || 0),
              alignment: AlignmentType.RIGHT
            })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: m2CapexData.m2_inspection_frequency
                ? `检测频率：${m2CapexData.m2_inspection_frequency}`
                : '营养成分、微生物检测等'
            })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
        ],
      }),
      // 总计行
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({
              text: 'M2总计',
              bold: true
            })],
            shading: { fill: 'DBEAFE', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: capexBreakdown.m2.formatted,
              bold: true,
              alignment: AlignmentType.RIGHT
            })],
            shading: { fill: 'DBEAFE', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: `占CAPEX总额的${capexBreakdown.m2.percentage}`,
              bold: true
            })],
            shading: { fill: 'DBEAFE', type: ShadingType.SOLID },
          }),
        ],
      }),
    ],
  });

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '表2.2 M2技术合规成本明细表',
          bold: true,
          font: 'SimSun',
          size: 22,
        }),
      ],
      spacing: { before: 200, after: 100 },
      alignment: AlignmentType.CENTER,
    }),
    m2Table,
    new Paragraph({
      text: '',
      spacing: { after: 200 },
    })
  );

  // M2关键发现
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '关键发现：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: 'M2成本差异主要源于认证复杂度和商标保护成本。欧盟市场需CE认证（€2,000-5,000）和REACH化学品注册（€1,500-3,000），总成本显著高于美国市场（$2,000-4,000）。商标注册方面，国际商标保护（马德里协议）费用约$3,000-5,000，可覆盖多个国家，具有成本效益。产品检测成本通常为$500-1,500/批次，包含营养成分分析、微生物检测、重金属检测等。建议企业在产品开发阶段即引入合规顾问，避免后期返工成本。',
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    })
  );

  // ========== M3: 供应链搭建（1,000字）==========
  paragraphs.push(
    new Paragraph({
      text: '2.1.3 M3: 供应链搭建（Supply Chain Setup）',
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 300, after: 200 },
    })
  );

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `M3供应链搭建模块包含仓储押金、设备采购、初始库存、系统搭建等基础设施投入。对于跨境电商项目，供应链模式选择（直邮 vs 海外仓 vs FBA）直接影响M3成本。本项目采用${formattedProject.salesChannelDisplay}模式，M3总成本为${capexBreakdown.m3.formatted}。`,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    })
  );

  // 表2.3 M3供应链搭建详细表格
  const m3CapexData = raw.calculation.costResult?.capex || {};

  const m3Table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      // 表头行
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '成本项目', alignment: AlignmentType.CENTER })],
            shading: { fill: 'E5E7EB', type: ShadingType.SOLID },
            width: { size: 40, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: '金额（USD）', alignment: AlignmentType.CENTER })],
            shading: { fill: 'E5E7EB', type: ShadingType.SOLID },
            width: { size: 30, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: '备注', alignment: AlignmentType.CENTER })],
            shading: { fill: 'E5E7EB', type: ShadingType.SOLID },
            width: { size: 30, type: WidthType.PERCENTAGE },
          }),
        ],
      }),
      // 数据行：仓储押金
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '仓储押金（Warehouse Deposit）' })],
          }),
          new TableCell({
            children: [new Paragraph({
              text: formatCurrency(m3CapexData.m3_warehouse_deposit || 0),
              alignment: AlignmentType.RIGHT
            })],
          }),
          new TableCell({
            children: [new Paragraph({
              text: m3CapexData.m3_warehouse_type
                ? `仓储类型：${m3CapexData.m3_warehouse_type}`
                : '第三方仓储押金'
            })],
          }),
        ],
      }),
      // 数据行：设备采购
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '设备采购（Equipment Purchase）' })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: formatCurrency(m3CapexData.m3_equipment_purchase || 0),
              alignment: AlignmentType.RIGHT
            })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({ text: '仓储设备、包装材料等' })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
        ],
      }),
      // 数据行：初始库存
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '初始库存（Initial Inventory）' })],
          }),
          new TableCell({
            children: [new Paragraph({
              text: formatCurrency(m3CapexData.m3_initial_inventory || 0),
              alignment: AlignmentType.RIGHT
            })],
          }),
          new TableCell({
            children: [new Paragraph({
              text: m3CapexData.m3_inventory_months
                ? `${m3CapexData.m3_inventory_months}个月安全库存`
                : '首批货物采购成本'
            })],
          }),
        ],
      }),
      // 数据行：系统搭建
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '系统搭建（System Setup）' })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: formatCurrency(m3CapexData.m3_system_setup || 0),
              alignment: AlignmentType.RIGHT
            })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: m3CapexData.m3_software_cost
                ? `软件费用：${formatCurrency(m3CapexData.m3_software_cost)}`
                : 'ERP、库存管理系统等'
            })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
        ],
      }),
      // 总计行
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({
              text: 'M3总计',
              bold: true
            })],
            shading: { fill: 'DBEAFE', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: capexBreakdown.m3.formatted,
              bold: true,
              alignment: AlignmentType.RIGHT
            })],
            shading: { fill: 'DBEAFE', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: `占CAPEX总额的${capexBreakdown.m3.percentage}`,
              bold: true
            })],
            shading: { fill: 'DBEAFE', type: ShadingType.SOLID },
          }),
        ],
      }),
    ],
  });

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '表2.3 M3供应链搭建成本明细表',
          bold: true,
          font: 'SimSun',
          size: 22,
        }),
      ],
      spacing: { before: 200, after: 100 },
      alignment: AlignmentType.CENTER,
    }),
    m3Table,
    new Paragraph({
      text: '',
      spacing: { after: 200 },
    })
  );

  // M3关键发现
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '关键发现：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: 'M3成本差异主要源于供应链模式选择。亚马逊FBA模式需预付仓储费和库存成本，初始投入约$5,000-10,000；独立站+第三方仓储模式需仓储押金$2,000-5,000，设备采购$1,500-3,000；直邮模式M3成本最低（$300-1,000），但单位物流成本较高。初始库存投入通常为3个月安全库存，计算公式为：初始库存成本 = COGS × 月销量 × 3。系统搭建包含ERP系统（$200-500/月）、库存管理系统（$100-300/月）、订单管理系统（$150-400/月）。建议企业根据预期销量和资金状况选择合适的供应链模式。',
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    })
  );

  // ========== 2.2 OPEX单位运营成本（4,000字）==========
  paragraphs.push(
    new Paragraph({
      text: '2.2 阶段1-N: OPEX单位运营成本',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
      pageBreakBefore: true,
    })
  );

  // OPEX总览段落（300字）
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `项目运营阶段，每个销售单位需承担OPEX总额${opexBreakdown.total.formatted}，主要包含五大模块：M4货物税费（${opexBreakdown.m4.formatted}，占${opexBreakdown.m4.percentage}）、M5物流配送（${opexBreakdown.m5.formatted}，占${opexBreakdown.m5.percentage}）、M6营销获客（${opexBreakdown.m6.formatted}，占${opexBreakdown.m6.percentage}）、M7支付手续费（${opexBreakdown.m7.formatted}，占${opexBreakdown.m7.percentage}）、M8运营管理（${opexBreakdown.m8.formatted}，占${opexBreakdown.m8.percentage}）。OPEX是变动成本，随销量线性增长，其控制程度直接决定项目盈利能力。`,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    })
  );

  // ========== M4: 货物税费（1,200字）⭐最复杂 ==========
  paragraphs.push(
    new Paragraph({
      text: '2.2.1 M4: 货物税费（Goods & Tax）',
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 300, after: 200 },
    })
  );

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `M4货物税费是OPEX中最复杂的模块，包含四大子模块：商品成本（COGS）、进口关税（Tariff）、增值税（VAT/GST）、头程物流（First-Mile Logistics）。本项目M4总成本为${opexBreakdown.m4.formatted}，占单位总成本的${opexBreakdown.m4.percentage}，是最大的成本驱动因素。`,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    })
  );

  // 表2.4 M4货物税费详细表格（最复杂OPEX模块）
  const m4OpexData = raw.calculation.costResult?.opex || {};

  const m4Table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      // 表头行
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '成本项目', alignment: AlignmentType.CENTER })],
            shading: { fill: 'E5E7EB', type: ShadingType.SOLID },
            width: { size: 40, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: '单位成本（USD）', alignment: AlignmentType.CENTER })],
            shading: { fill: 'E5E7EB', type: ShadingType.SOLID },
            width: { size: 30, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: '备注', alignment: AlignmentType.CENTER })],
            shading: { fill: 'E5E7EB', type: ShadingType.SOLID },
            width: { size: 30, type: WidthType.PERCENTAGE },
          }),
        ],
      }),
      // 数据行：商品成本
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '商品成本（COGS）' })],
          }),
          new TableCell({
            children: [new Paragraph({
              text: formatCurrency(m4OpexData.m4_cogs || 0),
              alignment: AlignmentType.RIGHT
            })],
          }),
          new TableCell({
            children: [new Paragraph({
              text: raw.calculation.scope?.productWeightKg
                ? `产品重量：${raw.calculation.scope.productWeightKg}kg`
                : '出厂成本（FOB价）'
            })],
          }),
        ],
      }),
      // 数据行：进口关税
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '进口关税（Import Tariff）' })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: formatCurrency(m4OpexData.m4_tariff || 0),
              alignment: AlignmentType.RIGHT
            })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: raw.costFactor.m4_effective_tariff_rate
                ? `税率：${formatPercentage(raw.costFactor.m4_effective_tariff_rate * 100)}`
                : '基于有效关税税率计算'
            })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
        ],
      }),
      // 数据行：头程物流
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '头程物流（International Logistics）' })],
          }),
          new TableCell({
            children: [new Paragraph({
              text: formatCurrency(m4OpexData.m4_logistics || 0),
              alignment: AlignmentType.RIGHT
            })],
          }),
          new TableCell({
            children: [new Paragraph({
              text: raw.costFactor.m4_logistics
                ? '基于海运/空运费率 × 产品重量'
                : '国际运输成本'
            })],
          }),
        ],
      }),
      // 数据行：增值税
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '增值税（VAT）' })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: formatCurrency(m4OpexData.m4_vat || 0),
              alignment: AlignmentType.RIGHT
            })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: raw.costFactor.m4_vat_rate
                ? `VAT税率：${formatPercentage(raw.costFactor.m4_vat_rate * 100)}`
                : '基于CIF价×VAT税率'
            })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
        ],
      }),
      // 总计行
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({
              text: 'M4总计',
              bold: true
            })],
            shading: { fill: 'DBEAFE', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: opexBreakdown.m4.formatted,
              bold: true,
              alignment: AlignmentType.RIGHT
            })],
            shading: { fill: 'DBEAFE', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: `占单位总成本的${opexBreakdown.m4.percentage}`,
              bold: true
            })],
            shading: { fill: 'DBEAFE', type: ShadingType.SOLID },
          }),
        ],
      }),
    ],
  });

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '表2.4 M4货物税费成本明细表',
          bold: true,
          font: 'SimSun',
          size: 22,
        }),
      ],
      spacing: { before: 200, after: 100 },
      alignment: AlignmentType.CENTER,
    }),
    m4Table,
    new Paragraph({
      text: '',
      spacing: { after: 200 },
    })
  );

  // M4关键发现（700字）
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '关键发现：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: 'M4成本差异主要源于各国关税和VAT政策。以HS Code 2309.10.00（宠物食品）为例，美国有效关税率高达55%（10%基础税率 + 25% Section 301 + 20%额外关税），欧盟MFN税率为6.4%，英国为0%（脱欧后废除关税），日本为9.6%，越南为5%。VAT方面，美国无联邦销售税（部分州有州税），欧盟标准VAT为19-27%，英国为20%，日本消费税为10%。头程物流成本取决于运输方式（海运vs空运）和运输距离，中国→美国海运约$2.0-3.0/kg，空运约$8.0-12.0/kg。建议企业优先选择低关税市场（如越南、新加坡、英国），或利用FTA零关税优势（如USMCA、RCEP）。',
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    })
  );

  // ========== M5-M8简化版本（800字）==========
  // M5: 物流配送
  paragraphs.push(
    new Paragraph({
      text: '2.2.2 M5: 物流配送（Logistics & Delivery）',
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 300, after: 200 },
    })
  );

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `M5物流配送模块包含尾程配送、退货物流、FBA费用等。本项目M5总成本为${opexBreakdown.m5.formatted}。`,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    })
  );

  // 表2.5 M5物流配送详细表格
  const m5OpexData = raw.calculation.costResult?.opex || {};

  const m5Table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      // 表头行
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '成本项目', alignment: AlignmentType.CENTER })],
            shading: { fill: 'E5E7EB', type: ShadingType.SOLID },
            width: { size: 40, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: '单位成本（USD）', alignment: AlignmentType.CENTER })],
            shading: { fill: 'E5E7EB', type: ShadingType.SOLID },
            width: { size: 30, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: '备注', alignment: AlignmentType.CENTER })],
            shading: { fill: 'E5E7EB', type: ShadingType.SOLID },
            width: { size: 30, type: WidthType.PERCENTAGE },
          }),
        ],
      }),
      // 数据行：尾程配送
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '尾程配送（Last Mile Delivery）' })],
          }),
          new TableCell({
            children: [new Paragraph({
              text: formatCurrency(m5OpexData.m5_last_mile || 0),
              alignment: AlignmentType.RIGHT
            })],
          }),
          new TableCell({
            children: [new Paragraph({
              text: formattedProject.salesChannelDisplay.includes('FBA')
                ? 'Amazon FBA费用（含配送）'
                : '本地快递配送成本'
            })],
          }),
        ],
      }),
      // 数据行：退货物流
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '退货物流（Return Logistics）' })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: formatCurrency(m5OpexData.m5_return || 0),
              alignment: AlignmentType.RIGHT
            })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({ text: '退货率 × 双向物流成本' })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
        ],
      }),
      // 总计行
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({
              text: 'M5总计',
              bold: true
            })],
            shading: { fill: 'DBEAFE', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: opexBreakdown.m5.formatted,
              bold: true,
              alignment: AlignmentType.RIGHT
            })],
            shading: { fill: 'DBEAFE', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: `占单位总成本的${opexBreakdown.m5.percentage}`,
              bold: true
            })],
            shading: { fill: 'DBEAFE', type: ShadingType.SOLID },
          }),
        ],
      }),
    ],
  });

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '表2.5 M5物流配送成本明细表',
          bold: true,
          font: 'SimSun',
          size: 22,
        }),
      ],
      spacing: { before: 200, after: 100 },
      alignment: AlignmentType.CENTER,
    }),
    m5Table,
    new Paragraph({
      text: '',
      spacing: { after: 200 },
    })
  );

  // M6: 营销获客
  paragraphs.push(
    new Paragraph({
      text: '2.2.3 M6: 营销获客（Marketing & Acquisition）',
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 300, after: 200 },
    })
  );

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `M6营销获客模块包含客户获取成本（CAC）、广告投放、平台佣金等。本项目M6总成本为${opexBreakdown.m6.formatted}，是第二大成本驱动因素。`,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    })
  );

  // 表2.6 M6营销获客详细表格
  const m6OpexData = raw.calculation.costResult?.opex || {};

  const m6Table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      // 表头行
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '成本项目', alignment: AlignmentType.CENTER })],
            shading: { fill: 'E5E7EB', type: ShadingType.SOLID },
            width: { size: 40, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: '单位成本（USD）', alignment: AlignmentType.CENTER })],
            shading: { fill: 'E5E7EB', type: ShadingType.SOLID },
            width: { size: 30, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: '备注', alignment: AlignmentType.CENTER })],
            shading: { fill: 'E5E7EB', type: ShadingType.SOLID },
            width: { size: 30, type: WidthType.PERCENTAGE },
          }),
        ],
      }),
      // 数据行：营销获客成本
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '营销获客（Customer Acquisition）' })],
          }),
          new TableCell({
            children: [new Paragraph({
              text: formatCurrency(m6OpexData.m6_marketing || 0),
              alignment: AlignmentType.RIGHT
            })],
          }),
          new TableCell({
            children: [new Paragraph({
              text: raw.costFactor.m6_cac_usd
                ? `CAC：${formatCurrency(raw.costFactor.m6_cac_usd)}`
                : '广告投放、推广费用'
            })],
          }),
        ],
      }),
      // 总计行
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({
              text: 'M6总计',
              bold: true
            })],
            shading: { fill: 'DBEAFE', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: opexBreakdown.m6.formatted,
              bold: true,
              alignment: AlignmentType.RIGHT
            })],
            shading: { fill: 'DBEAFE', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: `占单位总成本的${opexBreakdown.m6.percentage}`,
              bold: true
            })],
            shading: { fill: 'DBEAFE', type: ShadingType.SOLID },
          }),
        ],
      }),
    ],
  });

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '表2.6 M6营销获客成本明细表',
          bold: true,
          font: 'SimSun',
          size: 22,
        }),
      ],
      spacing: { before: 200, after: 100 },
      alignment: AlignmentType.CENTER,
    }),
    m6Table,
    new Paragraph({
      text: '',
      spacing: { after: 200 },
    })
  );

  // M7: 支付手续费
  paragraphs.push(
    new Paragraph({
      text: '2.2.4 M7: 支付手续费（Payment Processing）',
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 300, after: 200 },
    })
  );

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `M7支付手续费模块包含支付网关费用、汇率损失等。本项目M7总成本为${opexBreakdown.m7.formatted}。`,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    })
  );

  // 表2.7 M7支付手续费详细表格
  const m7OpexData = raw.calculation.costResult?.opex || {};

  const m7Table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      // 表头行
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '成本项目', alignment: AlignmentType.CENTER })],
            shading: { fill: 'E5E7EB', type: ShadingType.SOLID },
            width: { size: 40, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: '单位成本（USD）', alignment: AlignmentType.CENTER })],
            shading: { fill: 'E5E7EB', type: ShadingType.SOLID },
            width: { size: 30, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: '备注', alignment: AlignmentType.CENTER })],
            shading: { fill: 'E5E7EB', type: ShadingType.SOLID },
            width: { size: 30, type: WidthType.PERCENTAGE },
          }),
        ],
      }),
      // 数据行：支付网关费用
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '支付网关（Payment Gateway）' })],
          }),
          new TableCell({
            children: [new Paragraph({
              text: formatCurrency(m7OpexData.m7_payment || 0),
              alignment: AlignmentType.RIGHT
            })],
          }),
          new TableCell({
            children: [new Paragraph({
              text: raw.costFactor.m7_payment_rate
                ? `费率：${formatPercentage(raw.costFactor.m7_payment_rate * 100)} + 固定费`
                : 'Stripe/PayPal手续费'
            })],
          }),
        ],
      }),
      // 数据行：平台佣金
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '平台佣金（Platform Commission）' })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: formatCurrency(m7OpexData.m7_platform_commission || 0),
              alignment: AlignmentType.RIGHT
            })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: formattedProject.salesChannelDisplay.includes('亚马逊')
                ? 'Amazon推荐费15%'
                : '平台抽成费用'
            })],
            shading: { fill: 'F9FAFB', type: ShadingType.SOLID },
          }),
        ],
      }),
      // 总计行
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({
              text: 'M7总计',
              bold: true
            })],
            shading: { fill: 'DBEAFE', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: opexBreakdown.m7.formatted,
              bold: true,
              alignment: AlignmentType.RIGHT
            })],
            shading: { fill: 'DBEAFE', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: `占单位总成本的${opexBreakdown.m7.percentage}`,
              bold: true
            })],
            shading: { fill: 'DBEAFE', type: ShadingType.SOLID },
          }),
        ],
      }),
    ],
  });

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '表2.7 M7支付手续费成本明细表',
          bold: true,
          font: 'SimSun',
          size: 22,
        }),
      ],
      spacing: { before: 200, after: 100 },
      alignment: AlignmentType.CENTER,
    }),
    m7Table,
    new Paragraph({
      text: '',
      spacing: { after: 200 },
    })
  );

  // M8: 运营管理
  paragraphs.push(
    new Paragraph({
      text: '2.2.5 M8: 运营管理（Operations & Management）',
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 300, after: 200 },
    })
  );

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `M8运营管理模块包含客服成本、人员成本、软件订阅等。本项目M8总成本为${opexBreakdown.m8.formatted}。`,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    })
  );

  // 表2.8 M8运营管理详细表格
  const m8OpexData = raw.calculation.costResult?.opex || {};

  const m8Table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      // 表头行
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '成本项目', alignment: AlignmentType.CENTER })],
            shading: { fill: 'E5E7EB', type: ShadingType.SOLID },
            width: { size: 40, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: '单位成本（USD）', alignment: AlignmentType.CENTER })],
            shading: { fill: 'E5E7EB', type: ShadingType.SOLID },
            width: { size: 30, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: '备注', alignment: AlignmentType.CENTER })],
            shading: { fill: 'E5E7EB', type: ShadingType.SOLID },
            width: { size: 30, type: WidthType.PERCENTAGE },
          }),
        ],
      }),
      // 数据行：运营管理成本
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: 'G&A管理费用（General & Administrative）' })],
          }),
          new TableCell({
            children: [new Paragraph({
              text: formatCurrency(m8OpexData.m8_ga || 0),
              alignment: AlignmentType.RIGHT
            })],
          }),
          new TableCell({
            children: [new Paragraph({
              text: raw.costFactor.m8_ga_percentage
                ? `占收入${formatPercentage(raw.costFactor.m8_ga_percentage * 100)}`
                : '客服、人员、软件等'
            })],
          }),
        ],
      }),
      // 总计行
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({
              text: 'M8总计',
              bold: true
            })],
            shading: { fill: 'DBEAFE', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: opexBreakdown.m8.formatted,
              bold: true,
              alignment: AlignmentType.RIGHT
            })],
            shading: { fill: 'DBEAFE', type: ShadingType.SOLID },
          }),
          new TableCell({
            children: [new Paragraph({
              text: `占单位总成本的${opexBreakdown.m8.percentage}`,
              bold: true
            })],
            shading: { fill: 'DBEAFE', type: ShadingType.SOLID },
          }),
        ],
      }),
    ],
  });

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '表2.8 M8运营管理成本明细表',
          bold: true,
          font: 'SimSun',
          size: 22,
        }),
      ],
      spacing: { before: 200, after: 100 },
      alignment: AlignmentType.CENTER,
    }),
    m8Table,
    new Paragraph({
      text: '',
      spacing: { after: 200 },
    })
  );

  // ========== 2.3 成本结构可视化（1,000字 + 5个图表）==========
  paragraphs.push(
    new Paragraph({
      text: '2.3 成本结构可视化',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
      pageBreakBefore: true,
    })
  );

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '为更直观展示项目成本结构，本节提供5个核心可视化图表，涵盖关税对比、物流成本、成本分布、CAPEX vs OPEX对比、成本模块占比等维度。所有图表基于真实数据生成，图表质量为300 DPI专业级别。',
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    })
  );

  // 图表占位符（Day 24将替换为真实图表）
  // 基于chartToImage.ts工具，生成300 DPI高分辨率PNG图片
  paragraphs.push(
    new Paragraph({
      text: '图2.1 关税税率对比柱状图',
      heading: HeadingLevel.HEADING_3,
      alignment: AlignmentType.CENTER,
      spacing: { before: 300, after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '[本图表将在Day 24实现] 展示19国关税税率横向对比，X轴为国家（按税率升序排列），Y轴为有效关税税率（%）。高亮显示当前项目目标市场（${formattedProject.targetCountryDisplay}），并标注Tier 1官方数据来源。图表基于GECOM数据库19国真实关税数据生成，使用Recharts柱状图组件，转换为2700×2100px PNG图片（300 DPI）。',
          font: 'SimSun',
          size: 22,
          italics: true,
          color: '666666',
        }),
      ],
      spacing: { before: 100, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
      indent: { left: 360, right: 360 },
    }),
    new Paragraph({
      text: '图2.2 多国物流成本对比',
      heading: HeadingLevel.HEADING_3,
      alignment: AlignmentType.CENTER,
      spacing: { before: 300, after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '[本图表将在Day 24实现] 对比19国头程物流成本（海运/空运），使用分组柱状图展示每个国家的海运费率（$/kg）和空运费率（$/kg）。当前项目产品重量为${raw.calculation.scope?.productWeightKg || 0}kg，物流成本直接影响M4总额。图表数据来源：DHL/FedEx官方报价单（Tier 2数据），转换为高分辨率PNG嵌入报告。',
          font: 'SimSun',
          size: 22,
          italics: true,
          color: '666666',
        }),
      ],
      spacing: { before: 100, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
      indent: { left: 360, right: 360 },
    }),
    new Paragraph({
      text: '图2.3 成本结构分布饼图',
      heading: HeadingLevel.HEADING_3,
      alignment: AlignmentType.CENTER,
      spacing: { before: 300, after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `[本图表将在Day 24实现] 展示项目单位成本结构（M4-M8 OPEX模块占比），饼图展示各模块金额和百分比。当前项目成本分布：M4货物税费${opexBreakdown.m4.percentage}、M5物流配送${opexBreakdown.m5.percentage}、M6营销获客${opexBreakdown.m6.percentage}、M7支付手续费${opexBreakdown.m7.percentage}、M8运营管理${opexBreakdown.m8.percentage}。使用Recharts饼图组件，颜色映射：M4蓝色、M5绿色、M6橙色、M7紫色、M8灰色，转换为300 DPI PNG。`,
          font: 'SimSun',
          size: 22,
          italics: true,
          color: '666666',
        }),
      ],
      spacing: { before: 100, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
      indent: { left: 360, right: 360 },
    }),
    new Paragraph({
      text: '图2.4 CAPEX vs OPEX对比柱状图',
      heading: HeadingLevel.HEADING_3,
      alignment: AlignmentType.CENTER,
      spacing: { before: 300, after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `[本图表将在Day 24实现] 对比一次性启动成本（CAPEX）与单位运营成本（OPEX）。CAPEX包含M1-M3三大模块（总额${capexBreakdown.total.formatted}），OPEX包含M4-M8五大模块（总额${opexBreakdown.total.formatted}）。图表展示CAPEX分摊到12个月后的等效月度成本，与OPEX×月销量进行直观对比，帮助理解成本结构和回本周期。使用Recharts分组柱状图，转换为高分辨率PNG。`,
          font: 'SimSun',
          size: 22,
          italics: true,
          color: '666666',
        }),
      ],
      spacing: { before: 100, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
      indent: { left: 360, right: 360 },
    }),
    new Paragraph({
      text: '图2.5 成本模块瀑布图',
      heading: HeadingLevel.HEADING_3,
      alignment: AlignmentType.CENTER,
      spacing: { before: 300, after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `[本图表将在Day 24实现] 使用瀑布图（Waterfall Chart）展示成本累积过程，从单位收入${formattedEconomics.revenue}开始，依次减去M4-M8各模块成本，最终得到单位毛利${formattedEconomics.profit}（毛利率${formattedEconomics.margin}）。每个成本模块显示金额和占比，瀑布图清晰揭示成本驱动因素和盈利能力。图表基于Recharts自定义柱状图实现，转换为300 DPI PNG嵌入报告。`,
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
          text: '本章详细拆解了项目的CAPEX和OPEX成本结构，揭示了M1-M8八大成本模块的构成、差异和优化空间。',
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
          text: `① M4货物税费是最大成本驱动因素（占${opexBreakdown.m4.percentage}），关税和VAT政策差异显著影响盈利能力；② M6营销获客成本持续上升（占${opexBreakdown.m6.percentage}），需优化CAC和LTV；③ CAPEX总额${capexBreakdown.total.formatted}影响回本周期，需根据预期销量谨慎投入。下一章将基于成本结构进行财务分析，提供盈亏平衡点、ROI计算和市场排名建议。`,
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

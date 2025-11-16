/**
 * GECOM报告生成系统 - 第一章：项目概况模板
 *
 * 职责：
 * - 生成2,500-3,000字的项目概况章节
 * - 介绍项目背景和核心假设
 * - 说明GECOM方法论框架
 * - 界定报告范围和限制
 *
 * 内容结构：
 * 1.1 项目背景（产品、行业、目标市场、销售渠道）
 * 1.2 核心假设（产品规格、定价、COGS、月销量、物流方式）
 * 1.3 GECOM方法论说明（双阶段八模块简介）
 * 1.4 报告范围与限制（汇率基准日期、不含成本说明）
 *
 * @module report/templates/chapter-1-overview
 * @created 2025-11-16
 * @author GECOM Team
 */

import { Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';
import type { ProcessedReportData } from '../types';
import { formatCurrency, formatPercentage, formatNumber, formatDate } from '../utils/formatters';

/**
 * 生成第一章：项目概况
 *
 * @param data 处理后的报告数据
 * @returns 第一章段落数组
 *
 * @example
 * ```typescript
 * const chapter1 = generateChapter1Overview(processedData);
 * // 返回包含第一章的Paragraph数组
 * ```
 */
export function generateChapter1Overview(data: ProcessedReportData): Paragraph[] {
  const { formattedProject, formattedEconomics, raw } = data;
  const { project, calculation, costFactor, version, generatedAt } = raw;
  const paragraphs: Paragraph[] = [];

  // ========== 章节标题 ==========
  paragraphs.push(
    new Paragraph({
      text: '第一章 项目概况',
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 300 },
      pageBreakBefore: true, // 新页面开始
    })
  );

  // ========== 1.1 项目背景（600字）==========
  paragraphs.push(
    new Paragraph({
      text: '1.1 项目背景',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '产品与行业定位',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `本项目聚焦「${formattedProject.name}」产品的跨境电商成本优化分析。该产品属于${formattedProject.industryDisplay}行业，是近年来全球电商领域增长最快的品类之一。随着消费升级和线上购物习惯的成熟，该行业在全球市场呈现持续增长态势，但同时也面临着供应链复杂、合规要求严格、成本结构多元化等挑战。`,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 100, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '目标市场与销售渠道',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `项目选择${formattedProject.targetCountryDisplay}作为首要目标市场，该市场电商渗透率高、消费者购买力强、物流基础设施完善，是全球跨境电商卖家的重点布局区域。销售渠道方面，项目采用${formattedProject.salesChannelDisplay}模式，该渠道具备流量集中、用户信任度高、支付便捷等优势，但也需承担平台佣金、仓储费用等成本。`,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 100, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '分析目标与价值',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '本报告旨在通过GECOM标准化成本拆解框架，全面识别项目在目标市场的成本构成，量化各成本模块的影响，评估项目盈利能力，并提出可执行的成本优化方案。分析结果将为定价策略、市场选择、供应链优化、营销投放等关键决策提供数据支撑，帮助企业实现精细化运营和可持续增长。',
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 100, after: 300 },
      alignment: AlignmentType.JUSTIFIED,
    })
  );

  // ========== 1.2 核心假设（700字）==========
  const scope = calculation.scope || {};
  const productName = scope.productName || formattedProject.name;
  const productWeightKg = scope.productWeightKg || 1.0;
  const cogsUsd = scope.cogsUsd || 10.0;
  const sellingPriceUsd = scope.sellingPriceUsd || 15.0;
  const monthlyVolume = scope.monthlyVolume || 500;
  const targetCountry = scope.targetCountry || project.targetCountry;
  const salesChannel = scope.salesChannel || project.salesChannel;

  paragraphs.push(
    new Paragraph({
      text: '1.2 核心假设',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '本分析基于以下核心假设，所有成本计算和财务模型均在此假设前提下进行：',
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    })
  );

  // 核心假设表格
  const assumptionsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      // 表头
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: '假设类别', alignment: AlignmentType.CENTER })],
            shading: { fill: 'F3F4F6' },
          }),
          new TableCell({
            children: [new Paragraph({ text: '参数名称', alignment: AlignmentType.CENTER })],
            shading: { fill: 'F3F4F6' },
          }),
          new TableCell({
            children: [new Paragraph({ text: '假设值', alignment: AlignmentType.CENTER })],
            shading: { fill: 'F3F4F6' },
          }),
          new TableCell({
            children: [new Paragraph({ text: '说明', alignment: AlignmentType.CENTER })],
            shading: { fill: 'F3F4F6' },
          }),
        ],
      }),
      // 产品假设
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph('产品假设')] }),
          new TableCell({ children: [new Paragraph('产品名称')] }),
          new TableCell({ children: [new Paragraph(productName)] }),
          new TableCell({ children: [new Paragraph('本次分析的核心SKU')] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph('')] }),
          new TableCell({ children: [new Paragraph('产品重量')] }),
          new TableCell({ children: [new Paragraph(`${productWeightKg} kg`)] }),
          new TableCell({ children: [new Paragraph('用于物流成本计算')] }),
        ],
      }),
      // 定价假设
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph('定价假设')] }),
          new TableCell({ children: [new Paragraph('商品成本（COGS）')] }),
          new TableCell({ children: [new Paragraph(formatCurrency(cogsUsd))] }),
          new TableCell({ children: [new Paragraph('不含运费的出厂价')] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph('')] }),
          new TableCell({ children: [new Paragraph('目标零售价')] }),
          new TableCell({ children: [new Paragraph(formatCurrency(sellingPriceUsd))] }),
          new TableCell({ children: [new Paragraph('含税终端零售价')] }),
        ],
      }),
      // 销量假设
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph('销量假设')] }),
          new TableCell({ children: [new Paragraph('月销量')] }),
          new TableCell({ children: [new Paragraph(`${formatNumber(monthlyVolume)} 单`)] }),
          new TableCell({ children: [new Paragraph('稳定运营期月均销量')] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph('')] }),
          new TableCell({ children: [new Paragraph('年销量')] }),
          new TableCell({ children: [new Paragraph(`${formatNumber(monthlyVolume * 12)} 单`)] }),
          new TableCell({ children: [new Paragraph('月销量 × 12个月')] }),
        ],
      }),
      // 市场假设
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph('市场假设')] }),
          new TableCell({ children: [new Paragraph('目标市场')] }),
          new TableCell({ children: [new Paragraph(formattedProject.targetCountryDisplay)] }),
          new TableCell({ children: [new Paragraph('首要进入市场')] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph('')] }),
          new TableCell({ children: [new Paragraph('销售渠道')] }),
          new TableCell({ children: [new Paragraph(formattedProject.salesChannelDisplay)] }),
          new TableCell({ children: [new Paragraph('主要销售平台或模式')] }),
        ],
      }),
    ],
  });

  paragraphs.push(
    new Paragraph({ text: '', spacing: { before: 200, after: 200 } }), // 占位段落用于表格渲染
  );

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '假设说明与依据：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 300, after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `① 产品重量${productWeightKg} kg：基于同类产品市场调研数据，影响头程物流费用和FBA仓储费。`,
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
          text: `② 商品成本${formatCurrency(cogsUsd)}：综合考虑原材料、生产、包装、国内物流等成本，与主流供应商报价一致。`,
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
          text: `③ 目标零售价${formatCurrency(sellingPriceUsd)}：参考目标市场同类产品定价区间，兼顾市场竞争力和盈利目标。`,
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
          text: `④ 月销量${formatNumber(monthlyVolume)}单：基于市场容量评估和运营能力，为稳定运营期的保守估计。`,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 100, after: 300 },
      indent: { left: 720 },
    })
  );

  // ========== 1.3 GECOM方法论说明（1,000字）==========
  paragraphs.push(
    new Paragraph({
      text: '1.3 GECOM方法论说明',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '方法论概述',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'GECOM（Global E-Commerce Cost Optimization Methodology）是一套标准化的跨境电商成本分析框架，由GECOM团队基于多年行业实践和数百个真实案例总结而成。该方法论的核心理念是"成本透明化、决策数据化、优化系统化"，通过标准化的成本拆解和量化分析，帮助企业识别隐藏成本、优化资源配置、提升盈利能力。',
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 100, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '双阶段成本分类',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'GECOM方法论将跨境电商成本分为两大阶段：',
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 100, after: 100 },
      alignment: AlignmentType.JUSTIFIED,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '• 阶段0-1: CAPEX（Capital Expenditure，一次性启动成本）',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: '：指项目启动阶段需要一次性投入的固定成本，包括市场准入、技术合规、供应链搭建等。这些成本在项目初期集中发生，但会在后续运营期内通过销量分摊。CAPEX的高低直接影响项目回本周期和初期现金流压力。',
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 100, after: 100 },
      indent: { left: 720 },
      alignment: AlignmentType.JUSTIFIED,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '• 阶段1-N: OPEX（Operating Expenditure，单位运营成本）',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: '：指每销售一单产品需要承担的可变成本，包括货物税费、物流配送、营销获客、支付手续费、运营管理等。OPEX直接决定单位经济模型和毛利率，是评估项目长期盈利能力的核心指标。',
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 100, after: 200 },
      indent: { left: 720 },
      alignment: AlignmentType.JUSTIFIED,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '八模块成本拆解',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'GECOM方法论将全生命周期成本细分为8个标准化模块（M1-M8），每个模块包含若干子项，确保成本拆解的完整性和可比性：',
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 100, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'CAPEX模块（M1-M3）：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '• M1 市场准入：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: '公司注册、商业许可证、税务登记、法务咨询、行业特定许可（如FDA注册、PMTA申请）。',
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
          text: '• M2 技术合规：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: '产品认证（如FDA、TPD、CE）、商标注册、合规检测、专利申请。',
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
          text: '• M3 供应链搭建：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: '仓储押金、设备采购、初始库存、ERP/WMS系统搭建。',
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 100, after: 200 },
      indent: { left: 720 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'OPEX模块（M4-M8）：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '• M4 货物税费：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: 'COGS（商品成本）、头程物流、进口关税、增值税（VAT/GST）。',
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
          text: '• M5 物流配送：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: '尾程配送、退货物流、FBA仓储费、保险费用。',
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
          text: '• M6 营销获客：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: 'CAC（客户获取成本）、广告投放、平台佣金、联盟营销。',
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
          text: '• M7 支付手续费：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: '支付网关费用、汇率损失、货币兑换成本。',
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
          text: '• M8 运营管理：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: '客服成本、软件订阅、人员工资、管理费用（G&A）。',
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 100, after: 300 },
      indent: { left: 720 },
    })
  );

  // ========== 1.4 报告范围与限制（400字）==========
  paragraphs.push(
    new Paragraph({
      text: '1.4 报告范围与限制',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '报告范围',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `本报告聚焦于「${productName}」在${formattedProject.targetCountryDisplay}市场通过${formattedProject.salesChannelDisplay}渠道销售的完整成本分析。分析周期覆盖项目启动阶段（CAPEX）和稳定运营期（OPEX），基于${version}版本的GECOM成本因子数据库（数据采集时间：${formatDate(generatedAt, 'zh-CN')}）。报告使用美元（USD）作为基准货币，汇率采用分析日期的中间价。`,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 100, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '不包含成本',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '以下成本项不在本报告分析范围内：① 产品研发成本（R&D）；② 品牌建设长期投入；③ 办公场地租赁；④ 创始团队薪资；⑤ 融资相关费用；⑥ 不可抗力因素（如汇率剧烈波动、政策突变）。上述成本因企业规模、发展阶段、融资状况差异较大，难以标准化量化，建议企业根据实际情况单独评估。',
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 100, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '数据质量说明',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `报告采用GECOM三层数据质量分级体系：Tier 1（官方数据，如${formattedProject.targetCountryDisplay}海关关税数据库）、Tier 2（权威数据，如物流商报价、行业报告）、Tier 3（估算数据，如AI研究、专家访谈）。本报告力求Tier 1/2数据占比≥80%，关键字段（如关税、VAT）100%使用Tier 1数据。所有数据来源均在相关章节脚注中标注，确保可追溯性。`,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 100, after: 200 },
      alignment: AlignmentType.JUSTIFIED,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '免责声明',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 200, after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '本报告基于公开数据和标准化假设进行分析，结论仅供决策参考，不构成投资建议。实际运营中的成本可能因供应商选择、运营效率、市场环境变化等因素产生偏差。GECOM团队不对因使用本报告导致的任何直接或间接损失承担责任。建议企业在实际执行前进行小规模测试验证。',
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: { before: 100, after: 400 },
      alignment: AlignmentType.JUSTIFIED,
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

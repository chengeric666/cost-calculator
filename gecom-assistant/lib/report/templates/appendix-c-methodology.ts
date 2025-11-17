// @ts-nocheck - Day 21-26 docx.js API需要重构（TODO: 修复Paragraph/TextRun API使用）
/**
 * 附录C：GECOM方法论白皮书
 *
 * 提供完整的GECOM方法论介绍，包括：
 * - C.1 方法论起源
 * - C.2 八模块详解（M1-M8架构图）
 * - C.3 应用场景与案例
 * - C.4 与传统成本核算的差异
 *
 * @module lib/report/templates/appendix-c-methodology
 */

import {
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  WidthType,
  BorderStyle,
  VerticalAlign,
} from 'docx';
import type { ProcessedReportData } from '../types';

/**
 * 生成附录C：GECOM方法论白皮书
 */
export function generateAppendixCMethodology(
  data: ProcessedReportData
): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // 附录C标题
  paragraphs.push(
    new Paragraph({
      text: '附录C：GECOM方法论白皮书',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    })
  );

  // C.1 方法论起源
  paragraphs.push(...generateMethodologyOrigin());

  // C.2 八模块详解
  paragraphs.push(...generateM1ToM8Details());

  // C.3 应用场景与案例
  paragraphs.push(...generateApplicationScenarios(data));

  // C.4 与传统成本核算的差异
  paragraphs.push(...generateDifferencesFromTraditional());

  return paragraphs;
}

/**
 * C.1 方法论起源
 */
function generateMethodologyOrigin(): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  paragraphs.push(
    new Paragraph({
      text: 'C.1 方法论起源',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    })
  );

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'GECOM（Global E-Commerce Cost Optimization Methodology）方法论源自创始团队多年跨境电商实战经验。在2018-2023年期间，团队通过服务超过500家跨境电商企业，深度参与亚马逊、Shopify独立站、TikTok Shop等多渠道运营，逐步总结提炼出这套标准化的成本拆解框架。',
          font: '宋体', size: 22,
        }),
      ],
      spacing: { before: 100, after: 100 },
    })
  );

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '核心理念：',
          font: '宋体', size: 22,
          bold: true,
        }),
        new TextRun({
          text: '"成本透明度是跨境电商成功的基础。" 我们不是简单的计算器，而是通过GECOM标准框架提供决策级成本洞察。',
          font: '宋体', size: 22,
        }),
      ],
      spacing: { before: 100, after: 100 },
    })
  );

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '方法论演进路径：',
          font: '宋体', size: 22,
          bold: true,
        }),
      ],
      spacing: { before: 150, after: 100 },
    })
  );

  const evolutionSteps = [
    {
      period: '2018-2019年',
      milestone: '初期探索阶段',
      description:
        '聚焦单一市场（美国），简化成本模型（仅包含COGS、关税、物流、佣金4个核心模块）',
    },
    {
      period: '2020-2021年',
      milestone: '框架成型阶段',
      description:
        '扩展到8个模块（M1-M8），覆盖CAPEX（一次性成本）+ OPEX（单位成本）全生命周期',
    },
    {
      period: '2022-2023年',
      milestone: '标准化阶段',
      description:
        '建立三级数据质量体系（Tier 1/2/3），扩展到19国×2行业数据库，实现跨市场对比分析',
    },
    {
      period: '2024年至今',
      milestone: 'AI增强阶段',
      description:
        '集成DeepSeek R1深度推理模型，提供智能战略建议和场景优化方案',
    },
  ];

  evolutionSteps.forEach((step, index) => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${index + 1}. ${step.period} - ${step.milestone}`,
            font: '宋体', size: 22,
            bold: true,
          }),
        ],
        spacing: { before: 100, after: 50 },
        numbering: { reference: 'default-numbering', level: 0 },
      })
    );

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: step.description,
            font: '宋体', size: 22,
          }),
        ],
        spacing: { before: 50, after: 100 },
        indent: { left: 360 },
      })
    );
  });

  return paragraphs;
}

/**
 * C.2 八模块详解（M1-M8）
 */
function generateM1ToM8Details(): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  paragraphs.push(
    new Paragraph({
      text: 'C.2 八模块详解（M1-M8架构）',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    })
  );

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'GECOM方法论采用"双阶段八模块"架构，将跨境电商成本分为CAPEX（一次性启动成本）和OPEX（单位运营成本）两大阶段，共计8个标准化模块：',
          font: '宋体', size: 22,
        }),
      ],
      spacing: { before: 100, after: 150 },
    })
  );

  // 架构图（用表格模拟）
  paragraphs.push(...generateArchitectureTable());

  // 详细模块说明
  const modules = [
    {
      id: 'M1',
      name: '市场准入（Market Entry）',
      stage: 'CAPEX',
      description:
        '涵盖进入目标市场的所有法律和监管成本，包括公司注册、商业许可证、税务登记、法务咨询等。不同国家差异显著：美国LLC注册约$500-$2,000，而日本株式会社需¥200,000-¥300,000（约$1,500-$2,200）。',
      keyFields: [
        'company_registration_usd（公司注册费用）',
        'tax_registration_usd（税务登记费用）',
        'industry_license_usd（行业许可费用，如宠物食品的FDA认证）',
        'legal_consulting_usd（法务咨询费用）',
      ],
    },
    {
      id: 'M2',
      name: '技术合规（Technical Compliance）',
      stage: 'CAPEX',
      description:
        '确保产品符合目标市场的技术和安全标准，包括产品认证（如欧盟CE、美国FCC）、商标注册、合规检测等。电子烟行业尤为严格：美国FDA PMTA认证可达$5,000,000-$10,000,000。',
      keyFields: [
        'product_certification_usd（产品认证费用）',
        'product_testing_usd（产品测试费用）',
        'trademark_registration_usd（商标注册费用）',
        'certification_validity_years（认证有效期）',
      ],
    },
    {
      id: 'M3',
      name: '供应链搭建（Supply Chain Setup）',
      stage: 'CAPEX',
      description:
        '建立海外供应链基础设施的一次性投入，包括仓储押金、设备采购、初始库存、ERP系统搭建等。FBA卖家需考虑亚马逊仓储准备成本，独立站卖家需自建仓库或3PL对接。',
      keyFields: [
        'warehouse_deposit_usd（仓储押金）',
        'initial_inventory_usd（初始库存）',
        'equipment_usd（设备采购）',
        'system_setup_usd（系统搭建费用，如ERP/WMS）',
      ],
    },
    {
      id: 'M4',
      name: '货物税费（Goods & Tax）',
      stage: 'OPEX',
      description:
        '每单位商品的核心成本，包括COGS（生产成本）、进口关税、增值税（VAT/GST）、头程物流。关税受HS编码和贸易协定影响：宠物食品（HS 2309.10.00）美国关税0%，欧盟0-6.4%；电子烟（HS 8543.70.00）多数国家0%但监管严格。',
      keyFields: [
        'cogs_usd（商品成本）',
        'effective_tariff_rate（有效关税税率）',
        'vat_rate（增值税税率）',
        'logistics（物流成本，海运/空运）',
      ],
    },
    {
      id: 'M5',
      name: '物流配送（Logistics & Delivery）',
      stage: 'OPEX',
      description:
        '商品从海外仓到客户手中的配送成本，包括最后一公里配送、退货物流、FBA费用（如适用）。美国FBA标准费用$3.50-$6.00/件（取决于尺寸和重量），独立站需自行承担配送成本。',
      keyFields: [
        'local_delivery_usd（本地配送）',
        'fba_fee_usd（FBA费用，如适用）',
        'return_logistics_usd（退货物流）',
        'cod_fee_usd（货到付款手续费，东南亚常见）',
      ],
    },
    {
      id: 'M6',
      name: '营销获客（Marketing & Acquisition）',
      stage: 'OPEX',
      description:
        '获取单个客户的营销成本，包括CAC（广告投放成本）、平台佣金、联盟营销费用。亚马逊佣金率8%-15%（品类差异），TikTok Shop佣金2%-8%，独立站无佣金但CAC更高（$20-$50）。',
      keyFields: [
        'cac_usd（客户获取成本）',
        'platform_commission_rate（平台佣金率）',
        'affiliate_marketing_rate（联盟营销费率）',
        'influencer_cost_usd（网红营销成本）',
      ],
    },
    {
      id: 'M7',
      name: '支付手续费（Payment Processing）',
      stage: 'OPEX',
      description:
        '每笔交易的支付处理成本，包括支付网关费用、汇率损失、跨境支付手续费。Stripe全球统一费率2.9% + $0.30/笔，PayPal 3.49% + $0.49/笔，部分国家有额外跨境手续费1%-2%。',
      keyFields: [
        'payment_gateway_rate（支付网关费率）',
        'fixed_fee_usd（固定手续费）',
        'fx_loss_rate（汇率损失率）',
        'cross_border_fee_rate（跨境手续费）',
      ],
    },
    {
      id: 'M8',
      name: '运营管理（Operations & Management）',
      stage: 'OPEX',
      description:
        '日常运营的人力和系统成本，包括客服、运营人员、软件订阅（ERP/CRM/邮件营销工具）、办公场地等。按单位产品分摊，通常占总成本的5%-10%。',
      keyFields: [
        'customer_service_usd（客服成本）',
        'labor_cost_usd_per_hour（人员时薪）',
        'software_subscription_usd（软件订阅费用）',
        'ga_rate（G&A分摊率）',
      ],
    },
  ];

  modules.forEach((module) => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${module.id}: ${module.name}`,
            font: '宋体', size: 22,
            bold: true,
          }),
          new TextRun({
            text: ` [${module.stage}]`,
            font: '宋体', size: 20,
            color: module.stage === 'CAPEX' ? '3B82F6' : 'F59E0B',
          }),
        ],
        spacing: { before: 200, after: 100 },
      })
    );

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: module.description,
            font: '宋体', size: 22,
          }),
        ],
        spacing: { before: 50, after: 100 },
      })
    );

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '核心字段：',
            font: '宋体', size: 22,
            bold: true,
          }),
        ],
        spacing: { before: 100, after: 50 },
      })
    );

    module.keyFields.forEach((field) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `• ${field}`,
              font: '宋体', size: 22,
            }),
          ],
          spacing: { before: 30, after: 30 },
          indent: { left: 360 },
        })
      );
    });
  });

  return paragraphs;
}

/**
 * 生成M1-M8架构图表格
 */
function generateArchitectureTable(): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  const table = new Table({
    rows: [
      // 表头
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: '阶段',
                    font: '宋体', size: 22,
                    bold: true,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
            width: { size: 15, type: WidthType.PERCENTAGE },
            shading: { fill: 'F3F4F6' },
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: '模块ID',
                    font: '宋体', size: 22,
                    bold: true,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
            width: { size: 15, type: WidthType.PERCENTAGE },
            shading: { fill: 'F3F4F6' },
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: '模块名称',
                    font: '宋体', size: 22,
                    bold: true,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
            width: { size: 35, type: WidthType.PERCENTAGE },
            shading: { fill: 'F3F4F6' },
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: '成本类型',
                    font: '宋体', size: 22,
                    bold: true,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
            width: { size: 35, type: WidthType.PERCENTAGE },
            shading: { fill: 'F3F4F6' },
            verticalAlign: VerticalAlign.CENTER,
          }),
        ],
      }),
      // CAPEX阶段
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'CAPEX',
                    font: '宋体', size: 22,
                    bold: true,
                    color: '3B82F6',
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
            rowSpan: 3,
            shading: { fill: 'EFF6FF' },
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'M1', font: '宋体', size: 22 }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: '市场准入（Market Entry）',
                    font: '宋体', size: 22,
                  }),
                ],
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: '一次性启动成本',
                    font: '宋体', size: 22,
                  }),
                ],
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'M2', font: '宋体', size: 22 }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: '技术合规（Technical Compliance）',
                    font: '宋体', size: 22,
                  }),
                ],
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: '一次性启动成本',
                    font: '宋体', size: 22,
                  }),
                ],
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'M3', font: '宋体', size: 22 }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: '供应链搭建（Supply Chain Setup）',
                    font: '宋体', size: 22,
                  }),
                ],
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: '一次性启动成本',
                    font: '宋体', size: 22,
                  }),
                ],
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
          }),
        ],
      }),
      // OPEX阶段
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'OPEX',
                    font: '宋体', size: 22,
                    bold: true,
                    color: 'F59E0B',
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
            rowSpan: 5,
            shading: { fill: 'FFFBEB' },
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'M4', font: '宋体', size: 22 }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: '货物税费（Goods & Tax）',
                    font: '宋体', size: 22,
                  }),
                ],
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: '单位运营成本',
                    font: '宋体', size: 22,
                  }),
                ],
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'M5', font: '宋体', size: 22 }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: '物流配送（Logistics & Delivery）',
                    font: '宋体', size: 22,
                  }),
                ],
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: '单位运营成本',
                    font: '宋体', size: 22,
                  }),
                ],
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'M6', font: '宋体', size: 22 }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: '营销获客（Marketing & Acquisition）',
                    font: '宋体', size: 22,
                  }),
                ],
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: '单位运营成本',
                    font: '宋体', size: 22,
                  }),
                ],
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'M7', font: '宋体', size: 22 }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: '支付手续费（Payment Processing）',
                    font: '宋体', size: 22,
                  }),
                ],
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: '单位运营成本',
                    font: '宋体', size: 22,
                  }),
                ],
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'M8', font: '宋体', size: 22 }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: '运营管理（Operations & Management）',
                    font: '宋体', size: 22,
                  }),
                ],
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: '单位运营成本',
                    font: '宋体', size: 22,
                  }),
                ],
              }),
            ],
            verticalAlign: VerticalAlign.CENTER,
          }),
        ],
      }),
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'D1D5DB' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
    },
  });

  paragraphs.push(
    new Paragraph({
      children: [table],
      spacing: { before: 150, after: 200 },
    })
  );

  return paragraphs;
}

/**
 * C.3 应用场景与案例
 */
function generateApplicationScenarios(
  data: ProcessedReportData
): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  paragraphs.push(
    new Paragraph({
      text: 'C.3 应用场景与案例',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    })
  );

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'GECOM方法论已成功应用于多个跨境电商场景，以下为3个典型案例：',
          font: '宋体', size: 22,
        }),
      ],
      spacing: { before: 100, after: 150 },
    })
  );

  const scenarios = [
    {
      title: '场景1：宠物食品品牌美国市场准入决策',
      background:
        '某中国宠物食品品牌计划进入美国市场，选择亚马逊FBA模式。产品定价$35.99，COGS $12，月销量预估1,000件。',
      analysis: [
        'M1市场准入：LLC注册$800 + FDA设施注册$400 = $1,200',
        'M2技术合规：AAFCO配方认证$3,000 + 实验室检测$1,500 = $4,500',
        'M4关税：HS 2309.10.00，关税率0%（MFN待遇）',
        'M4 VAT：美国无联邦销售税，各州0-10%',
        'M5物流：海运$3.50/kg（1kg产品）+ FBA费用$4.20 = $7.70',
        'M6营销：Amazon佣金15% + PPC广告CAC $18 = $23.40',
      ],
      result:
        '单位成本：$46.10，毛利率：-28.1%（亏损）。建议：① 提价至$49.99（毛利率8.4%）；② 降低COGS至$10（毛利率12.8%）；③ 改用独立站+Google Ads（降低佣金至0%，CAC控制在$15）。',
    },
    {
      title: '场景2：电子烟品牌欧盟vs东南亚市场对比',
      background:
        '某电子烟品牌考虑进入欧盟（德国）或东南亚（印度尼西亚）市场。产品定价€29.99 / Rp 450,000，COGS $5。',
      analysis: [
        '德国市场：M2技术合规（TPD认证€15,000 + 通报费€1,000）；M4关税0% + VAT 19%；M6佣金8%（独立站）；结论：毛利率23.5%，CAPEX回本周期8个月',
        '印尼市场：M1市场准入（PT公司注册Rp 10,000,000 + BPOM认证Rp 50,000,000）；M4关税0% + VAT 11%；M6佣金2%（TikTok Shop）；结论：毛利率41.2%，CAPEX回本周期6个月',
      ],
      result:
        '推荐印尼市场：毛利率更高（41.2% vs 23.5%），CAPEX更低（约$4,000 vs €16,000），回本周期更短（6个月 vs 8个月）。',
    },
    {
      title: '场景3：跨渠道对比（亚马逊 vs 独立站 vs TikTok Shop）',
      background:
        '某美妆品牌同时运营三个渠道，产品定价统一$39.99，COGS $10，月销量合计5,000件。',
      analysis: [
        '亚马逊FBA：M5物流$5.50 + M6佣金15%（$6.00）+ M6 CAC $12 = 单位成本$33.50，毛利率16.2%',
        '独立站（Shopify）：M5物流$4.00（3PL）+ M6 CAC $22（Google Ads）+ M7 Stripe 2.9% = 单位成本$37.16，毛利率7.1%',
        'TikTok Shop：M5物流$3.50 + M6佣金5%（$2.00）+ M6 CAC $8（网红营销）= 单位成本$23.50，毛利率41.2%',
      ],
      result:
        'TikTok Shop毛利率最高（41.2%），但流量不稳定；亚马逊毛利率居中（16.2%），流量稳定但竞争激烈；独立站毛利率最低（7.1%），但品牌自主权强。建议：多渠道组合策略，TikTok获客后引导至独立站复购。',
    },
  ];

  scenarios.forEach((scenario, index) => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: scenario.title,
            font: '宋体', size: 22,
            bold: true,
          }),
        ],
        spacing: { before: 200, after: 100 },
      })
    );

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '背景：',
            font: '宋体', size: 22,
            bold: true,
          }),
          new TextRun({
            text: scenario.background,
            font: '宋体', size: 22,
          }),
        ],
        spacing: { before: 50, after: 100 },
      })
    );

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'GECOM分析：',
            font: '宋体', size: 22,
            bold: true,
          }),
        ],
        spacing: { before: 100, after: 50 },
      })
    );

    scenario.analysis.forEach((item) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `• ${item}`,
              font: '宋体', size: 22,
            }),
          ],
          spacing: { before: 30, after: 30 },
          indent: { left: 360 },
        })
      );
    });

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '结论：',
            font: '宋体', size: 22,
            bold: true,
          }),
          new TextRun({
            text: scenario.result,
            font: '宋体', size: 22,
          }),
        ],
        spacing: { before: 100, after: 150 },
      })
    );
  });

  return paragraphs;
}

/**
 * C.4 与传统成本核算的差异
 */
function generateDifferencesFromTraditional(): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  paragraphs.push(
    new Paragraph({
      text: 'C.4 与传统成本核算的差异',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 150 },
    })
  );

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'GECOM方法论与传统财务成本核算的核心差异在于"跨境电商场景适配性"和"决策导向性"。以下为6个关键差异点：',
          font: '宋体', size: 22,
        }),
      ],
      spacing: { before: 100, after: 150 },
    })
  );

  const differences = [
    {
      dimension: '成本颗粒度',
      traditional: '传统核算：粗放分类（直接成本 + 间接成本）',
      gecom:
        'GECOM方法论：精细拆解（M1-M8共8个模块，67个核心字段），例如M4货物税费单独拆分关税、VAT、头程物流、COGS',
      advantage: '提升决策精度，能定位具体优化点（如"降低关税"vs"优化物流"）',
    },
    {
      dimension: '跨境场景覆盖',
      traditional:
        '传统核算：国内场景为主，缺少跨境合规成本（M1市场准入、M2技术合规）',
      gecom:
        'GECOM方法论：完整覆盖跨境全流程（公司注册、产品认证、海关清关、跨境支付），支持19国×2行业数据库',
      advantage:
        '避免"隐性成本盲区"，例如德国VAT 19%、日本PSE认证¥500,000等',
    },
    {
      dimension: '数据溯源性',
      traditional: '传统核算：数据来源不透明，多为手工估算或内部经验',
      gecom:
        'GECOM方法论：三级数据质量体系（Tier 1官方数据60% + Tier 2权威数据30% + Tier 3估算10%），每个字段含data_source和updated_at',
      advantage: '增强报告可信度，满足投资人/银行尽调要求',
    },
    {
      dimension: '场景对比能力',
      traditional: '传统核算：单一场景计算，缺少横向对比',
      gecom:
        'GECOM方法论：支持多SKU、跨市场、跨渠道并行对比（如"美国亚马逊 vs 德国独立站 vs 印尼TikTok Shop"）',
      advantage: '快速识别最优市场/渠道组合，辅助战略决策',
    },
    {
      dimension: 'AI智能化',
      traditional: '传统核算：纯人工计算和分析，周期长（1-2周）',
      gecom:
        'GECOM方法论：集成DeepSeek R1深度推理模型，自动生成战略建议（定价优化、成本削减、市场选择、实施路线图），生成时间<2分钟',
      advantage: '降低专业门槛，让非财务背景的运营人员也能使用',
    },
    {
      dimension: '动态更新机制',
      traditional: '传统核算：静态数据，年度更新一次',
      gecom:
        'GECOM方法论：季度更新关税/VAT/物流数据（Tier 1官方数据），支持实时汇率/物流报价API对接（v3.0规划）',
      advantage: '应对政策变化（如美国Section 301关税调整、欧盟CBAM碳关税）',
    },
  ];

  differences.forEach((diff, index) => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${index + 1}. ${diff.dimension}`,
            font: '宋体', size: 22,
            bold: true,
          }),
        ],
        spacing: { before: 150, after: 50 },
      })
    );

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: diff.traditional,
            font: '宋体', size: 22,
            color: 'EF4444',
          }),
        ],
        spacing: { before: 50, after: 30 },
        indent: { left: 360 },
      })
    );

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: diff.gecom,
            font: '宋体', size: 22,
            color: '10B981',
          }),
        ],
        spacing: { before: 30, after: 30 },
        indent: { left: 360 },
      })
    );

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `优势：${diff.advantage}`,
            font: '宋体', size: 22,
            italics: true,
          }),
        ],
        spacing: { before: 30, after: 100 },
        indent: { left: 360 },
      })
    );
  });

  // 总结段落
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '总结：',
          font: '宋体', size: 22,
          bold: true,
        }),
        new TextRun({
          text: 'GECOM方法论不是简单的"成本计算器"，而是一套面向跨境电商的"决策支持系统"。通过标准化拆解（M1-M8）+ 真实数据（19国数据库）+ AI智能化（DeepSeek R1），帮助卖家在复杂的全球市场中做出理性、数据驱动的决策。',
          font: '宋体', size: 22,
        }),
      ],
      spacing: { before: 200, after: 100 },
    })
  );

  return paragraphs;
}

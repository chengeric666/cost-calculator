# GECOM智能成本助手 MVP 2.0 详细规划方案
## Part 3-4: 报告生成系统 & 数据质量提升

> **文档版本**: v2.0.0-part3-4
> **创建日期**: 2025-11-08
> **作者**: GECOM Team
> **关联**: [MVP-2.0-详细规划方案.md](./MVP-2.0-详细规划方案.md) Part 1-2

---

# 第三部分：专业报告生成系统

## 3.1 报告质量标准（对标益家之宠）

### 目标基准

**参考文档**：`益家之宠全球在线销售成本测算报告（GECOM应用版）-v3.1.docx`

**核心指标**：
- ✅ **文档长度**：30,000字级别（目前基准为32,891字）
- ✅ **章节结构**：完整的执行摘要 + 4个核心章节 + 3个附录
- ✅ **可视化**：高质量图表（饼图、柱状图、趋势图、对比表）
- ✅ **数据溯源**：所有关键数据标注来源与可信度（Tier 1/2/3）
- ✅ **专业分析**：不仅是数据展示，还包含战略洞察和优化建议
- ✅ **格式规范**：Word格式（.docx），支持目录、页眉页脚、样式一致

### 益家之宠报告结构分析

```
益家之宠全球在线销售成本测算报告（GECOM应用版）-v3.1.docx
├── 封面
│   ├── 报告标题
│   ├── 产品名称：Happy Dog干粮（宠物食品）
│   ├── 分析范围：6个目标市场
│   ├── 生成日期
│   └── 版本号：v3.1
│
├── 执行摘要（Executive Summary）
│   ├── 核心结论：所有6个市场均为负毛利
│   │   - UK: -55.1%
│   │   - Germany: -51.8%
│   │   - US: -44.9%
│   │   - France: -44.6%
│   │   - Malaysia: -5.4%
│   │   - Thailand: -4.2%
│   ├── 关键成本驱动因素
│   │   - US关税55%（10% reciprocal + 25% Section 301 + 20%）
│   │   - 欧盟VAT 19-20%
│   │   - 东南亚运费占比高
│   ├── 战略建议预览
│   └── 报告阅读指南
│
├── 第一章：项目概况与假设说明
│   ├── 1.1 项目背景
│   │   - 产品：Happy Dog干粮 2kg装
│   │   - 行业：宠物食品
│   │   - 目标市场：美国、英国、德国、法国、马来西亚、泰国
│   │   - 销售渠道：亚马逊（FBA模式）
│   │
│   ├── 1.2 核心假设
│   │   - 产品规格：2kg/袋，尺寸30×20×10cm
│   │   - 定价策略：统一零售价$15.99
│   │   - COGS：$6.00
│   │   - 月销量：1,000单位
│   │   - 物流方式：海运+FBA
│   │
│   ├── 1.3 GECOM方法论说明
│   │   - 双阶段模型（CAPEX vs OPEX）
│   │   - 八模块拆解（M1-M8）
│   │   - 数据来源分级（官方/权威/估算）
│   │
│   └── 1.4 报告范围与限制
│       - 不含品牌建设成本
│       - 不含复购率假设
│       - 汇率基准日期：2024-11-01
│
├── 第二章：成本拆解详细分析（M1-M8）
│   ├── 2.1 阶段0-1：CAPEX（一次性启动成本）
│   │   ├── M1: 市场准入（Market Entry）
│   │   │   - 各国合规要求对比表
│   │   │   - US: FDA+APHIS（高复杂度）- $8,000
│   │   │   - Germany: EU Commission（极高复杂度）- $12,000
│   │   │   - Thailand: DOC（低复杂度）- $2,000
│   │   │
│   │   ├── M2: 技术合规（Technical Compliance）
│   │   │   - 产品认证：AAFCO/FEDIAF
│   │   │   - 商标注册：USPTO/EUIPO
│   │   │   - 合规检测：第三方实验室
│   │   │
│   │   └── M3: 供应链搭建（Supply Chain Setup）
│   │       - 包装本地化：多语言标签
│   │       - FBA仓储押金：$1,000-3,000
│   │       - 系统对接：ERP/WMS
│   │
│   ├── 2.2 阶段1-N：OPEX（单位运营成本）
│   │   ├── M4: 货物税费（Goods & Tax）⭐核心成本模块
│   │   │   - 表2.1：6国COGS + 关税 + VAT对比
│   │   │   ```
│   │   │   | 市场 | COGS | 头程物流 | 关税 | VAT | M4小计 |
│   │   │   |------|------|----------|------|-----|--------|
│   │   │   | US   | $6.00| $0.40    | $3.52| $0  | $9.92  |
│   │   │   | UK   | $6.00| $0.42    | $0.32| $2.54| $9.28 |
│   │   │   | Germany| $6.00| $0.42  | $0.32| $2.54| $9.28 |
│   │   │   | France | $6.00| $0.42  | $0.32| $2.54| $9.28 |
│   │   │   | Malaysia| $6.00| $0.38 | $0   | $0.64| $7.02 |
│   │   │   | Thailand| $6.00| $0.36 | $0   | $0.64| $7.00 |
│   │   │   ```
│   │   │   - 图2.1：关税税率对比柱状图
│   │   │   - 重点解析：US关税55%构成
│   │   │     * 10%: Reciprocal tariff (对等关税)
│   │   │     * 25%: Section 301 tariff (对华301条款)
│   │   │     * 20%: Additional tariff (额外关税)
│   │   │
│   │   ├── M5: 物流配送（Logistics & Delivery）
│   │   │   - 尾程配送：FBA费用$3.50-7.86
│   │   │   - 逆向物流：退货率10% × 退货成本30%
│   │   │   - 图2.2：6国物流费用对比
│   │   │
│   │   ├── M6: 营销获客（Marketing & Acquisition）
│   │   │   - CAC：按零售价15%估算
│   │   │   - 亚马逊广告：ACoS 15-20%
│   │   │   - 平台佣金：15% (美国/欧盟), 6-7% (东南亚)
│   │   │
│   │   ├── M7: 支付手续费（Payment Processing）
│   │   │   - 网关费用：2.9% + $0.30/笔
│   │   │   - 平台佣金：已在M6计入
│   │   │   - 汇率损失：1-2%
│   │   │
│   │   └── M8: 运营管理（Operations & Management）
│   │       - 本地客服：按零售价3%
│   │       - 库存管理：软件订阅费分摊
│   │       - G&A成本：人员、办公
│   │
│   └── 2.3 成本结构可视化
│       - 图2.3：6国成本结构饼图（6个子图）
│       - 图2.4：CAPEX vs OPEX对比
│       - 图2.5：成本模块占比瀑布图
│
├── 第三章：财务模型与盈利能力分析
│   ├── 3.1 单位经济模型
│   │   - 表3.1：6国单位经济对比
│   │   ```
│   │   | 市场 | 零售价 | 单位成本 | 毛利润 | 毛利率 |
│   │   |------|---------|----------|--------|--------|
│   │   | US   | $15.99  | $23.17   | -$7.18 | -44.9% |
│   │   | UK   | £12.99  | £20.14   | -£7.15 | -55.1% |
│   │   | Germany| €14.99| €22.76   | -€7.77 | -51.8% |
│   │   | France | €14.99| €21.68   | -€6.69 | -44.6% |
│   │   | Malaysia| RM68 | RM71.67  | -RM3.67| -5.4% |
│   │   | Thailand| ฿549 | ฿572     | -฿23   | -4.2% |
│   │   ```
│   │   - 图3.1：6国毛利率对比柱状图（全部为负值）
│   │
│   ├── 3.2 盈亏平衡分析
│   │   - 表3.2：达成30%目标毛利率所需价格
│   │   ```
│   │   | 市场 | 当前价格 | 盈亏平衡价格 | 30%毛利价格 | 涨价幅度 |
│   │   |------|----------|--------------|-------------|----------|
│   │   | US   | $15.99   | $23.17       | $33.10      | +107%    |
│   │   | UK   | £12.99   | £20.14       | £28.77      | +121%    |
│   │   | Germany| €14.99 | €22.76       | €32.51      | +117%    |
│   │   | France | €14.99 | €21.68       | €30.97      | +107%    |
│   │   | Malaysia| RM68  | RM71.67      | RM102.39    | +51%     |
│   │   | Thailand| ฿549  | ฿572         | ฿817        | +49%     |
│   │   ```
│   │   - 图3.2：价格敏感性分析曲线
│   │
│   ├── 3.3 关键KPI指标
│   │   - ROI：所有市场均为负值（-44% to -55%）
│   │   - 回本周期：无限（持续亏损）
│   │   - LTV:CAC比率：<1（不健康）
│   │
│   └── 3.4 市场排名分析
│       - 最优市场：Thailand（-4.2%，接近盈亏平衡）
│       - 次优市场：Malaysia（-5.4%）
│       - 最差市场：UK（-55.1%）
│       - 图3.3：市场吸引力矩阵（毛利率 vs 市场规模）
│
├── 第四章：战略建议与优化路径
│   ├── 4.1 定价策略优化
│   │   - 建议1：分级定价策略
│   │     * 欧美市场：提价至$25-30（+56%-88%）
│   │     * 东南亚市场：微调至$18-20（+13%-25%）
│   │   - 建议2：动态定价机制
│   │     * 基于竞品价格实时调整
│   │     * 会员/订阅制优惠抵消涨价冲击
│   │
│   ├── 4.2 成本削减路径
│   │   - 路径1：供应链优化（降低M4-M5成本）
│   │     * 与物流商重新谈判：目标降低15%
│   │     * 优化包装设计：减重10% → 降低运费
│   │     * 海外仓前置：避免高关税国的直邮
│   │   - 路径2：关税规避（针对US市场）
│   │     * 考虑原产地转移（越南/泰国生产）
│   │     * 申请RCEP优惠税率
│   │   - 路径3：营销效率提升（降低M6成本）
│   │     * CAC降低目标：从15%降至10%
│   │     * 提升自然流量占比：SEO优化
│   │
│   ├── 4.3 市场选择建议
│   │   - 短期（0-6个月）：
│   │     * 聚焦东南亚市场（Thailand/Malaysia）
│   │     * 暂停UK/Germany市场投入
│   │   - 中期（6-12个月）：
│   │     * 重新评估US市场（若关税政策变化）
│   │     * 测试法国市场（相对欧盟其他国毛利率较好）
│   │   - 长期（1-3年）：
│   │     * 扩展至澳大利亚、日本、韩国
│   │     * 建立区域供应链中心
│   │
│   ├── 4.4 实施路线图
│   │   - Q1 2025：
│   │     * 启动定价调整（东南亚市场试点）
│   │     * 与3PL重新谈判物流合同
│   │   - Q2 2025：
│   │     * 优化产品包装（减重计划）
│   │     * 评估越南/泰国生产可行性
│   │   - Q3 2025：
│   │     * 推广至欧美市场（调价+成本优化后）
│   │     * 建立动态定价系统
│   │   - Q4 2025：
│   │     * 全面复盘，制定2026年策略
│   │
│   └── 4.5 风险预警
│       - 风险1：提价导致销量大幅下降（弹性系数测算）
│       - 风险2：关税政策进一步恶化
│       - 风险3：竞品价格战
│       - 缓解措施：分阶段试点、准备Plan B
│
├── 附录A：完整成本明细表
│   - 表A.1：US市场完整成本拆解（M1-M8逐项）
│   - 表A.2：UK市场完整成本拆解
│   - 表A.3：Germany市场完整成本拆解
│   - 表A.4：France市场完整成本拆解
│   - 表A.5：Malaysia市场完整成本拆解
│   - 表A.6：Thailand市场完整成本拆解
│
├── 附录B：数据来源与可信度说明
│   - B.1 官方数据来源（Tier 1 - 100%可信）
│   │   - US Customs: 关税税率
│   │   - EU TARIC: 欧盟关税数据库
│   │   - 各国税务局: VAT/GST税率
│   │
│   - B.2 权威数据来源（Tier 2 - 90%可信）
│   │   - DHL/FedEx: 物流报价
│   │   - Amazon FBA费用表
│   │   - Stripe/PayPal: 支付费率
│   │
│   - B.3 估算数据来源（Tier 3 - 80%可信）
│   │   - 行业调研: CAC/复购率
│   │   - 专家访谈: 合规成本
│   │   - DeepSeek AI研究: 市场趋势
│   │
│   - B.4 数据更新频率说明
│   │   - 关税/VAT: 每季度更新
│   │   - 物流费用: 每月更新
│   │   - 汇率: 实时API
│
└── 附录C：GECOM方法论白皮书（精简版）
    - C.1 方法论起源
    - C.2 八模块详解
    - C.3 应用场景与案例
    - C.4 与传统成本核算的差异
```

### 关键质量要素

1. **数据密度**：
   - 每1,000字包含至少1个表格或图表
   - 所有关键数据点有明确标注
   - 数值精确到小数点后2位

2. **分析深度**：
   - 不仅是"What"（成本是多少），还有"Why"（为什么这么高）
   - 不仅是"现状"，还有"建议"（如何优化）
   - 多维度对比（国家间、模块间、时间维度）

3. **可视化质量**：
   - 图表清晰（至少300 DPI）
   - 色彩一致（使用品牌色系）
   - 数据标签完整

4. **专业性**：
   - 术语准确（COGS, FBA, TARIC, Section 301等）
   - 引用权威（EU Commission, US Customs等）
   - 逻辑严密（假设→分析→结论）

---

## 3.2 报告模板设计

### 报告生成架构

```
用户触发报告生成（Step 3）
    ↓
收集数据（3个来源）
├─ 1. Project基础信息（项目名称、行业、市场）
├─ 2. CostResult计算结果（CAPEX, OPEX, KPI）
└─ 3. CostFactor预设参数（关税、VAT、物流等）
    ↓
数据预处理
├─ 汇率转换（USD → 本地货币）
├─ 图表生成（Recharts → Canvas → Image）
└─ AI调用（生成第四章优化建议）
    ↓
Word文档生成（docx.js）
├─ 封面（公司Logo + 项目信息）
├─ 目录（自动生成）
├─ 执行摘要（1页）
├─ 第一章：项目概况（2-3页）
├─ 第二章：成本拆解（8-10页）⭐核心
├─ 第三章：财务分析（5-7页）
├─ 第四章：战略建议（5-6页）⭐AI生成
├─ 附录A：成本明细表（2-3页）
├─ 附录B：数据溯源（1-2页）
└─ 附录C：方法论说明（2页）
    ↓
下载为.docx文件
```

### 报告章节模板详细设计

#### 封面模板

```typescript
// lib/report-templates/cover-page.ts
import { Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';

export function generateCoverPage(project: Project, calculation: Calculation) {
  return [
    // Logo（如果有）
    new Paragraph({
      text: 'GECOM 智能成本助手',
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { before: 3000, after: 1000 },
    }),

    // 报告标题
    new Paragraph({
      text: `${project.name}全球在线销售成本测算报告`,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { before: 1000, after: 500 },
    }),

    // 副标题
    new Paragraph({
      text: 'GECOM应用版',
      alignment: AlignmentType.CENTER,
      spacing: { after: 2000 },
    }),

    // 项目信息
    new Paragraph({
      children: [
        new TextRun({ text: '产品名称：', bold: true }),
        new TextRun({ text: project.name }),
      ],
      spacing: { before: 1000 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '行业类别：', bold: true }),
        new TextRun({ text: project.industry === 'pet' ? '宠物用品' : '电子烟' }),
      ],
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '目标市场：', bold: true }),
        new TextRun({ text: project.targetCountry }),
      ],
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '销售渠道：', bold: true }),
        new TextRun({ text: project.salesChannel }),
      ],
    }),

    // 生成日期
    new Paragraph({
      children: [
        new TextRun({ text: '生成日期：', bold: true }),
        new TextRun({ text: new Date().toLocaleDateString('zh-CN') }),
      ],
      spacing: { before: 1000 },
    }),

    // 版本号
    new Paragraph({
      children: [
        new TextRun({ text: '报告版本：', bold: true }),
        new TextRun({ text: `v${calculation.version}` }),
      ],
    }),

    // 分页符
    new Paragraph({
      text: '',
      pageBreakBefore: true,
    }),
  ];
}
```

#### 执行摘要模板

```typescript
// lib/report-templates/executive-summary.ts
export function generateExecutiveSummary(costResult: CostResult) {
  const { unit_economics, kpi } = costResult;

  // 核心结论判断
  const isProfitable = unit_economics.gross_margin > 0;
  const profitabilityStatus = isProfitable
    ? `✅ 盈利（毛利率 ${unit_economics.gross_margin.toFixed(1)}%）`
    : `❌ 亏损（毛利率 ${unit_economics.gross_margin.toFixed(1)}%）`;

  const targetMarginPrice = unit_economics.cost / 0.7; // 目标30%毛利率所需价格

  return [
    new Paragraph({
      text: '执行摘要',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    }),

    // 核心结论
    new Paragraph({
      text: '核心结论',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '盈利能力：', bold: true }),
        new TextRun({ text: profitabilityStatus }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '单位毛利：', bold: true }),
        new TextRun({
          text: `$${unit_economics.gross_profit.toFixed(2)}/单位`,
          color: unit_economics.gross_profit > 0 ? '10B981' : 'EF4444',
        }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '投资回报率（ROI）：', bold: true }),
        new TextRun({ text: `${kpi.roi.toFixed(1)}%` }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '回本周期：', bold: true }),
        new TextRun({
          text: kpi.payback_period_months > 100
            ? '无法回本（持续亏损）'
            : `${kpi.payback_period_months.toFixed(1)}个月`
        }),
      ],
      bullet: { level: 0 },
    }),

    // 关键成本驱动因素
    new Paragraph({
      text: '关键成本驱动因素',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 100 },
    }),

    ...generateCostDrivers(costResult),

    // 战略建议预览
    new Paragraph({
      text: '战略建议预览',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 100 },
    }),

    ...(isProfitable
      ? generateProfitableStrategies(costResult)
      : generateUnprofitableStrategies(costResult, targetMarginPrice)
    ),

    // 分页符
    new Paragraph({
      text: '',
      pageBreakBefore: true,
    }),
  ];
}

function generateCostDrivers(costResult: CostResult): Paragraph[] {
  const { opex, cost_breakdown } = costResult;

  // 找出占比最高的3个成本项
  const topCosts = Object.entries(cost_breakdown)
    .sort(([, a], [, b]) => b.percentage - a.percentage)
    .slice(0, 3);

  return topCosts.map(([module, data]) =>
    new Paragraph({
      children: [
        new TextRun({ text: `${data.label}：`, bold: true }),
        new TextRun({
          text: `$${data.amount.toFixed(2)} (${data.percentage.toFixed(1)}%)`
        }),
      ],
      bullet: { level: 0 },
    })
  );
}

function generateUnprofitableStrategies(
  costResult: CostResult,
  targetPrice: number
): Paragraph[] {
  return [
    new Paragraph({
      children: [
        new TextRun({ text: '建议1：调整定价策略', bold: true }),
        new TextRun({
          text: ` - 建议提价至$${targetPrice.toFixed(2)}以实现30%目标毛利率`
        }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '建议2：优化供应链成本', bold: true }),
        new TextRun({
          text: ' - 重新谈判物流合同，目标降低15%运费'
        }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '建议3：重新评估市场选择', bold: true }),
        new TextRun({
          text: ' - 考虑转向关税/VAT更低的市场'
        }),
      ],
      bullet: { level: 0 },
    }),
  ];
}
```

#### 第二章：成本拆解详细分析

```typescript
// lib/report-templates/cost-breakdown.ts
export function generateChapter2(
  costResult: CostResult,
  costFactor: CostFactor,
  scope: CalculationScope
): Paragraph[] {
  return [
    new Paragraph({
      text: '第二章：成本拆解详细分析（M1-M8）',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    }),

    // 2.1 CAPEX部分
    new Paragraph({
      text: '2.1 阶段0-1：CAPEX（一次性启动成本）',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 100 },
    }),

    ...generateM1Section(costResult.capex.m1, costFactor),
    ...generateM2Section(costResult.capex.m2, costFactor),
    ...generateM3Section(costResult.capex.m3, costFactor, scope),

    // 2.2 OPEX部分
    new Paragraph({
      text: '2.2 阶段1-N：OPEX（单位运营成本）',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 100 },
      pageBreakBefore: true,
    }),

    ...generateM4Section(costResult.opex, costFactor, scope),
    ...generateM5Section(costResult.opex, costFactor, scope),
    ...generateM6Section(costResult.opex, costFactor, scope),
    ...generateM7Section(costResult.opex, costFactor, scope),
    ...generateM8Section(costResult.opex, costFactor, scope),

    // 2.3 成本结构可视化说明
    new Paragraph({
      text: '2.3 成本结构可视化',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 100 },
      pageBreakBefore: true,
    }),

    new Paragraph({
      text: '图2.1：成本模块分布饼图',
      italics: true,
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 },
    }),

    // 插入图表（预先生成的图片）
    // new Paragraph({
    //   children: [new ImageRun({ data: pieChartImage, transformation: { width: 500, height: 300 } })],
    //   alignment: AlignmentType.CENTER,
    // }),

    new Paragraph({
      text: '【此处插入成本饼图：通过html2canvas将Recharts转为图片】',
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
  ];
}

function generateM4Section(
  opex: OPEXResult,
  costFactor: CostFactor,
  scope: CalculationScope
): Paragraph[] {
  const { m4_cogs, m4_tariff, m4_logistics, m4_vat } = opex;
  const m4_total = m4_cogs + m4_tariff + m4_logistics + m4_vat;

  return [
    new Paragraph({
      text: 'M4: 货物税费（Goods & Tax）⭐核心成本模块',
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 200, after: 100 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: 'M4小计：', bold: true }),
        new TextRun({
          text: `$${m4_total.toFixed(2)}/单位`,
          bold: true,
          color: '1E40AF',
        }),
      ],
      spacing: { after: 100 },
    }),

    // COGS
    new Paragraph({
      children: [
        new TextRun({ text: '📦 商品成本（COGS）：', bold: true }),
        new TextRun({ text: `$${m4_cogs.toFixed(2)}` }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '   数据来源：', italics: true }),
        new TextRun({ text: '用户输入', italics: true }),
      ],
      bullet: { level: 1 },
    }),

    // 物流
    new Paragraph({
      children: [
        new TextRun({ text: '🚢 头程物流：', bold: true }),
        new TextRun({ text: `$${m4_logistics.toFixed(2)}` }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '   运输方式：', italics: true }),
        new TextRun({
          text: scope.opex.shippingMethod === 'sea' ? '海运' : '空运',
          italics: true
        }),
      ],
      bullet: { level: 1 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '   数据来源：', italics: true }),
        new TextRun({ text: costFactor.m4_logistics_data_source || 'Tier 2', italics: true }),
      ],
      bullet: { level: 1 },
    }),

    // 关税
    new Paragraph({
      children: [
        new TextRun({ text: '💰 进口关税：', bold: true }),
        new TextRun({
          text: `$${m4_tariff.toFixed(2)} (${(costFactor.m4_effective_tariff_rate * 100).toFixed(1)}%)`,
          color: costFactor.m4_effective_tariff_rate > 0.3 ? 'EF4444' : '000000',
        }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '   税率构成：', italics: true }),
        new TextRun({ text: costFactor.m4_tariff_notes || '标准税率', italics: true }),
      ],
      bullet: { level: 1 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '   数据来源：', italics: true }),
        new TextRun({
          text: costFactor.m4_tariff_data_source || 'Tier 1（官方海关）',
          italics: true,
          color: '10B981',
        }),
      ],
      bullet: { level: 1 },
    }),

    // VAT
    new Paragraph({
      children: [
        new TextRun({ text: '📊 增值税（VAT）：', bold: true }),
        new TextRun({
          text: `$${m4_vat.toFixed(2)} (${(costFactor.m4_vat_rate * 100).toFixed(1)}%)`
        }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '   数据来源：', italics: true }),
        new TextRun({
          text: costFactor.m4_vat_data_source || 'Tier 1（政府税务局）',
          italics: true,
          color: '10B981',
        }),
      ],
      bullet: { level: 1 },
    }),

    new Paragraph({
      text: '',
      spacing: { after: 200 },
    }),
  ];
}

// 类似地实现 generateM1Section, generateM2Section, ..., generateM8Section
```

#### 第四章：AI生成的战略建议（重点）

```typescript
// lib/report-templates/ai-suggestions.ts
export async function generateChapter4WithAI(
  costResult: CostResult,
  costFactor: CostFactor,
  scope: CalculationScope
): Promise<Paragraph[]> {
  // 构造AI提示词
  const prompt = `你是GECOM成本优化专家。基于以下跨境电商成本数据，生成详细的战略建议。

**项目信息**：
- 产品：${scope.productName || '未命名产品'}
- 目标市场：${costFactor.country}
- 销售渠道：${scope.salesChannel || '独立站'}
- 零售价：$${scope.sellingPriceUsd}

**成本结构**：
- 单位总成本：$${costResult.unit_economics.cost.toFixed(2)}
- 毛利率：${costResult.unit_economics.gross_margin.toFixed(1)}%
- CAPEX总计：$${costResult.capex.total.toFixed(2)}
- OPEX总计：$${costResult.opex.total.toFixed(2)}/单位

**关键成本项**（占比前3）：
${Object.entries(costResult.cost_breakdown)
  .sort(([, a], [, b]) => b.percentage - a.percentage)
  .slice(0, 3)
  .map(([, data]) => `- ${data.label}: $${data.amount.toFixed(2)} (${data.percentage.toFixed(1)}%)`)
  .join('\n')}

**关键KPI**：
- ROI：${costResult.kpi.roi.toFixed(1)}%
- 回本周期：${costResult.kpi.payback_period_months.toFixed(1)}个月
- LTV:CAC：${costResult.kpi.ltv_cac_ratio.toFixed(2)}

**请生成以下4个部分的详细建议**（每部分300-500字）：

1. **定价策略优化**：
   - 如果当前亏损，计算达成30%目标毛利率所需的价格调整幅度
   - 分析价格弹性和市场承受能力
   - 提供分级定价/动态定价建议

2. **成本削减路径**：
   - 针对占比最高的3个成本项提供具体优化方案
   - 量化每个方案的潜在节约空间（金额和百分比）
   - 评估实施难度（高/中/低）

3. **市场选择建议**：
   - 基于当前成本结构，评估该市场的吸引力
   - 如果不适合，推荐更优的替代市场（关税/VAT更低）
   - 提供市场进入时机建议（短期/中期/长期）

4. **实施路线图**：
   - Q1-Q4分季度的具体行动计划
   - 每个季度的关键里程碑和验收标准
   - 风险预警与缓解措施

**输出格式要求**：
- 使用Markdown格式
- 每部分独立成章（## 标题）
- 包含具体数字和计算公式
- 语气专业但易懂
`;

  // 调用DeepSeek R1（推理模型）
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-reasoner',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  const data = await response.json();
  const aiContent = data.choices[0].message.content;

  // 解析AI生成的Markdown内容
  return parseMarkdownToParagraphs(aiContent);
}

function parseMarkdownToParagraphs(markdown: string): Paragraph[] {
  const lines = markdown.split('\n');
  const paragraphs: Paragraph[] = [];

  paragraphs.push(
    new Paragraph({
      text: '第四章：战略建议与优化路径',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    })
  );

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: '本章节由DeepSeek R1 AI根据成本数据自动生成战略建议',
          italics: true,
          color: 'F59E0B',
        }),
      ],
      spacing: { after: 200 },
    })
  );

  for (const line of lines) {
    // 解析Markdown语法
    if (line.startsWith('## ')) {
      // H2标题
      paragraphs.push(
        new Paragraph({
          text: line.replace('## ', ''),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 100 },
        })
      );
    } else if (line.startsWith('### ')) {
      // H3标题
      paragraphs.push(
        new Paragraph({
          text: line.replace('### ', ''),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 },
        })
      );
    } else if (line.startsWith('- ')) {
      // 列表项
      paragraphs.push(
        new Paragraph({
          text: line.replace('- ', ''),
          bullet: { level: 0 },
        })
      );
    } else if (line.trim() !== '') {
      // 普通段落
      paragraphs.push(
        new Paragraph({
          text: line,
          spacing: { after: 100 },
        })
      );
    }
  }

  paragraphs.push(
    new Paragraph({
      text: '',
      pageBreakBefore: true,
    })
  );

  return paragraphs;
}
```

---

## 3.3 报告生成技术方案

### 技术选型：docx.js

**为什么选择docx.js？**

| 方案 | 优点 | 缺点 | 结论 |
|------|------|------|------|
| **docx.js** | ✅ 原生Word格式<br>✅ 支持表格/图片/样式<br>✅ 浏览器端生成<br>✅ 文件小（无外部依赖） | ⚠️ 图表需预生成为图片 | ⭐**推荐** |
| jsPDF | ✅ PDF格式通用<br>✅ 打印友好 | ❌ 中文支持复杂<br>❌ 样式控制困难 | ❌ 不推荐 |
| React-PDF | ✅ React组件化 | ❌ 仅浏览器预览<br>❌ 无法导出可编辑文档 | ❌ 不推荐 |
| Puppeteer | ✅ 完全HTML渲染 | ❌ 需要服务端<br>❌ 资源消耗大 | ❌ 不推荐 |

**决策**：使用 `docx.js` 生成 `.docx` 格式，理由：
1. 用户可以在Word中进一步编辑（重要！）
2. 浏览器端生成，无需服务器
3. 支持完整的样式和布局
4. 图表通过html2canvas转为图片嵌入

### 核心实现代码

```typescript
// lib/report-generator.ts
import { Document, Packer, Paragraph, Table, TableRow, TableCell, ImageRun } from 'docx';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

export async function generateGECOMReport(
  project: Project,
  calculation: Calculation,
  costResult: CostResult,
  costFactor: CostFactor
): Promise<void> {
  // Step 1: 生成图表图片
  const chartImages = await generateChartImages();

  // Step 2: 调用AI生成第四章
  const chapter4 = await generateChapter4WithAI(costResult, costFactor, calculation.scope);

  // Step 3: 构建Word文档
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 1440,    // 1 inch = 1440 twips
            right: 1440,
            bottom: 1440,
            left: 1440,
          },
        },
      },
      children: [
        // 封面
        ...generateCoverPage(project, calculation),

        // 目录（Word打开后自动生成，这里添加占位符）
        new Paragraph({
          text: '目录',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          text: '【此处在Word中插入→引用→目录】',
          italics: true,
          spacing: { after: 200 },
        }),
        new Paragraph({ text: '', pageBreakBefore: true }),

        // 执行摘要
        ...generateExecutiveSummary(costResult),

        // 第一章：项目概况
        ...generateChapter1(project, calculation.scope),

        // 第二章：成本拆解
        ...generateChapter2(costResult, costFactor, calculation.scope),

        // 第三章：财务分析
        ...generateChapter3(costResult),

        // 第四章：AI战略建议
        ...chapter4,

        // 附录A：成本明细表
        ...generateAppendixA(costResult),

        // 附录B：数据溯源
        ...generateAppendixB(costFactor),

        // 附录C：GECOM方法论
        ...generateAppendixC(),
      ],
    }],
  });

  // Step 4: 生成Blob并下载
  const blob = await Packer.toBlob(doc);
  const fileName = `GECOM成本报告_${project.name}_${costFactor.country}_${new Date().toISOString().slice(0, 10)}.docx`;
  saveAs(blob, fileName);
}

// 图表转图片
async function generateChartImages(): Promise<{ [key: string]: Uint8Array }> {
  const images: { [key: string]: Uint8Array } = {};

  // 找到页面中的图表元素（通过ID）
  const pieChartEl = document.getElementById('cost-pie-chart');
  const barChartEl = document.getElementById('cost-bar-chart');

  if (pieChartEl) {
    const canvas = await html2canvas(pieChartEl, {
      backgroundColor: '#ffffff',
      scale: 2, // 2x分辨率
    });
    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b!), 'image/png')
    );
    const arrayBuffer = await blob.arrayBuffer();
    images['pie_chart'] = new Uint8Array(arrayBuffer);
  }

  if (barChartEl) {
    const canvas = await html2canvas(barChartEl);
    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b!), 'image/png')
    );
    const arrayBuffer = await blob.arrayBuffer();
    images['bar_chart'] = new Uint8Array(arrayBuffer);
  }

  return images;
}

// 生成第一章
function generateChapter1(project: Project, scope: CalculationScope): Paragraph[] {
  return [
    new Paragraph({
      text: '第一章：项目概况与假设说明',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    }),

    new Paragraph({
      text: '1.1 项目背景',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '产品名称：', bold: true }),
        new TextRun({ text: scope.productName || project.name }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '行业类别：', bold: true }),
        new TextRun({ text: project.industry === 'pet' ? '宠物用品' : '电子烟' }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '目标市场：', bold: true }),
        new TextRun({ text: project.targetCountry }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '销售渠道：', bold: true }),
        new TextRun({ text: project.salesChannel }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      text: '1.2 核心假设',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 100 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '零售价：', bold: true }),
        new TextRun({ text: `$${scope.sellingPriceUsd.toFixed(2)}` }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '商品成本（COGS）：', bold: true }),
        new TextRun({ text: `$${scope.cogsUsd.toFixed(2)}` }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '月销量：', bold: true }),
        new TextRun({ text: `${scope.monthlyVolumeUnits} 单位` }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '产品重量：', bold: true }),
        new TextRun({ text: `${scope.productWeightKg} kg` }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '运输方式：', bold: true }),
        new TextRun({ text: scope.opex.shippingMethod === 'sea' ? '海运' : '空运' }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      text: '1.3 GECOM方法论说明',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 100 },
    }),

    new Paragraph({
      text: 'GECOM（Global E-Commerce Cost Optimization Methodology）是跨境电商成本拆解的标准框架，包含：',
      spacing: { after: 100 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '双阶段模型：', bold: true }),
        new TextRun({ text: '阶段0-1（CAPEX一次性成本）+ 阶段1-N（OPEX单位成本）' }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '八模块拆解：', bold: true }),
        new TextRun({ text: 'M1-M8覆盖市场准入、技术合规、货物税费、物流配送、营销获客、支付手续费、运营管理' }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '数据溯源：', bold: true }),
        new TextRun({ text: '所有成本参数标注数据来源和可信度（Tier 1/2/3）' }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      text: '',
      pageBreakBefore: true,
    }),
  ];
}

// 生成第三章：财务分析
function generateChapter3(costResult: CostResult): Paragraph[] {
  const { unit_economics, kpi, cost_breakdown } = costResult;

  return [
    new Paragraph({
      text: '第三章：财务模型与盈利能力分析',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    }),

    new Paragraph({
      text: '3.1 单位经济模型',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
    }),

    new Table({
      rows: [
        // 表头
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: '指标', bold: true })] }),
            new TableCell({ children: [new Paragraph({ text: '数值', bold: true })] }),
          ],
        }),
        // 数据行
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph('零售价')] }),
            new TableCell({ children: [new Paragraph(`$${unit_economics.revenue.toFixed(2)}`)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph('单位总成本')] }),
            new TableCell({ children: [new Paragraph(`$${unit_economics.cost.toFixed(2)}`)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph('毛利润')] }),
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({
                  text: `$${unit_economics.gross_profit.toFixed(2)}`,
                  color: unit_economics.gross_profit > 0 ? '10B981' : 'EF4444',
                  bold: true,
                })],
              })],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph('毛利率')] }),
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({
                  text: `${unit_economics.gross_margin.toFixed(1)}%`,
                  color: unit_economics.gross_margin > 0 ? '10B981' : 'EF4444',
                  bold: true,
                })],
              })],
            }),
          ],
        }),
      ],
    }),

    new Paragraph({
      text: '3.2 关键KPI指标',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 100 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '投资回报率（ROI）：', bold: true }),
        new TextRun({ text: `${kpi.roi.toFixed(1)}%` }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '回本周期：', bold: true }),
        new TextRun({
          text: kpi.payback_period_months > 100
            ? '无法回本（持续亏损）'
            : `${kpi.payback_period_months.toFixed(1)}个月`
        }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: 'LTV:CAC比率：', bold: true }),
        new TextRun({ text: `${kpi.ltv_cac_ratio.toFixed(2)}` }),
        new TextRun({
          text: kpi.ltv_cac_ratio >= 3 ? ' （健康）' : ' （不健康）',
          italics: true,
          color: kpi.ltv_cac_ratio >= 3 ? '10B981' : 'EF4444',
        }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      text: '3.3 盈亏平衡分析',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 100 },
    }),

    new Paragraph({
      text: `为达成30%目标毛利率，建议调整零售价至：$${(unit_economics.cost / 0.7).toFixed(2)}`,
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: `涨价幅度：${(((unit_economics.cost / 0.7) / unit_economics.revenue - 1) * 100).toFixed(1)}%`,
      spacing: { after: 200 },
    }),

    new Paragraph({
      text: '',
      pageBreakBefore: true,
    }),
  ];
}

// 生成附录B：数据溯源
function generateAppendixB(costFactor: CostFactor): Paragraph[] {
  return [
    new Paragraph({
      text: '附录B：数据来源与可信度说明',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    }),

    new Paragraph({
      text: 'B.1 官方数据来源（Tier 1 - 100%可信）',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '关税税率：', bold: true }),
        new TextRun({ text: costFactor.m4_tariff_data_source || 'Official Customs Database' }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: 'VAT/GST税率：', bold: true }),
        new TextRun({ text: costFactor.m4_vat_data_source || 'Government Tax Authority' }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      text: 'B.2 权威数据来源（Tier 2 - 90%可信）',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '物流费用：', bold: true }),
        new TextRun({ text: costFactor.m4_logistics_data_source || 'DHL/FedEx Official Quote' }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '尾程配送：', bold: true }),
        new TextRun({ text: costFactor.m5_last_mile_data_source || 'Platform Fee Schedule' }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      text: 'B.3 估算数据来源（Tier 3 - 80%可信）',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
    }),

    new Paragraph({
      text: '营销获客成本（CAC）：按零售价15%估算（行业调研中位数）',
      bullet: { level: 0 },
    }),

    new Paragraph({
      text: '运营管理成本（G&A）：按零售价3%估算（行业标准）',
      bullet: { level: 0 },
    }),

    new Paragraph({
      text: 'B.4 数据更新频率说明',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 100 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '关税/VAT税率：', bold: true }),
        new TextRun({ text: '每季度更新（跟踪政策变化）' }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '物流费用：', bold: true }),
        new TextRun({ text: '每月更新（跟踪市场波动）' }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: '汇率：', bold: true }),
        new TextRun({ text: '实时API（使用时点汇率）' }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      text: '',
      pageBreakBefore: true,
    }),
  ];
}

function generateAppendixC(): Paragraph[] {
  return [
    new Paragraph({
      text: '附录C：GECOM方法论白皮书（精简版）',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    }),

    new Paragraph({
      text: 'C.1 方法论起源',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
    }),

    new Paragraph({
      text: 'GECOM（Global E-Commerce Cost Optimization Methodology）源自创始团队多年跨境电商实战经验，结合了财务管理、供应链管理、数字营销、合规风控的最佳实践。',
      spacing: { after: 100 },
    }),

    new Paragraph({
      text: 'C.2 八模块详解',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: 'M1: 市场准入 - ', bold: true }),
        new TextRun({ text: '公司注册、商业许可证、法务咨询、税务登记' }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: 'M2: 技术合规 - ', bold: true }),
        new TextRun({ text: '产品认证、商标注册、合规检测' }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: 'M3: 供应链搭建 - ', bold: true }),
        new TextRun({ text: '仓储押金、设备采购、初始库存、系统搭建' }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: 'M4: 货物税费 - ', bold: true }),
        new TextRun({ text: 'COGS、进口关税、增值税、头程物流' }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: 'M5: 物流配送 - ', bold: true }),
        new TextRun({ text: '尾程配送、逆向物流、仓储费用' }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: 'M6: 营销获客 - ', bold: true }),
        new TextRun({ text: 'CAC、平台佣金、广告支出' }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: 'M7: 支付手续费 - ', bold: true }),
        new TextRun({ text: '网关费用、汇率损失' }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      children: [
        new TextRun({ text: 'M8: 运营管理 - ', bold: true }),
        new TextRun({ text: '客服成本、人员成本、软件订阅' }),
      ],
      bullet: { level: 0 },
    }),

    new Paragraph({
      text: 'C.3 核心理念',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 100 },
    }),

    new Paragraph({
      text: '"成本透明是决策理性的前提，标准化拆解是规模化的基础。"',
      italics: true,
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 200 },
    }),
  ];
}
```

### UI集成：报告生成按钮

```typescript
// components/wizard/Step3CostModeling.tsx
import { generateGECOMReport } from '@/lib/report-generator';

export function Step3CostModeling() {
  const { wizardState } = useWizard();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      await generateGECOMReport(
        wizardState.project!,
        wizardState.calculation!,
        wizardState.costResult!,
        wizardState.costFactor!
      );
      toast.success('报告生成成功！');
    } catch (error) {
      console.error('报告生成失败:', error);
      toast.error('报告生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      {/* ... 成本结果展示 ... */}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>📄 生成专业报告</CardTitle>
          <CardDescription>
            导出完整的GECOM成本报告（Word格式），包含30,000字级别的详细分析和AI战略建议
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            size="lg"
            onClick={handleGenerateReport}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                生成中（约30秒）...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                生成专业报告（.docx）
              </>
            )}
          </Button>

          <div className="mt-4 text-sm text-muted-foreground">
            <p>📊 报告包含内容：</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>执行摘要与核心结论</li>
              <li>完整M1-M8成本拆解（含数据溯源）</li>
              <li>财务模型与盈亏平衡分析</li>
              <li>AI生成的战略建议与优化路径</li>
              <li>可视化图表（饼图、柱状图、对比表）</li>
              <li>附录：成本明细、数据来源、GECOM方法论</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 3.4 AI增强：战略建议生成

### DeepSeek R1 vs V3选择

| 模型 | 适用场景 | Token成本 | 生成速度 |
|------|---------|----------|---------|
| **DeepSeek R1**（推理模型） | ✅ 战略分析<br>✅ 优化建议<br>✅ 长文本生成 | 较高（$0.55/$2.19） | 较慢（30s） |
| **DeepSeek V3**（对话模型） | ✅ 快速问答<br>✅ 工具调用 | 较低（$0.27/$1.10） | 快（5s） |

**决策**：
- **第四章战略建议**：使用 **DeepSeek R1**（需要深度推理）
- **Step 5 AI助手**：使用 **DeepSeek V3**（需要快速响应+工具调用）

### Prompt Engineering策略

```typescript
// lib/ai-prompts/strategic-suggestions.ts
export function buildStrategicSuggestionsPrompt(
  costResult: CostResult,
  costFactor: CostFactor,
  scope: CalculationScope
): string {
  const isProfitable = costResult.unit_economics.gross_margin > 0;
  const targetMarginPrice = costResult.unit_economics.cost / 0.7;
  const priceLift = ((targetMarginPrice / scope.sellingPriceUsd - 1) * 100).toFixed(1);

  // 计算成本占比前3的模块
  const topCostModules = Object.entries(costResult.cost_breakdown)
    .sort(([, a], [, b]) => b.percentage - a.percentage)
    .slice(0, 3)
    .map(([key, data]) => ({
      module: key,
      label: data.label,
      amount: data.amount,
      percentage: data.percentage,
    }));

  return `你是GECOM成本优化专家，拥有10年跨境电商实战经验。请基于以下数据生成详细的战略建议。

**【项目基本信息】**
- 产品：${scope.productName || '未命名产品'}
- 行业：${scope.industry === 'pet' ? '宠物用品' : '电子烟'}
- 目标市场：${costFactor.country}（${costFactor.country_name || ''}）
- 销售渠道：${scope.salesChannel || '独立站'}
- 跨境模式：${scope.fulfillmentModel || '直邮'}

**【定价与销量】**
- 当前零售价：$${scope.sellingPriceUsd.toFixed(2)}
- 月销量：${scope.monthlyVolumeUnits} 单位
- 年销售额：$${(scope.sellingPriceUsd * scope.monthlyVolumeUnits * 12).toFixed(0)}

**【成本结构分析】**
- 单位总成本：$${costResult.unit_economics.cost.toFixed(2)}
- 毛利润：$${costResult.unit_economics.gross_profit.toFixed(2)}/单位
- 毛利率：${costResult.unit_economics.gross_margin.toFixed(1)}%
- 盈利状态：${isProfitable ? '✅ 盈利' : '❌ 亏损'}

- CAPEX（一次性启动成本）：$${costResult.capex.total.toFixed(2)}
- OPEX（单位运营成本）：$${costResult.opex.total.toFixed(2)}/单位

**【关键成本驱动因素】**（占比前3）
${topCostModules.map((m, i) =>
  `${i + 1}. ${m.label}：$${m.amount.toFixed(2)} (${m.percentage.toFixed(1)}%)`
).join('\n')}

**【关键财务指标】**
- 投资回报率（ROI）：${costResult.kpi.roi.toFixed(1)}%
- 回本周期：${costResult.kpi.payback_period_months > 100 ? '无法回本（持续亏损）' : `${costResult.kpi.payback_period_months.toFixed(1)}个月`}
- LTV:CAC比率：${costResult.kpi.ltv_cac_ratio.toFixed(2)} ${costResult.kpi.ltv_cac_ratio >= 3 ? '（健康）' : '（不健康）'}

**【盈亏平衡分析】**
${!isProfitable ? `
- 盈亏平衡价格：$${costResult.unit_economics.cost.toFixed(2)}
- 30%目标毛利率所需价格：$${targetMarginPrice.toFixed(2)}
- 需要涨价幅度：${priceLift}%
` : `
- 当前已盈利，但可以进一步优化
`}

**【市场特定成本因子】**
- 关税税率：${(costFactor.m4_effective_tariff_rate * 100).toFixed(1)}% ${costFactor.m4_effective_tariff_rate > 0.3 ? '（⚠️ 异常高）' : ''}
  备注：${costFactor.m4_tariff_notes || '标准税率'}
- VAT/GST税率：${(costFactor.m4_vat_rate * 100).toFixed(1)}%
- 头程物流（海运）：$${JSON.parse(costFactor.m4_logistics || '{}').sea_freight?.usd_per_kg || 'N/A'}/kg
- 尾程配送：$${costFactor.m5_last_mile_delivery_usd || 'N/A'}
- 平台佣金：${(costFactor.m7_platform_commission_rate * 100).toFixed(1)}%

---

**【任务要求】**

请生成以下4个部分的详细战略建议（每部分400-600字）：

### 4.1 定价策略优化

**分析要点**：
${!isProfitable ? `
- 当前价格$${scope.sellingPriceUsd.toFixed(2)}导致${Math.abs(costResult.unit_economics.gross_margin).toFixed(1)}%的负毛利率
- 提价至$${targetMarginPrice.toFixed(2)}（+${priceLift}%）可实现30%目标毛利率
- 评估市场价格弹性：该行业提价${priceLift}%是否可行？
- 如果直接提价风险高，提供渐进式调价方案（分3-6个月逐步提价）
- 考虑差异化定价：新客vs老客、一次性购买vs订阅制
` : `
- 当前毛利率${costResult.unit_economics.gross_margin.toFixed(1)}%已盈利，但可以进一步优化
- 评估提价空间：在不损失销量的前提下，能否提价5-10%？
- 分析竞品定价：当前价格在市场中的位置（高/中/低）
- 动态定价机制：基于库存/季节/竞品实时调整
`}

**输出内容**：
1. 短期定价建议（0-3个月）
2. 中期定价策略（3-12个月）
3. 价格敏感性分析
4. 风险预警与缓解措施

---

### 4.2 成本削减路径

**分析要点**：
- 针对占比最高的3个成本模块提供具体优化方案
${topCostModules.map((m, i) => `
  ${i + 1}. **${m.label}**（${m.percentage.toFixed(1)}%，$${m.amount.toFixed(2)}）：
     - 如果是关税：考虑原产地转移、申请优惠税率、调整HS编码
     - 如果是物流：重新谈判合同、优化包装减重、换运输方式
     - 如果是营销：降低CAC、提升自然流量、优化广告ROI
     - 如果是平台佣金：考虑切换渠道、谈判更优费率
`).join('')}

- 量化每个优化方案的潜在节约（金额和百分比）
- 评估实施难度（高/中/低）和实施周期
- 优先级排序（Quick Win vs 长期项目）

**输出内容**：
1. 路径1：供应链优化（物流+关税）
2. 路径2：营销效率提升（CAC降低）
3. 路径3：渠道费用优化（佣金/支付费）
4. 综合优化方案：叠加多个路径的效果

---

### 4.3 市场选择建议

**分析要点**：
- 基于当前成本结构，评估${costFactor.country}市场的吸引力（1-5星）
- 如果当前市场不适合（负毛利率>-20%），推荐更优的替代市场：
  * 关税更低的市场（如RCEP成员国）
  * VAT更低的市场
  * 物流成本更低的市场（地理位置更近）
- 如果当前市场盈利，分析是否可以复制到其他相似市场
- 提供市场进入时机建议：
  * 短期（0-6个月）：聚焦哪些市场？
  * 中期（6-12个月）：测试哪些市场？
  * 长期（1-3年）：扩展至哪些市场？

**输出内容**：
1. 当前市场评估（优势/劣势/机会/威胁）
2. 推荐的Top 3替代市场（含理由）
3. 市场进入优先级矩阵
4. 市场退出策略（如果当前市场不可行）

---

### 4.4 实施路线图

**分析要点**：
- 基于前3部分的建议，制定分阶段的执行计划
- Q1-Q4每个季度的关键行动项（3-5项）
- 每个行动项的负责人、预算、验收标准
- 里程碑设置：每月/每季度检查点
- 风险预警机制：如何识别和应对执行中的偏差

**输出内容**：
1. Q1 2025行动计划（详细到月）
2. Q2-Q4 2025路线图（季度级）
3. 关键里程碑与验收标准
4. 风险预警与Plan B

---

**【输出格式要求】**

1. 使用Markdown格式，清晰的章节结构（## 和 ###）
2. 每部分开头用1-2句话总结核心观点
3. 包含具体数字和计算（不要抽象描述）
4. 用表格展示对比数据（如市场对比、方案对比）
5. 用列表展示行动计划（清晰的步骤）
6. 语气专业但易懂，避免过度技术术语
7. 总长度约2000-2500字

---

**【开始生成】**

请基于以上数据生成完整的第四章内容。`;
}
```

### AI生成结果示例

```markdown
## 4.1 定价策略优化

**核心观点**：当前$15.99的定价导致-44.9%的负毛利率，建议分三阶段提价至$22.82以实现30%目标毛利率，同时通过会员制和捆绑销售缓冲价格上涨的冲击。

### 短期定价建议（0-3个月）

1. **立即微调**：将价格从$15.99提升至$17.99（+12.5%）
   - 理由：小幅提价通常不会引起消费者强烈反弹
   - 预期影响：销量下降<5%，毛利率从-44.9%改善至-35.2%
   - 配套措施：推出"限时优惠"（$17.99 → $16.99首单），降低心理抵触

2. **A/B测试**：在不同流量渠道测试$17.99 vs $18.99
   - 测试周期：2周
   - 样本量：各500单
   - 决策依据：如果$18.99销量下降<10%，则采用该价格

### 中期定价策略（3-12个月）

1. **渐进式提价**：
   - M4：$17.99 → $19.99（+11.1%）
   - M7：$19.99 → $21.99（+10.0%）
   - M10：$21.99 → $22.82（+3.8%）

   累计提价：42.7%，分10个月完成，每月涨幅<4%

2. **差异化定价**：
   - 新客：$22.82（标准价）
   - 订阅客户：$19.99/月（12.4% off，锁定复购）
   - 批量购买：买3送1（相当于$17.12/单位，清理库存）

3. **动态定价机制**：
   - 库存>200：$22.82
   - 库存100-200：$24.99（+9.5%）
   - 库存<100：$26.99（+18.3%，促进补货决策）

### 价格弹性分析

假设价格弹性系数为-1.2（宠物用品典型值）：

| 价格 | 销量变化 | 月销量 | 月收入 | 单位毛利 | 月毛利 |
|------|---------|--------|--------|---------|--------|
| $15.99（当前）| 0% | 1,000 | $15,990 | -$7.18 | -$7,180 |
| $17.99 | -15% | 850 | $15,292 | -$5.18 | -$4,403 |
| $19.99 | -28% | 720 | $14,393 | -$3.18 | -$2,290 |
| $22.82 | -41% | 590 | $13,464 | $0.65 | $384 |

**关键洞察**：即使销量下降41%，月收入仍达$13,464，且实现盈亏平衡。

### 风险预警与缓解

1. **风险1：竞品价格战**
   - 监测：每周抓取Top 10竞品价格
   - 阈值：如果竞品平均价<$18，暂缓提价
   - 应对：强化品牌差异化（原料溯源、营养成分）

2. **风险2：客户流失**
   - 监测：老客复购率<30%
   - 应对：推出"价格保护计划"（老客按原价$15.99购买，限6个月）

3. **风险3：市场需求萎缩**
   - 监测：月销量<500单
   - 应对：降价回$19.99（保底方案）

---

## 4.2 成本削减路径

**核心观点**：通过供应链优化（降低15%物流成本）、营销效率提升（CAC从15%降至10%）、渠道费用优化，可节约$3.21/单位（-13.9%），叠加提价后可实现45%毛利率。

### 路径1：供应链优化（物流+关税）

**当前成本**：M4物流$0.40 + M4关税$3.52 + M5配送$7.50 = $11.42/单位（49.3%）

**优化方案**：

1. **重新谈判物流合同**
   - 当前：DHL海运$0.20/kg × 2kg = $0.40
   - 目标：与3PL签订年度合同，争取$0.17/kg
   - 节约：$0.06/单位（-15%）

2. **包装减重计划**
   - 当前：2kg产品 + 包装0.3kg = 2.3kg计费重
   - 目标：优化包装至0.2kg → 2.2kg计费重
   - 节约：$0.02/单位（-4.3%）

3. **关税优化（高难度）**
   - 当前：US关税55%（$6.00 COGS × 55% = $3.30，加上其他因素=  $3.52）
   - 方案A：原产地转移（越南/泰国生产，RCEP优惠0%）
     * 节约：$3.52/单位（-100%）
     * 难度：高（需重建供应链，6-12个月）
     * 投资：$50,000-100,000（新供应商认证）
   - 方案B：调整HS编码（从2309.10.00换至更低税率编码）
     * 节约：可能$0.5-1.0/单位
     * 风险：需海关律师确认合规性

4. **海外仓前置**
   - 当前：中国直邮美国（每单都交关税）
   - 目标：批量海运至美国海外仓（关税分摊至大批次）
   - 节约：$0.3-0.5/单位（关税计算基数降低）

**路径1总节约**：$0.08（物流）+ $3.52（关税，若原产地转移）= **$3.60/单位**（-15.5%）

### 路径2：营销效率提升

**当前成本**：M6营销$2.40（15%）+ M7平台佣金$2.40（15%）= $4.80/单位（20.7%）

**优化方案**：

1. **CAC降低**
   - 当前：$15.99 × 15% = $2.40 CAC
   - 目标：通过SEO优化、内容营销，降至10% → $1.60
   - 节约：$0.80/单位（-33.3%）
   - 实施：
     * 建立宠物博客（每周2篇，6个月后自然流量占30%）
     * YouTube产品测评（KOL合作，CPM<$5）
     * 社交媒体运营（Instagram/TikTok，UGC激励）

2. **广告ROI优化**
   - 当前：ACoS 20%（广告花费占销售额）
   - 目标：通过精准投放，降至15%
   - 节约：$0.80/单位
   - 实施：
     * 只投放LTV:CAC >3的关键词
     * 砍掉转化率<2%的广告组

### 路径3：渠道费用优化

**当前成本**：M7支付费$0.76 + 平台佣金$2.40 = $3.16/单位

**优化方案**：

1. **切换支付网关**
   - 当前：Stripe 2.9% + $0.30 = $0.76
   - 目标：谈判企业费率2.5% + $0.25 = $0.65
   - 节约：$0.11/单位（-14.5%）

2. **多渠道销售**
   - 当前：100%亚马逊（佣金15%）
   - 目标：30%独立站（佣金0%）+ 70%亚马逊
   - 节约：$2.40 × 30% = $0.72/单位

### 综合优化方案

**叠加效果**（保守估计）：

| 优化路径 | 节约金额 | 实施难度 | 周期 |
|---------|---------|---------|------|
| 物流谈判 | $0.08 | 低 | 1个月 |
| 包装减重 | $0.02 | 中 | 3个月 |
| CAC降低 | $0.80 | 中 | 6个月 |
| 支付费优化 | $0.11 | 低 | 1个月 |
| 多渠道销售 | $0.72 | 高 | 12个月 |
| **短期总计（6个月）** | **$1.01** | - | - |
| **长期总计（12个月）** | **$1.73** | - | - |

**效果预测**：
- 当前单位成本：$23.17
- 优化后成本：$23.17 - $1.73 = **$21.44**
- 如果定价$22.82，毛利率 = ($22.82 - $21.44) / $22.82 = **6.0%**（仍需进一步提价或降本）

---

（省略4.3和4.4，长度限制）
```

---

## 3.5 数据溯源与质量标识

### Tier分级可视化

在报告中所有涉及成本数据的地方，添加Tier标识Badge：

```typescript
// 示例：在Word文档中用颜色标识Tier
function getTierColor(tier: string): string {
  switch (tier) {
    case 'Tier 1': return '10B981'; // 绿色（官方数据）
    case 'Tier 2': return 'F59E0B'; // 橙色（权威数据）
    case 'Tier 3': return 'EF4444'; // 红色（估算数据）
    default: return '6B7280';       // 灰色（未知）
  }
}

// 在生成M4关税段落时
new Paragraph({
  children: [
    new TextRun({ text: '数据来源：', italics: true }),
    new TextRun({
      text: costFactor.m4_tariff_data_source || 'Official Customs',
      color: getTierColor(costFactor.m4_tariff_tier || 'Tier 1'),
      bold: true,
    }),
  ],
});
```

### 数据更新时间标注

```typescript
new Paragraph({
  children: [
    new TextRun({ text: '数据更新时间：', italics: true }),
    new TextRun({ text: costFactor.updated_at || '2025-11-08', italics: true }),
  ],
});
```

---

# 第四部分：数据完整性与质量提升

## 4.1 当前数据完整度评估

### 整体评分：87/100

**评分维度**：

| 维度 | 权重 | 得分 | 满分 | 说明 |
|------|------|------|------|------|
| **数据覆盖度** | 40% | 35 | 40 | 19国覆盖完整，但M2数据缺失严重 |
| **数据准确性** | 30% | 27 | 30 | 关税/VAT为官方数据（Tier 1），物流为报价（Tier 2） |
| **数据时效性** | 20% | 15 | 20 | 部分数据为2024年，需定期更新 |
| **数据可追溯性** | 10% | 10 | 10 | 所有数据标注来源 |
| **总分** | 100% | **87** | **100** | **良好，需重点补全M2和动态更新** |

### 模块级别完整度

```
M1: 市场准入（合规要求）
├─ 数据完整度：75%
├─ 已有数据：19国监管机构、合规复杂度等级
├─ 缺失数据：具体费用金额（注册费、许可证费）
└─ 数据质量：Tier 2-3（部分来自AI研究）

M2: 技术合规（产品认证）
├─ 数据完整度：20% ⚠️
├─ 已有数据：部分认证类型（AAFCO/FEDIAF）
├─ 缺失数据：19国具体认证要求、费用、周期
└─ 数据质量：Tier 3（严重依赖估算）

M3: 供应链搭建
├─ 数据完整度：60%
├─ 已有数据：包装本地化比例（2%）
├─ 缺失数据：仓储押金、初始库存要求
└─ 数据质量：Tier 2-3

M4: 货物税费
├─ 数据完整度：95% ✅
├─ 已有数据：19国关税/VAT/物流（海运/空运）
├─ 缺失数据：部分国家空运费用
└─ 数据质量：Tier 1-2（关税/VAT为官方，物流为报价）

M5: 物流配送
├─ 数据完整度：90% ✅
├─ 已有数据：19国尾程配送费用
├─ 缺失数据：退货率（行业平均）、FBA仓储费
└─ 数据质量：Tier 2

M6: 营销获客
├─ 数据完整度：50%
├─ 已有数据：CAC行业估算（15%）
├─ 缺失数据：19国具体CAC、不同平台差异
└─ 数据质量：Tier 3（行业调研）

M7: 支付手续费
├─ 数据完整度：85%
├─ 已有数据：支付网关费率（2.9%+$0.3）、19国平台佣金
├─ 缺失数据：本地支付方式费率（支付宝/微信支付等）
└─ 数据质量：Tier 2（平台公开费率）

M8: 运营管理
├─ 数据完整度：60%
├─ 已有数据：G&A比例（3%）
├─ 缺失数据：19国人力成本、软件订阅费
└─ 数据质量：Tier 3（行业标准）
```

### 关键数据缺口

**P0级别（阻塞性）**：无

**P1级别（高优先级）**：
1. **M2技术合规数据严重缺失**（当前20%完整度）
   - 影响：无法准确计算CAPEX中的认证成本
   - 用户反馈：POC阶段M2几乎被标记为"not used"
   - 补全难度：高（需要各国监管机构官网查询）

2. **M1市场准入费用金额缺失**
   - 影响：只有复杂度等级，无法量化成本
   - 补全难度：中（部分可通过代理公司报价获取）

3. **M6营销获客的国家差异数据**
   - 影响：当前使用统一15%，实际各国CAC差异巨大
   - 补全难度：中（需要各平台广告管理后台数据）

**P2级别（中优先级）**：
1. M3仓储押金和初始库存
2. M5退货率的国家差异
3. M8人力成本的国家差异

---

## 4.2 数据补全优先级

### P0：阻塞性缺口（无）

当前数据已足够支撑MVP 2.0基本功能。

### P1：高优先级（Week 1-2完成）

#### 1. M2技术合规数据补全

**目标**：从20%提升至80%完整度

**数据来源策略**：

| 数据类型 | 来源 | Tier | 预计成本 |
|---------|------|------|---------|
| 产品认证要求 | 各国监管机构官网 | Tier 1 | $0（人工查询） |
| 认证费用 | 第三方实验室报价 | Tier 2 | $500（询价） |
| 认证周期 | 行业专家访谈 | Tier 2-3 | $200（咨询费） |

**执行计划**：

```python
# Week 1 Day 2-3: 补全M2数据
countries = ['US', 'UK', 'Germany', 'France', 'Japan', ...]  # 19国

m2_data = []
for country in countries:
    m2_record = {
        'country': country,
        'm2_product_certification': '',      # 产品认证类型
        'm2_certification_cost_usd': 0,      # 认证费用
        'm2_certification_duration_days': 0, # 认证周期
        'm2_trademark_cost_usd': 0,          # 商标注册费用
        'm2_data_source': '',                # 数据来源
        'm2_tier': 'Tier 2',
    }

    # 美国示例
    if country == 'US':
        m2_record.update({
            'm2_product_certification': 'AAFCO认证',
            'm2_certification_cost_usd': 2000,
            'm2_certification_duration_days': 60,
            'm2_trademark_cost_usd': 350,  # USPTO官方费用
            'm2_data_source': 'USPTO + AAFCO官网',
            'm2_tier': 'Tier 1',
        })

    # 欧盟示例
    elif country in ['Germany', 'UK', 'France']:
        m2_record.update({
            'm2_product_certification': 'FEDIAF合规 + EU 767/2009法规',
            'm2_certification_cost_usd': 3500,
            'm2_certification_duration_days': 90,
            'm2_trademark_cost_usd': 1500,  # EUIPO官方费用
            'm2_data_source': 'FEDIAF + EUIPO',
            'm2_tier': 'Tier 1',
        })

    # 其他国家使用AI研究+专家估算
    else:
        m2_record.update({
            'm2_product_certification': f'{country} Local Compliance',
            'm2_certification_cost_usd': 1500,  # 估算
            'm2_certification_duration_days': 45,
            'm2_trademark_cost_usd': 500,
            'm2_data_source': 'DeepSeek AI Research + Industry Expert',
            'm2_tier': 'Tier 3',
        })

    m2_data.append(m2_record)

# 导出为JSON并导入Appwrite
```

**验收标准**：
- ✅ 19国M2数据完整填充
- ✅ 至少10国为Tier 1-2数据（官方或权威来源）
- ✅ 所有数据标注来源和Tier等级

#### 2. M1市场准入费用量化

**目标**：从75%提升至90%完整度

**数据收集方案**：

1. **官方费用**（Tier 1）：
   - 美国：SBA官网查询公司注册费（$50-800各州不同）
   - 德国：Handelsregister查询GmbH注册费（€800）
   - 日本：法务局查询KK注册费（¥60,000）

2. **代理服务报价**（Tier 2）：
   - 联系3家跨境注册代理（如InCorp, Healy Consultants）
   - 获取19国"公司注册+税务登记+许可证"打包报价
   - 取中位数作为预设值

3. **AI研究+验证**（Tier 3）：
   - 使用DeepSeek搜索各国官方网站
   - 人工验证关键数据

**数据结构**：

```typescript
interface M1Data {
  m1_company_registration_usd: number;      // 公司注册费
  m1_business_license_usd: number;          // 商业许可证费
  m1_tax_registration_usd: number;          // 税务登记费
  m1_legal_consulting_usd: number;          // 法务咨询费（可选）
  m1_total_capex_usd: number;               // M1总计
  m1_data_source: string;
  m1_tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
}
```

#### 3. M6营销获客的国家差异数据

**目标**：补全19国CAC和平台广告成本

**数据来源**：

1. **平台官方数据**（Tier 2）：
   - Amazon Advertising平台：获取各国CPC（Cost Per Click）中位数
   - Google Ads关键词规划师：查询各国"pet food"CPC
   - Meta Ads Library：分析各国宠物广告投放成本

2. **行业报告**（Tier 2）：
   - Jungle Scout 2024跨境电商报告
   - Statista电商广告成本数据

3. **用户数据反哺**（Tier 1，未来）：
   - 收集用户实际CAC数据（匿名化）
   - 计算各国CAC中位数

**数据结构**：

```typescript
interface M6Data {
  m6_cac_usd: number;                       // 客户获取成本（美元）
  m6_cac_percentage: number;                // CAC占零售价比例
  m6_google_ads_cpc_usd: number;            // Google Ads CPC
  m6_amazon_ads_cpc_usd: number;            // Amazon Ads CPC
  m6_data_source: string;
  m6_tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
}
```

---

### P2：中优先级（Week 3-4完成）

1. **M3仓储押金数据**：联系FBA、Shopify Fulfillment获取报价
2. **M5退货率**：按国家/行业细分（当前统一10%）
3. **M8人力成本**：查询各国最低工资、社保成本

---

## 4.3 数据收集方案

### 三层数据收集策略

```
Tier 1（官方数据 - 100%可信）
├─ 来源：政府机构、海关、税务局
├─ 适用模块：M1注册费、M4关税/VAT
├─ 收集方式：官网查询 + API对接（未来）
├─ 更新频率：季度更新（政策变化）
└─ 成本：$0（人工）或$500/年（API订阅）

Tier 2（权威数据 - 90%可信）
├─ 来源：物流商报价、平台费率表、行业报告
├─ 适用模块：M4物流、M5配送、M7支付费
├─ 收集方式：询价 + 公开费率表抓取
├─ 更新频率：月度更新（市场波动）
└─ 成本：$2,000/年（询价人工成本）

Tier 3（估算数据 - 80%可信）
├─ 来源：AI研究、专家访谈、行业中位数
├─ 适用模块：M2认证费、M6 CAC、M8 G&A
├─ 收集方式：DeepSeek AI + 人工验证
├─ 更新频率：半年更新
└─ 成本：$500/年（AI API成本）
```

### 数据收集工具链

```typescript
// lib/data-collection/tariff-scraper.ts
// 自动抓取美国海关关税数据
export async function scrapUSCustomsTariff(hsCode: string): Promise<number> {
  const url = `https://hts.usitc.gov/?query=${hsCode}`;
  const response = await fetch(url);
  const html = await response.text();

  // 解析HTML提取关税税率
  const tariffRate = parseTariffRate(html);

  return tariffRate;
}

// lib/data-collection/vat-api.ts
// 调用VAT API获取实时税率
export async function fetchVATRate(countryCode: string): Promise<number> {
  // 使用免费API：https://jsonvat.com/
  const response = await fetch(`https://jsonvat.com/api/${countryCode}`);
  const data = await response.json();

  return data.rates.standard / 100; // 转为小数
}

// lib/data-collection/logistics-quotes.ts
// 获取物流商报价（需人工调用）
export async function getLogisticsQuote(
  origin: string,
  destination: string,
  weightKg: number,
  method: 'sea' | 'air'
): Promise<number> {
  // 调用DHL/FedEx API（需申请企业账号）
  // 或人工记录报价单

  return quoteUsdPerKg;
}
```

---

## 4.4 数据质量分级（Tier 1/2/3）

### Tier定义标准

| Tier | 定义 | 可信度 | 典型来源 | 示例 |
|------|------|-------|---------|------|
| **Tier 1** | 官方权威数据 | 100% | 政府机构、海关、税务局 | US Customs关税、IRS税率 |
| **Tier 2** | 行业权威数据 | 90% | 大型服务商、行业报告 | DHL物流报价、Amazon费率表 |
| **Tier 3** | 估算/推断数据 | 80% | AI研究、专家访谈、行业中位数 | CAC行业平均、G&A比例 |

### 数据质量监控

```typescript
// lib/data-quality/monitor.ts
export function calculateDataQualityScore(costFactor: CostFactor): number {
  const fields = [
    { name: 'm4_effective_tariff_rate', tier: costFactor.m4_tariff_tier },
    { name: 'm4_vat_rate', tier: costFactor.m4_vat_tier },
    { name: 'm4_logistics', tier: costFactor.m4_logistics_tier },
    { name: 'm5_last_mile_delivery_usd', tier: costFactor.m5_last_mile_tier },
    { name: 'm7_platform_commission_rate', tier: costFactor.m7_platform_tier },
  ];

  const tierScores = {
    'Tier 1': 100,
    'Tier 2': 90,
    'Tier 3': 80,
    'unknown': 50,
  };

  const totalScore = fields.reduce((sum, field) => {
    const score = tierScores[field.tier || 'unknown'] || 50;
    return sum + score;
  }, 0);

  return totalScore / fields.length; // 平均分
}

// 使用示例
const qualityScore = calculateDataQualityScore(costFactor);
if (qualityScore < 85) {
  console.warn(`数据质量偏低（${qualityScore}/100），建议更新`);
}
```

### 数据更新策略

```typescript
// lib/data-updates/update-scheduler.ts
export const updateSchedule = {
  // 季度更新（关税/VAT政策变化）
  quarterly: [
    'm4_effective_tariff_rate',
    'm4_vat_rate',
    'm1_regulatory_agency',
  ],

  // 月度更新（市场价格波动）
  monthly: [
    'm4_logistics',
    'm5_last_mile_delivery_usd',
    'm7_payment_gateway_fee_rate',
  ],

  // 半年更新（行业调研）
  semiannual: [
    'm6_cac_percentage',
    'm8_ga_cost_percentage',
    'm5_return_rate',
  ],

  // 实时更新（API对接）
  realtime: [
    'exchange_rate',  // 汇率（未来功能）
  ],
};

export async function runDataUpdate(frequency: 'quarterly' | 'monthly' | 'semiannual') {
  const fieldsToUpdate = updateSchedule[frequency];

  for (const field of fieldsToUpdate) {
    // 调用对应的数据收集函数
    await updateField(field);
  }
}
```

---

**第四部分完成检查点**：
- ✅ 4.1 当前数据完整度评估（87/100，M2为主要短板）
- ✅ 4.2 数据补全优先级（P1: M2/M1/M6，P2: M3/M5/M8）
- ✅ 4.3 数据收集方案（三层策略 + 工具链）
- ✅ 4.4 数据质量分级（Tier 1/2/3标准 + 监控机制）

---

**下一步**：创建 **MVP-2.0-第五到第七部分.md**，包含：
- Part 5: 技术实施方案
- Part 6: 4周详细实施计划
- Part 7: 产品规划文档更新

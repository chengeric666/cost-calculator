# GECOM 智能成本助手项目说明文档

> 本文档为 Claude AI 提供项目上下文，帮助理解项目结构、目标和开发规范
>
> **交互语言：** 中文（所有对话必须使用中文） ⭐
>
> **文档版本：** v2.1 (MVP 2.0)
> **最后更新：** 2025-11-09
> **项目阶段：** MVP 2.0 Week 1（Appwrite数据库已搭建，5国数据已导入）

---

## 📋 项目概述

### 项目名称
**GECOM智能成本助手** - 全球电商成本优化方法论计算工具

### 项目定位
通过标准化的双阶段八模块成本拆解框架（GECOM），结合AI智能助手，帮助跨境电商卖家精准计算出海成本、优化盈利能力、对比场景方案。

### 产品 Slogan
- **中文：** 精准成本拆解，智能场景对比，数据驱动决策
- **英文：** Global E-Commerce Cost Optimization Methodology

### 核心差异化
```
传统成本计算工具 vs GECOM MVP 2.0：
├─ 模糊估算 → 19国真实数据（关税/VAT/物流/佣金）
├─ 简化计算 → 双阶段八模块标准化拆解（M1-M8完整展示）
├─ 单点计算 → CAPEX + OPEX全生命周期覆盖
├─ 静态结果 → AI助手深度集成（工具调用+成本引擎联动）
├─ 单一场景 → 19国并行对比（最优/最差市场智能推荐）
├─ 简单输出 → 对标益家之宠30,000字专业Word报告
└─ Excel手工 → 可视化交互 + 数据溯源（Tier 1/2/3）
```

### 🎯 核心价值主张

> **"成本透明度是跨境电商成功的基础"** - 我们不是简单的计算器，而是通过GECOM标准框架提供决策级成本洞察。

**三大核心价值：**

1. **标准化拆解（Standardized Framework）**
   - ✅ GECOM双阶段八模块模型
   - ✅ 覆盖CAPEX（M1-M3）+ OPEX（M4-M8）

2. **智能优化（AI-Powered Insights）**
   - ✅ DeepSeek AI助手实时问答
   - ✅ 成本优化建议生成
   - ✅ 场景敏感性分析

3. **多维对比（Multi-Scenario Comparison）**
   - ✅ 多SKU并行计算
   - ✅ 跨市场对比（美国/欧盟/日本等）
   - ✅ 跨渠道对比（独立站/亚马逊/TikTok等）

---

## 🎯 产品核心定位

### 目标用户
1. **跨境电商卖家**（核心）- 需要精准计算不同市场的成本结构
2. **品牌出海企业** - 评估不同渠道的盈利能力
3. **供应链决策者** - 优化供应链成本配置
4. **跨境电商顾问** - 为客户提供数据支撑的咨询服务

### 产品愿景
- **短期（6个月）：** 完成POC→MVP升级，Appwrite集成，真实AI助手
- **中期（1年）：** 成为跨境电商行业标准的成本计算工具
- **长期（3年）：** 成为全球电商成本优化的智能决策平台

---

## 🏗️ 产品功能架构

### 核心功能：五步向导
```
Step 0: 项目基本信息
├─ 项目名称、行业（宠物/电子烟）、目标市场、销售渠道

Step 1: 业务场景定义
├─ 产品定价、月销量、复购率
├─ 目标市场（美国/欧盟/日本/其他）
├─ 销售渠道（独立站/亚马逊/TikTok Shop）
└─ 跨境模式（直邮/海外仓/FBA）

Step 2: 成本参数配置
├─ CAPEX（一次性启动成本）
│  ├─ M1: 市场准入（公司注册、许可证、法务）
│  ├─ M2: 技术合规（产品认证、商标、检测）
│  └─ M3: 供应链搭建（仓储、库存、系统）
│
└─ OPEX（单位运营成本）
   ├─ M4: 货物税费（COGS、关税、增值税）
   ├─ M5: 物流配送（国际运输、本地配送、FBA）
   ├─ M6: 营销获客（CAC、平台佣金）
   ├─ M7: 支付手续费（网关费用、汇率损失）
   └─ M8: 运营管理（客服、人员、软件）

Step 3: 成本建模结果
├─ 单位经济模型（毛利率、毛利润）
├─ 关键KPI（ROI、回本周期、LTV:CAC）
├─ 成本分布可视化（饼图、柱状图）
└─ 盈亏平衡分析（价格、销量）

Step 4: 场景对比分析（未来功能）
├─ 多SKU并行计算
├─ 跨市场对比（美国 vs 欧盟 vs 日本）
└─ 跨渠道对比（独立站 vs 亚马逊 vs TikTok）

Step 5: AI智能助手
├─ 成本优化建议
├─ 场景敏感性分析
├─ 智能问答（基于DeepSeek V3）
└─ 报告生成（PDF/Excel导出）
```

### 辅助功能
- **历史项目管理：** 保存/加载历史计算（基于Appwrite Database）
- **报告导出：** PDF/Excel格式导出完整计算报告
- **数据可视化：** Recharts图表展示成本分布
- **参数预设：** 行业/市场预设参数快速配置

---

## 🛠️ 技术架构

### 当前架构（v1.0 MVP阶段）

**前端：**
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Recharts (图表可视化)
- Lucide React (图标)

**后端：**
- Appwrite BaaS (Database + Auth + Storage)
- DeepSeek V3 API (AI工具调用)
- DeepSeek R1 API (AI推理对话)

**部署：**
- Appwrite Sites (SSR模式，Node.js 22)
- Database: Appwrite Database (PostgreSQL)
- Endpoint: https://apps.aotsea.com/v1

**数据库结构（MVP 2.0）：**

> **💡 数据库设置指南**：详见 [DATABASE-SETUP.md](./docs/DATABASE-SETUP.md)
> - 自动化脚本：`npm run db:setup`
> - 完整127字段Schema定义
> - 19国M1-M8数据结构

```
gecom_database (690d4fdd0035c2f63f20)/
├─ cost_factors                 # ⭐ 19国成本因子库（核心）
│  ├─ id (string, unique)
│  ├─ country (string)          # 国家代码（US/UK/DE/FR/JP/VN...）
│  ├─ country_name (string)     # 国家名称（中文）
│  ├─ industry (string)         # 行业（pet/vape）
│  ├─ version (string)          # 数据版本（v2025Q1）
│  │
│  ├─ M1字段（16个）            # 市场准入
│  │  ├─ m1_regulatory_agency (string)
│  │  ├─ m1_complexity (string)  # 极高/高/中/低
│  │  ├─ m1_company_registration_usd (float)
│  │  └─ ...其他M1字段
│  │
│  ├─ M4字段（32个）            # 货物税费（最复杂）
│  │  ├─ m4_effective_tariff_rate (float)  # 关税税率
│  │  ├─ m4_tariff_notes (string)          # 税率说明
│  │  ├─ m4_vat_rate (float)               # VAT/GST税率
│  │  ├─ m4_logistics (string, JSON)       # 物流费用（海运/空运）
│  │  ├─ m4_tariff_data_source (string)    # 数据来源
│  │  ├─ m4_tariff_tier (string)           # Tier 1/2/3
│  │  └─ ...其他M4字段
│  │
│  ├─ M5-M8字段（60个）         # 其他OPEX模块
│  ├─ 数据溯源字段（16个）      # 每个模块的data_source/tier/updated_at
│  └─ 共127个字段，支持19国×2行业=38条记录
│
├─ projects                     # 用户项目
│  ├─ id (string, unique)
│  ├─ userId (string)          # 关联用户
│  ├─ name (string)            # 项目名称
│  ├─ industry (string)        # 行业（pet/vape）
│  ├─ targetCountry (string)   # 目标市场
│  ├─ salesChannel (string)    # 销售渠道
│  ├─ createdAt (datetime)
│  └─ updatedAt (datetime)
│
├─ calculations                 # 成本计算结果
│  ├─ id (string, unique)
│  ├─ projectId (string)       # 关联项目
│  ├─ scope (json)             # 完整输入数据
│  ├─ costResult (json)        # 计算结果
│  ├─ userOverrides (json)     # ⭐ 用户自定义覆盖值
│  ├─ createdAt (datetime)
│  └─ version (string)         # GECOM版本
│
└─ cost_factor_versions         # 成本因子版本管理
   ├─ id (string, unique)
   ├─ version (string)         # v2025Q1
   ├─ releaseDate (datetime)
   └─ changelog (string)       # 更新日志
```

### 未来架构（v2.0 SaaS化）

**核心升级：**
- 用户认证系统 (Appwrite Auth)
- 多租户数据隔离
- 实时协作编辑
- 动态因子更新（关税、汇率API）
- API开放平台
- 移动端适配

---

## 📐 设计规范

### 品牌调性
**核心关键词：** 专业、精准、智能、可信、高效

### 色彩系统
```
主色调：专业蓝 (#1E40AF → #3B82F6)
强调色：活力橙 (#F59E0B)
成功色：正向绿 (#10B981)
警告色：风险红 (#EF4444)
中性色：高级灰 (#F9FAFB背景 / #1F2937文字)
```

**使用场景：**
- 专业蓝：主按钮、导航、关键指标
- 活力橙：CTA按钮、高亮数据、AI助手
- 正向绿：毛利率健康、ROI达标
- 风险红：警告信息、成本过高
- 高级灰：背景、辅助文字

### 字体系统
```
中文：苹方 (PingFang SC) / 微软雅黑 (Microsoft YaHei)
英文：Inter / SF Pro
数字：Tabular Numbers（等宽数字，方便对齐）
代码：JetBrains Mono
```

### 设计风格
- **Liquid Glass设计语言** - 毛玻璃效果 + 多层阴影
- **Apple级别体验** - 流畅过渡动画 + 精致交互反馈
- **数据可视化** - 清晰的图表 + 直观的色彩映射
- **响应式布局** - 桌面优先，兼容移动端

### 组件设计原则
1. **清晰的信息层级**：标题 → 副标题 → 数据 → 辅助文字
2. **一致的交互反馈**：hover/focus/active状态统一
3. **错误状态友好**：清晰的错误提示 + 解决方案建议
4. **加载状态流畅**：骨架屏 + 加载动画
5. **无障碍支持**：键盘导航 + 屏幕阅读器

---

## 📂 文件结构

```
cost-calculator/
├── gecom-assistant/              # Next.js应用主目录
│   ├── app/                      # Next.js 14 App Router
│   │   ├── page.tsx             # 主页（五步向导）
│   │   ├── layout.tsx           # 根布局
│   │   └── globals.css          # 全局样式
│   │
│   ├── components/               # React组件
│   │   ├── wizard/              # 向导步骤组件
│   │   │   ├── WizardNavigation.tsx  # 导航栏
│   │   │   ├── Step0ProjectInfo.tsx  # 步骤0
│   │   │   ├── Step1Scope.tsx        # 步骤1
│   │   │   ├── Step2CostParams.tsx   # 步骤2
│   │   │   ├── Step3CostModeling.tsx # 步骤3（结果展示）
│   │   │   ├── Step4Comparison.tsx   # 步骤4
│   │   │   └── Step5AIAssistant.tsx  # 步骤5
│   │   │
│   │   └── ui/                  # shadcn/ui组件
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       └── ...
│   │
│   ├── lib/                      # 工具库
│   │   ├── gecom-engine.ts      # GECOM计算引擎（核心）
│   │   ├── appwrite-client.ts   # Appwrite SDK客户端
│   │   ├── appwrite-data.ts     # Appwrite数据操作
│   │   └── deepseek-client.ts   # DeepSeek API客户端
│   │
│   ├── types/                    # TypeScript类型定义
│   │   └── gecom.ts             # GECOM数据类型
│   │
│   └── package.json             # 依赖管理
│
├── docs/                         # 项目文档
│   ├── reference/               # 参考文档
│   │   ├── 01-competitor-analysis.md
│   │   ├── 02-benchmark-analysis.md
│   │   ├── 03-product-design.md
│   │   ├── 07-poc-plan-v3.md
│   │   ├── 5-step-workflow.md
│   │   ├── env_sample.md
│   │   ├── DEPLOYMENT.md
│   │   ├── claude-sample.md
│   │   └── 数据样例/            # GECOM 模块数据样例
│   │       ├── M1_行业特定准入许可_宠物食品19国准入许可.xlsx
│   │       ├── M2-M8数据文件...（16个文件）
│   │
│   └── archive/                 # 历史归档
│       ├── README-original.md
│       └── gecom-assistant-README.zh-CN.md
│
├── README.md                     # 项目主文档（中文）
├── CLAUDE.md                     # 本文档（AI上下文）
├── DEPLOYMENT.md                 # 部署指南
└── .env.example                  # 环境变量模板
```

---

## 📊 GECOM 方法论详解

### 双阶段八模块模型

```
┌─────────────────────────────────────────────────┐
│  阶段0-1: CAPEX（一次性启动成本）                │
├─────────────────────────────────────────────────┤
│  M1: 市场准入 (Market Entry)                    │
│  ├─ 公司注册 (Company Registration)             │
│  ├─ 商业许可证 (Business License)               │
│  ├─ 法务咨询 (Legal Consulting)                 │
│  └─ 税务登记 (Tax Registration)                 │
│                                                   │
│  M2: 技术合规 (Technical Compliance)            │
│  ├─ 产品认证 (Product Certification)            │
│  ├─ 商标注册 (Trademark Registration)           │
│  └─ 合规检测 (Compliance Testing)               │
│                                                   │
│  M3: 供应链搭建 (Supply Chain Setup)            │
│  ├─ 仓储押金 (Warehouse Deposit)                │
│  ├─ 设备采购 (Equipment Purchase)               │
│  ├─ 初始库存 (Initial Inventory)                │
│  └─ 系统搭建 (System Setup)                     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  阶段1-N: OPEX（单位运营成本）                   │
├─────────────────────────────────────────────────┤
│  M4: 货物税费 (Goods & Tax)                     │
│  ├─ COGS (Cost of Goods Sold)                   │
│  ├─ 进口关税 (Import Tariff)                    │
│  └─ 增值税 (VAT)                                │
│                                                   │
│  M5: 物流配送 (Logistics & Delivery)            │
│  ├─ 国际运输 (International Shipping)           │
│  ├─ 本地配送 (Local Delivery)                   │
│  └─ FBA费用 (FBA Fee, if applicable)            │
│                                                   │
│  M6: 营销获客 (Marketing & Acquisition)         │
│  ├─ CAC (Customer Acquisition Cost)             │
│  └─ 平台佣金 (Platform Commission)              │
│                                                   │
│  M7: 支付手续费 (Payment Processing)            │
│  ├─ 支付网关费用 (Payment Gateway Fee)          │
│  └─ 汇率损失 (Currency Conversion Loss)         │
│                                                   │
│  M8: 运营管理 (Operations & Management)         │
│  ├─ 客服成本 (Customer Service)                 │
│  ├─ 人员成本 (Staff Cost)                       │
│  └─ 软件订阅 (Software Subscription)            │
└─────────────────────────────────────────────────┘
```

### 关键KPI计算公式

```typescript
// 单位经济模型
unitRevenue = sellingPrice
unitCost = OPEX.total
grossProfit = unitRevenue - unitCost
grossMargin = (grossProfit / unitRevenue) * 100

// 投资回报率
ROI = ((grossProfit * monthlyVolume * 12 - CAPEX.total) / CAPEX.total) * 100

// 回本周期（月）
paybackPeriod = CAPEX.total / (grossProfit * monthlyVolume)

// 客户生命周期价值
LTV = grossProfit * averageOrdersPerCustomer
ltvCacRatio = LTV / CAC

// 盈亏平衡点
breakEvenPrice = unitCost / (1 - targetGrossMargin)
breakEvenVolume = CAPEX.total / grossProfit
```

### 预设参数库

**行业预设（宠物用品 Pet Supplies）：**
- COGS: $8-15
- 关税: 0-5%
- CAC: $15-30
- 复购率: 40-60%

**行业预设（电子烟 Vape）：**
- COGS: $3-8
- 关税: 0% (部分市场禁售)
- CAC: $20-40
- 复购率: 60-80%

**市场预设：**
- 美国：关税0-5%，VAT 0%，物流$3-5
- 欧盟：关税0-6.5%，VAT 19-27%，物流$4-7
- 日本：关税0-9.6%，VAT 10%，物流$3-6

---

## 🔧 开发规范

### 代码规范
1. **TypeScript严格模式**：所有代码必须通过类型检查
2. **组件命名**：PascalCase（如 `Step3CostModeling.tsx`）
3. **函数命名**：camelCase（如 `calculateCostResult()`）
4. **常量命名**：UPPER_SNAKE_CASE（如 `DEFAULT_TAX_RATE`）
5. **注释规范**：关键逻辑必须添加中文注释

### Git规范
- **分支命名**：`claude/feature-name-sessionID`
- **提交信息**：中文，格式：`类型：简要描述`
  - 功能：新增功能
  - 修复：修复bug
  - 重构：代码重构
  - 文档：文档更新
  - 配置：配置文件修改
  - 测试：测试相关
- **提交频率**：小步提交，每个功能点独立提交

### 任务清单更新规范 ⭐

> **⚠️ 重要规范**：更新任务清单时，必须严格遵守以下规范，确保任务追踪的准确性和可追溯性

#### 核心原则

**1. 只更新进展，不修改原计划**
- ❌ **错误做法**：修改原任务描述或删除未完成任务
- ✅ **正确做法**：保留原计划内容，仅在原任务下添加进展标记

**2. 保持计划可对比**
- 任务描述必须保持原样，方便对比"计划 vs 实际"
- 如果实际完成超出计划，添加新的子任务标记"超额完成"
- 如果实际进度低于计划，保留未完成任务并明确标记

**3. 进展标记清晰**
- 使用百分比和明确数字（如：5/19国完成，26%）
- 超额完成使用【超额完成】前缀
- 未完成任务保持`- [ ]`状态

#### 错误示例 vs 正确示例

**场景：原计划采集2国数据，实际完成4国，但19国总目标仍未达成**

❌ **错误更新**：
```markdown
### Day 4: 采集德国/越南/英国/日本市场数据（4国）✅
- [x] Task 3.1: 采集德国数据 ✅
- [x] Task 3.2: 采集越南数据 ✅
- [x] Task 3.3: 采集英国数据 ✅
- [x] Task 3.4: 采集日本数据 ✅
```
**问题**：
1. 修改了原计划标题（原计划只要求2国）
2. 删除了剩余14国的任务
3. 显示100%完成，掩盖了实际gap

✅ **正确更新**：
```markdown
### Day 4: 采集德国/越南市场数据（原计划2国）
- [x] **Task 3.1**: 采集德国M1-M8数据 ✅
- [x] **Task 3.2**: 采集越南M1-M8数据 ✅
- [x] **Task 3.2.1**: 【超额完成】采集英国M1-M8数据 ✅
- [x] **Task 3.2.2**: 【超额完成】采集日本M1-M8数据 ✅
- [ ] **Task 3.3**: 继续采集剩余14国数据 ⏳（Week 2执行）
  - [ ] CA（加拿大）
  - [ ] FR（法国）
  - [ ] SG（新加坡）
  - [ ] MY（马来西亚）
  - [ ] PH（菲律宾）
  - [ ] TH（泰国）
  - [ ] ID（印尼）
  - [ ] IN（印度）
  - [ ] KR（韩国）
  - [ ] AU（澳大利亚）
  - [ ] SA（沙特）
  - [ ] AE（阿联酋）
  - [ ] MX（墨西哥）
  - [ ] BR（巴西）

**进展**：5/19国完成（26%），Week 2需完成剩余14国
```

#### 进度总览更新规范

❌ **错误更新**：
```markdown
- **Week 1**: 数据基础设施 - 28/28 任务完成 ✅✅✅
**总进度**: 28/104 (26.9%)
```
**问题**：显示Week 1 100%完成，但实际数据采集只完成26%

✅ **正确更新**：
```markdown
- **Week 1**: 数据基础设施 - 20/28 任务完成（71%）
  - ✅ Database setup: 100% (8 tasks)
  - ⚠️ Data collection: 5/19国（26%）- 需Week 2继续
  - ✅ SDK封装: 100% (10 tasks)

**总进度**: 20/104 (19.2%)
**数据覆盖**: 5/38记录（13.2%）- 5国×1行业，缺14国+vape行业
```

#### 强制执行清单

在更新任务清单前，必须检查：
- [ ] 是否保留了原任务描述？
- [ ] 是否明确标记了实际进展与计划的差异？
- [ ] 是否保留了未完成任务（不可删除）？
- [ ] 是否明确列出了剩余任务？
- [ ] 进度百分比是否反映真实完成度？
- [ ] 是否添加了"【超额完成】"标记（如有）？

#### 参考文档

完整的19国数据采集计划请参考：
- [MVP-2.0-详细规划方案.md](./docs/MVP-2.0-详细规划方案.md) - 第一部分：数据库设计（19国完整列表）
- [MVP-2.0-GAP-ANALYSIS.md](./docs/MVP-2.0-GAP-ANALYSIS.md) - 完整gap分析报告

---

### 测试规范
- 单元测试：核心计算逻辑（`gecom-engine.ts`）
- 集成测试：API调用（Appwrite, DeepSeek）
- E2E测试：完整向导流程（Playwright）

### Appwrite开发规范

#### 重要经验：避免并发操作问题

**问题描述**：使用Promise.all()并行创建Collections时报"authorization error"
**根本原因**：Appwrite对并发操作有限制，而非API权限问题
**解决方案**：改用顺序创建（for循环 + await）

**错误示例**：
```typescript
// ❌ 失败：并行创建导致authorization error
const results = await Promise.all([
  databases.createCollection(DB_ID, 'collection1', 'Name 1'),
  databases.createCollection(DB_ID, 'collection2', 'Name 2'),
  databases.createCollection(DB_ID, 'collection3', 'Name 3'),
]);
```

**正确示例**：
```typescript
// ✅ 成功：顺序创建
for (const col of collections) {
  await databases.createCollection(DB_ID, col.id, col.name);
  // 可选：添加延迟确保操作完成
  await new Promise(resolve => setTimeout(resolve, 500));
}
```

**适用场景**：
- 创建Collections
- 批量添加字段（Attributes）
- 创建索引（Indexes）
- 批量创建文档（Documents）时建议分批处理

**排查技巧**：
- 如果遇到"authorization error"但API key权限正确，优先检查是否有并发操作
- 使用简单的单个操作测试来验证权限是否真的有问题
- 查看scripts/archive/目录的测试脚本了解问题排查过程

#### 字段创建注意事项

1. **Required字段不能有默认值**
   ```typescript
   // ❌ 错误：required + default会失败
   { key: 'industry', required: true, default: 'pet_food' }

   // ✅ 正确：设为optional可以有默认值
   { key: 'industry', required: false, default: 'pet_food' }
   ```

2. **字段大小总量限制**
   - Appwrite对单个Collection的字段总大小有限制
   - 如遇到"maximum size reached"错误，需要调整字段大小
   - 示例：scope(10000) + costResult(10000) → scope(5000) + costResult(5000)

3. **字段创建间隔**
   - 批量创建字段时建议每个字段间隔500ms，等待索引完成
   - 避免因创建过快导致的冲突或失败

---

## 🚀 部署流程

### 本地开发
```bash
# 1. 复制环境变量
cp .env.example .env.local

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 访问应用
http://localhost:3000
```

### 部署到Appwrite Sites
```bash
# 使用自动化脚本
./scripts/deploy-to-appwrite.sh

# 或手动部署
appwrite sites create-deployment \
  --site-id gecom-assistant \
  --code . \
  --activate true
```

详见：[DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📊 数据质量标准与成功指标 ⭐

> **重要性**：数据质量是GECOM MVP 2.0的核心竞争力
> **完整规范**：参见[DATA-COLLECTION-STANDARD.md](./docs/DATA-COLLECTION-STANDARD.md)

### 数据质量3-Tier分级体系

```
Tier 1（官方数据 - 100%可信）⭐
├─ 定义：政府机构、海关、税务局、平台官方文档
├─ 目标占比：≥60%
├─ 示例：
│  ├─ M4关税：USITC官网、CBSA官网、欧盟TARIC
│  ├─ M4 VAT：IRS官网、CRA官网、德国联邦税务局
│  └─ M7支付：Stripe官方费率页
├─ 标注格式：
│  data_source: 'USITC官网 - https://hts.usitc.gov'
│  tier: 'tier1_official'
│  collected_at: '2025-11-09T10:00:00+08:00'

Tier 2（权威数据 - 90%可信）
├─ 定义：物流商报价、行业报告、专业机构
├─ 目标占比：≥30%
├─ 示例：
│  ├─ M4物流：DHL官方报价、FedEx报价单
│  ├─ M6 CAC：Jungle Scout年度报告
│  └─ M5尾程：Amazon FBA费率表
├─ 标注格式：
│  data_source: 'DHL报价单 - 2025年Q1'
│  tier: 'tier2_authoritative'

Tier 3（估算数据 - 80%可信）⚠️
├─ 定义：AI研究、专家访谈、行业经验
├─ 目标占比：≤10%
├─ 使用条件：仅在无法获取Tier 1/2时使用
├─ 标注格式：
│  data_source: 'AI研究 + 行业标准'
│  tier: 'tier3_estimated'
│  confidence: 'medium'
```

### 数据溯源强制要求

**每条成本记录必须包含**：
- ✅ `collected_at`: 数据采集时间（ISO 8601格式）
- ✅ `collected_by`: 采集人员/系统
- ✅ `version`: 数据版本（2025Q1）

**每个模块（M1-M8）必须包含**：
- ✅ `m*_data_source`: 具体来源（机构名称 - URL/文件）
- ✅ `m*_tier`: 数据质量等级（tier1/tier2/tier3）
- ✅ `m*_collected_at`: 模块采集时间

**数据来源格式规范**：
```
Tier 1: 'USITC官网 - https://hts.usitc.gov/current/2309'
Tier 2: 'DHL Express报价单 - 2025年Q1中国→美国线路'
Tier 3: 'AI研究基于3个行业报告综合 - 中等置信度'
```

### 字段优先级分级（36 → 127字段路线图）

```
P0字段（核心计算必须，67个字段）⭐
├─ 定义：GECOM计算引擎依赖字段，缺失导致无法计算ROI
├─ Week 2-3必须完成
├─ 包含：
│  ├─ M1: 12个（company_registration, tax_registration等）
│  ├─ M2: 10个（product_certification, compliance_testing等）
│  ├─ M4: 9个（hs_code, tariff, vat, logistics）
│  ├─ M6: 8个（cac_usd, platform_commission等）
│  └─ ...其他模块

P1字段（数据丰富度，30个字段）
├─ 定义：提升报告质量，不影响核心计算
├─ Week 2-3尽力完成
├─ 包含：renewal_required, certification_validity_years等

P2字段（Nice to have，30个字段）
├─ 定义：高级分析、未来功能预留
├─ v3.0补充
└─ 包含：government_subsidy, influencer_marketing_rate等
```

### 通用vs行业特定数据区分

**核心策略**：方案2（字段分级标注）+ 渐进式迁移

```typescript
// 通用数据（35个字段，28%）- 跨行业复用 ✅
m1_company_registration_usd  // 公司注册费
m1_tax_registration_usd      // 税务登记费
m4_vat_rate                  // VAT税率（国家统一）
m4_logistics                 // 物流成本（按重量计费）
m7_payment_rate              // Stripe全球统一2.9%
m8_labor_cost_usd_hour       // 最低工资

// 行业特定数据（55个字段，43%）- 每行业独立 ❌
m1_industry_license_usd      // 行业许可费（宠物vs电子烟不同）
m2_product_certification_usd // 产品认证（CFIA vs TPD）
m4_hs_code                   // 商品编码（2309.10.00 vs 8543.70.00）
m4_effective_tariff_rate     // 关税率（按HS Code差异）
m6_cac_usd                   // CAC（宠物$20 vs 电子烟$35）
m6_platform_commission_rate  // 平台佣金（Pet 15% vs Electronics 8%）
```

**数据采集优化策略**：
1. **阶段1**：采集19国通用数据（35个字段）→ 创建`XX-base-data.ts`
2. **阶段2**：采集19国×Pet Food特定数据（55个字段）→ 创建`XX-pet-food-specific.ts`
3. **阶段3**：复用通用数据，仅采集Vape特定数据 → 节省50%时间

### MVP 2.0成功指标

**数据覆盖**：
- ✅ 19国×2行业 = 38条完整记录
- ✅ 每条记录 ≥ 67个P0字段（目标97个含P1）
- ✅ 0条blocking错误

**数据质量**：
- ✅ Tier 1/2数据 ≥ 80%（总体）
- ✅ 关键字段（M4关税/VAT）100% Tier 1
- ✅ 数据溯源100%完整（每个data_source有URL）
- ✅ 时间戳100%标注
- ✅ 数据合理性检查通过率100%

**可维护性**：
- ✅ 通用数据明确标注（35个字段）
- ✅ 行业特定数据明确标注（55个字段）
- ✅ Vape行业可复用通用数据（节省50%采集时间）
- ✅ 数据更新流程文档化

**扩展性**：
- ✅ 数据模型支持扩展到100国
- ✅ 支持新增第3个行业（仅采集55个特定字段）
- ✅ 数据导入脚本可处理新国家

### 单国验收标准（每国必须通过）

| 验收项 | 最低标准 | 优秀标准 |
|-------|---------|---------|
| P0字段完整性 | 67/67 (100%) | 97/127 (76%) |
| Tier 1/2占比 | ≥70% | ≥85% |
| 数据溯源完整性 | 100% | 100%有URL |
| 合理性检查通过率 | 100% | 100% |
| 通用vs特定字段标注 | 100% | 100% |
| 导入成功 | 是 | 是 |
| 查询性能 | <500ms | <200ms |

### 数据验证清单（每国必检）

```markdown
## 完整性验证
- [ ] P0字段100%填充（67个字段无null）
- [ ] 每个模块M1-M8至少有1个data_source
- [ ] collected_at字段存在且格式正确
- [ ] 通用字段和特定字段正确分离

## 合理性验证
- [ ] 关税率合理（0% ≤ tariff ≤ 100%）
- [ ] VAT率合理（0% ≤ VAT ≤ 30%）
- [ ] CAC > 0 且 < $100
- [ ] 物流成本：海运 < 空运

## Tier质量验证
- [ ] Tier 1数据占比 ≥ 50%
- [ ] 关键字段（M4关税/VAT）必须Tier 1
- [ ] 每个Tier标注有对应的data_source

## 溯源验证
- [ ] 所有data_source格式正确（机构 - URL）
- [ ] Tier 1数据有完整URL
- [ ] 时间戳在2024-2025年范围内
```

---

## 📝 开发任务清单

> **💡 重要提示**：MVP 2.0完整任务清单（120个详细任务）已独立为专门文档，详见：
> [**MVP-2.0-任务清单.md**](./docs/MVP-2.0-任务清单.md) ⭐⭐⭐
>
> 本部分仅展示宏观进度，每个任务的详细验收标准、测试要求、文档更新要求请参考完整任务清单。

### ✅ 已完成（POC v1.0）
- [x] 五步向导基础界面
- [x] GECOM计算引擎基础版（简化M1-M8）
- [x] 成本结果可视化（饼图、柱状图）
- [x] 100%中文界面
- [x] 项目文档整理
- [x] 文件结构优化（数据样例归档）

### ✅ 已完成（MVP 2.0 规划阶段）
- [x] 19国真实数据深度分析
- [x] Appwrite数据库Schema设计（4个Collection，127个字段）
- [x] 完整五步向导界面重设计（Step 0-5基于真实数据）
- [x] 专业报告生成系统设计（对标益家之宠30,000字）
- [x] AI工具调用架构设计（DeepSeek R1+V3双模型）
- [x] 数据质量分级体系（Tier 1/2/3）
- [x] 4周详细实施计划（Day 1-20每日任务）
- [x] MVP 2.0完整规划文档（3份文档，10,000+行）
- [x] CLAUDE.md和GECOM-03更新指南
- [x] **MVP 2.0完整任务清单创建**（104个任务，详细验收标准）

### ✅ 已完成（MVP 2.0 实施 - Week 1 Day 5）
- [x] Appwrite数据库完整搭建
  - ✅ 创建4个Collections（cost_factors, projects, calculations, cost_factor_versions）
  - ✅ 添加53个字段（cost_factors: 36, projects: 7, calculations: 6, versions: 4）
  - ✅ 创建9个查询优化索引
- [x] 5国成本数据导入
  - ✅ 美国(US)、德国(DE)、越南(VN)、英国(UK)、日本(JP)
  - ✅ 包含M1-M8完整数据（关税/VAT/物流等）
  - ✅ 数据质量：Tier 2级别
- [x] 开发脚本创建（7个生产脚本 + 7个归档测试脚本）
- [x] 数据库完整性验证
- [x] Appwrite开发经验总结（避免并发操作等）

### 🚧 进行中（MVP 2.0 实施 - Week 1）
**当前状态：已完成Day 5数据库搭建**

- [x] Day 5: 数据导入与数据库搭建 ⭐
- [ ] Day 6-7: 继续导入剩余14国数据

### 📋 待开发（MVP 2.0 - Week 2）
**计划：0/28 任务**（详见：[MVP-2.0-任务清单.md](./docs/MVP-2.0-任务清单.md)）

- [ ] Day 6-7: Step 0-1界面重写（8个任务）
- [ ] Day 8-9: Step 2核心重构-M1-M8完整展示（12个任务）⭐核心
- [ ] Day 10: Step 3-4结果展示优化（11个任务）

### 📋 待开发（MVP 2.0 - Week 3）
**计划：0/24 任务**（详见：[MVP-2.0-任务清单.md](./docs/MVP-2.0-任务清单.md)）

- [ ] Day 11-12: docx.js报告生成基础（8个任务）
- [ ] Day 13-14: AI生成报告第四章（8个任务）
- [ ] Day 15: 报告质量验证（9个任务）

### 📋 待开发（MVP 2.0 - Week 4）
**计划：0/24 任务**（详见：[MVP-2.0-任务清单.md](./docs/MVP-2.0-任务清单.md)）

- [ ] Day 16-17: Step 5 AI助手深度集成（9个任务）
- [ ] Day 18-19: 端到端测试与质量保证（9个任务）
- [ ] Day 20: 部署与文档更新（10个任务）

### 📋 待开发（v3.0+）
- [ ] 用户认证系统（Appwrite Auth）
- [ ] 多SKU并行计算
- [ ] 实时数据更新（关税/汇率API对接）
- [ ] 参数预设模板库
- [ ] 移动端适配
- [ ] 多租户SaaS化

---

## 📚 核心文档索引

### MVP 2.0规划文档 ⭐
- [MVP-2.0-详细规划方案.md](./docs/MVP-2.0-详细规划方案.md) - Part 1-2：数据库设计+界面设计（3409行）
- [MVP-2.0-第三到第四部分.md](./docs/MVP-2.0-第三到第四部分.md) - Part 3-4：报告生成+数据质量
- [MVP-2.0-第五到第七部分.md](./docs/MVP-2.0-第五到第七部分.md) - Part 5-7：技术实施+4周计划+文档更新
- [MVP-2.0-任务清单.md](./docs/MVP-2.0-任务清单.md) - **完整任务清单**（104个任务，4周实施计划）⭐⭐⭐

### 产品文档
- [README.md](./README.md) - 项目概览与快速开始
- [01-competitor-analysis.md](./docs/reference/01-competitor-analysis.md) - 竞品分析
- [02-benchmark-analysis.md](./docs/reference/02-benchmark-analysis.md) - 基准测试
- [03-product-design.md](./docs/reference/03-product-design.md) - 产品设计（GECOM-03）
- [07-poc-plan-v3.md](./docs/reference/07-poc-plan-v3.md) - POC实施计划

### 技术文档
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 部署指南
- [.env.example](./.env.example) - 环境变量配置
- [gecom-engine.ts](./gecom-assistant/lib/gecom-engine.ts) - 计算引擎核心代码（v1.0 POC）
- [gecom-engine-v2.ts](./gecom-assistant/lib/gecom-engine-v2.ts) - 计算引擎v2.0（待实现）

### 参考文档
- [env_sample.md](./docs/reference/env_sample.md) - 环境变量参考
- [claude-sample.md](./docs/reference/claude-sample.md) - 项目上下文参考

---

## 🎓 GECOM方法论来源

GECOM方法论源自创始团队多年跨境电商实战经验，结合了：
1. **财务管理**：CAPEX/OPEX分类，单位经济模型
2. **供应链管理**：M3供应链搭建，M5物流配送
3. **数字营销**：M6营销获客，CAC/LTV计算
4. **合规风控**：M1市场准入，M2技术合规
5. **运营管理**：M8运营管理，全流程覆盖

**核心理念**：
> "成本透明是决策理性的前提，标准化拆解是规模化的基础。"

---

## 🔗 相关资源

- **Appwrite文档**: https://appwrite.io/docs
- **DeepSeek API**: https://platform.deepseek.com/docs
- **Next.js文档**: https://nextjs.org/docs
- **Recharts文档**: https://recharts.org/
- **Tailwind CSS**: https://tailwindcss.com/docs

---

**文档维护者**: GECOM Team
**最后更新**: 2025-11-08
**版本**: v2.0 (MVP 2.0 - 实施阶段)

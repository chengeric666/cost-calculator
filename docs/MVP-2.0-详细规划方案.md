# GECOM智能成本助手 MVP 2.0 详细规划方案

> **文档版本**: v2.0.0
> **创建日期**: 2025-11-08
> **作者**: GECOM Team
> **状态**: 规划中 → 待审批

---

## 📋 文档摘要

本文档是基于**真实19国成本数据**和**益家之宠30,000字专业报告标准**制定的MVP 2.0完整实施方案。

### 核心变更
- ✅ **数据驱动**：使用真实的M1-M8模块19国数据，替代POC中的硬编码假数据
- ✅ **界面重构**：重新设计完整五步向导（Step 0-5），展示GECOM方法论的完整粒度
- ✅ **报告升级**：对标益家之宠报告质量，包含图表、数据溯源、AI优化建议
- ✅ **AI集成**：DeepSeek R1/V3真正连接成本计算引擎，提供ROI优化指导
- ✅ **产品化**：从POC Demo升级到可支持19国×多平台×多场景的真实产品

### 解决的5个核心问题
1. **数据引擎不完整** → 构建完整的19国成本因子数据库
2. **报告能力不足** → 实现30,000字级别的专业报告生成
3. **界面粒度错误** → 重设计五步向导展示M1-M8完整模块
4. **功能未对齐** → 对齐GECOM-03产品规划的多国/多平台/多场景
5. **AI未集成** → 实现AI助手与成本引擎的深度联动

---

## 目录

**第一部分：数据库架构设计（基于19国真实数据）**
- 1.1 数据库设计原则
- 1.2 Collection 1: cost_factors（成本因子库）
- 1.3 Collection 2: projects（用户项目）
- 1.4 Collection 3: calculations（计算记录）
- 1.5 Collection 4: cost_factor_versions（版本管理）
- 1.6 数据关系与索引设计
- 1.7 数据导入策略

**第二部分：完整五步界面重设计（Step 0-5）**
- 2.1 整体设计原则
- 2.2 Step 0: 项目基本信息（重设计）
- 2.3 Step 1: 业务场景定义（重设计）
- 2.4 Step 2: 成本参数配置（完整M1-M8展示）
- 2.5 Step 3: 成本建模结果（增强可视化）
- 2.6 Step 4: 多场景对比分析（19国对比）
- 2.7 Step 5: AI智能助手（深度集成）
- 2.8 组件层次结构与数据流

**第三部分：专业报告生成系统**
- 3.1 报告质量标准（对标益家之宠）
- 3.2 报告模板设计
- 3.3 报告生成技术方案
- 3.4 AI增强：战略建议生成
- 3.5 数据溯源与质量标识

**第四部分：数据完整性与质量提升**
- 4.1 当前数据完整度评估
- 4.2 数据补全优先级
- 4.3 数据收集方案
- 4.4 数据质量分级（Tier 1/2/3）

**第五部分：技术实施方案**
- 5.1 GECOM计算引擎升级
- 5.2 AI助手工具调用设计
- 5.3 性能优化策略
- 5.4 错误处理与容错

**第六部分：4周详细实施计划**
- 6.1 Week 1: 数据基础设施
- 6.2 Week 2: 界面重构
- 6.3 Week 3: 报告生成系统
- 6.4 Week 4: AI集成与测试
- 6.5 验收标准与交付物

**第七部分：产品规划文档更新**
- 7.1 GECOM-03核心功能重写
- 7.2 CLAUDE.md上下文更新
- 7.3 README文档刷新

---

# 第一部分：数据库架构设计（基于19国真实数据）

## 1.1 数据库设计原则

### 设计目标
1. **真实数据驱动**：所有成本参数来自可溯源的19国真实数据
2. **灵活可扩展**：支持未来新增国家、新增成本模块
3. **用户可覆盖**：区分"系统预设"与"用户自定义"
4. **版本可追溯**：成本因子变化时支持历史版本查询
5. **查询高性能**：按国家/行业索引，支持快速预填

### 核心设计决策

**决策1：单表 vs 多表**
- ❌ 单表方案：将所有M1-M8数据存入一个mega表（字段过多，难维护）
- ✅ **多表方案**：按逻辑分组拆分为4个Collection
  - `cost_factors`（成本因子库，按国家存储M1-M8参数）
  - `projects`（用户项目元数据）
  - `calculations`（计算记录，含完整输入输出）
  - `cost_factor_versions`（版本管理，支持成本因子更新）

**决策2：JSON嵌套 vs 扁平字段**
- ✅ **混合方案**：
  - 高频查询字段扁平化（如`country`, `tariff_rate`, `vat_rate`）
  - 复杂结构JSON化（如`logistics`包含海运/空运子字段）
  - 用户覆盖值JSON化（`user_overrides`字段）

**决策3：数据溯源标识**
- 每个成本参数附加`data_source`字段：
  - `tier1_official`：官方来源（海关、政府网站），置信度100%
  - `tier2_authoritative`：权威来源（物流商、行业报告），置信度90%
  - `tier3_estimated`：经验估算（AI调研、专家估计），置信度80%

---

## 1.2 Collection 1: cost_factors（成本因子库）

### 设计思路
- **主键**：`country` (国家代码，如"US", "DE", "VN")
- **行业字段**：`industry` (当前支持"pet_food", 未来扩展"vape", "electronics")
- **版本字段**：`version` (如"2025Q1"，关联cost_factor_versions表)
- **完整的M1-M8参数**：扁平化 + JSON混合存储

### Appwrite Schema (JSON格式)

```json
{
  "collection_id": "cost_factors",
  "name": "成本因子库 (19国M1-M8数据)",
  "enabled": true,
  "attributes": [
    {
      "key": "country",
      "type": "string",
      "size": 10,
      "required": true,
      "default": null,
      "array": false
    },
    {
      "key": "country_name_cn",
      "type": "string",
      "size": 50,
      "required": true,
      "default": null,
      "array": false
    },
    {
      "key": "country_flag",
      "type": "string",
      "size": 10,
      "required": false,
      "default": null,
      "array": false
    },
    {
      "key": "industry",
      "type": "string",
      "size": 50,
      "required": true,
      "default": "pet_food",
      "array": false
    },
    {
      "key": "version",
      "type": "string",
      "size": 20,
      "required": true,
      "default": "2025Q1",
      "array": false
    },

    // ========== M1: 市场准入 ==========
    {
      "key": "m1_regulatory_agency",
      "type": "string",
      "size": 200,
      "required": false,
      "default": null,
      "array": false
    },
    {
      "key": "m1_pre_approval_required",
      "type": "boolean",
      "required": false,
      "default": false,
      "array": false
    },
    {
      "key": "m1_registration_required",
      "type": "boolean",
      "required": false,
      "default": false,
      "array": false
    },
    {
      "key": "m1_complexity",
      "type": "string",
      "size": 20,
      "required": false,
      "default": null,
      "array": false
    },
    {
      "key": "m1_estimated_cost_usd",
      "type": "float",
      "required": false,
      "default": null,
      "array": false
    },
    {
      "key": "m1_data_source",
      "type": "string",
      "size": 50,
      "required": false,
      "default": "tier3_estimated",
      "array": false
    },

    // ========== M2: 技术合规 ==========
    {
      "key": "m2_certifications_required",
      "type": "string",
      "size": 500,
      "required": false,
      "default": null,
      "array": false
    },
    {
      "key": "m2_estimated_cost_usd",
      "type": "float",
      "required": false,
      "default": null,
      "array": false
    },
    {
      "key": "m2_data_source",
      "type": "string",
      "size": 50,
      "required": false,
      "default": "tier3_estimated",
      "array": false
    },

    // ========== M3: 供应链搭建 ==========
    {
      "key": "m3_packaging_rate",
      "type": "float",
      "required": false,
      "default": 0.02,
      "array": false
    },
    {
      "key": "m3_data_source",
      "type": "string",
      "size": 50,
      "required": false,
      "default": "tier2_authoritative",
      "array": false
    },

    // ========== M4: 货物税费 ==========
    {
      "key": "m4_hs_code",
      "type": "string",
      "size": 20,
      "required": false,
      "default": "2309.10.00",
      "array": false
    },
    {
      "key": "m4_base_tariff_rate",
      "type": "float",
      "required": false,
      "default": null,
      "array": false
    },
    {
      "key": "m4_effective_tariff_rate",
      "type": "float",
      "required": true,
      "default": 0,
      "array": false
    },
    {
      "key": "m4_tariff_notes",
      "type": "string",
      "size": 500,
      "required": false,
      "default": null,
      "array": false
    },
    {
      "key": "m4_vat_rate",
      "type": "float",
      "required": true,
      "default": 0,
      "array": false
    },
    {
      "key": "m4_vat_notes",
      "type": "string",
      "size": 500,
      "required": false,
      "default": null,
      "array": false
    },
    {
      "key": "m4_tariff_data_source",
      "type": "string",
      "size": 50,
      "required": false,
      "default": "tier1_official",
      "array": false
    },
    {
      "key": "m4_vat_data_source",
      "type": "string",
      "size": 50,
      "required": false,
      "default": "tier1_official",
      "array": false
    },

    // ========== M4: 物流（JSON字段） ==========
    {
      "key": "m4_logistics",
      "type": "string",
      "size": 2000,
      "required": false,
      "default": null,
      "array": false
    },

    // ========== M5: 物流配送 ==========
    {
      "key": "m5_last_mile_delivery_usd",
      "type": "float",
      "required": false,
      "default": null,
      "array": false
    },
    {
      "key": "m5_return_rate",
      "type": "float",
      "required": false,
      "default": 0.10,
      "array": false
    },
    {
      "key": "m5_return_cost_rate",
      "type": "float",
      "required": false,
      "default": 0.30,
      "array": false
    },
    {
      "key": "m5_data_source",
      "type": "string",
      "size": 50,
      "required": false,
      "default": "tier2_authoritative",
      "array": false
    },

    // ========== M6: 营销获客 ==========
    {
      "key": "m6_marketing_rate",
      "type": "float",
      "required": false,
      "default": 0.15,
      "array": false
    },
    {
      "key": "m6_data_source",
      "type": "string",
      "size": 50,
      "required": false,
      "default": "tier2_authoritative",
      "array": false
    },

    // ========== M7: 支付手续费 ==========
    {
      "key": "m7_payment_rate",
      "type": "float",
      "required": false,
      "default": 0.029,
      "array": false
    },
    {
      "key": "m7_payment_fixed_usd",
      "type": "float",
      "required": false,
      "default": 0.30,
      "array": false
    },
    {
      "key": "m7_platform_commission_rate",
      "type": "float",
      "required": false,
      "default": null,
      "array": false
    },
    {
      "key": "m7_data_source",
      "type": "string",
      "size": 50,
      "required": false,
      "default": "tier1_official",
      "array": false
    },

    // ========== M8: 运营管理 ==========
    {
      "key": "m8_ga_rate",
      "type": "float",
      "required": false,
      "default": 0.03,
      "array": false
    },
    {
      "key": "m8_data_source",
      "type": "string",
      "size": 50,
      "required": false,
      "default": "tier2_authoritative",
      "array": false
    },

    // ========== 元数据 ==========
    {
      "key": "created_at",
      "type": "datetime",
      "required": true,
      "default": null,
      "array": false
    },
    {
      "key": "updated_at",
      "type": "datetime",
      "required": true,
      "default": null,
      "array": false
    }
  ],
  "indexes": [
    {
      "key": "idx_country",
      "type": "key",
      "attributes": ["country"],
      "orders": ["ASC"]
    },
    {
      "key": "idx_country_industry_version",
      "type": "unique",
      "attributes": ["country", "industry", "version"],
      "orders": ["ASC", "ASC", "ASC"]
    }
  ]
}
```

### m4_logistics JSON字段结构

```typescript
interface M4Logistics {
  sea_freight: {
    usd_per_kg: number;
    lcl_usd_per_cbm_min: number;
    lcl_usd_per_cbm_max: number;
    fcl_20ft_usd_min: number;
    fcl_20ft_usd_max: number;
    transit_days_min: number;
    transit_days_max: number;
    data_source: 'tier1_official' | 'tier2_authoritative' | 'tier3_estimated';
  };
  air_freight: {
    usd_per_kg: number;
    ddp_usd_per_kg: number;
    transit_days_min: number;
    transit_days_max: number;
    data_source: 'tier1_official' | 'tier2_authoritative' | 'tier3_estimated';
  };
}
```

### 数据示例（前3行）

```json
[
  {
    "country": "US",
    "country_name_cn": "美国",
    "country_flag": "🇺🇸",
    "industry": "pet_food",
    "version": "2025Q1",
    "m1_regulatory_agency": "FDA, APHIS",
    "m1_pre_approval_required": false,
    "m1_registration_required": false,
    "m1_complexity": "高",
    "m1_estimated_cost_usd": 5000,
    "m1_data_source": "tier2_authoritative",
    "m4_effective_tariff_rate": 0.55,
    "m4_tariff_notes": "10%互惠关税 + 25% Section 301 + 20%附加",
    "m4_vat_rate": 0.06,
    "m4_vat_notes": "州税差异，范围0-10%+",
    "m4_tariff_data_source": "tier1_official",
    "m4_vat_data_source": "tier1_official",
    "m4_logistics": "{\"sea_freight\":{\"usd_per_kg\":0.20,\"lcl_usd_per_cbm_min\":100,\"lcl_usd_per_cbm_max\":300,\"fcl_20ft_usd_min\":2250,\"fcl_20ft_usd_max\":4500,\"transit_days_min\":18,\"transit_days_max\":25,\"data_source\":\"tier2_authoritative\"},\"air_freight\":{\"usd_per_kg\":4.5,\"ddp_usd_per_kg\":6.0,\"transit_days_min\":5,\"transit_days_max\":7,\"data_source\":\"tier2_authoritative\"}}",
    "m5_last_mile_delivery_usd": 7.5,
    "m5_return_rate": 0.10,
    "m5_return_cost_rate": 0.30,
    "m5_data_source": "tier2_authoritative",
    "m6_marketing_rate": 0.15,
    "m6_data_source": "tier2_authoritative",
    "m7_payment_rate": 0.029,
    "m7_payment_fixed_usd": 0.30,
    "m7_platform_commission_rate": 0.15,
    "m7_data_source": "tier1_official",
    "m8_ga_rate": 0.03,
    "m8_data_source": "tier2_authoritative"
  },
  {
    "country": "VN",
    "country_name_cn": "越南",
    "country_flag": "🇻🇳",
    "industry": "pet_food",
    "version": "2025Q1",
    "m1_regulatory_agency": "DAH (Department of Animal Health)",
    "m1_pre_approval_required": false,
    "m1_registration_required": false,
    "m1_complexity": "低",
    "m1_estimated_cost_usd": 1000,
    "m1_data_source": "tier3_estimated",
    "m4_effective_tariff_rate": 0,
    "m4_tariff_notes": "RCEP协定优惠，0%关税",
    "m4_vat_rate": 0.10,
    "m4_vat_notes": "标准10%，部分商品临时8%",
    "m4_tariff_data_source": "tier1_official",
    "m4_vat_data_source": "tier1_official",
    "m4_logistics": "{\"sea_freight\":{\"usd_per_kg\":0.05,\"lcl_usd_per_cbm_min\":50,\"lcl_usd_per_cbm_max\":50,\"fcl_20ft_usd_min\":500,\"fcl_20ft_usd_max\":750,\"transit_days_min\":7,\"transit_days_max\":12,\"data_source\":\"tier2_authoritative\"},\"air_freight\":{\"usd_per_kg\":2.5,\"ddp_usd_per_kg\":3.5,\"transit_days_min\":3,\"transit_days_max\":5,\"data_source\":\"tier2_authoritative\"}}",
    "m5_last_mile_delivery_usd": 0.18,
    "m5_data_source": "tier2_authoritative",
    "m7_platform_commission_rate": 0.06,
    "m7_data_source": "tier2_authoritative"
  },
  {
    "country": "DE",
    "country_name_cn": "德国",
    "country_flag": "🇩🇪",
    "industry": "pet_food",
    "version": "2025Q1",
    "m1_regulatory_agency": "EU Commission, BMEL",
    "m1_pre_approval_required": true,
    "m1_registration_required": false,
    "m1_complexity": "极高",
    "m1_estimated_cost_usd": 15000,
    "m1_data_source": "tier2_authoritative",
    "m4_effective_tariff_rate": 0.05,
    "m4_tariff_notes": "EU TARIC 5%",
    "m4_vat_rate": 0.19,
    "m4_vat_notes": "标准19%，部分商品减税7%",
    "m4_tariff_data_source": "tier1_official",
    "m4_vat_data_source": "tier1_official",
    "m4_logistics": "{\"sea_freight\":{\"usd_per_kg\":0.065,\"lcl_usd_per_cbm_min\":50,\"lcl_usd_per_cbm_max\":80,\"fcl_20ft_usd_min\":2000,\"fcl_20ft_usd_max\":3500,\"transit_days_min\":30,\"transit_days_max\":40,\"data_source\":\"tier2_authoritative\"},\"air_freight\":{\"usd_per_kg\":5.5,\"ddp_usd_per_kg\":7.0,\"transit_days_min\":5,\"transit_days_max\":7,\"data_source\":\"tier2_authoritative\"}}",
    "m5_last_mile_delivery_usd": 7.86,
    "m5_data_source": "tier2_authoritative",
    "m7_platform_commission_rate": 0.15,
    "m7_data_source": "tier2_authoritative"
  }
]
```

---

## 1.3 Collection 2: projects（用户项目）

### 设计思路
- 存储用户创建的项目元数据
- 关联用户ID（未来支持多用户）
- 项目级别的配置（行业、目标市场、销售渠道）

### Appwrite Schema

```json
{
  "collection_id": "projects",
  "name": "用户项目",
  "enabled": true,
  "attributes": [
    {
      "key": "user_id",
      "type": "string",
      "size": 50,
      "required": false,
      "default": "anonymous",
      "array": false
    },
    {
      "key": "name",
      "type": "string",
      "size": 200,
      "required": true,
      "default": null,
      "array": false
    },
    {
      "key": "industry",
      "type": "string",
      "size": 50,
      "required": true,
      "default": "pet_food",
      "array": false
    },
    {
      "key": "target_country",
      "type": "string",
      "size": 10,
      "required": true,
      "default": null,
      "array": false
    },
    {
      "key": "sales_channel",
      "type": "string",
      "size": 50,
      "required": true,
      "default": null,
      "array": false
    },
    {
      "key": "description",
      "type": "string",
      "size": 1000,
      "required": false,
      "default": null,
      "array": false
    },
    {
      "key": "created_at",
      "type": "datetime",
      "required": true,
      "default": null,
      "array": false
    },
    {
      "key": "updated_at",
      "type": "datetime",
      "required": true,
      "default": null,
      "array": false
    }
  ],
  "indexes": [
    {
      "key": "idx_user_id",
      "type": "key",
      "attributes": ["user_id"],
      "orders": ["ASC"]
    },
    {
      "key": "idx_created_at",
      "type": "key",
      "attributes": ["created_at"],
      "orders": ["DESC"]
    }
  ]
}
```

---

## 1.4 Collection 3: calculations（计算记录）

### 设计思路
- 存储每次成本计算的完整输入和输出
- 支持历史查询和重现
- 区分"系统预设"和"用户覆盖"值
- 关联使用的cost_factor版本

### Appwrite Schema

```json
{
  "collection_id": "calculations",
  "name": "计算记录",
  "enabled": true,
  "attributes": [
    {
      "key": "project_id",
      "type": "string",
      "size": 50,
      "required": true,
      "default": null,
      "array": false
    },
    {
      "key": "cost_factor_version",
      "type": "string",
      "size": 20,
      "required": true,
      "default": "2025Q1",
      "array": false
    },
    {
      "key": "scope",
      "type": "string",
      "size": 10000,
      "required": true,
      "default": null,
      "array": false
    },
    {
      "key": "cost_result",
      "type": "string",
      "size": 15000,
      "required": true,
      "default": null,
      "array": false
    },
    {
      "key": "user_overrides",
      "type": "string",
      "size": 5000,
      "required": false,
      "default": null,
      "array": false
    },
    {
      "key": "created_at",
      "type": "datetime",
      "required": true,
      "default": null,
      "array": false
    }
  ],
  "indexes": [
    {
      "key": "idx_project_id",
      "type": "key",
      "attributes": ["project_id"],
      "orders": ["ASC"]
    },
    {
      "key": "idx_created_at",
      "type": "key",
      "attributes": ["created_at"],
      "orders": ["DESC"]
    }
  ]
}
```

### 字段说明

**scope字段（JSON）**：完整输入参数
```typescript
interface CalculationScope {
  // 基础信息
  productName: string;
  targetCountry: string;
  salesChannel: string;

  // 产品参数
  cogsUsd: number;
  sellingPriceUsd: number;
  productWeightKg: number;
  monthlyVolume: number;

  // CAPEX
  capex: {
    m1_market_entry: number;
    m2_compliance: number;
    m3_supply_chain_setup: number;
  };

  // OPEX (使用预设 or 用户覆盖)
  opex: {
    shippingMethod: 'sea' | 'air';
    // 其他字段从cost_factors加载或用户覆盖
  };
}
```

**cost_result字段（JSON）**：完整输出结果
```typescript
interface CostResult {
  // CAPEX明细
  capex: {
    m1: number;
    m2: number;
    m3: number;
    total: number;
  };

  // OPEX明细（单位成本）
  opex: {
    m4_cogs: number;
    m4_tariff: number;
    m4_logistics: number;
    m4_vat: number;
    m5_last_mile: number;
    m5_return: number;
    m6_marketing: number;
    m7_payment: number;
    m7_platform_commission: number;
    m8_ga: number;
    total: number;
  };

  // 单位经济模型
  unit_economics: {
    revenue: number;
    cost: number;
    gross_profit: number;
    gross_margin: number; // 百分比
  };

  // 关键KPI
  kpis: {
    roi: number; // 百分比
    payback_period_months: number;
    breakeven_price: number;
    breakeven_volume: number;
  };

  // 成本分布（用于饼图）
  cost_breakdown: Array<{
    module: string; // "M4货物税费"
    amount: number;
    percentage: number;
  }>;
}
```

**user_overrides字段（JSON）**：用户覆盖的参数
```typescript
interface UserOverrides {
  // 记录哪些字段被用户自定义
  m4_effective_tariff_rate?: number;
  m4_vat_rate?: number;
  m6_marketing_rate?: number;
  // ... 其他可覆盖字段

  // 元数据
  override_reason?: string; // 用户备注为什么覆盖
}
```

---

## 1.5 Collection 4: cost_factor_versions（版本管理）

### 设计思路
- 管理成本因子的版本变更
- 支持历史版本查询
- 追踪数据更新时间和变更内容

### Appwrite Schema

```json
{
  "collection_id": "cost_factor_versions",
  "name": "成本因子版本管理",
  "enabled": true,
  "attributes": [
    {
      "key": "version",
      "type": "string",
      "size": 20,
      "required": true,
      "default": null,
      "array": false
    },
    {
      "key": "effective_date",
      "type": "datetime",
      "required": true,
      "default": null,
      "array": false
    },
    {
      "key": "is_current",
      "type": "boolean",
      "required": true,
      "default": false,
      "array": false
    },
    {
      "key": "changelog",
      "type": "string",
      "size": 2000,
      "required": false,
      "default": null,
      "array": false
    },
    {
      "key": "created_at",
      "type": "datetime",
      "required": true,
      "default": null,
      "array": false
    }
  ],
  "indexes": [
    {
      "key": "idx_version",
      "type": "unique",
      "attributes": ["version"],
      "orders": ["ASC"]
    },
    {
      "key": "idx_is_current",
      "type": "key",
      "attributes": ["is_current"],
      "orders": ["DESC"]
    }
  ]
}
```

### 数据示例

```json
[
  {
    "version": "2025Q1",
    "effective_date": "2025-01-01T00:00:00.000Z",
    "is_current": true,
    "changelog": "初始版本：基于2024Q4数据，包含19国完整M1-M8成本因子。美国关税更新为55%（含新增20%附加关税）。",
    "created_at": "2025-01-01T00:00:00.000Z"
  },
  {
    "version": "2024Q4",
    "effective_date": "2024-10-01T00:00:00.000Z",
    "is_current": false,
    "changelog": "历史版本：美国关税35%（10%互惠+25% Section 301）。",
    "created_at": "2024-10-01T00:00:00.000Z"
  }
]
```

---

## 1.6 数据关系与索引设计

### 数据关系图（ER Diagram）

```
┌─────────────────────────────────┐
│  cost_factor_versions           │
│  - version (PK)                 │
│  - effective_date               │
│  - is_current                   │
│  - changelog                    │
└─────────────────────────────────┘
            │
            │ 1:N (一个版本对应多个国家的成本因子)
            ▼
┌─────────────────────────────────┐
│  cost_factors                   │
│  - id (PK)                      │
│  - country                      │
│  - industry                     │
│  - version (FK)                 │──┐
│  - m1_* (19个M1字段)            │  │
│  - m4_* (12个M4字段)            │  │
│  - m5_* (4个M5字段)             │  │
│  - ...                          │  │
└─────────────────────────────────┘  │
            │                         │
            │ N:1 (计算时引用特定版本的成本因子)
            │                         │
            ▼                         │
┌─────────────────────────────────┐  │
│  calculations                   │  │
│  - id (PK)                      │  │
│  - project_id (FK)              │  │
│  - cost_factor_version (FK) ────┘
│  - scope (JSON)                 │
│  - cost_result (JSON)           │
│  - user_overrides (JSON)        │
└─────────────────────────────────┘
            ▲
            │ N:1 (一个项目有多次计算)
            │
┌─────────────────────────────────┐
│  projects                       │
│  - id (PK)                      │
│  - user_id                      │
│  - name                         │
│  - industry                     │
│  - target_country               │
│  - sales_channel                │
└─────────────────────────────────┘
```

### 查询场景与索引优化

**场景1：用户选择国家后加载预设参数**
```sql
-- 查询：给定国家和行业，加载当前版本的成本因子
SELECT * FROM cost_factors
WHERE country = 'US'
  AND industry = 'pet_food'
  AND version = (SELECT version FROM cost_factor_versions WHERE is_current = true)

-- 索引：idx_country_industry_version (已创建)
```

**场景2：查看历史计算记录**
```sql
-- 查询：给定项目，按时间倒序查看所有计算
SELECT * FROM calculations
WHERE project_id = 'xxx'
ORDER BY created_at DESC

-- 索引：idx_project_id + idx_created_at (已创建)
```

**场景3：对比不同版本的成本因子变化**
```sql
-- 查询：给定国家，对比两个版本的关税差异
SELECT version, m4_effective_tariff_rate
FROM cost_factors
WHERE country = 'US'
  AND industry = 'pet_food'
  AND version IN ('2025Q1', '2024Q4')

-- 索引：idx_country_industry_version (已创建)
```

---

## 1.7 数据导入策略

### 数据来源清单

基于已有的19国真实数据文件：

| 文件名 | 数据类型 | 对应模块 | 导入目标字段 |
|--------|---------|---------|-------------|
| M1_行业特定准入许可_宠物食品19国准入许可.xlsx | Excel | M1 | m1_regulatory_agency, m1_complexity, m1_pre_approval_required |
| M4_进口关税_19国的关税税率_宠物食品.xlsx | Excel | M4 | m4_effective_tariff_rate, m4_tariff_notes |
| M4_流转税（VATGST销售税）_19_countries.csv | CSV | M4 | m4_vat_rate, m4_vat_notes |
| M4_头程物流_海运.xlsx | Excel | M4 | m4_logistics.sea_freight |
| M4_头程物流_空运.xlsx | Excel | M4 | m4_logistics.air_freight |
| M5_尾程配送费.csv | CSV | M5 | m5_last_mile_delivery_usd |
| M7_第三方平台销售佣金.csv | CSV | M7 | m7_platform_commission_rate |
| M3/M5/M6/M7/M8的TXT文件 | TXT | M3-M8 | 公式参数（如m3_packaging_rate=0.02） |

### 导入脚本设计（Python）

**Step 1: 读取Excel和CSV数据**

```python
import pandas as pd
import json
from datetime import datetime

# 读取M1数据（19国合规）
m1_df = pd.read_excel('M1_行业特定准入许可_宠物食品19国准入许可.xlsx')

# 读取M4关税数据
m4_tariff_df = pd.read_excel('M4_进口关税_19国的关税税率_宠物食品.xlsx')

# 读取M4 VAT数据
m4_vat_df = pd.read_csv('M4_流转税（VATGST销售税）_19_countries.csv')

# 读取M4物流数据
m4_sea_df = pd.read_excel('M4_头程物流_海运.xlsx')
m4_air_df = pd.read_excel('M4_头程物流_空运.xlsx')

# 读取M5配送数据
m5_df = pd.read_csv('M5_尾程配送费.csv')

# 读取M7佣金数据
m7_df = pd.read_csv('M7_第三方平台销售佣金.csv')

# 合并所有数据（按国家代码）
countries = [
    'US', 'CA', 'DE', 'GB', 'FR', 'SG', 'MY', 'PH', 'VN', 'TH',
    'ID', 'IN', 'JP', 'KR', 'AU', 'SA', 'AE', 'MX', 'BR'
]

cost_factors = []

for country in countries:
    # 从各表提取数据
    m1_row = m1_df[m1_df['国家代码'] == country].iloc[0]
    m4_tariff_row = m4_tariff_df[m4_tariff_df['国家代码'] == country].iloc[0]
    m4_vat_row = m4_vat_df[m4_vat_df['国家代码'] == country].iloc[0]
    m4_sea_row = m4_sea_df[m4_sea_df['国家代码'] == country].iloc[0]
    m4_air_row = m4_air_df[m4_air_df['国家代码'] == country].iloc[0]
    m5_row = m5_df[m5_df['国家代码'] == country].iloc[0]
    m7_row = m7_df[m7_df['国家代码'] == country].iloc[0]

    # 构建logistics JSON
    logistics = {
        "sea_freight": {
            "usd_per_kg": m4_sea_row['USD/kg'],
            "lcl_usd_per_cbm_min": m4_sea_row['LCL_Min'],
            "lcl_usd_per_cbm_max": m4_sea_row['LCL_Max'],
            "fcl_20ft_usd_min": m4_sea_row['FCL_20ft_Min'],
            "fcl_20ft_usd_max": m4_sea_row['FCL_20ft_Max'],
            "transit_days_min": m4_sea_row['Transit_Days_Min'],
            "transit_days_max": m4_sea_row['Transit_Days_Max'],
            "data_source": "tier2_authoritative"
        },
        "air_freight": {
            "usd_per_kg": m4_air_row['USD/kg'],
            "ddp_usd_per_kg": m4_air_row['DDP_USD/kg'],
            "transit_days_min": m4_air_row['Transit_Days_Min'],
            "transit_days_max": m4_air_row['Transit_Days_Max'],
            "data_source": "tier2_authoritative"
        }
    }

    # 构建完整记录
    record = {
        "country": country,
        "country_name_cn": m1_row['国家'],
        "country_flag": m1_row['国旗'],
        "industry": "pet_food",
        "version": "2025Q1",

        # M1
        "m1_regulatory_agency": m1_row['监管机构'],
        "m1_pre_approval_required": m1_row['预审要求'] == '是',
        "m1_registration_required": m1_row['注册要求'] == '是',
        "m1_complexity": m1_row['合规复杂度'],
        "m1_estimated_cost_usd": None,  # 待补充
        "m1_data_source": "tier2_authoritative",

        # M4
        "m4_hs_code": "2309.10.00",
        "m4_effective_tariff_rate": m4_tariff_row['关税率'],
        "m4_tariff_notes": m4_tariff_row['备注'],
        "m4_vat_rate": m4_vat_row['VAT/GST税率'],
        "m4_vat_notes": m4_vat_row['Notes'],
        "m4_tariff_data_source": "tier1_official",
        "m4_vat_data_source": "tier1_official",
        "m4_logistics": json.dumps(logistics),

        # M5
        "m5_last_mile_delivery_usd": m5_row['配送费USD'],
        "m5_return_rate": 0.10,
        "m5_return_cost_rate": 0.30,
        "m5_data_source": "tier2_authoritative",

        # M6 (公式)
        "m6_marketing_rate": 0.15,
        "m6_data_source": "tier2_authoritative",

        # M7
        "m7_payment_rate": 0.029,
        "m7_payment_fixed_usd": 0.30,
        "m7_platform_commission_rate": m7_row['平台佣金率'],
        "m7_data_source": "tier1_official",

        # M8 (公式)
        "m8_ga_rate": 0.03,
        "m8_data_source": "tier2_authoritative",

        # 时间戳
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }

    cost_factors.append(record)

# 导出为JSON（用于Appwrite导入）
with open('cost_factors_2025Q1.json', 'w', encoding='utf-8') as f:
    json.dump(cost_factors, f, ensure_ascii=False, indent=2)

print(f"✅ 已生成 {len(cost_factors)} 条成本因子记录")
```

**Step 2: 导入到Appwrite**

```typescript
// scripts/import-cost-factors.ts
import { Client, Databases } from 'node-appwrite';
import costFactorsData from './cost_factors_2025Q1.json';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);

async function importCostFactors() {
  console.log('开始导入成本因子数据...');

  for (const record of costFactorsData) {
    try {
      await databases.createDocument(
        process.env.APPWRITE_DATABASE_ID!,
        'cost_factors',
        'unique()', // 自动生成ID
        record
      );
      console.log(`✅ 导入成功: ${record.country} ${record.country_name_cn}`);
    } catch (error) {
      console.error(`❌ 导入失败: ${record.country}`, error);
    }
  }

  console.log('✅ 导入完成！');
}

importCostFactors();
```

### 数据验证规则

导入后需要验证：

1. **完整性验证**：19国数据全部导入
2. **必填字段验证**：关键字段（如tariff_rate, vat_rate）无null
3. **数据范围验证**：
   - 税率范围：0-1（百分比转小数）
   - 物流费用：>0
   - 合规复杂度：仅限"极高/高/中/低"
4. **JSON格式验证**：m4_logistics字段可正确解析
5. **数据溯源验证**：每个字段都有data_source标记

### 数据更新策略

**场景1：关税税率变化**
1. 创建新版本（如2025Q2）
2. 更新受影响国家的m4_effective_tariff_rate
3. 在changelog记录变更内容
4. 设置is_current=true，旧版本设为false

**场景2：新增国家**
1. 准备新国家的M1-M8数据
2. 运行导入脚本新增记录
3. 使用当前版本号

**场景3：数据质量提升**（Tier 3 → Tier 2）
1. 更新对应字段的data_source
2. 更新数值（如果有更准确的数据）
3. 在changelog记录数据来源升级

---

## 1.8 TypeScript类型定义

### 完整的类型系统

```typescript
// types/database.ts

/**
 * 数据来源分级
 */
export type DataSource =
  | 'tier1_official'        // 官方来源，置信度100%
  | 'tier2_authoritative'   // 权威来源，置信度90%
  | 'tier3_estimated';      // 经验估算，置信度80%

/**
 * 合规复杂度
 */
export type ComplianceComplexity = '极高' | '高' | '中' | '低';

/**
 * 物流数据结构
 */
export interface M4Logistics {
  sea_freight: {
    usd_per_kg: number;
    lcl_usd_per_cbm_min: number;
    lcl_usd_per_cbm_max: number;
    fcl_20ft_usd_min: number;
    fcl_20ft_usd_max: number;
    transit_days_min: number;
    transit_days_max: number;
    data_source: DataSource;
  };
  air_freight: {
    usd_per_kg: number;
    ddp_usd_per_kg: number;
    transit_days_min: number;
    transit_days_max: number;
    data_source: DataSource;
  };
}

/**
 * 成本因子（完整）
 */
export interface CostFactor {
  $id: string;
  country: string;
  country_name_cn: string;
  country_flag: string;
  industry: string;
  version: string;

  // M1: 市场准入
  m1_regulatory_agency?: string;
  m1_pre_approval_required: boolean;
  m1_registration_required: boolean;
  m1_complexity?: ComplianceComplexity;
  m1_estimated_cost_usd?: number;
  m1_data_source: DataSource;

  // M2: 技术合规
  m2_certifications_required?: string;
  m2_estimated_cost_usd?: number;
  m2_data_source: DataSource;

  // M3: 供应链搭建
  m3_packaging_rate: number;
  m3_data_source: DataSource;

  // M4: 货物税费
  m4_hs_code: string;
  m4_base_tariff_rate?: number;
  m4_effective_tariff_rate: number;
  m4_tariff_notes?: string;
  m4_vat_rate: number;
  m4_vat_notes?: string;
  m4_tariff_data_source: DataSource;
  m4_vat_data_source: DataSource;
  m4_logistics: string; // JSON字符串，需解析为M4Logistics

  // M5: 物流配送
  m5_last_mile_delivery_usd: number;
  m5_return_rate: number;
  m5_return_cost_rate: number;
  m5_data_source: DataSource;

  // M6: 营销获客
  m6_marketing_rate: number;
  m6_data_source: DataSource;

  // M7: 支付手续费
  m7_payment_rate: number;
  m7_payment_fixed_usd: number;
  m7_platform_commission_rate: number;
  m7_data_source: DataSource;

  // M8: 运营管理
  m8_ga_rate: number;
  m8_data_source: DataSource;

  // 元数据
  $createdAt: string;
  $updatedAt: string;
}

/**
 * 用户项目
 */
export interface Project {
  $id: string;
  user_id: string;
  name: string;
  industry: string;
  target_country: string;
  sales_channel: string;
  description?: string;
  $createdAt: string;
  $updatedAt: string;
}

/**
 * 计算输入（scope）
 */
export interface CalculationScope {
  productName: string;
  targetCountry: string;
  salesChannel: string;
  cogsUsd: number;
  sellingPriceUsd: number;
  productWeightKg: number;
  monthlyVolume: number;

  capex: {
    m1_market_entry: number;
    m2_compliance: number;
    m3_supply_chain_setup: number;
  };

  opex: {
    shippingMethod: 'sea' | 'air';
  };
}

/**
 * 计算结果（cost_result）
 */
export interface CostResult {
  capex: {
    m1: number;
    m2: number;
    m3: number;
    total: number;
  };

  opex: {
    m4_cogs: number;
    m4_tariff: number;
    m4_logistics: number;
    m4_vat: number;
    m5_last_mile: number;
    m5_return: number;
    m6_marketing: number;
    m7_payment: number;
    m7_platform_commission: number;
    m8_ga: number;
    total: number;
  };

  unit_economics: {
    revenue: number;
    cost: number;
    gross_profit: number;
    gross_margin: number;
  };

  kpis: {
    roi: number;
    payback_period_months: number;
    breakeven_price: number;
    breakeven_volume: number;
  };

  cost_breakdown: Array<{
    module: string;
    amount: number;
    percentage: number;
  }>;
}

/**
 * 用户覆盖值
 */
export interface UserOverrides {
  m4_effective_tariff_rate?: number;
  m4_vat_rate?: number;
  m6_marketing_rate?: number;
  override_reason?: string;
}

/**
 * 计算记录
 */
export interface Calculation {
  $id: string;
  project_id: string;
  cost_factor_version: string;
  scope: string; // JSON字符串，需解析为CalculationScope
  cost_result: string; // JSON字符串，需解析为CostResult
  user_overrides?: string; // JSON字符串，需解析为UserOverrides
  $createdAt: string;
}

/**
 * 成本因子版本
 */
export interface CostFactorVersion {
  $id: string;
  version: string;
  effective_date: string;
  is_current: boolean;
  changelog?: string;
  $createdAt: string;
}
```

---

**第一部分完成检查点**：
- ✅ 4个Collection完整Schema设计
- ✅ 数据关系ER图
- ✅ 查询场景与索引优化
- ✅ 数据导入策略（Python脚本 + TypeScript脚本）
- ✅ 完整的TypeScript类型定义
- ✅ 数据验证规则
- ✅ 数据更新策略

**第一部分总结**：
数据库架构设计已完成，基于19国真实数据构建了4个Collection，支持：
- 19国×M1-M8完整成本因子存储
- 数据溯源（Tier 1/2/3）
- 用户覆盖与预设区分
- 版本管理与历史查询
- 高性能索引优化

---

*下一批将输出：**第二部分 - 完整五步界面重设计（Step 0-5）***

---

# 第二部分：完整五步界面重设计（Step 0-5）

## 2.1 整体设计原则

### 当前POC存在的问题

1. **Step 2粒度过粗**：只有3个字段（COGS、零售价、月销量），完全看不到GECOM的M1-M8模块结构
2. **数据预填缺失**：用户选择国家后，没有自动加载19国真实数据
3. **用户覆盖不透明**：无法区分哪些值是系统预设，哪些是用户修改
4. **Step 4未实现**：多场景对比功能完全缺失
5. **AI助手脱节**：Step 5的AI无法查询成本数据，不能提供真实ROI建议

### MVP 2.0设计目标

**目标1：体现GECOM方法论的完整粒度**
- 每个步骤都清晰映射到GECOM框架的某个阶段
- M1-M8八个模块在界面上完整可见
- 双阶段（CAPEX/OPEX）划分清晰

**目标2：智能预填 + 用户可控**
- 用户选择国家后，自动加载19国数据库的成本因子
- 预设值以"灰色只读"显示，但可点击"自定义"按钮解锁编辑
- 用户修改后，显示"已自定义"标识和数据来源对比

**目标3：数据溯源透明化**
- 每个成本参数显示来源标签（Tier 1/2/3）
- 鼠标悬停显示详细说明（如"来源：美国海关官网"）
- 数据质量视觉化（Tier 1绿色、Tier 2黄色、Tier 3灰色）

**目标4：渐进式信息披露**
- 默认收起详细模块，显示关键参数和计算结果摘要
- 可展开查看完整M1-M8明细
- 支持"快速模式"（使用全部预设）vs"专家模式"（逐项自定义）

**目标5：实时反馈与验证**
- 用户修改任何参数时，实时重算成本结果
- 显示参数的合理范围提示（如"关税率通常为0-100%"）
- 异常值警告（如"您输入的关税率55%高于大多数国家"）

---

## 2.2 Step 0: 项目基本信息（重设计）

### 当前POC问题
- 当前POC没有独立的Step 0，项目信息混在Step 1中
- 缺少项目保存/加载功能

### MVP 2.0设计

**界面结构：**
```
┌─────────────────────────────────────────────────────┐
│  Step 0: 创建项目                                    │
├─────────────────────────────────────────────────────┤
│                                                       │
│  项目信息                                            │
│  ┌─────────────────────────────────────────────┐    │
│  │ 项目名称 *                                   │    │
│  │ ┌─────────────────────────────────────┐     │    │
│  │ │ 益家之宠宠物食品美国市场测算         │     │    │
│  │ └─────────────────────────────────────┘     │    │
│  │                                              │    │
│  │ 行业类别 *                                   │    │
│  │ ○ 宠物食品 Pet Food                          │    │
│  │ ○ 电子烟 Vape (即将支持)                     │    │
│  │ ○ 其他 (自定义)                              │    │
│  │                                              │    │
│  │ 产品描述 (可选)                              │    │
│  │ ┌─────────────────────────────────────┐     │    │
│  │ │ 天然无谷狗粮，针对成犬，2kg包装    │     │    │
│  │ └─────────────────────────────────────┘     │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
│  或从历史项目加载：                                  │
│  ┌─────────────────────────────────────────────┐    │
│  │ [📁] 益家之宠-美国市场     2025-01-05        │    │
│  │ [📁] 益家之宠-越南市场     2025-01-03        │    │
│  │ [📁] 益家之宠-德国市场     2025-01-01        │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
│  [取消] [下一步：业务场景定义 →]                     │
└─────────────────────────────────────────────────────┘
```

**字段设计：**

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| 项目名称 | string | 是 | 项目标识，支持中英文 |
| 行业类别 | enum | 是 | pet_food / vape / other |
| 产品描述 | textarea | 否 | 可选的详细描述 |

**数据流：**
```
用户输入 → 创建Project记录 → 存储到Appwrite projects表 → 进入Step 1
```

**组件伪代码：**
```typescript
// components/wizard/Step0ProjectInfo.tsx
interface Step0State {
  projectName: string;
  industry: 'pet_food' | 'vape' | 'other';
  description: string;
}

export function Step0ProjectInfo() {
  const [state, setState] = useState<Step0State>({
    projectName: '',
    industry: 'pet_food',
    description: ''
  });

  const [existingProjects, setExistingProjects] = useState<Project[]>([]);

  useEffect(() => {
    // 加载用户的历史项目列表
    loadExistingProjects();
  }, []);

  const handleNext = async () => {
    // 验证必填字段
    if (!state.projectName) {
      alert('请输入项目名称');
      return;
    }

    // 创建项目记录
    const project = await createProject({
      name: state.projectName,
      industry: state.industry,
      description: state.description
    });

    // 存储project_id到向导状态
    wizardState.projectId = project.$id;

    // 进入Step 1
    goToNextStep();
  };

  return (
    <div className="space-y-6">
      <h2>Step 0: 创建项目</h2>

      {/* 项目基本信息表单 */}
      <Card>
        <CardHeader>
          <CardTitle>项目信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="project-name">项目名称 *</Label>
              <Input
                id="project-name"
                value={state.projectName}
                onChange={(e) => setState({...state, projectName: e.target.value})}
                placeholder="例如：益家之宠宠物食品美国市场测算"
              />
            </div>

            <div>
              <Label>行业类别 *</Label>
              <RadioGroup value={state.industry} onValueChange={(v) => setState({...state, industry: v})}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pet_food" id="pet_food" />
                  <Label htmlFor="pet_food">宠物食品 Pet Food</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vape" id="vape" />
                  <Label htmlFor="vape">电子烟 Vape (即将支持)</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="description">产品描述 (可选)</Label>
              <Textarea
                id="description"
                value={state.description}
                onChange={(e) => setState({...state, description: e.target.value})}
                placeholder="例如：天然无谷狗粮，针对成犬，2kg包装"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 或加载历史项目 */}
      {existingProjects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>或从历史项目加载</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {existingProjects.map(project => (
                <div
                  key={project.$id}
                  className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 cursor-pointer"
                  onClick={() => loadProject(project.$id)}
                >
                  <span>📁 {project.name}</span>
                  <span className="text-sm text-gray-500">{formatDate(project.$createdAt)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 底部按钮 */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => router.push('/')}>取消</Button>
        <Button onClick={handleNext}>下一步：业务场景定义 →</Button>
      </div>
    </div>
  );
}
```

---

## 2.3 Step 1: 业务场景定义（重设计）

### 当前POC问题
- 只有简单的国家/渠道选择
- 没有利用19国数据库，国家列表是硬编码的
- 缺少产品基本参数（重量、包装等）

### MVP 2.0设计

**界面结构：**
```
┌─────────────────────────────────────────────────────┐
│  Step 1: 业务场景定义                                │
├─────────────────────────────────────────────────────┤
│                                                       │
│  产品基本参数                                        │
│  ┌─────────────────────────────────────────────┐    │
│  │ 产品名称: 益家之宠天然无谷狗粮 2kg          │    │
│  │ 产品重量: [2.0] kg                           │    │
│  │ 商品成本(COGS): [$10.00] USD/单位            │    │
│  │ 目标零售价: [$25.00] USD/单位                │    │
│  │ 预计月销量: [1000] 单位                      │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
│  目标市场选择 *                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │ [搜索国家...]                                │    │
│  │                                              │    │
│  │ 北美洲                                       │    │
│  │  🇺🇸 美国 United States                     │    │
│  │  🇨🇦 加拿大 Canada                          │    │
│  │  🇲🇽 墨西哥 Mexico                          │    │
│  │                                              │    │
│  │ 欧洲                                         │    │
│  │  🇩🇪 德国 Germany                           │    │
│  │  🇬🇧 英国 United Kingdom                    │    │
│  │  🇫🇷 法国 France                            │    │
│  │                                              │    │
│  │ 亚洲                                         │    │
│  │  🇸🇬 新加坡 Singapore                       │    │
│  │  🇻🇳 越南 Vietnam                           │    │
│  │  🇹🇭 泰国 Thailand                          │    │
│  │  ... (共19国)                                │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
│  已选择: 🇺🇸 美国 United States                      │
│  ┌─────────────────────────────────────────────┐    │
│  │  数据可用性:                                 │    │
│  │  • M1 市场准入: ✅ (Tier 2)                  │    │
│  │  • M4 关税税费: ✅ (Tier 1)                  │    │
│  │  • M5 物流配送: ✅ (Tier 2)                  │    │
│  │  • M7 平台佣金: ✅ (Tier 1)                  │    │
│  │  • 其他模块: ✅                              │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
│  销售渠道 *                                          │
│  ○ 独立站 (Shopify + Stripe)                         │
│  ○ 亚马逊 (FBA)                                      │
│  ○ TikTok Shop                                       │
│  ○ 其他平台                                          │
│                                                       │
│  跨境模式 *                                          │
│  ○ 直邮 (Direct Mail)                                │
│  ○ 海外仓 (Overseas Warehouse)                       │
│  ○ FBA (Fulfillment by Amazon)                       │
│                                                       │
│  [← 上一步] [下一步：成本参数配置 →]                  │
└─────────────────────────────────────────────────────┘
```

**核心功能：19国动态加载**

```typescript
// components/wizard/Step1Scope.tsx
interface Step1State {
  productName: string;
  productWeightKg: number;
  cogsUsd: number;
  sellingPriceUsd: number;
  monthlyVolume: number;
  targetCountry: string; // 国家代码，如"US"
  salesChannel: 'shopify' | 'amazon' | 'tiktok' | 'other';
  crossBorderMode: 'direct_mail' | 'overseas_warehouse' | 'fba';
}

export function Step1Scope() {
  const [state, setState] = useState<Step1State>({...});
  const [countries, setCountries] = useState<CostFactor[]>([]);
  const [selectedCountryData, setSelectedCountryData] = useState<CostFactor | null>(null);

  useEffect(() => {
    // 从cost_factors表加载19国数据
    loadCountries();
  }, []);

  const loadCountries = async () => {
    const result = await databases.listDocuments(
      DATABASE_ID,
      'cost_factors',
      [
        Query.equal('industry', wizardState.industry),
        Query.equal('version', '2025Q1'), // 当前版本
        Query.orderAsc('country_name_cn')
      ]
    );
    setCountries(result.documents as CostFactor[]);
  };

  const handleCountrySelect = async (countryCode: string) => {
    setState({...state, targetCountry: countryCode});

    // 加载该国家的完整成本因子数据
    const countryData = countries.find(c => c.country === countryCode);
    setSelectedCountryData(countryData);

    // 存储到向导状态（供Step 2使用）
    wizardState.costFactorData = countryData;
  };

  return (
    <div className="space-y-6">
      <h2>Step 1: 业务场景定义</h2>

      {/* 产品基本参数 */}
      <Card>
        <CardHeader><CardTitle>产品基本参数</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>产品名称</Label>
              <Input value={state.productName} onChange={...} />
            </div>
            <div>
              <Label>产品重量 (kg)</Label>
              <Input type="number" value={state.productWeightKg} onChange={...} />
            </div>
            <div>
              <Label>商品成本(COGS) USD/单位</Label>
              <Input type="number" value={state.cogsUsd} onChange={...} />
            </div>
            <div>
              <Label>目标零售价 USD/单位</Label>
              <Input type="number" value={state.sellingPriceUsd} onChange={...} />
            </div>
            <div>
              <Label>预计月销量 (单位)</Label>
              <Input type="number" value={state.monthlyVolume} onChange={...} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 目标市场选择（19国） */}
      <Card>
        <CardHeader><CardTitle>目标市场选择</CardTitle></CardHeader>
        <CardContent>
          <CountrySelector
            countries={countries}
            selectedCountry={state.targetCountry}
            onSelect={handleCountrySelect}
          />

          {/* 数据可用性提示 */}
          {selectedCountryData && (
            <Alert className="mt-4">
              <AlertTitle>✅ 该国家数据完整</AlertTitle>
              <AlertDescription>
                <ul className="space-y-1 text-sm">
                  <li>• M1 市场准入: {selectedCountryData.m1_complexity}
                    <Badge variant={getTierVariant(selectedCountryData.m1_data_source)}>
                      {selectedCountryData.m1_data_source}
                    </Badge>
                  </li>
                  <li>• M4 关税: {(selectedCountryData.m4_effective_tariff_rate * 100).toFixed(1)}%
                    <Badge variant="success">{selectedCountryData.m4_tariff_data_source}</Badge>
                  </li>
                  <li>• M4 VAT: {(selectedCountryData.m4_vat_rate * 100).toFixed(1)}%
                    <Badge variant="success">{selectedCountryData.m4_vat_data_source}</Badge>
                  </li>
                  <li>• M5 配送费: ${selectedCountryData.m5_last_mile_delivery_usd}
                    <Badge>{selectedCountryData.m5_data_source}</Badge>
                  </li>
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* 销售渠道和跨境模式 */}
      <Card>
        <CardHeader><CardTitle>销售渠道与跨境模式</CardTitle></CardHeader>
        <CardContent>
          {/* RadioGroup for salesChannel and crossBorderMode */}
        </CardContent>
      </Card>

      {/* 底部导航 */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={goToPrevStep}>← 上一步</Button>
        <Button onClick={handleNext}>下一步：成本参数配置 →</Button>
      </div>
    </div>
  );
}
```

**CountrySelector组件：**
```typescript
// components/CountrySelector.tsx
interface CountrySelectorProps {
  countries: CostFactor[];
  selectedCountry: string;
  onSelect: (countryCode: string) => void;
}

export function CountrySelector({ countries, selectedCountry, onSelect }: CountrySelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // 按大洲分组
  const grouped = {
    '北美洲': countries.filter(c => ['US', 'CA', 'MX'].includes(c.country)),
    '欧洲': countries.filter(c => ['DE', 'GB', 'FR'].includes(c.country)),
    '亚洲': countries.filter(c => ['SG', 'VN', 'TH', 'MY', 'PH', 'ID', 'IN', 'JP', 'KR'].includes(c.country)),
    '大洋洲': countries.filter(c => ['AU'].includes(c.country)),
    '中东': countries.filter(c => ['SA', 'AE'].includes(c.country)),
    '南美洲': countries.filter(c => ['BR'].includes(c.country)),
  };

  // 搜索过滤
  const filtered = searchTerm
    ? countries.filter(c =>
        c.country_name_cn.includes(searchTerm) ||
        c.country.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : null;

  return (
    <div className="space-y-4">
      {/* 搜索框 */}
      <Input
        placeholder="搜索国家..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* 国家列表（分组或搜索结果） */}
      <ScrollArea className="h-64 border rounded p-4">
        {filtered ? (
          // 搜索结果
          <div className="space-y-2">
            {filtered.map(country => (
              <CountryItem
                key={country.country}
                country={country}
                isSelected={country.country === selectedCountry}
                onClick={() => onSelect(country.country)}
              />
            ))}
          </div>
        ) : (
          // 按大洲分组
          <div className="space-y-4">
            {Object.entries(grouped).map(([continent, items]) => (
              <div key={continent}>
                <h4 className="font-semibold text-sm text-gray-600 mb-2">{continent}</h4>
                <div className="space-y-1">
                  {items.map(country => (
                    <CountryItem
                      key={country.country}
                      country={country}
                      isSelected={country.country === selectedCountry}
                      onClick={() => onSelect(country.country)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

function CountryItem({ country, isSelected, onClick }: {...}) {
  return (
    <div
      className={`flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-gray-50 ${
        isSelected ? 'bg-blue-50 border-blue-300' : ''
      }`}
      onClick={onClick}
    >
      <span className="text-2xl">{country.country_flag}</span>
      <span className="font-medium">{country.country_name_cn}</span>
      <span className="text-sm text-gray-500">{country.country}</span>
      {isSelected && <CheckCircle className="ml-auto text-blue-500" />}
    </div>
  );
}
```

---

## 2.4 Step 2: 成本参数配置（完整M1-M8展示）⭐核心

### 当前POC的致命问题

**当前POC的Step 2界面**：
```
商品成本(COGS): [输入框]
目标零售价: [输入框]
预计月销量: [输入框]
```
仅3个字段，完全看不到GECOM方法论！

### MVP 2.0核心设计：完整M1-M8模块展示

**设计思路**：
1. **双阶段分组**：CAPEX（M1-M3）和OPEX（M4-M8）清晰分离
2. **可折叠面板**：每个模块可展开查看详细参数
3. **三种数据状态**：
   - 🟢 系统预设（只读，灰色背景）
   - 🟡 可自定义（点击"自定义"按钮解锁）
   - 🔵 已自定义（用户修改后，显示蓝色标识）
4. **数据溯源可视化**：每个参数显示Tier 1/2/3徽章
5. **实时计算预览**：修改任何参数时，右侧实时显示成本影响

**界面结构**：

```
┌────────────────────────────────────────────────────────────────────┐
│  Step 2: 成本参数配置                                              │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  【快速模式】○ 使用全部预设  ●【专家模式】逐项自定义               │
│                                                                      │
│  目标市场: 🇺🇸 美国 | 数据版本: 2025Q1                              │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  阶段 0-1: CAPEX（一次性启动成本）                            │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │                                                                │ │
│  │  ▼ M1: 市场准入（Market Entry）                                │ │
│  │  ┌────────────────────────────────────────────────────────┐  │ │
│  │  │ 监管机构: FDA, APHIS [Tier 2] [只读]                   │  │ │
│  │  │ 合规复杂度: 高 [Tier 2] [只读]                         │  │ │
│  │  │                                                          │  │ │
│  │  │ 预估准入成本: [$5,000] USD   [自定义]                  │  │ │
│  │  │   说明: 包括公司注册、法务咨询、税务登记               │  │ │
│  │  └────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  ▼ M2: 技术合规（Technical Compliance）                       │ │
│  │  ┌────────────────────────────────────────────────────────┐  │ │
│  │  │ 认证要求: AAFCO认证、FDA合规 [Tier 2] [只读]          │  │ │
│  │  │                                                          │  │ │
│  │  │ 预估认证成本: [$3,000] USD   [自定义]                  │  │ │
│  │  │   说明: 产品检测、认证申请费用                         │  │ │
│  │  └────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  ▼ M3: 供应链搭建（Supply Chain Setup）                       │ │
│  │  ┌────────────────────────────────────────────────────────┐  │ │
│  │  │ 包装本地化费率: 2.0% [Tier 2] [只读]                   │  │ │
│  │  │   计算: $25.00 × 2% = $0.50/单位                       │  │ │
│  │  │                                                          │  │ │
│  │  │ 初始库存投资: [$10,000] USD   [自定义]                 │  │ │
│  │  │ 仓储押金: [$5,000] USD   [自定义]                      │  │ │
│  │  └────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  💰 CAPEX小计: $23,000 USD                                    │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  阶段 1-N: OPEX（单位运营成本）                               │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │                                                                │ │
│  │  ▼ M4: 货物税费（Goods & Tax）                                │ │
│  │  ┌────────────────────────────────────────────────────────┐  │ │
│  │  │ 📦 商品成本 (COGS)                                      │  │ │
│  │  │    [$10.00] USD/单位   [用户输入]                       │  │ │
│  │  │                                                          │  │ │
│  │  │ 🚢 头程物流                                             │  │ │
│  │  │    运输方式: ○ 海运  ● 空运                            │  │ │
│  │  │    空运费率: $4.5/kg [Tier 2] [只读]                   │  │ │
│  │  │    产品重量: 2.0 kg                                     │  │ │
│  │  │    计算: $4.5 × 2.0 = $9.00/单位                       │  │ │
│  │  │                                                          │  │ │
│  │  │ 💰 进口关税                                             │  │ │
│  │  │    关税税率: 55.0% [Tier 1] [只读] [⚠️ 异常高]         │  │ │
│  │  │    备注: 10%互惠关税 + 25% Section 301 + 20%附加       │  │ │
│  │  │    计算: $10.00 × 55% = $5.50/单位                     │  │ │
│  │  │    [🔧 自定义] ← 点击可覆盖（如FTA优惠）               │  │ │
│  │  │                                                          │  │ │
│  │  │ 📊 增值税 (VAT)                                         │  │ │
│  │  │    VAT税率: 6.0% [Tier 1] [只读]                       │  │ │
│  │  │    备注: 州税差异，范围0-10%+                          │  │ │
│  │  │    计算: ($10 + $9 + $5.5) × 6% = $1.47/单位           │  │ │
│  │  │                                                          │  │ │
│  │  │ M4小计: $25.97/单位                                     │  │ │
│  │  └────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  ▼ M5: 物流配送（Logistics & Delivery）                       │ │
│  │  ┌────────────────────────────────────────────────────────┐  │ │
│  │  │ 🚚 尾程配送费 (如FBA)                                   │  │ │
│  │  │    配送费: $7.50/单位 [Tier 2] [只读]                  │  │ │
│  │  │                                                          │  │ │
│  │  │ ↩️ 逆向物流成本                                         │  │ │
│  │  │    退货率: 10.0% [Tier 2] [只读]                       │  │ │
│  │  │    退货处理成本率: 30.0% [Tier 2] [只读]               │  │ │
│  │  │    计算: $25.00 × 30% × 10% = $0.75/单位               │  │ │
│  │  │                                                          │  │ │
│  │  │ M5小计: $8.25/单位                                      │  │ │
│  │  └────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  ▼ M6: 营销获客（Marketing & Acquisition）                    │ │
│  │  ┌────────────────────────────────────────────────────────┐  │ │
│  │  │ 📢 营销费率                                             │  │ │
│  │  │    费率: 15.0% [Tier 2] [只读]                         │  │ │
│  │  │    说明: ACOS 20-40%, ACOAS 15-20%行业均值             │  │ │
│  │  │    计算: $25.00 × 15% = $3.75/单位                     │  │ │
│  │  │    [🔧 自定义] ← 可根据实际CAC调整                     │  │ │
│  │  └────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  ▼ M7: 支付手续费（Payment Processing）                       │ │
│  │  ┌────────────────────────────────────────────────────────┐  │ │
│  │  │ 💳 支付网关费用                                         │  │ │
│  │  │    费率: 2.9% + $0.30 [Tier 1] [只读]                  │  │ │
│  │  │    说明: Stripe/PayPal标准费率                         │  │ │
│  │  │    计算: $25.00 × 2.9% + $0.30 = $1.03/单位            │  │ │
│  │  │                                                          │  │ │
│  │  │ 🏪 平台佣金                                             │  │ │
│  │  │    佣金率: 15.0% [Tier 1] [只读]                       │  │ │
│  │  │    说明: 美国/加拿大/欧洲标准佣金                      │  │ │
│  │  │    计算: $25.00 × 15% = $3.75/单位                     │  │ │
│  │  │                                                          │  │ │
│  │  │ M7小计: $4.78/单位                                      │  │ │
│  │  └────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  ▼ M8: 运营管理（Operations & Management）                    │ │
│  │  ┌────────────────────────────────────────────────────────┐  │ │
│  │  │ 👥 本地人力与行政 (G&A)                                 │  │ │
│  │  │    费率: 3.0% [Tier 2] [只读]                          │  │ │
│  │  │    说明: 本地客服等运营人员成本                        │  │ │
│  │  │    计算: $25.00 × 3% = $0.75/单位                      │  │ │
│  │  └────────────────────────────────────────────────────────┘  │ │
│  │                                                                │ │
│  │  💰 OPEX小计: $43.50/单位                                     │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  📊 成本预览（实时计算）                                      │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │  单位收入: $25.00                                             │ │
│  │  单位成本: $43.50                                             │ │
│  │  单位毛利: -$18.50  ❌ 亏损                                   │ │
│  │  毛利率: -74.0%     ⚠️ 严重亏损                              │ │
│  │                                                                 │ │
│  │  建议: 当前定价下该市场不可行，建议：                          │ │
│  │  1. 提高零售价至 $73+ 实现盈亏平衡                             │ │
│  │  2. 选择低成本市场（如越南/泰国）                              │ │
│  │  3. 优化物流方式（空运改海运可节省$9/单位）                    │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  [← 上一步] [保存草稿] [下一步：查看结果 →]                        │
└────────────────────────────────────────────────────────────────────┘
```

### 核心功能实现

#### 功能1：智能预填系统

```typescript
// components/wizard/Step2CostParams.tsx
interface CostParamsState {
  // 从cost_factors预填的值
  presetValues: CostFactor;

  // 用户覆盖的值
  userOverrides: Partial<CostFactor>;

  // 各模块的展开状态
  expandedModules: {
    m1: boolean;
    m2: boolean;
    m3: boolean;
    m4: boolean;
    m5: boolean;
    m6: boolean;
    m7: boolean;
    m8: boolean;
  };

  // 快速模式 vs 专家模式
  mode: 'quick' | 'expert';
}

export function Step2CostParams() {
  const [state, setState] = useState<CostParamsState>({
    presetValues: wizardState.costFactorData, // 从Step 1传入
    userOverrides: {},
    expandedModules: {
      m1: false, m2: false, m3: false,
      m4: true,  // 默认展开M4（最重要）
      m5: false, m6: false, m7: false, m8: false
    },
    mode: 'quick'
  });

  // 获取有效值（用户覆盖 > 系统预设）
  const getEffectiveValue = (field: keyof CostFactor) => {
    return state.userOverrides[field] ?? state.presetValues[field];
  };

  // 实时计算成本结果
  const [costPreview, setCostPreview] = useState<CostResult | null>(null);

  useEffect(() => {
    // 每次参数变化时重新计算
    const result = calculateCostPreview();
    setCostPreview(result);
  }, [state.userOverrides, wizardState.scope]);

  const calculateCostPreview = (): CostResult => {
    const scope = wizardState.scope;
    const cogsUsd = scope.cogsUsd;
    const sellingPriceUsd = scope.sellingPriceUsd;
    const productWeightKg = scope.productWeightKg;
    const shippingMethod = scope.opex.shippingMethod;

    // M4计算
    const logistics = JSON.parse(getEffectiveValue('m4_logistics')) as M4Logistics;
    const logisticsCost = shippingMethod === 'sea'
      ? logistics.sea_freight.usd_per_kg * productWeightKg
      : logistics.air_freight.usd_per_kg * productWeightKg;

    const tariffRate = getEffectiveValue('m4_effective_tariff_rate');
    const tariffCost = cogsUsd * tariffRate;

    const vatRate = getEffectiveValue('m4_vat_rate');
    const vatCost = (cogsUsd + logisticsCost + tariffCost) * vatRate;

    const m4Total = cogsUsd + logisticsCost + tariffCost + vatCost;

    // M5计算
    const lastMileDelivery = getEffectiveValue('m5_last_mile_delivery_usd');
    const returnCost = sellingPriceUsd * getEffectiveValue('m5_return_cost_rate') * getEffectiveValue('m5_return_rate');
    const m5Total = lastMileDelivery + returnCost;

    // M6计算
    const marketingCost = sellingPriceUsd * getEffectiveValue('m6_marketing_rate');

    // M7计算
    const paymentGateway = sellingPriceUsd * getEffectiveValue('m7_payment_rate') + getEffectiveValue('m7_payment_fixed_usd');
    const platformCommission = sellingPriceUsd * getEffectiveValue('m7_platform_commission_rate');
    const m7Total = paymentGateway + platformCommission;

    // M8计算
    const gaCost = sellingPriceUsd * getEffectiveValue('m8_ga_rate');

    const opexTotal = m4Total + m5Total + marketingCost + m7Total + gaCost;

    // 单位经济模型
    const grossProfit = sellingPriceUsd - opexTotal;
    const grossMargin = (grossProfit / sellingPriceUsd) * 100;

    return {
      opex: {
        m4_cogs: cogsUsd,
        m4_tariff: tariffCost,
        m4_logistics: logisticsCost,
        m4_vat: vatCost,
        m5_last_mile: lastMileDelivery,
        m5_return: returnCost,
        m6_marketing: marketingCost,
        m7_payment: paymentGateway,
        m7_platform_commission: platformCommission,
        m8_ga: gaCost,
        total: opexTotal
      },
      unit_economics: {
        revenue: sellingPriceUsd,
        cost: opexTotal,
        gross_profit: grossProfit,
        gross_margin: grossMargin
      },
      // ... 其他KPI
    } as CostResult;
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* 左侧2/3：参数配置 */}
      <div className="col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h2>Step 2: 成本参数配置</h2>

          {/* 模式切换 */}
          <Tabs value={state.mode} onValueChange={(v) => setState({...state, mode: v as 'quick' | 'expert'})}>
            <TabsList>
              <TabsTrigger value="quick">快速模式</TabsTrigger>
              <TabsTrigger value="expert">专家模式</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* CAPEX */}
        <Card>
          <CardHeader>
            <CardTitle>阶段 0-1: CAPEX（一次性启动成本）</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* M1 */}
            <M1Module
              presetData={state.presetValues}
              userOverrides={state.userOverrides}
              expanded={state.expandedModules.m1}
              onToggle={() => toggleModule('m1')}
              onOverride={(field, value) => handleOverride(field, value)}
              mode={state.mode}
            />

            {/* M2, M3 类似 */}
          </CardContent>
        </Card>

        {/* OPEX */}
        <Card>
          <CardHeader>
            <CardTitle>阶段 1-N: OPEX（单位运营成本）</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* M4 */}
            <M4Module
              presetData={state.presetValues}
              userOverrides={state.userOverrides}
              scope={wizardState.scope}
              expanded={state.expandedModules.m4}
              onToggle={() => toggleModule('m4')}
              onOverride={(field, value) => handleOverride(field, value)}
              mode={state.mode}
            />

            {/* M5-M8 类似 */}
          </CardContent>
        </Card>
      </div>

      {/* 右侧1/3：实时成本预览 */}
      <div className="col-span-1">
        <div className="sticky top-4">
          <Card>
            <CardHeader>
              <CardTitle>📊 成本预览</CardTitle>
            </CardHeader>
            <CardContent>
              {costPreview && (
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600">单位收入</div>
                    <div className="text-2xl font-bold">${costPreview.unit_economics.revenue.toFixed(2)}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600">单位成本</div>
                    <div className="text-2xl font-bold">${costPreview.unit_economics.cost.toFixed(2)}</div>
                  </div>

                  <Separator />

                  <div>
                    <div className="text-sm text-gray-600">单位毛利</div>
                    <div className={`text-3xl font-bold ${costPreview.unit_economics.gross_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${costPreview.unit_economics.gross_profit.toFixed(2)}
                      {costPreview.unit_economics.gross_profit < 0 && ' ❌ 亏损'}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600">毛利率</div>
                    <div className={`text-2xl font-bold ${costPreview.unit_economics.gross_margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {costPreview.unit_economics.gross_margin.toFixed(1)}%
                      {costPreview.unit_economics.gross_margin < -50 && ' ⚠️ 严重亏损'}
                    </div>
                  </div>

                  {/* 智能建议 */}
                  {costPreview.unit_economics.gross_margin < 0 && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>建议</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          <li>提高零售价至 ${(costPreview.unit_economics.cost / 0.7).toFixed(2)}+ 实现30%毛利</li>
                          <li>选择低成本市场（如越南/泰国）</li>
                          <li>优化物流方式（空运改海运可节省成本）</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

#### 功能2：M4模块组件（示例）

```typescript
// components/wizard/modules/M4Module.tsx
interface M4ModuleProps {
  presetData: CostFactor;
  userOverrides: Partial<CostFactor>;
  scope: CalculationScope;
  expanded: boolean;
  onToggle: () => void;
  onOverride: (field: keyof CostFactor, value: any) => void;
  mode: 'quick' | 'expert';
}

export function M4Module({ presetData, userOverrides, scope, expanded, onToggle, onOverride, mode }: M4ModuleProps) {
  const effectiveTariffRate = userOverrides.m4_effective_tariff_rate ?? presetData.m4_effective_tariff_rate;
  const effectiveVatRate = userOverrides.m4_vat_rate ?? presetData.m4_vat_rate;
  const logistics = JSON.parse(presetData.m4_logistics) as M4Logistics;

  const isCustomized = (field: keyof CostFactor) => field in userOverrides;

  return (
    <div className="border rounded-lg">
      {/* 模块标题 */}
      <button
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-2">
          <ChevronDown className={`transform transition-transform ${expanded ? '' : '-rotate-90'}`} />
          <h3 className="font-semibold">M4: 货物税费（Goods & Tax）</h3>
        </div>
        <div className="text-sm text-gray-600">
          小计: ${calculateM4Total().toFixed(2)}/单位
        </div>
      </button>

      {/* 模块内容 */}
      {expanded && (
        <div className="p-4 space-y-4 border-t">
          {/* COGS */}
          <div>
            <Label>📦 商品成本 (COGS)</Label>
            <Input
              type="number"
              value={scope.cogsUsd}
              onChange={(e) => {/* 更新scope */}}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">从Step 1带入，可修改</p>
          </div>

          {/* 头程物流 */}
          <div>
            <Label>🚢 头程物流</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center space-x-4">
                <Label>运输方式:</Label>
                <RadioGroup value={scope.opex.shippingMethod} onValueChange={...}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sea" id="sea" />
                    <Label htmlFor="sea">海运 (${logistics.sea_freight.usd_per_kg}/kg)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="air" id="air" />
                    <Label htmlFor="air">空运 (${logistics.air_freight.usd_per_kg}/kg)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="bg-gray-50 p-3 rounded text-sm">
                <div className="flex justify-between">
                  <span>费率:</span>
                  <span className="font-medium">
                    ${scope.opex.shippingMethod === 'sea' ? logistics.sea_freight.usd_per_kg : logistics.air_freight.usd_per_kg}/kg
                    <Badge variant="secondary" className="ml-2">
                      {scope.opex.shippingMethod === 'sea' ? logistics.sea_freight.data_source : logistics.air_freight.data_source}
                    </Badge>
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>产品重量:</span>
                  <span className="font-medium">{scope.productWeightKg} kg</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>计算结果:</span>
                  <span>${calculateLogisticsCost().toFixed(2)}/单位</span>
                </div>
              </div>
            </div>
          </div>

          {/* 进口关税 */}
          <div>
            <div className="flex items-center justify-between">
              <Label>💰 进口关税</Label>
              {!isCustomized('m4_effective_tariff_rate') && mode === 'expert' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {/* 进入自定义模式 */}}
                >
                  🔧 自定义
                </Button>
              )}
            </div>

            <div className="mt-2 bg-gray-50 p-3 rounded">
              <div className="flex items-center justify-between">
                <span className="text-sm">关税税率:</span>
                <div className="flex items-center space-x-2">
                  {isCustomized('m4_effective_tariff_rate') ? (
                    <Input
                      type="number"
                      value={effectiveTariffRate * 100}
                      onChange={(e) => onOverride('m4_effective_tariff_rate', parseFloat(e.target.value) / 100)}
                      className="w-24"
                      step="0.1"
                    />
                  ) : (
                    <span className="font-medium">{(effectiveTariffRate * 100).toFixed(1)}%</span>
                  )}
                  <Badge variant={getTierVariant(presetData.m4_tariff_data_source)}>
                    {presetData.m4_tariff_data_source}
                  </Badge>
                  {effectiveTariffRate > 0.3 && (
                    <Badge variant="warning">⚠️ 异常高</Badge>
                  )}
                  {isCustomized('m4_effective_tariff_rate') && (
                    <Badge variant="info">已自定义</Badge>
                  )}
                </div>
              </div>

              {presetData.m4_tariff_notes && (
                <div className="text-xs text-gray-600 mt-2">
                  备注: {presetData.m4_tariff_notes}
                </div>
              )}

              <Separator className="my-2" />
              <div className="flex justify-between text-sm font-semibold">
                <span>计算结果:</span>
                <span>${(scope.cogsUsd * effectiveTariffRate).toFixed(2)}/单位</span>
              </div>
            </div>
          </div>

          {/* VAT */}
          <div>
            <Label>📊 增值税 (VAT/GST)</Label>
            <div className="mt-2 bg-gray-50 p-3 rounded">
              <div className="flex items-center justify-between">
                <span className="text-sm">VAT税率:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{(effectiveVatRate * 100).toFixed(1)}%</span>
                  <Badge variant="success">{presetData.m4_vat_data_source}</Badge>
                </div>
              </div>

              {presetData.m4_vat_notes && (
                <div className="text-xs text-gray-600 mt-2">
                  备注: {presetData.m4_vat_notes}
                </div>
              )}

              <div className="text-xs text-gray-600 mt-2">
                计算公式: (COGS + 物流 + 关税) × VAT税率
              </div>

              <Separator className="my-2" />
              <div className="flex justify-between text-sm font-semibold">
                <span>计算结果:</span>
                <span>${calculateVatCost().toFixed(2)}/单位</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 2.5 Step 3: 成本建模结果（增强可视化）

### MVP 2.0增强设计

**当前POC**：简单的饼图和柱状图
**MVP 2.0**：多维度可视化 + AI洞察

**界面结构**：

```typescript
export function Step3CostModeling() {
  const costResult = wizardState.costResult;

  return (
    <div className="space-y-6">
      <h2>Step 3: 成本建模结果</h2>

      {/* 关键KPI卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">单位毛利</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${costResult.unit_economics.gross_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${costResult.unit_economics.gross_profit.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              收入 ${costResult.unit_economics.revenue} - 成本 ${costResult.unit_economics.cost}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">毛利率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${costResult.unit_economics.gross_margin >= 30 ? 'text-green-600' : costResult.unit_economics.gross_margin >= 0 ? 'text-yellow-600' : 'text-red-600'}`}>
              {costResult.unit_economics.gross_margin.toFixed(1)}%
            </div>
            <Progress value={Math.max(0, costResult.unit_economics.gross_margin)} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{costResult.kpis.roi.toFixed(1)}%</div>
            <p className="text-xs text-gray-500 mt-1">投资回报率（年化）</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">回本周期</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{costResult.kpis.payback_period_months.toFixed(1)}</div>
            <p className="text-xs text-gray-500 mt-1">月</p>
          </CardContent>
        </Card>
      </div>

      {/* 成本分布可视化 */}
      <div className="grid grid-cols-2 gap-6">
        {/* 饼图 */}
        <Card>
          <CardHeader>
            <CardTitle>成本分布（按模块）</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costResult.cost_breakdown}
                  dataKey="amount"
                  nameKey="module"
                  cx="50%"
                  cy="50%"
                  label={(entry) => `${entry.module}: ${entry.percentage.toFixed(1)}%`}
                >
                  {costResult.cost_breakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 柱状图 */}
        <Card>
          <CardHeader>
            <CardTitle>成本明细（USD/单位）</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costResult.cost_breakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="module" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 盈亏平衡分析 */}
      <Card>
        <CardHeader>
          <CardTitle>盈亏平衡分析</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">盈亏平衡价格</h4>
              <div className="text-2xl font-bold text-blue-600">
                ${costResult.kpis.breakeven_price.toFixed(2)}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                在当前成本结构下，零售价需达到此价格才能盈亏平衡
              </p>
              {wizardState.scope.sellingPriceUsd < costResult.kpis.breakeven_price && (
                <Alert variant="warning" className="mt-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    当前定价 ${wizardState.scope.sellingPriceUsd} 低于盈亏平衡价格，建议提价或降低成本
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div>
              <h4 className="font-semibold mb-2">盈亏平衡销量</h4>
              <div className="text-2xl font-bold text-blue-600">
                {costResult.kpis.breakeven_volume.toFixed(0)} 单位/月
              </div>
              <p className="text-sm text-gray-600 mt-1">
                覆盖CAPEX所需的最低月销量
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 底部导航 */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={goToPrevStep}>← 返回修改参数</Button>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleSaveCalculation}>💾 保存计算</Button>
          <Button onClick={goToNextStep}>下一步：场景对比 →</Button>
        </div>
      </div>
    </div>
  );
}
```

---

## 2.6 Step 4: 多场景对比分析（19国对比）

### 设计思路

**核心价值**：利用19国真实数据，快速对比不同市场/渠道的成本结构，找到最优市场。

**功能设计**：

```typescript
export function Step4Comparison() {
  const [comparisonScenarios, setComparisonScenarios] = useState<string[]>([
    wizardState.scope.targetCountry, // 当前国家
  ]);

  const [comparisonResults, setComparisonResults] = useState<Map<string, CostResult>>(new Map());

  const addScenario = (countryCode: string) => {
    if (comparisonScenarios.length >= 5) {
      alert('最多对比5个场景');
      return;
    }
    setComparisonScenarios([...comparisonScenarios, countryCode]);
  };

  useEffect(() => {
    // 为每个场景计算成本结果
    const results = new Map();
    for (const country of comparisonScenarios) {
      const result = calculateCostForCountry(country);
      results.set(country, result);
    }
    setComparisonResults(results);
  }, [comparisonScenarios]);

  return (
    <div className="space-y-6">
      <h2>Step 4: 多场景对比分析</h2>

      {/* 场景选择器 */}
      <Card>
        <CardHeader>
          <CardTitle>选择对比场景</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {comparisonScenarios.map((country) => (
              <Badge key={country} variant="secondary" className="text-lg py-2 px-4">
                {getCountryFlag(country)} {getCountryName(country)}
                <X className="ml-2 h-4 w-4 cursor-pointer" onClick={() => removeScenario(country)} />
              </Badge>
            ))}

            {comparisonScenarios.length < 5 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">+ 添加场景</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <CountrySelector
                    countries={allCountries}
                    selectedCountry={null}
                    onSelect={(country) => {
                      addScenario(country);
                      closePopover();
                    }}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 对比表格 */}
      <Card>
        <CardHeader>
          <CardTitle>成本对比表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>指标</TableHead>
                {comparisonScenarios.map((country) => (
                  <TableHead key={country} className="text-center">
                    {getCountryFlag(country)} {getCountryName(country)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* 关税 */}
              <TableRow>
                <TableCell className="font-medium">关税税率</TableCell>
                {comparisonScenarios.map((country) => {
                  const data = getCostFactorData(country);
                  return (
                    <TableCell key={country} className="text-center">
                      {(data.m4_effective_tariff_rate * 100).toFixed(1)}%
                      {data.m4_effective_tariff_rate === Math.min(...comparisonScenarios.map(c => getCostFactorData(c).m4_effective_tariff_rate)) && (
                        <Badge variant="success" className="ml-2">最优</Badge>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>

              {/* VAT */}
              <TableRow>
                <TableCell className="font-medium">VAT/GST</TableCell>
                {comparisonScenarios.map((country) => {
                  const data = getCostFactorData(country);
                  return (
                    <TableCell key={country} className="text-center">
                      {(data.m4_vat_rate * 100).toFixed(1)}%
                    </TableCell>
                  );
                })}
              </TableRow>

              {/* 物流费用 */}
              <TableRow>
                <TableCell className="font-medium">物流费用（空运）</TableCell>
                {comparisonScenarios.map((country) => {
                  const data = getCostFactorData(country);
                  const logistics = JSON.parse(data.m4_logistics) as M4Logistics;
                  const cost = logistics.air_freight.usd_per_kg * wizardState.scope.productWeightKg;
                  return (
                    <TableCell key={country} className="text-center">
                      ${cost.toFixed(2)}
                    </TableCell>
                  );
                })}
              </TableRow>

              {/* 平台佣金 */}
              <TableRow>
                <TableCell className="font-medium">平台佣金率</TableCell>
                {comparisonScenarios.map((country) => {
                  const data = getCostFactorData(country);
                  return (
                    <TableCell key={country} className="text-center">
                      {(data.m7_platform_commission_rate * 100).toFixed(1)}%
                    </TableCell>
                  );
                })}
              </TableRow>

              <TableRow className="bg-gray-50">
                <TableCell colSpan={comparisonScenarios.length + 1}></TableCell>
              </TableRow>

              {/* 单位成本 */}
              <TableRow>
                <TableCell className="font-medium">单位总成本</TableCell>
                {comparisonScenarios.map((country) => {
                  const result = comparisonResults.get(country);
                  return (
                    <TableCell key={country} className="text-center font-semibold">
                      ${result?.unit_economics.cost.toFixed(2)}
                    </TableCell>
                  );
                })}
              </TableRow>

              {/* 毛利率 */}
              <TableRow>
                <TableCell className="font-medium">毛利率</TableCell>
                {comparisonScenarios.map((country) => {
                  const result = comparisonResults.get(country);
                  const margin = result?.unit_economics.gross_margin ?? 0;
                  return (
                    <TableCell key={country} className="text-center">
                      <span className={`font-semibold ${margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {margin.toFixed(1)}%
                      </span>
                      {margin === Math.max(...Array.from(comparisonResults.values()).map(r => r.unit_economics.gross_margin)) && (
                        <Badge variant="success" className="ml-2">最优</Badge>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 可视化对比 */}
      <Card>
        <CardHeader>
          <CardTitle>毛利率对比</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={Array.from(comparisonResults.entries()).map(([country, result]) => ({
              country: getCountryName(country),
              grossMargin: result.unit_economics.gross_margin,
              fill: result.unit_economics.gross_margin >= 0 ? '#10B981' : '#EF4444'
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" />
              <YAxis label={{ value: '毛利率 (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="grossMargin" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 智能推荐 */}
      <Card>
        <CardHeader>
          <CardTitle>💡 智能推荐</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertTitle>基于对比分析，我们的建议：</AlertTitle>
            <AlertDescription>
              <ol className="list-decimal list-inside space-y-2 mt-2">
                <li>
                  <strong>最优市场</strong>: {getBestCountry().name} （毛利率 {getBestCountry().margin.toFixed(1)}%）
                </li>
                <li>
                  <strong>成本最低</strong>: {getLowestCostCountry().name} （单位成本 ${getLowestCostCountry().cost.toFixed(2)}）
                </li>
                <li>
                  <strong>避开市场</strong>: {getWorstCountries().map(c => c.name).join('、')} （毛利率为负）
                </li>
              </ol>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* 底部导航 */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={goToPrevStep}>← 上一步</Button>
        <Button onClick={goToNextStep}>下一步：AI智能助手 →</Button>
      </div>
    </div>
  );
}
```

---

## 2.7 Step 5: AI智能助手（深度集成）

### 当前POC问题

- AI无法访问成本计算结果
- 无法回答"如何优化ROI"等问题
- 没有工具调用能力

### MVP 2.0设计：工具调用集成

```typescript
// lib/deepseek-tools.ts

/**
 * DeepSeek工具定义：成本查询
 */
export const getCostBreakdownTool = {
  type: 'function',
  function: {
    name: 'get_cost_breakdown',
    description: '获取当前项目的成本拆解详情，包括M1-M8各模块的成本明细',
    parameters: {
      type: 'object',
      properties: {
        module: {
          type: 'string',
          enum: ['all', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8'],
          description: '要查询的模块，all表示全部'
        }
      },
      required: []
    }
  }
};

/**
 * DeepSeek工具定义：场景对比
 */
export const compareScenariosTool = {
  type: 'function',
  function: {
    name: 'compare_scenarios',
    description: '对比不同国家或渠道的成本结构，找出差异和最优选择',
    parameters: {
      type: 'object',
      properties: {
        countries: {
          type: 'array',
          items: { type: 'string' },
          description: '要对比的国家代码列表，如["US", "VN", "DE"]'
        },
        metric: {
          type: 'string',
          enum: ['gross_margin', 'total_cost', 'roi', 'tariff_rate'],
          description: '对比的指标'
        }
      },
      required: ['countries']
    }
  }
};

/**
 * DeepSeek工具定义：优化建议
 */
export const getOptimizationSuggestionsTool = {
  type: 'function',
  function: {
    name: 'get_optimization_suggestions',
    description: '基于当前成本结构，生成优化建议（如降低关税、优化物流、调整定价等）',
    parameters: {
      type: 'object',
      properties: {
        focus_area: {
          type: 'string',
          enum: ['pricing', 'logistics', 'market_selection', 'cost_reduction', 'all'],
          description: '优化重点领域'
        }
      },
      required: []
    }
  }
};

// components/wizard/Step5AIAssistant.tsx
export function Step5AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `你好！我是GECOM智能成本助手。我可以帮助你：

1. 📊 分析成本结构和盈利能力
2. 🔍 对比不同市场的成本差异
3. 💡 提供ROI优化建议
4. 🎯 找出成本驱动因素

请问有什么我可以帮助你的？`
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // 调用DeepSeek API with工具调用
      const response = await callDeepSeekWithTools(
        [...messages, userMessage],
        [getCostBreakdownTool, compareScenariosTool, getOptimizationSuggestionsTool]
      );

      // 处理工具调用
      if (response.tool_calls) {
        for (const toolCall of response.tool_calls) {
          const toolResult = await executeToolCall(toolCall);

          // 添加工具调用结果到消息
          setMessages((prev) => [
            ...prev,
            {
              role: 'tool',
              tool_call_id: toolCall.id,
              content: JSON.stringify(toolResult)
            }
          ]);
        }

        // 再次调用AI生成最终回复
        const finalResponse = await callDeepSeekWithTools(messages);
        setMessages((prev) => [...prev, {
          role: 'assistant',
          content: finalResponse.content
        }]);
      } else {
        // 直接添加AI回复
        setMessages((prev) => [...prev, {
          role: 'assistant',
          content: response.content
        }]);
      }
    } catch (error) {
      console.error('AI调用失败:', error);
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: '抱歉，我遇到了一些问题。请稍后再试。'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const executeToolCall = async (toolCall: ToolCall) => {
    const { name, arguments: args } = toolCall.function;

    switch (name) {
      case 'get_cost_breakdown':
        return getCostBreakdown(args.module);

      case 'compare_scenarios':
        return compareScenarios(args.countries, args.metric);

      case 'get_optimization_suggestions':
        return getOptimizationSuggestions(args.focus_area);

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  };

  const getCostBreakdown = (module: string) => {
    const result = wizardState.costResult;

    if (module === 'all') {
      return {
        capex: result.capex,
        opex: result.opex,
        unit_economics: result.unit_economics,
        kpis: result.kpis
      };
    } else {
      // 返回特定模块
      return {
        module,
        cost: result.opex[`${module}_total`] || result.capex[module],
        percentage: result.cost_breakdown.find(item => item.module.startsWith(module.toUpperCase()))?.percentage
      };
    }
  };

  const compareScenarios = async (countries: string[], metric: string) => {
    const results = [];

    for (const country of countries) {
      const costFactor = await databases.getDocument(
        DATABASE_ID,
        'cost_factors',
        Query.equal('country', country)
      );

      const result = calculateCostForCountry(country);

      results.push({
        country,
        country_name: costFactor.country_name_cn,
        [metric]: result[metric] || result.unit_economics[metric]
      });
    }

    return results;
  };

  const getOptimizationSuggestions = (focusArea: string) => {
    const result = wizardState.costResult;
    const suggestions = [];

    if (focusArea === 'pricing' || focusArea === 'all') {
      if (result.unit_economics.gross_margin < 30) {
        suggestions.push({
          area: 'pricing',
          issue: `当前毛利率${result.unit_economics.gross_margin.toFixed(1)}%过低`,
          suggestion: `建议提价至$${result.kpis.breakeven_price.toFixed(2)}以上，目标毛利率30%+`,
          impact: `提价至$${(result.unit_economics.cost / 0.7).toFixed(2)}可实现30%毛利率`
        });
      }
    }

    if (focusArea === 'logistics' || focusArea === 'all') {
      const currentLogistics = result.opex.m4_logistics;
      const seaFreightCost = calculateSeaFreightCost();

      if (currentLogistics > seaFreightCost * 1.5) {
        suggestions.push({
          area: 'logistics',
          issue: `当前使用空运，成本$${currentLogistics.toFixed(2)}/单位`,
          suggestion: `改用海运可降至$${seaFreightCost.toFixed(2)}/单位`,
          impact: `节省$${(currentLogistics - seaFreightCost).toFixed(2)}/单位，提升${((currentLogistics - seaFreightCost) / result.unit_economics.revenue * 100).toFixed(1)}%毛利率`
        });
      }
    }

    if (focusArea === 'market_selection' || focusArea === 'all') {
      const bestMarket = findBestAlternativeMarket();

      if (bestMarket && bestMarket.margin > result.unit_economics.gross_margin + 10) {
        suggestions.push({
          area: 'market_selection',
          issue: `当前市场${wizardState.scope.targetCountry}毛利率${result.unit_economics.gross_margin.toFixed(1)}%`,
          suggestion: `建议切换至${bestMarket.name}市场`,
          impact: `可实现${bestMarket.margin.toFixed(1)}%毛利率，提升${(bestMarket.margin - result.unit_economics.gross_margin).toFixed(1)}个百分点`
        });
      }
    }

    return suggestions;
  };

  return (
    <div className="space-y-6">
      <h2>Step 5: AI智能助手</h2>

      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle>💬 智能成本顾问</CardTitle>
          <CardDescription>
            基于DeepSeek R1/V3，连接真实成本数据，提供专业优化建议
          </CardDescription>
        </CardHeader>

        {/* 聊天消息区域 */}
        <CardContent className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </CardContent>

        {/* 输入区域 */}
        <CardFooter>
          <div className="flex w-full space-x-2">
            <Input
              placeholder="问我任何关于成本优化的问题..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <Button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* 快捷问题 */}
      <Card>
        <CardHeader>
          <CardTitle>💡 快捷问题</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setInputMessage('分析当前成本结构，找出主要成本驱动因素')}>
              分析成本驱动因素
            </Button>
            <Button variant="outline" onClick={() => setInputMessage('对比美国、越南、德国三个市场的成本差异')}>
              对比多个市场
            </Button>
            <Button variant="outline" onClick={() => setInputMessage('如何优化ROI至少达到50%？')}>
              优化ROI建议
            </Button>
            <Button variant="outline" onClick={() => setInputMessage('当前定价下需要多少销量才能盈亏平衡？')}>
              盈亏平衡分析
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 底部导航 */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={goToPrevStep}>← 上一步</Button>
        <Button onClick={handleFinish}>✅ 完成并生成报告</Button>
      </div>
    </div>
  );
}
```

---

**第二部分完成检查点**：
- ✅ Step 0: 项目基本信息（新增独立步骤）
- ✅ Step 1: 业务场景定义（19国动态加载）
- ✅ Step 2: 成本参数配置（完整M1-M8展示）⭐核心
- ✅ Step 3: 成本建模结果（增强可视化）
- ✅ Step 4: 多场景对比分析（19国对比）
- ✅ Step 5: AI智能助手（工具调用集成）

---

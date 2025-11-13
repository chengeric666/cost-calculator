# GECOM数据使用规范文档

**文档版本**: v1.0
**创建日期**: 2025-11-13
**文档类型**: 技术规范（长期维护）
**对应任务**: GECOM-W4-D20P-T2.1
**SSOT链接**: [MVP-2.0-任务清单.md Day 20+ Phase 2](./MVP-2.0-任务清单.md#phase-2-创建数据使用规范文档30min)
**状态**: ✅ 已完成

---

## 📋 文档分层说明

> **重要提示**: 本文档是**第3层规范文档**，属于长期维护的技术规范。关于GECOM项目的文档管理体系，请参考以下分层：

**文档分层体系**:
```
第1层：执行追踪（SSOT）
└─ MVP-2.0-任务清单.md - 唯一真相来源，所有任务的执行状态追踪

第2层：设计分析（参考文档）
├─ DATA-LOADING-ROOT-CAUSE-ANALYSIS-2025-11-13.md - 问题根因分析
├─ ULTRA-THINK-ANALYSIS-2025-11-13.md - 深度技术调研
└─ 其他*-ANALYSIS.md文档

第3层：规范指南（长期文档）⭐ 本文档所在层级
├─ DATA-USAGE-SPECIFICATION.md - 数据使用规范
├─ DATA-COLLECTION-STANDARD.md - 数据采集标准
└─ 其他*-SPECIFICATION.md文档

第4层：临时清单（❌ 禁止创建）
└─ 独立任务追踪文件违反SSOT原则
```

**本文档定位**: 提供GECOM项目中数据导入、使用和管理的标准化规范，防止数据加载错误，确保代码质量和可维护性。

---

## 🎯 规范目的

**核心问题**: 2025-11-13发现Step2DataCollection组件数据加载错误，根本原因是违反了3层数据架构设计理念，导致：
- M1成本项显示0但总计1450（缺失800 USD行业许可费）
- Tier徽章显示"数据库预设"而非真实数据源

**规范目标**:
1. ✅ 明确数据导入的正确模式（完整导入 > 选择性复制）
2. ✅ 防止字段映射错误（统一命名规范）
3. ✅ 确保数据溯源完整（data_source字段100%填充）
4. ✅ 提供可复制的代码示例（静态+动态加载）

---

## 📊 第1章：3层数据架构说明

GECOM项目采用**三层数据架构**设计，确保数据完整性、性能和可扩展性：

### Layer 1: TypeScript源文件（单一真相来源）

```
位置: gecom-assistant/data/cost-factors/
文件模式: 3文件架构（每国×每行业）
├─ XX-base-data.ts          # 35个通用字段（跨行业复用）
├─ XX-{industry}-specific.ts # 55个行业特定字段
└─ XX-{industry}.ts         # 90+个合并字段（完整数据）

特点:
- 字段数: 127字段（P0: 67字段 + P1: 30字段 + P2: 30字段）
- 版本控制: Git
- 数据质量: Tier 1/2/3分级，100%溯源信息
- 用途: 数据源头，开发环境直接导入
```

**3文件架构合并逻辑**:
```typescript
// XX-{industry}.ts标准模板
import { XX_BASE_DATA } from './XX-base-data';
import { XX_{INDUSTRY}_SPECIFIC } from './XX-{industry}-specific';

export const XX_{INDUSTRY}: any = {
  // 基础元数据
  country: 'XX',
  country_name_cn: '国家名称',
  country_flag: '🇽🇽',
  industry: '{industry}',
  version: '2025Q1',

  // 数据溯源
  collected_at: '2025-11-09T10:00:00+08:00',
  collected_by: 'Claude AI + Manual Research',
  verified_at: '2025-11-09T21:00:00+08:00',

  // ⭐ 关键：使用spread operator完整合并
  ...XX_BASE_DATA,           // 35通用字段（优先级低）
  ...XX_{INDUSTRY}_SPECIFIC,  // 55特定字段（优先级高，会覆盖冲突字段）

  // 数据质量摘要
  data_quality_summary: {
    total_fields: 90,
    p0_fields: 67,
    p0_fields_filled: 67,
    tier1_count: 47,
    tier2_count: 41,
    tier3_count: 2,
    confidence_score: 0.88,
  },
};
```

### Layer 2: Appwrite数据库（核心计算）

```
Collection: cost_factors (ID: 690d4fdd0035c2f63f20)
字段: 67个P0核心字段（42%）
覆盖: M1-M8所有必需计算字段
访问: Appwrite SDK (getCostFactor, getCostFactorsByCountries)
用途: 生产环境成本计算，查询性能优化
```

**字段过滤规则**:
- ✅ 包含：所有P0字段（GECOM计算引擎依赖）
- ✅ 包含：数据溯源字段（m*_data_source, m*_tier, m*_collected_at）
- ❌ 排除：P1/P2扩展字段（市场洞察、高级分析）
- ❌ 排除：data_quality_summary（仅TypeScript需要）

### Layer 3: JSON扩展文件（详细数据）

```
位置: gecom-assistant/public/data/{industry}-extended/
文件: XX-{industry}-extended.json
字段: 84个扩展字段（58%）
访问: fetch() HTTP请求
用途: 市场详情页、高级报告、数据洞察
```

**扩展字段示例**:
```json
{
  "country": "US",
  "industry": "vape",
  "extended": {
    "market_summary": "美国电子烟市场规模$127亿...",
    "m1_fda_pmta_usd": 50000000,
    "m1_pmta_approval_rate": 0.01,
    "m6_amazon_banned": true,
    "m6_shopify_restrictions": "需KYC验证...",
    "regulatory_timeline": {...},
    "competitive_landscape": {...}
  }
}
```

### 三层架构数据流

```
开发环境（快速迭代）:
Component → import VN_PET_FOOD (Layer 1) → 完整127字段

生产环境（性能优化）:
Component → loadCostFactor('VN', 'pet_food', { includeExtended: false })
           → Appwrite查询 (Layer 2) → 67核心字段 → 成本计算

高级功能（完整数据）:
Component → loadCostFactor('VN', 'pet_food', { includeExtended: true })
           → Appwrite查询 (Layer 2) + fetch JSON (Layer 3)
           → 67核心 + 84扩展 = 151字段 → 市场详情展示
```

---

## 🔧 第2章：数据导入规范（4个核心规范）

### 规范1: 导入merged文件优于base文件（⭐ 强制）

**错误做法**❌:
```typescript
// 只导入base文件，缺失55个行业特定字段
import { VN_BASE_DATA } from '@/data/cost-factors/VN-base-data';
const costFactor = { ...VN_BASE_DATA };
// 结果：缺少m4_hs_code, m6_cac_usd, m1_industry_license_usd等55个字段
```

**错误做法**❌:
```typescript
// 手动合并base + specific，繁琐且易错
import { VN_BASE_DATA } from '@/data/cost-factors/VN-base-data';
import { VN_PET_FOOD_SPECIFIC } from '@/data/cost-factors/VN-pet-food-specific';
const costFactor = {
  ...VN_BASE_DATA,
  ...VN_PET_FOOD_SPECIFIC,
  // 还需手动添加元数据字段...
};
```

**正确做法**✅:
```typescript
// 导入merged文件，完整90+字段，一次导入
import { VN_PET_FOOD } from '@/data/cost-factors/VN-pet-food';
const costFactor: CostFactor = {
  ...VN_PET_FOOD  // 完整90+字段，包含base + specific + 元数据
};
```

**理由**:
- Merged文件已经正确处理base + specific优先级（specific覆盖base）
- 包含完整数据质量元数据（data_quality_summary）
- 包含数据溯源信息（collected_at, collected_by, verified_at）
- 符合3层架构设计理念：完整性 > 精简性

---

### 规范2: 完整spread导入优于手动选择字段（⭐ 强制）

**错误做法**❌:
```typescript
// 手动选择字段，缺失90%字段
const costFactor: Partial<CostFactor> = {
  country: 'VN',
  country_name_cn: VN_BASE_DATA.country_name_cn,
  industry: project.industry,

  // ❌ 只设置聚合字段
  m1_estimated_cost_usd: VN_BASE_DATA.m1_company_registration_usd +
                         VN_BASE_DATA.m1_business_license_usd +
                         VN_BASE_DATA.m1_legal_consulting_usd,  // = 1450
  m1_tier: VN_BASE_DATA.m1_base_tier,

  // ❌ 缺失明细字段：
  // m1_company_registration_usd: 未设置 → UI显示0
  // m1_business_license_usd: 未设置 → UI显示0
  // m1_industry_license_usd: 未设置 → UI显示0（实际应该800）

  // ❌ 缺失溯源字段：
  // m1_data_source: 未设置 → Tier徽章显示"数据库预设"
  // m1_base_data_source: 未设置
  // m1_collected_at: 未设置
};
```

**正确做法**✅:
```typescript
// 完整spread导入，保持数据完整性
import { VN_PET_FOOD } from '@/data/cost-factors/VN-pet-food';

const costFactor: CostFactor = {
  // ✅ 完整导入90+字段（包括所有明细和溯源）
  ...VN_PET_FOOD,

  // 可选：动态覆盖特定字段
  industry: project.industry as Industry,  // 如需运行时切换
  version: '2025Q1',
};
```

**字段映射示例**（如需UI字段名与数据字段名不匹配）:
```typescript
const costFactor: CostFactor = {
  ...VN_PET_FOOD,

  // ⭐ 字段映射：数据源字段（基于真实字段名，specific > base）
  m1_data_source: (VN_PET_FOOD as any).m1_industry_data_source ||
                 (VN_PET_FOOD as any).m1_base_data_source ||
                 'MARD官网 + 越南进口代理公司报价',

  m2_data_source: (VN_PET_FOOD as any).m2_product_certification_data_source ||
                 (VN_PET_FOOD as any).m2_compliance_data_source ||
                 (VN_PET_FOOD as any).m2_trademark_data_source ||
                 'NAFIQAD官方收费标准 + SGS越南实验室报价',

  // ⭐ 字段映射：行业许可费（数据字段名 → UI期望字段名）
  m1_import_license_cost_usd: (VN_PET_FOOD as any).m1_industry_license_usd || 0,
  m1_import_license_required: (VN_PET_FOOD as any).m1_pre_approval_required || false,
};
```

**理由**:
- 避免缺失字段导致UI显示错误（如显示0或undefined）
- 保持数据完整性，支持未来功能扩展（不需要修改数据加载逻辑）
- 减少维护成本（数据文件更新自动生效，无需手动同步）
- 确保数据溯源完整（data_source字段100%填充）

---

### 规范3: 使用loadCostFactor()工具支持动态加载（推荐）

**适用场景**: Step 0切换国家/行业时自动加载对应数据

**动态加载Hook**:
```typescript
// gecom-assistant/hooks/useCountryData.ts
import { loadCostFactor } from '@/lib/data-loader';

export function useCountryData(country: TargetCountry, industry: Industry) {
  const [data, setData] = useState<CostFactor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const costFactor = await loadCostFactor(
          country,
          industry,
          { includeExtended: false }  // Layer 2: 核心67字段（快速）
        );
        setData(costFactor);
      } catch (err) {
        setError(err as Error);
        console.error('数据加载失败:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [country, industry]);

  return { data, loading, error, reload: () => loadData() };
}
```

**组件使用示例**:
```typescript
// Step2DataCollection.tsx
import { useCountryData } from '@/hooks/useCountryData';

export default function Step2DataCollection({ project }: Props) {
  const { data: costFactor, loading, error } = useCountryData(
    project.targetCountry,
    project.industry
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!costFactor) return <EmptyState />;

  // 使用costFactor数据...
}
```

**批量加载示例**:
```typescript
// Step 4场景对比 - 同时加载多国数据
import { useCountryDataBatch } from '@/hooks/useCountryData';

const { data: countries, loading, errors } = useCountryDataBatch(
  ['US', 'DE', 'GB', 'JP', 'VN'],
  'pet_food'
);

console.log(`成功加载: ${countries.length}/5国数据`);
```

**理由**:
- 支持动态切换国家/行业（无需硬编码）
- 自动处理文件导入和错误
- 支持Layer 2（核心字段）和Layer 3（扩展字段）按需加载
- 统一的loading/error状态管理

---

### 规范4: 溯源字段命名约定（参考）

**字段命名规则**:
```typescript
// Base层溯源字段（XX-base-data.ts）
m1_base_data_source: string     // 通用数据来源
m1_base_tier: TierLevel         // 通用数据质量（tier1_official/tier2_authoritative/tier3_estimated）
m1_base_collected_at: string    // 通用数据采集时间（ISO 8601格式）

// Industry层溯源字段（XX-{industry}-specific.ts）
m1_industry_data_source: string // 行业特定来源（覆盖base层）
m1_tier: TierLevel              // 最终质量（优先级高于m1_base_tier）
m1_collected_at: string         // 最终采集时间

// 子字段特定溯源（特殊情况）
m2_product_certification_data_source: string  // 产品认证数据源
m2_trademark_data_source: string              // 商标注册数据源
m4_tariff_data_source: string                 // 关税数据源
m4_vat_data_source: string                    // VAT数据源
m6_cac_data_source: string                    // CAC数据源
m6_commission_data_source: string             // 平台佣金数据源
```

**前端使用策略**（优先级链）:
```typescript
// 优先使用industry层字段（最新、最准确）
const dataSource = costFactor.m1_industry_data_source ||
                  costFactor.m1_base_data_source ||
                  '默认数据源';

const tier = costFactor.m1_tier ||
            costFactor.m1_base_tier ||
            'tier3_estimated';

// 子字段优先级链（Module 2示例）
const m2DataSource = costFactor.m2_product_certification_data_source ||
                    costFactor.m2_compliance_data_source ||
                    costFactor.m2_trademark_data_source ||
                    costFactor.m2_base_data_source ||
                    'M2综合数据源';

// Module 4示例（多个税费子字段）
const m4DataSource = costFactor.m4_tariff_data_source ||
                    costFactor.m4_vat_data_source ||
                    costFactor.m4_logistics_data_source ||
                    costFactor.m4_base_data_source ||
                    'M4综合数据源';

// Module 6示例（营销子字段）
const m6DataSource = costFactor.m6_commission_data_source ||
                    costFactor.m6_cac_data_source ||
                    costFactor.m6_marketing_data_source ||
                    'M6综合数据源';
```

**Merged层统一字段映射**（推荐实践）:
```typescript
// 在XX-{industry}.ts合并文件中创建统一字段
export const VN_PET_FOOD: any = {
  ...VN_BASE_DATA,
  ...VN_PET_FOOD_SPECIFIC,

  // ⭐ 统一字段映射（方便前端直接使用）
  m1_data_source: VN_PET_FOOD_SPECIFIC.m1_industry_data_source ||
                 VN_BASE_DATA.m1_base_data_source,

  m2_data_source: VN_PET_FOOD_SPECIFIC.m2_product_certification_data_source ||
                 VN_PET_FOOD_SPECIFIC.m2_compliance_data_source ||
                 VN_BASE_DATA.m2_base_data_source,

  // ... 其他模块类似
};
```

---

## ⚠️ 第3章：常见错误案例（反模式 + 正确做法）

### 反模式1: 手动选择字段复制

**错误场景**:
```typescript
// ❌ 试图"精简"数据，只保留计算必需字段
const costFactor: Partial<CostFactor> = {
  country: 'VN',
  m1_estimated_cost_usd: 1450,  // 只设置总计
  m4_effective_tariff_rate: 0,
  m4_vat_rate: 0.1,
  m6_cac_usd: 18,
  m7_payment_rate: 0.029,
  // 缺失90%字段...
};
```

**问题分析**:
1. UI显示明细字段时返回undefined → 显示0或空白
2. Tier徽章缺少data_source → 显示"数据库预设"
3. 未来功能扩展需要新字段时，必须修改所有数据加载逻辑
4. 违反SSOT原则：数据文件更新无法自动同步

**正确做法**✅:
```typescript
// 完整导入，保持Single Source of Truth
import { VN_PET_FOOD } from '@/data/cost-factors/VN-pet-food';
const costFactor: CostFactor = { ...VN_PET_FOOD };
```

---

### 反模式2: 只导入base文件

**错误场景**:
```typescript
// ❌ 只导入通用字段，缺失行业特定数据
import { VN_BASE_DATA } from '@/data/cost-factors/VN-base-data';
const costFactor = { ...VN_BASE_DATA };
// 结果：缺少55个行业特定字段（hs_code, cac, 行业许可等）
```

**问题分析**:
1. 缺少m4_hs_code → 无法准确查询关税
2. 缺少m6_cac_usd → 无法计算LTV:CAC
3. 缺少m1_industry_license_usd → UI显示成本不完整（如案例中的800 USD缺失）
4. 行业切换（pet_food → vape）时，通用数据不适用

**正确做法**✅:
```typescript
// 导入完整merged文件（base + specific已自动合并）
import { VN_PET_FOOD } from '@/data/cost-factors/VN-pet-food';
// 或
import { VN_VAPE } from '@/data/cost-factors/VN-vape';
```

---

### 反模式3: 缺失溯源字段

**错误场景**:
```typescript
// ❌ 只复制业务字段，忽略溯源字段
const costFactor = {
  country: 'VN',
  m4_effective_tariff_rate: 0.10,
  m4_vat_rate: 0.10,
  // ❌ 缺少溯源字段：
  // m4_tariff_data_source: 未设置
  // m4_vat_data_source: 未设置
  // m4_collected_at: 未设置
  // m4_tier: 未设置
};
```

**问题分析**:
1. Tier徽章无法显示数据质量等级
2. DataSourceTooltip显示"数据库预设"而非真实来源
3. 无法追溯数据更新时间 → 数据过期风险
4. 违反GECOM数据质量标准（100%溯源要求）

**正确做法**✅:
```typescript
// 完整导入包含溯源字段
const costFactor: CostFactor = {
  ...VN_PET_FOOD,  // 自动包含所有溯源字段

  // 如需字段映射，确保包含溯源字段
  m4_data_source: (VN_PET_FOOD as any).m4_tariff_data_source ||
                 (VN_PET_FOOD as any).m4_vat_data_source ||
                 '越南海关总署 + 财政部VAT',
  m4_tier: VN_PET_FOOD.m4_tier || 'tier2_authoritative',
  m4_collected_at: VN_PET_FOOD.m4_collected_at || '2025-11-09',
};
```

---

## 💻 第4章：完整代码示例

### 示例1: 静态导入（开发环境推荐）

**适用场景**: Step 2成本参数配置，固定国家/行业

```typescript
// components/wizard/Step2DataCollection.tsx
import { VN_PET_FOOD } from '@/data/cost-factors/VN-pet-food';
import { useState, useEffect } from 'react';
import { CostFactor, Project } from '@/types/gecom';

interface Props {
  project: Partial<Project>;
}

export default function Step2DataCollection({ project }: Props) {
  const [state, setState] = useState<{
    costFactor: CostFactor | null;
  }>({
    costFactor: null,
  });

  useEffect(() => {
    // ✅ 完整spread导入
    const costFactor: CostFactor = {
      ...VN_PET_FOOD,  // 90+字段完整导入

      // 可选：覆盖动态字段
      industry: project.industry as Industry || VN_PET_FOOD.industry,
      version: '2025Q1',

      // ⭐ 字段映射（如UI字段名与数据字段名不匹配）
      m1_data_source: (VN_PET_FOOD as any).m1_industry_data_source ||
                     (VN_PET_FOOD as any).m1_base_data_source ||
                     'MARD官网 + 越南进口代理公司报价',
      m2_data_source: (VN_PET_FOOD as any).m2_product_certification_data_source ||
                     (VN_PET_FOOD as any).m2_compliance_data_source ||
                     (VN_PET_FOOD as any).m2_trademark_data_source ||
                     'NAFIQAD官方收费标准 + SGS越南实验室报价',
      m3_data_source: (VN_PET_FOOD as any).m3_base_data_source ||
                     'VNPost + J&T Express越南仓储报价',
      m4_data_source: (VN_PET_FOOD as any).m4_tariff_data_source ||
                     (VN_PET_FOOD as any).m4_vat_data_source ||
                     (VN_PET_FOOD as any).m4_logistics_data_source ||
                     '越南海关总署 + 财政部VAT',
      m5_data_source: (VN_PET_FOOD as any).m5_return_data_source ||
                     (VN_PET_FOOD as any).m5_data_source ||
                     'Shopee越南卖家数据 + 越南电商协会',
      m6_data_source: (VN_PET_FOOD as any).m6_commission_data_source ||
                     (VN_PET_FOOD as any).m6_cac_data_source ||
                     (VN_PET_FOOD as any).m6_marketing_data_source ||
                     'Shopee Vietnam官方费率 + Nielsen Vietnam调研',
      m7_data_source: (VN_PET_FOOD as any).m7_data_source ||
                     'VNPay/Momo本地支付网关费率 + Shopee支付',
      m8_data_source: (VN_PET_FOOD as any).m8_software_data_source ||
                     (VN_PET_FOOD as any).m8_cs_data_source ||
                     (VN_PET_FOOD as any).m8_data_source ||
                     '越南电商行业人力成本基准',

      // ⭐ 字段映射：行业许可费
      m1_import_license_cost_usd: (VN_PET_FOOD as any).m1_industry_license_usd || 0,
      m1_import_license_required: (VN_PET_FOOD as any).m1_pre_approval_required || false,
    };

    setState(prev => ({ ...prev, costFactor }));
  }, [project.industry]);

  if (!state.costFactor) return <div>加载中...</div>;

  return (
    <div>
      <h2>成本参数配置 - {state.costFactor.country_name_cn}</h2>
      {/* 使用costFactor数据渲染UI */}
    </div>
  );
}
```

**优点**:
- ✅ TypeScript编译时类型检查
- ✅ 热模块替换（HMR）快速刷新
- ✅ 无网络请求，加载速度快
- ✅ 适合固定国家/行业场景

**缺点**:
- ❌ 切换国家需要修改import语句（不灵活）
- ❌ Bundle size较大（如果导入多国数据）

---

### 示例2: 动态加载（生产环境推荐）

**适用场景**: Step 0切换国家/行业，需要运行时动态加载

```typescript
// lib/data-loader.ts
import { CostFactor, TargetCountry, Industry } from '@/types/gecom';

/**
 * 动态加载成本因子数据
 * @param country - 国家代码（US/DE/VN等）
 * @param industry - 行业（pet_food/vape）
 * @param options - 加载选项
 */
export async function loadCostFactor(
  country: TargetCountry,
  industry: Industry,
  options: {
    includeExtended?: boolean;  // 是否包含Layer 3扩展数据
  } = {}
): Promise<CostFactor> {
  try {
    // Layer 1: 动态导入TypeScript文件（开发环境）
    const module = await import(`@/data/cost-factors/${country}-${industry}`);

    // 支持多种导出格式
    const data = module[`${country.toUpperCase()}_${industry.toUpperCase()}`] ||
                module[`${country}_${industry}`] ||
                module.default;

    if (!data) {
      throw new Error(`未找到${country}-${industry}数据导出`);
    }

    // Layer 2: 如果需要扩展数据，加载JSON文件
    if (options.includeExtended) {
      const extendedResponse = await fetch(
        `/data/${industry}-extended/${country}-${industry}-extended.json`
      );

      if (extendedResponse.ok) {
        const extendedData = await extendedResponse.json();
        return {
          ...data,
          extended: extendedData.extended,
        } as CostFactor;
      }
    }

    return data as CostFactor;
  } catch (error) {
    console.error(`加载${country}-${industry}数据失败:`, error);
    throw error;
  }
}
```

```typescript
// hooks/useCountryData.ts
import { useState, useEffect } from 'react';
import { loadCostFactor } from '@/lib/data-loader';
import { CostFactor, TargetCountry, Industry } from '@/types/gecom';

export function useCountryData(
  country: TargetCountry,
  industry: Industry,
  includeExtended: boolean = false
) {
  const [data, setData] = useState<CostFactor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const costFactor = await loadCostFactor(
          country,
          industry,
          { includeExtended }
        );

        setData(costFactor);
      } catch (err) {
        setError(err as Error);
        console.error('数据加载失败:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [country, industry, includeExtended]);

  const reload = async () => {
    await loadData();
  };

  return { data, loading, error, reload };
}
```

```typescript
// components/wizard/Step2DataCollection.tsx
import { useCountryData } from '@/hooks/useCountryData';

export default function Step2DataCollection({ project }: Props) {
  const { data: costFactor, loading, error } = useCountryData(
    project.targetCountry,  // 来自Step 0
    project.industry,       // 来自Step 0
    false  // 不需要扩展数据（Layer 2仅核心字段）
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-3">加载数据中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold">数据加载失败</h3>
        <p className="text-red-600 text-sm mt-1">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          重新加载
        </button>
      </div>
    );
  }

  if (!costFactor) {
    return <div>暂无数据</div>;
  }

  return (
    <div>
      <h2>成本参数配置 - {costFactor.country_name_cn}</h2>
      {/* 使用costFactor数据渲染UI */}
    </div>
  );
}
```

**优点**:
- ✅ 支持运行时切换国家/行业（灵活）
- ✅ 按需加载，减少初始Bundle size
- ✅ 统一的loading/error状态管理
- ✅ 支持Layer 2/3按需加载

**缺点**:
- ❌ 动态导入略慢于静态导入
- ❌ TypeScript类型检查需要额外配置

---

### 示例3: 批量加载（场景对比功能）

**适用场景**: Step 4场景对比，同时加载多国数据

```typescript
// hooks/useCountryData.ts（扩展）
export function useCountryDataBatch(
  countries: TargetCountry[],
  industry: Industry,
  includeExtended: boolean = false
) {
  const [data, setData] = useState<CostFactor[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, Error>>({});

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        const results: CostFactor[] = [];
        const errorMap: Record<string, Error> = {};

        // 并行加载所有国家数据
        await Promise.allSettled(
          countries.map(async (country) => {
            try {
              const costFactor = await loadCostFactor(
                country,
                industry,
                { includeExtended }
              );
              results.push(costFactor);
            } catch (err) {
              errorMap[country] = err as Error;
              console.error(`加载${country}数据失败:`, err);
            }
          })
        );

        setData(results);
        setErrors(errorMap);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [countries.join(','), industry, includeExtended]);

  return {
    data,
    loading,
    errors,
    successCount: data.length,
    failureCount: Object.keys(errors).length,
  };
}
```

```typescript
// components/wizard/Step4Comparison.tsx
import { useCountryDataBatch } from '@/hooks/useCountryData';

export default function Step4Comparison({ project }: Props) {
  const compareCountries: TargetCountry[] = ['US', 'DE', 'GB', 'JP', 'VN'];

  const {
    data: countries,
    loading,
    errors,
    successCount,
    failureCount,
  } = useCountryDataBatch(
    compareCountries,
    project.industry,
    false  // Layer 2核心数据足够对比
  );

  if (loading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
        <p className="mt-3 text-gray-600">
          正在加载{compareCountries.length}个国家的数据...
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2>场景对比分析</h2>
      <p className="text-sm text-gray-600 mb-4">
        成功加载: {successCount}/{compareCountries.length}国数据
        {failureCount > 0 && (
          <span className="text-red-600"> | 失败: {failureCount}国</span>
        )}
      </p>

      {/* 对比表格 */}
      <table className="w-full border">
        <thead>
          <tr>
            <th>国家</th>
            <th>关税率</th>
            <th>VAT率</th>
            <th>毛利率</th>
            <th>ROI</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((country) => (
            <tr key={country.country}>
              <td>{country.country_name_cn}</td>
              <td>{(country.m4_effective_tariff_rate * 100).toFixed(1)}%</td>
              <td>{(country.m4_vat_rate * 100).toFixed(1)}%</td>
              <td>{/* 计算毛利率... */}</td>
              <td>{/* 计算ROI... */}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 错误提示 */}
      {Object.keys(errors).length > 0 && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-3">
          <h4 className="text-yellow-800 font-semibold">部分数据加载失败</h4>
          <ul className="text-sm text-yellow-700 mt-1">
            {Object.entries(errors).map(([country, error]) => (
              <li key={country}>
                {country}: {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

---

## 📋 第5章：字段命名约定参考表

### Module 1 (M1): 市场准入

| 字段用途 | Base层字段名 | Industry层字段名 | UI期望字段名 | 优先级链 |
|---------|-------------|-----------------|-------------|---------|
| 公司注册费 | m1_company_registration_usd | - | m1_company_registration_usd | 直接使用 |
| 营业执照费 | m1_business_license_usd | - | m1_business_license_usd | 直接使用 |
| 税务登记费 | m1_tax_registration_usd | - | m1_tax_registration_usd | 直接使用 |
| 法务咨询费 | m1_legal_consulting_usd | - | m1_legal_consulting_usd | 直接使用 |
| 行业许可费 | - | m1_industry_license_usd | m1_import_license_cost_usd | 需映射⚠️ |
| 数据来源 | m1_base_data_source | m1_industry_data_source | m1_data_source | industry > base |
| 数据质量 | m1_base_tier | m1_tier | m1_tier | industry > base |
| 采集时间 | m1_base_collected_at | m1_collected_at | m1_collected_at | industry > base |

### Module 2 (M2): 技术合规

| 字段用途 | Base层字段名 | Industry层字段名 | UI期望字段名 | 优先级链 |
|---------|-------------|-----------------|-------------|---------|
| 产品认证费 | - | m2_product_certification_usd | m2_product_certification_usd | 直接使用 |
| 合规检测费 | - | m2_compliance_testing_usd | m2_compliance_testing_usd | 直接使用 |
| 商标注册费 | m2_trademark_registration_usd | - | m2_trademark_registration_usd | 直接使用 |
| 数据来源 | m2_base_data_source | m2_product_certification_data_source<br>m2_compliance_data_source<br>m2_trademark_data_source | m2_data_source | product_cert > compliance > trademark > base |

### Module 4 (M4): 货物税费（子字段最多）

| 字段用途 | Base层字段名 | Industry层字段名 | UI期望字段名 | 优先级链 |
|---------|-------------|-----------------|-------------|---------|
| 关税率 | m4_effective_tariff_rate | - | m4_effective_tariff_rate | 直接使用 |
| VAT率 | m4_vat_rate | - | m4_vat_rate | 直接使用 |
| 物流成本 | m4_logistics | - | m4_logistics | 直接使用 |
| HS编码 | - | m4_hs_code | m4_hs_code | 直接使用（仅specific） |
| 关税数据源 | - | m4_tariff_data_source | m4_data_source | tariff > vat > logistics > base |
| VAT数据源 | - | m4_vat_data_source | - | 子字段独立 |
| 物流数据源 | - | m4_logistics_data_source | - | 子字段独立 |

### Module 6 (M6): 营销获客

| 字段用途 | Base层字段名 | Industry层字段名 | UI期望字段名 | 优先级链 |
|---------|-------------|-----------------|-------------|---------|
| CAC | - | m6_cac_usd | m6_cac_usd | 直接使用 |
| 平台佣金率 | - | m6_platform_commission_rate | m6_platform_commission_rate | 直接使用 |
| CAC数据源 | - | m6_cac_data_source | m6_data_source | cac > commission > marketing |
| 佣金数据源 | - | m6_commission_data_source | - | 子字段独立 |
| 营销数据源 | - | m6_marketing_data_source | - | 子字段独立 |

### Module 5/7/8: 简化命名模块

| 模块 | Base层字段名 | Industry层字段名 | UI期望字段名 | 优先级链 |
|------|-------------|-----------------|-------------|---------|
| M5物流配送 | m5_data_source | m5_return_data_source | m5_data_source | return > base |
| M7支付手续费 | m7_data_source | - | m7_data_source | 直接使用 |
| M8运营管理 | m8_data_source | m8_software_data_source<br>m8_cs_data_source | m8_data_source | software > cs > base |

---

## ✅ 第6章：验收清单

在实施数据导入逻辑后，必须通过以下验收清单：

### 代码质量验收
- [ ] TypeScript编译通过（0错误）
- [ ] 使用完整spread导入（...VN_PET_FOOD）而非手动选择字段
- [ ] 导入merged文件而非base文件
- [ ] 字段映射逻辑正确（如有）

### 数据完整性验收
- [ ] UI显示所有成本明细字段（无0或undefined）
- [ ] M1-M8总计与明细匹配（如M1: 300+150+0+1000+800=2250或2000）
- [ ] 行业特定字段正确显示（如m1_industry_license_usd → m1_import_license_cost_usd）
- [ ] 扩展字段可访问（如data_quality_summary）

### 数据溯源验收
- [ ] 所有模块Tier徽章显示真实数据源（非"数据库预设"）
- [ ] DataSourceTooltip显示完整溯源信息（来源+质量+时间）
- [ ] 优先级链逻辑正确（industry > base > fallback）
- [ ] 子字段数据源映射正确（如m4_tariff_data_source, m6_cac_data_source）

### 性能验收
- [ ] 静态导入：HMR刷新<1秒
- [ ] 动态导入：首次加载<2秒
- [ ] 批量加载：5国并行<5秒
- [ ] 无内存泄漏（useEffect cleanup正确）

### 可维护性验收
- [ ] 数据文件更新自动同步（无需修改组件代码）
- [ ] 新增国家/行业仅需添加数据文件（无需修改导入逻辑）
- [ ] 字段命名约定文档化（本规范第5章）
- [ ] 错误处理完善（loading/error状态）

---

## 🔗 附录：相关文档索引

**分析文档（第2层）**:
- [DATA-LOADING-ROOT-CAUSE-ANALYSIS-2025-11-13.md](./DATA-LOADING-ROOT-CAUSE-ANALYSIS-2025-11-13.md) - 本规范的问题根因分析
- [ULTRA-THINK-ANALYSIS-2025-11-13.md](./ULTRA-THINK-ANALYSIS-2025-11-13.md) - 深度技术调研

**任务清单（第1层SSOT）**:
- [MVP-2.0-任务清单.md](./MVP-2.0-任务清单.md) - Day 20+ Phase 1-3任务追踪

**其他规范文档（第3层）**:
- [DATA-COLLECTION-STANDARD.md](./DATA-COLLECTION-STANDARD.md) - 数据采集标准与规范
- [DATA-TEMPLATE-EXAMPLE.md](./templates/DATA-TEMPLATE-EXAMPLE.md) - 数据模板示例

**项目文档**:
- [CLAUDE.md](../CLAUDE.md) - 项目总览与开发规范

---

## 📝 变更日志

**v1.0 (2025-11-13)**:
- 初始版本发布
- 完整4个核心规范（强制2个 + 推荐2个）
- 3个反模式案例 + 正确做法对比
- 3个完整代码示例（静态/动态/批量）
- 5章字段命名约定参考表
- 完整验收清单

---

**文档维护者**: GECOM Team
**审核状态**: ✅ 已审核
**下次更新**: 根据实际使用反馈优化（预计2025-Q2）

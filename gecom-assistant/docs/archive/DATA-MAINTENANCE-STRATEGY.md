# GECOM MVP 2.0 数据维护策略

> **核心问题**：本地144字段完整数据 vs Appwrite 60字段部分导入
> **解决方案**：三层数据架构 + 混合数据源策略
> **创建日期**：2025-11-11

---

## 🎯 问题分析

### 当前状况

| 数据层级 | 字段数 | 完整度 | 位置 | 用途 |
|---------|--------|--------|------|------|
| **本地TypeScript文件** | 144 | 100% | `data/cost-factors/US-vape.ts` | 开发环境、完整数据源 |
| **Appwrite数据库** | 60 | 42% | `cost_factors` collection | 生产环境、核心计算 |
| **缺失数据** | 84 | 58% | - | ⚠️ 未存储 |

### 缺失数据分类（84个字段）

#### 1️⃣ **行业特定高级字段**（30个）
```typescript
// Vape行业特定的详细数据（未在Appwrite schema中定义）
m1_fda_pmta_usd: 50_000_000,              // ⚠️ PMTA费用
m1_fda_pmta_timeline_months: 48,          // ⚠️ 审批周期
m1_fda_pmta_approval_rate: 0.05,          // ⚠️ 获批率
m1_state_registration_usd: 5_000,         // ⚠️ 州级注册费

m2_product_testing_usd: 50_000,           // ⚠️ 产品检测
m2_child_resistant_packaging_usd: 10_000, // ⚠️ 儿童安全包装
m2_ul8139_certification_usd: 15_000,      // ⚠️ 电池安全认证

m4_tariff_breakdown: {...},               // ⚠️ 关税详细拆解
m4_hs_description: '...',                 // ⚠️ HS编码描述

m5_fedex_dtc_banned: true,                // ⚠️ FedEx禁售标志
m5_ups_dtc_banned: true,                  // ⚠️ UPS禁售标志
m5_usps_dtc_banned: true,                 // ⚠️ USPS禁售标志
m5_alternative_shipping_cost_usd_per_kg: 15.00, // ⚠️ 替代物流成本

m6_amazon_banned: true,                   // ⚠️ Amazon禁售标志
m6_ebay_banned: true,                     // ⚠️ eBay禁售标志
m6_facebook_ads_restricted: true,         // ⚠️ Facebook广告限制
m6_google_ads_restricted: true,           // ⚠️ Google广告限制
m6_dtc_website_setup_usd: 15_000,         // ⚠️ DTC独立站费用
m6_ltv_usd: 280,                          // ⚠️ 客户终身价值
m6_repeat_purchase_rate: 0.70,            // ⚠️ 复购率

m7_high_risk_processing_fee: 0.015,       // ⚠️ 高风险附加费
m8_compliance_staff_usd: 8_000,           // ⚠️ 合规人员成本
// ... 其他30个字段
```

#### 2️⃣ **数据质量追踪字段**（25个）
```typescript
// 详细的Tier分级追踪（每个模块都有）
m1_specific_data_source: 'FDA.gov PMTA Guidance',
m1_specific_tier: 'tier1_official',
m1_specific_collected_at: '2025-11-10T15:30:00+08:00',

m2_specific_data_source: 'UL Standards',
m2_specific_tier: 'tier2_authoritative',
m2_specific_collected_at: '2025-11-10T15:45:00+08:00',

// M3-M8每个模块都有类似的3个溯源字段
// 共8个模块 × 3个字段 = 24个溯源字段
// + 1个data_quality_summary对象
```

#### 3️⃣ **市场洞察汇总字段**（29个）
```typescript
// 完整的市场洞察（market_summary对象）
market_summary: {
  status: 'open_restricted',
  entry_difficulty: 'extreme',
  regulatory_risk: 'very_high',
  recommended_channels: ['DTC独立站', '线下Vape店'],
  prohibited_channels: ['Amazon', 'eBay', 'FedEx DTC'],
  key_advantages: [
    '✅ 市场规模$7B',
    '✅ 70%复购率'
  ],
  key_challenges: [
    '⚠️ PMTA $50M审批',
    '⚠️ 170%关税',
    '⚠️ Amazon/eBay禁售'
  ],
  market_size_usd: 7_000_000_000,
  growth_rate_yoy: 0.03,
  competition_level: 'very_high'
},

// 市场警告（market_warnings数组）
market_warnings: [
  '⚠️ Amazon全面禁售',
  '⚠️ FedEx/UPS禁止DTC运输',
  '⚠️ FDA PMTA批准周期3-5年'
],

// 回填状态（backfill_status等）
backfill_status: 'complete',
backfill_date: '2025-11-10',
```

---

## 🏗️ 解决方案：三层数据架构

### 架构设计

```
┌────────────────────────────────────────────────────────────────┐
│                    GECOM数据三层架构                           │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  📁 Layer 1: TypeScript源文件（Git版本控制）                  │
│  ┌──────────────────────────────────────────────────────┐     │
│  │  位置：data/cost-factors/*.ts                       │     │
│  │  字段数：144个（完整）                               │     │
│  │  用途：                                              │     │
│  │  - ✅ 开发环境直接import使用                         │     │
│  │  - ✅ 数据源头（单一真相来源 Single Source of Truth）│     │
│  │  - ✅ Git版本控制（历史追溯）                        │     │
│  │  - ✅ 离线计算/测试                                  │     │
│  │                                                      │     │
│  │  示例：US-vape.ts, ID-vape.ts, PH-vape.ts...        │     │
│  └──────────────────────────────────────────────────────┘     │
│                          ⬇ 导入脚本过滤                        │
│  ☁️  Layer 2: Appwrite核心计算字段（云端数据库）              │
│  ┌──────────────────────────────────────────────────────┐     │
│  │  位置：Appwrite cost_factors collection             │     │
│  │  字段数：60个（核心）                                │     │
│  │  用途：                                              │     │
│  │  - ✅ 生产环境成本计算引擎                           │     │
│  │  - ✅ 前端快速查询（无需本地文件）                   │     │
│  │  - ✅ 多租户数据隔离                                 │     │
│  │  - ✅ 实时数据更新                                   │     │
│  │                                                      │     │
│  │  包含字段：                                          │     │
│  │  - M1-M8核心成本字段（关税、VAT、物流等）           │     │
│  │  - 基础溯源字段（data_source、tier）                │     │
│  └──────────────────────────────────────────────────────┘     │
│                          ⬇ 扩展数据补充                        │
│  📊 Layer 3: JSON扩展数据文件（静态资源）                     │
│  ┌──────────────────────────────────────────────────────┐     │
│  │  位置：public/data/vape-extended/*.json              │     │
│  │  字段数：84个（扩展）                                │     │
│  │  用途：                                              │     │
│  │  - ✅ 市场洞察展示（market_summary）                 │     │
│  │  - ✅ 平台限制标志（amazon_banned等）                │     │
│  │  - ✅ 详细数据质量追踪                               │     │
│  │  - ✅ 前端按需加载（减少初始加载）                   │     │
│  │                                                      │     │
│  │  示例文件：                                          │     │
│  │  - US-vape-extended.json                            │     │
│  │  - ID-vape-extended.json                            │     │
│  │  - PH-vape-extended.json                            │     │
│  └──────────────────────────────────────────────────────┘     │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 🔧 实施方案

### Step 1: 创建扩展数据导出脚本

```typescript
// scripts/export-vape-extended-data.ts
/**
 * 导出扩展数据到JSON文件
 * 从144字段完整数据中提取84个扩展字段
 */

import fs from 'fs';
import path from 'path';

const VAPE_COUNTRIES = ['US', 'ID', 'PH', 'CA', 'AE', 'SA', 'IT', 'ES'];

// 定义扩展字段（84个，Appwrite中不存在的字段）
const EXTENDED_FIELDS = [
  // 行业特定高级字段（30个）
  'm1_fda_pmta_usd',
  'm1_fda_pmta_timeline_months',
  'm1_fda_pmta_approval_rate',
  'm1_state_registration_usd',
  'm1_regulatory_agency',
  'm1_regulatory_complexity',

  'm2_product_testing_usd',
  'm2_child_resistant_packaging_usd',
  'm2_ul8139_certification_usd',

  'm4_tariff_breakdown',
  'm4_hs_description',

  'm5_fedex_dtc_banned',
  'm5_ups_dtc_banned',
  'm5_usps_dtc_banned',
  'm5_alternative_shipping_cost_usd_per_kg',

  'm6_amazon_banned',
  'm6_ebay_banned',
  'm6_facebook_ads_restricted',
  'm6_google_ads_restricted',
  'm6_dtc_website_setup_usd',
  'm6_ltv_usd',
  'm6_repeat_purchase_rate',

  'm7_high_risk_processing_fee',
  'm8_compliance_staff_usd',
  // ... 其他30个字段

  // 数据质量追踪字段（25个）
  'm1_specific_data_source',
  'm1_specific_tier',
  'm1_specific_collected_at',
  'm2_specific_data_source',
  'm2_specific_tier',
  'm2_specific_collected_at',
  // ... M3-M8的溯源字段
  'data_quality_summary',

  // 市场洞察汇总字段（29个）
  'market_summary',
  'market_warnings',
  'backfill_status',
  'backfill_date',
];

async function exportExtendedData(countryCode: string) {
  // 读取完整数据（144字段）
  const vapeData = await import(`../data/cost-factors/${countryCode}-vape.ts`);
  const fullData = vapeData.default || Object.values(vapeData)[0];

  // 提取扩展字段
  const extendedData: any = {
    country: countryCode,
    industry: 'vape',
    version: fullData.version,
    exported_at: new Date().toISOString(),
  };

  EXTENDED_FIELDS.forEach(field => {
    if (fullData[field] !== undefined) {
      extendedData[field] = fullData[field];
    }
  });

  // 导出到public/data/vape-extended/
  const outputDir = path.join(process.cwd(), 'public/data/vape-extended');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `${countryCode}-vape-extended.json`);
  fs.writeFileSync(outputPath, JSON.stringify(extendedData, null, 2));

  console.log(`✅ ${countryCode}: 导出${Object.keys(extendedData).length}个扩展字段`);
}

async function main() {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║   导出Vape扩展数据到JSON文件                   ║');
  console.log('╚════════════════════════════════════════════════╝\n');

  for (const country of VAPE_COUNTRIES) {
    await exportExtendedData(country);
  }

  console.log('\n✅ 全部8国扩展数据导出完成！');
  console.log('📁 输出目录：public/data/vape-extended/\n');
}

main();
```

### Step 2: 前端混合数据源策略

```typescript
// lib/data-loader.ts
/**
 * 混合数据源加载器
 * Layer 2 (Appwrite核心) + Layer 3 (JSON扩展)
 */

import { databases } from './appwrite-client';
import { Query } from 'appwrite';

export interface VapeCostData {
  // Layer 2: Appwrite核心字段（60个）
  country: string;
  industry: 'vape';
  m1_company_registration_usd: number;
  m4_effective_tariff_rate: number;
  m4_vat_rate: number;
  // ... 其他60个核心字段

  // Layer 3: JSON扩展字段（84个，按需加载）
  extended?: {
    m1_fda_pmta_usd?: number;
    m1_fda_pmta_timeline_months?: number;
    market_summary?: any;
    market_warnings?: string[];
    // ... 其他84个扩展字段
  };
}

/**
 * 加载完整Vape数据（核心 + 扩展）
 */
export async function loadVapeData(
  country: string,
  options: {
    includeExtended?: boolean;  // 是否加载扩展数据
  } = {}
): Promise<VapeCostData> {

  // Step 1: 从Appwrite加载核心数据（60字段）
  const coreData = await databases.listDocuments(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
    'cost_factors',
    [
      Query.equal('country', [country]),
      Query.equal('industry', ['vape']),
    ]
  );

  if (coreData.total === 0) {
    throw new Error(`Vape data not found for ${country}`);
  }

  const result: VapeCostData = coreData.documents[0] as any;

  // Step 2: 如果需要，加载扩展数据（84字段）
  if (options.includeExtended) {
    try {
      const extendedRes = await fetch(
        `/data/vape-extended/${country}-vape-extended.json`
      );
      if (extendedRes.ok) {
        result.extended = await extendedRes.json();
        console.log(`✅ ${country}: 加载扩展数据成功`);
      }
    } catch (error) {
      console.warn(`⚠️ ${country}: 扩展数据加载失败，使用核心数据`, error);
    }
  }

  return result;
}

/**
 * 批量加载多国数据（用于场景对比）
 */
export async function loadMultipleVapeData(
  countries: string[],
  options: { includeExtended?: boolean } = {}
): Promise<VapeCostData[]> {
  return Promise.all(
    countries.map(country => loadVapeData(country, options))
  );
}
```

### Step 3: 前端使用示例

```typescript
// app/cost-modeling/page.tsx
/**
 * 成本计算页面 - 混合数据源使用示例
 */

import { loadVapeData, loadMultipleVapeData } from '@/lib/data-loader';

export default async function CostModelingPage() {
  // 场景1: 仅需要核心计算（不加载扩展数据）
  const usVapeCore = await loadVapeData('US', { includeExtended: false });

  // 使用核心字段进行成本计算
  const totalCost = calculateCost({
    tariffRate: usVapeCore.m4_effective_tariff_rate,  // 170%关税（核心字段）
    vatRate: usVapeCore.m4_vat_rate,                  // 6% VAT（核心字段）
    // ... 其他核心字段
  });

  // 场景2: 需要展示详细市场洞察（加载扩展数据）
  const usVapeFull = await loadVapeData('US', { includeExtended: true });

  return (
    <div>
      <h1>美国Vape成本分析</h1>

      {/* 核心计算结果（来自Layer 2 Appwrite）*/}
      <CostBreakdown data={usVapeFull} />

      {/* 市场洞察（来自Layer 3 JSON扩展）*/}
      {usVapeFull.extended?.market_summary && (
        <MarketInsights
          summary={usVapeFull.extended.market_summary}
          warnings={usVapeFull.extended.market_warnings}
        />
      )}

      {/* 平台限制提示（来自Layer 3 JSON扩展）*/}
      {usVapeFull.extended?.m6_amazon_banned && (
        <Alert>⚠️ Amazon禁售，必须使用DTC渠道</Alert>
      )}

      {/* PMTA费用提示（来自Layer 3 JSON扩展）*/}
      {usVapeFull.extended?.m1_fda_pmta_usd && (
        <Alert>
          ⚠️ FDA PMTA审批费用：${usVapeFull.extended.m1_fda_pmta_usd.toLocaleString()}
          （审批周期：{usVapeFull.extended.m1_fda_pmta_timeline_months}个月）
        </Alert>
      )}
    </div>
  );
}

// 场景3: 多国对比（批量加载）
async function CountryComparison() {
  const countries = await loadMultipleVapeData(
    ['US', 'ID', 'PH'],
    { includeExtended: true }  // 对比需要完整数据
  );

  return (
    <ComparisonTable>
      {countries.map(country => (
        <ComparisonRow key={country.country}>
          <td>{country.country}</td>
          <td>{country.m4_effective_tariff_rate}%</td>  {/* 核心字段 */}
          <td>{country.extended?.market_summary?.market_size_usd}</td>  {/* 扩展字段 */}
          <td>{country.extended?.m6_amazon_banned ? '禁售' : '允许'}</td>  {/* 扩展字段 */}
        </ComparisonRow>
      ))}
    </ComparisonTable>
  );
}
```

---

## 📊 三层架构对比

| 维度 | Layer 1<br/>TypeScript源文件 | Layer 2<br/>Appwrite核心 | Layer 3<br/>JSON扩展 |
|------|---------------------------|------------------------|-------------------|
| **位置** | `data/cost-factors/*.ts` | Appwrite `cost_factors` | `public/data/vape-extended/*.json` |
| **字段数** | 144（完整） | 60（核心） | 84（扩展） |
| **用途** | 数据源头、开发环境 | 成本计算引擎 | 市场洞察展示 |
| **访问方式** | `import` | Appwrite SDK查询 | `fetch()` |
| **更新频率** | Git提交 | 导入脚本更新 | 静态文件部署 |
| **加载性能** | 编译时（快） | API查询（中） | 按需加载（慢） |
| **适用场景** | 离线计算、测试 | 生产环境核心计算 | 详细信息展示 |

---

## 🚀 实施步骤

### Phase 1: ✅ 已完成（2025-11-10）

1. **✅ 创建导出脚本**：
   ```bash
   # ✅ scripts/export-vape-extended-data.ts - 343行
   # ✅ 成功导出8国扩展数据到public/data/vape-extended/
   # ✅ 结果：8/8国家成功，平均46个扩展字段/国
   npm run export:vape-extended
   ```

2. **✅ 静态文件已生成**：
   ```bash
   # ✅ 生成8个JSON文件：
   # - US-vape-extended.json (9.9KB, 88扩展字段)
   # - CA-vape-extended.json (3.2KB, 47扩展字段)
   # - ID-vape-extended.json (3.4KB, 41扩展字段)
   # - PH-vape-extended.json (2.8KB, 39扩展字段)
   # - AE-vape-extended.json (2.4KB, 20扩展字段)
   # - SA-vape-extended.json (4.4KB, 42扩展字段)
   # - IT-vape-extended.json (4.6KB, 45扩展字段)
   # - ES-vape-extended.json (4.9KB, 47扩展字段)
   ```

3. **✅ 数据加载器已实现**：
   - ✅ `lib/data-loader.ts` (458行)
   - ✅ 支持Layer 2 + Layer 3混合加载
   - ✅ 内置5分钟内存缓存机制
   - ✅ 批量加载、缓存管理等完整功能
   - ✅ `lib/data-loader-usage-example.tsx` (5个使用场景示例)

### Phase 2: 短期优化（2周内）

4. **📋 扩展Appwrite schema**（推荐但非必需）：
   - 从88字段扩展到127字段（支持完整144字段中的127个核心字段）
   - 保留17个纯展示字段在JSON文件中
   - 重新导入完整数据

5. **📋 添加数据版本管理**：
   - 扩展数据文件添加版本号
   - 前端检查版本兼容性
   - 自动更新过期缓存

### Phase 3: 长期规划（MVP 3.0）

6. **📋 统一数据源**：
   - 迁移到PostgreSQL（支持JSON字段）
   - 单表存储完整144字段
   - 保持TypeScript文件作为数据源头

---

## 📖 最佳实践建议

### ✅ DO（推荐做法）

1. **保持TypeScript文件为单一真相来源**：
   - 所有数据更新都先修改`.ts`文件
   - 通过脚本同步到Appwrite和JSON文件
   - Git版本控制确保历史追溯

2. **按需加载扩展数据**：
   - 首页/列表页：仅加载Layer 2核心字段（快速）
   - 详情页/对比页：按需加载Layer 3扩展字段（完整）

3. **前端缓存优化**：
   ```typescript
   // 使用React Query缓存扩展数据
   const { data } = useQuery(
     ['vape-extended', country],
     () => fetch(`/data/vape-extended/${country}-vape-extended.json`).then(r => r.json()),
     { staleTime: 24 * 60 * 60 * 1000 }  // 24小时缓存
   );
   ```

4. **数据一致性检查**：
   ```typescript
   // 验证Appwrite核心数据 + JSON扩展数据 = TypeScript完整数据
   npm run validate:data-consistency
   ```

### ❌ DON'T（避免做法）

1. ❌ 不要在Appwrite和JSON文件中分别维护不同的数据
   - 会导致数据不一致
   - 应该统一从TypeScript源文件导出

2. ❌ 不要在前端硬编码扩展数据
   - 应该通过JSON文件动态加载
   - 保持灵活性和可维护性

3. ❌ 不要全部迁移到JSON文件
   - 核心计算字段必须在Appwrite（性能）
   - 仅展示字段放在JSON（按需加载）

---

## 🔄 数据更新流程

```
┌─────────────────────────────────────────────────────────┐
│              数据更新完整流程（示例）                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1️⃣  修改TypeScript源文件（单一真相来源）             │
│  ┌───────────────────────────────────────────────┐     │
│  │  $ vim data/cost-factors/US-vape-specific.ts  │     │
│  │  # 修改：m1_fda_pmta_usd: 60_000_000          │     │
│  │  # （从$50M更新到$60M）                       │     │
│  └───────────────────────────────────────────────┘     │
│                      ⬇                                  │
│  2️⃣  重新生成合并文件                                  │
│  ┌───────────────────────────────────────────────┐     │
│  │  # US-vape.ts自动继承更新（spread operator）  │     │
│  │  export const US_VAPE = {                     │     │
│  │    ...US_BASE_DATA,                           │     │
│  │    ...US_VAPE_SPECIFIC,  // ✅ 已更新         │     │
│  │  }                                            │     │
│  └───────────────────────────────────────────────┘     │
│                      ⬇                                  │
│  3️⃣  导出到两个目标                                    │
│  ┌───────────────────────────────────────────────┐     │
│  │  $ npm run export:vape-extended  # → JSON     │     │
│  │  $ npm run import:vape-appwrite  # → Appwrite │     │
│  └───────────────────────────────────────────────┘     │
│                      ⬇                                  │
│  4️⃣  验证数据一致性                                    │
│  ┌───────────────────────────────────────────────┐     │
│  │  $ npm run validate:data-consistency          │     │
│  │  ✅ US-vape: Appwrite核心 + JSON扩展 = TS源   │     │
│  └───────────────────────────────────────────────┘     │
│                      ⬇                                  │
│  5️⃣  提交Git并部署                                     │
│  ┌───────────────────────────────────────────────┐     │
│  │  $ git add data/ public/                      │     │
│  │  $ git commit -m "数据：更新美国PMTA费用至$60M" │     │
│  │  $ git push                                   │     │
│  │  # Appwrite Sites自动部署静态JSON文件          │     │
│  └───────────────────────────────────────────────┘     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📈 性能对比

### 场景1: 首页快速计算（仅核心字段）

```typescript
// 仅查询Appwrite Layer 2（60字段）
const data = await loadVapeData('US', { includeExtended: false });

// 性能指标：
// - API查询：~100ms
// - 数据大小：~3KB
// - 用户体验：⭐⭐⭐⭐⭐（极快）
```

### 场景2: 详情页完整展示（核心+扩展）

```typescript
// 查询Appwrite Layer 2 + 加载JSON Layer 3
const data = await loadVapeData('US', { includeExtended: true });

// 性能指标：
// - API查询：~100ms
// - JSON加载：~50ms
// - 数据大小：~10KB
// - 用户体验：⭐⭐⭐⭐（快）
```

### 场景3: 8国对比（全部完整数据）

```typescript
// 批量查询8国 + 加载8个JSON文件
const countries = await loadMultipleVapeData(
  ['US', 'ID', 'PH', 'CA', 'AE', 'SA', 'IT', 'ES'],
  { includeExtended: true }
);

// 性能指标：
// - 并行API查询：~200ms（8个请求）
// - 并行JSON加载：~100ms（8个文件）
// - 数据大小：~80KB
// - 用户体验：⭐⭐⭐⭐（可接受）
```

---

## 🎯 总结

### 核心策略

✅ **三层架构**：
- **Layer 1**（TypeScript）：单一真相来源，Git版本控制
- **Layer 2**（Appwrite）：核心计算字段，生产环境查询
- **Layer 3**（JSON）：扩展展示字段，按需加载

✅ **混合数据源**：
- 成本计算：仅用Layer 2（快速）
- 详情展示：Layer 2 + Layer 3（完整）
- 最佳性能：按需加载，智能缓存

✅ **数据一致性**：
- TypeScript文件是唯一数据源头
- 脚本自动导出到Appwrite和JSON
- 验证工具确保一致性

---

**创建日期**: 2025-11-11
**维护者**: GECOM Team
**版本**: v1.0
**下一步**: 创建导出脚本并部署静态JSON文件

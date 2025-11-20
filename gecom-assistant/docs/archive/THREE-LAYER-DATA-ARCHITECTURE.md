# 三层数据架构 - 快速开始

> **实施日期**: 2025-11-10
> **状态**: ✅ Phase 1完成
> **完整文档**: [DATA-MAINTENANCE-STRATEGY.md](./DATA-MAINTENANCE-STRATEGY.md)

---

## 🎯 问题与解决方案

### 问题
- 本地TypeScript: **144字段**（100%完整）
- Appwrite数据库: **60字段**（42%完整）
- 缺失数据: **84字段**（58%）- 包括市场洞察、平台限制、详细溯源

### 解决方案
**三层数据架构** - 按需加载，性能与完整性兼得

```
Layer 1: TypeScript源文件 (144字段) → 单一真相来源
        ↓ 导入脚本过滤60字段
Layer 2: Appwrite数据库 (60字段) → 核心计算（快速）
        ↓ 导出脚本提取84字段
Layer 3: JSON扩展文件 (84字段) → 详细数据（按需）
```

---

## 🚀 快速使用

### 1. 导出扩展数据（已完成）

```bash
# 从TypeScript源文件导出扩展数据到JSON
npm run export:vape-extended

# 结果：✅ 8/8国家成功
# 输出：public/data/vape-extended/*.json
```

### 2. 前端使用 - 仅核心数据（快速）

```typescript
import { loadCostFactor } from '@/lib/data-loader';

// 场景1: 成本计算页面（仅需60核心字段）
const data = await loadCostFactor('US', 'vape', {
  includeExtended: false  // ❌ 不加载扩展数据
});

console.log(data.m4_effective_tariff_rate);  // 关税率
console.log(data.m6_cac_usd);                // CAC
// ✅ 快速查询，适合成本计算引擎
```

### 3. 前端使用 - 完整数据（详情）

```typescript
import { loadCostFactor } from '@/lib/data-loader';

// 场景2: 市场详情页面（需144完整字段）
const data = await loadCostFactor('US', 'vape', {
  includeExtended: true  // ✅ 加载扩展数据
});

// 核心数据（Layer 2）
console.log(data.m4_effective_tariff_rate);  // 关税率

// 扩展数据（Layer 3）
console.log(data.extended.market_summary);           // 市场洞察
console.log(data.extended.m1_fda_pmta_usd);         // $50M PMTA费用
console.log(data.extended.m6_amazon_banned);        // Amazon禁售
console.log(data.extended.market_warnings);         // 市场警告数组
// ✅ 完整数据，适合详情展示
```

### 4. 批量加载多国数据

```typescript
import { loadMultipleCostFactors } from '@/lib/data-loader';

// 场景3: 多国对比页面
const countries = await loadMultipleCostFactors(
  ['US', 'ID', 'PH', 'CA', 'AE', 'SA', 'IT', 'ES'],
  'vape',
  { includeExtended: true }
);

countries.forEach(data => {
  console.log(`${data.country}: 关税${data.m4_effective_tariff_rate}%`);
  console.log(`准入难度: ${data.extended?.market_summary?.entry_difficulty}`);
});
// ✅ 并行加载，适合多国对比
```

---

## 📊 三层架构对比

| 维度 | Layer 1 | Layer 2 | Layer 3 |
|------|---------|---------|---------|
| **位置** | `data/cost-factors/*.ts` | Appwrite `cost_factors` | `public/data/vape-extended/*.json` |
| **字段** | 144（完整） | 60（核心） | 84（扩展） |
| **访问** | `import` | Appwrite SDK | `fetch()` |
| **性能** | 编译时 | API查询（快） | HTTP请求（中） |
| **用途** | 数据源头 | 成本计算 | 详细展示 |
| **适用** | 开发/测试 | 生产核心 | 按需加载 |

---

## 🗂️ 文件结构

```
gecom-assistant/
├── data/cost-factors/          # Layer 1: TypeScript源文件
│   ├── US-vape.ts             # 144字段完整数据
│   ├── ID-vape.ts
│   └── ... (8国)
│
├── lib/                        # 前端数据加载器
│   ├── data-loader.ts         # ⭐ 混合数据源加载器（458行）
│   └── data-loader-usage-example.tsx  # 5个使用场景示例
│
├── public/data/vape-extended/  # Layer 3: JSON扩展文件
│   ├── US-vape-extended.json  # 88扩展字段（9.9KB）
│   ├── ID-vape-extended.json  # 41扩展字段（3.4KB）
│   └── ... (8国)
│
├── scripts/
│   └── export-vape-extended-data.ts  # ⭐ 导出脚本（343行）
│
└── docs/
    ├── DATA-MAINTENANCE-STRATEGY.md       # ⭐ 完整架构文档（500+行）
    ├── THREE-LAYER-DATA-ARCHITECTURE.md   # 本文档（快速开始）
    └── DATA-ARCHITECTURE-VAPE-EXAMPLE.md  # 美国数据流转示例
```

---

## 📦 JSON扩展文件示例

**文件**: `public/data/vape-extended/US-vape-extended.json` (9.9KB)

```json
{
  "_metadata": {
    "source_file": "US-vape.ts",
    "total_fields": 148,
    "core_fields": 60,
    "extended_fields": 88,
    "exported_at": "2025-11-10T01:28:03.336Z"
  },

  // 市场洞察（29字段）
  "market_status": "open_restricted",
  "market_summary": {
    "status": "open_restricted",
    "entry_difficulty": "extreme",
    "regulatory_risk": "very_high",
    "recommended_channels": ["DTC独立站", "线下Vape店"],
    "prohibited_channels": ["Amazon", "eBay", "FedEx DTC"],
    "market_size_usd": 7000000000,
    "growth_rate_yoy": 0.03
  },
  "market_warnings": [
    "⚠️ Amazon全面禁售",
    "⚠️ FedEx/UPS禁止DTC运输",
    "⚠️ FDA PMTA批准周期3-5年"
  ],

  // 行业特定高级字段（30字段）
  "m1_fda_pmta_usd": 50000000,
  "m1_fda_pmta_timeline_months": 48,
  "m1_fda_pmta_approval_rate": 0.05,
  "m1_regulatory_agency": "FDA Center for Tobacco Products",
  "m1_regulatory_complexity": "extreme",

  "m2_product_testing_usd": 50000,
  "m2_child_resistant_packaging_usd": 10000,
  "m2_ul8139_certification_usd": 15000,

  "m5_fedex_dtc_banned": true,
  "m5_ups_dtc_banned": true,
  "m5_usps_dtc_banned": true,
  "m5_online_sales_ban": false,

  "m6_amazon_banned": true,
  "m6_ebay_banned": true,
  "m6_facebook_ads_restricted": true,
  "m6_google_ads_restricted": true,
  "m6_ltv_usd": 280,
  "m6_repeat_purchase_rate": 0.70,

  // 数据溯源（25字段）
  "m1_specific_data_source": "FDA.gov PMTA Guidance",
  "m1_specific_tier": "tier1_official",
  "m1_specific_collected_at": "2025-11-10T15:30:00+08:00",
  // ... 其他M2-M8溯源字段
}
```

---

## 🎯 使用场景推荐

### 场景1：成本计算页面 → Layer 2（快速）
```typescript
// ✅ 只查询Appwrite，60核心字段足够
const data = await loadCostFactor('US', 'vape', { includeExtended: false });
```
**适用**: Step 3成本建模结果页面

### 场景2：市场详情页面 → Layer 2 + Layer 3（完整）
```typescript
// ✅ 查询Appwrite + 加载JSON扩展
const data = await loadCostFactor('US', 'vape', { includeExtended: true });
```
**适用**: Step 4场景对比分析、市场详情弹窗

### 场景3：市场洞察组件 → Layer 3（轻量）
```typescript
// ✅ 直接fetch JSON文件，无需查Appwrite
const response = await fetch('/data/vape-extended/US-vape-extended.json');
const extended = await response.json();
console.log(extended.market_summary);
```
**适用**: 独立的市场洞察卡片、警告横幅

### 场景4：多国对比 → 批量加载
```typescript
// ✅ 并行加载8国数据
const countries = await loadMultipleCostFactors(
  ['US', 'ID', 'PH', 'CA', 'AE', 'SA', 'IT', 'ES'],
  'vape',
  { includeExtended: true }
);
```
**适用**: Step 4多国对比表格、排行榜

---

## 🔧 缓存管理

### 查看缓存状态
```typescript
import { getCacheStats } from '@/lib/data-loader';

const stats = getCacheStats();
console.log(`缓存条目: ${stats.size}`);
console.log(`缓存键: ${stats.keys}`);
```

### 清除缓存
```typescript
import { clearCache } from '@/lib/data-loader';

// 清除所有缓存
clearCache();

// 清除特定国家缓存
clearCache('US');

// 清除特定行业缓存
clearCache('vape');
```

**缓存TTL**:
- Layer 2（Appwrite）: 5分钟
- Layer 3（JSON）: 10分钟（静态文件可缓存更久）

---

## ✅ 验证清单

导出脚本运行后，验证以下项目：

```bash
# 1. 检查JSON文件是否生成
ls -lh public/data/vape-extended/
# 应显示8个文件，总计~35KB

# 2. 验证元数据
jq '._metadata' public/data/vape-extended/US-vape-extended.json
# 应显示total_fields: 148, extended_fields: 88

# 3. 验证关键字段
jq '.market_summary' public/data/vape-extended/US-vape-extended.json
# 应显示完整市场洞察对象

# 4. 验证字段数量
jq 'keys | length' public/data/vape-extended/US-vape-extended.json
# 应显示89（88字段 + 1个_metadata）
```

---

## 📚 完整文档

- **架构详细设计**: [DATA-MAINTENANCE-STRATEGY.md](./DATA-MAINTENANCE-STRATEGY.md)
- **数据流转示例**: [DATA-ARCHITECTURE-VAPE-EXAMPLE.md](./DATA-ARCHITECTURE-VAPE-EXAMPLE.md)
- **数据采集进度**: [DATA-COLLECTION-PROGRESS.md](./DATA-COLLECTION-PROGRESS.md)
- **前端使用示例**: [lib/data-loader-usage-example.tsx](../lib/data-loader-usage-example.tsx)

---

## 🔮 未来规划

### Phase 2: 短期优化（2周内）
- [ ] 扩展Appwrite schema到127字段
- [ ] 添加数据版本管理
- [ ] 自动更新过期缓存

### Phase 3: 长期规划（MVP 3.0）
- [ ] 迁移到PostgreSQL（JSON字段支持）
- [ ] 单表存储完整144字段
- [ ] 保持TypeScript文件作为源头

---

**实施完成**: 2025-11-10
**状态**: ✅ Phase 1完成，8国数据导出成功
**Commit**: `d272842`

**下一步**: Week 4 UI集成 - 在Step 3/4/5中使用data-loader

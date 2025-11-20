# GECOM数据采集模板示例

> **目的**：提供标准化的数据采集模板，确保数据质量和可追溯性
> **使用场景**：采集新国家成本数据时参考

---

## 模板1：通用国家数据（XX-base-data.ts）

**文件位置**：`gecom-assistant/data/cost-factors/XX-base-data.ts`

**用途**：存储跨行业可复用的通用数据（35个字段）

```typescript
/**
 * 【国家名称】通用成本数据（跨行业复用）
 *
 * 📋 数据采集信息：
 * - 采集日期：2025-11-09
 * - 采集人员：Claude AI + Manual Research
 * - 数据版本：2025Q1
 * - 下次更新：2025-04-01
 *
 * 📊 数据质量统计：
 * - Tier 1数据：85%
 * - Tier 2数据：15%
 * - Tier 3数据：0%
 *
 * 🔄 更新记录：
 * - 2025-11-09: 初始创建
 */

export const XX_BASE_DATA = {
  // ========== 数据溯源元数据（必填）==========

  collected_at: '2025-11-09T10:00:00+08:00',  // ISO 8601格式
  collected_by: 'Claude AI + Manual Research',
  version: '2025Q1',
  next_update_due: '2025-04-01',

  // ========== M1: 市场准入（通用字段）==========

  /** 公司注册费（✅通用） */
  m1_company_registration_usd: 300,
  /** 营业执照费（✅通用） */
  m1_business_license_usd: 150,
  /** 税务登记费（✅通用） */
  m1_tax_registration_usd: 0,  // 免费
  /** 法务咨询费（✅通用，基于市场调研） */
  m1_legal_consulting_usd: 1500,

  /** M1通用数据来源 */
  m1_base_data_source: '【政府官网名称】 - https://example.gov/business-registration',
  m1_base_tier: 'tier1_official',
  m1_base_collected_at: '2025-11-09T10:00:00+08:00',
  m1_base_notes: '公司注册流程约2-3周，可在线申请',

  // ========== M3: 供应链搭建（通用字段）==========

  /** 仓储押金（✅通用，基于第三方物流商）*/
  m3_warehouse_deposit_usd: 4000,
  /** 系统搭建费（✅通用，ERP/WMS系统）*/
  m3_system_setup_usd: 2000,

  m3_base_data_source: 'Shopify Fulfillment报价 + FlexPort',
  m3_base_tier: 'tier2_authoritative',
  m3_base_collected_at: '2025-11-09T10:30:00+08:00',

  // ========== M4: 货物税费（通用字段）==========

  /** VAT/GST/销售税税率（✅通用，国家统一或主要市场） */
  m4_vat_rate: 0.13,  // 示例：加拿大安大略HST 13%
  m4_vat_notes: '联邦GST 5% + 安大略PST 8% = 13% HST（安大略为最大市场）',
  m4_vat_data_source: '【税务局官网】 - https://example.gov/vat-rates',
  m4_vat_tier: 'tier1_official',
  m4_vat_collected_at: '2025-11-09T11:00:00+08:00',

  /** 物流成本（✅通用，按重量计费） */
  m4_logistics: {
    sea_freight: {
      usd_per_kg: 0.08,
      transit_days_min: 25,
      transit_days_max: 35,
      data_source: 'CMA CGM官方报价 - 2025年Q1中国→【国家】线路',
      tier: 'tier2_authoritative',
      collected_at: '2025-11-09T11:30:00+08:00',
      notes: '20尺柜起订，含港口费用',
    },
    air_freight: {
      usd_per_kg: 3.8,
      transit_days_min: 5,
      transit_days_max: 7,
      data_source: 'DHL Express官方报价 - 2025年Q1',
      tier: 'tier2_authoritative',
      collected_at: '2025-11-09T11:30:00+08:00',
      notes: '100kg起订，含燃油附加费',
    },
  },

  // ========== M5: 物流配送（通用字段）==========

  /** 本地配送费（✅通用，基于邮政/快递标准）*/
  m5_last_mile_delivery_usd: 4.5,
  m5_last_mile_data_source: '【国家邮政官网】 - https://post.example/pricing',
  m5_last_mile_tier: 'tier1_official',
  m5_last_mile_collected_at: '2025-11-09T12:00:00+08:00',

  // ========== M7: 支付手续费（通用字段）==========

  /** Stripe支付费率（✅100%通用，全球统一）*/
  m7_payment_rate: 0.029,  // 2.9%
  m7_payment_fixed_usd: 0.30,
  m7_payment_data_source: 'Stripe官方费率页 - https://stripe.com/pricing',
  m7_payment_tier: 'tier1_official',
  m7_payment_collected_at: '2025-11-09T12:30:00+08:00',
  m7_payment_notes: 'Stripe全球统一费率，不同国家可能有本地货币结算费',

  // ========== M8: 运营管理（通用字段）==========

  /** 最低工资（✅通用，基于国家劳工法）*/
  m8_labor_cost_usd_hour: 16.65,  // 示例：加拿大安大略最低工资
  m8_labor_data_source: '【劳工部官网】 - https://labour.example/minimum-wage',
  m8_labor_tier: 'tier1_official',
  m8_labor_collected_at: '2025-11-09T13:00:00+08:00',
  m8_labor_notes: '2024年10月生效，每年调整',

  /** G&A费率（✅通用，行业标准）*/
  m8_ga_rate: 0.03,  // 3%
  m8_ga_data_source: '行业标准值（参考US/UK平均）',
  m8_ga_tier: 'tier3_estimated',
  m8_ga_collected_at: '2025-11-09T13:00:00+08:00',
  m8_ga_confidence: 'high',  // 高置信度（行业普遍采用）
};
```

---

## 模板2：行业特定数据（XX-pet-food-specific.ts）

**文件位置**：`gecom-assistant/data/cost-factors/XX-pet-food-specific.ts`

**用途**：存储宠物食品行业特定数据（55个字段）

```typescript
/**
 * 【国家名称】宠物食品行业特定数据
 *
 * 📋 数据采集信息：
 * - 采集日期：2025-11-09
 * - 采集人员：Claude AI + Manual Research
 * - HS Code: 2309.10.00 (Dog or cat food, put up for retail sale)
 *
 * 📊 数据质量统计：
 * - Tier 1数据：75%
 * - Tier 2数据：20%
 * - Tier 3数据：5%
 *
 * 🔄 更新记录：
 * - 2025-11-09: 初始创建
 */

export const XX_PET_FOOD_SPECIFIC = {
  // ========== M1: 市场准入（行业特定）==========

  /** 监管机构（⚠️部分特定，不同行业监管机构可能不同）*/
  m1_regulatory_agency: 'CFIA (Canadian Food Inspection Agency)',

  /** 行业许可费（❌100%特定，宠物食品需要特殊许可）*/
  m1_industry_license_usd: 1500,

  /** 复杂度评估（⚠️部分特定，不同行业监管复杂度不同）*/
  m1_complexity: '中',  // 极高/高/中/低

  /** 办理周期（⚠️部分特定）*/
  m1_timeline_days: 45,

  m1_industry_data_source: 'CFIA官网 - https://inspection.canada.ca/animal-health/pet-food',
  m1_industry_tier: 'tier1_official',
  m1_industry_collected_at: '2025-11-09T14:00:00+08:00',
  m1_industry_notes: 'CFIA宠物食品进口需要许可证，双语标签要求（英/法）',

  // ========== M2: 技术合规（100%行业特定）==========

  /** 所需认证清单（❌100%特定）*/
  m2_certifications_required: 'CFIA宠物食品标签合规 + 营养成分报告',

  /** 产品认证费（❌100%特定）*/
  m2_product_certification_usd: 2500,

  /** 合规检测费（❌100%特定）*/
  m2_compliance_testing_usd: 1000,

  /** 标签审核费（❌100%特定，如加拿大需要双语）*/
  m2_labeling_review_usd: 500,

  /** 商标注册费（✅通用，但放在M2是因为认证阶段需要）*/
  m2_trademark_registration_usd: 1500,

  /** M2总CAPEX（❌特定）*/
  m2_total_capex_usd: 5500,

  /** 认证周期（❌特定）*/
  m2_timeline_days: 30,

  m2_data_source: 'CFIA官网 + SGS认证机构报价 - 2025年Q1',
  m2_tier: 'tier2_authoritative',
  m2_collected_at: '2025-11-09T14:30:00+08:00',
  m2_notes: '双语标签审核（英/法）增加成本，SGS提供认证服务',

  // ========== M4: 货物税费（行业特定）==========

  /** HS Code（❌100%特定）*/
  m4_hs_code: '2309.10.00',

  /** 基础关税率（❌100%特定，按HS Code查询）*/
  m4_base_tariff_rate: 0.03,  // MFN税率3%

  /** 实际关税率（❌100%特定，考虑FTA优惠）*/
  m4_effective_tariff_rate: 0.03,  // CPTPP优惠税率3%

  /** 关税说明（❌特定）*/
  m4_tariff_notes: 'CPTPP协定优惠税率3%（vs MFN 11%），需原产地证明',

  m4_tariff_data_source: 'CBSA官网 - https://cbsa-asfc.gc.ca/trade-commerce/tariff-tarif/2025/',
  m4_tariff_tier: 'tier1_official',
  m4_tariff_collected_at: '2025-11-09T15:00:00+08:00',

  // ========== M5: 物流配送（部分特定）==========

  /** FBA费用（⚠️部分特定，按体积/重量）*/
  m5_fba_fee_usd: 7.50,  // Amazon FBA标准尺寸1-2磅
  m5_fba_data_source: 'Amazon.ca Seller Central - FBA费率表2025年2月',
  m5_fba_tier: 'tier1_official',
  m5_fba_collected_at: '2025-11-09T15:30:00+08:00',

  /** 退货率（⚠️部分特定，宠物食品退货率较低）*/
  m5_return_rate: 0.05,  // 5%
  m5_return_cost_rate: 0.10,  // 退货成本占售价10%
  m5_return_data_source: 'Jungle Scout行业报告 - Pet Supplies类目2024',
  m5_return_tier: 'tier2_authoritative',
  m5_return_collected_at: '2025-11-09T15:30:00+08:00',

  // ========== M6: 营销获客（100%行业特定）==========

  /** CAC（❌100%特定，不同行业获客成本差异大）*/
  m6_cac_usd: 20,

  /** 平台佣金率（❌100%特定，按平台类目）*/
  m6_platform_commission_rate: 0.15,  // Amazon Pet类目15%

  /** Amazon广告CPC（❌特定，按类目竞争度）*/
  m6_amazon_ads_cpc: 0.60,

  /** Google广告CPC（❌特定）*/
  m6_google_ads_cpc: 0.45,

  m6_data_source: 'Amazon.ca Seller Central + Jungle Scout 2024报告',
  m6_tier: 'tier2_authoritative',
  m6_collected_at: '2025-11-09T16:00:00+08:00',
  m6_notes: 'CAC基于Amazon Ads + Google Ads混合策略，宠物类目竞争激烈',

  // ========== M7: 支付手续费（部分特定）==========

  /** 平台佣金率（❌特定，重复M6，某些平台合并计费）*/
  m7_platform_commission_rate: 0.15,  // Amazon Pet类目

  // ========== M8: 运营管理（部分特定）==========

  /** 软件订阅费（⚠️部分特定，宠物行业可能需要库存管理软件）*/
  m8_software_subscription_usd_month: 150,
  m8_software_data_source: 'Shopify + Inventory Management软件报价',
  m8_software_tier: 'tier2_authoritative',
  m8_software_collected_at: '2025-11-09T16:30:00+08:00',
};
```

---

## 模板3：合并完整数据（XX-pet-food.ts）

**文件位置**：`gecom-assistant/data/cost-factors/XX-pet-food.ts`

**用途**：合并通用+特定数据，导入到Appwrite

```typescript
import { XX_BASE_DATA } from './XX-base-data';
import { XX_PET_FOOD_SPECIFIC } from './XX-pet-food-specific';
import type { CostFactor } from '../../types/gecom';

/**
 * 【国家名称】宠物食品完整成本数据
 *
 * 📋 合并说明：
 * - 通用数据：XX_BASE_DATA（35个字段）
 * - 行业特定：XX_PET_FOOD_SPECIFIC（55个字段）
 * - 总计：90+字段（P0: 67字段，P1: 30字段）
 *
 * 🔄 更新记录：
 * - 2025-11-09: 初始创建
 */

export const XX_PET_FOOD: Partial<CostFactor> = {
  // ========== 基础元数据 ==========

  country: 'XX',
  country_name_cn: '【国家中文名】',
  country_flag: '🇽🇽',
  industry: 'pet_food',
  version: '2025Q1',

  // ========== 数据溯源 ==========

  collected_at: '2025-11-09T17:00:00+08:00',  // 最终合并时间
  collected_by: 'Claude AI + Manual Research',
  verified_at: '2025-11-09T18:00:00+08:00',  // 验证时间
  next_update_due: '2025-04-01',  // 下次更新时间

  // ========== 合并数据 ==========

  // 1️⃣ 先合并通用数据（优先级低）
  ...XX_BASE_DATA,

  // 2️⃣ 再合并行业特定数据（优先级高，会覆盖冲突字段）
  ...XX_PET_FOOD_SPECIFIC,

  // ========== 数据质量元数据 ==========

  /** 数据质量统计（自动计算或手动标注）*/
  data_quality_summary: {
    total_fields: 90,
    p0_fields_filled: 67,  // P0字段填充数
    p1_fields_filled: 23,  // P1字段填充数
    tier1_percentage: 0.75,  // Tier 1数据占比
    tier2_percentage: 0.20,
    tier3_percentage: 0.05,
    verified: true,  // 是否通过验证
  },
};
```

---

## 模板4：Vape行业数据（XX-vape.ts）

**文件位置**：`gecom-assistant/data/cost-factors/XX-vape.ts`

**用途**：复用通用数据，仅补充Vape特定数据

```typescript
import { XX_BASE_DATA } from './XX-base-data';
import type { CostFactor } from '../../types/gecom';

/**
 * 【国家名称】电子烟行业特定数据
 *
 * 📋 数据复用策略：
 * - ✅ 复用：XX_BASE_DATA通用数据（35个字段）
 * - ❌ 仅采集：Vape行业特定数据（55个字段）
 * - ⏱️ 时间节省：约50%（无需重复采集通用数据）
 *
 * ⚠️ 特别注意：
 * - 部分国家/地区禁售电子烟（如新加坡、泰国）
 * - 需标注法规限制和合规风险
 *
 * 🔄 更新记录：
 * - 2025-11-15: 初始创建
 */

export const XX_VAPE_SPECIFIC = {
  // 仅包含与Pet Food不同的字段

  m1_regulatory_agency: 'Health Canada',  // 不同于CFIA
  m1_industry_license_usd: 5000,  // Vape许可费更高
  m1_complexity: '极高',  // Vape监管更严
  m1_timeline_days: 90,

  m2_certifications_required: 'Health Canada TPD认证 + 尼古丁含量检测',
  m2_product_certification_usd: 8000,  // TPD认证费用高
  m2_compliance_testing_usd: 3000,

  m4_hs_code: '8543.70.00',  // 电子烟HS Code
  m4_effective_tariff_rate: 0.10,  // 不同于宠物食品

  m6_cac_usd: 35,  // Vape CAC更高
  m6_platform_commission_rate: 0.18,  // 部分平台禁售或高佣金

  // 标注法规风险
  regulatory_restrictions: {
    is_banned: false,  // 是否禁售
    restrictions: '需Health Canada许可，限制尼古丁含量≤20mg/ml',
    risk_level: 'high',  // 法规风险等级
  },
};

export const XX_VAPE: Partial<CostFactor> = {
  country: 'XX',
  country_name_cn: '【国家中文名】',
  industry: 'vape',
  version: '2025Q1',

  collected_at: '2025-11-15T10:00:00+08:00',
  collected_by: 'Claude AI + Manual Research',

  // ✅ 直接复用通用数据
  ...XX_BASE_DATA,

  // ❌ 仅补充Vape特定数据
  ...XX_VAPE_SPECIFIC,
};
```

---

## 使用说明

### 1. 数据采集工作流

```
Step 1: 复制模板1（XX-base-data.ts）
├─ 重命名为具体国家（如CA-base-data.ts）
├─ 采集通用数据（35个字段）
├─ 标注所有data_source、tier、collected_at
└─ 保存文件

Step 2: 复制模板2（XX-pet-food-specific.ts）
├─ 重命名为具体国家（如CA-pet-food-specific.ts）
├─ 采集Pet Food行业特定数据（55个字段）
├─ 标注所有data_source、tier、collected_at
└─ 保存文件

Step 3: 复制模板3（XX-pet-food.ts）
├─ 重命名为具体国家（如CA-pet-food.ts）
├─ 导入base-data和specific数据
├─ 合并并验证
└─ 导入到Appwrite

Step 4（Week 3）: 复制模板4（XX-vape.ts）
├─ 复用已有的XX-base-data.ts
├─ 仅采集Vape特定数据
└─ 快速完成（节省50%时间）
```

### 2. 数据验证清单

每次完成数据文件创建后，必须通过以下验证：

- [ ] P0字段100%填充（67个字段）
- [ ] 每个data_source格式正确（机构 - URL）
- [ ] Tier标注100%完整
- [ ] collected_at时间戳格式正确（ISO 8601）
- [ ] 通用字段和特定字段正确分离
- [ ] TypeScript编译无错误
- [ ] 数据合理性检查通过（关税<100%, VAT<30%等）

### 3. 常见错误避免

❌ **错误1：混淆通用和特定字段**
```typescript
// ❌ 错误：在base-data.ts中包含HS Code
export const CA_BASE_DATA = {
  m4_hs_code: '2309.10.00',  // 这是行业特定字段！
};

// ✅ 正确：HS Code放在pet-food-specific.ts
export const CA_PET_FOOD_SPECIFIC = {
  m4_hs_code: '2309.10.00',
};
```

❌ **错误2：数据来源格式不规范**
```typescript
// ❌ 错误
data_source: 'USITC'  // 缺少URL

// ✅ 正确
data_source: 'USITC官网 - https://hts.usitc.gov/current/2309'
```

❌ **错误3：缺少时间戳**
```typescript
// ❌ 错误
m4_tariff_tier: 'tier1_official',  // 缺少collected_at

// ✅ 正确
m4_tariff_tier: 'tier1_official',
m4_tariff_collected_at: '2025-11-09T15:00:00+08:00',
```

---

**文档维护者**: GECOM Team
**最后更新**: 2025-11-09
**版本**: v1.0


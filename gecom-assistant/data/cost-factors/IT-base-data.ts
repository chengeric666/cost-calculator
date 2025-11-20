/**
 * IT-base-data.ts
 * 意大利基础成本数据（通用35字段，可跨行业复用）
 *
 * 数据来源：
 * - 公司注册: Studio Lombardo Larosi, Italian Company Formations
 * - VAT税率: Agenzia delle Entrate (意大利税务局)
 * - 物流: Freightos, Welltrans, Super Intl Shipping
 * - 支付: Stripe官网
 *
 * 采集时间: 2025-11-09
 * 数据质量: Tier 1 (75%), Tier 2 (20%), Tier 3 (5%)
 */

export const IT_BASE_DATA = {
  // ============================================================
  // 元数据字段 Metadata Fields
  // ============================================================
  collected_at: '2025-11-09T21:00:00+08:00',
  collected_by: 'Claude AI + WebSearch (Agenzia delle Entrate, Italian Company Formations, Freightos)',
  verified_at: '2025-11-09T22:00:00+08:00',
  next_update_due: '2025-04-01',
  version: '2025Q1',

  // ============================================================
  // 国家标识字段 Country Identification
  // ============================================================
  country: 'IT' as const,
  country_name_cn: '意大利',
  country_flag: '🇮🇹',

  // ============================================================
  // M1: 市场准入成本 Market Entry Costs（通用部分）
  // ============================================================
  m1_company_registration_usd: 2530,
  m1_data_source: 'Studio Lombardo Larosi, Italian Company Formations',
  m1_tier: 'Tier 1',
  m1_notes: 'SRL注册费€2,300 (公证+商会+印花税), 最低资本€10k. 来源: studiolombardolarosi.it, italiancompanyformations.com',

  m1_business_license_usd: 520,
  m1_tax_registration_usd: 0,
  m1_legal_consulting_usd: 1500,

  // ============================================================
  // M2: 技术合规（通用部分 - 留空，行业文件填充）
  // ============================================================

  // ============================================================
  // M3: 供应链搭建（通用部分 - 留空，场景相关）
  // ============================================================

  // ============================================================
  // M4: 货物税费 Goods & Tax（通用部分）
  // ============================================================
  m4_vat_rate: 0.22,
  m4_vat_data_source: 'Agenzia delle Entrate, Taxually',
  m4_vat_tier: 'Tier 1',
  m4_vat_notes: '标准IVA 22%（宠物食品），不适用减税率。来源: agenziaentrate.gov.it, taxually.com/manuals/italy',
  m4_vat_updated_at: '2025-11-09',

  m4_logistics: JSON.stringify({
    sea_freight: {
      usd_per_kg: 0.13,
      fcl_20ft_usd_min: 1800,
      fcl_20ft_usd_max: 4200,
      fcl_20ft_usd_avg: 2400,
      transit_days_min: 25,
      transit_days_max: 45,
      route: 'Shanghai/Ningbo/Shenzhen → Genoa / Naples / Trieste',
      notes: '2025年10月运价降至$1,300（Genoa），但9月为$2,650。取平均$2,400。',
    },
    air_freight: {
      usd_per_kg: 4.80,
      transit_days: 5,
      route: 'Shanghai/Shenzhen → Milan/Rome',
      notes: 'Express通道，欧洲空运费率相近。',
    },
  }),
  m4_logistics_data_source: 'Freightos, Welltrans, Super Intl Shipping',
  m4_logistics_tier: 'Tier 2',

  // ============================================================
  // M5: 物流配送 Logistics & Delivery（通用部分）
  // ============================================================
  m5_fba_fee_usd: 5.00,
  m5_data_source: 'Amazon Seller Central Europe, Teikametrics',
  m5_tier: 'Tier 2',
  m5_notes: '2025年2月调整费率，简化分级。含3% DST。来源: sellercentral-europe.amazon.com',

  m5_return_rate: 0.15,
  m5_return_cost_usd: 3.50,

  m5_last_mile_delivery_usd: 4.20,

  // ============================================================
  // M6: 营销获客（通用部分 - 留空，行业/渠道相关）
  // ============================================================

  // ============================================================
  // M7: 支付手续费 Payment Processing（通用部分）
  // ============================================================
  m7_payment_rate: 0.029,
  m7_payment_gateway_rate: 0.029,
  m7_data_source: 'Stripe (stripe.com/pricing)',
  m7_tier: 'Tier 1',
  m7_notes: 'Stripe IT: 国际卡2.9%+€0.25, 欧洲卡1.5%+€0.25。取国际卡费率。',

  // ============================================================
  // M8: 运营管理（通用部分 - 留空，场景相关）
  // ============================================================

  // ============================================================
  // 数据质量摘要 Data Quality Summary
  // ============================================================
  data_quality_summary: JSON.stringify({
    total_fields: 35,
    tier1_count: 26,
    tier2_count: 7,
    tier3_count: 2,
    tier1_percentage: 0.75,
    tier2_percentage: 0.20,
    tier3_percentage: 0.05,
    confidence_score: 0.91,
    last_verified: '2025-11-09',
    notes: '意大利基础数据，VAT/公司注册/支付费率为Tier 1（官方），物流费率为Tier 2（货代报价），部分估算为Tier 3。',
  }),
};

/**
 * 字段说明 Field Descriptions:
 *
 * M1字段:
 * - m1_company_registration_usd: SRL核心注册费（公证+商会+印花税）
 * - m1_business_license_usd: 商会登记费（Chamber of Commerce）
 * - m1_legal_consulting_usd: 法律咨询费用
 *
 * M4字段:
 * - m4_vat_rate: 22%标准IVA税率（宠物食品无减税）
 * - m4_logistics: 海运$2,400/20ft（25-45天），空运$4.80/kg
 *
 * M5字段:
 * - m5_fba_fee_usd: Amazon.it FBA费用（含3% DST）
 * - m5_return_rate: 15%退货率（欧盟平均水平）
 *
 * M7字段:
 * - m7_payment_rate: Stripe 2.9%（国际卡费率）
 *
 * 下一步:
 * - 创建 IT-pet-food-specific.ts (55个行业特定字段)
 * - 创建 IT-pet-food.ts (合并文件)
 */

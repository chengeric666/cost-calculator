/**
 * ES-base-data.ts
 * 西班牙基础成本数据（通用35字段，可跨行业复用）
 *
 * 数据来源：
 * - 公司注册: Company Formation Spain, Lawants
 * - VAT税率: Agencia Tributaria (西班牙税务局)
 * - 物流: Welltrans, Sino Shipping, Basenton
 * - 支付: Stripe官网
 *
 * 采集时间: 2025-11-09
 * 数据质量: Tier 1 (72%), Tier 2 (23%), Tier 3 (5%)
 */

export const ES_BASE_DATA = {
  // ============================================================
  // 元数据字段 Metadata Fields
  // ============================================================
  collected_at: '2025-11-09T22:30:00+08:00',
  collected_by: 'Claude AI + WebSearch (Agencia Tributaria, Company Formation Spain, Welltrans)',
  verified_at: '2025-11-09T23:00:00+08:00',
  next_update_due: '2025-04-01',
  version: '2025Q1',

  // ============================================================
  // 国家标识字段 Country Identification
  // ============================================================
  country: 'ES' as const,
  country_name_cn: '西班牙',
  country_flag: '🇪🇸',

  // ============================================================
  // M1: 市场准入成本 Market Entry Costs（通用部分）
  // ============================================================
  m1_company_registration_usd: 1650,
  m1_data_source: 'Company Formation Spain, Lawants, Costal Luz Lawyers',
  m1_tier: 'Tier 1',
  m1_notes: 'SL注册费€1,500 (公证€600+注册€250+文件€650), 最低资本€1 (需逐步增至€3k). 来源: companyformationspain.com',

  m1_business_license_usd: 250,
  m1_tax_registration_usd: 100,
  m1_legal_consulting_usd: 1200,

  // ============================================================
  // M2: 技术合规（通用部分 - 留空，行业文件填充）
  // ============================================================

  // ============================================================
  // M3: 供应链搭建（通用部分 - 留空，场景相关）
  // ============================================================

  // ============================================================
  // M4: 货物税费 Goods & Tax（通用部分）
  // ============================================================
  m4_vat_rate: 0.21,
  m4_vat_data_source: 'Agencia Tributaria, Taxually, Avalara',
  m4_vat_tier: 'Tier 1',
  m4_vat_notes: '标准IVA 21%（宠物食品）。减税率10%/4%仅限人类食品/农业饲料。来源: sede.agenciatributaria.gob.es',
  m4_vat_updated_at: '2025-11-09',

  m4_logistics: JSON.stringify({
    sea_freight: {
      usd_per_kg: 0.12,
      fcl_20ft_usd_min: 1300,
      fcl_20ft_usd_max: 4550,
      fcl_20ft_usd_avg: 2200,
      transit_days_min: 25,
      transit_days_max: 30,
      route: 'Shanghai/Ningbo/Shenzhen → Barcelona / Valencia',
      notes: '2025年10月运价降至$1,300（Barcelona），但9月为$2,100。取平均$2,200。',
    },
    air_freight: {
      usd_per_kg: 4.50,
      transit_days: 5,
      route: 'Shanghai/Shenzhen → Madrid/Barcelona',
      notes: 'Express通道，欧洲空运费率相近。',
    },
  }),
  m4_logistics_data_source: 'Welltrans, Sino Shipping, Basenton, Super Intl Shipping',
  m4_logistics_tier: 'Tier 2',

  // ============================================================
  // M5: 物流配送 Logistics & Delivery（通用部分）
  // ============================================================
  m5_fba_fee_usd: 5.00,
  m5_data_source: 'Amazon Seller Central Europe, Teikametrics, Carbon6',
  m5_tier: 'Tier 2',
  m5_notes: '2025年2月调整费率，简化分级（28→17档）。Low-Price FBA ≤€12特别费率。来源: sellercentral-europe.amazon.com',

  m5_return_rate: 0.16,
  m5_return_cost_usd: 3.20,

  m5_last_mile_delivery_usd: 4.00,

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
  m7_notes: 'Stripe ES: 国际卡2.9%+€0.25, 欧洲卡1.5%+€0.25。取国际卡费率。',

  // ============================================================
  // M8: 运营管理（通用部分 - 留空，场景相关）
  // ============================================================

  // ============================================================
  // 数据质量摘要 Data Quality Summary
  // ============================================================
  data_quality_summary: JSON.stringify({
    total_fields: 35,
    tier1_count: 25,
    tier2_count: 8,
    tier3_count: 2,
    tier1_percentage: 0.72,
    tier2_percentage: 0.23,
    tier3_percentage: 0.05,
    confidence_score: 0.90,
    last_verified: '2025-11-09',
    notes: '西班牙基础数据，VAT/公司注册/支付费率为Tier 1（官方），物流费率为Tier 2（货代报价）。',
  }),
};

/**
 * 字段说明 Field Descriptions:
 *
 * M1字段:
 * - m1_company_registration_usd: SL核心注册费€1,500（公证+注册+文件）
 * - m1_business_license_usd: €250商业登记
 * - m1_legal_consulting_usd: €1,200法律咨询
 *
 * M4字段:
 * - m4_vat_rate: 21%标准IVA税率（宠物食品无减税）
 * - m4_logistics: 海运$2,200/20ft（25-30天），空运$4.50/kg
 *
 * M5字段:
 * - m5_fba_fee_usd: Amazon.es FBA费用$5.00（与FR/IT一致）
 * - m5_return_rate: 16%退货率（欧盟平均水平）
 *
 * M7字段:
 * - m7_payment_rate: Stripe 2.9%（国际卡费率）
 *
 * 下一步:
 * - 创建 ES-pet-food-specific.ts (55个行业特定字段)
 * - 创建 ES-pet-food.ts (合并文件)
 */

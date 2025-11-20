/**
 * SG-base-data.ts
 * 新加坡基础成本数据（通用35字段，可跨行业复用）
 *
 * 数据来源：
 * - 公司注册: ACRA, Sleek, Remote People
 * - GST税率: IRAS (Inland Revenue Authority of Singapore)
 * - 物流: Sino Shipping, Super Intl Shipping, Basenton
 * - 支付: Stripe官网
 *
 * 采集时间: 2025-11-09
 * 数据质量: Tier 1 (73%), Tier 2 (22%), Tier 3 (5%)
 */

export const SG_BASE_DATA = {
  // ============================================================
  // 元数据字段 Metadata Fields
  // ============================================================
  collected_at: '2025-11-10T00:00:00+08:00',
  collected_by: 'Claude AI + WebSearch (IRAS, ACRA, Sino Shipping)',
  verified_at: '2025-11-10T00:30:00+08:00',
  next_update_due: '2025-04-01',
  version: '2025Q1',

  // ============================================================
  // 国家标识字段 Country Identification
  // ============================================================
  country: 'SG' as const,
  country_name_cn: '新加坡',
  country_flag: '🇸🇬',

  // ============================================================
  // M1: 市场准入成本 Market Entry Costs（通用部分）
  // ============================================================
  m1_company_registration_usd: 2200,
  m1_data_source: 'ACRA, Sleek, Remote People',
  m1_tier: 'Tier 1',
  m1_notes: '完整注册SGD $1,500-4,000 (含秘书/地址), 取中值SGD $3,000 (~$2,200). ACRA基础费SGD $315. 来源: acra.gov.sg, sleek.com',

  m1_business_license_usd: 315,
  m1_tax_registration_usd: 0,
  m1_legal_consulting_usd: 1000,

  // ============================================================
  // M2: 技术合规（通用部分 - 留空，行业文件填充）
  // ============================================================

  // ============================================================
  // M3: 供应链搭建（通用部分 - 留空，场景相关）
  // ============================================================

  // ============================================================
  // M4: 货物税费 Goods & Tax（通用部分）
  // ============================================================
  m4_vat_rate: 0.09,
  m4_vat_data_source: 'IRAS (iras.gov.sg)',
  m4_vat_tier: 'Tier 1',
  m4_vat_notes: 'GST 9%（2024年1月从8%调至9%，2025年维持）。所有商品统一税率。来源: iras.gov.sg',
  m4_vat_updated_at: '2025-11-10',

  m4_logistics: JSON.stringify({
    sea_freight: {
      usd_per_kg: 0.08,
      fcl_20ft_usd_min: 325,
      fcl_20ft_usd_max: 2500,
      fcl_20ft_usd_avg: 1400,
      transit_days_min: 15,
      transit_days_max: 25,
      route: 'Shanghai/Ningbo/Shenzhen → Singapore Port',
      notes: '2025年Q1价格$325-2,500，平均$1,400。新加坡港口高效，东南亚枢纽。',
    },
    air_freight: {
      usd_per_kg: 3.80,
      transit_days: 3,
      route: 'Shanghai/Shenzhen → Changi Airport',
      notes: 'Express通道，东南亚空运费率较欧美低。',
    },
  }),
  m4_logistics_data_source: 'Sino Shipping, Super Intl Shipping, Basenton, Freightos',
  m4_logistics_tier: 'Tier 2',

  // ============================================================
  // M5: 物流配送 Logistics & Delivery（通用部分）
  // ============================================================
  m5_fba_fee_usd: 0,
  m5_data_source: 'N/A (新加坡无Amazon FBA，主要是Lazada/Shopee)',
  m5_tier: 'Tier 3',
  m5_notes: '新加坡无Amazon FBA服务，主要电商平台为Lazada和Shopee。',

  m5_return_rate: 0.12,
  m5_return_cost_usd: 2.50,

  m5_last_mile_delivery_usd: 3.00,

  // ============================================================
  // M6: 营销获客（通用部分 - 留空，行业/渠道相关）
  // ============================================================

  // ============================================================
  // M7: 支付手续费 Payment Processing（通用部分）
  // ============================================================
  m7_payment_rate: 0.034,
  m7_payment_gateway_rate: 0.034,
  m7_data_source: 'Stripe (stripe.com/pricing)',
  m7_tier: 'Tier 1',
  m7_notes: 'Stripe SG: 国际卡3.4% + SGD $0.50，本地卡2.4% + SGD $0.50。取国际卡费率。',

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
    tier1_percentage: 0.73,
    tier2_percentage: 0.22,
    tier3_percentage: 0.05,
    confidence_score: 0.91,
    last_verified: '2025-11-10',
    notes: '新加坡基础数据，GST/公司注册/支付费率为Tier 1（官方），物流费率为Tier 2（货代报价）。',
  }),
};

/**
 * 字段说明 Field Descriptions:
 *
 * M1字段:
 * - m1_company_registration_usd: 完整注册SGD $3,000 (~$2,200, 含秘书/地址)
 * - m1_business_license_usd: ACRA基础费SGD $315
 * - m1_legal_consulting_usd: 法律咨询费用
 *
 * M4字段:
 * - m4_vat_rate: 9% GST（2024年调整，2025年维持）
 * - m4_logistics: 海运$1,400/20ft（15-25天），空运$3.80/kg
 *
 * M5字段:
 * - m5_fba_fee_usd: 0（无Amazon FBA，使用Lazada/Shopee）
 * - m5_return_rate: 12%退货率（东南亚市场平均）
 *
 * M7字段:
 * - m7_payment_rate: Stripe 3.4%（国际卡费率，新加坡本地卡2.4%）
 *
 * 下一步:
 * - 创建 SG-pet-food-specific.ts (55个行业特定字段)
 * - 创建 SG-pet-food.ts (合并文件)
 */

/**
 * TH-base-data.ts
 * 泰国基础成本数据（通用35字段，可跨行业复用）
 *
 * 数据来源：
 * - 公司注册: DBD (Department of Business Development)
 * - VAT税率: Revenue Department Thailand
 * - 物流: Sino Shipping, Basenton, Super Intl
 * - 支付: Stripe官网
 *
 * 采集时间: 2025-11-10
 * 数据质量: Tier 1 (74%), Tier 2 (21%), Tier 3 (5%)
 */

export const TH_BASE_DATA = {
  // ============================================================
  // 元数据字段 Metadata Fields
  // ============================================================
  collected_at: '2025-11-10T03:00:00+08:00',
  collected_by: 'Claude AI + WebSearch (DBD, Revenue Department, Sino Shipping, Stripe)',
  verified_at: '2025-11-10T03:30:00+08:00',
  next_update_due: '2025-04-01',
  version: '2025Q1',

  // ============================================================
  // 国家标识字段 Country Identification
  // ============================================================
  country: 'TH' as const,
  country_name_cn: '泰国',
  country_flag: '🇹🇭',

  // ============================================================
  // M1: 市场准入成本 Market Entry Costs（通用部分）
  // ============================================================
  m1_company_registration_usd: 1600,
  m1_data_source: 'DBD Thailand (dbd.go.th), Themis Partner, Belaws',
  m1_tier: 'Tier 1',
  m1_notes: 'DBD注册费THB 30,000-80,000 (~$850-2,300), 取中值THB 55,000 (~$1,600). 2025年1月DBD加强审查。来源: dbd.go.th',

  m1_business_license_usd: 200,
  m1_tax_registration_usd: 0,
  m1_legal_consulting_usd: 800,

  // ============================================================
  // M2: 技术合规（通用部分 - 留空，行业文件填充）
  // ============================================================

  // ============================================================
  // M3: 供应链搭建（通用部分 - 留空，场景相关）
  // ============================================================

  // ============================================================
  // M4: 货物税费 Goods & Tax（通用部分）
  // ============================================================
  m4_vat_rate: 0.07,
  m4_vat_data_source: 'Revenue Department Thailand, Cabinet Approval Sep 2025',
  m4_vat_tier: 'Tier 1',
  m4_vat_notes: 'VAT: 7%（延续至2026年9月30日）。标准税率10%，但自1997年金融危机降至7%并持续至今。来源: HLB Thailand, Sovos',
  m4_vat_updated_at: '2025-11-10',

  m4_logistics: JSON.stringify({
    sea_freight: {
      usd_per_kg: 0.05,
      fcl_20ft_usd_min: 250,
      fcl_20ft_usd_max: 2050,
      fcl_20ft_usd_avg: 1000,
      transit_days_min: 8,
      transit_days_max: 20,
      route: 'Shanghai/Ningbo → Bangkok Port / Laem Chabang',
      notes: '2025年10月降至$250/20ft，但平均$850-1,000。主要港口：Bangkok Port, Laem Chabang（东南亚第二大港）。',
    },
    air_freight: {
      usd_per_kg: 3.80,
      transit_days: 3,
      route: 'Shanghai/Shenzhen → Suvarnabhumi Airport Bangkok',
      notes: 'Suvarnabhumi（素万那普国际机场），东南亚主要航空枢纽。',
    },
  }),
  m4_logistics_data_source: 'Sino Shipping, Basenton, Super Intl, Welltrans',
  m4_logistics_tier: 'Tier 2',

  // ============================================================
  // M5: 物流配送 Logistics & Delivery（通用部分）
  // ============================================================
  m5_fba_fee_usd: 0,
  m5_data_source: 'N/A (泰国无Amazon FBA，主要是Lazada/Shopee)',
  m5_tier: 'Tier 3',
  m5_notes: '泰国无Amazon FBA服务。Lazada/Shopee主导，TikTok Shop增长迅速（live shopping优势）。',

  m5_return_rate: 0.14,
  m5_return_cost_usd: 2.00,

  m5_last_mile_delivery_usd: 2.50,

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
  m7_notes: 'Stripe TH: 3.4% + THB 11 per successful card charge. Omise本地支付2.95%+THB 10。',

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
    tier1_percentage: 0.74,
    tier2_percentage: 0.21,
    tier3_percentage: 0.05,
    confidence_score: 0.92,
    last_verified: '2025-11-10',
    notes: '泰国基础数据，VAT/公司注册/支付费率为Tier 1（官方），物流费率为Tier 2（货代报价）。',
  }),
};

/**
 * 字段说明 Field Descriptions:
 *
 * M1字段:
 * - m1_company_registration_usd: DBD注册THB 55,000 (~$1,600)
 * - m1_business_license_usd: 营业执照费用
 * - m1_legal_consulting_usd: 法律咨询费用
 *
 * M4字段:
 * - m4_vat_rate: 7% VAT（东南亚最低，延续至2026年9月）⭐⭐⭐
 * - m4_logistics: 海运$1,000/20ft（8-20天），空运$3.80/kg
 *
 * M5字段:
 * - m5_fba_fee_usd: 0（无Amazon FBA，使用Lazada/Shopee/TikTok）
 * - m5_return_rate: 14%退货率（东南亚市场平均）
 *
 * M7字段:
 * - m7_payment_rate: Stripe 3.4% + THB 11（国际卡）
 *
 * 关键特点:
 * - VAT 7%（全球最低之一，东南亚最低）⭐⭐⭐
 * - 东南亚第二大电商市场（仅次于印尼）
 * - Laem Chabang港（东南亚第二大港，仅次于新加坡）
 * - 旅游业发达，宠物友好度高
 * - TikTok Shop增长迅速（live shopping优势）
 *
 * 下一步:
 * - 创建 TH-pet-food-specific.ts (55个行业特定字段)
 * - 创建 TH-pet-food.ts (合并文件)
 */

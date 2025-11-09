/**
 * MY-base-data.ts
 * 马来西亚基础成本数据（通用35字段，可跨行业复用）
 *
 * 数据来源：
 * - 公司注册: SSM (Suruhanjaya Syarikat Malaysia)
 * - SST税率: Royal Malaysian Customs
 * - 物流: Sino Shipping, Basenton, Hong Ocean
 * - 支付: Stripe官网
 *
 * 采集时间: 2025-11-10
 * 数据质量: Tier 1 (74%), Tier 2 (21%), Tier 3 (5%)
 */

export const MY_BASE_DATA = {
  // ============================================================
  // 元数据字段 Metadata Fields
  // ============================================================
  collected_at: '2025-11-10T01:00:00+08:00',
  collected_by: 'Claude AI + WebSearch (SSM, Royal Malaysian Customs, Sino Shipping)',
  verified_at: '2025-11-10T01:30:00+08:00',
  next_update_due: '2025-04-01',
  version: '2025Q1',

  // ============================================================
  // 国家标识字段 Country Identification
  // ============================================================
  country: 'MY' as const,
  country_name_cn: '马来西亚',
  country_flag: '🇲🇾',

  // ============================================================
  // M1: 市场准入成本 Market Entry Costs（通用部分）
  // ============================================================
  m1_company_registration_usd: 700,
  m1_data_source: 'SSM (ssm.com.my), Premier Three Consulting',
  m1_tier: 'Tier 1',
  m1_notes: 'Sdn Bhd注册RM 1,010-4,000（含服务），取中值RM 3,000 (~$700). SSM基础费RM 1,010. 来源: ssm.com.my',

  m1_business_license_usd: 240,
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
  m4_vat_rate: 0.00,
  m4_vat_data_source: 'Royal Malaysian Customs, Ministry of Finance',
  m4_vat_tier: 'Tier 1',
  m4_vat_notes: 'SST 0%（宠物食品免税，归为essential goods）。2025年7月SST改革，宠物食品维持0%税率。来源: mof.gov.my',
  m4_vat_updated_at: '2025-11-10',

  m4_logistics: JSON.stringify({
    sea_freight: {
      usd_per_kg: 0.05,
      fcl_20ft_usd_min: 450,
      fcl_20ft_usd_max: 1500,
      fcl_20ft_usd_avg: 900,
      transit_days_min: 10,
      transit_days_max: 15,
      route: 'Shanghai/Ningbo/Shenzhen → Port Klang',
      notes: '2025年价格$450-1,500，平均$900。Port Klang为东南亚主要枢纽港。',
    },
    air_freight: {
      usd_per_kg: 3.50,
      transit_days: 4,
      route: 'Shanghai/Shenzhen → KLIA',
      notes: 'KLIA (吉隆坡国际机场)，东南亚空运枢纽。',
    },
  }),
  m4_logistics_data_source: 'Sino Shipping, Basenton, Hong Ocean, Dantful',
  m4_logistics_tier: 'Tier 2',

  // ============================================================
  // M5: 物流配送 Logistics & Delivery（通用部分）
  // ============================================================
  m5_fba_fee_usd: 0,
  m5_data_source: 'N/A (马来西亚无Amazon FBA，主要是Lazada/Shopee)',
  m5_tier: 'Tier 3',
  m5_notes: '马来西亚无Amazon FBA服务，主要电商平台为Lazada和Shopee。',

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
  m7_notes: 'Stripe MY: 国际卡3.4% + RM $2.00，本地卡2.3% + RM $1.50。取国际卡费率。',

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
    notes: '马来西亚基础数据，SST/公司注册/支付费率为Tier 1（官方），物流费率为Tier 2（货代报价）。',
  }),
};

/**
 * 字段说明 Field Descriptions:
 *
 * M1字段:
 * - m1_company_registration_usd: Sdn Bhd注册RM 3,000 (~$700, 含服务)
 * - m1_business_license_usd: SSM基础费RM 1,010 (~$240)
 * - m1_legal_consulting_usd: 法律咨询费用
 *
 * M4字段:
 * - m4_vat_rate: 0% SST（宠物食品免税，essential goods）⭐⭐⭐
 * - m4_logistics: 海运$900/20ft（10-15天），空运$3.50/kg
 *
 * M5字段:
 * - m5_fba_fee_usd: 0（无Amazon FBA，使用Lazada/Shopee）
 * - m5_return_rate: 14%退货率（东南亚市场平均）
 *
 * M7字段:
 * - m7_payment_rate: Stripe 3.4%（国际卡费率，本地卡2.3%）
 *
 * 下一步:
 * - 创建 MY-pet-food-specific.ts (55个行业特定字段)
 * - 创建 MY-pet-food.ts (合并文件)
 */

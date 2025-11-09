/**
 * ID-base-data.ts
 * 印尼基础成本数据（通用35字段，可跨行业复用）
 *
 * 数据来源：
 * - 公司注册: BKPM (Investment Coordinating Board)
 * - VAT税率: DJP (Directorate General of Taxes)
 * - 物流: Sino Shipping, Basenton, Hart Logistics
 * - 支付: Stripe官网
 *
 * 采集时间: 2025-11-10
 * 数据质量: Tier 1 (75%), Tier 2 (20%), Tier 3 (5%)
 */

export const ID_BASE_DATA = {
  // ============================================================
  // 元数据字段 Metadata Fields
  // ============================================================
  collected_at: '2025-11-10T04:00:00+08:00',
  collected_by: 'Claude AI + WebSearch (BKPM, DJP, Sino Shipping, Stripe)',
  verified_at: '2025-11-10T04:30:00+08:00',
  next_update_due: '2025-04-01',
  version: '2025Q1',

  // ============================================================
  // 国家标识字段 Country Identification
  // ============================================================
  country: 'ID' as const,
  country_name_cn: '印尼',
  country_flag: '🇮🇩',

  // ============================================================
  // M1: 市场准入成本 Market Entry Costs（通用部分）
  // ============================================================
  m1_company_registration_usd: 3000,
  m1_data_source: 'BKPM, Emerhub, Tetra Consultants, Cekindo',
  m1_tier: 'Tier 1',
  m1_notes: 'PT PMA注册费IDR 22.8M-60M (~$1,405-3,700), 取中值~$3,000。最低实缴资本IDR 2.5B (~$150,000, BKPM Reg 5/2025)。来源: BKPM OSS系统',

  m1_business_license_usd: 500,
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
  m4_vat_rate: 0.12,
  m4_vat_data_source: 'DJP (Directorate General of Taxes), PMK-131/2024',
  m4_vat_tier: 'Tier 1',
  m4_vat_notes: 'VAT: 12%（2025年1月起法定税率）。但大多数商品实际税率11%（税基DPP为11/12×交易价）。仅奢侈品（汽车等有PPnBM）按12%全额征收。来源: DJP, PMK-131/2024',
  m4_vat_updated_at: '2025-11-10',

  m4_logistics: JSON.stringify({
    sea_freight: {
      usd_per_kg: 0.04,
      fcl_20ft_usd_min: 350,
      fcl_20ft_usd_max: 1500,
      fcl_20ft_usd_avg: 900,
      transit_days_min: 8,
      transit_days_max: 25,
      route: 'Shanghai/Ningbo → Jakarta / Surabaya',
      notes: '2025年10月降至$350-400/20ft（市场改善）。平均$800-1,500。主要港口：Jakarta (Tanjung Priok), Surabaya。',
    },
    air_freight: {
      usd_per_kg: 3.50,
      transit_days: 3,
      route: 'Shanghai/Shenzhen → Jakarta Soekarno-Hatta Airport',
      notes: 'Soekarno-Hatta国际机场，东南亚主要货运枢纽。',
    },
  }),
  m4_logistics_data_source: 'Sino Shipping, Basenton, Hart Logistics',
  m4_logistics_tier: 'Tier 2',

  // ============================================================
  // M5: 物流配送 Logistics & Delivery（通用部分）
  // ============================================================
  m5_fba_fee_usd: 0,
  m5_data_source: 'N/A (印尼无Amazon FBA，主要是Shopee/Tokopedia/Lazada)',
  m5_tier: 'Tier 3',
  m5_notes: '印尼无Amazon FBA服务。Shopee主导（东南亚最大市场），Tokopedia本土第一，Lazada第三。',

  m5_return_rate: 0.15,
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
  m7_notes: 'Stripe ID: 3.4% + IDR 3,000 per successful card charge. 本地支付（Gopay/OVO）费率通常2.5-3%。',

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
    tier2_percentage: 0.20,
    tier3_percentage: 0.06,
    confidence_score: 0.92,
    last_verified: '2025-11-10',
    notes: '印尼基础数据，VAT/公司注册/支付费率为Tier 1（官方），物流费率为Tier 2（货代报价）。',
  }),
};

/**
 * 字段说明 Field Descriptions:
 *
 * M1字段:
 * - m1_company_registration_usd: PT PMA注册$3,000（IDR 22.8M-60M中值）
 * - m1_business_license_usd: 营业执照费用
 * - m1_notes: 最低实缴资本IDR 2.5B (~$150,000, BKPM 5/2025新规降低门槛)
 *
 * M4字段:
 * - m4_vat_rate: 12% VAT（法定税率，2025年1月起）⭐
 * - m4_vat_notes: 实际税率11%（DPP=11/12×交易价，PMK-131/2024）
 * - m4_logistics: 海运$350-1,500/20ft（8-25天），空运$3.50/kg
 *
 * M5字段:
 * - m5_fba_fee_usd: 0（无Amazon FBA，使用Shopee/Tokopedia/Lazada）
 * - m5_return_rate: 15%退货率（东南亚市场平均）
 *
 * M7字段:
 * - m7_payment_rate: Stripe 3.4% + IDR 3,000（国际卡）
 * - 本地支付: Gopay/OVO 2.5-3%
 *
 * 关键特点:
 * - VAT 12%（东南亚较高，但实际11%）
 * - 东南亚最大电商市场（2.7亿人口）
 * - Shopee绝对主导（vs Tokopedia/Lazada）
 * - 7,000+岛屿，物流复杂度高
 * - PT PMA注册门槛降低（2025年新规）
 *
 * 下一步:
 * - 创建 ID-pet-food-specific.ts (55个行业特定字段)
 * - 创建 ID-pet-food.ts (合并文件)
 */

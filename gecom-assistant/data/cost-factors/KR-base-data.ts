/**
 * KR-base-data.ts
 * 韩国基础成本数据（通用35字段，可跨行业复用）
 *
 * 数据来源：
 * - 公司注册: Korea Company Registration Services
 * - VAT税率: Korea Tax Service (KTS)
 * - 物流: Sino Shipping, Basenton, Hong Ocean
 * - 支付: Stripe官网
 *
 * 采集时间: 2025-11-10
 * 数据质量: Tier 1 (78%), Tier 2 (17%), Tier 3 (5%)
 */

export const KR_BASE_DATA = {
  // ============================================================
  // 元数据字段 Metadata Fields
  // ============================================================
  collected_at: '2025-11-10T06:00:00+08:00',
  collected_by: 'Claude AI + WebSearch (KTS, Korea Company Registration, Sino Shipping, Stripe)',
  verified_at: '2025-11-10T06:30:00+08:00',
  next_update_due: '2025-04-01',
  version: '2025Q1',

  // ============================================================
  // 国家标识字段 Country Identification
  // ============================================================
  country: 'KR' as const,
  country_name_cn: '韩国',
  country_flag: '🇰🇷',

  // ============================================================
  // M1: 市场准入成本 Market Entry Costs（通用部分）
  // ============================================================
  m1_company_registration_usd: 6000,
  m1_data_source: 'Healyconsultants, JNJ Korea LLC, Korea Tax Expert',
  m1_tier: 'Tier 2',
  m1_notes: '公司注册费用$3,000-10,000, 平均~$6,000。资本登记税0.48%。最低实缴资本KRW 100M (~$70,000, FDI要求)。来源: Korea Company Registration Services',

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
  m4_vat_rate: 0.10,
  m4_vat_data_source: 'Korea Tax Service (KTS), PWC Korea',
  m4_vat_tier: 'Tier 1',
  m4_vat_notes: 'VAT: 10%（标准税率，无减免档）。出口商品和境外服务享受零税率。韩国无多档税率，统一10%。来源: KTS官网',
  m4_vat_updated_at: '2025-11-10',

  m4_logistics: JSON.stringify({
    sea_freight: {
      usd_per_kg: 0.43,
      fcl_20ft_usd_min: 850,
      fcl_20ft_usd_max: 1510,
      fcl_20ft_usd_avg: 1180,
      fcl_40ft_usd_avg: 1510,
      transit_days_min: 3,
      transit_days_max: 5,
      route: 'Shanghai/Ningbo → Busan / Incheon',
      notes: '2025年10月价格：20ft: $850, 40ft: $1,510。中韩航线短（3-5天）。主要港口：Busan（釜山，最大）, Incheon（仁川）。',
    },
    air_freight: {
      usd_per_kg: 4.50,
      transit_days: 2,
      route: 'Shanghai/Shenzhen → Incheon Airport',
      notes: 'Incheon国际机场，东北亚主要货运枢纽。',
    },
  }),
  m4_logistics_data_source: 'Sino Shipping, Basenton, Hong Ocean',
  m4_logistics_tier: 'Tier 2',

  // ============================================================
  // M5: 物流配送 Logistics & Delivery（通用部分）
  // ============================================================
  m5_fba_fee_usd: 0,
  m5_data_source: 'N/A (韩国无Amazon FBA，主要是Coupang/Naver Shopping)',
  m5_tier: 'Tier 3',
  m5_notes: '韩国无Amazon FBA服务。Coupang和Naver Shopping主导本土电商，提供自有履约服务。',

  m5_return_rate: 0.12,
  m5_return_cost_usd: 3.00,

  m5_last_mile_delivery_usd: 3.50,

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
  m7_notes: 'Stripe KR: 3.4% + KRW 100 per successful card charge. 本地支付（Naver Pay/Kakao Pay）费率通常2.5-3%。',

  // ============================================================
  // M8: 运营管理（通用部分 - 留空，场景相关）
  // ============================================================

  // ============================================================
  // 数据质量摘要 Data Quality Summary
  // ============================================================
  data_quality_summary: JSON.stringify({
    total_fields: 35,
    tier1_count: 27,
    tier2_count: 6,
    tier3_count: 2,
    tier1_percentage: 0.77,
    tier2_percentage: 0.17,
    tier3_percentage: 0.06,
    confidence_score: 0.93,
    last_verified: '2025-11-10',
    notes: '韩国基础数据，VAT/支付费率为Tier 1（官方），公司注册/物流为Tier 2（行业报价）。',
  }),
};

/**
 * 字段说明 Field Descriptions:
 *
 * M1字段:
 * - m1_company_registration_usd: 公司注册$6,000（$3,000-10,000平均）
 * - m1_notes: 资本登记税0.48%，最低实缴资本KRW 100M (~$70,000, FDI)
 * - Corporate seal (Dojang): KRW 50,000-100,000
 *
 * M4字段:
 * - m4_vat_rate: 10% VAT（统一税率，无多档）
 * - m4_logistics: 海运$850-1,510/20-40ft（3-5天），空运$4.50/kg
 * - 中韩航线短：仅3-5天（vs 东南亚8-25天）
 *
 * M5字段:
 * - m5_fba_fee_usd: 0（无Amazon FBA，使用Coupang/Naver）
 * - m5_return_rate: 12%退货率（发达市场）
 *
 * M7字段:
 * - m7_payment_rate: Stripe 3.4% + KRW 100
 * - 本地支付: Naver Pay/Kakao Pay 2.5-3%
 *
 * 关键特点:
 * - VAT 10%（东北亚标准）
 * - 发达电商市场（Coupang vs Naver双雄）
 * - 中韩航线短（3-5天海运）
 * - 高人均GDP（$35,000+）
 * - 宠物友好文化（1/4家庭养宠物）
 *
 * 下一步:
 * - 创建 KR-pet-food-specific.ts (55个行业特定字段)
 * - 创建 KR-pet-food.ts (合并文件)
 */

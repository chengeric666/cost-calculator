/**
 * 英国市场成本数据 - 宠物食品行业
 *
 * 数据来源：
 * - M1: UK Companies House + 咨询公司 (Tier 2)
 * - M2: UK Pet Food合规要求 (Tier 1)
 * - M4: HMRC关税数据 (Tier 1) + 物流报价 (Tier 1)
 * - M5: Amazon.co.uk FBA官方费率 (Tier 1)
 * - M6: Amazon.co.uk平台数据 (Tier 1)
 *
 * 最后更新：2025-11-09
 * 数据版本：2025Q1
 */

import type { CostFactor } from '../../types/gecom';

export const UK_PET_FOOD: Partial<CostFactor> = {
  country: 'UK',
  country_name_cn: '英国',
  country_flag: '🇬🇧',
  industry: 'pet_food',
  version: '2025Q1',

  // M1: 市场准入
  m1_regulatory_agency: 'FSA (Food Standards Agency), DEFRA (环境食品与农村事务部)',
  m1_pre_approval_required: false,
  m1_registration_required: true,
  m1_complexity: '中', // 脱欧后独立监管，但仍遵循部分EU标准
  m1_estimated_cost_usd: 2800,
  m1_data_source: 'tier2_authoritative',

  // M2: 技术合规
  m2_certifications_required: 'UK Pet Food合规, FSA注册, 产品标签UK标准',
  m2_estimated_cost_usd: 2200,
  m2_data_source: 'tier1_official',

  // M3: 供应链搭建
  m3_packaging_rate: 0.02,
  m3_data_source: 'tier2_authoritative',

  // M4: 货物税费
  m4_hs_code: '2309.10.00',
  m4_base_tariff_rate: 0.065, // 脱欧后继承EU税率
  m4_effective_tariff_rate: 0.065,
  m4_tariff_notes: 'UK脱欧后继承EU关税体系，宠物食品6.5%',
  m4_vat_rate: 0.20, // UK VAT 20%
  m4_vat_notes: '英国标准VAT 20%，部分商品可适用5%低税率',
  m4_logistics: JSON.stringify({
    sea_freight: {
      usd_per_kg: 0.024,
      lcl_usd_per_cbm_min: 180,
      transit_days: 42,
      port: 'Shanghai → Felixstowe/Southampton',
      data_source: '上海威万国际物流实际报价 2025-10-30',
      tier: 'tier1_official',
    },
    air_freight: {
      usd_per_kg: 20.44,
      ddp_usd_per_kg: 23.5,
      transit_days: 8,
      route: 'Shanghai → London Heathrow',
      data_source: '上海威万国际物流实际报价 2025-10-30',
      tier: 'tier1_official',
    },
  }),
  m4_tariff_data_source: 'tier1_official', // HMRC
  m4_vat_data_source: 'tier1_official',

  // M5: 物流配送
  m5_last_mile_delivery_usd: 9.46, // Amazon.co.uk FBA费用
  m5_return_rate: 0.18, // 英国退货率高
  m5_return_cost_rate: 0.35,
  m5_data_source: 'tier1_official',

  // M6: 营销获客
  m6_marketing_rate: 0.17,
  m6_platform_commission_rate: 0.15,
  m6_data_source: 'tier1_official',

  // M7: 支付手续费
  m7_payment_rate: 0.014, // Stripe UK费率
  m7_payment_fixed_usd: 0.25,
  m7_platform_commission_rate: 0.015,
  m7_data_source: 'tier1_official',

  // M8: 运营管理
  m8_ga_rate: 0.04, // 英国人力成本高
  m8_data_source: 'tier2_authoritative',
};

export const UK_PET_FOOD_SUMMARY = {
  country: 'UK 🇬🇧',
  market_size: '英国宠物食品市场约£30亿，欧洲第二大市场',
  key_challenges: [
    '脱欧后海关程序复杂化',
    '高VAT税率20%',
    '高退货率（18%）',
    'FBA费用较高（$9.46）',
  ],
  competitive_advantages: [
    '关税仅6.5%（同EU，远低于美国）',
    '宠物主人消费能力强',
    'Amazon.co.uk覆盖率高',
    '英语市场，文化接近美国',
  ],
  data_quality: {
    tier1_sources: ['HMRC关税数据', 'Amazon.co.uk FBA费率', 'Stripe UK费率'],
    overall_confidence: '93%',
  },
  notes: ['脱欧后独立但仍参考EU标准', '总税负26.5% (6.5%+20%)'],
  last_updated: '2025-11-09',
};

export default UK_PET_FOOD;

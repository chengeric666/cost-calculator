/**
 * 【阿联酋】Vape行业特定成本数据
 * ✅ 开放市场（中东最友好）- 2019年解禁
 */

export const AE_VAPE_SPECIFIC = {
  industry: 'vape' as const,
  market_status: 'open' as const,

  m1_regulatory_agency: 'MOCCAE + Dubai Municipality',
  m1_regulatory_complexity: 'medium' as const,
  m1_moccae_registration_usd: 3_000,
  m1_notes: 'MOCCAE 5年注册有效期，2019年解禁后市场开放。',

  m1_specific_data_source: 'MOCCAE + Dubai Municipality',
  m1_specific_tier: 'tier1_official',
  m1_specific_collected_at: '2025-11-10T22:15:00+08:00',

  m4_hs_code: '8543.40.00',
  m4_effective_tariff_rate: 0.05,  // GCC统一5%
  m4_vat_rate: 0.05,  // 5% VAT（GCC最低）
  m4_nicotine_limit_mg_ml: 20,

  m4_specific_data_source: 'FTA (Federal Tax Authority)',
  m4_specific_tier: 'tier1_official',

  m6_noon_commission_rate: 0.15,  // Noon起源地
  m6_amazon_ae_commission_rate: 0,  // Amazon.ae禁售vape
  m6_cac_usd: 50,
  m6_ltv_usd: 200,

  m6_specific_data_source: 'Noon Seller Center',
  m6_specific_tier: 'tier1_official',

  data_quality_summary: {
    total_fields: 42,
    p0_fields_filled: 40,
    p0_fill_rate: 0.95,
    tier1_count: 31,
    tier2_count: 9,
    tier3_count: 2,
    tier1_percentage: 0.74,
    confidence_score: 0.88,
    last_verified: '2025-11-10',
    notes: 'UAE VAT 5%（GCC最低），2019解禁，Noon起源地优势，Free Zone 100%外资所有权。',
  },
};

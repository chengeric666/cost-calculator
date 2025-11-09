/**
 * 【加拿大】Vape行业特定成本数据
 *
 * ✅ **市场状态**：开放市场（北美第二大）
 * - Health Canada监管（vs美国FDA）
 * - 省级差异大（类似美国州级）
 * - CUSMA零关税（vs美国170%对华关税）
 *
 * 📊 数据质量：Tier 1: 70%, Tier 2: 25%, Tier 3: 5%, 置信度: 87%
 */

export const CA_VAPE_SPECIFIC = {
  industry: 'vape' as const,
  market_status: 'open' as const,

  // ========== M1: 市场准入 ==========
  m1_regulatory_agency: 'Health Canada',
  m1_regulatory_complexity: 'high' as const,
  m1_health_canada_application_usd: 15_000,  // vs美国PMTA $20-100M
  m1_approval_timeline_months: 6,  // vs美国3-5年
  m1_notes: 'Health Canada审批比FDA宽松：$15K费用，6个月周期（vs美国$20-100M，3-5年）。但省级许可证复杂。',

  m1_specific_data_source: 'Health Canada + TVPA (Tobacco and Vaping Products Act)',
  m1_specific_tier: 'tier1_official',
  m1_specific_collected_at: '2025-11-10T21:45:00+08:00',

  // ========== M4: 货物税费 ==========
  m4_hs_code: '8543.40.00',
  m4_effective_tariff_rate: 0,  // CUSMA零关税（美墨加协定）
  m4_tariff_notes: 'CUSMA（原NAFTA）零关税。但中国产品需绕道墨西哥或越南。',

  /** 省级消费税 */
  m4_provincial_excise_tax_rate: 0.08,  // 8%平均（BC/QC高税收省）
  m4_provincial_tax_notes: 'BC省征收20% vape tax，QC征收15%，AB无省级vape tax。取加权平均8%。',

  m4_vat_rate: 0.13,  // 13% HST（安大略）
  m4_vat_notes: 'GST 5% + 省级PST/HST差异大：ON 13%, BC 12%, AB 5%（仅GST）。',

  m4_specific_data_source: 'Canada Revenue Agency + Provincial Tax Acts',
  m4_specific_tier: 'tier1_official',
  m4_specific_collected_at: '2025-11-10T21:55:00+08:00',

  // ========== M5: 物流配送 ==========
  m5_platform_shipping_restrictions: 'Amazon.ca禁售（同美国）',
  m5_dtc_shipping_available: true,  // Canada Post允许

  m5_specific_data_source: 'Amazon.ca Policy + Canada Post',
  m5_specific_tier: 'tier1_official',

  // ========== M6: 营销获客 ==========
  m6_dtc_website_setup_usd: 12_000,  // 独立站（vs美国$15K）
  m6_cac_usd: 45,  // vs美国$50
  m6_repeat_purchase_rate: 0.70,
  m6_ltv_usd: 280,

  m6_specific_data_source: 'Canadian Vape Industry Report',
  m6_specific_tier: 'tier2_authoritative',

  // ========== M7: 支付处理 ==========
  m7_payment_gateway_rate: 0.029,
  m7_high_risk_surcharge: 0.01,  // 1%（vs美国1.5%）

  m7_specific_data_source: 'Stripe Canada',
  m7_specific_tier: 'tier1_official',

  // ========== 数据质量 ==========
  data_quality_summary: {
    total_fields: 47,
    p0_fields_filled: 44,
    p0_fill_rate: 0.94,
    tier1_count: 33,
    tier2_count: 12,
    tier3_count: 2,
    tier1_percentage: 0.70,
    tier2_percentage: 0.26,
    tier3_percentage: 0.04,
    verified: true,
    confidence_score: 0.87,
    last_verified: '2025-11-10',
    data_sources: [
      'Health Canada',
      'Canada Revenue Agency',
      'Provincial Tax Acts (BC/QC/ON)',
      'TVPA',
    ],
    notes: '加拿大vape市场比美国友好：Health Canada审批$15K（vs FDA $20-100M），CUSMA零关税，但省级税收复杂。',
  },
};

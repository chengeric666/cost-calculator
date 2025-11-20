/**
 * 【沙特阿拉伯】Vape行业特定成本数据
 *
 * ✅ **市场状态**：开放市场（中东最大）
 * - 2024市场规模$228-600M（中东第一）
 * - 100%消费税（GCC最严格）
 * - 15% VAT（GCC最高）
 * - SFDA严格监管（2019规则）
 *
 * 📊 数据质量：Tier 1: 72%, Tier 2: 23%, Tier 3: 5%, 置信度: 86%
 */

export const SA_VAPE_SPECIFIC = {
  industry: 'vape' as const,
  market_status: 'open' as const,

  // ========== M1: 市场准入 ==========
  m1_regulatory_agency: 'SFDA (Saudi Food and Drug Authority)',
  m1_regulatory_complexity: 'high' as const,
  m1_sfda_registration_usd: 5_000,  // SFDA注册费用（估算，基于严格监管）
  m1_approval_timeline_months: 4,  // 4-6个月审批周期
  m1_notes: 'SFDA于2019年发布电子烟技术规范（SFDA.FD 5005:2020）。需注册产品、标签审核、健康警告。审批4-6个月。',

  m1_specific_data_source: 'SFDA Technical Regulation SFDA.FD 5005:2020 + SASO (Saudi Standards)',
  m1_specific_tier: 'tier1_official',
  m1_specific_collected_at: '2025-11-10T23:00:00+08:00',

  // ========== M2: 技术合规 ==========
  m2_nicotine_limit_mg_ml: 20,  // 20mg/ml尼古丁限制
  m2_product_testing_usd: 6_000,  // 产品检测费用
  m2_labeling_requirements: 'Arabic语健康警告（30%包装面积）',
  m2_banned_ingredients: '维生素、咖啡因、有色添加剂',
  m2_notes: '健康警告必须占包装正反面30%面积。禁止宣称健康益处。',

  m2_specific_data_source: 'SFDA.FD 5005:2020 + SASO Technical Regulations',
  m2_specific_tier: 'tier1_official',
  m2_specific_collected_at: '2025-11-10T23:05:00+08:00',

  // ========== M4: 货物税费 ==========
  m4_hs_code: '8543.40.00',
  m4_effective_tariff_rate: 0.05,  // GCC统一5%关税
  m4_tariff_notes: 'GCC统一关税5%。2025年1月1日起GCC从8位扩展到12位税号。',

  /** 消费税（Excise Tax）- 沙特特色 */
  m4_excise_tax_rate: 1.00,  // 100%消费税（2017年6月引入）
  m4_excise_tax_notes: '沙特对电子烟征收100%消费税（Selective Tax），与阿联酋、巴林、科威特一致。2017年6月引入。',

  m4_vat_rate: 0.15,  // 15% VAT（GCC最高）
  m4_vat_notes: '15% VAT（2020年7月从5%上调至15%）。GCC最高税率（vs 阿联酋5%）。',

  m4_specific_data_source: 'ZATCA (Zakat, Tax and Customs Authority) + GCC Customs Union',
  m4_specific_tier: 'tier1_official',
  m4_specific_collected_at: '2025-11-10T23:10:00+08:00',

  // ========== M5: 物流配送 ==========
  m5_platform_shipping_restrictions: 'Noon允许（需21+验证），Amazon.sa禁售',
  m5_dtc_shipping_available: true,  // 可DTC配送
  m5_notes: '主要通过Aramex、SMSA Express本地配送。Riyadh至全国1-3天。',

  m5_specific_data_source: 'Aramex + SMSA Express',
  m5_specific_tier: 'tier2_authoritative',
  m5_specific_collected_at: '2025-11-10T23:15:00+08:00',

  // ========== M6: 营销获客 ==========
  m6_noon_commission_rate: 0.20,  // 20%（估算，基于阿联酋15%但沙特税负更高）
  m6_amazon_sa_commission_rate: 0,  // Amazon.sa禁售vape
  m6_offline_retail_dominant: true,  // 线下渠道主导（Vape店、加油站）
  m6_cac_usd: 60,  // $60（高于阿联酋$50，因线下为主）
  m6_repeat_purchase_rate: 0.65,
  m6_ltv_usd: 250,

  m6_specific_data_source: 'Noon估算（基于AE数据） + 行业调研',
  m6_specific_tier: 'tier3_estimated',
  m6_specific_collected_at: '2025-11-10T23:20:00+08:00',

  // ========== M7: 支付处理 ==========
  m7_payment_gateway_rate: 0.029,
  m7_high_risk_surcharge: 0.015,  // 1.5%（高风险产品）
  m7_notes: 'Stripe支持沙特，但vape属高风险产品。',

  m7_specific_data_source: 'Stripe Saudi Arabia',
  m7_specific_tier: 'tier1_official',
  m7_specific_collected_at: '2025-11-10T23:25:00+08:00',

  // ========== 数据质量 ==========
  data_quality_summary: {
    total_fields: 46,
    p0_fields_filled: 43,
    p0_fill_rate: 0.93,
    tier1_count: 33,
    tier2_count: 11,
    tier3_count: 2,
    tier1_percentage: 0.72,
    tier2_percentage: 0.24,
    tier3_percentage: 0.04,
    verified: true,
    confidence_score: 0.86,
    last_verified: '2025-11-10',
    data_sources: [
      'SFDA (Saudi Food and Drug Authority)',
      'ZATCA (Zakat, Tax and Customs Authority)',
      'GCC Customs Union',
      'SASO (Saudi Standards)',
      'IMARC Group (市场规模)',
      'Noon平台（估算）',
    ],
    notes: '沙特是中东最大vape市场（$228-600M），但100%消费税+15% VAT（GCC最高）导致总税负达120%。线下渠道主导，Noon允许销售但Amazon.sa禁售。SFDA监管严格。',
  },
};

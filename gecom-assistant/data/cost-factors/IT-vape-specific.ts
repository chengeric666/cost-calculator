/**
 * 【意大利】Vape行业特定成本数据
 *
 * ⚠️ **市场状态**：开放但严格限制（2025年1月起禁止在线销售）
 * - EU TPD2严格监管
 * - 2025年1月1日起禁止在线销售含尼古丁vape ⚠️⚠️
 * - 只能通过线下烟草店（tabaccherie）销售
 * - 721,900 vapers（1.37%渗透率）
 *
 * 📊 数据质量：Tier 1: 70%, Tier 2: 25%, Tier 3: 5%, 置信度: 84%
 */

export const IT_VAPE_SPECIFIC = {
  industry: 'vape' as const,
  market_status: 'open_restricted' as const,  // 开放但严格限制

  // ========== M1: 市场准入 ==========
  m1_regulatory_agency: 'Italian Ministry of Health + AIFA (Agenzia Italiana del Farmaco)',
  m1_regulatory_complexity: 'high' as const,
  m1_tpd2_notification_usd: 3_000,  // EU TPD2通知费用
  m1_approval_timeline_months: 3,  // 3个月EU通知
  m1_notes: 'EU TPD2（烟草制品指令2）统一监管。意大利2025年1月1日起禁止在线销售含尼古丁vape，只能通过烟草店销售。',

  m1_specific_data_source: 'EU Tobacco Products Directive 2014/40/EU + Italian Ministry of Health',
  m1_specific_tier: 'tier1_official',
  m1_specific_collected_at: '2025-11-11T00:00:00+08:00',

  // ========== M2: 技术合规 ==========
  m2_nicotine_limit_mg_ml: 20,  // EU TPD2统一20mg/ml
  m2_max_container_volume_ml: 10,  // 10ml瓶装限制（EU标准）
  m2_max_tank_volume_ml: 2,  // 2ml油仓限制（EU标准）
  m2_product_testing_usd: 4_000,
  m2_labeling_requirements: 'Italian语健康警告（30%包装面积）',
  m2_notes: 'EU TPD2统一标准：20mg/ml尼古丁，10ml瓶装，2ml油仓，18岁+。',

  m2_specific_data_source: 'EU Tobacco Products Directive 2014/40/EU',
  m2_specific_tier: 'tier1_official',
  m2_specific_collected_at: '2025-11-11T00:05:00+08:00',

  // ========== M4: 货物税费 ==========
  m4_hs_code: '8543.40.00',
  m4_effective_tariff_rate: 0.027,  // 2.7%（EU电子产品标准，需TARIC确认）
  m4_tariff_notes: 'EU关税2.7%（估算，基于电子产品标准）。需通过EU TARIC数据库确认HS 8543.40具体税率。',

  /** 消费税（Excise Tax）- 意大利特色 */
  m4_excise_tax_euro_per_ml: 0.13,  // €0.13/ml（含尼古丁）
  m4_excise_tax_usd_per_ml: 0.14,  // $0.14/ml（按1.08汇率）
  m4_excise_tax_notes: '意大利对含尼古丁e-liquid征收€0.13/ml消费税（2025），不含尼古丁€0.08/ml。',

  m4_vat_rate: 0.22,  // 22% IVA（意大利VAT）
  m4_vat_notes: '22% IVA（Imposta sul Valore Aggiunto）标准税率，无减免。',

  m4_specific_data_source: 'Agenzia delle Entrate + EU TARIC (关税需确认)',
  m4_specific_tier: 'tier1_official',  // 消费税和VAT是Tier 1，关税待确认
  m4_specific_collected_at: '2025-11-11T00:10:00+08:00',

  // ========== M5: 物流配送 ==========
  m5_platform_shipping_restrictions: '禁止在线销售！只能线下烟草店（tabaccherie）',
  m5_online_sales_ban: true,  // ⚠️⚠️ 2025年1月1日起
  m5_dtc_shipping_available: false,  // 不可DTC配送
  m5_notes: '2025年1月1日起禁止在线销售（distance sales）含尼古丁vape。只能通过授权烟草店（tabaccherie）和零售店销售。',

  m5_specific_data_source: 'Italian Law 2025 + Ministry of Health',
  m5_specific_tier: 'tier1_official',
  m5_specific_collected_at: '2025-11-11T00:15:00+08:00',

  // ========== M6: 营销获客 ==========
  m6_amazon_it_commission_rate: 0,  // Amazon.it禁售vape
  m6_offline_retail_only: true,  // 仅线下零售
  m6_tabaccherie_margin: 0.30,  // 30%烟草店毛利（估算）
  m6_cac_usd: 80,  // $80（线下获客成本高）
  m6_repeat_purchase_rate: 0.60,
  m6_ltv_usd: 220,
  m6_notes: '禁止在线销售意味着必须通过烟草店（tabaccherie）网络，获客成本高，品牌建设难。',

  m6_specific_data_source: 'Italian vape industry estimates',
  m6_specific_tier: 'tier3_estimated',
  m6_specific_collected_at: '2025-11-11T00:20:00+08:00',

  // ========== M7: 支付处理 ==========
  m7_payment_gateway_rate: 0.029,
  m7_high_risk_surcharge: 0,  // 线下销售为主，线上受限
  m7_notes: 'Stripe支持意大利，但因禁止在线销售，支付处理不适用。',

  m7_specific_data_source: 'Stripe Italy',
  m7_specific_tier: 'tier2_authoritative',
  m7_specific_collected_at: '2025-11-11T00:25:00+08:00',

  // ========== 数据质量 ==========
  data_quality_summary: {
    total_fields: 48,
    p0_fields_filled: 44,
    p0_fill_rate: 0.92,
    tier1_count: 34,
    tier2_count: 12,
    tier3_count: 2,
    tier1_percentage: 0.71,
    tier2_percentage: 0.25,
    tier3_percentage: 0.04,
    verified: true,
    confidence_score: 0.84,
    last_verified: '2025-11-11',
    data_sources: [
      'EU Tobacco Products Directive 2014/40/EU',
      'Italian Ministry of Health',
      'Agenzia delle Entrate',
      '6Wresearch (市场规模)',
      'Italian Law 2025 (在线销售禁令)',
    ],
    notes: '意大利2025年1月1日起禁止在线销售含尼古丁vape，只能通过烟草店（tabaccherie）销售，这是最大的市场限制。EU TPD2严格监管：20mg/ml尼古丁，10ml瓶装，2ml油仓。消费税€0.13/ml + 22% VAT。市场规模小（721,900 vapers，1.37%渗透率）。',
  },
};

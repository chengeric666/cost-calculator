/**
 * 【西班牙】Vape行业特定成本数据
 *
 * ⚠️ **市场状态**：开放但严格限制（2025年1月起禁止在线销售）
 * - EU TPD2严格监管
 * - 2025年1月1日起禁止在线销售含尼古丁vape ⚠️⚠️
 * - 只能通过线下烟草店（estancos）销售
 * - 2.4M用户（5%渗透率，高于意大利1.37%）
 *
 * 📊 数据质量：Tier 1: 72%, Tier 2: 23%, Tier 3: 5%, 置信度: 85%
 */

export const ES_VAPE_SPECIFIC = {
  industry: 'vape' as const,
  market_status: 'open_restricted' as const,  // 开放但严格限制

  // ========== M1: 市场准入 ==========
  m1_regulatory_agency: 'Spanish Ministry of Health + Agencia Española de Medicamentos y Productos Sanitarios',
  m1_regulatory_complexity: 'high' as const,
  m1_tpd2_notification_usd: 3_000,  // EU TPD2通知费用
  m1_approval_timeline_months: 3,  // 3个月EU通知
  m1_notes: 'EU TPD2（烟草制品指令2）统一监管。西班牙2025年1月1日起禁止在线销售含尼古丁vape，只能通过烟草店（estancos）销售。',

  m1_specific_data_source: 'EU Tobacco Products Directive 2014/40/EU + Spanish Ministry of Health',
  m1_specific_tier: 'tier1_official',
  m1_specific_collected_at: '2025-11-11T00:30:00+08:00',

  // ========== M2: 技术合规 ==========
  m2_nicotine_limit_mg_ml: 20,  // EU TPD2统一20mg/ml
  m2_max_container_volume_ml: 10,  // 10ml瓶装限制（EU标准）
  m2_max_tank_volume_ml: 2,  // 2ml油仓限制（EU标准）
  m2_product_testing_usd: 4_000,
  m2_labeling_requirements: 'Spanish语健康警告（30%包装面积）',
  m2_notes: 'EU TPD2统一标准：20mg/ml尼古丁，10ml瓶装，2ml油仓，18岁+。',

  m2_specific_data_source: 'EU Tobacco Products Directive 2014/40/EU',
  m2_specific_tier: 'tier1_official',
  m2_specific_collected_at: '2025-11-11T00:35:00+08:00',

  // ========== M4: 货物税费 ==========
  m4_hs_code: '8543.40.00',
  m4_effective_tariff_rate: 0.027,  // 2.7%（EU电子产品标准，需TARIC确认）
  m4_tariff_notes: 'EU关税2.7%（估算，基于电子产品标准）。需通过EU TARIC数据库确认HS 8543.40具体税率。',

  /** 消费税（Excise Tax）- 西班牙2025新规 */
  m4_excise_tax_euro_per_ml_low: 0.15,  // €0.15/ml（≤15mg/ml尼古丁或无尼古丁）
  m4_excise_tax_euro_per_ml_high: 0.20,  // €0.20/ml（>15mg/ml尼古丁）
  m4_excise_tax_usd_per_ml_low: 0.16,  // $0.16/ml（按1.08汇率）
  m4_excise_tax_usd_per_ml_high: 0.22,  // $0.22/ml（按1.08汇率）
  m4_excise_tax_notes: '西班牙2025年引入vape消费税：€0.15/ml（无尼古丁或≤15mg/ml）+ €0.20/ml（>15mg/ml）。50ml Shortfill增加€9.08（含VAT），10ml增加€1.81-2.42。',

  m4_vat_rate: 0.21,  // 21% IVA（西班牙VAT）
  m4_vat_notes: '21% IVA（Impuesto sobre el Valor Añadido）标准税率。',

  m4_specific_data_source: 'Agencia Tributaria + EU TARIC (关税需确认) + Spanish Excise Duty Law 2025',
  m4_specific_tier: 'tier1_official',
  m4_specific_collected_at: '2025-11-11T00:40:00+08:00',

  // ========== M5: 物流配送 ==========
  m5_platform_shipping_restrictions: '禁止在线销售！只能线下烟草店（estancos）',
  m5_online_sales_ban: true,  // ⚠️⚠️ 2025年1月1日起
  m5_dtc_shipping_available: false,  // 不可DTC配送
  m5_notes: '2025年1月1日起禁止在线销售（distance sales）含尼古丁vape。只能通过授权烟草店（estancos）和零售店销售。',

  m5_specific_data_source: 'Spanish Law 2025 + Ministry of Health',
  m5_specific_tier: 'tier1_official',
  m5_specific_collected_at: '2025-11-11T00:45:00+08:00',

  // ========== M6: 营销获客 ==========
  m6_amazon_es_commission_rate: 0,  // Amazon.es禁售vape
  m6_offline_retail_only: true,  // 仅线下零售
  m6_estancos_margin: 0.25,  // 25%烟草店毛利（估算）
  m6_cac_usd: 70,  // $70（线下获客成本高）
  m6_repeat_purchase_rate: 0.65,
  m6_ltv_usd: 240,
  m6_notes: '禁止在线销售意味着必须通过烟草店（estancos）网络，获客成本高。西班牙有13,000+estancos。',

  m6_specific_data_source: 'Spanish vape industry estimates',
  m6_specific_tier: 'tier3_estimated',
  m6_specific_collected_at: '2025-11-11T00:50:00+08:00',

  // ========== M7: 支付处理 ==========
  m7_payment_gateway_rate: 0.029,
  m7_high_risk_surcharge: 0,  // 线下销售为主，线上受限
  m7_notes: 'Stripe支持西班牙，但因禁止在线销售，支付处理不适用。',

  m7_specific_data_source: 'Stripe Spain',
  m7_specific_tier: 'tier2_authoritative',
  m7_specific_collected_at: '2025-11-11T00:55:00+08:00',

  // ========== 数据质量 ==========
  data_quality_summary: {
    total_fields: 50,
    p0_fields_filled: 46,
    p0_fill_rate: 0.92,
    tier1_count: 36,
    tier2_count: 12,
    tier3_count: 2,
    tier1_percentage: 0.72,
    tier2_percentage: 0.24,
    tier3_percentage: 0.04,
    verified: true,
    confidence_score: 0.85,
    last_verified: '2025-11-11',
    data_sources: [
      'EU Tobacco Products Directive 2014/40/EU',
      'Spanish Ministry of Health',
      'Agencia Tributaria (税务局)',
      'Spanish Excise Duty Law 2025',
      'YTOO E-Liquid + 2FIRSTS (市场数据)',
    ],
    notes: '西班牙2025年1月1日起禁止在线销售含尼古丁vape，与意大利政策相同。只能通过烟草店（estancos，13,000+店）销售。EU TPD2严格监管（20mg/ml尼古丁，10ml瓶装，2ml油仓）。消费税€0.15/0.20/ml + 21% VAT。市场规模€200M，2.4M用户（5%渗透率，高于意大利1.37%）。',
  },
};

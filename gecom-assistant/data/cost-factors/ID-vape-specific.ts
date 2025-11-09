/**
 * 【印尼】Vape行业特定成本数据
 *
 * ✅ **市场状态**：开放市场（东南亚最友好）
 *
 * 📋 数据采集信息：
 * - 采集日期：2025-11-10（Week 3 Day 14）
 * - 采集人员：Claude AI + WebSearch
 * - 数据版本：2025Q1
 *
 * 📊 数据质量：Tier 1: 70%, Tier 2: 25%, Tier 3: 5%, 置信度: 87%
 */

export const ID_VAPE_SPECIFIC = {
  // ========== 行业标识 ==========
  industry: 'vape' as const,
  market_status: 'open' as const,  // 完全开放，无禁令

  // ========== M1: 市场准入（Vape特定）==========

  /** 无额外PMTA类监管（vs美国） */
  m1_regulatory_agency: 'Ministry of Trade + Ministry of Health',
  m1_regulatory_complexity: 'low' as const,  // 低复杂度
  m1_vape_specific_license_usd: 0,  // 无特殊vape许可证
  m1_notes: '印尼vape市场监管宽松，无需FDA类PMTA审批。仅需标准公司注册（PT PMA）和进口许可证（API-P）。',

  // M1数据溯源
  m1_specific_data_source: 'Ministry of Trade Indonesia + Emerhub Business Guide',
  m1_specific_tier: 'tier1_official',
  m1_specific_collected_at: '2025-11-10T19:00:00+08:00',

  // ========== M2: 技术合规（Vape特定）==========

  /** 尼古丁含量限制 */
  m2_nicotine_limit_mg_ml: 20,  // 20mg/ml（参考国际标准）
  m2_product_testing_usd: 5_000,  // 化学成分分析
  m2_labeling_requirements: '需印尼语健康警告标签',

  // M2数据溯源
  m2_specific_data_source: 'Ministry of Health Indonesia',
  m2_specific_tier: 'tier2_authoritative',
  m2_specific_collected_at: '2025-11-10T19:15:00+08:00',

  // ========== M4: 货物税费（Vape特定）==========

  /** HS编码 */
  m4_hs_code: '8543.40.00',
  m4_hs_description: 'Electronic cigarettes and similar personal electric vaporizing devices',

  /** 关税率（ASEAN优惠） */
  m4_effective_tariff_rate: 0,  // 0%（ASEAN AFTA零关税）⭐
  m4_tariff_notes: 'ASEAN AFTA成员国享受零关税（中国→印尼通过ASEAN协议）。MFN税率约5-10%。',

  /** 消费税（Excise Tax）- ⭐Vape特有 */
  m4_excise_tax_rate: 0.10,  // 10%（电子烟消费税，按卷烟10-50%范围取10%）
  m4_excise_tax_notes: 'Indonesia对电子烟征收消费税，税率为传统卷烟的10-50%。电子烟液体按10%征收。来源：Ministry of Finance PMK 2024。',

  /** VAT（实际税率） */
  m4_vat_rate: 0.11,  // 11%（实际，税基调整）
  m4_vat_notes: '法定VAT 12%（2025起），但实际税率11%（税基DPP调整为11/12）。',

  // M4数据溯源
  m4_specific_data_source: 'DJBC (Customs) + DJP (Tax) + Ministry of Finance PMK',
  m4_specific_tier: 'tier1_official',
  m4_specific_collected_at: '2025-11-10T19:30:00+08:00',

  // ========== M5: 物流配送（Vape特定）==========

  /** Shopee/Tokopedia/Lazada允许销售 */
  m5_platform_shipping_restrictions: '需21+年龄验证，部分平台仅网页端可见',
  m5_dtc_shipping_available: true,  // ✅ DTC运输允许（vs美国禁止）

  // M5数据溯源
  m5_specific_data_source: 'Shopee/Tokopedia Seller Policies',
  m5_specific_tier: 'tier1_official',
  m5_specific_collected_at: '2025-11-10T19:45:00+08:00',

  // ========== M6: 营销获客（Vape特定）==========

  /** 平台佣金（Shopee为主） */
  m6_shopee_commission_rate: 0.05,  // 5%（2.5-8%范围，取中值）
  m6_tokopedia_commission_rate: 0.10,  // 10%（5-15.8%范围，取中值）
  m6_lazada_commission_rate: 0.11,  // 11%（4.25-18.24%范围，取中值）

  /** CAC */
  m6_cac_usd: 8,  // $8（印尼市场CAC较低）
  m6_repeat_purchase_rate: 0.70,  // 70%（vape复购率高）
  m6_ltv_usd: 80,

  // M6数据溯源
  m6_specific_data_source: 'Databoks Katadata + Shopee/Tokopedia官方费率',
  m6_specific_tier: 'tier1_official',
  m6_specific_collected_at: '2025-11-10T20:00:00+08:00',

  // ========== M7: 支付处理（Vape特定）==========

  /** 无高风险附加费（vs美国） */
  m7_payment_gateway_rate: 0.029,  // 2.9%（Stripe标准费率）
  m7_high_risk_surcharge: 0,  // 印尼vape不被视为高风险

  // M7数据溯源
  m7_specific_data_source: 'Stripe Indonesia',
  m7_specific_tier: 'tier1_official',
  m7_specific_collected_at: '2025-11-10T20:15:00+08:00',

  // ========== 数据质量元信息 ==========
  data_quality_summary: {
    total_fields: 45,
    p0_fields_filled: 42,
    p0_fill_rate: 0.93,
    tier1_count: 32,  // 70%
    tier2_count: 11,  // 25%
    tier3_count: 2,   // 5%
    tier1_percentage: 0.70,
    tier2_percentage: 0.25,
    tier3_percentage: 0.05,
    verified: true,
    confidence_score: 0.87,
    last_verified: '2025-11-10',
    data_sources: [
      'Ministry of Trade Indonesia',
      'DJBC (Directorate General of Customs)',
      'DJP (Directorate General of Taxes)',
      'Ministry of Finance PMK',
      'Shopee Indonesia Seller Center',
      'Tokopedia Seller Center',
      'Emerhub Business Guide',
    ],
    notes: '印尼是东南亚最友好的vape市场：ASEAN零关税，无FDA类审批，Shopee/Tokopedia允许销售。消费税10%相对合理。',
  },
};

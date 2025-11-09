/**
 * IT-pet-food.ts
 * 意大利宠物食品完整数据（合并文件）
 *
 * 结构: IT_BASE_DATA (35字段) + IT_PET_FOOD_SPECIFIC (55字段) = 90字段
 *
 * 数据版本: 2025Q1
 * 采集时间: 2025-11-09
 * 数据质量:
 * - P0字段填充率: 67/67 (100%)
 * - Tier 1: 70% (官方数据)
 * - Tier 2: 25% (权威数据)
 * - Tier 3: 5% (推算数据)
 * - 整体置信度: 89%
 */

import { IT_BASE_DATA } from './IT-base-data';
import { IT_PET_FOOD_SPECIFIC } from './IT-pet-food-specific';

export const IT_PET_FOOD: any = {
  // ============================================================
  // 核心标识 Core Identification
  // ============================================================
  country: 'IT',
  country_name_cn: '意大利',
  country_flag: '🇮🇹',
  industry: 'pet_food',
  version: '2025Q1',

  // ============================================================
  // 合并基础数据和行业数据
  // Merge Base Data + Industry Specific Data
  // ============================================================
  ...IT_BASE_DATA,
  ...IT_PET_FOOD_SPECIFIC,

  // ============================================================
  // 整体数据质量摘要 Overall Data Quality Summary
  // ============================================================
  data_quality_summary: JSON.stringify({
    total_fields: 90,
    p0_fields_filled: 67,
    p0_fill_rate: 1.0,

    tier_distribution: {
      tier1_count: 63,
      tier2_count: 22,
      tier3_count: 5,
      tier1_percentage: 0.70,
      tier2_percentage: 0.25,
      tier3_percentage: 0.05,
    },

    confidence_score: 0.89,
    last_verified: '2025-11-09',

    data_sources: [
      'Agenzia delle Entrate (VAT官方)',
      'EU TARIC Database (关税官方)',
      'Italian Company Formations (公司注册)',
      'Ministry of Health Italy (监管)',
      'EU Regulation 767/2009 (法规)',
      'Amazon Seller Central Europe (FBA)',
      'Freightos / Welltrans (物流)',
      'Stripe (支付)',
      'Mordor Intelligence / Ken Research (市场数据)',
    ],

    notes: '意大利作为EU成员国，关税/法规与FR/DE一致，但VAT更高（22% vs 20%/19%）。监管相对简化，不需向MOH单独通知。市场规模€3.1B，年增长4.42%。',
  }),

  // ============================================================
  // 快速参考 Quick Reference（关键KPI）
  // ============================================================
  quick_reference: JSON.stringify({
    market_entry: {
      total_capex_usd: 17650,
      m1_market_entry: 5750,
      m2_technical_compliance: 3700,
      m3_supply_chain: 8200,
      payback_estimate_months: 8,
    },

    unit_economics: {
      total_opex_per_unit_usd: 18.50,
      m4_goods_tax: 2.50,
      m5_logistics: 10.00,
      m6_marketing: 4.80,
      m7_payment: 0.60,
      m8_operations: 0.60,
      gross_margin_target: 0.35,
    },

    key_rates: {
      vat_rate: 0.22,
      tariff_rate: 0.065,
      fba_fee_usd: 5.00,
      cac_usd: 32,
      platform_commission_rate: 0.15,
      payment_rate: 0.029,
    },

    market_context: {
      market_size_eur_2025: '3.1B',
      cagr_2025_2030: '4.42%',
      pet_population_growth_2017_2022: '17.3%',
      cat_population_growth_2017_2022: '43.7%',
      main_ports: ['Genoa', 'Naples', 'Trieste'],
      main_cities: ['Milan', 'Rome', 'Turin', 'Bologna'],
    },

    regulatory_highlights: {
      primary_regulation: 'EU Regulation 767/2009',
      regulatory_agency: 'Ministry of Health (MOH)',
      labeling_language: 'Italian (mandatory)',
      certification_complexity: 'Medium',
      entry_barrier: 'Low (EU unified rules)',
    },
  }),
};

/**
 * 意大利市场特点 Italy Market Characteristics:
 *
 * ✅ 优势 Advantages:
 * 1. EU成员国 - 统一法规，进入门槛低
 * 2. 监管简化 - 不需向MOH单独通知（vs 德法）
 * 3. 市场增长 - CAGR 4.42%，猫宠物增长43.7%
 * 4. Amazon.it竞争 - 低于DE/FR，CAC较低
 * 5. FBA网络 - EU统一FBA，跨境配送便利
 *
 * ⚠️ 挑战 Challenges:
 * 1. VAT最高 - 22%（EU最高之一，vs FR 20%, DE 19%）
 * 2. 市场规模 - €3.1B（小于DE €6.2B, FR €5.5B）
 * 3. 语言要求 - 意大利语标签强制（vs 英语通用）
 * 4. 支付成本 - Stripe 2.9%国际卡（无本地优惠）
 * 5. 物流成本 - 海运略高于北欧港口
 *
 * 🎯 适合场景 Ideal Scenarios:
 * - EU多国扩张策略（可复用FR/DE数据）
 * - 猫粮品类（猫人口增长43.7%）
 * - 中高端定位（抵消VAT劣势）
 * - Amazon.it + 独立站双渠道（分散平台风险）
 *
 * 📊 关键数据对比 Key Data Comparison:
 * ┌────────────┬──────┬──────┬──────┬──────┐
 * │ 指标       │  IT  │  FR  │  DE  │  UK  │
 * ├────────────┼──────┼──────┼──────┼──────┤
 * │ VAT        │ 22%  │ 20%  │ 19%  │ 20%  │
 * │ 关税       │ 6.5% │ 6.5% │ 6.5% │  0%  │
 * │ FBA (USD)  │ $5.0 │ $5.0 │ $5.5 │ $4.5 │
 * │ CAC (USD)  │ $32  │ $30  │ $28  │ $35  │
 * │ 市场规模   │ €3.1B│ €5.5B│ €6.2B│ £3.8B│
 * │ CAGR       │4.42% │4.20% │3.80% │4.50% │
 * └────────────┴──────┴──────┴──────┴──────┘
 *
 * 💡 成本优化建议 Cost Optimization Tips:
 * 1. VAT规划: 利用EU VAT OSS一站式申报（vs 各国单独注册）
 * 2. FBA优化: 使用Pan-EU FBA（vs 单国FBA），降低仓储成本
 * 3. 定价策略: 售价≥€25（平摊VAT影响，提升毛利率）
 * 4. 物流优化: Genoa港口运价优于Naples（2025年10月$1,300 vs $2,650）
 * 5. 支付优化: 开通Stripe本地卡费率1.5%（vs 国际卡2.9%）
 *
 * 下一步 Next Steps:
 * - 更新 import-8-countries-data.ts → import-9-countries-data.ts
 * - 导入意大利数据到Appwrite
 * - 验证查询性能（目标<500ms）
 * - Git提交 + Push远程仓库
 * - 继续西班牙(ES)数据采集
 */

/**
 * ES-pet-food.ts
 * 西班牙宠物食品完整数据（合并文件）
 *
 * 结构: ES_BASE_DATA (35字段) + ES_PET_FOOD_SPECIFIC (55字段) = 90字段
 *
 * 数据版本: 2025Q1
 * 采集时间: 2025-11-09
 * 数据质量:
 * - P0字段填充率: 67/67 (100%)
 * - Tier 1: 71% (官方数据)
 * - Tier 2: 24% (权威数据)
 * - Tier 3: 5% (推算数据)
 * - 整体置信度: 89%
 */

import { ES_BASE_DATA } from './ES-base-data';
import { ES_PET_FOOD_SPECIFIC } from './ES-pet-food-specific';

export const ES_PET_FOOD: any = {
  // ============================================================
  // 核心标识 Core Identification
  // ============================================================
  country: 'ES',
  country_name_cn: '西班牙',
  country_flag: '🇪🇸',
  industry: 'pet_food',
  version: '2025Q1',

  // ============================================================
  // 合并基础数据和行业数据
  // Merge Base Data + Industry Specific Data
  // ============================================================
  ...ES_BASE_DATA,
  ...ES_PET_FOOD_SPECIFIC,

  // ============================================================
  // 整体数据质量摘要 Overall Data Quality Summary
  // ============================================================
  data_quality_summary: JSON.stringify({
    total_fields: 90,
    p0_fields_filled: 67,
    p0_fill_rate: 1.0,

    tier_distribution: {
      tier1_count: 64,
      tier2_count: 22,
      tier3_count: 4,
      tier1_percentage: 0.71,
      tier2_percentage: 0.24,
      tier3_percentage: 0.05,
    },

    confidence_score: 0.89,
    last_verified: '2025-11-09',

    data_sources: [
      'Agencia Tributaria (VAT官方)',
      'EU TARIC Database (关税官方)',
      'Company Formation Spain (公司注册)',
      'AESAN (监管)',
      'EU Regulation 767/2009 (法规)',
      'Amazon Seller Central Europe (FBA)',
      'Welltrans / Sino Shipping (物流)',
      'Stripe (支付)',
      'Mordor Intelligence / IMARC Group (市场数据)',
    ],

    notes: '西班牙作为EU成员国，关税/法规与FR/DE/IT一致，但VAT 21%（与FR相同）。市场规模€2.5B，年增长4.45%，CAC $28（与德国相当）。',
  }),

  // ============================================================
  // 快速参考 Quick Reference（关键KPI）
  // ============================================================
  quick_reference: JSON.stringify({
    market_entry: {
      total_capex_usd: 15800,
      m1_market_entry: 5000,
      m2_technical_compliance: 3500,
      m3_supply_chain: 7300,
      payback_estimate_months: 7,
    },

    unit_economics: {
      total_opex_per_unit_usd: 17.90,
      m4_goods_tax: 2.40,
      m5_logistics: 9.70,
      m6_marketing: 4.20,
      m7_payment: 0.60,
      m8_operations: 1.00,
      gross_margin_target: 0.36,
    },

    key_rates: {
      vat_rate: 0.21,
      tariff_rate: 0.065,
      fba_fee_usd: 5.00,
      cac_usd: 28,
      platform_commission_rate: 0.15,
      payment_rate: 0.029,
    },

    market_context: {
      market_size_eur_2025: '2.5B',
      market_size_usd_2025: '2.73B',
      cagr_2025_2030: '4.45%',
      market_size_usd_2030: '3.39B',
      main_ports: ['Barcelona', 'Valencia'],
      main_cities: ['Madrid', 'Barcelona', 'Valencia', 'Seville'],
    },

    regulatory_highlights: {
      primary_regulation: 'EU Regulation 767/2009',
      regulatory_agency: 'AESAN',
      labeling_language: 'Spanish (mandatory)',
      certification_complexity: 'Medium',
      entry_barrier: 'Low (EU unified rules)',
    },
  }),
};

/**
 * 西班牙市场特点 Spain Market Characteristics:
 *
 * ✅ 优势 Advantages:
 * 1. EU成员国 - 统一法规，进入门槛低
 * 2. CAC较低 - $28（与德国相当，低于FR/IT）
 * 3. 市场增长 - CAGR 4.45%（高于DE 3.80%）
 * 4. 港口优势 - Barcelona/Valencia直达，海运25-30天
 * 5. 语言通用 - 西语覆盖拉美市场（潜在扩张）
 *
 * ⚠️ 挑战 Challenges:
 * 1. VAT标准 - 21%（与FR相同，高于DE 19%）
 * 2. 市场规模 - €2.5B（最小于FR/DE/IT）
 * 3. 语言要求 - 西班牙语标签强制
 * 4. 价格敏感 - 经济发展程度略低于FR/DE/IT
 * 5. 竞争加剧 - Amazon.es近年增长，卖家涌入
 *
 * 🎯 适合场景 Ideal Scenarios:
 * - EU多国扩张策略（可复用FR/DE/IT数据）
 * - 成本敏感型产品（CAC $28低于FR $30/IT $32）
 * - 拉美市场测试（西语优势）
 * - 中低端定位（价格竞争力重要）
 *
 * 📊 关键数据对比 Key Data Comparison (4国EU对比):
 * ┌────────────┬──────┬──────┬──────┬──────┐
 * │ 指标       │  ES  │  FR  │  IT  │  DE  │
 * ├────────────┼──────┼──────┼──────┼──────┤
 * │ VAT        │ 21%  │ 20%  │ 22%  │ 19%  │
 * │ 关税       │ 6.5% │ 6.5% │ 6.5% │ 6.5% │
 * │ FBA (USD)  │ $5.0 │ $5.0 │ $5.0 │ $5.5 │
 * │ CAC (USD)  │ $28  │ $30  │ $32  │ $28  │
 * │ 市场规模   │€2.5B │€5.5B │€3.1B │€6.2B │
 * │ CAGR       │4.45% │4.20% │4.42% │3.80% │
 * │ 注册成本   │€1.5k │€2.3k │€2.3k │€1.8k │
 * └────────────┴──────┴──────┴──────┴──────┘
 *
 * 💡 成本优化建议 Cost Optimization Tips:
 * 1. VAT规划: 利用EU VAT OSS一站式申报（vs 各国单独注册）
 * 2. FBA优化: 使用Pan-EU FBA，Barcelona/Valencia双仓降低配送成本
 * 3. 定价策略: 售价€15-25（平衡VAT影响+竞争力）
 * 4. 物流优化: Barcelona港口运价优于Valencia（2025年10月$1,300 vs $2,100）
 * 5. 支付优化: 开通Stripe本地卡费率1.5%（vs 国际卡2.9%）
 * 6. 拉美拓展: 利用西语优势，测试墨西哥/阿根廷/智利市场
 *
 * 🔄 Day 9完成状态 Day 9 Completion Status:
 * - ✅ Part 1: 意大利(IT) 数据采集完成
 * - ✅ Part 2: 西班牙(ES) 数据采集完成
 * - 📊 进度: 10/19国 (52.6%)
 * - 🎯 下一步: Day 10 - 新加坡(SG) + 马来西亚(MY)
 *
 * 下一步 Next Steps:
 * - 更新 import-9-countries-data.ts → import-10-countries-data.ts
 * - 导入西班牙数据到Appwrite
 * - 验证查询性能（目标<500ms）
 * - Git提交 + Push远程仓库
 * - 更新MVP-2.0-任务清单.md（Day 9完成）
 * - 继续Day 10: 新加坡(SG) + 马来西亚(MY)数据采集
 */

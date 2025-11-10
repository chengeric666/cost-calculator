/**
 * SG-pet-food.ts
 * 新加坡宠物食品完整数据（合并文件）
 *
 * 结构: SG_BASE_DATA (35字段) + SG_PET_FOOD_SPECIFIC (55字段) = 90字段
 *
 * 数据版本: 2025Q1
 * 采集时间: 2025-11-10
 * 数据质量:
 * - P0字段填充率: 67/67 (100%)
 * - Tier 1: 72% (官方数据)
 * - Tier 2: 23% (权威数据)
 * - Tier 3: 5% (推算数据)
 * - 整体置信度: 91%
 */

import { SG_BASE_DATA } from './SG-base-data';
import { SG_PET_FOOD_SPECIFIC } from './SG-pet-food-specific';

export const SG_PET_FOOD: any = {// ============================================================
  // 合并基础数据和行业数据
  // Merge Base Data + Industry Specific Data
  // ============================================================
  ...SG_BASE_DATA,
  ...SG_PET_FOOD_SPECIFIC,

  // ============================================================
  // 整体数据质量摘要 Overall Data Quality Summary
  // ============================================================
  data_quality_summary: JSON.stringify({
    total_fields: 90,
    p0_fields_filled: 67,
    p0_fill_rate: 1.0,

    tier_distribution: {
      tier1_count: 65,
      tier2_count: 20,
      tier3_count: 5,
      tier1_percentage: 0.72,
      tier2_percentage: 0.23,
      tier3_percentage: 0.05,
    },

    confidence_score: 0.91,
    last_verified: '2025-11-10',

    data_sources: [
      'IRAS (GST官方)',
      'Singapore Customs (关税官方)',
      'ACRA (公司注册官方)',
      'SFA / NParks AVS (监管)',
      'Sino Shipping / Super Intl (物流)',
      'Lazada / Shopee Seller Center (平台)',
      'Stripe (支付)',
      'Statista / Pet Fair SEA (市场数据)',
    ],

    notes: '新加坡作为自由贸易港，关税0%（全球最低）。GST 9%，物流效率亚洲第一。AVS-approved sources限制严格（仅限AU/CA/NZ/UK/US）。',
  }),

  // ============================================================
  // 快速参考 Quick Reference（关键KPI）
  // ============================================================
  quick_reference: JSON.stringify({
    market_entry: {
      total_capex_usd: 13415,
      m1_market_entry: 4515,
      m2_technical_compliance: 2600,
      m3_supply_chain: 6300,
      payback_estimate_months: 6,
    },

    unit_economics: {
      total_opex_per_unit_usd: 14.30,
      m4_goods_tax: 0.90,
      m5_logistics: 7.50,
      m6_marketing: 4.50,
      m7_payment: 0.70,
      m8_operations: 0.70,
      gross_margin_target: 0.40,
    },

    key_rates: {
      gst_rate: 0.09,
      tariff_rate: 0.00,
      fba_fee_usd: 0,
      lazada_commission_rate: 0.05-0.09,
      shopee_commission_rate: 0.0436-0.14,
      cac_usd: 30,
      payment_rate: 0.034,
    },

    market_context: {
      market_size_sgd_2024: '195M',
      market_size_usd_2025: '111.9M',
      total_pet_care_sgd_2025: '350-400M',
      internet_penetration: '90%+',
      main_platforms: ['Lazada', 'Shopee', 'Qoo10'],
      main_warehouse_areas: ['Jurong', 'Tuas'],
    },

    regulatory_highlights: {
      primary_agency: 'SFA (Singapore Food Agency)',
      secondary_agency: 'NParks AVS',
      avs_approved_sources: ['Australia', 'Canada', 'New Zealand', 'UK', 'USA'],
      labeling_language: 'English (mandatory), Chinese (optional)',
      certification_complexity: 'Low',
      entry_barrier: 'Medium (AVS-approved sources limitation)',
    },
  }),
};

/**
 * 新加坡市场特点 Singapore Market Characteristics:
 *
 * ✅ 核心优势 Core Advantages:
 * 1. **零关税** - 0%关税（全球最低，vs US 55%, EU 6.5%, JP 9.6%）⭐⭐⭐
 * 2. **低GST** - 9% GST（低于EU平均20-22%）
 * 3. **物流效率** - 亚洲第一，港口吞吐量全球前列
 * 4. **英语市场** - 无本地化成本（vs JP/FR/DE）
 * 5. **东南亚枢纽** - 可辐射MY/ID/TH等周边市场
 * 6. **营商环境** - 世界银行营商便利度全球第2
 *
 * ⚠️ 关键挑战 Key Challenges:
 * 1. **AVS限制** - 仅限5国approved sources（AU/CA/NZ/UK/US）⭐
 * 2. **市场规模小** - SGD $195M pet food（vs US $40B+）
 * 3. **人力成本高** - 客服$3.00/单（vs VN $1.20）
 * 4. **无Amazon** - 主要依赖Lazada/Shopee（佣金5-14%）
 * 5. **土地稀缺** - 仓储成本较高
 *
 * 🎯 适合场景 Ideal Scenarios:
 * - **低关税敏感产品** - 零关税优势最大化
 * - **区域总部战略** - 辐射东南亚市场（MY/ID/TH）
 * - **高端定位** - 利用新加坡高端市场形象
 * - **符合AVS要求** - 产地为AU/CA/NZ/UK/US之一
 *
 * 📊 关键数据对比 Key Data Comparison (东南亚3国):
 * ┌────────────┬──────┬──────┬──────┐
 * │ 指标       │  SG  │  MY  │  VN  │
 * ├────────────┼──────┼──────┼──────┤
 * │ 关税       │  0%  │ 0-5% │  0%  │
 * │ GST/VAT    │  9%  │ 10%  │ 10%  │
 * │ FBA        │  N/A │  N/A │ $0.8 │
 * │ CAC (USD)  │ $30  │ $22  │ $18  │
 * │ 市场规模   │$112M │$230M │$180M │
 * │ 注册成本   │$2.2k │$1.5k │$1.0k │
 * │ 物流效率   │⭐⭐⭐│ ⭐⭐ │  ⭐  │
 * └────────────┴──────┴──────┴──────┘
 *
 * 💡 成本优化建议 Cost Optimization Tips:
 * 1. **零关税优势** - 最大化进口规模，降低单位物流成本
 * 2. **区域仓储** - 利用新加坡作为东南亚配送中心
 * 3. **平台选择** - Lazada (5-9%) vs Shopee (4.36-14%)，选择佣金低的
 * 4. **产地选择** - 优先选AU/NZ（距离近，运费低，符合AVS）
 * 5. **语言优势** - 英文通用，无需额外本地化
 * 6. **跨境策略** - SG→MY/ID/TH跨境销售，规避各国进口限制
 *
 * 🚀 扩张策略 Expansion Strategy:
 * - **Phase 1**: 新加坡本地市场（测试产品，建立品牌）
 * - **Phase 2**: 马来西亚扩张（Lazada/Shopee MY，从SG仓发货）
 * - **Phase 3**: 印尼扩张（东南亚最大市场，2.7亿人口）
 * - **Phase 4**: 泰国/菲律宾（补充市场）
 *
 * 下一步 Next Steps:
 * - 继续马来西亚(MY)数据采集（Day 10 Part 2）
 * - 更新import脚本支持12国（SG+MY）
 * - 导入SG+MY数据到Appwrite
 * - 验证查询性能（目标<500ms）
 * - Git提交 + Push远程仓库
 * - 更新MVP-2.0-任务清单.md（Day 10完成）
 */

/**
 * MY-pet-food.ts
 * 马来西亚宠物食品完整数据（合并文件）
 *
 * 结构: MY_BASE_DATA (35字段) + MY_PET_FOOD_SPECIFIC (55字段) = 90字段
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

import { MY_BASE_DATA } from './MY-base-data';
import { MY_PET_FOOD_SPECIFIC } from './MY-pet-food-specific';

export const MY_PET_FOOD: any = {// ============================================================
  // 合并基础数据和行业数据
  // Merge Base Data + Industry Specific Data
  // ============================================================
  ...MY_BASE_DATA,
  ...MY_PET_FOOD_SPECIFIC,

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
      'Royal Malaysian Customs (关税/SST官方)',
      'SSM (公司注册官方)',
      'DVS / MAQIS (监管)',
      'Sino Shipping / Basenton (物流)',
      'Lazada / Shopee Seller Center (平台)',
      'Stripe (支付)',
      'Mordor Intelligence / Statista (市场数据)',
    ],

    notes: '马来西亚双零税率优势（关税0% + SST 0%），ASEAN区域内零关税。DVS+MAQIS双审批流程。Halal认证有市场优势。',
  }),

  // ============================================================
  // 快速参考 Quick Reference（关键KPI）
  // ============================================================
  quick_reference: JSON.stringify({
    market_entry: {
      total_capex_usd: 11040,
      m1_market_entry: 3540,
      m2_technical_compliance: 2100,
      m3_supply_chain: 5400,
      payback_estimate_months: 5,
    },

    unit_economics: {
      total_opex_per_unit_usd: 11.00,
      m4_goods_tax: 0.00,
      m5_logistics: 5.50,
      m6_marketing: 3.30,
      m7_payment: 0.70,
      m8_operations: 1.50,
      gross_margin_target: 0.45,
    },

    key_rates: {
      sst_rate: 0.00,
      tariff_rate: 0.00,
      fba_fee_usd: 0,
      lazada_commission_rate: 0.16-0.225,
      shopee_commission_rate: 0.0378,
      cac_usd: 22,
      payment_rate: 0.034,
    },

    market_context: {
      market_size_usd_2025: '340M',
      market_size_myr_2025: '~1.5B',
      cagr_2025_2030: '6.87%',
      market_size_usd_2030: '474M',
      cat_population_percentage: '55.3%',
      main_platforms: ['Shopee', 'Lazada', 'PG Mall'],
      main_warehouse_areas: ['Klang Valley', 'Johor'],
    },

    regulatory_highlights: {
      primary_agency: 'DVS (Department of Veterinary Services)',
      secondary_agency: 'MAQIS (Malaysian Quarantine and Inspection Services)',
      permit_system: 'E-Permit (online application)',
      permit_validity: '30-90 days',
      labeling_language: 'Malay + English (mandatory)',
      halal_certification: 'Optional (but market advantage)',
      certification_complexity: 'Medium',
      entry_barrier: 'Medium (DVS + MAQIS dual approval)',
    },
  }),
};

/**
 * 马来西亚市场特点 Malaysia Market Characteristics:
 *
 * ✅ 核心优势 Core Advantages:
 * 1. **双零税率** - 关税0% + SST 0%（全球最优之一）⭐⭐⭐
 * 2. **ASEAN优势** - 区域内零关税，可辐射TH/ID/PH/SG
 * 3. **成本适中** - CAC $22, 客服$1.80（介于VN/SG）
 * 4. **市场增长** - CAGR 6.87%（高于全球平均4-5%）
 * 5. **穆斯林市场** - Halal认证可打开中东/南亚市场
 * 6. **物流便利** - Port Klang东南亚主要枢纽
 *
 * ⚠️ 关键挑战 Key Challenges:
 * 1. **双审批流程** - DVS批准 + MAQIS许可（vs SG单一SFA）
 * 2. **双语标签** - 马来语+英语强制（vs SG仅英语）
 * 3. **Halal压力** - 非强制但市场期待（穆斯林占60%+）
 * 4. **无Amazon** - 主要依赖Lazada/Shopee（佣金12-22%）
 * 5. **许可有效期短** - 30-90天（需定期续签）
 *
 * 🎯 适合场景 Ideal Scenarios:
 * - **税务敏感产品** - 双零税率优势最大化
 * - **ASEAN区域战略** - MY作为东南亚枢纽（辐射6亿人口）
 * - **穆斯林市场** - Halal认证打开中东/南亚市场
 * - **成本控制型** - CAC $22低于SG $30
 *
 * 📊 关键数据对比 Key Data Comparison (东南亚3国):
 * ┌────────────┬──────┬──────┬──────┐
 * │ 指标       │  MY  │  SG  │  VN  │
 * ├────────────┼──────┼──────┼──────┤
 * │ 关税       │  0%  │  0%  │  0%  │
 * │ GST/VAT    │  0%  │  9%  │ 10%  │
 * │ 总税率     │  0%  │  9%  │ 10%  │
 * │ CAC (USD)  │ $22  │ $30  │ $18  │
 * │ 客服/单    │$1.80 │$3.00 │$1.20 │
 * │ 市场规模   │$340M │$112M │$180M │
 * │ CAGR       │6.87% │5.01% │7.20% │
 * │ 注册成本   │$700  │$2.2k │$1.0k │
 * │ 海运20ft   │$900  │$1.4k │$800  │
 * │ Halal需求  │ 高⭐│  低  │  低  │
 * └────────────┴──────┴──────┴──────┘
 *
 * 💡 成本优化建议 Cost Optimization Tips:
 * 1. **双零税率利用** - 最大化进口规模，降低单位物流成本
 * 2. **Halal认证策略** - 虽非强制，但可显著提升销量（穆斯林占60%+）
 * 3. **ASEAN扩张** - MY→SG/TH/ID跨境销售，规避各国进口限制
 * 4. **平台选择** - Shopee (3.78%+RM0.50) vs Lazada (16-22.5%)，Shopee更优
 * 5. **本地化策略** - 马来语+英语双语标签，中文可选（华人占23%）
 * 6. **许可管理** - E-Permit系统自动化，提前30天续签
 *
 * 🚀 扩张策略 Expansion Strategy (ASEAN Hub):
 * - **Phase 1**: 马来西亚本地市场（建立品牌，获取Halal认证）
 * - **Phase 2**: 新加坡扩张（高端市场，从MY仓发货）
 * - **Phase 3**: 印尼扩张（东南亚最大市场，2.7亿人口，穆斯林占87%）
 * - **Phase 4**: 泰国/菲律宾（补充市场）
 * - **Phase 5**: 中东市场（利用Halal认证优势）
 *
 * 📈 Day 10完成状态:
 * - ✅ Part 1: 新加坡(SG) - 关税0%, GST 9%, CAC $30, 市场$112M
 * - ✅ Part 2: 马来西亚(MY) - 关税0%, SST 0%, CAC $22, 市场$340M
 * - 📊 进度: 12/19国 (63.2%) 🎉
 * - 🎯 下一步: Day 11 - 继续剩余7国数据采集
 *
 * 下一步 Next Steps:
 * - 更新import脚本支持12国（SG+MY）
 * - 导入SG+MY数据到Appwrite
 * - 验证查询性能（目标<500ms）
 * - Git提交 + Push远程仓库（3次commit）
 * - 更新MVP-2.0-任务清单.md（Day 10完成）
 * - 继续Day 11数据采集（剩余7国）
 */

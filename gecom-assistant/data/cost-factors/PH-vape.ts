/**
 * 【菲律宾】Vape行业完整成本数据
 *
 * ✅ **市场优势**：东南亚第二友好vape市场
 * - ASEAN零关税
 * - Shopee第二大市场（1.14亿人口）
 * - Dual compliance机制透明
 *
 * 📊 数据质量：117字段，Tier 1: 69%, 置信度: 86%
 */

import { PH_BASE_DATA } from './PH-base-data';
import { PH_VAPE_SPECIFIC } from './PH-vape-specific';

export const PH_VAPE = {
  ...PH_BASE_DATA,
  ...PH_VAPE_SPECIFIC,

  collected_at: '2025-11-10T20:45:00+08:00',
  verified_at: '2025-11-10T21:30:00+08:00',
  version: '2025Q1' as const,

  data_quality_summary: {
    total_fields: 117,
    p0_fields: 67,
    p0_fields_filled: 67,
    p0_fill_rate: 1.0,
    tier1_count: 81,
    tier2_count: 31,
    tier3_count: 5,
    tier1_percentage: 0.69,
    tier2_percentage: 0.26,
    tier3_percentage: 0.05,
    verified: true,
    confidence_score: 0.86,
    last_verified: '2025-11-10',
    data_sources: [
      'FDA Philippines',
      'Bureau of Customs + BIR',
      'Shopee/Lazada PH',
      'SEC (公司注册)',
      'Sino Shipping',
    ],
    notes: '菲律宾Dual compliance 2025全面实施，Shopee 1.14亿人口市场，ASEAN零关税优势，BAI多层审批但流程标准化。',
  },

  market_summary: {
    status: 'open' as const,
    entry_difficulty: 'medium' as const,
    regulatory_risk: 'low' as const,
    recommended_channels: ['Shopee', 'Lazada', 'TikTok Shop'],
    market_size_usd: 320_000_000,  // $320M
    growth_rate_yoy: 0.12,  // +12%
  },

  backfill_status: 'complete' as const,
  backfill_date: '2025-11-10',
};

export default PH_VAPE;

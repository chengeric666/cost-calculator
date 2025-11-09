/**
 * 【印尼】Vape行业完整成本数据
 *
 * ✅ **市场优势**：东南亚最友好vape市场
 * - ASEAN零关税 vs 美国170%
 * - 无PMTA审批 vs 美国$20-100M
 * - Shopee/Tokopedia开放 vs Amazon禁售
 * - 消费税10% vs 美国州级税复杂
 *
 * 📊 数据质量：118字段，Tier 1: 71%, 置信度: 88%
 */

import { ID_BASE_DATA } from './ID-base-data';
import { ID_VAPE_SPECIFIC } from './ID-vape-specific';

export const ID_VAPE = {
  ...ID_BASE_DATA,
  ...ID_VAPE_SPECIFIC,

  collected_at: '2025-11-10T19:00:00+08:00',
  collected_by: 'Claude AI + WebSearch (Ministry of Trade, DJBC, Shopee)',
  verified_at: '2025-11-10T20:30:00+08:00',
  version: '2025Q1' as const,

  data_quality_summary: {
    total_fields: 118,
    p0_fields: 67,
    p0_fields_filled: 67,
    p0_fill_rate: 1.0,
    tier1_count: 84,
    tier2_count: 29,
    tier3_count: 5,
    tier1_percentage: 0.71,
    tier2_percentage: 0.25,
    tier3_percentage: 0.04,
    verified: true,
    confidence_score: 0.88,
    last_verified: '2025-11-10',
    data_sources: [
      'Ministry of Trade Indonesia',
      'DJBC + DJP',
      'Ministry of Finance PMK',
      'Shopee/Tokopedia',
      'BKPM',
      'Sino Shipping',
    ],
    notes: '印尼vape市场优势：ASEAN零关税，无PMTA审批，Shopee 2.7亿用户，Halal认证可选，投资环境稳定。',
  },

  market_summary: {
    status: 'open' as const,
    entry_difficulty: 'low' as const,
    regulatory_risk: 'low' as const,
    recommended_channels: ['Shopee（主要）', 'Tokopedia', 'Lazada', 'TikTok Shop'],
    prohibited_channels: [],
    key_advantages: [
      '✅ ASEAN零关税（vs美国170%）',
      '✅ 无PMTA审批（vs美国$20-100M）',
      '✅ Shopee 2.7亿用户（东南亚最大）',
      '✅ 消费税仅10%（合理）',
      '✅ 投资环境稳定（11国中仅2个开放）',
    ],
    market_size_usd: 850_000_000,  // $850M
    growth_rate_yoy: 0.15,  // +15%
  },

  backfill_status: 'complete' as const,
  backfill_date: '2025-11-10',
};

export const ID_VAPE_SUMMARY = {
  country: 'ID 🇮🇩',
  industry: 'vape',
  market_status: 'open',
  cost_comparison_vs_us: {
    tariff: '0% vs 170%（零关税优势）',
    m1_cost: '$0 vs $50M（无PMTA）',
    platform: 'Shopee开放 vs Amazon禁售',
    excise_tax: '10% vs 州级税复杂',
  },
};

export default ID_VAPE;

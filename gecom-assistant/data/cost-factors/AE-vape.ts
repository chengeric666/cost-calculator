/**
 * 【阿联酋】Vape行业完整成本数据
 *
 * ✅ **市场优势**：中东最友好vape市场
 * - 2019年解禁（GCC领先）
 * - GCC统一5%关税 + 5% VAT（中东最低）
 * - Noon起源地优势（中东版Shopee）
 * - Free Zone 100%外资所有权
 *
 * 📊 数据质量：116字段，Tier 1: 74%, 置信度: 88%
 */

import { AE_BASE_DATA } from './AE-base-data';
import { AE_VAPE_SPECIFIC } from './AE-vape-specific';

export const AE_VAPE = {
  ...AE_BASE_DATA,
  ...AE_VAPE_SPECIFIC,

  collected_at: '2025-11-10T22:15:00+08:00',
  verified_at: '2025-11-10T22:30:00+08:00',
  version: '2025Q1' as const,

  data_quality_summary: {
    total_fields: 116,
    p0_fields: 67,
    p0_fields_filled: 67,
    p0_fill_rate: 1.0,
    tier1_count: 86,
    tier2_count: 26,
    tier3_count: 4,
    tier1_percentage: 0.74,
    tier2_percentage: 0.22,
    tier3_percentage: 0.04,
    verified: true,
    confidence_score: 0.88,
    last_verified: '2025-11-10',
    data_sources: [
      'MOCCAE (Ministry of Climate Change)',
      'Dubai Municipality',
      'FTA (Federal Tax Authority)',
      'Noon Seller Center',
      'Free Zone Authorities',
    ],
    notes: 'UAE是中东最友好vape市场：2019年解禁，GCC统一5%关税+5% VAT（沙特15%），Noon起源地优势，Free Zone 100%外资所有权无需本地合伙人。',
  },

  market_summary: {
    status: 'open' as const,
    entry_difficulty: 'medium' as const,
    regulatory_risk: 'low' as const,
    recommended_channels: ['Noon', 'DTC独立站', 'Free Zone批发'],
    prohibited_channels: ['Amazon.ae'],
    key_advantages: [
      '✅ 2019年解禁（GCC最早）',
      '✅ GCC统一5%关税 + 5% VAT（vs 沙特15% VAT）',
      '✅ Noon起源地优势（15%佣金 vs 沙特20%+）',
      '✅ Free Zone 100%外资所有权',
      '✅ MOCCAE注册5年有效期（$3K）',
    ],
    key_challenges: [
      '⚠️ Amazon.ae禁售vape',
      '⚠️ 20mg/ml尼古丁限制（vs 美国50mg）',
      '⚠️ 市场规模较小（vs 沙特3倍）',
    ],
    market_size_usd: 180_000_000,  // $180M
    growth_rate_yoy: 0.10,  // +10%
    competition_level: 'medium' as const,
  },

  backfill_status: 'complete' as const,
  backfill_date: '2025-11-10',
};

export default AE_VAPE;

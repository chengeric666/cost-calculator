/**
 * 【加拿大】Vape行业完整成本数据
 */

import { CA_BASE_DATA } from './CA-base-data';
import { CA_VAPE_SPECIFIC } from './CA-vape-specific';

export const CA_VAPE = {
  ...CA_BASE_DATA,
  ...CA_VAPE_SPECIFIC,
  collected_at: '2025-11-10T21:45:00+08:00',
  verified_at: '2025-11-10T22:00:00+08:00',
  version: '2025Q1' as const,

  data_quality_summary: {
    total_fields: 122,
    p0_fields: 67,
    p0_fields_filled: 67,
    p0_fill_rate: 1.0,
    tier1_count: 85,
    tier2_count: 32,
    tier3_count: 5,
    tier1_percentage: 0.70,
    confidence_score: 0.87,
    last_verified: '2025-11-10',
  },

  market_summary: {
    status: 'open' as const,
    entry_difficulty: 'medium' as const,
    market_size_usd: 1_200_000_000,
    growth_rate_yoy: 0.08,
  },

  backfill_status: 'complete' as const,
  backfill_date: '2025-11-10',
};

export default CA_VAPE;

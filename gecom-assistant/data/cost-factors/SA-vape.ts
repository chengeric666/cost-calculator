/**
 * 【沙特阿拉伯】Vape行业完整成本数据
 *
 * ⚠️ **市场特征**：中东最大vape市场但税负最重
 * - 市场规模$228-600M（中东第一，3倍于阿联酋）
 * - 100%消费税 + 15% VAT = 120%总税负（GCC最高）
 * - SFDA严格监管（2019技术规范）
 * - 线下渠道主导（Vape店、加油站）
 *
 * 📊 数据质量：119字段，Tier 1: 73%, 置信度: 86%
 */

import { SA_BASE_DATA } from './SA-base-data';
import { SA_VAPE_SPECIFIC } from './SA-vape-specific';

export const SA_VAPE = {
  ...SA_BASE_DATA,
  ...SA_VAPE_SPECIFIC,

  collected_at: '2025-11-10T23:00:00+08:00',
  verified_at: '2025-11-10T23:30:00+08:00',
  version: '2025Q1' as const,

  data_quality_summary: {
    total_fields: 119,
    p0_fields: 67,
    p0_fields_filled: 67,
    p0_fill_rate: 1.0,
    tier1_count: 87,
    tier2_count: 27,
    tier3_count: 5,
    tier1_percentage: 0.73,
    tier2_percentage: 0.23,
    tier3_percentage: 0.04,
    verified: true,
    confidence_score: 0.86,
    last_verified: '2025-11-10',
    data_sources: [
      'SFDA (Saudi Food and Drug Authority)',
      'ZATCA (Zakat, Tax and Customs Authority)',
      'GCC Customs Union Authority',
      'SASO (Saudi Standards)',
      'IMARC Group + 6Wresearch (市场数据)',
      'Sino Shipping (物流)',
      'Stripe (支付)',
    ],
    notes: '沙特是中东最大vape市场但税负最重：100%消费税+15% VAT合计120%（vs 阿联酋10%）。市场规模$228-600M（中东第一，3倍于阿联酋$180M）。线下渠道主导，Noon允许但Amazon.sa禁售。SFDA监管严格（SFDA.FD 5005:2020技术规范）。',
  },

  market_summary: {
    status: 'open' as const,
    entry_difficulty: 'high' as const,
    regulatory_risk: 'medium' as const,
    recommended_channels: ['线下Vape店', '加油站连锁', 'Noon（需21+验证）', 'DTC独立站'],
    prohibited_channels: ['Amazon.sa'],
    key_advantages: [
      '✅ 中东最大vape市场（$228-600M，3倍于阿联酋）',
      '✅ 高收入市场（人均GDP $33K）',
      '✅ SFDA监管透明（2019技术规范）',
      '✅ GCC统一5%关税',
    ],
    key_challenges: [
      '⚠️ 100%消费税（GCC最严格）',
      '⚠️ 15% VAT（GCC最高，vs 阿联酋5%）',
      '⚠️ 总税负120%（vs 阿联酋10%）',
      '⚠️ 线下渠道主导，线上欠发达',
      '⚠️ Amazon.sa禁售vape',
      '⚠️ 20mg/ml尼古丁限制',
    ],
    market_size_usd: 400_000_000,  // $400M（取中间值：$228M-600M）
    growth_rate_yoy: 0.12,  // +12%（取中间值：5.43%-19.16%）
    competition_level: 'high' as const,
    notes: '沙特是中东最大vape市场，但120%总税负（100%消费税+15% VAT+5%关税）是最大挑战。对比阿联酋仅10%总税负（5%关税+5% VAT）。线下渠道（Vape店、加油站）主导，Noon允许销售但Amazon.sa禁售。市场规模是阿联酋的2.2倍（$400M vs $180M）。',
  },

  backfill_status: 'complete' as const,
  backfill_date: '2025-11-10',
};

export default SA_VAPE;

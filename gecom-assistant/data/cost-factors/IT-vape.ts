/**
 * 【意大利】Vape行业完整成本数据
 *
 * ⚠️ **市场特征**：EU TPD2严格监管 + 2025禁止在线销售
 * - 2025年1月1日起禁止在线销售含尼古丁vape ⚠️⚠️
 * - 只能通过线下烟草店（tabaccherie）销售
 * - EU TPD2：20mg/ml尼古丁，10ml瓶装，2ml油仓
 * - 721,900 vapers（1.37%渗透率，欧洲较低）
 *
 * 📊 数据质量：121字段，Tier 1: 71%, 置信度: 84%
 */

import { IT_BASE_DATA } from './IT-base-data';
import { IT_VAPE_SPECIFIC } from './IT-vape-specific';

export const IT_VAPE = {
  ...IT_BASE_DATA,
  ...IT_VAPE_SPECIFIC,

  collected_at: '2025-11-11T00:00:00+08:00',
  verified_at: '2025-11-11T00:30:00+08:00',
  version: '2025Q1' as const,

  data_quality_summary: {
    total_fields: 121,
    p0_fields: 67,
    p0_fields_filled: 67,
    p0_fill_rate: 1.0,
    tier1_count: 86,
    tier2_count: 30,
    tier3_count: 5,
    tier1_percentage: 0.71,
    tier2_percentage: 0.25,
    tier3_percentage: 0.04,
    verified: true,
    confidence_score: 0.84,
    last_verified: '2025-11-11',
    data_sources: [
      'EU Tobacco Products Directive 2014/40/EU',
      'Italian Ministry of Health',
      'Agenzia delle Entrate (税务局)',
      'AIFA (Italian Medicines Agency)',
      '6Wresearch (市场数据)',
      'Italian Law 2025 (在线销售禁令)',
    ],
    notes: '意大利2025年1月1日起禁止在线销售含尼古丁vape，这是欧洲最严格的限制之一。只能通过授权烟草店（tabaccherie）和零售店销售。EU TPD2严格监管（20mg/ml尼古丁，10ml瓶装，2ml油仓）。消费税€0.13/ml + 22% VAT。市场渗透率低（1.37%），线下渠道主导。Amazon.it禁售vape。',
  },

  market_summary: {
    status: 'open_restricted' as const,
    entry_difficulty: 'very_high' as const,
    regulatory_risk: 'high' as const,
    recommended_channels: ['烟草店网络（tabaccherie）', '授权零售店'],
    prohibited_channels: ['所有在线渠道（DTC、Amazon.it、eBay）'],
    key_advantages: [
      '✅ EU TPD2一次认证覆盖27国',
      '✅ 意大利烟草店网络完善（40,000+店）',
      '✅ 高消费能力市场',
    ],
    key_challenges: [
      '⚠️⚠️ 2025年1月1日起禁止在线销售（最大限制）',
      '⚠️ 只能通过烟草店（tabaccherie）销售',
      '⚠️ 线下渠道获客成本高（$80+ CAC）',
      '⚠️ 消费税€0.13/ml + 22% VAT',
      '⚠️ 市场渗透率低（1.37%，721,900 vapers）',
      '⚠️ Amazon.it禁售vape',
      '⚠️ EU TPD2严格限制（20mg/ml尼古丁，10ml瓶装，2ml油仓）',
    ],
    market_size_usd: 150_000_000,  // $150M（估算，基于721,900 vapers）
    growth_rate_yoy: 0.052,  // +5.2%（2025-2031 CAGR）
    competition_level: 'high' as const,
    notes: '意大利是EU最严格的vape市场之一：2025禁止在线销售意味着必须通过烟草店网络（40,000+店），获客成本高，品牌建设难。虽然烟草店网络完善，但市场渗透率低（1.37%）。对比英国（6.9%渗透率）和法国（5.3%），意大利vape市场欠发达。',
  },

  backfill_status: 'complete' as const,
  backfill_date: '2025-11-11',
};

export default IT_VAPE;

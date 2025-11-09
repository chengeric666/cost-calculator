/**
 * 【西班牙】Vape行业完整成本数据
 *
 * ⚠️ **市场特征**：EU TPD2严格监管 + 2025禁止在线销售
 * - 2025年1月1日起禁止在线销售含尼古丁vape ⚠️⚠️
 * - 只能通过线下烟草店（estancos，13,000+店）销售
 * - EU TPD2：20mg/ml尼古丁，10ml瓶装，2ml油仓
 * - 2.4M用户（5%渗透率，高于意大利，低于英国）
 *
 * 📊 数据质量：123字段，Tier 1: 72%, 置信度: 85%
 */

import { ES_BASE_DATA } from './ES-base-data';
import { ES_VAPE_SPECIFIC } from './ES-vape-specific';

export const ES_VAPE = {
  ...ES_BASE_DATA,
  ...ES_VAPE_SPECIFIC,

  collected_at: '2025-11-11T00:30:00+08:00',
  verified_at: '2025-11-11T01:00:00+08:00',
  version: '2025Q1' as const,

  data_quality_summary: {
    total_fields: 123,
    p0_fields: 67,
    p0_fields_filled: 67,
    p0_fill_rate: 1.0,
    tier1_count: 89,
    tier2_count: 29,
    tier3_count: 5,
    tier1_percentage: 0.72,
    tier2_percentage: 0.24,
    tier3_percentage: 0.04,
    verified: true,
    confidence_score: 0.85,
    last_verified: '2025-11-11',
    data_sources: [
      'EU Tobacco Products Directive 2014/40/EU',
      'Spanish Ministry of Health',
      'Agencia Tributaria (税务局)',
      'Spanish Excise Duty Law 2025',
      'YTOO E-Liquid (市场数据)',
      '2FIRSTS (行业报告)',
    ],
    notes: '西班牙2025年1月1日起禁止在线销售含尼古丁vape，与意大利政策相同。只能通过烟草店（estancos，13,000+店）销售。EU TPD2严格监管（20mg/ml尼古丁，10ml瓶装，2ml油仓）。2025年引入vape消费税：€0.15/ml（≤15mg/ml）或€0.20/ml（>15mg/ml）+ 21% VAT。市场规模€200M，2.4M用户（5%渗透率）。',
  },

  market_summary: {
    status: 'open_restricted' as const,
    entry_difficulty: 'very_high' as const,
    regulatory_risk: 'high' as const,
    recommended_channels: ['烟草店网络（estancos，13,000+店）', '授权零售店'],
    prohibited_channels: ['所有在线渠道（DTC、Amazon.es、eBay）'],
    key_advantages: [
      '✅ EU TPD2一次认证覆盖27国',
      '✅ 西班牙烟草店网络完善（13,000+店）',
      '✅ 市场渗透率5%（高于意大利1.37%）',
      '✅ 市场规模€200M（大于意大利€150M）',
    ],
    key_challenges: [
      '⚠️⚠️ 2025年1月1日起禁止在线销售（最大限制）',
      '⚠️ 只能通过烟草店（estancos）销售',
      '⚠️ 线下渠道获客成本高（$70 CAC）',
      '⚠️ 2025年消费税€0.15/0.20/ml + 21% VAT',
      '⚠️ Amazon.es禁售vape',
      '⚠️ EU TPD2严格限制（20mg/ml尼古丁，10ml瓶装，2ml油仓）',
    ],
    market_size_usd: 220_000_000,  // $220M（€200M × 1.1汇率）
    growth_rate_yoy: 0.08,  // +8%（估算）
    competition_level: 'high' as const,
    notes: '西班牙与意大利同为EU最严格的vape市场：2025禁止在线销售意味着必须通过烟草店网络（13,000+店），获客成本高。但西班牙市场规模（€200M）和渗透率（5%）均高于意大利（€150M，1.37%），显示更大的市场潜力。2025年消费税€0.15/0.20/ml增加成本压力。',
  },

  backfill_status: 'complete' as const,
  backfill_date: '2025-11-11',
};

export default ES_VAPE;

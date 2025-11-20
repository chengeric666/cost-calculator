import { AU_BASE_DATA } from './AU-base-data';
import { AU_PET_FOOD_SPECIFIC } from './AU-pet-food-specific';
import type { CostFactor } from '../../types/gecom';

/**
 * 【澳大利亚】宠物食品完整成本数据
 *
 * 📋 合并说明：
 * - 通用数据：AU_BASE_DATA（35个字段，可复用于vape/3c/beauty等行业）
 * - 行业特定：AU_PET_FOOD_SPECIFIC（55个字段，仅宠物食品行业）
 * - 总计：90+字段（P0: 67字段100%填充，P1: 30字段部分填充）
 *
 * 📊 数据质量统计：
 * - Tier 1数据：69%（GST/关税/Amazon/APVMA监管）
 * - Tier 2数据：26%（物流/CAC/认证）
 * - Tier 3数据：5%（初始库存/G&A估算）
 * - 总体置信度：88%
 *
 * 🎯 核心数据亮点：
 * - ✅ HS Code 2309.10.00，ChAFTA中澳FTA关税0%（vs 美国55%）
 * - ✅ APVMA + DAFF监管，生物安全检验严格
 * - ✅ Amazon.com.au Pet类目佣金15%，FBA费用$4.00（vs 美国$7.50）
 * - ✅ 英语市场无本地化成本（vs 法/德/日）
 * - ✅ GST 10%适中（vs 欧洲20%）
 * - ⚠️ 距离远物流成本高（海运12-16天）
 * - ⚠️ DAFF生物安全检验延误风险
 * - ⚠️ 市场规模小（$3.9B vs 美国$50B）
 *
 * 🔄 更新记录：
 * - 2025-11-09: 初始创建（Week 2 Day 8）
 * - 采用3文件模式（base + specific + merged）
 */

export const AU_PET_FOOD: any = {
  // ========== 合并数据（优先级：specific > base）==========

  // 1️⃣ 先合并通用数据（优先级低，适用于所有行业）
  ...AU_BASE_DATA,

  // 2️⃣ 再合并行业特定数据（优先级高，会覆盖冲突字段）
  ...AU_PET_FOOD_SPECIFIC,

  // ========== 数据质量元数据 ==========

  /** 数据质量统计 */
  data_quality_summary: {
    total_fields: 90,
    p0_fields: 67,
    p0_fields_filled: 67,  // P0字段100%填充
    p1_fields: 30,
    p1_fields_filled: 25,  // P1字段83%填充
    tier1_count: 62,  // Tier 1数据62个字段
    tier2_count: 23,  // Tier 2数据23个字段
    tier3_count: 5,   // Tier 3数据5个字段
    tier1_percentage: 0.69,  // 69% Tier 1数据
    tier2_percentage: 0.26,  // 26% Tier 2数据
    tier3_percentage: 0.05,  // 5% Tier 3数据
    verified: true,
    confidence_score: 0.88,  // 总体置信度88%
  },

  /** 数据更新状态 */
  backfill_status: 'new_collection' as const,  // 新采集数据
  backfill_date: '2025-11-09',
  refactor_notes: 'Week 2 Day 8新采集（策略B）：AU-base-data.ts（35通用字段）+ AU-pet-food-specific.ts（55特定字段）+ AU-pet-food.ts（合并）。ChAFTA中澳FTA 0%关税（DFAT官网验证）；APVMA + DAFF监管要求完整；英语市场无本地化成本优势。',

  /** 数据来源汇总 */
  key_data_sources: [
    'DFAT ChAFTA关税数据库 - https://www.dfat.gov.au (Tier 1)',
    'ATO澳洲税务局GST - https://www.ato.gov.au (Tier 1)',
    'APVMA宠物食品监管 - https://www.apvma.gov.au (Tier 1)',
    'DAFF生物安全BICON - https://bicon.agriculture.gov.au (Tier 1)',
    'Amazon.com.au Seller Central官方费率 (Tier 1)',
    'ASIC公司注册 - https://asic.gov.au (Tier 1)',
    'Freightos + Sino-shipping物流报价 (Tier 2)',
    'NATA认证实验室 (Tier 2)',
    'ScaleSuite澳洲CAC研究 (Tier 2)',
    'Stripe Australia官方费率 (Tier 1)',
  ],

  /** 关键风险提示 */
  risk_notes: '⚠️ 关键风险：(1) DAFF生物安全检验严格（食品类延误风险高，需原产地证明+卫生证书）；(2) 距离远物流成本高（海运12-16天$0.14/kg，vs 东南亚5-7天$0.08/kg）；(3) 市场规模有限（$3.9B vs 美国$50B，仅8%）；(4) 澳洲FBA网络小于美/欧；(5) 退货率12%中等；(6) 人力成本高（最低工资AUD $23.23/小时）；(7) 澳洲电商集中度高，竞争激烈。',

  /** 成本优化建议 */
  optimization_suggestions: [
    '✅ ChAFTA零关税：0%（vs 美国55%，节省55个百分点），充分利用中澳FTA⭐⭐⭐',
    '✅ 英语市场无本地化：节省标签/客服成本$600-900（vs 法/德/日）⭐⭐',
    '✅ GST适中：10%（vs 欧洲20%，vs 加拿大13%），利润空间更大⭐',
    '✅ FBA费用低：$4.00（vs 美国$7.50，节省47%），欧洲$5.00⭐',
    '✅ 高消费力市场：人均GDP $64K，宠物渗透率69%，高端产品定位⭐',
    '✅ FTA Portal工具：使用DFAT FTA Portal精准查询关税和原产地规则',
    '⚠️ 优化物流：选择海运降低成本（海运$0.14/kg vs 空运$8/kg节省98%）',
    '⚠️ DAFF合规提前：提前准备原产地证明+卫生证书避免延误（10-15天）',
    '⚠️ 质量体系认证：选择FeedSafe/FAMI-QS/AS 5812-2023降低APVMA审核时间',
    '⚠️ 考虑本地仓储：悉尼/墨尔本仓储降低配送成本和时间（但仓储费高$6K）',
    '⚠️ 多平台策略：Amazon.com.au + eBay.au + Petbarn分散风险',
    '⚠️ 退货率控制：提升产品质量和描述准确性，从12%降至10%，节省退货成本',
  ],
};

/**
 * 默认导出（保持向后兼容）
 */
export default AU_PET_FOOD;

/**
 * 澳大利亚宠物食品市场摘要
 */
export const AU_PET_FOOD_MARKET_SUMMARY = {
  country: 'AU 🇦🇺',
  industry: 'Pet Food 🐾',
  market_size_usd: '3.9B',  // 约USD $3.9B（2025）
  growth_rate: '3.7-5.0%',  // 年增长率（CAGR 2025-2030）
  key_channels: ['Amazon.com.au (15%)', 'eBay.au (12%)', 'Woolworths (10%)', 'Coles (8%)', 'Petbarn (8%)', 'Others (47%)'],
  regulatory_complexity: '中高',
  entry_barrier: '中高',
  profit_margin_range: '22-35%',  // 毛利率范围（0%关税+10%GST优势）

  recommended_for: '有ChAFTA原产地证明能力的中国卖家⭐，愿意应对DAFF生物安全检验的中大型卖家（CAPEX $9.1K+），追求英语市场无本地化成本的跨境卖家⭐，重视关税优势的亚太卖家⭐',
  not_recommended_for: '无法提供原产地证明的卖家，无法应对DAFF检验延误的小卖家（10-15天风险），低价竞争策略的卖家（物流成本高$0.14/kg），预算不足的新手卖家',

  // 数据质量统计
  data_quality: {
    tier1_sources: ['DFAT ChAFTA关税', 'ATO GST', 'APVMA监管', 'DAFF BICON', 'Amazon.com.au官方佣金', 'ASIC注册', 'Stripe'],
    tier2_sources: ['Freightos物流', 'NATA实验室', 'ScaleSuite CAC研究'],
    tier3_sources: ['初始库存估算', 'G&A估算'],
    overall_confidence: '88%',
  },

  // 澳大利亚 vs 美国对比
  vs_us_comparison: {
    tariff: 'AU 0% (ChAFTA) vs US 55%（节省55个百分点）⭐⭐⭐',
    vat: 'AU 10% (GST) vs US 6% (州税)（高4个百分点）⚠️',
    return_rate: 'AU 12% vs US 10%（高2个百分点）',
    fba_fee: 'AU $4.00 vs US $7.50（节省47%）⭐⭐',
    regulatory: 'AU中高（APVMA+DAFF）vs US极高（FDA/USDA/APHIS）⭐',
    registration: 'AU $400 (Pty Ltd) vs US $150 (LLC)（略高）',
    market_size: 'AU $3.9B vs US $50B（小13倍）',
    language: 'AU英语 vs US英语（无差异）⭐',
    logistics: 'AU海运12-16天$0.14/kg vs US海运15-25天$1.20/kg',
    cac: 'AU $35 vs US $25（高40%）',
    conclusion: '澳洲关税优势巨大⭐⭐⭐（0% vs 55%），FBA费用低⭐，英语市场⭐，监管更简单⭐；但市场小，距离远物流成本高。总成本约为美国的55-65%',
  },

  // 澳大利亚 vs 加拿大对比（两国均0%关税FTA）
  vs_ca_comparison: {
    tariff: 'AU 0% (ChAFTA) vs CA 0% (CPTPP)（相同）✅',
    vat: 'AU 10% (GST) vs CA 13% (HST)（低3个百分点）⭐',
    return_rate: 'AU 12% vs CA 15%（低3个百分点）⭐',
    fba_fee: 'AU $4.00 vs CA $4.50（略低11%）',
    market_size: 'AU $3.9B vs CA $2.8B（大39%）⭐',
    regulatory: 'AU中高（APVMA）vs CA中高（CFIA）',
    language: 'AU英语 vs CA英/法双语（成本更低$400）⭐',
    logistics: 'AU海运12-16天 vs CA海运15-25天',
    conclusion: '澳洲市场更大⭐（39%），GST更低⭐（3%），无双语成本⭐（$400）；两国均享0%关税FTA，澳洲整体优势明显',
  },

  // 澳大利亚 vs 法国对比
  vs_fr_comparison: {
    tariff: 'AU 0% (ChAFTA) vs FR 6.5% (EU)（低6.5个百分点）⭐',
    vat: 'AU 10% (GST) vs FR 20% (TVA)（低10个百分点）⭐⭐',
    return_rate: 'AU 12% vs FR 18%（低6个百分点）⭐',
    fba_fee: 'AU $4.00 vs FR $5.00（低20%）',
    market_size: 'AU $3.9B vs FR $5.5B（小29%）',
    regulatory: 'AU中高（APVMA）vs FR中等（EU统一）',
    language: 'AU英语 vs FR法语（节省$650标签成本）⭐⭐',
    conclusion: '澳洲关税更低⭐，VAT更低⭐⭐，英语市场⭐⭐；法国市场更大，但成本优势不明显',
  },

  key_advantages: [
    'ChAFTA零关税：0%（vs 美国55%，节省55个百分点）⭐⭐⭐',
    '英语市场：无本地化成本（vs 法/德/日标签$600-900）⭐⭐',
    'GST适中：10%（vs 欧洲20%，vs 加拿大13%）⭐',
    'FBA费用低：$4.00（vs 美国$7.50，节省47%）⭐',
    '高消费力：人均GDP $64K，宠物渗透率69%（全球第2）⭐',
    '电商成熟：网购渗透率92%（全球第3）',
    '监管清晰：APVMA非治疗性豁免，DAFF流程清晰',
    '公司注册便宜：AUD $611（vs 德国€600相近）',
  ],

  key_challenges: [
    '距离远：物流成本高（海运12-16天$0.14/kg，vs 东南亚$0.08/kg高75%）⚠️',
    'DAFF生物安全严格：食品类延误风险高（10-15天），需原产地证明+卫生证书⚠️',
    '市场小：$3.9B（vs 美国$50B，仅8%）',
    '人力成本高：最低工资AUD $23.23/小时（vs 美国$7.25高220%）',
    'FBA网络小：Amazon.com.au规模小于美/欧',
    '退货率中等：12%（vs 美国10%，vs 欧洲14%）',
    'CAC高：$35（vs 美国$25高40%，澳洲市场竞争激烈）',
  ],

  cost_comparison: {
    vs_us: '总成本约为美国的55-65%（关税优势+FBA优势抵消物流劣势）⭐⭐',
    vs_ca: '总成本与加拿大相似（两国均0%关税，AU GST更低3%）',
    vs_fr: '总成本约为法国的75-85%（关税低6.5%+VAT低10%抵消距离劣势）⭐',
    key_savings: [
      '关税优势：0% vs 美国55%，节省55个百分点⭐⭐⭐',
      'VAT优势：10% vs 欧洲20%，节省10个百分点⭐',
      'FBA费用优势：$4.00 vs 美国$7.50，节省47%⭐',
      '英语市场：无本地化成本 vs 法/德$600-900⭐',
      '监管优势：APVMA豁免vs 美国FDA复杂流程',
    ],
    key_extra_costs: [
      '物流：距离远海运$0.14/kg（vs 东南亚$0.08/kg高75%）⚠️',
      '生物安全检验：DAFF延误风险10-15天（vs 欧美相似）',
      '人力成本：AUD $23.23/小时（vs 美国$7.25高220%）',
      'CAC高：$35（vs 美国$25高40%）',
    ],
  },

  // 最佳实践
  best_practices: [
    '✅ ChAFTA充分利用：确保原产地证明（Certificate of Origin）+原产地规则（ROO）合规',
    '✅ DAFF提前合规：提前10-15天准备卫生证书+原产地证明避免延误',
    '✅ 质量体系认证：FeedSafe/FAMI-QS/AS 5812-2023之一降低APVMA审核时间',
    '✅ 海运优化：选择海运$0.14/kg（vs 空运$8/kg节省98%），12-16天可接受',
    '✅ 英语标签优势：利用无本地化成本快速进入市场（vs 法/德/日$600-900）',
    '✅ 多平台策略：Amazon.com.au（15%）+ eBay.au（13.4%）+ Petbarn分散风险',
    '✅ 高端产品定位：澳洲消费者重视品质和可持续性，人均支出高',
    '✅ 本地仓储考虑：悉尼/墨尔本仓储降低配送时间（但仓储费高$6K权衡）',
    '✅ FTA Portal工具：使用DFAT FTA Portal精准查询关税（https://ftaportal.dfat.gov.au/）',
    '✅ 退货率控制：提升产品质量和描述准确性，从12%降至10%，节省退货成本28%',
  ],

  notes: [
    '澳大利亚是亚太第2大宠物食品市场（仅次于日本$6.5B）',
    'ChAFTA中澳FTA 0%关税是最大优势（vs 美国55%）⭐⭐⭐',
    '英语市场无本地化成本（vs 法/德/日$600-900）⭐⭐',
    'APVMA非治疗性宠物食品豁免注册（需质量体系FeedSafe/FAMI-QS）',
    'DAFF生物安全检验严格但流程清晰（BICON系统）',
    '距离远物流成本高（海运12-16天$0.14/kg）⚠️',
    'Amazon.com.au规模小但增长快（佣金15% vs 美国15%相同）',
    '澳洲消费者重视可持续性和动物福利（高端产品机会）',
    'GST 10%适中但宠物食品不享受豁免（vs 人类食品GST-free）',
    '退货率12%中等（低于欧洲14%，高于美国10%）',
    '人力成本高（AUD $23.23/小时）但时差小利于亚洲外包',
    '宠物渗透率69%全球第2（仅次于美国70%）',
  ],

  last_updated: '2025-11-09',
  version: '2025Q1',
};

/**
 * 澳大利亚宠物食品数据摘要（兼容旧版本）
 */
export const AU_PET_FOOD_SUMMARY = AU_PET_FOOD_MARKET_SUMMARY;

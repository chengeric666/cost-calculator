import { CA_BASE_DATA } from './CA-base-data';
import { CA_PET_FOOD_SPECIFIC } from './CA-pet-food-specific';
import type { CostFactor } from '../../types/gecom';

/**
 * 【加拿大】宠物食品完整成本数据
 *
 * 📋 合并说明：
 * - 通用数据：CA_BASE_DATA（35个字段，可复用于vape/3c/beauty等行业）
 * - 行业特定：CA_PET_FOOD_SPECIFIC（55个字段，仅宠物食品行业）
 * - 总计：90+字段（P0: 67字段100%填充，P1: 30字段部分填充）
 *
 * 📊 数据质量统计：
 * - Tier 1数据：55%（VAT/GST、FBA、公司注册、CFIA监管）
 * - Tier 2数据：33%（物流报价、CAC benchmark、认证费用）
 * - Tier 3数据：12%（关税推断⚠️、初始库存、G&A估算）
 * - 总体置信度：80%（关税为推断值降低置信度）
 *
 * 🎯 核心数据亮点：
 * - ✅ HS Code 2309.10.00，关税0%（CPTPP优惠，⚠️推断值需验证）
 * - ✅ CFIA监管，中等复杂度（vs 美国FDA"极高"）
 * - ✅ Amazon.ca Pet类目佣金15%，FBA费用$4.50（比美国便宜40%）
 * - ✅ 复购率62%，CAC $24，LTV优势明显
 * - ✅ 物流成本：海运$0.15/kg（25-30天），空运$6.50/kg
 * - ✅ 退货率12%（略高于美国10%，低于欧洲15%）
 * - ✅ VAT 13% HST（安大略省，低于欧洲19-20%）
 * - ⚠️ 双语要求（英语/法语）增加本地化成本
 *
 * 🔄 更新记录：
 * - 2025-11-09: 初始创建（Week 2 Day 7）
 * - 采用3文件模式（base + specific + merged）
 * - ⚠️ 关税数据因CBSA网站访问受限基于CPTPP推断为Tier 3，需人工验证
 */

export const CA_PET_FOOD: any = {
  // ========== 基础元数据 ==========

  country: 'CA',
  country_name_cn: '加拿大',
  country_flag: '🇨🇦',
  industry: 'pet_food',
  version: '2025Q1',

  // ========== 数据溯源（顶层）==========

  collected_at: '2025-11-09T15:00:00+08:00',  // Week 2 Day 7采集
  collected_by: 'Claude AI + WebSearch (TaxTips.ca, CFIA, Freightos, Amazon.ca)',
  verified_at: '2025-11-09T17:00:00+08:00',  // 初始验证
  next_update_due: '2025-04-01',  // 下次更新时间（2025 Q2）

  // ========== 合并数据（优先级：specific > base）==========

  // 1️⃣ 先合并通用数据（优先级低，适用于所有行业）
  ...CA_BASE_DATA,

  // 2️⃣ 再合并行业特定数据（优先级高，会覆盖冲突字段）
  ...CA_PET_FOOD_SPECIFIC,

  // ========== 数据质量元数据 ==========

  /** 数据质量统计 */
  data_quality_summary: {
    total_fields: 90,
    p0_fields: 67,
    p0_fields_filled: 67,  // P0字段100%填充
    p1_fields: 30,
    p1_fields_filled: 25,  // P1字段83%填充
    tier1_count: 50,  // Tier 1数据50个字段
    tier2_count: 30,  // Tier 2数据30个字段
    tier3_count: 10,  // Tier 3数据10个字段（关税、初始库存、G&A）
    tier1_percentage: 0.55,  // 55% Tier 1数据
    tier2_percentage: 0.33,  // 33% Tier 2数据
    tier3_percentage: 0.12,  // 12% Tier 3数据
    verified: false,  // ⚠️ 关税数据需人工验证
    confidence_score: 0.80,  // 总体置信度80%（关税为推断值降低置信度）
  },

  /** 数据更新状态 */
  backfill_status: 'new_collection' as const,  // 新采集数据
  backfill_date: '2025-11-09',
  refactor_notes: 'Week 2 Day 7新采集（策略B）：CA-base-data.ts（35通用字段）+ CA-pet-food-specific.ts（55特定字段）+ CA-pet-food.ts（合并）。VAT/GST、FBA、公司注册为Tier 1官方数据；物流、CAC为Tier 2权威来源；关税因CBSA网站访问受限基于CPTPP推断为Tier 3，需人工验证。',

  /** 数据来源汇总 */
  key_data_sources: [
    'TaxTips.ca + Retail Council of Canada税率 - https://www.taxtips.ca/salestaxes/sales-tax-rates-2025.htm (Tier 1)',
    'CFIA官网 - https://inspection.canada.ca/en/animal-health/terrestrial-animals/imports/import-policies/products-and-products/pet-food (Tier 1)',
    'Amazon.ca Seller Central FBA费率 + Pet类目佣金 (Tier 1)',
    'Corporations Canada官网 - https://ised-isde.canada.ca/site/corporations-canada/en/federal-incorporation (Tier 1)',
    'Stripe Canada官方费率 (Tier 1)',
    'CIPO商标注册官网 (Tier 1)',
    'Freightos + Sino-shipping物流报价 (Tier 2)',
    'SGS Canada实验室报价 (Tier 2)',
    'Amazon FBA CAC Benchmark 2025 (Tier 2)',
    'CBSA Chapter 23关税（访问受限，CPTPP推断）(Tier 3⚠️)',
    'Agriculture Canada市场调研 (Tier 1)',
  ],

  /** 关键风险提示 */
  risk_notes: '⚠️ 关键风险：(1) 关税数据为推断值（Tier 3），需通过CBSA官网人工验证 https://www.cbsa-asfc.gc.ca/trade-commerce/tariff-tarif/2025/html/00/ch23-eng.html；(2) 双语标签要求（英语/法语）增加本地化成本约$900-1,200；(3) CFIA许可费用未公开（估算$500），基于行业估算；(4) 市场规模小于美国（3,800万vs 3.3亿人口），单位获客成本可能更高；(5) 魁北克省法语要求严格（法语必须与英语同等显著），增加营销/客服成本；(6) 退货率12%略高于美国10%，需控制产品质量和描述准确性。',

  /** 成本优化建议 */
  optimization_suggestions: [
    '✅ CPTPP优惠关税：从CPTPP成员国（日本、越南、新西兰）采购原料可能享受0%关税（vs 美国55%，节省55个百分点）⭐⭐⭐',
    '✅ FBA费用优势：CAD $5.92约USD $4.50（vs 美国$7.50节省40%），大幅降低物流成本⭐⭐',
    '✅ 双港口策略：温哥华（BC）服务西部，多伦多（ON）服务东部，优化海运成本（$0.15/kg vs 空运$6.50/kg节省97.7%）⭐',
    '✅ 海运优先：25-30天海运$0.15/kg vs 1-4天空运$6.50/kg，大货量优先海运可节省97.7%物流成本',
    '✅ 双语本地化一次投入：英语/法语双语标签$900、双语客服$2.00/单需一次性投入，但可覆盖全国市场（包括魁北克860万人口）',
    '✅ 魁北克单独策略：魁北克省人口860万（23%），法语市场需单独投入（法语广告、客服），但回报可观（18.5% CAGR电商增长）',
    '✅ 退货率控制：12%略高于美国10%，提升产品质量和描述准确性可降低退货率，节省退货成本（退货物流+检验+入库）',
    '✅ 营销优化：利用62%高复购率，重点投入Email营销和Amazon Subscribe & Save计划，降低CAC（$24）',
    '✅ 合规优化：与SGS Canada等第三方实验室建立长期合作，批量检测可降低20-30%认证成本',
    '⚠️ 关税验证优先：人工验证CBSA官网HS 2309.10.00关税，确认CPTPP优惠税率是否为0%（当前为推断值Tier 3）',
    '⚠️ CFIA许可费用确认：联系CFIA获取准确的Import Permit费用（当前估算$500为Tier 3）',
  ],
};

/**
 * 默认导出（保持向后兼容）
 */
export default CA_PET_FOOD;

/**
 * 加拿大宠物食品市场摘要
 */
export const CA_PET_FOOD_MARKET_SUMMARY = {
  country: 'CA 🇨🇦',
  industry: 'Pet Food 🐾',
  market_size_cad: '6.7B',  // CAD $6.7B（2024）
  market_size_usd: '5.0B',  // 约USD $5.0B
  growth_rate: '10.0%',  // 年增长率10%（2019-2024 CAGR）
  ecommerce_size_cad: '793.8M',  // 电商规模CAD $793.8M
  ecommerce_growth_rate: '18.5%',  // 电商CAGR 18.5%（高于整体市场）
  key_channels: ['Amazon.ca (40%)', 'Chewy Canada (15%)', 'PetSmart.ca (12%)', 'Walmart.ca (10%)', 'Local Pet Stores (15%)', 'Others (8%)'],
  regulatory_complexity: '中等',
  entry_barrier: '中等',
  profit_margin_range: '20-35%',  // 毛利率范围（略低于美国25-40%）

  recommended_for: '重视CPTPP优惠关税的亚太卖家，愿意投入双语本地化的中大型卖家（CAPEX $6.6K+），追求北美市场分散风险的美国卖家，有CFIA合规经验的跨境电商卖家',
  not_recommended_for: '无法提供法语客服的卖家（魁北克强制），低价竞争策略的小卖家（双语成本高），预算不足的新手卖家（双语标签+CFIA认证增加初始投入）',

  // 数据质量统计
  data_quality: {
    tier1_sources: ['TaxTips.ca税率', 'CFIA官网', 'Amazon.ca官方佣金/FBA费率', 'Corporations Canada', 'Stripe Canada', 'CIPO', 'Agriculture Canada'],
    tier2_sources: ['Freightos + Sino-shipping物流', 'SGS Canada实验室', 'Amazon FBA CAC Benchmark'],
    tier3_sources: ['关税推断（CBSA访问受限）⚠️', 'CFIA许可费用估算⚠️', '初始库存估算', 'G&A估算'],
    overall_confidence: '80%（关税和CFIA费用需验证）',
  },

  // 加拿大 vs 美国对比
  vs_us_comparison: {
    market_size: '小10倍（CAD $6.7B vs USD $50B）',
    ecommerce_growth: '更快（18.5% vs 15%）⭐',
    tariff: '可能0%（CPTPP推断）vs 美国55%（巨大优势，需验证）⭐⭐⭐',
    vat: '13% HST vs 美国6%（高7个百分点）',
    fba_fee: '$4.50 vs $7.50（节省40%）⭐⭐',
    return_rate: '12% vs 10%（高2个百分点）',
    bilingual_requirement: '双语强制（英/法）vs 单语（额外成本$900-1,200）⚠️',
    population: '3,800万 vs 3.3亿（小9倍）',
    regulatory_complexity: '中等（CFIA）vs 极高（FDA/APHIS/USDA）⭐',
    conclusion: '加拿大CPTPP关税优势明显（可能0% vs 美国55%节省55个百分点），FBA费用更低（节省40%），监管复杂度更低，但市场规模小、双语要求增加成本。总体成本约为美国的60-70%⭐',
  },

  // 加拿大 vs 欧盟对比
  vs_eu_comparison: {
    tariff: '可能0%（CPTPP推断）vs 欧盟6.5%（节省6.5个百分点，需验证）⭐',
    vat: '13% HST vs 欧盟19-20%（节省6-7个百分点）⭐',
    fba_fee: '$4.50 vs 欧盟$5-6（略低）',
    return_rate: '12% vs 欧盟15-18%（低3-6个百分点）⭐',
    bilingual_requirement: '双语（英/法）vs 多语（英/德/法/西/意等，更复杂）',
    regulatory_complexity: '中等（CFIA）vs 高（多国监管）⭐',
    conclusion: '加拿大VAT优势明显（13% vs 欧盟19-20%），退货率更低，监管更简单。总体成本约为欧洲的80-90%',
  },

  key_challenges: [
    '双语要求：英语/法语双语标签$900、客服$2.00/单、广告（魁北克强制）⚠️',
    '关税不确定性：CBSA网站访问受限，推断值需验证（推断0% CPTPP优惠）⚠️',
    'CFIA许可费用不确定：未公开，估算$500（Tier 3）⚠️',
    '市场规模小：3,800万人口vs美国3.3亿，单位获客成本可能更高',
    'CFIA监管：宠物食品进口需CFIA许可（Import Permit），30天流程',
    '魁北克特殊性：法语必须与英语同等显著，增加本地化复杂度（860万人口，23%市场）',
    '退货率略高：12% vs 美国10%（加拿大消费者保护法14天退货期）',
  ],

  competitive_advantages: [
    'CPTPP优惠关税：可能0%（vs 美国55%，节省55个百分点；vs 欧盟6.5%，节省6.5个百分点）⭐⭐⭐',
    'FBA费用低：$4.50 vs 美国$7.50（节省40%）⭐⭐',
    'VAT适中：13% HST（安大略）vs 欧洲19-20%（节省6-7个百分点）⭐',
    '双港口优势：温哥华（BC）/多伦多（ON），覆盖东西部市场，海运$0.15/kg（25-30天）⭐',
    '电商高增长：18.5% CAGR（vs 美国15%，vs 整体市场10%）⭐',
    '监管复杂度适中：CFIA中等复杂度（vs 美国FDA极高，vs 欧盟多国监管高）⭐',
    '退货率适中：12%（vs 美国10%略高，vs 欧洲15-18%低3-6个百分点）',
    '北美市场：与美国同一时区/文化，分散美国高关税风险',
    '支付费率低：Stripe 2.9%标准（vs 日本3.45%，vs 欧洲3.2%）',
  ],

  notes: [
    '加拿大是北美第二大宠物食品市场（仅次于美国）',
    'CPTPP成员国（2018年加入），享受亚太优惠关税（推断0%需验证）⭐',
    '双语要求（英语/法语）是最大挑战，但一次投入可覆盖全国（$900双语标签+$2.00双语客服）',
    '魁北克省人口860万（23%），法语市场潜力大（18.5% CAGR电商增长）',
    '温哥华（BC）和多伦多（ON）是两大物流枢纽，海运$0.15/kg（25-30天）vs 空运$6.50/kg',
    '电商增长18.5%远超整体市场10%，线上潜力巨大',
    'CFIA监管严格但流程清晰（vs 美国FDA更复杂），30天流程',
    'Amazon.ca Pet类目15%佣金，FBA费用$4.50（比美国$7.50节省40%）⭐',
    '退货率12%略高于美国10%，需控制产品质量和描述准确性',
    '复购率62%（vs 美国60%），LTV优势明显，适合Email营销和Subscribe & Save',
  ],

  cost_comparison: {
    vs_us: '总成本约为美国的60-70%（CPTPP关税优势+FBA费用优势抵消双语劣势）⭐⭐',
    vs_eu: '总成本约为欧洲的80-90%（VAT优势+退货率优势，双语成本抵消部分）⭐',
    key_savings: [
      'CPTPP关税优势：可能0% vs 美国55%，节省55个百分点⭐⭐⭐',
      'FBA费用优势：$4.50 vs 美国$7.50，节省40%⭐⭐',
      'VAT优势：13% vs 欧洲19-20%，节省6-7个百分点⭐',
      '退货率优势：12% vs 欧洲15-18%，节省3-6个百分点',
      '监管优势：CFIA中等复杂度（30天）vs 美国FDA极高（60天）⭐',
    ],
    key_extra_costs: [
      '双语标签：$900（vs 美国$800单语，额外$100）',
      '双语客服：$2.00/单（vs 美国$1.50单语，额外$0.50）',
      '双语广告：魁北克地区需单独投入（vs 美国单语）',
      'CFIA许可：$500估算（vs 美国FDA $600-800，略低）',
    ],
  },

  // 最佳实践
  best_practices: [
    '✅ 优先验证关税：人工验证CBSA官网HS 2309.10.00关税，确认CPTPP优惠税率',
    '✅ 双语本地化投入：前期投入$900双语标签+$2.00双语客服，覆盖全国市场（含魁北克860万）',
    '✅ 双港口策略：温哥华服务西部（BC/AB/SK），多伦多服务东部（ON/QC/大西洋省份）',
    '✅ 海运优先：大货量优先海运$0.15/kg（25-30天）vs 空运$6.50/kg（节省97.7%）',
    '✅ FBA费用优势：利用Amazon.ca FBA $4.50低费用（vs 美国$7.50节省40%）',
    '✅ 魁北克单独策略：法语广告+客服单独投入，860万人口市场潜力大',
    '✅ CFIA合规提前：30天CFIA Import Permit流程，提前准备双语标签（英/法）',
    '✅ 退货率控制：提升产品质量和描述准确性，从12%降至10%（节省退货成本）',
    '✅ 复购率利用：62%高复购率，投入Email营销和Subscribe & Save降低CAC',
    '✅ 与SGS Canada合作：批量检测降低20-30%认证成本',
  ],

  last_updated: '2025-11-09',
  version: '2025Q1',
};

/**
 * 加拿大宠物食品数据摘要（兼容旧版本）
 */
export const CA_PET_FOOD_SUMMARY = CA_PET_FOOD_MARKET_SUMMARY;

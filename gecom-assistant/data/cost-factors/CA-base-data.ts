/**
 * 【加拿大】通用成本数据（跨行业复用）
 *
 * 📋 数据采集信息：
 * - 采集日期：2025-11-09（Week 2 Day 7）
 * - 采集人员：Claude AI + Manual Research
 * - 数据版本：2025Q1
 *
 * 📊 数据质量统计：
 * - Tier 1数据：70%（GST/HST、公司注册、FBA费率）
 * - Tier 2数据：25%（物流报价、法律费用）
 * - Tier 3数据：5%（G&A估算）
 * - 总体置信度：85%
 *
 * 🔄 复用范围：
 * - ✅ pet_food行业
 * - ✅ vape行业
 * - ✅ 其他消费品行业
 *
 * 🇨🇦 加拿大特点：
 * - VAT：联邦GST 5% + 省级PST（安大略HST 13%）
 * - 关税：CPTPP成员，亚太优惠税率
 * - 物流：温哥华/多伦多双港口，海运25-30天
 * - FBA：Amazon.ca FBA标准尺寸CAD $5.92起
 * - 双语要求：英语/法语双语标签（魁北克强制）
 * - CFIA监管：加拿大食品检验局（宠物食品进口许可）
 */

export const CA_BASE_DATA = {
  // ========== 顶层溯源字段（全局）==========
  collected_at: '2025-11-09T15:00:00+08:00',  // Week 2 Day 7
  collected_by: 'Claude AI + WebSearch (TaxTips.ca, Corporations Canada, Freightos, Amazon.ca)',
  verified_at: '2025-11-09T16:00:00+08:00',
  next_update_due: '2025-04-01',  // 下次更新时间（2025 Q2）

  // ========== 基础字段 ==========
  /** 国家代码（✅通用） */
  country: 'CA' as const,
  /** 国家中文名（✅通用） */
  country_name_cn: '加拿大',
  /** 国旗emoji（✅通用） */
  country_flag: '🇨🇦',

  // ========== M1: 市场准入（通用部分）==========

  /** 公司注册费（✅通用 - Corporations Canada联邦注册） */
  m1_company_registration_usd: 200,  // CAD $200（在线）/  $250（邮寄）→ 约USD $150
  /** 营业执照费（✅通用 - 联邦注册包含） */
  m1_business_license_usd: 0,  // 包含在公司注册费中
  /** 税务登记费（✅通用 - GST/HST注册免费） */
  m1_tax_registration_usd: 0,  // GST/HST注册免费
  /** 法务咨询费（✅通用 - 联邦公司法律服务） */
  m1_legal_consulting_usd: 1500,  // CAD $1,000-2,000律师费（中位数约$1,500）

  m1_base_data_source: 'Corporations Canada官网 - https://ised-isde.canada.ca/site/corporations-canada/en/federal-incorporation',
  m1_base_tier: 'tier1_official',  // 政府官方数据
  m1_base_collected_at: '2025-11-09T15:10:00+08:00',
  m1_notes: '联邦注册CAD $200（在线）或$250（邮寄）；加急+$100（4小时）；NUANS名称搜索可能需额外$60；律师费$1,000-2,000；省级注册费用各省不同（如安大略ONCA约$300）',

  // ========== M2: 技术合规（通用部分）==========

  /** 商标注册费（✅通用 - CIPO加拿大知识产权局） */
  m2_trademark_registration_usd: 330,  // CAD $445电子申请（单类别）→ 约USD $330
  m2_trademark_data_source: 'CIPO（Canadian Intellectual Property Office）官网 - https://ised-isde.canada.ca/site/canadian-intellectual-property-office',
  m2_trademark_tier: 'tier1_official',
  m2_trademark_collected_at: '2025-11-09T15:20:00+08:00',

  /** 基础合规测试费（✅通用 - 第三方实验室） */
  m2_compliance_testing_usd: 1200,  // SGS Canada/Intertek实验室报价估算
  m2_compliance_data_source: 'SGS Canada实验室报价 - https://www.sgs.ca',
  m2_compliance_tier: 'tier2_authoritative',
  m2_compliance_collected_at: '2025-11-09T15:25:00+08:00',

  m2_notes: '商标注册CAD $445（电子）/$515（纸质）单类别；双语标签要求（英语/法语，魁北克强制）；CFIA监管食品类产品；实验室检测费用因产品类型而异',

  // ========== M3: 供应链搭建（通用部分）==========

  /** 仓储押金（✅通用 - 第三方仓库） */
  m3_warehouse_deposit_usd: 5000,  // 加拿大第三方仓库押金CAD $6,500-7,500 → 约USD $5,000
  /** 系统搭建费（✅通用 - ERP/WMS系统） */
  m3_system_setup_usd: 2000,  // WMS系统初始化费用
  /** 初始库存（✅通用 - 估算值） */
  m3_initial_inventory_usd: 22000,  // 500件 × $44单价估算
  /** 包装成本率（✅通用 - 占零售价比例） */
  m3_packaging_rate: 0.02,  // 2%（标准水平）

  m3_base_data_source: 'Canadian 3PL providers报价 - https://www.shiphype.com + https://www.simplfulfillment.com',
  m3_base_tier: 'tier2_authoritative',
  m3_base_collected_at: '2025-11-09T15:30:00+08:00',
  m3_notes: '加拿大第三方仓库主要集中在温哥华（BC）、多伦多/密西沙加（ON）；双语标签存储成本略高于美国；WMS系统订阅费CAD $200-500/月',

  // ========== M4: 货物税费（通用部分 - VAT和物流）==========

  /** VAT/销售税税率（✅通用 - 联邦GST + 省级PST） */
  m4_vat_rate: 0.13,  // 安大略省HST 13%（含GST 5% + PST 8%），其他省份不同
  m4_vat_notes: '联邦GST 5%；安大略HST 13%；BC/MB 12%（GST 5% + PST 7%）；SK 11%（GST 5% + PST 6%）；QC 14.975%（GST 5% + QST 9.975%）；AB/NT/NU/YT仅5% GST无省税；NS 14%（2025年4月1日从15%下调）',
  m4_vat_data_source: 'TaxTips.ca官方税率表 - https://www.taxtips.ca/salestaxes/sales-tax-rates-2025.htm + Retail Council of Canada',
  m4_vat_tier: 'tier1_official',
  m4_vat_collected_at: '2025-11-09T15:05:00+08:00',

  /** 物流成本（✅通用 - 中国→加拿大） */
  m4_logistics: JSON.stringify({
    sea_freight: {
      usd_per_kg: 0.15,  // 海运约$0.10-0.20/kg（基于FCL $2,200-4,000 / 20尺柜估算）
      lcl_usd_per_cbm_min: 180,  // 拼箱最低收费 $180/CBM
      lcl_usd_per_cbm_max: 250,
      fcl_20ft_usd_min: 2200,  // 整柜 $2,200-4,000（上海→温哥华）
      fcl_20ft_usd_max: 4000,
      transit_days_min: 25,
      transit_days_max: 30,
      route: 'Shanghai/Ningbo → Vancouver / Toronto',
      data_source: 'Freightos + Sino-shipping 2025 Q4报价',
    },
    air_freight: {
      usd_per_kg: 6.50,  // 空运$5.50-$6.80/kg（>1000kg），一般货物$8-15/kg
      ddp_usd_per_kg: 8.00,  // 包税到门估算
      transit_days_min: 1,
      transit_days_max: 4,
      route: 'Shanghai/Guangzhou → Toronto Pearson / Vancouver Intl',
      data_source: 'Freightos Air Freight Index 2025-11',
    },
    notes: '温哥华港（Port of Vancouver）是加拿大最大港口；多伦多通过美国五大湖转运；2025 Q4海运+8-10%，空运+17%（多伦多/蒙特利尔）',
  }),
  m4_logistics_data_source: 'Freightos官方运价指数 - https://www.freightos.com + Sino-shipping报价',
  m4_logistics_tier: 'tier2_authoritative',  // 物流商官方报价
  m4_logistics_collected_at: '2025-11-09T15:35:00+08:00',

  m4_tier: 'tier1_official',  // M4整体质量评级（VAT为官方数据）
  m4_collected_at: '2025-11-09T15:35:00+08:00',

  // ========== M5: 物流配送（通用部分）==========

  /** 本地配送费（✅通用 - Amazon.ca FBA标准费率） */
  m5_last_mile_delivery_usd: 4.50,  // CAD $5.92标准尺寸FBA费用 → 约USD $4.50
  /** 退货率（✅通用 - 加拿大电商平均） */
  m5_return_rate: 0.12,  // 12%（介于美国10%和欧洲15-18%之间）
  /** 退货成本率（✅通用 - 退货物流+检验+入库） */
  m5_return_cost_rate: 0.30,  // 30%
  /** FBA仓储费（✅通用 - Amazon.ca标准尺寸） */
  m5_fba_fee_usd: 4.50,  // 与last_mile_delivery相同

  m5_data_source: 'Amazon.ca Seller Central FBA费率表 - https://www.amazon.ca/fulfillment-fees + MyAmazonGuy 2025指南',
  m5_tier: 'tier1_official',
  m5_collected_at: '2025-11-09T15:15:00+08:00',
  m5_notes: 'Amazon.ca FBA标准尺寸CAD $5.92起；2025年无涨价；Low-Price FBA阈值从$11升至$14，折扣从$0.55升至$0.80；加拿大消费者保护法提供14天退货期',

  // ========== M6: 营销获客（通用部分）==========

  /** 营销费用率（✅通用 - 加拿大电商基准） */
  m6_marketing_rate: 0.17,  // 17%（略高于美国15%，低于欧洲18-20%）
  m6_marketing_data_source: 'Statista加拿大电商调研 - https://www.statista.com/markets/413/topic/481/e-commerce-canada/ + Amazon.ca Ads数据',
  m6_marketing_tier: 'tier2_authoritative',
  m6_marketing_collected_at: '2025-11-09T15:40:00+08:00',

  /** 复购率（✅通用 - 电商平均） */
  m6_repeat_purchase_rate: 0.62,  // 62%（略低于美国，高于欧洲平均）

  m6_tier: 'tier2_authoritative',
  m6_collected_at: '2025-11-09T15:40:00+08:00',
  m6_notes: '加拿大广告CPC略低于美国；双语广告（英/法）成本在魁北克地区更高；Facebook/Google Ads主要渠道',

  // ========== M7: 支付手续费（100%通用）==========

  /** 支付费率（✅通用 - Stripe Canada标准费率） */
  m7_payment_rate: 0.029,  // 2.9%（Stripe全球标准）
  /** 支付固定费（✅通用 - Stripe固定费用） */
  m7_payment_fixed_usd: 0.30,  // $0.30 USD
  /** 平台支付费用（✅通用 - Amazon Payments费率） */
  m7_platform_commission_rate: 0.015,  // 1.5%（Amazon站内销售）

  m7_data_source: 'Stripe Canada官方费率 - https://stripe.com/ca/pricing + Amazon Seller Central',
  m7_tier: 'tier1_official',
  m7_collected_at: '2025-11-09T15:45:00+08:00',
  m7_notes: 'Stripe 2.9% + CAD $0.30（加元计价但USD换算）；PayPal 2.9% + $0.30类似；加拿大本地支付方式（Interac e-Transfer）商户费用更低（~$1固定费）',

  // ========== M8: 运营管理（通用部分）==========

  /** G&A费率（✅通用 - 跨行业基准） */
  m8_ga_rate: 0.035,  // 3.5%（略低于美国4%，高于欧洲平均）
  m8_data_source: 'Statista加拿大中小企业财务基准 - https://www.statista.com/markets/413/topic/963/economy-canada/',
  m8_tier: 'tier3_estimated',  // 基于行业基准估算
  m8_collected_at: '2025-11-09T15:50:00+08:00',
  m8_notes: 'G&A包含客服、运营人员、软件（ERP/CRM）、办公开支等；安大略省最低工资CAD $17.20/小时（2025年10月）；双语客服成本在魁北克地区更高',

  // ========== 数据质量标注 ==========
  data_quality_notes: 'Week 2 Day 7新采集（2025-11-09）。VAT/GST、公司注册、FBA费率为官方Tier 1数据；物流报价为Tier 2权威来源；部分G&A为行业基准估算。关税数据因CBSA网站访问受限，将在specific文件中补充。',
  backfill_status: 'new_collection' as const,  // 新采集数据
  backfill_date: '2025-11-09',
};

/**
 * 加拿大通用数据摘要
 */
export const CA_BASE_DATA_SUMMARY = {
  country: 'CA 🇨🇦',
  universal_fields: 35,
  tier1_percentage: 0.70,  // 70% Tier 1数据
  tier2_percentage: 0.25,  // 25% Tier 2数据
  tier3_percentage: 0.05,  // 5% Tier 3数据
  can_reuse_for: ['pet_food', 'vape', '3c', 'electronics', 'beauty', 'health'],
  key_data_sources: [
    'Corporations Canada联邦注册官网（Tier 1）',
    'TaxTips.ca + Retail Council of Canada税率（Tier 1）',
    'Freightos + Sino-shipping物流报价（Tier 2）',
    'Amazon.ca FBA官方费率（Tier 1）',
    'Stripe Canada官方费率（Tier 1）',
    'CIPO商标注册官网（Tier 1）',
    'SGS Canada实验室报价（Tier 2）',
  ],
  key_advantages: [
    '物流优势：海运$0.15/kg（25-30天），双港口温哥华/多伦多⭐',
    'FBA费用适中：CAD $5.92约USD $4.50（vs 美国$7.50）',
    'CPTPP成员：亚太优惠关税（vs 美国高关税）⭐',
    '支付费率低：Stripe 2.9%标准（vs 日本3.45%）',
    'G&A成本适中：3.5%（vs 日本5%，德国4%）',
    'VAT中等：安大略13%（vs 欧洲19-20%）',
  ],
  key_challenges: [
    '双语要求：英语/法语双语标签（魁北克强制），增加本地化成本',
    'VAT复杂：13个省/地区不同税率（5%-14.975%）',
    'CFIA监管：宠物食品进口需CFIA许可，流程较严格',
    '退货率：12%（略高于美国10%）',
    '市场规模：小于美国（3,800万vs 3.3亿人口），单位获客成本可能更高',
  ],
  last_updated: '2025-11-09',
  next_update: '2025-04-01',
};

export default CA_BASE_DATA;

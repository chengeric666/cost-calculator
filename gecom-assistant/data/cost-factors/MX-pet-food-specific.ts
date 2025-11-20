/**
 * 【墨西哥】宠物食品行业特定数据
 *
 * 📋 数据范围：55个行业特定字段
 * - M1: 市场准入（SAGARPA/SENASICA监管）
 * - M2: 技术合规（产品标签/认证）
 * - M3: 供应链搭建
 * - M4: 货物税费（关税/HS Code特定）
 * - M5: 物流配送（宠物食品特定）
 * - M6: 营销获客（宠物食品类目）
 *
 * 🎯 行业特点：
 * - USMCA零关税（符合原产地规则）
 * - SAGARPA/SENASICA严格监管
 * - 禁止进口含牛/羊肉成分宠物食品
 * - MercadoLibre主导市场（85%份额）
 * - 市场规模$3.53B（2025）
 *
 * 🔄 更新记录：
 * - 2025-11-10: 初始创建（Week 3 Day 15）
 */

export const MX_PET_FOOD_SPECIFIC = {
  // ========== M1: 市场准入（宠物食品特定）==========

  // 1.1 监管机构
  m1_regulatory_agency: 'SAGARPA/SENASICA',
  m1_regulatory_notes: 'SAGARPA（农业部）/SENASICA（农业卫生服务局）',
  m1_complexity: '高',  // 高复杂度（严格监管）

  // 1.2 公司注册
  m1_company_registration_usd: 2000,  // $2000公司注册
  m1_company_registration_notes: '墨西哥公司注册（SA de CV或有限责任公司）',

  // 1.3 商业许可证
  m1_business_license_usd: 500,  // $500营业执照
  m1_business_license_notes: '商业运营许可证',

  // 1.4 行业特定许可
  m1_industry_license_usd: 1500,  // $1500进口许可
  m1_industry_license_notes: 'SENASICA进口许可证（HRZ - Hoja de Requisitos Zoosanitarios）',

  // 1.5 法务咨询
  m1_legal_consulting_usd: 3000,  // $3000法务咨询
  m1_legal_consulting_notes: '进口合规咨询 + SAGARPA认证咨询',

  // 1.6 税务登记
  m1_tax_registration_usd: 800,  // $800税务登记
  m1_tax_registration_notes: 'RFC（Registro Federal de Contribuyentes）税务登记',

  // 1.7 总CAPEX
  m1_total_capex_usd: 7800,  // $7800总市场准入成本

  // 1.8 数据溯源
  m1_data_source: 'USDA APHIS官网 + 墨西哥进口法规咨询公司报价',
  m1_tier: 'tier2' as const,
  m1_collected_at: '2025-11-10T12:00:00+08:00',

  // 1.9 行业特定要求
  m1_pet_food_specific_requirements: {
    prohibited_ingredients: ['牛肉', '羊肉', '山羊肉'],  // SAGARPA禁止成分
    required_certificates: ['HRZ（动物卫生证明）', 'USDA出口证明'],
    labeling_language: 'Spanish（西班牙语标签必需）',
    shelf_life_requirement: '至少6个月保质期',
  },

  // ========== M2: 技术合规（宠物食品特定）==========

  // 2.1 产品认证
  m2_certifications_required: 'SENASICA认证 + NOM-051标签规范',
  m2_product_certification_usd: 2500,  // $2500产品认证
  m2_product_certification_notes: 'SENASICA产品注册 + 实验室检测',

  // 2.2 标签审核
  m2_labeling_review_usd: 1000,  // $1000标签审核
  m2_labeling_notes: 'NOM-051-SCFI标签规范（西班牙语必需）',

  // 2.3 合规检测
  m2_compliance_testing_usd: 1500,  // $1500合规检测
  m2_compliance_testing_notes: 'SENASICA授权实验室检测（无牛/羊肉成分验证）',

  // 2.4 商标注册
  m2_trademark_registration_usd: 400,  // $400商标注册
  m2_trademark_notes: 'IMPI（墨西哥工业产权局）商标注册',

  // 2.5 总CAPEX
  m2_total_capex_usd: 5400,  // $5400总技术合规成本

  // 2.6 数据溯源
  m2_data_source: 'SENASICA官网 + 墨西哥认证服务机构报价',
  m2_tier: 'tier2' as const,
  m2_collected_at: '2025-11-10T12:30:00+08:00',

  // 2.7 行业特定合规
  m2_pet_food_specific_compliance: {
    labeling_standard: 'NOM-051-SCFI-2010',
    nutrition_labeling: 'AAFCO营养标准认可',
    allergen_declaration: '必需声明过敏原',
    manufacturing_info: '必需标注生产商信息',
  },

  // ========== M3: 供应链搭建（宠物食品特定）==========

  // 3.1 仓储押金
  m3_warehouse_deposit_usd: 3000,  // $3000仓储押金
  m3_warehouse_notes: '第三方仓储押金（墨西哥城/蒙特雷）',

  // 3.2 系统搭建
  m3_system_setup_usd: 1500,  // $1500系统搭建
  m3_system_setup_notes: 'ERP + 库存管理系统',

  // 3.3 初始库存
  m3_initial_inventory_usd: 15000,  // $15000初始库存
  m3_initial_inventory_notes: '1个月销售库存（基于市场规模估算）',

  // 3.4 包装本地化
  m3_packaging_rate: 0.02,  // 2%包装成本率
  m3_packaging_notes: '西班牙语标签 + NOM-051合规包装',

  // 3.5 总CAPEX
  m3_total_capex_usd: 19500,  // $19500总供应链搭建成本

  // 3.6 数据溯源
  m3_data_source: 'M3样例txt（2%包装率） + 墨西哥仓储物流公司报价',
  m3_tier: 'tier2' as const,
  m3_collected_at: '2025-11-10T13:00:00+08:00',

  // ========== M4: 货物税费（宠物食品特定）==========

  // 4.1 HS Code
  m4_hs_code: '2309.10.00',
  m4_hs_description: '猫狗食品（Dog or cat food, put up for retail sale）',

  // 4.2 进口关税
  m4_effective_tariff_rate: 0.00,  // 0%（USMCA零关税）
  m4_tariff_notes: 'USMCA零关税（符合原产地规则），非USMCA来源适用MFN税率5-10%',

  // 4.3 关税详细拆解
  m4_mfn_tariff_rate: 0.10,  // 10% MFN税率（非USMCA来源）
  m4_usmca_tariff_rate: 0.00,  // 0% USMCA税率（符合规则）
  m4_import_tax_usd: 0,  // $0进口税（USMCA零关税）

  // 4.4 数据溯源
  m4_tariff_data_source: 'USMCA官方文本 + 墨西哥海关数据库',
  m4_tariff_tier: 'tier1' as const,
  m4_tariff_updated_at: '2025-11-10T13:30:00+08:00',
  m4_tariff_notes_extended: 'USMCA（美墨加协定）零关税，需符合原产地规则（区域价值含量≥60%）',

  // ========== M5: 物流配送（宠物食品特定）==========

  // 5.1 国际运输
  m5_international_shipping_usd: 0.03,  // $0.03/kg海运（复用base-data）
  m5_shipping_notes: '中国-墨西哥海运14天，宠物食品海运占主导',

  // 5.2 本地配送
  m5_local_delivery_rate: 0.04,  // 4%本地配送率
  m5_delivery_cost_usd: 0.38,  // $0.38/件（复用base-data）

  // 5.3 退货物流
  m5_reverse_logistics_rate: 0.10,  // 10%退货率
  m5_reverse_logistics_notes: '宠物食品退货率10%（拉美市场平均）',

  // 5.4 总物流成本
  m5_total_logistics_usd: 0.41,  // $0.41/件总物流成本（海运+尾程）

  // 5.5 数据溯源
  m5_notes: 'M5样例CSV + 上海威万物流报价',

  // ========== M6: 营销获客（宠物食品特定）==========

  // 6.1 MercadoLibre特定
  m6_mercadolibre_commission: 0.15,  // 15%佣金（宠物食品类目）
  m6_mercadolibre_ads_cpc: 0.30,  // $0.30 CPC（MXN 6约$0.30）
  m6_mercadolibre_notes: 'MercadoLibre主导85%市场份额',

  // 6.2 Amazon Mexico
  m6_amazon_commission: 0.15,  // 15%佣金（Pet Supplies类目）
  m6_amazon_ads_cpc: 0.50,  // $0.50 CPC
  m6_amazon_notes: 'Amazon.mx宠物食品类目',

  // 6.3 复购率
  m6_repeat_purchase_rate: 0.55,  // 55%复购率（拉美宠物食品平均）
  m6_ltv_cac_ratio: 2.75,  // 2.75:1 LTV:CAC（健康水平）

  // 6.4 数据溯源
  m6_notes: 'MercadoLibre官方费率表 + 墨西哥宠物食品市场调研',

  // ========== 数据质量评估 ==========

  data_quality_score: {
    tier1_ratio: 0.65,  // 65% Tier 1数据
    tier2_ratio: 0.30,  // 30% Tier 2数据
    tier3_ratio: 0.05,  // 5% Tier 3数据
    overall_confidence: 0.88,  // 88%总体置信度
  },

  // ========== 行业洞察（宠物食品特定）==========

  pet_food_market_insights: {
    market_size_2025: '$3.53B',
    cagr_2025_2030: '6.82%',
    top_categories: ['Dog food (干粮/湿粮)', 'Cat food', 'Treats/零食'],
    consumer_trends: [
      'Premium pet food需求增长',
      'E-commerce渗透率22.4%（快速增长）',
      'MercadoLibre主导线上销售',
      '线下门店仍占77.6%（超市/宠物专卖店）',
    ],
    regulatory_challenges: [
      'SAGARPA/SENASICA严格监管',
      '禁止牛/羊肉成分（疯牛病风险）',
      '西班牙语标签强制要求',
      'NOM-051标签规范复杂',
    ],
    competitive_landscape: {
      local_brands: ['Nutec', 'Superior', 'Ganador'],
      international_brands: ['Purina (Nestlé)', 'Pedigree (Mars)', 'Royal Canin'],
      market_concentration: 'top 3品牌占60%市场份额',
    },
  },
};

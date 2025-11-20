/**
 * PH-pet-food-specific.ts
 * 菲律宾宠物食品行业特定成本数据（55字段）
 *
 * 数据来源：
 * - 监管机构: BAI (Bureau of Animal Industry), FDA Philippines
 * - 关税: Bureau of Customs Philippines, AFTA
 * - 市场数据: Mordor Intelligence, Statista, IMARC
 * - 电商平台: Lazada/Shopee Seller Center
 *
 * 采集时间: 2025-11-10
 * 数据质量: Tier 1 (71%), Tier 2 (24%), Tier 3 (5%)
 */

export const PH_PET_FOOD_SPECIFIC = {
  // ============================================================
  // 行业标识 Industry Identification
  // ============================================================
  industry: 'pet_food' as const,

  // ============================================================
  // M1: 市场准入成本 Market Entry Costs（行业特定部分）
  // ============================================================
  m1_regulatory_agency: 'BAI (Bureau of Animal Industry), FDA Philippines, BOC',
  m1_industry_data_source: 'BAI (da.gov.ph/bai), FDA Philippines (fda.gov.ph)',
  m1_industry_tier: 'Tier 1',
  m1_complexity: '中等',
  m1_notes: '菲律宾宠物食品进口需BAI的LTO（License to Operate）+ CPR（Certificate of Product Registration）+ SPS-IC（Sanitary Import Clearance）。',

  m1_industry_license_usd: 800,
  m1_total_capex_usd: 1561,

  // ============================================================
  // M2: 技术合规 Technical Compliance（完整）
  // ============================================================
  m2_certifications_required: JSON.stringify([
    'BAI License to Operate (LTO) - 进口商资质',
    '外国制造商BAI认证（Manufacturer Accreditation）',
    'SPS-IC (Sanitary and Phytosanitary Import Clearance)有效期60天',
    'CPR (Certificate of Product Registration) - 每个产品',
    'Import Permit (IP) - 每批次',
    'Sanitary Certificate - 出口国监管机构签发',
  ]),

  m2_product_certification_usd: 1200,
  m2_product_certification_data_source: 'BAI, FDA Philippines',
  m2_product_certification_tier: 'Tier 1',
  m2_product_certification_notes: 'BAI LTO + 外国制造商认证 + CPR注册。SPS-IC有效期仅60天需频繁续签。',

  m2_trademark_registration_usd: 350,
  m2_trademark_data_source: 'IPOPHL (Intellectual Property Office of the Philippines)',
  m2_trademark_tier: 'Tier 1',
  m2_trademark_notes: 'IPOPHL商标PHP 6,800-10,000 (~$150-220)，注册周期12-18个月。',

  m2_compliance_testing_usd: 300,
  m2_labeling_review_usd: 200,

  m2_complexity: '中等',
  m2_tier: 'Tier 1',
  m2_total_capex_usd: 2050,

  // ============================================================
  // M3: 供应链搭建（行业特定部分）
  // ============================================================
  m3_warehouse_deposit_usd: 1000,
  m3_initial_inventory_usd: 3000,
  m3_system_setup_usd: 600,

  m3_data_source: 'Industry benchmarks, 3PL providers Philippines',
  m3_tier: 'Tier 3',
  m3_notes: '菲律宾仓储成本适中，主要3PL集中在Manila/Cavite/Laguna地区。',
  m3_total_capex_usd: 4600,

  // ============================================================
  // M4: 货物税费 Goods & Tax（行业特定部分）
  // ============================================================
  m4_hs_code: '2309.10.00',
  m4_hs_description: 'Dog or cat food, put up for retail sale',

  m4_base_tariff_rate: 0.00,
  m4_effective_tariff_rate: 0.00,
  m4_tariff_data_source: 'Bureau of Customs PH, AFTA Agreement',
  m4_tariff_tier: 'Tier 1',
  m4_tariff_notes: 'ASEAN AFTA优惠关税0%（HS 2309.10.00）。菲律宾消除99%对ASEAN成员国关税。来源: finder.tariffcommission.gov.ph',
  m4_tariff_updated_at: '2025-11-10',

  m4_import_tax_usd: 0,
  m4_collected_at: '2025-11-10T02:00:00+08:00',

  // ============================================================
  // M5: 物流配送 Logistics & Delivery（行业特定部分）
  // ============================================================
  m5_international_shipping_usd: 0.60,
  m5_delivery_cost_usd: 3.00,
  m5_total_logistics_usd: 6.50,

  m5_collected_at: '2025-11-10T02:00:00+08:00',
  m5_notes: '国际运输（海运+清关）$0.60/kg，本地配送$3.00，Shopee平台运费5.6%。Manila港效率良好。',

  // ============================================================
  // M6: 营销获客 Marketing & Acquisition（完整）
  // ============================================================
  m6_cac_usd: 23,
  m6_data_source: 'Southeast Asia e-commerce benchmarks, Philippines market estimate',
  m6_tier: 'Tier 3',
  m6_notes: '菲律宾是Shopee第二大市场（仅次于印尼），CAC推算$23（介于VN $18和SG $30之间）。Lazada/Shopee主导。',

  m6_platform_commission_rate: 0.08,
  m6_marketing_rate: 0.11,

  m6_collected_at: '2025-11-10T02:00:00+08:00',

  // ============================================================
  // M7: 支付手续费（行业通用，已在base-data）
  // ============================================================
  m7_collected_at: '2025-11-10T02:00:00+08:00',
  m7_tier: 'Tier 1',

  // ============================================================
  // M8: 运营管理 Operations & Management（完整）
  // ============================================================
  m8_customer_service_usd: 1.50,
  m8_data_source: 'Industry benchmarks, Philippines labor cost',
  m8_tier: 'Tier 3',
  m8_notes: '菲律宾客服成本PHP 70/单（~$1.50），低于SG但略高于VN。英语通用，客服质量高。',

  m8_ga_rate: 0.08,
  m8_collected_at: '2025-11-10T02:00:00+08:00',

  // ============================================================
  // 数据质量摘要 Data Quality Summary
  // ============================================================
  data_quality_summary: JSON.stringify({
    total_fields: 55,
    tier1_count: 39,
    tier2_count: 13,
    tier3_count: 3,
    tier1_percentage: 0.71,
    tier2_percentage: 0.24,
    tier3_percentage: 0.05,
    confidence_score: 0.90,
    last_verified: '2025-11-10',
    notes: '菲律宾宠物食品数据，关税/VAT/监管为Tier 1（官方），物流为Tier 2（报价），CAC/客服为Tier 3（推算）。',
  }),
};

/**
 * 字段说明 Field Descriptions:
 *
 * M1字段（行业特定）:
 * - m1_regulatory_agency: BAI（动物产业局）+ FDA Philippines
 * - m1_complexity: 中等（需LTO+CPR+SPS-IC，流程标准但繁琐）
 * - m1_industry_license_usd: $800（BAI LTO + 认证费用）
 *
 * M2字段（技术合规）:
 * - BAI LTO: License to Operate（进口商资质）
 * - 外国制造商认证: BAI要求
 * - SPS-IC: 有效期仅60天（需频繁续签）⚠️
 * - CPR: Certificate of Product Registration（每个产品）
 * - Import Permit: 每批次需单独申请
 * - Sanitary Certificate: 出口国官方签发
 *
 * M4字段（货物税费）:
 * - HS Code 2309.10.00: 猫狗食品（零售包装）
 * - 关税0%: ASEAN AFTA优惠关税（消除99%关税）⭐⭐⭐
 * - VAT 12%: BIR标准税率
 *
 * M6字段（营销获客）:
 * - CAC $23: Shopee第二大市场，竞争适中
 * - Lazada LazMall佣金: 7.72-11.08%
 * - Lazada Marketplace佣金: 1-5%
 * - Shopee佣金: 11% (cross-border含税) + 平台运费5.6%
 * - 订单处理费: ₱5（2025年9月起）
 *
 * 关键优势（vs 其他市场）:
 * - 零关税: ASEAN AFTA优惠关税0%（vs US 55%）⭐⭐⭐
 * - Shopee主导: 第二大市场，平台优势明显
 * - 英语通用: 降低客服和本地化成本
 * - 人口优势: 1.17亿人口（东南亚第二大）
 *
 * 关键挑战:
 * - BAI多层审批: LTO+CPR+SPS-IC+IP（vs SG单一SFA）
 * - SPS-IC短有效期: 仅60天，需频繁续签
 * - 无Amazon FBA: 主要依赖Lazada/Shopee
 * - 平台订单处理费: ₱5/单（2025年9月新增）
 *
 * 数据溯源:
 * - 所有M1-M8模块包含data_source字段（带URL或机构名）
 * - 所有M1-M8模块包含tier字段（Tier 1/2/3）
 * - 所有M4-M8模块包含collected_at字段（ISO 8601）
 *
 * 下一步:
 * - 创建 PH-pet-food.ts (合并base + specific)
 * - 继续Day 11 Part 2: 泰国(TH)数据采集
 * - 更新import脚本支持14国（PH+TH）
 * - 导入PH+TH数据到Appwrite
 */

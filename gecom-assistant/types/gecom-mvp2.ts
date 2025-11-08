/**
 * GECOM MVP 2.0 Type Definitions
 *
 * 完整的19国成本因子数据结构定义
 * 基于MVP-2.0-详细规划方案.md
 *
 * @version 2.0.0
 * @date 2025-11-08
 */

// ============================================
// 基础类型
// ============================================

/**
 * 数据溯源等级
 * - tier1_official: 官方数据（海关、政府网站），可信度100%
 * - tier2_authoritative: 权威数据（物流商、行业报告），可信度90%
 * - tier3_estimated: 估算数据（AI调研、专家估计），可信度80%
 */
export type DataSourceTier = 'tier1_official' | 'tier2_authoritative' | 'tier3_estimated';

/**
 * 国家代码（ISO 3166-1 alpha-2）
 * 19个国家完整支持
 */
export type CountryCode =
  | 'US'  // 美国
  | 'CA'  // 加拿大
  | 'MX'  // 墨西哥
  | 'DE'  // 德国
  | 'UK'  // 英国
  | 'FR'  // 法国
  | 'SG'  // 新加坡
  | 'VN'  // 越南
  | 'TH'  // 泰国
  | 'MY'  // 马来西亚
  | 'PH'  // 菲律宾
  | 'ID'  // 印尼
  | 'IN'  // 印度
  | 'JP'  // 日本
  | 'KR'  // 韩国
  | 'AU'  // 澳大利亚
  | 'SA'  // 沙特
  | 'AE'  // 阿联酋
  | 'BR'; // 巴西

/**
 * 行业类型
 */
export type Industry = 'pet_food' | 'vape' | 'electronics' | '3c';

/**
 * 销售渠道
 */
export type SalesChannel =
  | 'amazon_fba'
  | 'independent_site'
  | 'shopee'
  | 'tiktok_shop'
  | 'lazada';

/**
 * 跨境模式
 */
export type CrossBorderMode =
  | 'direct_mail'      // 直邮
  | 'overseas_warehouse' // 海外仓
  | 'fba';             // FBA

/**
 * 物流方式
 */
export type ShippingMethod = 'sea' | 'air';

// ============================================
// M4物流数据结构（JSON字段）
// ============================================

/**
 * 海运物流详细信息
 */
export interface SeaFreightData {
  usd_per_kg: number;
  lcl_usd_per_cbm_min: number;
  lcl_usd_per_cbm_max: number;
  fcl_20ft_usd_min: number;
  fcl_20ft_usd_max: number;
  transit_days_min: number;
  transit_days_max: number;
  data_source: DataSourceTier;
}

/**
 * 空运物流详细信息
 */
export interface AirFreightData {
  usd_per_kg: number;
  ddp_usd_per_kg: number;
  transit_days_min: number;
  transit_days_max: number;
  data_source: DataSourceTier;
}

/**
 * M4物流完整数据（JSON格式存储）
 */
export interface M4LogisticsData {
  sea_freight: SeaFreightData;
  air_freight: AirFreightData;
}

// ============================================
// 成本因子（Cost Factor）- Collection定义
// ============================================

/**
 * 成本因子完整数据结构（127个字段）
 * 对应Appwrite cost_factors Collection
 */
export interface CostFactor {
  // ========== 基础字段 ==========
  $id: string;
  country: CountryCode;
  country_name_cn: string;
  country_flag?: string;
  industry: Industry;
  version: string; // 如: "2025Q1"

  // ========== M1: 市场准入（Market Entry）==========
  m1_regulatory_agency?: string;
  m1_pre_approval_required?: boolean;
  m1_registration_required?: boolean;
  m1_complexity?: '极高' | '高' | '中' | '低';
  m1_company_registration_usd?: number;
  m1_business_license_usd?: number;
  m1_legal_consulting_usd?: number;
  m1_tax_registration_usd?: number;
  m1_estimated_cost_usd?: number;
  m1_timeline_days_min?: number;
  m1_timeline_days_max?: number;
  m1_key_documents?: string;
  m1_notes?: string;
  m1_data_source?: DataSourceTier;
  m1_data_updated_at?: string;
  m1_reference_url?: string;

  // ========== M2: 技术合规（Technical Compliance）==========
  m2_certifications_required?: string;
  m2_fda_required?: boolean;
  m2_ce_required?: boolean;
  m2_trademark_registration_usd?: number;
  m2_patent_filing_usd?: number;
  m2_estimated_cost_usd?: number;
  m2_timeline_days_min?: number;
  m2_timeline_days_max?: number;
  m2_notes?: string;
  m2_data_source?: DataSourceTier;
  m2_data_updated_at?: string;
  m2_reference_url?: string;

  // ========== M3: 供应链搭建（Supply Chain Setup）==========
  m3_packaging_localization_required?: boolean;
  m3_packaging_rate?: number; // 包装本地化费率（占COGS百分比）
  m3_warehouse_deposit_usd?: number;
  m3_equipment_purchase_usd?: number;
  m3_initial_inventory_units?: number;
  m3_system_setup_usd?: number;
  m3_estimated_cost_usd?: number;
  m3_notes?: string;
  m3_data_source?: DataSourceTier;
  m3_data_updated_at?: string;

  // ========== M4: 货物税费（Goods & Tax）==========
  m4_hs_code?: string; // HS编码
  m4_base_tariff_rate?: number; // 基础关税率
  m4_effective_tariff_rate: number; // 实际关税率（含所有附加税）
  m4_tariff_notes?: string; // 关税说明（如：MFN税率、特殊关税等）
  m4_tariff_data_source?: DataSourceTier;
  m4_tariff_updated_at?: string;
  m4_tariff_reference_url?: string;

  m4_vat_rate: number; // VAT/GST税率
  m4_vat_notes?: string;
  m4_vat_data_source?: DataSourceTier;
  m4_vat_updated_at?: string;

  m4_excise_tax_rate?: number; // 消费税（针对特殊产品如烟草、酒精）
  m4_excise_tax_notes?: string;

  m4_logistics: string; // JSON格式，存储M4LogisticsData

  // ========== M5: 物流配送（Logistics & Delivery）==========
  m5_last_mile_delivery_usd?: number; // 尾程配送费（单位：美元）
  m5_fba_fee_usd?: number; // FBA费用（如适用）
  m5_warehouse_fee_usd_per_month?: number; // 仓储费（每月每单位）
  m5_return_rate?: number; // 退货率（0-1）
  m5_return_cost_rate?: number; // 退货成本占比（0-1）
  m5_notes?: string;
  m5_data_source?: DataSourceTier;
  m5_data_updated_at?: string;

  // ========== M6: 营销获客（Marketing & Acquisition）==========
  m6_marketing_rate?: number; // 营销费率（占零售价百分比）
  m6_avg_cac_usd?: number; // 平均获客成本（美元）
  m6_platform_ads_rate?: number; // 平台广告费率
  m6_influencer_rate?: number; // 网红营销费率
  m6_notes?: string;
  m6_data_source?: DataSourceTier;
  m6_data_updated_at?: string;

  // ========== M7: 支付手续费（Payment Processing）==========
  m7_payment_rate?: number; // 支付网关费率（%）
  m7_payment_fixed_usd?: number; // 支付网关固定费用（美元）
  m7_platform_commission_rate?: number; // 平台佣金率（%）
  m7_currency_conversion_rate?: number; // 汇率损失（%）
  m7_chargeback_rate?: number; // 拒付率（%）
  m7_notes?: string;
  m7_data_source?: DataSourceTier;
  m7_data_updated_at?: string;

  // ========== M8: 运营管理（Operations & Management）==========
  m8_ga_rate?: number; // G&A成本率（占零售价百分比）
  m8_customer_service_rate?: number; // 客服成本率
  m8_software_subscription_usd_per_month?: number; // 软件订阅费
  m8_office_rent_usd_per_month?: number; // 办公室租金
  m8_notes?: string;
  m8_data_source?: DataSourceTier;
  m8_data_updated_at?: string;

  // ========== 元数据 ==========
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $databaseId: string;
  $collectionId: string;
}

// ============================================
// 成本因子版本管理
// ============================================

/**
 * 成本因子版本记录
 * 对应Appwrite cost_factor_versions Collection
 */
export interface CostFactorVersion {
  $id: string;
  version: string; // 如: "2025Q1"
  release_date: string;
  changelog: string; // 更新日志（Markdown格式）
  countries_count: number; // 支持的国家数量
  data_completeness: number; // 数据完整度（0-100%）
  notes?: string;
  $createdAt: string;
  $updatedAt: string;
}

// ============================================
// 业务场景（Scope）- MVP 2.0版本
// ============================================

/**
 * 业务场景定义（用户输入）
 */
export interface Scope {
  // 基础信息
  targetCountry: CountryCode;
  industry: Industry;
  salesChannel: SalesChannel;
  crossBorderMode: CrossBorderMode;

  // 产品信息
  productName: string;
  productWeightKg: number;
  productDimensions?: {
    length: number;
    width: number;
    height: number;
  };

  // 成本与定价
  cogsUsd: number; // 制造成本（美元）
  sellingPriceUsd: number; // 零售价（美元）
  monthlyVolume: number; // 月销量

  // OPEX配置
  opex: {
    shippingMethod: ShippingMethod; // 海运/空运
    fbaEnabled?: boolean; // 是否使用FBA
  };

  // CAPEX配置（可选，用户可输入实际值或使用估算）
  capex?: {
    m1_market_entry?: number;
    m2_compliance?: number;
    m3_supply_chain_setup?: number;
  };
}

// ============================================
// 计算结果（Result）
// ============================================

/**
 * CAPEX计算结果
 */
export interface CAPEXResult {
  m1: number;
  m2: number;
  m3: number;
  total: number;
}

/**
 * OPEX计算结果（详细拆解）
 */
export interface OPEXResult {
  // M4: 货物税费
  m4_cogs: number;
  m4_tariff: number;
  m4_logistics: number;
  m4_vat: number;

  // M5: 物流配送
  m5_last_mile: number;
  m5_return: number;

  // M6: 营销获客
  m6_marketing: number;

  // M7: 支付手续
  m7_payment: number;
  m7_platform_commission: number;

  // M8: 运营管理
  m8_ga: number;

  total: number;
}

/**
 * 单位经济模型
 */
export interface UnitEconomics {
  revenue: number;
  cost: number;
  gross_profit: number;
  gross_margin: number; // 百分比
}

/**
 * 关键KPI指标
 */
export interface KPIs {
  roi: number; // 投资回报率（百分比）
  payback_period_months: number; // 回本周期（月）
  breakeven_price: number; // 盈亏平衡价格
  breakeven_volume: number; // 盈亏平衡销量
}

/**
 * 成本分布项
 */
export interface CostBreakdownItem {
  module: string;
  amount: number;
  percentage: number;
}

/**
 * 完整成本计算结果
 */
export interface CostResult {
  capex: CAPEXResult;
  opex: OPEXResult;
  unit_economics: UnitEconomics;
  kpis: KPIs;
  cost_breakdown: CostBreakdownItem[];
}

// ============================================
// 项目（Project）- MVP 2.0版本
// ============================================

/**
 * 项目完整数据结构
 */
export interface Project {
  $id: string;
  userId: string;
  name: string;
  industry: Industry;
  targetCountry: CountryCode;
  salesChannel: SalesChannel;
  $createdAt: string;
  $updatedAt: string;
}

// ============================================
// 计算记录（Calculation）- MVP 2.0版本
// ============================================

/**
 * 计算记录完整数据结构
 */
export interface Calculation {
  $id: string;
  projectId: string;
  scope: Scope; // 完整输入数据
  costResult: CostResult; // 计算结果
  userOverrides?: Partial<CostFactor>; // ⭐ 用户自定义覆盖值
  version: string; // GECOM版本
  $createdAt: string;
  $updatedAt: string;
}

// ============================================
// AI工具调用相关
// ============================================

/**
 * 成本拆解工具参数
 */
export interface GetCostBreakdownArgs {
  module?: 'all' | 'm1' | 'm2' | 'm3' | 'm4' | 'm5' | 'm6' | 'm7' | 'm8';
}

/**
 * 场景对比工具参数
 */
export interface CompareScenarios Args {
  countries: CountryCode[];
  metric?: 'gross_margin' | 'roi' | 'unit_cost' | 'tariff_rate';
}

/**
 * 优化建议工具参数
 */
export interface GetOptimizationSuggestionsArgs {
  focus_area?: 'all' | 'pricing' | 'logistics' | 'marketing' | 'market_selection';
}

/**
 * 优化建议项
 */
export interface OptimizationSuggestion {
  area: string;
  priority: 'high' | 'medium' | 'low';
  issue: string;
  action: string;
  impact: string;
  tradeoff?: string;
}

// ============================================
// 国家信息
// ============================================

/**
 * 国家基础信息
 */
export interface CountryInfo {
  code: CountryCode;
  name_cn: string;
  name_en: string;
  flag: string;
  continent: '北美' | '南美' | '欧洲' | '亚洲' | '大洋洲' | '中东';
  currency: string;
  timezone: string;
  data_available: boolean;
  data_tier: DataSourceTier;
}

// ============================================
// 导出所有类型
// ============================================

export type {
  CostFactor as default,
};

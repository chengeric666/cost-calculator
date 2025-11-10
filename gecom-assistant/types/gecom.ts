/**
 * GECOM Type Definitions - MVP 2.0
 * Global E-Commerce Cost Optimization Methodology
 *
 * 支持19国真实数据，完整M1-M8模块，127字段成本因子库
 */

// ============================================
// 基础类型定义
// ============================================

// 行业类型（MVP 2.0扩展，保持向后兼容）
export type Industry = 'pet' | 'pet_food' | 'vape' | '3c' | 'electronics';

// 目标国家（19国）
export type TargetCountry =
  | 'US'  // 美国
  | 'DE'  // 德国
  | 'GB'  // 英国
  | 'FR'  // 法国
  | 'VN'  // 越南
  | 'TH'  // 泰国
  | 'MY'  // 马来西亚
  | 'PH'  // 菲律宾
  | 'ID'  // 印度尼西亚
  | 'IN'  // 印度
  | 'JP'  // 日本
  | 'KR'  // 韩国
  | 'AU'  // 澳大利亚
  | 'SA'  // 沙特阿拉伯
  | 'AE'  // 阿联酋
  | 'CA'  // 加拿大
  | 'MX'  // 墨西哥
  | 'BR'  // 巴西
  | 'SG'; // 新加坡

// 销售渠道
export type SalesChannel =
  | 'amazon_fba'
  | 'shopee'
  | 'dtc'
  | 'o2o'
  | 'tiktok_shop'
  | 'lazada'
  | 'walmart';

// 数据来源分级（置信度）- MVP 2.0扩展，保持向后兼容
export type DataSourceTier =
  | 'tier1' | 'tier1_official'      // 官方来源（100%可信）
  | 'tier2' | 'tier2_authoritative' // 权威来源（90%可信）
  | 'tier3' | 'tier3_estimated';    // 估算来源（80%可信）

// 复杂度等级
export type ComplexityLevel = '极高' | '高' | '中' | '低';

// ============================================
// MVP 2.0 新增类型定义
// ============================================

/**
 * M4物流JSON字段结构
 */
export interface M4Logistics {
  sea_freight: {
    usd_per_kg: number;
    lcl_usd_per_cbm_min: number;
    lcl_usd_per_cbm_max: number;
    fcl_20ft_usd_min: number;
    fcl_20ft_usd_max: number;
    transit_days_min: number;
    transit_days_max: number;
    data_source: DataSourceTier;
  };
  air_freight: {
    usd_per_kg: number;
    ddp_usd_per_kg: number;
    transit_days_min: number;
    transit_days_max: number;
    data_source: DataSourceTier;
  };
}

/**
 * 成本因子库完整类型（127字段）
 * 支持19国M1-M8完整数据
 */
export interface CostFactor {
  // ========== 基础字段（5个） ==========
  country: TargetCountry;
  country_name_cn: string;
  country_flag?: string;
  industry: Industry;
  version: string; // 如"2025Q1"

  // ========== M1: 市场准入（16字段） ==========
  m1_regulatory_agency?: string;
  m1_pre_approval_required?: boolean;
  m1_registration_required?: boolean;
  m1_complexity?: string; // 原ComplexityLevel，暂时放宽为string兼容Week 1数据
  m1_estimated_cost_usd?: number;
  m1_timeline_days?: number;
  m1_company_registration_usd?: number;
  m1_business_license_usd?: number;
  m1_tax_registration_usd?: number;
  m1_legal_consulting_usd?: number;
  m1_import_license_required?: boolean;
  m1_import_license_cost_usd?: number;
  m1_notes?: string;
  m1_data_source?: string; // 原DataSourceTier，暂时放宽为string兼容Week 1数据
  m1_data_updated_at?: string;
  m1_tier?: string;

  // ========== M2: 技术合规（14字段） ==========
  m2_certifications_required?: string;
  m2_estimated_cost_usd?: number;
  m2_timeline_days?: number;
  m2_product_testing_required?: boolean;
  m2_product_testing_cost_usd?: number;
  m2_trademark_registration_usd?: number;
  m2_patent_filing_usd?: number;
  m2_labeling_requirements?: string;
  m2_packaging_requirements?: string;
  m2_third_party_testing_required?: boolean;
  m2_notes?: string;
  m2_data_source?: string; // 原DataSourceTier，暂时放宽为string兼容Week 1数据
  m2_data_updated_at?: string;
  m2_tier?: string;

  // ========== M3: 供应链搭建（12字段） ==========
  m3_warehouse_deposit_usd?: number;
  m3_equipment_purchase_usd?: number;
  m3_initial_inventory_usd?: number;
  m3_system_setup_usd?: number;
  m3_packaging_rate?: number;
  m3_warehouse_rent_per_sqm_usd?: number;
  m3_minimum_order_quantity?: number;
  m3_notes?: string;
  m3_data_source?: string; // 原DataSourceTier，暂时放宽为string兼容Week 1数据
  m3_data_updated_at?: string;
  m3_tier?: string;
  m3_total_estimated_usd?: number;

  // ========== M4: 货物税费（32字段） ==========
  m4_hs_code?: string;
  m4_base_tariff_rate?: number;
  m4_effective_tariff_rate: number; // 必填
  m4_tariff_notes?: string;
  m4_vat_rate: number; // 必填
  m4_vat_notes?: string;
  m4_excise_tax_rate?: number;
  m4_excise_tax_notes?: string;
  m4_customs_clearance_fee_usd?: number;
  m4_inspection_fee_usd?: number;
  m4_quarantine_fee_usd?: number;
  m4_tariff_exemption_available?: boolean;
  m4_fta_agreement?: string;
  m4_origin_requirement?: string;
  m4_logistics: string; // JSON字符串
  m4_logistics_notes?: string;
  m4_cif_calculation_method?: string;
  m4_duty_drawback_available?: boolean;
  m4_tariff_data_source?: string; // 原DataSourceTier，暂时放宽为string兼容Week 1数据
  m4_vat_data_source?: string; // 原DataSourceTier，暂时放宽为string兼容Week 1数据
  m4_logistics_data_source?: string; // 原DataSourceTier，暂时放宽为string兼容Week 1数据
  m4_tariff_tier?: string;
  m4_vat_tier?: string;
  m4_logistics_tier?: string;
  m4_tariff_updated_at?: string;
  m4_vat_updated_at?: string;
  m4_logistics_updated_at?: string;
  m4_regulatory_changes_2025?: string;
  m4_notes?: string;
  m4_data_source?: string; // 原DataSourceTier，暂时放宽为string兼容Week 1数据
  m4_data_updated_at?: string;
  m4_tier?: string;

  // ========== M5: 物流配送（18字段） ==========
  m5_last_mile_delivery_usd?: number;
  m5_delivery_notes?: string;
  m5_fba_fee_standard_usd?: number;
  m5_fba_fee_small_usd?: number;
  m5_fba_fee_large_usd?: number;
  m5_warehouse_fee_per_unit_month_usd?: number;
  m5_return_rate?: number;
  m5_return_cost_rate?: number;
  m5_return_logistics_usd?: number;
  m5_delivery_time_days_min?: number;
  m5_delivery_time_days_max?: number;
  m5_cod_available?: boolean;
  m5_cod_fee_rate?: number;
  m5_notes?: string;
  m5_data_source?: string; // 原DataSourceTier，暂时放宽为string兼容Week 1数据
  m5_data_updated_at?: string;
  m5_tier?: string;
  m5_total_estimated_per_unit_usd?: number;

  // ========== M6: 营销获客（10字段） ==========
  m6_cac_estimated_usd?: number;
  m6_marketing_rate?: number;
  m6_platform_commission_rate?: number;
  m6_ad_cpc_usd?: number;
  m6_conversion_rate?: number;
  m6_acos_target?: number;
  m6_notes?: string;
  m6_data_source?: string; // 原DataSourceTier，暂时放宽为string兼容Week 1数据
  m6_data_updated_at?: string;
  m6_tier?: string;

  // ========== M7: 支付手续费（8字段） ==========
  m7_payment_rate?: number;
  m7_payment_fixed_usd?: number;
  m7_platform_commission_rate?: number;
  m7_currency_conversion_rate?: number;
  m7_chargeback_rate?: number;
  m7_notes?: string;
  m7_data_source?: string; // 原DataSourceTier，暂时放宽为string兼容Week 1数据
  m7_data_updated_at?: string;
  m7_tier?: string;

  // ========== M8: 运营管理（11字段） ==========
  m8_customer_service_cost_per_order_usd?: number;
  m8_ga_rate?: number;
  m8_monthly_staff_cost_usd?: number;
  m8_monthly_software_cost_usd?: number;
  m8_office_rent_usd?: number;
  m8_utilities_usd?: number;
  m8_insurance_rate?: number;
  m8_notes?: string;
  m8_data_source?: string; // 原DataSourceTier，暂时放宽为string兼容Week 1数据
  m8_data_updated_at?: string;
  m8_tier?: string;

  // ========== 元数据 ==========
  created_at?: string;
  updated_at?: string;

  // ========== 数据溯源（可选） ==========
  collected_at?: string;
  collected_by?: string;
  verified_at?: string;
  next_update_due?: string;
}

/**
 * 业务场景定义（Scope）- MVP 2.0
 */
export interface Scope {
  // 产品信息
  productName: string;
  productWeightKg: number;
  cogsUsd: number;
  sellingPriceUsd: number;
  monthlyVolume: number;

  // 市场选择
  targetCountry: TargetCountry;
  salesChannel: SalesChannel;
  industry: Industry;

  // CAPEX（可选，用户可输入或使用系统估算）
  capex?: {
    m1_market_entry?: number;
    m2_compliance?: number;
    m3_supply_chain_setup?: number;
  };

  // OPEX覆盖值（可选）
  opex?: {
    shippingMethod?: 'sea' | 'air';
    customTariffRate?: number;
    customVatRate?: number;
    customMarketingRate?: number;
    customPlatformCommissionRate?: number;
  };
}

/**
 * 成本计算结果 - MVP 2.0
 * 兼容POC版本
 */
export interface CostResult {
  // CAPEX结果（MVP 2.0简化结构）
  capex: {
    m1: number;
    m2: number;
    m3: number;
    total: number;
    // POC兼容字段
    m1_marketEntry?: any;
    m2_techCompliance?: any;
    m3_supplyChain?: any;
  };

  // OPEX结果（MVP 2.0简化结构）
  opex: {
    m4_cogs: number;
    m4_tariff: number;
    m4_logistics: number;
    m4_vat: number;
    m5_last_mile: number;
    m5_return: number;
    m6_marketing: number;
    m7_payment: number;
    m7_platform_commission: number;
    m8_ga: number;
    total: number;
    // POC兼容字段（注意：不重复定义已有字段）
    m4_goodsTax?: any;
    m5_logistics?: any;
    m8_operations?: any;
  };

  // 单位经济模型
  unitEconomics?: UnitEconomics; // POC兼容
  unit_economics: {
    revenue: number;
    cost: number;
    gross_profit: number;
    gross_margin: number;
  };

  // 关键KPI
  kpis: {
    roi: number;
    payback_period_months: number;
    paybackPeriod?: number; // POC兼容别名
    breakeven_price: number;
    breakeven_volume: number;
    breakEvenPrice?: number; // POC兼容别名
    breakEvenVolume?: number; // POC兼容别名
    ltv?: number; // POC兼容
    ltvCacRatio?: number; // POC兼容
  };

  // 成本分布
  cost_breakdown: Array<{
    module: string;
    amount: number;
    percentage: number;
  }>;

  // POC兼容字段
  warnings?: string[];
  recommendations?: string[];
}

/**
 * 项目类型 - MVP 2.0
 * 兼容POC版本
 */
export interface Project {
  id: string;
  userId?: string; // 可选，默认"anonymous"
  name: string;
  industry: Industry;
  targetCountry: TargetCountry;
  salesChannel: SalesChannel;
  scope?: ProjectScope; // POC兼容
  costData?: CostResult; // POC兼容
  status?: 'draft' | 'calculating' | 'completed'; // POC兼容
  createdAt: string | Date; // 兼容string和Date类型
  updatedAt: string | Date; // 兼容string和Date类型
}

/**
 * 计算记录 - MVP 2.0
 */
export interface Calculation {
  id: string;
  projectId: string;
  scope: Scope;
  costResult: CostResult;
  userOverrides: Partial<CostFactor>; // 用户自定义覆盖值
  version: string; // GECOM版本
  cost_factor_version: string; // 使用的成本因子版本
  createdAt: string;
}

// ============================================
// 旧版POC类型（兼容保留）
// ============================================

// Project scope and basic information
export interface ProjectScope {
  productInfo: {
    sku: string;
    name: string;
    category: string;
    weight: number; // kg
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    cogs: number; // Cost of Goods Sold (manufacturing cost)
    targetPrice: number; // Target selling price
  };
  assumptions: {
    monthlySales: number; // Units per month
    returnRate: number; // Return rate (0-1)
    growthRate?: number; // Expected monthly growth rate
  };
}

// CAPEX modules (Phase 0-1)
export interface CAPEXCosts {
  m1_marketEntry: {
    companyRegistration: number;
    businessLicense: number;
    legalConsulting: number;
    taxRegistration: number;
    total: number;
    dataSource: DataSourceTier;
  };
  m2_techCompliance: {
    productCertification: number; // FDA, CE, FCC, etc.
    trademarkRegistration: number;
    patentFiling?: number;
    complianceTesting: number;
    total: number;
    dataSource: DataSourceTier;
  };
  m3_supplyChain: {
    warehouseDeposit: number;
    equipmentPurchase: number;
    initialInventory: number;
    systemSetup: number; // ERP, WMS, etc.
    total: number;
    dataSource: DataSourceTier;
  };
  total: number;
}

// OPEX modules (Phase 1-N)
export interface OPEXCosts {
  m4_goodsTax: {
    cogs: number;
    importTariff: number;
    vat: number;
    exciseTax?: number; // For vape, alcohol, etc.
    total: number;
    dataSource: DataSourceTier;
  };
  m5_logistics: {
    intlShipping: number; // China to overseas warehouse
    localDelivery: number; // Warehouse to customer
    fbaFee?: number; // Amazon FBA fee
    warehouseFee: number;
    returnLogistics: number;
    total: number;
    dataSource: DataSourceTier;
  };
  m6_marketing: {
    cac: number; // Customer Acquisition Cost
    platformCommission: number; // Amazon, Shopee commission
    adSpend: number;
    influencerMarketing?: number;
    seo?: number;
    total: number;
    dataSource: DataSourceTier;
  };
  m7_payment: {
    paymentGatewayFee: number; // Stripe, PayPal, etc.
    currencyConversion: number;
    chargebackFee: number;
    total: number;
    dataSource: DataSourceTier;
  };
  m8_operations: {
    customerService: number;
    staff: number;
    software: number; // ERP, CRM, analytics tools
    officeRent?: number;
    utilities?: number;
    total: number;
    dataSource: DataSourceTier;
  };
  total: number;
}

// Unit Economics (per order)
export interface UnitEconomics {
  revenue: number; // Selling price
  totalCost: number; // Sum of all costs per unit
  grossProfit: number; // Revenue - totalCost
  grossMargin: number; // grossProfit / revenue (percentage)
  contributionMargin: number; // After variable costs
}

// Key Performance Indicators
export interface KPIs {
  roi: number; // Return on Investment (percentage)
  paybackPeriod: number; // Months to recover CAPEX
  breakEvenPrice: number; // Minimum price to break even
  breakEvenVolume: number; // Minimum units to break even
  ltv: number; // Lifetime Value per customer
  ltvCacRatio: number; // LTV / CAC ratio
}

// ===== POC遗留类型（已被MVP 2.0替代，保留用于向后兼容）=====
// 这些类型已被上方的MVP 2.0类型替代，仅用于旧代码兼容

// Industry factor library (pre-configured parameters)
export interface IndustryFactors {
  industry: Industry;
  country: TargetCountry;
  channel: SalesChannel;

  // M1 factors
  m1: {
    companyRegistrationCost: number;
    businessLicenseCost: number;
    legalConsultingRate: number;
    taxRegistrationCost: number;
  };

  // M2 factors
  m2: {
    certificationCost: number[];
    trademarkCost: number;
    complianceTestingCost: number;
  };

  // M3 factors
  m3: {
    warehouseDepositPerSqm: number;
    minimumWarehouseSize: number;
  };

  // M4 factors
  m4: {
    importTariffRate: number; // percentage
    vatRate: number; // percentage
    exciseTaxRate?: number; // percentage
  };

  // M5 factors
  m5: {
    intlShippingPerKg: number;
    localDeliveryPerKg: number;
    fbaFeePerUnit?: number;
    warehouseFeePerUnitMonth: number;
    returnRate: number;
  };

  // M6 factors
  m6: {
    avgCac: number;
    platformCommissionRate: number; // percentage
    avgCpc?: number; // Cost per click for ads
    avgConversionRate?: number; // percentage
  };

  // M7 factors
  m7: {
    paymentGatewayRate: number; // percentage
    currencyConversionRate: number; // percentage
    chargebackRate: number; // percentage
    avgChargebackFee: number;
  };

  // M8 factors
  m8: {
    customerServiceCostPerOrder: number;
    monthlyStaffCost: number;
    monthlySoftwareCost: number;
  };

  // Other metadata
  dataSource: DataSourceTier;
  lastUpdated: Date;
  notes?: string;
}

// Calculation request
export interface CalculationRequest {
  project: Project;
  factors?: Partial<IndustryFactors>; // Allow custom factor overrides
}

// AI Assistant message
export interface AssistantMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    step?: number; // Which step of GECOM SOP (1-5)
    module?: string; // Which module (M1-M8)
    actionable?: boolean;
  };
}

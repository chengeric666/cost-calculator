/**
 * GECOM Type Definitions
 * Global E-Commerce Cost Optimization Methodology
 */

// Industry types
export type Industry = 'pet' | 'vape' | '3c';

// Target country/region
export type TargetCountry = 'US' | 'VN' | 'PH' | 'EU' | 'JP';

// Sales channel
export type SalesChannel = 'amazon_fba' | 'shopee' | 'dtc' | 'o2o' | 'tiktok_shop';

// Data source tier (credibility)
export type DataSourceTier = 'tier1' | 'tier2' | 'tier3';

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

// Complete cost calculation result
export interface CostResult {
  capex: CAPEXCosts;
  opex: OPEXCosts;
  unitEconomics: UnitEconomics;
  kpis: KPIs;
  warnings: string[]; // Warning messages (e.g., negative margin)
  recommendations: string[]; // AI-generated recommendations
}

// Complete project data
export interface Project {
  id: string;
  userId?: string;
  name: string;
  industry: Industry;
  targetCountry: TargetCountry;
  salesChannel: SalesChannel;
  scope: ProjectScope;
  costData?: CostResult;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'calculating' | 'completed';
}

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

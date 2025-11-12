// @ts-nocheck
/**
 * GECOM Cost Calculator
 * Implements the dual-phase eight-module cost calculation model
 */

import {
  Project,
  CostResult,
  CAPEXCosts,
  OPEXCosts,
  UnitEconomics,
  KPIs,
  IndustryFactors,
} from '@/types/gecom';
import { getIndustryFactors } from './industry-factors';

/**
 * Main calculation function - calculates complete cost model for a project
 */
export function calculateCostModel(
  project: Project,
  customFactors?: Partial<IndustryFactors>
): CostResult {
  // Get industry factors
  const factors = customFactors
    ? { ...getIndustryFactors(project.industry, project.targetCountry, project.salesChannel), ...customFactors }
    : getIndustryFactors(project.industry, project.targetCountry, project.salesChannel);

  // Calculate CAPEX (Phase 0-1)
  const capex = calculateCAPEX(project, factors);

  // Calculate OPEX (Phase 1-N) - per unit costs
  const opex = calculateOPEX(project, factors);

  // Calculate Unit Economics
  const unitEconomics = calculateUnitEconomics(project, opex);

  // Calculate KPIs
  const kpis = calculateKPIs(project, capex, opex, unitEconomics);

  // Generate warnings
  const warnings = generateWarnings(unitEconomics, kpis);

  // Generate recommendations
  const recommendations = generateRecommendations(project, unitEconomics, kpis, factors);

  return {
    capex: capex as any,
    opex: opex as any,
    unitEconomics,           // POC兼容字段（驼峰命名）
    unit_economics: {        // MVP 2.0标准字段（下划线命名）- market-recommendation需要
      revenue: unitEconomics.revenue,
      cost: unitEconomics.totalCost,
      gross_profit: unitEconomics.grossProfit,
      gross_margin: unitEconomics.grossMargin,
    },
    kpis,
    warnings,
    recommendations,
  } as CostResult;
}

/**
 * Calculate CAPEX (Phase 0-1): One-time startup costs
 */
function calculateCAPEX(project: Project, factors: IndustryFactors): CAPEXCosts {
  // M1: Market Entry
  const m1 = {
    companyRegistration: factors.m1.companyRegistrationCost,
    businessLicense: factors.m1.businessLicenseCost,
    legalConsulting: factors.m1.legalConsultingRate,
    taxRegistration: factors.m1.taxRegistrationCost,
    total: 0,
    dataSource: factors.dataSource,
  };
  m1.total = m1.companyRegistration + m1.businessLicense + m1.legalConsulting + m1.taxRegistration;

  // M2: Tech & Compliance
  const m2 = {
    productCertification: factors.m2.certificationCost.reduce((a, b) => a + b, 0),
    trademarkRegistration: factors.m2.trademarkCost,
    patentFiling: 0, // Optional, not included by default
    complianceTesting: factors.m2.complianceTestingCost,
    total: 0,
    dataSource: factors.dataSource,
  };
  m2.total = m2.productCertification + m2.trademarkRegistration + m2.complianceTesting;

  // M3: Supply Chain Setup
  const warehouseSize = (factors as any).m3?.minimumWarehouseSize || 100;
  const warehouseDeposit = warehouseSize * ((factors as any).m3?.warehouseDepositPerSqm || 5) * 3; // 3-month deposit
  const initialInventory = (project.scope?.productInfo?.cogs || 0) * ((project.scope?.assumptions as any)?.monthlySales || 100) * 2; // 2 months inventory

  const m3 = {
    warehouseDeposit,
    equipmentPurchase: 5000, // Default equipment cost
    initialInventory,
    systemSetup: 3000, // Default ERP/WMS setup
    total: 0,
    dataSource: factors.dataSource,
  };
  m3.total = m3.warehouseDeposit + m3.equipmentPurchase + m3.initialInventory + m3.systemSetup;

  const total = m1.total + m2.total + m3.total;

  return {
    m1_marketEntry: m1,
    m2_techCompliance: m2,
    m3_supplyChain: m3,
    total,
  };
}

/**
 * Calculate OPEX (Phase 1-N): Per-unit operating costs
 */
function calculateOPEX(project: Project, factors: IndustryFactors): OPEXCosts {
  const productInfo = (project.scope as any)?.productInfo || {};
  const assumptions = (project.scope as any)?.assumptions || {};
  const monthlySales = assumptions.monthlySales || 100;

  // M4: Goods & Tax (per unit)
  const m4 = {
    cogs: productInfo.cogs,
    importTariff: productInfo.cogs * factors.m4.importTariffRate,
    vat: productInfo.cogs * factors.m4.vatRate,
    exciseTax: factors.m4.exciseTaxRate ? productInfo.cogs * factors.m4.exciseTaxRate : 0,
    total: 0,
    dataSource: factors.dataSource,
  };
  m4.total = m4.cogs + m4.importTariff + m4.vat + m4.exciseTax;

  // M5: Logistics (per unit)
  const intlShipping = productInfo.weight * factors.m5.intlShippingPerKg;
  const localDelivery = productInfo.weight * factors.m5.localDeliveryPerKg;
  const fbaFee = factors.m5.fbaFeePerUnit || 0;
  const warehouseFee = factors.m5.warehouseFeePerUnitMonth;
  const returnLogistics = (intlShipping + localDelivery + fbaFee) * factors.m5.returnRate;

  const m5 = {
    intlShipping,
    localDelivery,
    fbaFee,
    warehouseFee,
    returnLogistics,
    total: 0,
    dataSource: factors.dataSource,
  };
  m5.total = m5.intlShipping + m5.localDelivery + m5.fbaFee + m5.warehouseFee + m5.returnLogistics;

  // M6: Marketing (per unit)
  const cac = factors.m6.avgCac;
  const platformCommission = productInfo.targetPrice * factors.m6.platformCommissionRate;
  const adSpend = cac * 0.6; // Assume 60% of CAC is direct ad spend

  const m6 = {
    cac,
    platformCommission,
    adSpend,
    influencerMarketing: 0, // Optional
    seo: cac * 0.1, // 10% of CAC for SEO
    total: 0,
    dataSource: factors.dataSource,
  };
  m6.total = m6.cac + m6.platformCommission + m6.adSpend + m6.seo;

  // M7: Payment (per unit)
  const paymentGatewayFee = productInfo.targetPrice * factors.m7.paymentGatewayRate;
  const currencyConversion = productInfo.targetPrice * factors.m7.currencyConversionRate;
  const chargebackFee = factors.m7.avgChargebackFee * factors.m7.chargebackRate;

  const m7 = {
    paymentGatewayFee,
    currencyConversion,
    chargebackFee,
    total: 0,
    dataSource: factors.dataSource,
  };
  m7.total = m7.paymentGatewayFee + m7.currencyConversion + m7.chargebackFee;

  // M8: Operations (per unit - allocate monthly costs to units)
  const customerService = factors.m8.customerServiceCostPerOrder;
  const staff = factors.m8.monthlyStaffCost / monthlySales; // Allocate to per unit
  const software = factors.m8.monthlySoftwareCost / monthlySales;

  const m8 = {
    customerService,
    staff,
    software,
    officeRent: 0, // Optional
    utilities: 0, // Optional
    total: 0,
    dataSource: factors.dataSource,
  };
  m8.total = m8.customerService + m8.staff + m8.software;

  const total = m4.total + m5.total + m6.total + m7.total + m8.total;

  return {
    m4_goodsTax: m4,
    m5_logistics: m5,
    m6_marketing: m6,
    m7_payment: m7,
    m8_operations: m8,
    total,
  };
}

/**
 * Calculate Unit Economics
 */
function calculateUnitEconomics(project: Project, opex: OPEXCosts): UnitEconomics {
  const revenue = project.scope.productInfo.targetPrice;
  const totalCost = opex.total;
  const grossProfit = revenue - totalCost;
  const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

  // Contribution margin (after variable costs, before fixed costs)
  const variableCost = opex.m4_goodsTax.total + opex.m5_logistics.total + opex.m6_marketing.total + opex.m7_payment.total;
  const contributionMargin = revenue > 0 ? ((revenue - variableCost) / revenue) * 100 : 0;

  return {
    revenue,
    totalCost,
    grossProfit,
    grossMargin,
    contributionMargin,
  };
}

/**
 * Calculate Key Performance Indicators
 */
function calculateKPIs(
  project: Project,
  capex: CAPEXCosts,
  opex: OPEXCosts,
  unitEconomics: UnitEconomics
): KPIs {
  const { monthlySales } = project.scope.assumptions;
  const { targetPrice } = project.scope.productInfo;

  // ROI = (Annual Profit / Total Investment) * 100
  const annualRevenue = targetPrice * monthlySales * 12;
  const annualCost = opex.total * monthlySales * 12;
  const annualProfit = annualRevenue - annualCost;
  const roi = capex.total > 0 ? (annualProfit / capex.total) * 100 : 0;

  // Payback Period = CAPEX / Monthly Profit (in months)
  const monthlyProfit = unitEconomics.grossProfit * monthlySales;
  const paybackPeriod = monthlyProfit > 0 ? capex.total / monthlyProfit : 999;

  // Break-even price = Total cost per unit
  const breakEvenPrice = opex.total;

  // Break-even volume = CAPEX / (Price - Variable Cost per unit)
  const variableCost = opex.m4_goodsTax.total + opex.m5_logistics.total;
  const contributionPerUnit = targetPrice - variableCost;
  const breakEvenVolume = contributionPerUnit > 0 ? capex.total / contributionPerUnit : 999999;

  // LTV (simplified: assume 2 repeat purchases per year for 2 years)
  const avgOrdersPerCustomer = 4;
  const ltv = unitEconomics.grossProfit * avgOrdersPerCustomer;

  // Get CAC from M6
  const cac = opex.m6_marketing.cac;
  const ltvCacRatio = cac > 0 ? ltv / cac : 0;

  return {
    roi,
    paybackPeriod,            // POC兼容字段（驼峰命名）
    payback_period_months: paybackPeriod,  // MVP 2.0标准字段 - market-recommendation需要
    breakEvenPrice,           // POC兼容字段（驼峰命名）
    breakeven_price: breakEvenPrice,  // MVP 2.0标准字段
    breakEvenVolume,          // POC兼容字段（驼峰命名）
    breakeven_volume: breakEvenVolume,  // MVP 2.0标准字段
    ltv,
    ltvCacRatio,
  };
}

/**
 * Generate warnings based on calculation results
 */
function generateWarnings(unitEconomics: UnitEconomics, kpis: KPIs): string[] {
  const warnings: string[] = [];

  if (unitEconomics.grossMargin < 0) {
    warnings.push('🚨 CRITICAL: Negative gross margin - losing money on every sale!');
  } else if (unitEconomics.grossMargin < 15) {
    warnings.push('⚠️ WARNING: Gross margin below 15% - very tight margins, risky business model');
  } else if (unitEconomics.grossMargin < 30) {
    warnings.push('⚠️ CAUTION: Gross margin below 30% - limited room for unexpected costs');
  }

  if (kpis.ltvCacRatio < 1) {
    warnings.push('🚨 CRITICAL: LTV:CAC ratio below 1:1 - unsustainable customer acquisition');
  } else if (kpis.ltvCacRatio < 3) {
    warnings.push('⚠️ WARNING: LTV:CAC ratio below 3:1 - customer acquisition costs too high');
  }

  if (kpis.paybackPeriod > 24) {
    warnings.push('⚠️ WARNING: Payback period over 24 months - long time to recover investment');
  } else if (kpis.paybackPeriod > 12) {
    warnings.push('⚠️ CAUTION: Payback period over 12 months - consider ways to accelerate');
  }

  if (kpis.roi < 0) {
    warnings.push('🚨 CRITICAL: Negative ROI - losing money overall');
  } else if (kpis.roi < 50) {
    warnings.push('⚠️ WARNING: ROI below 50% - may not justify the risk and effort');
  }

  return warnings;
}

/**
 * Generate AI-powered recommendations
 */
function generateRecommendations(
  project: Project,
  unitEconomics: UnitEconomics,
  kpis: KPIs,
  factors: IndustryFactors
): string[] {
  const recommendations: string[] = [];

  // Price optimization
  if (unitEconomics.grossMargin < 30) {
    const suggestedPrice = kpis.breakEvenPrice * 1.4; // 40% margin
    recommendations.push(
      `💡 Consider increasing price to $${suggestedPrice.toFixed(2)} (40% margin) or reducing costs`
    );
  }

  // CAC optimization
  if (kpis.ltvCacRatio < 3) {
    recommendations.push(
      `💡 Reduce CAC through organic channels (SEO, content marketing, referrals) - target CAC under $${(
        kpis.ltv / 3
      ).toFixed(2)}`
    );
  }

  // Channel recommendations
  if (project.salesChannel === 'dtc' && factors.m6.avgCac > 40) {
    recommendations.push(
      `💡 Consider O2O or marketplace channels to reduce high DTC CAC (currently $${factors.m6.avgCac})`
    );
  }

  // Market recommendations
  if (project.targetCountry === 'US' && unitEconomics.grossMargin < 20) {
    recommendations.push(
      `💡 Explore Vietnam or Philippines markets - lower costs may improve margins by 10-15%`
    );
  }

  // Logistics optimization
  const intlShippingCost = project.scope.productInfo.weight * factors.m5.intlShippingPerKg;
  const localDeliveryCost = project.scope.productInfo.weight * factors.m5.localDeliveryPerKg;
  const totalShippingCost = intlShippingCost + localDeliveryCost;
  const logisticsCostThreshold = project.scope.productInfo.targetPrice * 0.2; // 20% threshold

  if (totalShippingCost > logisticsCostThreshold) {
    recommendations.push(
      `💡 Logistics costs are high (${(
        (totalShippingCost / project.scope.productInfo.targetPrice) * 100
      ).toFixed(1)}% of price) - consider local manufacturing or bulk shipping`
    );
  }

  // Platform commission optimization
  if (factors.m6.platformCommissionRate > 0.1) {
    recommendations.push(
      `💡 Platform commission is ${(factors.m6.platformCommissionRate * 100).toFixed(
        0
      )}% - consider building owned channel (DTC) for better margins`
    );
  }

  return recommendations;
}

/**
 * Calculate scenario comparison
 */
export function compareScenarios(scenarios: Project[]): Array<{
  project: Project;
  result: CostResult;
  rank: number;
}> {
  const results = scenarios.map((project) => ({
    project,
    result: calculateCostModel(project),
    rank: 0,
  }));

  // Rank by ROI (descending)
  results.sort((a, b) => b.result.kpis.roi - a.result.kpis.roi);
  results.forEach((result, index) => {
    result.rank = index + 1;
  });

  return results;
}

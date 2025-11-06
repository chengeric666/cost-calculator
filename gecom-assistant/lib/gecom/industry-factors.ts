/**
 * GECOM Industry Factor Library
 * Pre-configured cost parameters for different industries, countries, and channels
 * Data sources: GECOM whitepaper case studies + industry research
 */

import { IndustryFactors, Industry, TargetCountry, SalesChannel } from '@/types/gecom';

/**
 * Get industry factors for a specific combination
 */
export function getIndustryFactors(
  industry: Industry,
  country: TargetCountry,
  channel: SalesChannel
): IndustryFactors {
  const key = `${industry}-${country}-${channel}`;

  const factors = INDUSTRY_FACTOR_DATABASE[key];

  if (!factors) {
    // Return default factors if specific combination not found
    console.warn(`No specific factors found for ${key}, using defaults`);
    return getDefaultFactors(industry, country, channel);
  }

  return factors;
}

/**
 * Industry Factor Database
 * Based on GECOM whitepaper case studies and research
 */
const INDUSTRY_FACTOR_DATABASE: Record<string, IndustryFactors> = {
  // ============================================
  // PET INDUSTRY - UNITED STATES
  // ============================================
  'pet-US-amazon_fba': {
    industry: 'pet',
    country: 'US',
    channel: 'amazon_fba',

    m1: {
      companyRegistrationCost: 3000, // LLC registration in US
      businessLicenseCost: 500,
      legalConsultingRate: 5000, // Initial consulting
      taxRegistrationCost: 300, // EIN, state tax
    },

    m2: {
      certificationCost: [2000, 3000], // FDA, pet product safety
      trademarkCost: 1500, // USPTO trademark
      complianceTestingCost: 1200,
    },

    m3: {
      warehouseDepositPerSqm: 15, // per sqm/month
      minimumWarehouseSize: 100, // sqm for initial inventory
    },

    m4: {
      importTariffRate: 0.025, // 2.5% for pet products
      vatRate: 0, // US has no federal VAT (state sales tax paid by customer)
      exciseTaxRate: 0,
    },

    m5: {
      intlShippingPerKg: 4.5, // China to US warehouse (sea freight)
      localDeliveryPerKg: 0, // Covered by FBA fee
      fbaFeePerUnit: 5.5, // Average FBA fulfillment fee
      warehouseFeePerUnitMonth: 0.75, // FBA storage fee
      returnRate: 0.08, // 8% return rate for pet products
    },

    m6: {
      avgCac: 25, // Customer Acquisition Cost
      platformCommissionRate: 0.15, // 15% Amazon referral fee
      avgCpc: 0.8, // Cost per click for Amazon PPC
      avgConversionRate: 0.12, // 12% conversion rate
    },

    m7: {
      paymentGatewayRate: 0.029, // 2.9% (Amazon handles payment)
      currencyConversionRate: 0.015, // 1.5% FX markup
      chargebackRate: 0.005, // 0.5% chargeback rate
      avgChargebackFee: 20,
    },

    m8: {
      customerServiceCostPerOrder: 2.5,
      monthlyStaffCost: 5000, // Part-time operations manager
      monthlySoftwareCost: 500, // Analytics, email, CRM tools
    },

    dataSource: 'tier2',
    lastUpdated: new Date('2025-11-01'),
    notes: 'Based on GECOM whitepaper case: 益家之宠 US Amazon FBA',
  },

  // ============================================
  // PET INDUSTRY - VIETNAM
  // ============================================
  'pet-VN-shopee': {
    industry: 'pet',
    country: 'VN',
    channel: 'shopee',

    m1: {
      companyRegistrationCost: 1500, // Vietnam company registration
      businessLicenseCost: 300,
      legalConsultingRate: 2000,
      taxRegistrationCost: 200,
    },

    m2: {
      certificationCost: [800, 1200], // Vietnam product certification
      trademarkCost: 600,
      complianceTestingCost: 500,
    },

    m3: {
      warehouseDepositPerSqm: 5, // Lower cost in Vietnam
      minimumWarehouseSize: 80,
    },

    m4: {
      importTariffRate: 0.05, // 5% import tariff
      vatRate: 0.1, // 10% VAT
      exciseTaxRate: 0,
    },

    m5: {
      intlShippingPerKg: 3.2, // China to Vietnam (lower cost)
      localDeliveryPerKg: 1.5, // Shopee logistics
      fbaFeePerUnit: 0,
      warehouseFeePerUnitMonth: 0.3,
      returnRate: 0.12, // 12% return rate (higher in Vietnam)
    },

    m6: {
      avgCac: 8, // Much lower CAC in Vietnam
      platformCommissionRate: 0.06, // 6% Shopee commission
      avgCpc: 0.15,
      avgConversionRate: 0.08,
    },

    m7: {
      paymentGatewayRate: 0.025, // 2.5%
      currencyConversionRate: 0.02, // 2% FX markup
      chargebackRate: 0.003,
      avgChargebackFee: 10,
    },

    m8: {
      customerServiceCostPerOrder: 0.8,
      monthlyStaffCost: 800, // Local staff in Vietnam
      monthlySoftwareCost: 200,
    },

    dataSource: 'tier2',
    lastUpdated: new Date('2025-11-01'),
    notes: 'Based on GECOM whitepaper case: 益家之宠 Vietnam Shopee',
  },

  // ============================================
  // PET INDUSTRY - PHILIPPINES
  // ============================================
  'pet-PH-shopee': {
    industry: 'pet',
    country: 'PH',
    channel: 'shopee',

    m1: {
      companyRegistrationCost: 1800,
      businessLicenseCost: 400,
      legalConsultingRate: 2500,
      taxRegistrationCost: 250,
    },

    m2: {
      certificationCost: [1000, 1500],
      trademarkCost: 700,
      complianceTestingCost: 600,
    },

    m3: {
      warehouseDepositPerSqm: 6,
      minimumWarehouseSize: 80,
    },

    m4: {
      importTariffRate: 0.07, // 7% import tariff
      vatRate: 0.12, // 12% VAT
      exciseTaxRate: 0,
    },

    m5: {
      intlShippingPerKg: 3.8,
      localDeliveryPerKg: 1.8,
      fbaFeePerUnit: 0,
      warehouseFeePerUnitMonth: 0.35,
      returnRate: 0.10,
    },

    m6: {
      avgCac: 10,
      platformCommissionRate: 0.06,
      avgCpc: 0.2,
      avgConversionRate: 0.09,
    },

    m7: {
      paymentGatewayRate: 0.028,
      currencyConversionRate: 0.022,
      chargebackRate: 0.004,
      avgChargebackFee: 12,
    },

    m8: {
      customerServiceCostPerOrder: 1.0,
      monthlyStaffCost: 900,
      monthlySoftwareCost: 250,
    },

    dataSource: 'tier2',
    lastUpdated: new Date('2025-11-01'),
    notes: 'Philippines market factors for pet products on Shopee',
  },

  // ============================================
  // VAPE INDUSTRY - UNITED STATES - DTC
  // ============================================
  'vape-US-dtc': {
    industry: 'vape',
    country: 'US',
    channel: 'dtc',

    m1: {
      companyRegistrationCost: 3000,
      businessLicenseCost: 800, // Special license for tobacco products
      legalConsultingRate: 8000, // Higher for regulated industry
      taxRegistrationCost: 500,
    },

    m2: {
      certificationCost: [5000, 8000], // FDA PMTA, stricter for vape
      trademarkCost: 1500,
      complianceTestingCost: 3000, // Lab testing required
    },

    m3: {
      warehouseDepositPerSqm: 18,
      minimumWarehouseSize: 120,
    },

    m4: {
      importTariffRate: 0.0, // Manufactured domestically
      vatRate: 0,
      exciseTaxRate: 0.35, // 35% federal excise tax on vape
    },

    m5: {
      intlShippingPerKg: 0, // Domestic manufacturing
      localDeliveryPerKg: 6.5, // UPS/FedEx ground
      fbaFeePerUnit: 0, // Can't sell vape on Amazon
      warehouseFeePerUnitMonth: 0.5,
      returnRate: 0.05, // Lower return rate for vape
    },

    m6: {
      avgCac: 45, // High CAC due to ad restrictions
      platformCommissionRate: 0, // DTC, no platform
      avgCpc: 2.5, // Google Ads restrictions, higher CPC
      avgConversionRate: 0.15,
    },

    m7: {
      paymentGatewayRate: 0.035, // Higher risk category
      currencyConversionRate: 0,
      chargebackRate: 0.01, // Higher chargeback in vape
      avgChargebackFee: 25,
    },

    m8: {
      customerServiceCostPerOrder: 3.5,
      monthlyStaffCost: 8000,
      monthlySoftwareCost: 800, // Shopify + email + compliance tools
    },

    dataSource: 'tier2',
    lastUpdated: new Date('2025-11-01'),
    notes: 'Based on GECOM whitepaper case: VapePro US DTC',
  },

  // ============================================
  // VAPE INDUSTRY - UNITED STATES - O2O
  // ============================================
  'vape-US-o2o': {
    industry: 'vape',
    country: 'US',
    channel: 'o2o',

    m1: {
      companyRegistrationCost: 3000,
      businessLicenseCost: 1200, // Retail license required
      legalConsultingRate: 8000,
      taxRegistrationCost: 500,
    },

    m2: {
      certificationCost: [5000, 8000],
      trademarkCost: 1500,
      complianceTestingCost: 3000,
    },

    m3: {
      warehouseDepositPerSqm: 25, // Retail space more expensive
      minimumWarehouseSize: 50, // Smaller retail footprint
    },

    m4: {
      importTariffRate: 0.0,
      vatRate: 0,
      exciseTaxRate: 0.35,
    },

    m5: {
      intlShippingPerKg: 0,
      localDeliveryPerKg: 2.0, // Local delivery for O2O orders
      fbaFeePerUnit: 0,
      warehouseFeePerUnitMonth: 1.2, // Higher retail storage cost
      returnRate: 0.03, // Very low return for O2O
    },

    m6: {
      avgCac: 15, // Lower CAC for O2O (walk-ins + local ads)
      platformCommissionRate: 0.03, // DoorDash, Uber Eats commission
      avgCpc: 0.5,
      avgConversionRate: 0.25, // Higher conversion for O2O
    },

    m7: {
      paymentGatewayRate: 0.029,
      currencyConversionRate: 0,
      chargebackRate: 0.005,
      avgChargebackFee: 20,
    },

    m8: {
      customerServiceCostPerOrder: 1.5,
      monthlyStaffCost: 12000, // Retail staff required
      monthlySoftwareCost: 600, // POS + inventory management
    },

    dataSource: 'tier2',
    lastUpdated: new Date('2025-11-01'),
    notes: 'Based on GECOM whitepaper case: VapePro US O2O (profitable model)',
  },
};

/**
 * Get default factors when specific combination not found
 */
function getDefaultFactors(
  industry: Industry,
  country: TargetCountry,
  channel: SalesChannel
): IndustryFactors {
  // Return conservative default estimates
  return {
    industry,
    country,
    channel,

    m1: {
      companyRegistrationCost: 2000,
      businessLicenseCost: 500,
      legalConsultingRate: 3000,
      taxRegistrationCost: 300,
    },

    m2: {
      certificationCost: [2000, 4000],
      trademarkCost: 1000,
      complianceTestingCost: 1500,
    },

    m3: {
      warehouseDepositPerSqm: 10,
      minimumWarehouseSize: 100,
    },

    m4: {
      importTariffRate: 0.05,
      vatRate: 0.10,
      exciseTaxRate: 0,
    },

    m5: {
      intlShippingPerKg: 4.0,
      localDeliveryPerKg: 2.0,
      fbaFeePerUnit: 5.0,
      warehouseFeePerUnitMonth: 0.5,
      returnRate: 0.10,
    },

    m6: {
      avgCac: 20,
      platformCommissionRate: 0.10,
      avgCpc: 0.5,
      avgConversionRate: 0.10,
    },

    m7: {
      paymentGatewayRate: 0.029,
      currencyConversionRate: 0.015,
      chargebackRate: 0.005,
      avgChargebackFee: 20,
    },

    m8: {
      customerServiceCostPerOrder: 2.0,
      monthlyStaffCost: 3000,
      monthlySoftwareCost: 400,
    },

    dataSource: 'tier3',
    lastUpdated: new Date(),
    notes: 'Default conservative estimates',
  };
}

/**
 * Get all available factor combinations
 */
export function getAvailableFactorCombinations(): Array<{
  industry: Industry;
  country: TargetCountry;
  channel: SalesChannel;
  available: boolean;
}> {
  const combinations: Array<{
    industry: Industry;
    country: TargetCountry;
    channel: SalesChannel;
    available: boolean;
  }> = [];

  const industries: Industry[] = ['pet', 'vape'];
  const countries: TargetCountry[] = ['US', 'VN', 'PH'];
  const channels: SalesChannel[] = ['amazon_fba', 'shopee', 'dtc', 'o2o'];

  for (const industry of industries) {
    for (const country of countries) {
      for (const channel of channels) {
        const key = `${industry}-${country}-${channel}`;
        combinations.push({
          industry,
          country,
          channel,
          available: key in INDUSTRY_FACTOR_DATABASE,
        });
      }
    }
  }

  return combinations;
}

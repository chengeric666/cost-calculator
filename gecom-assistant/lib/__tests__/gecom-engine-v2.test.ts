/**
 * GECOM计算引擎v2.0单元测试
 *
 * 测试场景：
 * 1. 美国宠物食品（Amazon FBA）
 * 2. 越南宠物食品（Shopee）
 * 3. 德国宠物食品（DTC独立站）
 * 4. 用户覆盖值测试
 */

import { GECOMEngine, calculateCost } from '../gecom-engine-v2';
import type { CostFactor, Scope } from '../../types/gecom';

describe('GECOM Engine v2.0', () => {
  // 测试数据：美国宠物食品
  const US_PET_FOOD_FACTOR: CostFactor = {
    country: 'US',
    country_name_cn: '美国',
    industry: 'pet_food',
    version: '2025Q1',

    // M1
    m1_company_registration_usd: 1200,
    m1_business_license_usd: 500,
    m1_tax_registration_usd: 0,
    m1_legal_consulting_usd: 1500,

    // M2
    m2_estimated_cost_usd: 3500,

    // M3
    m3_total_estimated_usd: 8000,

    // M4
    m4_effective_tariff_rate: 0,
    m4_vat_rate: 0.06, // 6% sales tax (简化)
    m4_logistics: JSON.stringify({
      sea_freight: { usd_per_kg: 0.7, transit_days_min: 15, transit_days_max: 22 },
      air_freight: { usd_per_kg: 5.0, transit_days_min: 3, transit_days_max: 5 },
    }),

    // M5
    m5_fba_fee_standard_usd: 7.5,
    m5_return_rate: 0.1,
    m5_return_logistics_usd: 5.0,

    // M6
    m6_cac_estimated_usd: 25,
    m6_platform_commission_rate: 0.15, // Amazon 15%

    // M7
    m7_payment_rate: 0.029,
    m7_payment_fixed_usd: 0.3,

    // M8
    m8_customer_service_cost_per_order_usd: 2.0,
  };

  // 测试场景1：美国宠物食品（Amazon FBA）
  const US_SCOPE: Scope = {
    productName: 'Premium Dog Food 5kg',
    productWeightKg: 5,
    cogsUsd: 10,
    sellingPriceUsd: 35,
    monthlyVolume: 500,
    targetCountry: 'US',
    salesChannel: 'amazon_fba',
    industry: 'pet_food',
    opex: {
      shippingMethod: 'sea',
    },
  };

  describe('基础计算功能', () => {
    it('应该正确计算CAPEX', () => {
      const engine = new GECOMEngine(US_PET_FOOD_FACTOR, US_SCOPE);
      const capex = engine.calculateCAPEX();

      expect(capex.m1).toBe(3200); // 1200 + 500 + 0 + 1500
      expect(capex.m2).toBe(3500);
      expect(capex.m3).toBe(8000);
      expect(capex.total).toBe(14700);
    });

    it('应该正确计算OPEX', () => {
      const engine = new GECOMEngine(US_PET_FOOD_FACTOR, US_SCOPE);
      const opex = engine.calculateOPEX();

      // M4
      expect(opex.m4_cogs).toBe(10); // COGS
      expect(opex.m4_logistics).toBe(3.5); // 5kg * $0.7/kg (海运)
      expect(opex.m4_tariff).toBe(0); // 0% 关税
      expect(opex.m4_vat).toBeCloseTo(0.81, 2); // (10 + 3.5 + 0) * 0.06

      // M5
      expect(opex.m5_last_mile).toBe(7.5); // FBA费用
      expect(opex.m5_return).toBe(0.5); // 0.1 * 5.0

      // M6
      expect(opex.m6_marketing).toBe(25); // CAC

      // M7
      expect(opex.m7_payment).toBeCloseTo(1.315, 3); // 35 * 0.029 + 0.3
      expect(opex.m7_platform_commission).toBe(5.25); // 35 * 0.15

      // M8
      expect(opex.m8_ga).toBe(2.0); // 客服成本

      // 总计
      const expectedTotal =
        10 + 3.5 + 0 + 0.81 + 7.5 + 0.5 + 25 + 1.315 + 5.25 + 2.0;
      expect(opex.total).toBeCloseTo(expectedTotal, 2);
    });

    it('应该正确计算单位经济模型', () => {
      const result = calculateCost(US_PET_FOOD_FACTOR, US_SCOPE);

      expect(result.unit_economics.revenue).toBe(35);
      expect(result.unit_economics.cost).toBeCloseTo(55.865, 2);
      expect(result.unit_economics.gross_profit).toBeCloseTo(-20.865, 2);
      expect(result.unit_economics.gross_margin).toBeCloseTo(-0.596, 2);
    });

    it('应该正确计算KPI', () => {
      const result = calculateCost(US_PET_FOOD_FACTOR, US_SCOPE);

      // 负毛利场景下的KPI
      expect(result.kpis.payback_period_months).toBe(Infinity);
      expect(result.kpis.breakeven_price).toBeGreaterThan(0);
      expect(result.kpis.breakeven_volume).toBe(Infinity);
    });
  });

  describe('用户覆盖值功能', () => {
    it('应该支持自定义关税率', () => {
      const userOverrides: Partial<CostFactor> = {
        m4_effective_tariff_rate: 0.1, // 覆盖为10%
      };

      const engine = new GECOMEngine(US_PET_FOOD_FACTOR, US_SCOPE, userOverrides);
      const opex = engine.calculateOPEX();

      // 关税 = (10 + 3.5) * 0.1 = 1.35
      expect(opex.m4_tariff).toBeCloseTo(1.35, 2);
    });

    it('应该支持自定义VAT率', () => {
      const userOverrides: Partial<CostFactor> = {
        m4_vat_rate: 0.2, // 覆盖为20%
      };

      const engine = new GECOMEngine(US_PET_FOOD_FACTOR, US_SCOPE, userOverrides);
      const opex = engine.calculateOPEX();

      // VAT = (10 + 3.5 + 0) * 0.2 = 2.7
      expect(opex.m4_vat).toBeCloseTo(2.7, 2);
    });

    it('应该支持自定义CAC', () => {
      const userOverrides: Partial<CostFactor> = {
        m6_cac_estimated_usd: 50, // 覆盖为$50
      };

      const engine = new GECOMEngine(US_PET_FOOD_FACTOR, US_SCOPE, userOverrides);
      const opex = engine.calculateOPEX();

      expect(opex.m6_marketing).toBe(50);
    });
  });

  describe('不同运输方式', () => {
    it('应该正确计算空运成本', () => {
      const airScope: Scope = {
        ...US_SCOPE,
        opex: { shippingMethod: 'air' },
      };

      const engine = new GECOMEngine(US_PET_FOOD_FACTOR, airScope);
      const opex = engine.calculateOPEX();

      // 空运：5kg * $5.0/kg = $25
      expect(opex.m4_logistics).toBe(25);
    });

    it('应该正确计算海运成本', () => {
      const seaScope: Scope = {
        ...US_SCOPE,
        opex: { shippingMethod: 'sea' },
      };

      const engine = new GECOMEngine(US_PET_FOOD_FACTOR, seaScope);
      const opex = engine.calculateOPEX();

      // 海运：5kg * $0.7/kg = $3.5
      expect(opex.m4_logistics).toBe(3.5);
    });
  });

  describe('成本分布计算', () => {
    it('应该生成正确的成本分布', () => {
      const result = calculateCost(US_PET_FOOD_FACTOR, US_SCOPE);

      expect(result.cost_breakdown).toHaveLength(10);
      expect(result.cost_breakdown[0].module).toBe('M4: 货物成本');
      expect(result.cost_breakdown[0].amount).toBe(10);

      // 所有百分比之和应该接近100%
      const totalPercentage = result.cost_breakdown.reduce(
        (sum, item) => sum + item.percentage,
        0
      );
      expect(totalPercentage).toBeCloseTo(100, 1);
    });
  });

  describe('盈利场景测试', () => {
    it('应该正确计算盈利场景的KPI', () => {
      // 高售价场景（盈利）
      const profitableScope: Scope = {
        ...US_SCOPE,
        sellingPriceUsd: 80, // 提高售价到$80
      };

      const result = calculateCost(US_PET_FOOD_FACTOR, profitableScope);

      expect(result.unit_economics.gross_profit).toBeGreaterThan(0);
      expect(result.unit_economics.gross_margin).toBeGreaterThan(0);
      expect(result.kpis.payback_period_months).toBeLessThan(100);
      expect(result.kpis.roi).toBeGreaterThan(0);
    });
  });

  describe('边界情况处理', () => {
    it('应该处理缺少logistics数据的情况', () => {
      const incompleteFactors: CostFactor = {
        ...US_PET_FOOD_FACTOR,
        m4_logistics: '', // 空字符串
      };

      const engine = new GECOMEngine(incompleteFactors, US_SCOPE);
      const opex = engine.calculateOPEX();

      expect(opex.m4_logistics).toBe(0);
    });

    it('应该处理无效JSON的情况', () => {
      const invalidFactors: CostFactor = {
        ...US_PET_FOOD_FACTOR,
        m4_logistics: 'invalid json',
      };

      const engine = new GECOMEngine(invalidFactors, US_SCOPE);
      const opex = engine.calculateOPEX();

      expect(opex.m4_logistics).toBe(0);
    });

    it('应该处理零销量场景', () => {
      const zeroVolumeScope: Scope = {
        ...US_SCOPE,
        monthlyVolume: 0,
      };

      const result = calculateCost(US_PET_FOOD_FACTOR, zeroVolumeScope);

      expect(result.kpis.payback_period_months).toBe(Infinity);
    });
  });
});

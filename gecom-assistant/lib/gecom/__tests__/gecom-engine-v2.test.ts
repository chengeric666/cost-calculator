/**
 * GECOM计算引擎v2.0单元测试
 *
 * 验证：
 * - 基本计算逻辑正确性
 * - 用户覆盖值功能
 * - 边界条件处理
 */

import { GECOMEngine } from '../gecom-engine-v2';
import { Project, CostFactor, TargetCountry, Industry } from '@/types/gecom';

describe('GECOMEngine v2.0', () => {
  let engine: GECOMEngine;

  beforeEach(() => {
    engine = new GECOMEngine();
  });

  const mockProject: Project = {
    id: 'test-001',
    name: '测试项目',
    industry: 'pet_food',
    targetCountry: 'US',
    salesChannel: 'amazon_fba',
    userId: 'test-user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    scope: {
      productInfo: {
        sku: 'SKU-TEST',
        name: '天然无谷狗粮 2kg',
        category: 'Pet Food',
        weight: 2.0,
        cogs: 10.0,
        targetPrice: 25.0,
      },
      assumptions: {
        monthlySales: 1000,
        returnRate: 0.08,
      },
    },
  };

  const mockCostFactor: CostFactor = {
    country: 'US',
    country_name_cn: '美国',
    industry: 'pet_food',
    version: '2025Q1',
    m4_effective_tariff_rate: 0.05,
    m4_vat_rate: 0.06,
    m4_logistics: JSON.stringify({
      sea_freight: {
        usd_per_kg: 0.15,
        lcl_usd_per_cbm_min: 50,
        lcl_usd_per_cbm_max: 100,
        fcl_20ft_usd_min: 1500,
        fcl_20ft_usd_max: 3000,
        transit_days_min: 15,
        transit_days_max: 30,
        data_source: 'tier2_authoritative',
      },
      air_freight: {
        usd_per_kg: 4.5,
        ddp_usd_per_kg: 6.0,
        transit_days_min: 3,
        transit_days_max: 7,
        data_source: 'tier2_authoritative',
      },
    }),
    m5_last_mile_delivery_usd: 7.5,
    m5_return_rate: 0.10,
    m5_return_cost_rate: 0.30,
    m6_marketing_rate: 0.15,
    m7_payment_rate: 0.029,
    m7_payment_fixed_usd: 0.30,
    m7_platform_commission_rate: 0.15,
    m8_ga_rate: 0.03,
  };

  test('基本计算：OPEX总成本正确', () => {
    const result = engine.calculateCost(mockProject, mockCostFactor);

    // 验证OPEX各项成本
    expect(result.opex.m4_cogs).toBe(10.0);
    expect(result.opex.total).toBeGreaterThan(0);

    // 验证单位经济模型
    expect(result.unit_economics.revenue).toBe(25.0);
    expect(result.unit_economics.cost).toBe(result.opex.total);
    expect(result.unit_economics.gross_profit).toBe(25.0 - result.opex.total);
  });

  test('用户覆盖值：正确应用自定义关税率', () => {
    const userOverrides: Partial<CostFactor> = {
      m4_effective_tariff_rate: 0.10, // 提高到10%
    };

    const result1 = engine.calculateCost(mockProject, mockCostFactor);
    const result2 = engine.calculateCost(mockProject, mockCostFactor, userOverrides);

    // 关税成本应该不同
    expect(result2.opex.m4_tariff).toBeGreaterThan(result1.opex.m4_tariff);
  });

  test('KPI计算：ROI和回本周期合理', () => {
    // 使用高毛利项目
    const profitableProject: Project = {
      ...mockProject,
      scope: {
        productInfo: {
          sku: 'SKU-TEST',
          name: '天然无谷狗粮 2kg',
          category: 'Pet Food',
          weight: 2.0,
          cogs: 10.0,
          targetPrice: 30.0, // 提高售价
        },
        assumptions: {
          monthlySales: 2000, // 提高销量
          returnRate: 0.08,
        },
      },
    };

    const result = engine.calculateCost(profitableProject, mockCostFactor);

    // 验证KPI
    expect(result.kpis.roi).toBeDefined();
    expect(result.kpis.payback_period_months).toBeGreaterThan(0);
    expect(result.kpis.breakeven_price).toBeGreaterThan(0);
  });

  test('警告生成：负毛利率触发CRITICAL警告', () => {
    // 使用亏损项目
    const lossProject: Project = {
      ...mockProject,
      scope: {
        productInfo: {
          sku: 'SKU-TEST',
          name: '天然无谷狗粮 2kg',
          category: 'Pet Food',
          weight: 2.0,
          cogs: 10.0,
          targetPrice: 15.0, // 低售价导致亏损
        },
        assumptions: {
          monthlySales: 1000,
          returnRate: 0.08,
        },
      },
    };

    const result = engine.calculateCost(lossProject, mockCostFactor);

    // 验证警告
    expect(result.warnings).toBeDefined();
    expect(result.warnings!.length).toBeGreaterThan(0);
    expect(result.warnings!.some(w => w.includes('CRITICAL'))).toBe(true);
  });

  test('建议生成：低毛利率触发优化建议', () => {
    const result = engine.calculateCost(mockProject, mockCostFactor);

    // 验证建议
    expect(result.recommendations).toBeDefined();
    expect(result.recommendations!.length).toBeGreaterThan(0);
  });
});

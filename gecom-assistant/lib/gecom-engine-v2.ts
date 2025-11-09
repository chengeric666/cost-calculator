/**
 * GECOM计算引擎 v2.0
 * Global E-Commerce Cost Optimization Methodology
 *
 * 核心改进：
 * - 支持19国真实cost_factors数据
 * - 支持用户覆盖值（userOverrides）
 * - 完整M1-M8计算逻辑
 * - 数据溯源追踪（Tier 1/2/3）
 *
 * @version 2.0.0
 * @date 2025-11-10
 */

import type {
  CostFactor,
  Scope,
  CostResult,
  M4Logistics,
  DataSourceTier,
} from '../types/gecom';

/**
 * GECOM计算引擎类
 */
export class GECOMEngine {
  private costFactor: CostFactor;
  private userOverrides: Partial<CostFactor>;
  private scope: Scope;

  constructor(
    costFactor: CostFactor,
    scope: Scope,
    userOverrides: Partial<CostFactor> = {}
  ) {
    this.costFactor = costFactor;
    this.scope = scope;
    this.userOverrides = userOverrides;
  }

  /**
   * 获取有效值（用户覆盖 > 系统预设）
   * 这是计算引擎的核心：优先使用用户自定义值
   */
  private getEffectiveValue<K extends keyof CostFactor>(
    field: K
  ): CostFactor[K] {
    if (this.userOverrides[field] !== undefined) {
      return this.userOverrides[field] as CostFactor[K];
    }
    return this.costFactor[field];
  }

  /**
   * 计算CAPEX（一次性启动成本）
   * M1 + M2 + M3
   */
  calculateCAPEX(): CostResult['capex'] {
    // M1: 市场准入成本
    const m1 =
      this.scope.capex?.m1_market_entry ||
      this.estimateM1Cost();

    // M2: 技术合规成本
    const m2 =
      this.scope.capex?.m2_compliance ||
      this.estimateM2Cost();

    // M3: 供应链搭建成本
    const m3 =
      this.scope.capex?.m3_supply_chain_setup ||
      this.estimateM3Cost();

    return {
      m1,
      m2,
      m3,
      total: m1 + m2 + m3,
    };
  }

  /**
   * 计算OPEX（单位运营成本）
   * M4 + M5 + M6 + M7 + M8
   */
  calculateOPEX(): CostResult['opex'] {
    // M4: 货物税费
    const m4_cogs = this.scope.cogsUsd;

    // M4: 头程物流（海运或空运）
    const m4_logistics = this.calculateM4Logistics();

    // M4: 进口关税
    const tariffRate = this.getEffectiveValue('m4_effective_tariff_rate');
    const m4_tariff = (m4_cogs + m4_logistics) * tariffRate;

    // M4: VAT/GST（基于CIF + 关税）
    const vatRate = this.getEffectiveValue('m4_vat_rate');
    const m4_vat = (m4_cogs + m4_logistics + m4_tariff) * vatRate;

    // M5: 本地配送
    const m5_last_mile = this.calculateM5LastMile();

    // M5: 退货成本
    const m5_return = this.calculateM5Return();

    // M6: 营销获客
    const m6_marketing = this.calculateM6Marketing();

    // M7: 支付手续费
    const m7_payment = this.calculateM7Payment();

    // M7: 平台佣金
    const m7_platform_commission = this.calculateM7PlatformCommission();

    // M8: 运营管理（G&A）
    const m8_ga = this.calculateM8GA();

    const total =
      m4_cogs +
      m4_tariff +
      m4_logistics +
      m4_vat +
      m5_last_mile +
      m5_return +
      m6_marketing +
      m7_payment +
      m7_platform_commission +
      m8_ga;

    return {
      m4_cogs,
      m4_tariff,
      m4_logistics,
      m4_vat,
      m5_last_mile,
      m5_return,
      m6_marketing,
      m7_payment,
      m7_platform_commission,
      m8_ga,
      total,
    };
  }

  /**
   * 完整计算流程
   */
  calculate(): CostResult {
    const capex = this.calculateCAPEX();
    const opex = this.calculateOPEX();

    // 单位经济模型
    const revenue = this.scope.sellingPriceUsd;
    const cost = opex.total;
    const gross_profit = revenue - cost;
    const gross_margin = gross_profit / revenue;

    // KPI计算
    const monthly_profit = gross_profit * this.scope.monthlyVolume;
    const payback_period_months =
      monthly_profit > 0 ? capex.total / monthly_profit : Infinity;
    const roi =
      capex.total > 0
        ? ((monthly_profit * 12 - capex.total) / capex.total) * 100
        : 0;
    const breakeven_price = cost / 0.65; // 假设目标毛利率35%
    const breakeven_volume =
      gross_profit > 0 ? capex.total / gross_profit : Infinity;

    // 成本分布
    const cost_breakdown = [
      { module: 'M4: 货物成本', amount: opex.m4_cogs, percentage: 0 },
      { module: 'M4: 进口关税', amount: opex.m4_tariff, percentage: 0 },
      { module: 'M4: 头程物流', amount: opex.m4_logistics, percentage: 0 },
      { module: 'M4: VAT/GST', amount: opex.m4_vat, percentage: 0 },
      { module: 'M5: 本地配送', amount: opex.m5_last_mile, percentage: 0 },
      { module: 'M5: 退货成本', amount: opex.m5_return, percentage: 0 },
      { module: 'M6: 营销获客', amount: opex.m6_marketing, percentage: 0 },
      { module: 'M7: 支付手续费', amount: opex.m7_payment, percentage: 0 },
      { module: 'M7: 平台佣金', amount: opex.m7_platform_commission, percentage: 0 },
      { module: 'M8: 运营管理', amount: opex.m8_ga, percentage: 0 },
    ];

    // 计算百分比
    const totalCost = cost_breakdown.reduce((sum, item) => sum + item.amount, 0);
    cost_breakdown.forEach((item) => {
      item.percentage = (item.amount / totalCost) * 100;
    });

    return {
      capex,
      opex,
      unit_economics: {
        revenue,
        cost,
        gross_profit,
        gross_margin,
      },
      kpis: {
        roi,
        payback_period_months,
        breakeven_price,
        breakeven_volume,
      },
      cost_breakdown,
    };
  }

  // ==================== 私有辅助方法 ====================

  /**
   * M1: 市场准入成本估算
   */
  private estimateM1Cost(): number {
    const registration = this.getEffectiveValue('m1_company_registration_usd') || 0;
    const license = this.getEffectiveValue('m1_business_license_usd') || 0;
    const tax = this.getEffectiveValue('m1_tax_registration_usd') || 0;
    const legal = this.getEffectiveValue('m1_legal_consulting_usd') || 0;

    return registration + license + tax + legal;
  }

  /**
   * M2: 技术合规成本估算
   */
  private estimateM2Cost(): number {
    const testing = this.getEffectiveValue('m2_product_testing_cost_usd') || 0;
    const trademark = this.getEffectiveValue('m2_trademark_registration_usd') || 0;
    const estimated = this.getEffectiveValue('m2_estimated_cost_usd') || 0;

    // 如果有总估算值，使用总估算；否则累加明细
    return estimated > 0 ? estimated : testing + trademark;
  }

  /**
   * M3: 供应链搭建成本估算
   */
  private estimateM3Cost(): number {
    const deposit = this.getEffectiveValue('m3_warehouse_deposit_usd') || 0;
    const equipment = this.getEffectiveValue('m3_equipment_purchase_usd') || 0;
    const inventory = this.getEffectiveValue('m3_initial_inventory_usd') || 0;
    const system = this.getEffectiveValue('m3_system_setup_usd') || 0;
    const estimated = this.getEffectiveValue('m3_total_estimated_usd') || 0;

    // 如果有总估算值，使用总估算；否则累加明细
    return estimated > 0 ? estimated : deposit + equipment + inventory + system;
  }

  /**
   * M4: 头程物流费用
   */
  private calculateM4Logistics(): number {
    const logisticsJson = this.getEffectiveValue('m4_logistics');
    if (!logisticsJson) return 0;

    try {
      const logistics: M4Logistics = JSON.parse(logisticsJson as string);
      const shippingMethod = this.scope.opex?.shippingMethod || 'sea';
      const weightKg = this.scope.productWeightKg;

      if (shippingMethod === 'sea') {
        return logistics.sea_freight.usd_per_kg * weightKg;
      } else {
        return logistics.air_freight.usd_per_kg * weightKg;
      }
    } catch (error) {
      console.error('Failed to parse m4_logistics JSON:', error);
      return 0;
    }
  }

  /**
   * M5: 本地配送费用
   */
  private calculateM5LastMile(): number {
    // 优先使用FBA费用（如果是Amazon FBA）
    if (this.scope.salesChannel === 'amazon_fba') {
      const fbaFee = this.getEffectiveValue('m5_fba_fee_standard_usd') || 0;
      if (fbaFee > 0) return fbaFee;
    }

    // 否则使用本地配送费用
    return this.getEffectiveValue('m5_last_mile_delivery_usd') || 0;
  }

  /**
   * M5: 退货成本
   */
  private calculateM5Return(): number {
    const returnRate = this.getEffectiveValue('m5_return_rate') || 0.1;
    const returnCost = this.getEffectiveValue('m5_return_logistics_usd') || 0;

    return returnRate * returnCost;
  }

  /**
   * M6: 营销获客成本
   */
  private calculateM6Marketing(): number {
    // 优先使用CAC
    const cac = this.getEffectiveValue('m6_cac_estimated_usd') || 0;
    if (cac > 0) return cac;

    // 否则按营销费率计算
    const marketingRate = this.getEffectiveValue('m6_marketing_rate') || 0.15;
    return this.scope.sellingPriceUsd * marketingRate;
  }

  /**
   * M7: 支付手续费
   */
  private calculateM7Payment(): number {
    const paymentRate = this.getEffectiveValue('m7_payment_rate') || 0.029;
    const fixedFee = this.getEffectiveValue('m7_payment_fixed_usd') || 0.3;

    return this.scope.sellingPriceUsd * paymentRate + fixedFee;
  }

  /**
   * M7: 平台佣金
   */
  private calculateM7PlatformCommission(): number {
    // 优先使用M7平台佣金
    let commissionRate = this.getEffectiveValue('m7_platform_commission_rate');

    // 如果M7没有，尝试使用M6平台佣金
    if (!commissionRate || commissionRate === 0) {
      commissionRate = this.getEffectiveValue('m6_platform_commission_rate') || 0;
    }

    // 如果用户有自定义营销费率，使用自定义值
    if (this.scope.opex?.customPlatformCommissionRate !== undefined) {
      commissionRate = this.scope.opex.customPlatformCommissionRate;
    }

    return this.scope.sellingPriceUsd * commissionRate;
  }

  /**
   * M8: 运营管理成本（G&A）
   */
  private calculateM8GA(): number {
    // 优先使用客服成本
    const customerService =
      this.getEffectiveValue('m8_customer_service_cost_per_order_usd') || 0;
    if (customerService > 0) return customerService;

    // 否则按G&A费率计算
    const gaRate = this.getEffectiveValue('m8_ga_rate') || 0.05;
    return this.scope.sellingPriceUsd * gaRate;
  }
}

/**
 * 便捷函数：计算成本
 * @param costFactor 成本因子数据
 * @param scope 业务场景
 * @param userOverrides 用户覆盖值（可选）
 */
export function calculateCost(
  costFactor: CostFactor,
  scope: Scope,
  userOverrides: Partial<CostFactor> = {}
): CostResult {
  const engine = new GECOMEngine(costFactor, scope, userOverrides);
  return engine.calculate();
}

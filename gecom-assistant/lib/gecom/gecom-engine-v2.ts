/**
 * GECOM计算引擎 v2.0 - MVP 2.0
 *
 * 核心特性：
 * - 支持19国真实CostFactor数据（127字段）
 * - 支持用户覆盖值（userOverrides）
 * - 完整M1-M8模块计算
 * - 兼容POC版本接口
 *
 * @version 2.0.0
 * @date 2025-01-10
 */

import {
  Project,
  CostFactor,
  CostResult,
  M4Logistics,
  DataSourceTier,
} from '@/types/gecom';

/**
 * GECOM计算引擎类
 *
 * 使用方式：
 * ```typescript
 * const engine = new GECOMEngine();
 * const result = engine.calculateCost(project, costFactor, userOverrides);
 * ```
 */
export class GECOMEngine {
  /**
   * 主计算函数 - 计算完整成本模型
   *
   * @param project 项目信息（包含产品参数、目标市场、销售渠道等）
   * @param costFactor 成本因子（从Appwrite数据库读取的19国真实数据）
   * @param userOverrides 用户自定义覆盖值（可选，来自Step 2用户输入）
   * @returns 成本计算结果
   */
  calculateCost(
    project: Project,
    costFactor: CostFactor,
    userOverrides?: Partial<CostFactor>
  ): CostResult {
    // 合并系统预设和用户覆盖值
    const effectiveFactor = this.mergeFactors(costFactor, userOverrides);

    // 计算CAPEX（M1-M3）
    const capex = this.calculateCAPEX(project, effectiveFactor);

    // 计算OPEX（M4-M8）
    const opex = this.calculateOPEX(project, effectiveFactor);

    // 计算单位经济模型
    const unitEconomics = this.calculateUnitEconomics(project, opex);

    // 计算关键KPI
    const kpis = this.calculateKPIs(project, capex, opex, unitEconomics);

    // 成本分布
    const costBreakdown = this.calculateCostBreakdown(opex);

    // 生成警告
    const warnings = this.generateWarnings(unitEconomics, kpis);

    // 生成建议
    const recommendations = this.generateRecommendations(project, unitEconomics, kpis, effectiveFactor);

    return {
      capex,
      opex,
      unit_economics: unitEconomics,
      unitEconomics: { // POC兼容字段
        revenue: unitEconomics.revenue,
        totalCost: unitEconomics.cost,
        grossProfit: unitEconomics.gross_profit,
        grossMargin: unitEconomics.gross_margin,
        contributionMargin: unitEconomics.gross_margin, // 简化处理
      },
      kpis: {
        roi: kpis.roi,
        payback_period_months: kpis.payback_period_months,
        paybackPeriod: kpis.payback_period_months, // POC兼容
        breakeven_price: kpis.breakeven_price,
        breakeven_volume: kpis.breakeven_volume,
        breakEvenPrice: kpis.breakeven_price, // POC兼容
        breakEvenVolume: kpis.breakeven_volume, // POC兼容
        ltv: kpis.ltv || 0,
        ltvCacRatio: kpis.ltv_cac_ratio || 0,
      },
      cost_breakdown: costBreakdown,
      warnings,
      recommendations,
    };
  }

  /**
   * 合并系统预设和用户覆盖值
   */
  private mergeFactors(
    costFactor: CostFactor,
    userOverrides?: Partial<CostFactor>
  ): CostFactor {
    if (!userOverrides) {
      return costFactor;
    }

    return {
      ...costFactor,
      ...userOverrides,
    };
  }

  /**
   * 计算CAPEX（Phase 0-1）：一次性启动成本
   */
  private calculateCAPEX(project: Project, factor: CostFactor): CostResult['capex'] {
    // M1: 市场准入
    const m1_company_registration = factor.m1_company_registration_usd || 0;
    const m1_business_license = factor.m1_business_license_usd || 0;
    const m1_tax_registration = factor.m1_tax_registration_usd || 0;
    const m1_legal_consulting = factor.m1_legal_consulting_usd || 0;
    const m1_import_license = factor.m1_import_license_required
      ? (factor.m1_import_license_cost_usd || 0)
      : 0;

    const m1_total = m1_company_registration
      + m1_business_license
      + m1_tax_registration
      + m1_legal_consulting
      + m1_import_license;

    // M2: 技术合规
    const m2_certification = factor.m2_estimated_cost_usd || 0;
    const m2_trademark = factor.m2_trademark_registration_usd || 0;
    const m2_testing = factor.m2_product_testing_cost_usd || 0;

    const m2_total = m2_certification + m2_trademark + m2_testing;

    // M3: 供应链搭建
    const m3_warehouse_deposit = factor.m3_warehouse_deposit_usd || 0;
    const m3_equipment = factor.m3_equipment_purchase_usd || 0;
    const m3_initial_inventory = factor.m3_initial_inventory_usd || 0;
    const m3_system_setup = factor.m3_system_setup_usd || 0;

    const m3_total = m3_warehouse_deposit
      + m3_equipment
      + m3_initial_inventory
      + m3_system_setup;

    const capex_total = m1_total + m2_total + m3_total;

    return {
      m1: m1_total,
      m2: m2_total,
      m3: m3_total,
      total: capex_total,
      // POC兼容字段（详细拆解）
      m1_marketEntry: {
        companyRegistration: m1_company_registration,
        businessLicense: m1_business_license,
        legalConsulting: m1_legal_consulting,
        taxRegistration: m1_tax_registration,
        total: m1_total,
        dataSource: (factor.m1_tier || 'tier2') as DataSourceTier,
      },
      m2_techCompliance: {
        productCertification: m2_certification,
        trademarkRegistration: m2_trademark,
        complianceTesting: m2_testing,
        total: m2_total,
        dataSource: (factor.m2_tier || 'tier2') as DataSourceTier,
      },
      m3_supplyChain: {
        warehouseDeposit: m3_warehouse_deposit,
        equipmentPurchase: m3_equipment,
        initialInventory: m3_initial_inventory,
        systemSetup: m3_system_setup,
        total: m3_total,
        dataSource: (factor.m3_tier || 'tier2') as DataSourceTier,
      },
    };
  }

  /**
   * 计算OPEX（Phase 1-N）：单位运营成本
   */
  private calculateOPEX(project: Project, factor: CostFactor): CostResult['opex'] {
    const productInfo = project.scope?.productInfo;
    if (!productInfo) {
      throw new Error('Product info is required for OPEX calculation');
    }

    const cogs = productInfo.cogs;
    const weight = productInfo.weight;
    const sellingPrice = productInfo.targetPrice;

    // M4: 货物税费
    // 4.1 COGS（用户输入）
    const m4_cogs = cogs;

    // 4.2 头程物流（国际运输）
    let logistics: M4Logistics;
    try {
      logistics = typeof factor.m4_logistics === 'string'
        ? JSON.parse(factor.m4_logistics)
        : factor.m4_logistics;
    } catch (e) {
      console.error('Failed to parse m4_logistics:', e);
      // Fallback默认值
      logistics = {
        sea_freight: {
          usd_per_kg: 0.15,
          lcl_usd_per_cbm_min: 50,
          lcl_usd_per_cbm_max: 100,
          fcl_20ft_usd_min: 1500,
          fcl_20ft_usd_max: 3000,
          transit_days_min: 15,
          transit_days_max: 30,
          data_source: 'tier3_estimated',
        },
        air_freight: {
          usd_per_kg: 4.5,
          ddp_usd_per_kg: 6.0,
          transit_days_min: 3,
          transit_days_max: 7,
          data_source: 'tier3_estimated',
        },
      };
    }

    // 默认使用空运（用户可在Step 2选择海运/空运）
    const m4_logistics = logistics.air_freight.usd_per_kg * weight;

    // 4.3 进口关税（基于CIF = COGS + 头程物流）
    const cif_value = cogs + m4_logistics;
    const tariff_rate = factor.m4_effective_tariff_rate || 0;
    const m4_tariff = cif_value * tariff_rate;

    // 4.4 增值税（基于DDP = CIF + 关税）
    const ddp_value = cif_value + m4_tariff;
    const vat_rate = factor.m4_vat_rate || 0;
    const m4_vat = ddp_value * vat_rate;

    // M5: 物流配送
    // 5.1 末端配送
    const m5_last_mile = factor.m5_last_mile_delivery_usd || 0;

    // 5.2 退货成本
    const return_rate = factor.m5_return_rate || 0.08;
    const return_cost_rate = factor.m5_return_cost_rate || 0.30;
    const m5_return = (m4_logistics + m5_last_mile) * return_rate * return_cost_rate;

    // M6: 营销获客
    // 6.1 营销费用（基于销售额的百分比）
    const marketing_rate = factor.m6_marketing_rate || 0.15;
    const m6_marketing = sellingPrice * marketing_rate;

    // M7: 支付手续费
    // 7.1 支付网关费用
    const payment_rate = factor.m7_payment_rate || 0.029;
    const payment_fixed = factor.m7_payment_fixed_usd || 0.30;
    const m7_payment = sellingPrice * payment_rate + payment_fixed;

    // 7.2 平台佣金
    const platform_commission_rate = factor.m7_platform_commission_rate || 0.15;
    const m7_platform_commission = sellingPrice * platform_commission_rate;

    // M8: 运营管理
    // 8.1 G&A费用（基于销售额的百分比）
    const ga_rate = factor.m8_ga_rate || 0.03;
    const m8_ga = sellingPrice * ga_rate;

    // 计算总成本
    const opex_total = m4_cogs
      + m4_tariff
      + m4_logistics
      + m4_vat
      + m5_last_mile
      + m5_return
      + m6_marketing
      + m7_payment
      + m7_platform_commission
      + m8_ga;

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
      total: opex_total,
      // POC兼容字段（详细拆解）
      m4_goodsTax: {
        cogs: m4_cogs,
        importTariff: m4_tariff,
        vat: m4_vat,
        total: m4_cogs + m4_tariff + m4_vat,
        dataSource: (factor.m4_tier || 'tier2') as DataSourceTier,
      },
      m5_logistics: {
        intlShipping: m4_logistics,
        localDelivery: m5_last_mile,
        warehouseFee: 0,
        returnLogistics: m5_return,
        total: m4_logistics + m5_last_mile + m5_return,
        dataSource: (factor.m5_tier || 'tier2') as DataSourceTier,
      },
      m8_operations: {
        customerService: 0,
        staff: 0,
        software: m8_ga,
        total: m8_ga,
        dataSource: (factor.m8_tier || 'tier2') as DataSourceTier,
      },
    };
  }

  /**
   * 计算单位经济模型
   */
  private calculateUnitEconomics(
    project: Project,
    opex: CostResult['opex']
  ): CostResult['unit_economics'] {
    const sellingPrice = project.scope?.productInfo?.targetPrice || 0;
    const totalCost = opex.total;
    const grossProfit = sellingPrice - totalCost;
    const grossMargin = sellingPrice > 0 ? (grossProfit / sellingPrice) * 100 : 0;

    return {
      revenue: sellingPrice,
      cost: totalCost,
      gross_profit: grossProfit,
      gross_margin: grossMargin,
    };
  }

  /**
   * 计算关键KPI
   */
  private calculateKPIs(
    project: Project,
    capex: CostResult['capex'],
    opex: CostResult['opex'],
    unitEconomics: CostResult['unit_economics']
  ): CostResult['kpis'] {
    const monthlySales = project.scope?.assumptions?.monthlySales || 0;
    const sellingPrice = project.scope?.productInfo?.targetPrice || 0;

    // ROI = (年度利润 / 总投资) * 100
    const annualRevenue = sellingPrice * monthlySales * 12;
    const annualCost = opex.total * monthlySales * 12;
    const annualProfit = annualRevenue - annualCost;
    const roi = capex.total > 0 ? (annualProfit / capex.total) * 100 : 0;

    // 回本周期 = CAPEX / 月度利润（月）
    const monthlyProfit = unitEconomics.gross_profit * monthlySales;
    const paybackPeriod = monthlyProfit > 0 ? capex.total / monthlyProfit : 999;

    // 盈亏平衡价格 = 单位总成本
    const breakEvenPrice = opex.total;

    // 盈亏平衡销量 = CAPEX / 单位毛利
    const breakEvenVolume = unitEconomics.gross_profit > 0
      ? capex.total / unitEconomics.gross_profit
      : 999999;

    // LTV（简化：假设2年内4次复购）
    const avgOrdersPerCustomer = 4;
    const ltv = unitEconomics.gross_profit * avgOrdersPerCustomer;

    // CAC（从M6营销费用推算）
    const cac = opex.m6_marketing;
    const ltvCacRatio = cac > 0 ? ltv / cac : 0;

    return {
      roi,
      payback_period_months: paybackPeriod,
      paybackPeriod, // POC兼容
      breakeven_price: breakEvenPrice,
      breakeven_volume: breakEvenVolume,
      breakEvenPrice, // POC兼容
      breakEvenVolume, // POC兼容
      ltv,
      ltv_cac_ratio: ltvCacRatio,
    };
  }

  /**
   * 计算成本分布
   */
  private calculateCostBreakdown(opex: CostResult['opex']): CostResult['cost_breakdown'] {
    const total = opex.total;

    const breakdown = [
      { module: 'M4: 货物税费', amount: opex.m4_cogs + opex.m4_tariff + opex.m4_vat, percentage: 0 },
      { module: 'M5: 物流配送', amount: opex.m4_logistics + opex.m5_last_mile + opex.m5_return, percentage: 0 },
      { module: 'M6: 营销获客', amount: opex.m6_marketing, percentage: 0 },
      { module: 'M7: 支付手续费', amount: opex.m7_payment + opex.m7_platform_commission, percentage: 0 },
      { module: 'M8: 运营管理', amount: opex.m8_ga, percentage: 0 },
    ];

    // 计算百分比
    breakdown.forEach(item => {
      item.percentage = total > 0 ? (item.amount / total) * 100 : 0;
    });

    return breakdown;
  }

  /**
   * 生成警告信息
   */
  private generateWarnings(
    unitEconomics: CostResult['unit_economics'],
    kpis: CostResult['kpis']
  ): string[] {
    const warnings: string[] = [];

    // 毛利率警告
    if (unitEconomics.gross_margin < 0) {
      warnings.push('🚨 CRITICAL: 负毛利率 - 每笔订单都在亏损！');
    } else if (unitEconomics.gross_margin < 15) {
      warnings.push('⚠️ WARNING: 毛利率低于15% - 盈利空间极窄，业务模式存在风险');
    } else if (unitEconomics.gross_margin < 30) {
      warnings.push('⚠️ CAUTION: 毛利率低于30% - 应对成本波动能力有限');
    }

    // LTV:CAC警告
    if (kpis.ltv_cac_ratio && kpis.ltv_cac_ratio < 1) {
      warnings.push('🚨 CRITICAL: LTV:CAC比率低于1:1 - 获客成本不可持续');
    } else if (kpis.ltv_cac_ratio && kpis.ltv_cac_ratio < 3) {
      warnings.push('⚠️ WARNING: LTV:CAC比率低于3:1 - 获客成本偏高');
    }

    // 回本周期警告
    if (kpis.payback_period_months > 24) {
      warnings.push('⚠️ WARNING: 回本周期超过24个月 - 资金回收时间过长');
    } else if (kpis.payback_period_months > 12) {
      warnings.push('⚠️ CAUTION: 回本周期超过12个月 - 建议优化成本结构');
    }

    // ROI警告
    if (kpis.roi < 0) {
      warnings.push('🚨 CRITICAL: 负ROI - 整体亏损');
    } else if (kpis.roi < 50) {
      warnings.push('⚠️ WARNING: ROI低于50% - 投资回报率偏低');
    }

    return warnings;
  }

  /**
   * 生成优化建议
   */
  private generateRecommendations(
    project: Project,
    unitEconomics: CostResult['unit_economics'],
    kpis: CostResult['kpis'],
    factor: CostFactor
  ): string[] {
    const recommendations: string[] = [];
    const sellingPrice = project.scope?.productInfo?.targetPrice || 0;

    // 价格优化
    if (unitEconomics.gross_margin < 30) {
      const suggestedPrice = kpis.breakeven_price * 1.4; // 40%毛利率
      recommendations.push(
        `💡 建议提价至$${suggestedPrice.toFixed(2)}（40%毛利率）或降低成本`
      );
    }

    // CAC优化
    if (kpis.ltv_cac_ratio && kpis.ltv_cac_ratio < 3) {
      const targetCac = kpis.ltv ? kpis.ltv / 3 : 0;
      recommendations.push(
        `💡 通过有机渠道（SEO、内容营销、推荐）降低CAC至$${targetCac.toFixed(2)}以下`
      );
    }

    // 渠道建议
    if (project.salesChannel === 'dtc' && factor.m6_marketing_rate && factor.m6_marketing_rate > 0.2) {
      recommendations.push(
        `💡 考虑O2O或电商平台渠道以降低DTC高获客成本（当前${(factor.m6_marketing_rate * 100).toFixed(0)}%）`
      );
    }

    // 市场建议
    if (project.targetCountry === 'US' && unitEconomics.gross_margin < 20) {
      recommendations.push(
        `💡 探索越南或菲律宾市场 - 较低成本可能提升10-15%毛利率`
      );
    }

    // 物流优化
    const logisticsCost = (factor.m4_logistics ?
      (typeof factor.m4_logistics === 'string' ?
        JSON.parse(factor.m4_logistics).air_freight.usd_per_kg :
        factor.m4_logistics.air_freight.usd_per_kg)
      : 0) * (project.scope?.productInfo?.weight || 0);

    const lastMileCost = factor.m5_last_mile_delivery_usd || 0;
    const totalShippingCost = logisticsCost + lastMileCost;
    const logisticsCostThreshold = sellingPrice * 0.2; // 20%阈值

    if (totalShippingCost > logisticsCostThreshold) {
      recommendations.push(
        `💡 物流成本偏高（占售价${((totalShippingCost / sellingPrice) * 100).toFixed(1)}%）- 考虑本地化生产或整柜发货`
      );
    }

    // 平台佣金优化
    const platformCommissionRate = factor.m7_platform_commission_rate || 0;
    if (platformCommissionRate > 0.1) {
      recommendations.push(
        `💡 平台佣金${(platformCommissionRate * 100).toFixed(0)}% - 考虑建立自有渠道（DTC）提升毛利`
      );
    }

    return recommendations;
  }
}

/**
 * 便捷导出函数（兼容POC版本接口）
 *
 * @deprecated 建议使用GECOMEngine类实例化方式
 */
export function calculateCostModelV2(
  project: Project,
  costFactor: CostFactor,
  userOverrides?: Partial<CostFactor>
): CostResult {
  const engine = new GECOMEngine();
  return engine.calculateCost(project, costFactor, userOverrides);
}

/**
 * 实时计算Hook辅助函数（用于Step 2）
 * 带300ms节流，避免频繁计算
 */
export function createThrottledCalculator() {
  let timeoutId: NodeJS.Timeout | null = null;

  return function throttledCalculate(
    project: Project,
    costFactor: CostFactor,
    userOverrides: Partial<CostFactor>,
    callback: (result: CostResult) => void
  ) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      const engine = new GECOMEngine();
      const result = engine.calculateCost(project, costFactor, userOverrides);
      callback(result);
    }, 300);
  };
}

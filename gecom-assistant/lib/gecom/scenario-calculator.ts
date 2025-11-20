/**
 * Scenario Calculator - Phase 5C
 *
 * 场景模拟计算引擎
 * 支持参数覆盖后的批量计算
 *
 * 功能：
 * - 场景参数覆盖（价格、销量、CAC、物流模式等）
 * - 批量计算多国成本结果
 * - 实时计算节流处理
 *
 * @version 1.0.0
 * @date 2025-11-14
 */

import { GECOMEngine } from './gecom-engine-v2';
import { Project, CostFactor, CostResult, TargetCountry } from '@/types/gecom';
import { ScenarioParams } from '@/components/wizard/scenario/ScenarioParameterPanel';

/**
 * 场景计算结果
 */
export interface ScenarioResult {
  country: TargetCountry;
  costResult: CostResult;
  params: ScenarioParams;
}

/**
 * 使用场景参数重新计算成本
 *
 * @param baseProject 基础项目（来自Step 1）
 * @param costFactor 国家成本因子
 * @param scenarioParams 场景参数覆盖
 * @returns 计算结果
 */
export function calculateWithScenarioParams(
  baseProject: Project,
  costFactor: CostFactor,
  scenarioParams: Partial<ScenarioParams>
): CostResult {
  const engine = new GECOMEngine();

  // 创建场景化的项目对象（合并场景参数）
  const scenarioProject: Project = {
    ...baseProject,
    scope: {
      ...baseProject.scope!,
      productInfo: {
        ...baseProject.scope!.productInfo,
        targetPrice: scenarioParams.sellingPrice ?? baseProject.scope!.productInfo.targetPrice,
      },
      assumptions: {
        ...baseProject.scope!.assumptions,
        monthlySales: scenarioParams.monthlyVolume ?? baseProject.scope!.assumptions.monthlySales,
        returnRate: (scenarioParams.returnRate ?? baseProject.scope!.assumptions.returnRate * 100) / 100, // 转换为0-1
      },
    },
  };

  // 构建costFactor覆盖值（根据场景参数）
  const costFactorOverrides: Partial<CostFactor> = {};

  // 1. 物流模式覆盖（海运 vs 空运）
  if (scenarioParams.logisticsMode && costFactor.m4_logistics) {
    // 注意：这里我们不直接覆盖costFactor，而是在计算时根据mode选择对应费率
    // GECOMEngine内部会处理这个逻辑
  }

  // 2. CAC覆盖
  if (scenarioParams.cac !== undefined) {
    (costFactorOverrides as any).m6_cac_estimated_usd = scenarioParams.cac;
  }

  // 3. 履约模式覆盖（FBA vs 3PL vs Direct）
  if (scenarioParams.fulfillmentMode) {
    // 根据履约模式设置对应的费用
    if (scenarioParams.fulfillmentMode === 'fba') {
      (costFactorOverrides as any).m5_fba_fee_standard_usd = costFactor.m5_fba_fee_standard_usd ?? 3.5;
    } else if (scenarioParams.fulfillmentMode === '3pl') {
      // 使用warehouse fee作为3PL估算
      (costFactorOverrides as any).m5_warehouse_fee_per_unit_month_usd = costFactor.m5_warehouse_fee_per_unit_month_usd ?? 2.8;
    } else {
      // 使用last mile delivery作为direct shipping估算
      (costFactorOverrides as any).m5_last_mile_delivery_usd = costFactor.m5_last_mile_delivery_usd ?? 4.2;
    }
  }

  // 4. 支付网关覆盖
  if (scenarioParams.paymentGateway) {
    const paymentRates = {
      'stripe': 0.029,
      'paypal': 0.035,
      'shoppay': 0.025,
    };
    const paymentRate = paymentRates[scenarioParams.paymentGateway];

    (costFactorOverrides as any).m7_payment_rate = paymentRate;
  }

  // 调用GECOM引擎计算
  return engine.calculateCost(scenarioProject, costFactor, costFactorOverrides);
}

/**
 * 批量计算多个国家的场景成本
 *
 * @param baseProject 基础项目
 * @param countries 选中的国家列表
 * @param costFactors 国家成本因子映射（country → costFactor）
 * @param scenarioParams 场景参数
 * @returns 场景结果数组
 */
export function calculateMultipleCountries(
  baseProject: Project,
  countries: TargetCountry[],
  costFactors: Map<TargetCountry, CostFactor>,
  scenarioParams: Partial<ScenarioParams>
): ScenarioResult[] {
  const results: ScenarioResult[] = [];

  for (const country of countries) {
    const costFactor = costFactors.get(country);
    if (!costFactor) {
      console.warn(`Cost factor not found for country: ${country}`);
      continue;
    }

    const costResult = calculateWithScenarioParams(
      { ...baseProject, targetCountry: country },
      costFactor,
      scenarioParams
    );

    results.push({
      country,
      costResult,
      params: scenarioParams as ScenarioParams,
    });
  }

  return results;
}

/**
 * 计算场景参数影响
 *
 * 返回场景参数对成本的具体影响量
 *
 * @param baseResult 基准成本结果
 * @param scenarioResult 场景成本结果
 * @returns 影响分析
 */
export interface ScenarioImpact {
  // 单位经济模型变化
  revenueChange: number;
  costChange: number;
  grossProfitChange: number;
  grossMarginChange: number;

  // 关键指标变化
  roiChange: number;
  paybackPeriodChange: number;

  // 成本模块变化
  m4Change: number; // 货物税费
  m5Change: number; // 物流配送
  m6Change: number; // 营销获客
  m7Change: number; // 支付手续费
}

export function calculateScenarioImpact(
  baseResult: CostResult,
  scenarioResult: CostResult
): ScenarioImpact {
  return {
    revenueChange: scenarioResult.unit_economics.revenue - baseResult.unit_economics.revenue,
    costChange: scenarioResult.unit_economics.cost - baseResult.unit_economics.cost,
    grossProfitChange: scenarioResult.unit_economics.gross_profit - baseResult.unit_economics.gross_profit,
    grossMarginChange: scenarioResult.unit_economics.gross_margin - baseResult.unit_economics.gross_margin,

    roiChange: scenarioResult.kpis.roi - baseResult.kpis.roi,
    paybackPeriodChange: scenarioResult.kpis.payback_period_months - baseResult.kpis.payback_period_months,

    m4Change: scenarioResult.opex.m4_goodsTax - baseResult.opex.m4_goodsTax,
    m5Change: scenarioResult.opex.m5_logistics - baseResult.opex.m5_logistics,
    m6Change: scenarioResult.opex.m6_marketing - baseResult.opex.m6_marketing,
    m7Change: scenarioResult.opex.m7_payment - baseResult.opex.m7_payment,
  };
}

/**
 * 节流工具函数
 *
 * 用于实时计算的性能优化（300ms节流）
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return function throttled(...args: Parameters<T>) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    if (timeSinceLastCall >= delay) {
      lastCall = now;
      func(...args);
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        func(...args);
      }, delay - timeSinceLastCall);
    }
  };
}

/**
 * 参数影响矩阵说明
 *
 * | 参数            | 影响模块        | 影响方式                | 示例                              |
 * |----------------|----------------|------------------------|----------------------------------|
 * | sellingPrice   | M4 VAT, M7 支付 | 计税基础、手续费基数       | $45→$55：VAT +$2, Payment +$0.29 |
 * | monthlyVolume  | CAPEX分摊       | 月销量越高，单位CAPEX越低  | 1000→2000：CAPEX/unit $2.5→$1.25 |
 * | cac            | M6 营销         | 直接影响获客成本          | $25→$35：M6 +$10                 |
 * | logisticsMode  | M4 物流         | 海运vs空运成本差异        | sea→air：+$6.0/kg                |
 * | fulfillmentMode| M5 配送         | FBA vs 3PL费用差异      | FBA $3.5 vs 3PL $2.8             |
 * | returnRate     | M5 逆向物流     | 退货率越高，逆向成本越高   | 5%→10%：+$1.2/unit               |
 * | paymentGateway | M7 支付         | 费率差异                | Stripe 2.9% vs PayPal 3.5%       |
 */

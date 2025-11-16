/**
 * AI工具函数：获取成本拆解详情
 *
 * 功能：查询当前项目的M1-M8各模块成本明细
 * 参数：
 *  - module: 可选，指定要查询的模块（all/m1/m2/.../m8）
 *  - project: 项目基本信息
 *
 * 返回：成本拆解JSON数据
 *
 * @module lib/ai/tools/getCostBreakdown
 */

import { Project, ProjectScope, CostResult } from '@/types/gecom';
import { calculateCostModel } from '@/lib/gecom/calculator';

// ============================================
// 类型定义
// ============================================

export interface GetCostBreakdownParams {
  module?: 'all' | 'm1' | 'm2' | 'm3' | 'm4' | 'm5' | 'm6' | 'm7' | 'm8';
}

export interface CostBreakdownResult {
  summary?: {
    capex_total: number;
    opex_total: number;
    unit_economics: {
      revenue: number;
      cost: number;
      profit: number;
      gross_margin: number;
    };
    kpis: {
      roi: number;
      payback_period_months: number;
      ltv_cac_ratio: number;
      breakeven_price: number;
      breakeven_volume: number;
    };
  };
  capex_breakdown?: {
    m1_market_entry: number;
    m2_technical_compliance: number;
    m3_supply_chain: number;
  };
  opex_breakdown?: {
    m4_goods_tax: number;
    m5_logistics: number;
    m6_marketing: number;
    m7_payment: number;
    m8_operations: number;
  };
  module_name?: string;
  market_entry?: { total: number };
  technical_compliance?: { total: number };
  supply_chain?: { total: number };
  goods_tax?: {
    cogs: number;
    tariff: number;
    logistics: number;
    vat: number;
    total: number;
  };
  logistics?: {
    last_mile: number;
    return: number;
    total: number;
  };
  marketing?: {
    total: number;
  };
  payment?: {
    gateway: number;
    commission: number;
    total: number;
  };
  operations?: {
    total: number;
  };
  error?: string;
}

// ============================================
// 工具函数
// ============================================

/**
 * 获取成本拆解详情
 *
 * @param params - 查询参数
 * @param project - 项目信息
 * @returns 成本拆解结果
 *
 * @example
 * ```typescript
 * // 查询全部模块
 * const result = getCostBreakdown({ module: 'all' }, project);
 *
 * // 查询单个模块
 * const m4Result = getCostBreakdown({ module: 'm4' }, project);
 * ```
 */
export function getCostBreakdown(
  params: GetCostBreakdownParams,
  project: Partial<Project>
): CostBreakdownResult {
  const { module = 'all' } = params;

  // 参数验证
  if (!project.scope) {
    return { error: '缺少项目基本信息（scope），请先完成Step 1' };
  }

  // 计算成本
  let costResult: CostResult;
  try {
    const fullProject: Project = {
      id: project.id || 'temp',
      name: project.name || 'temp-project',
      industry: project.industry || 'pet',
      targetCountry: project.targetCountry as any || 'US',
      salesChannel: project.salesChannel as any || 'amazon_fba',
      scope: project.scope as ProjectScope,
      createdAt: project.createdAt || new Date(),
      updatedAt: project.updatedAt || new Date()
    };

    costResult = calculateCostModel(fullProject);
  } catch (error) {
    console.error('成本计算失败:', error);
    return {
      error: '成本计算失败，请检查项目参数是否完整。提示：确保已完成Step 1（业务场景定义）和Step 2（成本参数配置）'
    };
  }

  // 返回全部模块
  if (module === 'all') {
    return {
      summary: {
        capex_total: costResult.capex.total,
        opex_total: costResult.opex.total,
        unit_economics: {
          revenue: costResult.unit_economics.revenue,
          cost: costResult.unit_economics.cost,
          profit: costResult.unit_economics.gross_profit, // Fixed: profit → gross_profit
          gross_margin: costResult.unit_economics.gross_margin
        },
        kpis: {
          roi: costResult.kpis.roi,
          payback_period_months: costResult.kpis.payback_period_months,
          ltv_cac_ratio: costResult.kpis.ltvCacRatio || 0, // Fixed: ltv_cac_ratio → ltvCacRatio + fallback
          breakeven_price: costResult.kpis.breakeven_price,
          breakeven_volume: costResult.kpis.breakeven_volume
        }
      },
      capex_breakdown: {
        m1_market_entry: costResult.capex.m1,
        m2_technical_compliance: costResult.capex.m2,
        m3_supply_chain: costResult.capex.m3
      },
      opex_breakdown: {
        m4_goods_tax: costResult.opex.m4_cogs + costResult.opex.m4_tariff + costResult.opex.m4_logistics + costResult.opex.m4_vat,
        m5_logistics: costResult.opex.m5_last_mile + costResult.opex.m5_return,
        m6_marketing: costResult.opex.m6_marketing,
        m7_payment: costResult.opex.m7_payment + costResult.opex.m7_platform_commission,
        m8_operations: costResult.opex.m8_ga
      }
    };
  }

  // 返回单个模块
  const moduleData: CostBreakdownResult = {
    module_name: module
  };

  switch (module) {
    case 'm1':
      moduleData.market_entry = {
        total: costResult.capex.m1
      };
      break;

    case 'm2':
      moduleData.technical_compliance = {
        total: costResult.capex.m2
      };
      break;

    case 'm3':
      moduleData.supply_chain = {
        total: costResult.capex.m3
      };
      break;

    case 'm4':
      moduleData.goods_tax = {
        cogs: costResult.opex.m4_cogs,
        tariff: costResult.opex.m4_tariff,
        logistics: costResult.opex.m4_logistics,
        vat: costResult.opex.m4_vat,
        total: costResult.opex.m4_cogs + costResult.opex.m4_tariff + costResult.opex.m4_logistics + costResult.opex.m4_vat
      };
      break;

    case 'm5':
      moduleData.logistics = {
        last_mile: costResult.opex.m5_last_mile,
        return: costResult.opex.m5_return,
        total: costResult.opex.m5_last_mile + costResult.opex.m5_return
      };
      break;

    case 'm6':
      moduleData.marketing = {
        total: costResult.opex.m6_marketing
      };
      break;

    case 'm7':
      moduleData.payment = {
        gateway: costResult.opex.m7_payment,
        commission: costResult.opex.m7_platform_commission,
        total: costResult.opex.m7_payment + costResult.opex.m7_platform_commission
      };
      break;

    case 'm8':
      moduleData.operations = {
        total: costResult.opex.m8_ga
      };
      break;

    default:
      return {
        error: `未知模块: ${module}。支持的模块：all, m1, m2, m3, m4, m5, m6, m7, m8`
      };
  }

  return moduleData;
}

// ============================================
// 辅助函数（仅内部使用）
// ============================================

/**
 * 验证模块参数
 */
export function isValidModule(module: string): boolean {
  const validModules = ['all', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8'];
  return validModules.includes(module);
}

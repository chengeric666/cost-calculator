/**
 * AI工具函数：对比不同场景
 *
 * 功能：对比不同国家或渠道的成本结构，找出差异和最优选择
 * 参数：
 *  - countries: 必需，要对比的国家代码列表
 *  - metric: 可选，对比的指标（毛利率/总成本/ROI/关税率等）
 *  - project: 项目基本信息
 *
 * 返回：多国对比结果JSON数组
 *
 * @module lib/ai/tools/compareScenarios
 */

import { Project, ProjectScope, CostResult } from '@/types/gecom';
import { calculateCostModel } from '@/lib/gecom/calculator';

// ============================================
// 类型定义
// ============================================

export interface CompareScenariosParams {
  countries: string[];
  metric?: 'gross_margin' | 'total_cost' | 'roi' | 'tariff_rate' | 'all';
}

export interface ScenarioComparisonResult {
  country: string;
  country_name: string;
  gross_margin?: number;
  total_cost?: number;
  roi?: number;
  tariff_rate?: number;
  error?: string;
}

export type CompareScenariosResult = ScenarioComparisonResult[];

// ============================================
// 工具函数
// ============================================

/**
 * 对比不同国家的成本场景
 *
 * @param params - 对比参数
 * @param project - 项目信息
 * @returns 对比结果数组
 *
 * @example
 * ```typescript
 * // 对比3个国家的所有指标
 * const result = compareScenarios({
 *   countries: ['US', 'VN', 'DE'],
 *   metric: 'all'
 * }, project);
 *
 * // 仅对比毛利率
 * const marginResult = compareScenarios({
 *   countries: ['US', 'VN'],
 *   metric: 'gross_margin'
 * }, project);
 * ```
 */
export async function compareScenarios(
  params: CompareScenariosParams,
  project: Partial<Project>
): Promise<CompareScenariosResult> {
  const { countries, metric = 'all' } = params;

  // 参数验证
  if (!countries || countries.length === 0) {
    return [{
      country: 'ERROR',
      country_name: '错误',
      error: '缺少countries参数，请提供至少1个国家代码'
    }];
  }

  if (countries.length > 19) {
    return [{
      country: 'ERROR',
      country_name: '错误',
      error: '最多支持对比19个国家，请减少国家数量'
    }];
  }

  if (!project.scope) {
    return [{
      country: 'ERROR',
      country_name: '错误',
      error: '缺少项目基本信息（scope），请先完成Step 1'
    }];
  }

  // 对比结果
  const results: CompareScenariosResult = [];

  // 逐个计算每个国家的成本
  for (const country of countries) {
    try {
      // 验证国家代码
      if (!isValidCountryCode(country)) {
        results.push({
          country,
          country_name: country,
          error: `不支持的国家代码: ${country}。支持的国家：US, UK, DE, FR, ES, IT, NL, PL, JP, AU, CA, MX, BR, VN, TH, SG, MY, ID, IN, KR, SA, AE`
        });
        continue;
      }

      // 构建临时项目（切换国家）
      const tempProject: Project = {
        id: project.id || 'temp',
        name: project.name || 'temp-project',
        industry: project.industry || 'pet',
        targetCountry: country as any,
        salesChannel: project.salesChannel as any || 'amazon_fba',
        scope: project.scope as ProjectScope,
        createdAt: project.createdAt || new Date(),
        updatedAt: project.updatedAt || new Date()
      };

      // 计算该国家的成本
      const countryResult: CostResult = calculateCostModel(tempProject);

      // 构建结果对象
      const resultData: ScenarioComparisonResult = {
        country,
        country_name: getCountryName(country),
      };

      // 根据metric参数返回相应指标
      if (metric === 'all') {
        resultData.gross_margin = countryResult.unit_economics.gross_margin;
        resultData.total_cost = countryResult.opex.total;
        resultData.roi = countryResult.kpis.roi;
        resultData.tariff_rate = getTariffRate(countryResult);
      } else {
        switch (metric) {
          case 'gross_margin':
            resultData.gross_margin = countryResult.unit_economics.gross_margin;
            break;
          case 'total_cost':
            resultData.total_cost = countryResult.opex.total;
            break;
          case 'roi':
            resultData.roi = countryResult.kpis.roi;
            break;
          case 'tariff_rate':
            resultData.tariff_rate = getTariffRate(countryResult);
            break;
        }
      }

      results.push(resultData);

    } catch (error) {
      console.error(`对比${country}成本失败:`, error);
      results.push({
        country,
        country_name: getCountryName(country),
        error: `无法计算${getCountryName(country)}的成本，可能该国家数据暂不可用`
      });
    }
  }

  return results;
}

// ============================================
// 辅助函数
// ============================================

/**
 * 获取国家中文名称
 */
export function getCountryName(code: string): string {
  const countryNames: Record<string, string> = {
    'US': '美国',
    'UK': '英国',
    'DE': '德国',
    'FR': '法国',
    'ES': '西班牙',
    'IT': '意大利',
    'NL': '荷兰',
    'PL': '波兰',
    'JP': '日本',
    'AU': '澳大利亚',
    'CA': '加拿大',
    'MX': '墨西哥',
    'BR': '巴西',
    'VN': '越南',
    'TH': '泰国',
    'SG': '新加坡',
    'MY': '马来西亚',
    'ID': '印度尼西亚',
    'PH': '菲律宾',
    'IN': '印度',
    'KR': '韩国',
    'SA': '沙特阿拉伯',
    'AE': '阿联酋'
  };
  return countryNames[code] || code;
}

/**
 * 计算有效关税率
 */
export function getTariffRate(costResult: CostResult): number {
  const tariff = costResult.opex.m4_tariff || 0;
  const cogs = costResult.opex.m4_cogs || 1;
  return (tariff / cogs) * 100;
}

/**
 * 验证国家代码
 */
export function isValidCountryCode(code: string): boolean {
  const validCountries = [
    'US', 'UK', 'DE', 'FR', 'ES', 'IT', 'NL', 'PL',
    'JP', 'AU', 'CA', 'MX', 'BR',
    'VN', 'TH', 'SG', 'MY', 'ID', 'PH', 'IN', 'KR',
    'SA', 'AE'
  ];
  return validCountries.includes(code);
}

/**
 * 批量验证国家代码
 */
export function validateCountries(countries: string[]): {
  valid: string[];
  invalid: string[];
} {
  const valid: string[] = [];
  const invalid: string[] = [];

  for (const country of countries) {
    if (isValidCountryCode(country)) {
      valid.push(country);
    } else {
      invalid.push(country);
    }
  }

  return { valid, invalid };
}

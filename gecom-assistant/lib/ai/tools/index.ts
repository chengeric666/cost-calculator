/**
 * AI工具函数库 - 统一导出
 *
 * 提供3个核心工具函数用于DeepSeek V3工具调用：
 * 1. getCostBreakdown - 获取成本拆解详情
 * 2. compareScenarios - 对比不同市场
 * 3. getOptimizationSuggestions - 生成优化建议
 *
 * @module lib/ai/tools
 */

export {
  getCostBreakdown,
  isValidModule,
  type GetCostBreakdownParams,
  type CostBreakdownResult
} from './getCostBreakdown';

export {
  compareScenarios,
  getCountryName,
  getTariffRate,
  isValidCountryCode,
  validateCountries,
  type CompareScenariosParams,
  type ScenarioComparisonResult,
  type CompareScenariosResult
} from './compareScenarios';

export {
  getOptimizationSuggestions,
  type GetOptimizationSuggestionsParams,
  type OptimizationSuggestion,
  type OptimizationSuggestionsResult
} from './getOptimizationSuggestions';

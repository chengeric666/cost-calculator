/**
 * Step 4 Scenario Analysis V2 - Phase 5集成版本
 *
 * 集成内容：
 * - ScenarioParameterPanel: 7参数调节器
 * - CountryMultiSelector: 19国选择器
 * - ScenarioComparisonTable: 横向对比表
 * - scenario-calculator: 实时计算引擎
 *
 * 保留：
 * - 智能市场推荐（基于真实计算结果）
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import { Project, CostResult, TargetCountry, CostFactor } from '@/types/gecom';

// Phase 5组件
import ScenarioParameterPanel, {
  ScenarioParams,
  DEFAULT_SCENARIO_PARAMS
} from './scenario/ScenarioParameterPanel';
import CountryMultiSelector, {
  DEFAULT_SELECTED_COUNTRIES
} from './scenario/CountryMultiSelector';
import ScenarioComparisonTable from './scenario/ScenarioComparisonTable';

// 场景计算引擎
import {
  calculateMultipleCountries,
  ScenarioResult,
  throttle,
} from '@/lib/gecom/scenario-calculator';

// 智能推荐（保留现有功能）
import {
  generateMarketRecommendation,
  MarketRecommendation,
} from '@/lib/gecom/market-recommendation';
import { Award, AlertTriangle, TrendingUp, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface Step4ScenarioAnalysisProps {
  project: Partial<Project>;
  onUpdate: (updates: Partial<Project>) => void;
  costResult: CostResult | null;
}

export default function Step4ScenarioAnalysisV2({
  project,
  costResult
}: Step4ScenarioAnalysisProps) {
  // ============ State Management ============
  const [activeTab, setActiveTab] = useState<'simulation' | 'recommendation'>('simulation');

  // Phase 5 State
  const [selectedCountries, setSelectedCountries] = useState<TargetCountry[]>(DEFAULT_SELECTED_COUNTRIES);
  const [scenarioParams, setScenarioParams] = useState<ScenarioParams>(DEFAULT_SCENARIO_PARAMS);
  const [scenarioResults, setScenarioResults] = useState<Map<TargetCountry, CostResult>>(new Map());
  const [tierMap, setTierMap] = useState<Map<TargetCountry, string>>(new Map());
  const [isCalculating, setIsCalculating] = useState(false);

  // Legacy State (智能推荐)
  const [showAllMarkets, setShowAllMarkets] = useState(false);
  const [showRecommendationDetails, setShowRecommendationDetails] = useState(true);

  // ============ Data Loading ============
  // Mock: 加载costFactor数据（实际应从Appwrite加载）
  const loadCostFactors = async (countries: TargetCountry[]): Promise<Map<TargetCountry, CostFactor>> => {
    const costFactors = new Map<TargetCountry, CostFactor>();

    // TODO: 实际应从Appwrite数据库加载真实costFactor
    // 现在使用mock数据
    for (const country of countries) {
      const mockCostFactor: CostFactor = {
        country,
        country_name_cn: getCountryName(country),
        industry: project.industry || 'pet',
        version: '2025Q1',

        // Mock M4-M8 数据
        m4_effective_tariff_rate: country === 'US' ? 0.04 : country === 'DE' ? 0.05 : 0.038,
        m4_vat_rate: country === 'US' ? 0 : country === 'DE' ? 0.19 : country === 'JP' ? 0.10 : 0.10,
        m4_logistics: {
          sea_freight_usd_kg: 2.5,
          air_freight_usd_kg: 8.5,
        } as any,

        m5_fba_fee_standard_usd: 3.5,
        m5_warehouse_fee_per_unit_month_usd: 2.8,
        m5_last_mile_delivery_usd: 4.2,

        m6_cac_estimated_usd: scenarioParams.cac,

        m7_payment_rate: 0.029,
      };

      costFactors.set(country, mockCostFactor);

      // 设置Tier（mock）
      const tier = country === 'US' || country === 'DE' || country === 'JP' ? 'Tier 1' : 'Tier 2';
      setTierMap(prev => new Map(prev).set(country, tier));
    }

    return costFactors;
  };

  // ============ Scenario Calculation ============
  const recalculateScenarios = useMemo(
    () => throttle(async (countries: TargetCountry[], params: ScenarioParams) => {
      setIsCalculating(true);

      try {
        // 1. 加载costFactor数据
        const costFactors = await loadCostFactors(countries);

        // 2. 构建基础project
        const baseProject: Project = {
          id: project.id || 'temp',
          name: project.name || 'Scenario Analysis',
          industry: project.industry || 'pet',
          targetCountry: countries[0],
          salesChannel: project.salesChannel || 'dtc',
          scope: {
            productInfo: {
              sku: 'SCENARIO-001',
              name: project.name || 'Test Product',
              category: 'Pet Food',
              weight: 1.0,
              cogs: 10,
              targetPrice: params.sellingPrice,
            },
            assumptions: {
              monthlySales: params.monthlyVolume,
              returnRate: params.returnRate / 100,
            },
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // 3. 批量计算多国成本
        const results = calculateMultipleCountries(
          baseProject,
          countries,
          costFactors,
          params
        );

        // 4. 更新state
        const resultMap = new Map<TargetCountry, CostResult>();
        results.forEach(r => resultMap.set(r.country, r.costResult));
        setScenarioResults(resultMap);

      } catch (error) {
        console.error('Scenario calculation failed:', error);
      } finally {
        setIsCalculating(false);
      }
    }, 300),
    [project]
  );

  // ============ Effects ============
  // 初始计算
  useEffect(() => {
    if (selectedCountries.length >= 3) {
      recalculateScenarios(selectedCountries, scenarioParams);
    }
  }, [selectedCountries, scenarioParams, recalculateScenarios]);

  // ============ Legacy: 智能推荐数据生成 ============
  const mockMultiMarketData = useMemo(() => {
    if (!costResult) return [];

    // 使用真实scenarioResults如果有的话
    if (scenarioResults.size > 0) {
      return Array.from(scenarioResults.entries()).map(([country, result]) => ({
        country,
        country_name_cn: getCountryName(country),
        country_flag: getCountryFlag(country),
        costResult: result,
        scope: {
          productName: project.name || 'Test Product',
          productWeightKg: 1,
          cogsUsd: 10,
          sellingPriceUsd: scenarioParams.sellingPrice,
          monthlyVolume: scenarioParams.monthlyVolume,
          targetCountry: country,
          salesChannel: project.salesChannel || 'dtc',
          industry: project.industry || 'pet',
        },
      }));
    }

    // Fallback到原有mock逻辑
    return [];
  }, [scenarioResults, costResult, project, scenarioParams]);

  const recommendation: MarketRecommendation | null = useMemo(() => {
    if (mockMultiMarketData.length === 0) return null;
    return generateMarketRecommendation(mockMultiMarketData);
  }, [mockMultiMarketData]);

  // ============ UI Helpers ============
  const getRecommendationBadge = (level: string) => {
    switch (level) {
      case 'best':
        return { label: '🏆 最优', className: 'bg-green-100 text-green-800 border-green-300' };
      case 'worst':
        return { label: '⚠️ 最差', className: 'bg-red-100 text-red-800 border-red-300' };
      case 'good':
        return { label: '👍 良好', className: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'poor':
        return { label: '⚡ 较差', className: 'bg-orange-100 text-orange-800 border-orange-300' };
      default:
        return { label: '📊 一般', className: 'bg-gray-100 text-gray-800 border-gray-300' };
    }
  };

  // ============ Early Return ============
  if (!costResult) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">尚无成本模型数据，请先完成Step 3</p>
      </div>
    );
  }

  // ============ Main Render ============
  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-purple-600" />
          智能场景分析
          <span className="text-sm font-normal text-purple-600">(Phase 5 What-If模拟)</span>
        </h2>
        <p className="text-gray-600">
          基于GECOM方法论的交互式场景模拟，调整参数查看对3-5个目标市场的实时影响
        </p>
      </div>

      {/* Tab切换 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="grid grid-cols-2 max-w-md mx-auto p-2 gap-2">
          <button
            onClick={() => setActiveTab('simulation')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'simulation'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            场景模拟
          </button>
          <button
            onClick={() => setActiveTab('recommendation')}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'recommendation'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            智能推荐
          </button>
        </div>
      </div>

      {/* Tab 1: 场景模拟 */}
      {activeTab === 'simulation' && (
        <div className="space-y-6">
          {/* Phase 5A: 参数调节面板 */}
          <ScenarioParameterPanel
            params={scenarioParams}
            onChange={setScenarioParams}
          />

          {/* Phase 5B: 国家选择器 */}
          <CountryMultiSelector
            selectedCountries={selectedCountries}
            onChange={setSelectedCountries}
            industry={project.industry}
          />

          {/* 加载状态 */}
          {isCalculating && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-blue-700 font-medium">正在计算场景结果...</span>
              </div>
            </div>
          )}

          {/* Phase 5D: 对比结果表格 */}
          {scenarioResults.size >= 3 && !isCalculating && (
            <ScenarioComparisonTable
              params={scenarioParams}
              results={scenarioResults}
              tierMap={tierMap}
            />
          )}

          {/* 提示：至少需要3国 */}
          {selectedCountries.length < 3 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-yellow-800">
                ⚠️ 请至少选择3个国家进行场景对比
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: 智能推荐（保留现有功能） */}
      {activeTab === 'recommendation' && (
        <div className="space-y-6">
          {recommendation ? (
            <>
              {/* 最优市场推荐卡片 */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <Award className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-green-900">
                        {recommendation.bestMarket.country_flag} {recommendation.bestMarket.country_name_cn}
                      </h3>
                      <span className="px-3 py-1 bg-green-600 text-white text-sm font-semibold rounded-full">
                        最优市场
                      </span>
                      <span className="px-3 py-1 bg-white text-green-700 text-sm font-semibold rounded-full border border-green-300">
                        评分: {recommendation.bestMarket.score.toFixed(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-3 border border-green-200">
                        <div className="text-xs text-green-700 mb-1">毛利率</div>
                        <div className="text-xl font-bold text-green-900">
                          {recommendation.bestMarket.grossMargin.toFixed(1)}%
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-green-200">
                        <div className="text-xs text-green-700 mb-1">ROI</div>
                        <div className="text-xl font-bold text-green-900">
                          {recommendation.bestMarket.roi.toFixed(0)}%
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-green-200">
                        <div className="text-xs text-green-700 mb-1">回本周期</div>
                        <div className="text-xl font-bold text-green-900">
                          {recommendation.bestMarket.paybackPeriod.toFixed(1)}月
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-green-200">
                        <div className="text-xs text-green-700 mb-1">启动成本</div>
                        <div className="text-xl font-bold text-green-900">
                          ${recommendation.bestMarket.capexTotal.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="text-sm font-semibold text-green-900 mb-2">推荐理由：</div>
                      <ul className="space-y-1">
                        {recommendation.bestMarket.reasons.map((reason, idx) => (
                          <li key={idx} className="text-sm text-green-800">
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* 最差市场警告卡片 */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-red-900">
                        {recommendation.worstMarket.country_flag} {recommendation.worstMarket.country_name_cn}
                      </h3>
                      <span className="px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded-full">
                        风险警告
                      </span>
                      <span className="px-3 py-1 bg-white text-red-700 text-sm font-semibold rounded-full border border-red-300">
                        评分: {recommendation.worstMarket.score.toFixed(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-3 border border-red-200">
                        <div className="text-xs text-red-700 mb-1">毛利率</div>
                        <div className="text-xl font-bold text-red-900">
                          {recommendation.worstMarket.grossMargin.toFixed(1)}%
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-red-200">
                        <div className="text-xs text-red-700 mb-1">ROI</div>
                        <div className="text-xl font-bold text-red-900">
                          {recommendation.worstMarket.roi.toFixed(0)}%
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-red-200">
                        <div className="text-xs text-red-700 mb-1">回本周期</div>
                        <div className="text-xl font-bold text-red-900">
                          {recommendation.worstMarket.paybackPeriod.toFixed(1)}月
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-red-200">
                        <div className="text-xs text-red-700 mb-1">启动成本</div>
                        <div className="text-xl font-bold text-red-900">
                          ${recommendation.worstMarket.capexTotal.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-red-200">
                      <div className="text-sm font-semibold text-red-900 mb-2">警告理由：</div>
                      <ul className="space-y-1">
                        {recommendation.worstMarket.reasons.map((reason, idx) => (
                          <li key={idx} className="text-sm text-red-800">
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* 市场洞察 */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <button
                  onClick={() => setShowRecommendationDetails(!showRecommendationDetails)}
                  className="w-full flex items-center justify-between mb-4"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">市场洞察分析</h3>
                  </div>
                  {showRecommendationDetails ? (
                    <ChevronUp className="h-5 w-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-600" />
                  )}
                </button>

                {showRecommendationDetails && (
                  <div className="space-y-3">
                    {recommendation.insights.map((insight, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <p className="text-sm text-gray-800">{insight}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">请先在"场景模拟"选择国家并完成计算</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============ Helper Functions ============
function getCountryName(code: string): string {
  const names: Record<string, string> = {
    US: '美国', DE: '德国', GB: '英国', FR: '法国', VN: '越南',
    TH: '泰国', MY: '马来西亚', PH: '菲律宾', ID: '印度尼西亚',
    IN: '印度', JP: '日本', KR: '韩国', AU: '澳大利亚',
    SA: '沙特阿拉伯', AE: '阿联酋', CA: '加拿大', MX: '墨西哥',
    BR: '巴西', SG: '新加坡',
  };
  return names[code] || code;
}

function getCountryFlag(code: string): string {
  const flags: Record<string, string> = {
    US: '🇺🇸', DE: '🇩🇪', GB: '🇬🇧', FR: '🇫🇷', VN: '🇻🇳',
    TH: '🇹🇭', MY: '🇲🇾', PH: '🇵🇭', ID: '🇮🇩', IN: '🇮🇳',
    JP: '🇯🇵', KR: '🇰🇷', AU: '🇦🇺', SA: '🇸🇦', AE: '🇦🇪',
    CA: '🇨🇦', MX: '🇲🇽', BR: '🇧🇷', SG: '🇸🇬',
  };
  return flags[code] || '🌐';
}

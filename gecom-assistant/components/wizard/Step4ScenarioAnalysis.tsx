'use client';

import { useState, useMemo } from 'react';
import { Project, CostResult, TargetCountry, Scope } from '@/types/gecom';
import { GitCompare, TrendingUp, Award, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import {
  generateMarketRecommendation,
  MarketRecommendation,
  formatRecommendationText,
} from '@/lib/gecom/market-recommendation';

interface Step4ScenarioAnalysisProps {
  project: Partial<Project>;
  onUpdate: (updates: Partial<Project>) => void;
  costResult: CostResult | null;
}

export default function Step4ScenarioAnalysis({ project, costResult }: Step4ScenarioAnalysisProps) {
  const [showAllMarkets, setShowAllMarkets] = useState(false);
  const [showRecommendationDetails, setShowRecommendationDetails] = useState(true);

  if (!costResult) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">尚无成本模型数据</p>
      </div>
    );
  }

  // Helper to get unit economics and kpis with fallback
  const unitEcon = costResult.unit_economics || costResult.unitEconomics;
  const getGrossMargin = () => unitEcon?.gross_margin ?? (unitEcon as any)?.grossMargin ?? 0;
  const getRoi = () => costResult.kpis.roi ?? 0;
  const getPaybackPeriod = () => costResult.kpis.payback_period_months ?? costResult.kpis.paybackPeriod ?? 0;

  // 模拟多市场数据 - MVP 2.0升级后将替换为真实多市场计算
  // TODO: 将来从真实多市场计算结果中获取数据
  const mockMultiMarketData = useMemo(() => {
    // 基于当前costResult创建模拟的不同市场数据
    const createMockCostResult = (
      multiplier: {
        grossMargin: number;
        roi: number;
        payback: number;
        capex: number;
      }
    ): CostResult => {
      const baseMargin = getGrossMargin();
      const baseRoi = getRoi();
      const basePayback = getPaybackPeriod();
      const baseCapex = costResult.capex.total;

      return {
        ...costResult,
        capex: {
          ...costResult.capex,
          total: baseCapex * multiplier.capex,
        },
        unit_economics: {
          ...unitEcon,
          gross_margin: baseMargin * multiplier.grossMargin,
        },
        kpis: {
          ...costResult.kpis,
          roi: baseRoi * multiplier.roi,
          payback_period_months: basePayback * multiplier.payback,
        },
      };
    };

    const createMockScope = (country: TargetCountry): Scope => ({
      productName: project.name || 'Test Product',
      productWeightKg: 1,
      cogsUsd: 10,
      sellingPriceUsd: 50,
      monthlyVolume: 1000,
      targetCountry: country,
      salesChannel: project.salesChannel || 'dtc',
      industry: project.industry || 'pet',
    });

    // 返回多市场数据
    return [
      {
        country: (project.targetCountry || 'US') as TargetCountry,
        country_name_cn: getCountryName(project.targetCountry || 'US'),
        country_flag: getCountryFlag(project.targetCountry || 'US'),
        costResult: costResult, // 当前市场使用真实数据
        scope: createMockScope((project.targetCountry || 'US') as TargetCountry),
      },
      {
        country: 'VN' as TargetCountry,
        country_name_cn: '越南',
        country_flag: '🇻🇳',
        costResult: createMockCostResult({
          grossMargin: 1.15, // 毛利率高15%
          roi: 1.20, // ROI高20%
          payback: 0.85, // 回本快15%
          capex: 0.60, // CAPEX低40%
        }),
        scope: createMockScope('VN'),
      },
      {
        country: 'DE' as TargetCountry,
        country_name_cn: '德国',
        country_flag: '🇩🇪',
        costResult: createMockCostResult({
          grossMargin: 0.85, // 毛利率低15%
          roi: 0.75, // ROI低25%
          payback: 1.30, // 回本慢30%
          capex: 1.50, // CAPEX高50%
        }),
        scope: createMockScope('DE'),
      },
      {
        country: 'JP' as TargetCountry,
        country_name_cn: '日本',
        country_flag: '🇯🇵',
        costResult: createMockCostResult({
          grossMargin: 0.95, // 毛利率略低5%
          roi: 0.90, // ROI略低10%
          payback: 1.10, // 回本略慢10%
          capex: 1.20, // CAPEX略高20%
        }),
        scope: createMockScope('JP'),
      },
      {
        country: 'GB' as TargetCountry,
        country_name_cn: '英国',
        country_flag: '🇬🇧',
        costResult: createMockCostResult({
          grossMargin: 0.92, // 毛利率略低8%
          roi: 0.85, // ROI低15%
          payback: 1.15, // 回本慢15%
          capex: 1.30, // CAPEX高30%
        }),
        scope: createMockScope('GB'),
      },
    ];
  }, [costResult, project, unitEcon]);

  // 生成市场推荐
  const recommendation: MarketRecommendation = useMemo(() => {
    return generateMarketRecommendation(mockMultiMarketData);
  }, [mockMultiMarketData]);

  // 获取推荐等级的显示样式
  const getRecommendationBadge = (level: string) => {
    switch (level) {
      case 'best':
        return {
          label: '🏆 最优',
          className: 'bg-green-100 text-green-800 border-green-300',
        };
      case 'worst':
        return {
          label: '⚠️ 最差',
          className: 'bg-red-100 text-red-800 border-red-300',
        };
      case 'good':
        return {
          label: '👍 良好',
          className: 'bg-blue-100 text-blue-800 border-blue-300',
        };
      case 'poor':
        return {
          label: '⚡ 较差',
          className: 'bg-orange-100 text-orange-800 border-orange-300',
        };
      default:
        return {
          label: '📊 一般',
          className: 'bg-gray-100 text-gray-800 border-gray-300',
        };
    }
  };

  // 显示的市场列表（前3个或全部）
  const displayedMarkets = showAllMarkets ? recommendation.allMarkets : recommendation.allMarkets.slice(0, 3);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          智能场景分析 <span className="text-sm font-normal text-blue-600">(S4.3 MVP 2.0)</span>
        </h2>
        <p className="text-gray-600">
          基于GECOM方法论的多维度市场推荐算法，为您找出最优市场策略
        </p>
      </div>

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

      {/* 完整市场排名表 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">市场综合评分排名</h3>
          <button
            onClick={() => setShowAllMarkets(!showAllMarkets)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            {showAllMarkets ? (
              <>
                <ChevronUp className="h-4 w-4" />
                收起
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                展开全部 ({recommendation.allMarkets.length}个市场)
              </>
            )}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  排名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  市场
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  推荐等级
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  综合评分
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  毛利率
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ROI
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  回本(月)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedMarkets.map((market) => {
                const badge = getRecommendationBadge(market.recommendation);
                const isCurrent = market.country === project.targetCountry;

                return (
                  <tr
                    key={market.country}
                    className={`${
                      market.recommendation === 'best'
                        ? 'bg-green-50'
                        : market.recommendation === 'worst'
                        ? 'bg-red-50'
                        : isCurrent
                        ? 'bg-blue-50'
                        : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">#{market.rank}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{market.country_flag}</span>
                        <div>
                          <div className="font-semibold text-gray-900">{market.country_name_cn}</div>
                          <div className="text-xs text-gray-500">{market.country}</div>
                        </div>
                        {isCurrent && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-blue-600 text-white rounded">
                            当前
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-lg font-bold text-gray-900">
                        {market.score.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span
                        className={`font-semibold ${
                          market.grossMargin >= 30
                            ? 'text-green-600'
                            : market.grossMargin >= 20
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {market.grossMargin.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span
                        className={`font-semibold ${
                          market.roi >= 100 ? 'text-green-600' : 'text-yellow-600'
                        }`}
                      >
                        {market.roi.toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span
                        className={`font-semibold ${
                          market.paybackPeriod <= 12 ? 'text-green-600' : 'text-yellow-600'
                        }`}
                      >
                        {market.paybackPeriod.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 整体洞察 */}
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

      {/* 算法说明 */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">📐 评分算法说明</h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <span className="font-semibold text-gray-900">权重配置：</span>
            <ul className="mt-2 space-y-1 ml-4">
              <li>• 毛利率: 40%</li>
              <li>• ROI: 30%</li>
              <li>• 回本周期: 20%</li>
              <li>• CAPEX: 10%</li>
            </ul>
          </div>
          <div>
            <span className="font-semibold text-gray-900">推荐等级：</span>
            <ul className="mt-2 space-y-1 ml-4">
              <li>• 🏆 最优：排名第1</li>
              <li>• 👍 良好：前30%</li>
              <li>• 📊 一般：中间40%</li>
              <li>• ⚡ 较差：后30%</li>
              <li>• ⚠️ 最差：排名最后</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>注意：</strong> 当前使用模拟数据演示智能推荐功能。MVP 2.0完整版将基于19国真实成本因子库进行多市场并行计算。
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getCountryName(code: string): string {
  const names: Record<string, string> = {
    US: '美国',
    DE: '德国',
    GB: '英国',
    FR: '法国',
    VN: '越南',
    TH: '泰国',
    MY: '马来西亚',
    PH: '菲律宾',
    ID: '印度尼西亚',
    IN: '印度',
    JP: '日本',
    KR: '韩国',
    AU: '澳大利亚',
    SA: '沙特阿拉伯',
    AE: '阿联酋',
    CA: '加拿大',
    MX: '墨西哥',
    BR: '巴西',
    SG: '新加坡',
  };
  return names[code] || code;
}

function getCountryFlag(code: string): string {
  const flags: Record<string, string> = {
    US: '🇺🇸',
    DE: '🇩🇪',
    GB: '🇬🇧',
    FR: '🇫🇷',
    VN: '🇻🇳',
    TH: '🇹🇭',
    MY: '🇲🇾',
    PH: '🇵🇭',
    ID: '🇮🇩',
    IN: '🇮🇳',
    JP: '🇯🇵',
    KR: '🇰🇷',
    AU: '🇦🇺',
    SA: '🇸🇦',
    AE: '🇦🇪',
    CA: '🇨🇦',
    MX: '🇲🇽',
    BR: '🇧🇷',
    SG: '🇸🇬',
  };
  return flags[code] || '🌐';
}

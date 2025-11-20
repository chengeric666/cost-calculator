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

// Appwrite数据操作（暂时不使用，直接加载本地数据）
// import { getCostFactorsByCountries } from '@/lib/appwrite-data';

import { Sparkles } from 'lucide-react';

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
  // Phase 5 State
  const [selectedCountries, setSelectedCountries] = useState<TargetCountry[]>(DEFAULT_SELECTED_COUNTRIES);
  const [scenarioParams, setScenarioParams] = useState<ScenarioParams>(DEFAULT_SCENARIO_PARAMS);
  const [scenarioResults, setScenarioResults] = useState<Map<TargetCountry, CostResult>>(new Map());
  const [tierMap, setTierMap] = useState<Map<TargetCountry, string>>(new Map());
  const [isCalculating, setIsCalculating] = useState(false);

  // ============ Data Loading ============
  /**
   * 直接使用本地TypeScript数据（Layer 1）- ultrathink简化方案
   * 参考Step3CostModeling的简洁数据使用方式
   */
  const loadCostFactors = async (countries: TargetCountry[]): Promise<Map<TargetCountry, CostFactor>> => {
    const costFactors = new Map<TargetCountry, CostFactor>();
    const newTierMap = new Map<TargetCountry, string>();

    // 修复：确保industry值正确映射到文件名
    const rawIndustry = project.industry || 'pet';
    const industryFileSuffix = rawIndustry === 'pet' || rawIndustry === 'pet_food' ? 'pet-food' : 'vape';

    console.log('📦 加载本地数据:', countries, `原始行业: ${rawIndustry}, 文件后缀: ${industryFileSuffix}`);

    // 动态加载每个国家的本地数据文件
    for (const country of countries) {
      try {
        const module = await import(`@/data/cost-factors/${country}-${industryFileSuffix}`);
        const data: CostFactor = module.default;

        if (data) {
          costFactors.set(country, data);

          // 设置Tier质量等级
          const tier = data.m4_tariff_data_source?.includes('官网') || data.m4_tariff_data_source?.includes('Official')
            ? 'Tier 1'
            : data.m4_tariff_data_source?.includes('报告') || data.m4_tariff_data_source?.includes('Report')
            ? 'Tier 2'
            : 'Tier 3';

          newTierMap.set(country, tier);
          console.log(`✅ ${country}: 数据加载成功 (${tier})`);
        }
      } catch (error) {
        console.error(`❌ ${country}-${industryFileSuffix} 数据加载失败:`, error);
        // 继续加载其他国家，不中断
      }
    }

    setTierMap(newTierMap);
    console.log(`✅ 总计加载成功: ${costFactors.size}/${countries.length}国`);
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
    <div className="space-y-4">
      {/* 标题 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-600" />
          智能场景分析
          <span className="text-xs font-normal text-purple-600">(Phase 5 What-If模拟)</span>
        </h2>
        <p className="text-sm text-gray-600">
          基于GECOM方法论的交互式场景模拟，调整参数查看对3-5个目标市场的实时影响
        </p>
      </div>

      {/* 场景模拟主内容 */}
        <div className="space-y-4">
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

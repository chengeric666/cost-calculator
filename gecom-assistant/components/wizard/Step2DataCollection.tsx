'use client';

/**
 * Step 2: 成本参数配置（完整M1-M8模块展示）
 *
 * MVP 2.0核心设计：
 * - 双阶段分组：CAPEX（M1-M3）+ OPEX（M4-M8）
 * - 快速模式/专家模式切换
 * - 智能预填系统（从cost_factors加载）
 * - 用户覆盖值追踪
 * - 实时成本计算预览
 * - 数据溯源可视化（Tier 1/2/3徽章）
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Project, CostResult, CostFactor, TargetCountry, Industry } from '@/types/gecom';
import { GECOMEngine } from '@/lib/gecom/gecom-engine-v2';
import { loadCostFactor } from '@/lib/data-loader';
import { VN_BASE_DATA } from '@/data/cost-factors/VN-base-data';
import {
  ChevronDown,
  ChevronRight,
  Info,
  AlertCircle,
  Edit2,
  Check,
  Calculator,
  TrendingUp,
  TrendingDown,
  Minus,
  Lock,
  Unlock,
} from 'lucide-react';

interface Step2Props {
  project: Partial<Project>;
  onUpdate: (updates: Partial<Project>) => void;
  costResult: CostResult | null;
}

interface CostParamsState {
  // 快速模式 vs 专家模式
  mode: 'quick' | 'expert';

  // 各模块展开状态
  expandedSections: {
    capex: boolean;
    m1: boolean;
    m2: boolean;
    m3: boolean;
    opex: boolean;
    m4: boolean;
    m5: boolean;
    m6: boolean;
    m7: boolean;
    m8: boolean;
  };

  // 用户覆盖值（存储用户自定义的字段）
  userOverrides: Record<string, any>;

  // 成本因子数据（从数据库加载）
  costFactor: CostFactor | null;
}

/**
 * 获取Tier徽章颜色
 */
function getTierBadgeColor(tier?: string): string {
  if (!tier) return 'bg-gray-100 text-gray-700 border-gray-300';

  if (tier.includes('1') || tier.includes('official')) {
    return 'bg-green-100 text-green-700 border-green-300';
  } else if (tier.includes('2') || tier.includes('authoritative')) {
    return 'bg-yellow-100 text-yellow-700 border-yellow-300';
  } else {
    return 'bg-gray-100 text-gray-700 border-gray-300';
  }
}

/**
 * Tier徽章组件
 */
function TierBadge({ tier }: { tier?: string }) {
  if (!tier) return null;

  const displayText = tier.includes('1')
    ? 'Tier 1'
    : tier.includes('2')
    ? 'Tier 2'
    : 'Tier 3';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getTierBadgeColor(tier)}`}>
      {displayText}
    </span>
  );
}

/**
 * Tier徽章（带数据溯源tooltip）- Day 17 Part 2增强版
 */
function TierBadgeWithTooltip({
  tier,
  dataSource,
  updatedAt,
}: {
  tier?: string;
  dataSource?: string;
  updatedAt?: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!tier) return null;

  const displayText = tier.includes('1')
    ? 'Tier 1'
    : tier.includes('2')
    ? 'Tier 2'
    : 'Tier 3';

  const tierDescription = tier.includes('1')
    ? '官方数据100%'
    : tier.includes('2')
    ? '权威数据+估算'
    : '行业估算为主';

  return (
    <div className="relative inline-block">
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border cursor-help ${getTierBadgeColor(tier)}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {displayText}
        <Info className="h-3 w-3" />
      </span>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute z-50 left-0 top-full mt-1 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl">
          <div className="space-y-2">
            <div>
              <div className="text-gray-400 mb-0.5">数据来源</div>
              <div className="font-medium">{dataSource || '数据库预设'}</div>
            </div>
            <div>
              <div className="text-gray-400 mb-0.5">数据质量</div>
              <div className="font-medium">
                {displayText} ({tierDescription})
              </div>
            </div>
            {updatedAt && (
              <div>
                <div className="text-gray-400 mb-0.5">更新时间</div>
                <div className="font-medium">{updatedAt}</div>
              </div>
            )}
          </div>
          {/* Arrow */}
          <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}
    </div>
  );
}

export default function Step2DataCollection({ project, onUpdate, costResult }: Step2Props) {
  const [state, setState] = useState<CostParamsState>({
    mode: 'quick',
    expandedSections: {
      capex: false,
      m1: false,
      m2: false,
      m3: false,
      opex: true, // OPEX默认展开
      m4: true,   // M4默认展开（最重要）
      m5: false,
      m6: false,
      m7: false,
      m8: false,
    },
    userOverrides: {},
    costFactor: null,
  });

  // 加载成本因子数据（使用已有的VN_BASE_DATA，不重新fetch）
  useEffect(() => {
    // ⚡ 使用已采集的越南基础数据（3层架构 Layer 1）
    // 数据来源：data/cost-factors/VN-base-data.ts（2025-11-09采集）
    // 优势：0%关税 + 低物流成本 + 低平台佣金，适合展示成功案例

    const costFactor: Partial<CostFactor> = {
      country: 'VN' as TargetCountry,
      country_name_cn: VN_BASE_DATA.country_name_cn,
      country_flag: VN_BASE_DATA.country_flag,
      industry: project.industry as Industry,
      version: '2025Q1',

      // M1: 市场准入（直接使用VN_BASE_DATA）
      m1_regulatory_agency: 'DAH (Department of Animal Health)',
      m1_complexity: '低',
      m1_estimated_cost_usd: VN_BASE_DATA.m1_company_registration_usd +
                             VN_BASE_DATA.m1_business_license_usd +
                             VN_BASE_DATA.m1_legal_consulting_usd,  // 300+150+1000 = 1450
      m1_tier: VN_BASE_DATA.m1_base_tier as string,

      // M2: 技术合规
      m2_certifications_required: '越南农业部备案、卫生许可',
      m2_estimated_cost_usd: VN_BASE_DATA.m2_trademark_registration_usd +
                             VN_BASE_DATA.m2_compliance_testing_usd,  // 250+800 = 1050
      m2_tier: VN_BASE_DATA.m2_compliance_tier as string,

      // M3: 供应链搭建
      m3_packaging_rate: VN_BASE_DATA.m3_packaging_rate,  // 0.015
      m3_initial_inventory_usd: VN_BASE_DATA.m3_initial_inventory_usd,  // 15000
      m3_warehouse_deposit_usd: VN_BASE_DATA.m3_warehouse_deposit_usd,  // 2000
      m3_tier: VN_BASE_DATA.m3_base_tier as string,

      // M4: 货物税费（关键：0%关税！）
      m4_effective_tariff_rate: 0,  // ⭐ RCEP协定0%关税
      m4_tariff_notes: 'RCEP协定优惠，0%关税（原产地规则适用）',
      m4_tariff_tier: 'tier1_official',
      m4_vat_rate: VN_BASE_DATA.m4_vat_rate,  // 0.10
      m4_vat_notes: VN_BASE_DATA.m4_vat_notes,
      m4_vat_tier: VN_BASE_DATA.m4_vat_tier as string,
      m4_logistics: VN_BASE_DATA.m4_logistics,  // 使用真实物流数据
      m4_logistics_tier: VN_BASE_DATA.m4_logistics_tier as string,

      // M5: 物流配送（本地配送成本极低）
      m5_last_mile_delivery_usd: VN_BASE_DATA.m5_last_mile_delivery_usd,  // 0.80
      m5_return_rate: VN_BASE_DATA.m5_return_rate,  // 0.08
      m5_return_cost_rate: VN_BASE_DATA.m5_return_cost_rate,  // 0.25
      m5_tier: VN_BASE_DATA.m5_tier as string,

      // M6: 营销获客（竞争度低）
      m6_marketing_rate: VN_BASE_DATA.m6_marketing_rate,  // 0.12
      m6_notes: VN_BASE_DATA.m6_notes,
      m6_tier: VN_BASE_DATA.m6_tier as string,

      // M7: 支付手续费（平台佣金低）
      m7_payment_rate: VN_BASE_DATA.m7_payment_rate,  // 0.025
      m7_payment_fixed_usd: VN_BASE_DATA.m7_payment_fixed_usd,  // 0.10
      m7_platform_commission_rate: VN_BASE_DATA.m7_platform_commission_rate,  // 0.02
      m7_notes: VN_BASE_DATA.m7_notes,
      m7_tier: VN_BASE_DATA.m7_tier as string,

      // M8: 运营管理（人力成本低）
      m8_ga_rate: VN_BASE_DATA.m8_ga_rate,  // 0.02
      m8_notes: VN_BASE_DATA.m8_notes,
      m8_tier: VN_BASE_DATA.m8_tier as string,
    };

    // 预期成本结构（COGS=$10, 售价=$30, 月销量=100）：
    // CAPEX总计 = $18,500 (1450+1050+2000+15000)
    // OPEX总计 ≈ $18-20/单位（0%关税节省大量成本）
    // 单位毛利 = $10-12 (毛利率 33-40%) ✅
    // 回本周期 = 15-18个月（库存投资较大，但运营成本极低）

    setState((prev) => ({ ...prev, costFactor: costFactor as CostFactor }));
  }, [project.targetCountry, project.industry]);

  // ===== 实时成本计算（300ms节流）=====
  const throttleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const gecomEngineRef = useRef(new GECOMEngine());

  useEffect(() => {
    // 条件检查：必须有完整的project数据和costFactor
    if (!project.scope?.productInfo || !state.costFactor) {
      return;
    }

    // 清除上一次的定时器
    if (throttleTimerRef.current) {
      clearTimeout(throttleTimerRef.current);
    }

    // 300ms节流执行计算
    throttleTimerRef.current = setTimeout(() => {
      try {
        // 使用GECOM引擎v2.0计算成本
        const result = gecomEngineRef.current.calculateCost(
          project as Project,
          state.costFactor!,
          state.userOverrides
        );

        // 更新父组件（传递计算结果到CostCalculatorWizard）
        onUpdate({
          costData: result,
        });

        console.log('✅ 成本计算完成（实时）:', result);
      } catch (error) {
        console.error('成本计算失败:', error);
      }
    }, 300);

    // 清理函数
    return () => {
      if (throttleTimerRef.current) {
        clearTimeout(throttleTimerRef.current);
      }
    };
  }, [state.userOverrides, state.costFactor, project.scope?.productInfo, onUpdate]);

  /**
   * 切换展开/折叠状态
   */
  const toggleSection = (section: keyof CostParamsState['expandedSections']) => {
    setState((prev) => ({
      ...prev,
      expandedSections: {
        ...prev.expandedSections,
        [section]: !prev.expandedSections[section],
      },
    }));
  };

  /**
   * 切换模式
   */
  const toggleMode = () => {
    setState((prev) => ({
      ...prev,
      mode: prev.mode === 'quick' ? 'expert' : 'quick',
      userOverrides: prev.mode === 'expert' ? {} : prev.userOverrides,
    }));
  };

  /**
   * 更新用户覆盖值
   */
  const setUserOverride = (field: string, value: any) => {
    setState((prev) => ({
      ...prev,
      userOverrides: {
        ...prev.userOverrides,
        [field]: value,
      },
    }));
  };

  /**
   * 获取有效值（用户覆盖 > 系统预设）
   */
  const getEffectiveValue = (field: keyof CostFactor): any => {
    return state.userOverrides[field] ?? state.costFactor?.[field];
  };

  /**
   * 检查字段是否被用户覆盖
   */
  const isOverridden = (field: string): boolean => {
    return field in state.userOverrides;
  };

  if (!state.costFactor) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500 mb-4" />
          <p className="text-gray-600">加载成本因子数据...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 标题区域 */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">成本参数配置</h2>
        <p className="text-gray-600">完整M1-M8模块展示，数据基于{state.costFactor.version}版本</p>
      </div>

      {/* 模式切换 + 市场信息 */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          {/* 模式切换 */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMode}
              className={`
                px-4 py-2 rounded-lg border-2 transition-all font-medium flex items-center gap-2
                ${
                  state.mode === 'quick'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Lock className={`h-4 w-4 ${state.mode === 'quick' ? 'text-blue-500' : 'text-gray-500'}`} />
              快速模式（使用全部预设）
            </button>
            <button
              onClick={toggleMode}
              className={`
                px-4 py-2 rounded-lg border-2 transition-all font-medium flex items-center gap-2
                ${
                  state.mode === 'expert'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Unlock className={`h-4 w-4 ${state.mode === 'expert' ? 'text-purple-500' : 'text-gray-500'}`} />
              专家模式（逐项自定义）
            </button>
          </div>

          {/* 市场信息 */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <span className="font-medium">目标市场:</span>
              <span className="px-3 py-1 bg-gray-100 rounded-lg font-semibold">
                {state.costFactor.country_flag || ''} {state.costFactor.country_name_cn}
              </span>
            </span>
            <span className="flex items-center gap-2">
              <span className="font-medium">数据版本:</span>
              <span className="px-3 py-1 bg-gray-100 rounded-lg font-semibold">{state.costFactor.version}</span>
            </span>
          </div>
        </div>

        {/* Tier说明 */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">数据质量分级说明</h4>
              <div className="flex items-center gap-6 text-sm text-blue-800">
                <div className="flex items-center gap-2">
                  <TierBadge tier="tier1_official" />
                  <span>官方来源，100%可信</span>
                </div>
                <div className="flex items-center gap-2">
                  <TierBadge tier="tier2_authoritative" />
                  <span>权威来源，90%可信</span>
                </div>
                <div className="flex items-center gap-2">
                  <TierBadge tier="tier3_estimated" />
                  <span>估算来源，80%可信</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域：2/3参数配置 + 1/3实时预览 */}
      <div className="grid grid-cols-3 gap-6">
        {/* 左侧：参数配置区域 */}
        <div className="col-span-2 space-y-6">
          {/* CAPEX Section */}
          <CAPEXSection
            state={state}
            toggleSection={toggleSection}
            getEffectiveValue={getEffectiveValue}
            isOverridden={isOverridden}
            setUserOverride={setUserOverride}
            project={project}
          />

          {/* OPEX Section */}
          <OPEXSection
            state={state}
            toggleSection={toggleSection}
            getEffectiveValue={getEffectiveValue}
            isOverridden={isOverridden}
            setUserOverride={setUserOverride}
            project={project}
          />
        </div>

        {/* 右侧：实时成本预览 */}
        <div className="col-span-1">
          <CostPreviewPanel
            project={project}
            costResult={costResult}
            state={state}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * CAPEX折叠面板组件（M1-M3）
 */
function CAPEXSection({ state, toggleSection, getEffectiveValue, isOverridden, setUserOverride, project }: any) {
  const capexTotal =
    (getEffectiveValue('m1_estimated_cost_usd') || 0) +
    (getEffectiveValue('m2_estimated_cost_usd') || 0) +
    ((getEffectiveValue('m3_initial_inventory_usd') || 0) + (getEffectiveValue('m3_warehouse_deposit_usd') || 0));

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* CAPEX Header */}
      <button
        onClick={() => toggleSection('capex')}
        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150 transition-colors border-b border-blue-200"
      >
        <div className="flex items-center gap-3">
          {state.expandedSections.capex ? (
            <ChevronDown className="h-5 w-5 text-blue-600" />
          ) : (
            <ChevronRight className="h-5 w-5 text-blue-600" />
          )}
          <h3 className="text-lg font-semibold text-gray-900">阶段 0-1: CAPEX（一次性启动成本）</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">总计:</span>
          <span className="text-xl font-bold text-blue-700">${capexTotal.toLocaleString()} USD</span>
        </div>
      </button>

      {/* CAPEX Content */}
      {state.expandedSections.capex && (
        <div className="p-6 space-y-4">
          {/* M1 */}
          <ModuleCard
            moduleId="m1"
            title="M1: 市场准入（Market Entry）"
            expanded={state.expandedSections.m1}
            onToggle={() => toggleSection('m1')}
            total={getEffectiveValue('m1_estimated_cost_usd') || 0}
          >
            <CostItemRow
              label="监管机构"
              value={getEffectiveValue('m1_regulatory_agency')}
              tier={getEffectiveValue('m1_tier')}
              dataSource={getEffectiveValue('m1_data_source')}
              updatedAt={getEffectiveValue('m1_updated_at')}
              readOnly
            />
            <CostItemRow
              label="合规复杂度"
              value={getEffectiveValue('m1_complexity')}
              tier={getEffectiveValue('m1_tier')}
              dataSource={getEffectiveValue('m1_data_source')}
              updatedAt={getEffectiveValue('m1_updated_at')}
              readOnly
            />
            <CostItemRow
              label="预估准入成本"
              value={getEffectiveValue('m1_estimated_cost_usd')}
              unit="USD"
              tier={getEffectiveValue('m1_tier')}
              dataSource={getEffectiveValue('m1_data_source')}
              updatedAt={getEffectiveValue('m1_updated_at')}
              isOverridden={isOverridden('m1_estimated_cost_usd')}
              onEdit={(val) => setUserOverride('m1_estimated_cost_usd', val)}
              mode={state.mode}
              description="包括公司注册、法务咨询、税务登记"
            />
          </ModuleCard>

          {/* M2 */}
          <ModuleCard
            moduleId="m2"
            title="M2: 技术合规（Technical Compliance）"
            expanded={state.expandedSections.m2}
            onToggle={() => toggleSection('m2')}
            total={getEffectiveValue('m2_estimated_cost_usd') || 0}
          >
            <CostItemRow
              label="认证要求"
              value={getEffectiveValue('m2_certifications_required')}
              tier={getEffectiveValue('m2_tier')}
              dataSource={getEffectiveValue('m2_data_source')}
              updatedAt={getEffectiveValue('m2_updated_at')}
              readOnly
            />
            <CostItemRow
              label="预估认证成本"
              value={getEffectiveValue('m2_estimated_cost_usd')}
              unit="USD"
              tier={getEffectiveValue('m2_tier')}
              dataSource={getEffectiveValue('m2_data_source')}
              updatedAt={getEffectiveValue('m2_updated_at')}
              isOverridden={isOverridden('m2_estimated_cost_usd')}
              onEdit={(val) => setUserOverride('m2_estimated_cost_usd', val)}
              mode={state.mode}
              description="产品检测、认证申请费用"
            />
          </ModuleCard>

          {/* M3 */}
          <ModuleCard
            moduleId="m3"
            title="M3: 供应链搭建（Supply Chain Setup）"
            expanded={state.expandedSections.m3}
            onToggle={() => toggleSection('m3')}
            total={(getEffectiveValue('m3_initial_inventory_usd') || 0) + (getEffectiveValue('m3_warehouse_deposit_usd') || 0)}
          >
            <CostItemRow
              label="包装本地化费率"
              value={`${((getEffectiveValue('m3_packaging_rate') || 0) * 100).toFixed(1)}%`}
              tier={getEffectiveValue('m3_tier')}
              dataSource={getEffectiveValue('m3_data_source')}
              updatedAt={getEffectiveValue('m3_updated_at')}
              readOnly
              description={`计算: $${project.scope?.productInfo?.targetPrice || 0} × ${((getEffectiveValue('m3_packaging_rate') || 0) * 100).toFixed(1)}% = $${((project.scope?.productInfo?.targetPrice || 0) * (getEffectiveValue('m3_packaging_rate') || 0)).toFixed(2)}/单位`}
            />
            <CostItemRow
              label="初始库存投资"
              value={getEffectiveValue('m3_initial_inventory_usd')}
              unit="USD"
              tier={getEffectiveValue('m3_tier')}
              dataSource={getEffectiveValue('m3_data_source')}
              updatedAt={getEffectiveValue('m3_updated_at')}
              isOverridden={isOverridden('m3_initial_inventory_usd')}
              onEdit={(val) => setUserOverride('m3_initial_inventory_usd', val)}
              mode={state.mode}
            />
            <CostItemRow
              label="仓储押金"
              value={getEffectiveValue('m3_warehouse_deposit_usd')}
              unit="USD"
              tier={getEffectiveValue('m3_tier')}
              dataSource={getEffectiveValue('m3_data_source')}
              updatedAt={getEffectiveValue('m3_updated_at')}
              isOverridden={isOverridden('m3_warehouse_deposit_usd')}
              onEdit={(val) => setUserOverride('m3_warehouse_deposit_usd', val)}
              mode={state.mode}
            />
          </ModuleCard>
        </div>
      )}
    </div>
  );
}

/**
 * OPEX折叠面板组件（M4-M8）
 */
function OPEXSection({ state, toggleSection, getEffectiveValue, isOverridden, setUserOverride, project }: any) {
  // 简化的OPEX计算（详细计算在CostPreviewPanel中）
  const cogsUsd = project.scope?.productInfo?.cogs || 0;
  const sellingPrice = project.scope?.productInfo?.targetPrice || 0;
  const productWeight = project.scope?.productInfo?.weight || 0;

  const logistics = state.costFactor?.m4_logistics ? JSON.parse(state.costFactor.m4_logistics) : null;
  const logisticsCost = logistics ? logistics.air_freight.usd_per_kg * productWeight : 0;
  const tariffCost = cogsUsd * (getEffectiveValue('m4_effective_tariff_rate') || 0);
  const vatCost = (cogsUsd + logisticsCost + tariffCost) * (getEffectiveValue('m4_vat_rate') || 0);
  const m4Total = cogsUsd + logisticsCost + tariffCost + vatCost;

  const m5Total = (getEffectiveValue('m5_last_mile_delivery_usd') || 0) +
    sellingPrice * (getEffectiveValue('m5_return_cost_rate') || 0) * (getEffectiveValue('m5_return_rate') || 0);

  const m6Total = sellingPrice * (getEffectiveValue('m6_marketing_rate') || 0);

  const m7Total =
    sellingPrice * (getEffectiveValue('m7_payment_rate') || 0) +
    (getEffectiveValue('m7_payment_fixed_usd') || 0) +
    sellingPrice * (getEffectiveValue('m7_platform_commission_rate') || 0);

  const m8Total = sellingPrice * (getEffectiveValue('m8_ga_rate') || 0);

  const opexTotal = m4Total + m5Total + m6Total + m7Total + m8Total;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* OPEX Header */}
      <button
        onClick={() => toggleSection('opex')}
        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-150 transition-colors border-b border-green-200"
      >
        <div className="flex items-center gap-3">
          {state.expandedSections.opex ? (
            <ChevronDown className="h-5 w-5 text-green-600" />
          ) : (
            <ChevronRight className="h-5 w-5 text-green-600" />
          )}
          <h3 className="text-lg font-semibold text-gray-900">阶段 1-N: OPEX（单位运营成本）</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">单位成本:</span>
          <span className="text-xl font-bold text-green-700">${opexTotal.toFixed(2)} USD/单位</span>
        </div>
      </button>

      {/* OPEX Content */}
      {state.expandedSections.opex && (
        <div className="p-6 space-y-4">
          {/* M4: 货物税费 */}
          <M4Module
            state={state}
            toggleSection={toggleSection}
            getEffectiveValue={getEffectiveValue}
            isOverridden={isOverridden}
            setUserOverride={setUserOverride}
            project={project}
            logistics={logistics}
            total={m4Total}
          />

          {/* M5-M8简化显示 */}
          <ModuleCard
            moduleId="m5"
            title="M5: 物流配送（Logistics & Delivery）"
            expanded={state.expandedSections.m5}
            onToggle={() => toggleSection('m5')}
            total={m5Total}
          >
            <CostItemRow
              label="尾程配送费（如FBA）"
              value={getEffectiveValue('m5_last_mile_delivery_usd')}
              unit="USD/单位"
              tier={getEffectiveValue('m5_tier')}
              dataSource={getEffectiveValue('m5_data_source')}
              updatedAt={getEffectiveValue('m5_updated_at')}
              isOverridden={isOverridden('m5_last_mile_delivery_usd')}
              onEdit={(val) => setUserOverride('m5_last_mile_delivery_usd', val)}
              mode={state.mode}
            />
            <CostItemRow
              label="退货率"
              value={`${((getEffectiveValue('m5_return_rate') || 0) * 100).toFixed(1)}%`}
              tier={getEffectiveValue('m5_tier')}
              dataSource={getEffectiveValue('m5_data_source')}
              updatedAt={getEffectiveValue('m5_updated_at')}
              readOnly
            />
            <CostItemRow
              label="退货处理成本率"
              value={`${((getEffectiveValue('m5_return_cost_rate') || 0) * 100).toFixed(1)}%`}
              tier={getEffectiveValue('m5_tier')}
              dataSource={getEffectiveValue('m5_data_source')}
              updatedAt={getEffectiveValue('m5_updated_at')}
              readOnly
              description={`计算: $${sellingPrice.toFixed(2)} × ${((getEffectiveValue('m5_return_cost_rate') || 0) * 100).toFixed(1)}% × ${((getEffectiveValue('m5_return_rate') || 0) * 100).toFixed(1)}% = $${(sellingPrice * (getEffectiveValue('m5_return_cost_rate') || 0) * (getEffectiveValue('m5_return_rate') || 0)).toFixed(2)}/单位`}
            />
          </ModuleCard>

          <ModuleCard
            moduleId="m6"
            title="M6: 营销获客（Marketing & Acquisition）"
            expanded={state.expandedSections.m6}
            onToggle={() => toggleSection('m6')}
            total={m6Total}
          >
            <CostItemRow
              label="营销费率"
              value={`${((getEffectiveValue('m6_marketing_rate') || 0) * 100).toFixed(1)}%`}
              tier={getEffectiveValue('m6_tier')}
              dataSource={getEffectiveValue('m6_data_source')}
              updatedAt={getEffectiveValue('m6_updated_at')}
              isOverridden={isOverridden('m6_marketing_rate')}
              onEdit={(val) => setUserOverride('m6_marketing_rate', val / 100)}
              mode={state.mode}
              description={getEffectiveValue('m6_notes')}
            />
          </ModuleCard>

          <ModuleCard
            moduleId="m7"
            title="M7: 支付手续费（Payment Processing）"
            expanded={state.expandedSections.m7}
            onToggle={() => toggleSection('m7')}
            total={m7Total}
          >
            <CostItemRow
              label="支付网关费用"
              value={`${((getEffectiveValue('m7_payment_rate') || 0) * 100).toFixed(1)}% + $${getEffectiveValue('m7_payment_fixed_usd')}`}
              tier={getEffectiveValue('m7_tier')}
              dataSource={getEffectiveValue('m7_data_source')}
              updatedAt={getEffectiveValue('m7_updated_at')}
              readOnly
              description="Stripe/PayPal标准费率"
            />
            <CostItemRow
              label="平台佣金"
              value={`${((getEffectiveValue('m7_platform_commission_rate') || 0) * 100).toFixed(1)}%`}
              tier={getEffectiveValue('m7_tier')}
              dataSource={getEffectiveValue('m7_data_source')}
              updatedAt={getEffectiveValue('m7_updated_at')}
              readOnly
            />
          </ModuleCard>

          <ModuleCard
            moduleId="m8"
            title="M8: 运营管理（Operations & Management）"
            expanded={state.expandedSections.m8}
            onToggle={() => toggleSection('m8')}
            total={m8Total}
          >
            <CostItemRow
              label="本地人力与行政 (G&A)"
              value={`${((getEffectiveValue('m8_ga_rate') || 0) * 100).toFixed(1)}%`}
              tier={getEffectiveValue('m8_tier')}
              dataSource={getEffectiveValue('m8_data_source')}
              updatedAt={getEffectiveValue('m8_updated_at')}
              isOverridden={isOverridden('m8_ga_rate')}
              onEdit={(val) => setUserOverride('m8_ga_rate', val / 100)}
              mode={state.mode}
              description={getEffectiveValue('m8_notes')}
            />
          </ModuleCard>
        </div>
      )}
    </div>
  );
}

/**
 * M4模块（货物税费）- 最复杂的模块
 * Day 17 Part 2 增强版：物流模式切换 + 关税解锁 + VAT分解 + 数据溯源
 */
function M4Module({ state, toggleSection, getEffectiveValue, isOverridden, setUserOverride, project, logistics, total }: any) {
  const [logisticsMode, setLogisticsMode] = useState<'sea' | 'air'>('air');
  const [tariffUnlocked, setTariffUnlocked] = useState(false);

  const cogsUsd = project.scope?.productInfo?.cogs || 0;
  const productWeight = project.scope?.productInfo?.weight || 0;

  // 物流成本：根据选择的模式计算
  const seaFreightRate = logistics?.sea_freight?.usd_per_kg || 0;
  const airFreightRate = logistics?.air_freight?.usd_per_kg || 0;
  const selectedFreightRate = logisticsMode === 'sea' ? seaFreightRate : airFreightRate;
  const logisticsCost = selectedFreightRate * productWeight;

  // 关税成本
  const tariffRate = getEffectiveValue('m4_effective_tariff_rate') || 0;
  const tariffCost = cogsUsd * tariffRate;

  // VAT成本：CIF Value = COGS + Logistics + Tariff
  const cifValue = cogsUsd + logisticsCost + tariffCost;
  const vatRate = getEffectiveValue('m4_vat_rate') || 0;
  const vatBase = cifValue; // VAT Base = CIF Value
  const vatCost = vatBase * vatRate;

  // 数据溯源信息
  const tariffDataSource = getEffectiveValue('m4_tariff_data_source') || '数据库预设';
  const tariffUpdatedAt = getEffectiveValue('m4_tariff_updated_at') || '2025-Q1';
  const vatDataSource = getEffectiveValue('m4_vat_data_source') || '数据库预设';
  const logisticsDataSource = getEffectiveValue('m4_logistics_data_source') || '数据库预设';

  // HS编码（如有）
  const hsCode = getEffectiveValue('m4_hs_code') || null;

  return (
    <ModuleCard
      moduleId="m4"
      title="M4: 货物税费（Goods & Tax）"
      expanded={state.expandedSections.m4}
      onToggle={() => toggleSection('m4')}
      total={total}
    >
      {/* COGS */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">📦</span>
          <h4 className="font-semibold text-gray-900">商品成本 (COGS)</h4>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-gray-900">${cogsUsd.toFixed(2)}</span>
          <span className="text-sm text-gray-600">USD/单位（来自Step 1）</span>
        </div>
      </div>

      {/* 头程物流 - 增强版（海运/空运切换）*/}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚢</span>
            <h4 className="font-semibold text-gray-900">头程物流</h4>
            <TierBadgeWithTooltip
              tier={getEffectiveValue('m4_logistics_tier')}
              dataSource={logisticsDataSource}
              updatedAt={tariffUpdatedAt}
            />
          </div>
        </div>

        {/* 物流模式切换器 */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setLogisticsMode('sea')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              logisticsMode === 'sea'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-transparent text-gray-600 hover:bg-gray-200'
            }`}
          >
            🚢 海运 (${seaFreightRate.toFixed(2)}/kg)
          </button>
          <button
            onClick={() => setLogisticsMode('air')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              logisticsMode === 'air'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-transparent text-gray-600 hover:bg-gray-200'
            }`}
          >
            ✈️ 空运 (${airFreightRate.toFixed(2)}/kg)
          </button>
        </div>

        {/* 物流计算公式可视化 */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">运费计算</span>
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
              {logisticsMode === 'sea' ? '海运模式' : '空运模式'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-lg">
            <span className="font-bold text-blue-600">${selectedFreightRate.toFixed(2)}</span>
            <span className="text-gray-400">×</span>
            <span className="font-bold text-gray-900">{productWeight} kg</span>
            <span className="text-gray-400">=</span>
            <span className="font-bold text-green-600 text-xl">${logisticsCost.toFixed(2)}</span>
            <span className="text-sm text-gray-500">/单位</span>
          </div>
        </div>
      </div>

      {/* 进口关税 - 增强版（解锁功能）*/}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">💰</span>
            <h4 className="font-semibold text-gray-900">进口关税</h4>
            <TierBadgeWithTooltip
              tier={getEffectiveValue('m4_tariff_tier')}
              dataSource={tariffDataSource}
              updatedAt={tariffUpdatedAt}
            />
          </div>
          {/* 解锁按钮（专家模式）*/}
          {state.mode === 'expert' && !tariffUnlocked && (
            <button
              onClick={() => setTariffUnlocked(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium"
            >
              <Lock className="h-3 w-3" />
              解锁编辑
            </button>
          )}
          {tariffUnlocked && (
            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
              🔓 已解锁
            </span>
          )}
        </div>

        {/* HS编码（如有）*/}
        {hsCode && (
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">HS编码</span>
              <span className="font-mono text-sm font-bold text-gray-900">{hsCode}</span>
            </div>
          </div>
        )}

        {/* 关税税率（可解锁编辑）*/}
        <CostItemRow
          label="有效关税税率"
          value={`${(tariffRate * 100).toFixed(1)}%`}
          tier={getEffectiveValue('m4_tariff_tier')}
          isOverridden={isOverridden('m4_effective_tariff_rate')}
          onEdit={tariffUnlocked ? (val) => setUserOverride('m4_effective_tariff_rate', val / 100) : undefined}
          mode={tariffUnlocked ? 'expert' : 'quick'}
          description={getEffectiveValue('m4_tariff_notes')}
          warning={tariffRate > 0.3}
        />

        {/* 关税计算公式可视化 */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">关税计算</span>
            {isOverridden('m4_effective_tariff_rate') && (
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                用户自定义
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-lg">
            <span className="font-bold text-gray-900">${cogsUsd.toFixed(2)}</span>
            <span className="text-gray-400">×</span>
            <span className="font-bold text-blue-600">{(tariffRate * 100).toFixed(1)}%</span>
            <span className="text-gray-400">=</span>
            <span className="font-bold text-green-600 text-xl">${tariffCost.toFixed(2)}</span>
            <span className="text-sm text-gray-500">/单位</span>
          </div>
        </div>
      </div>

      {/* 增值税 - 增强版（三层分解）*/}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          <h4 className="font-semibold text-gray-900">增值税 (VAT)</h4>
          <TierBadgeWithTooltip
            tier={getEffectiveValue('m4_vat_tier')}
            dataSource={vatDataSource}
            updatedAt={tariffUpdatedAt}
          />
        </div>

        {/* VAT三层明细 */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200 space-y-3">
          {/* 第一层：CIF Value */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">① CIF Value（到岸价）</span>
              <span className="text-sm font-bold text-gray-900">${cifValue.toFixed(2)}</span>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>COGS</span>
                <span>${cogsUsd.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>+ 头程物流</span>
                <span>${logisticsCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>+ 进口关税</span>
                <span>${tariffCost.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* 第二层：VAT Base */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">② VAT Base（计税基础）</span>
              <span className="text-sm font-bold text-gray-900">${vatBase.toFixed(2)}</span>
            </div>
            <div className="text-xs text-gray-500">
              = CIF Value = ${cifValue.toFixed(2)}
            </div>
          </div>

          {/* 第三层：VAT Cost */}
          <div className="bg-white border-2 border-purple-300 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">③ VAT Cost（增值税）</span>
              <span className="text-sm px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                {(vatRate * 100).toFixed(1)}% 税率
              </span>
            </div>
            <div className="flex items-center gap-2 text-lg">
              <span className="font-bold text-gray-900">${vatBase.toFixed(2)}</span>
              <span className="text-gray-400">×</span>
              <span className="font-bold text-purple-600">{(vatRate * 100).toFixed(1)}%</span>
              <span className="text-gray-400">=</span>
              <span className="font-bold text-green-600 text-xl">${vatCost.toFixed(2)}</span>
              <span className="text-sm text-gray-500">/单位</span>
            </div>
          </div>

          {/* VAT备注 */}
          {getEffectiveValue('m4_vat_notes') && (
            <div className="text-xs text-gray-600 bg-white/50 rounded p-2">
              💡 {getEffectiveValue('m4_vat_notes')}
            </div>
          )}
        </div>
      </div>
    </ModuleCard>
  );
}

/**
 * 模块卡片组件（可折叠）
 */
function ModuleCard({ moduleId, title, expanded, onToggle, total, children }: any) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          {expanded ? <ChevronDown className="h-4 w-4 text-gray-600" /> : <ChevronRight className="h-4 w-4 text-gray-600" />}
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        <span className="text-sm font-semibold text-gray-700">
          {moduleId.startsWith('m') && moduleId <= 'm3' ? `$${total.toLocaleString()} USD` : `$${total.toFixed(2)}/单位`}
        </span>
      </button>
      {expanded && <div className="p-4 space-y-3 bg-white">{children}</div>}
    </div>
  );
}

/**
 * 成本项行组件 - Day 17 Part 3增强版（全局Tier徽章）
 */
function CostItemRow({
  label,
  value,
  unit,
  tier,
  dataSource,
  updatedAt,
  readOnly,
  isOverridden,
  onEdit,
  mode,
  description,
  warning,
}: {
  label: string;
  value: any;
  unit?: string;
  tier?: string;
  dataSource?: string;
  updatedAt?: string;
  readOnly?: boolean;
  isOverridden?: boolean;
  onEdit?: (value: any) => void;
  mode?: 'quick' | 'expert';
  description?: string;
  warning?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    if (onEdit) {
      onEdit(parseFloat(tempValue) || 0);
    }
    setEditing(false);
  };

  const canEdit = mode === 'expert' && !readOnly && onEdit;

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg ${isOverridden ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-900">{label}</span>
          {tier && (
            <TierBadgeWithTooltip
              tier={tier}
              dataSource={dataSource}
              updatedAt={updatedAt}
            />
          )}
          {isOverridden && (
            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">已自定义</span>
          )}
          {warning && <AlertCircle className="h-4 w-4 text-red-500" />}
        </div>
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="any"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-32 px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            {unit && <span className="text-sm text-gray-600">{unit}</span>}
            <button onClick={handleSave} className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
              <Check className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {unit && <span className="text-sm text-gray-600">{unit}</span>}
            {canEdit && (
              <button
                onClick={() => {
                  setTempValue(value);
                  setEditing(true);
                }}
                className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center gap-1"
              >
                <Edit2 className="h-3 w-3" />
                自定义
              </button>
            )}
          </div>
        )}
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>
    </div>
  );
}

/**
 * 实时成本预览面板（简化版 - Step 2快速反馈）
 *
 * 设计原则：
 * - Step 2预览 = 快速反馈（只显示核心指标）
 * - Step 3建模 = 完整分析（详细拆解 + 可视化）
 *
 * 简化内容（从322行→120行）：
 * - ✅ 保留：单位成本/收入/毛利
 * - ✅ 保留：毛利率大卡片
 * - ✅ 保留：盈利状态提示
 * - ❌ 移除：OPEX模块分布图（留给Step3）
 * - ❌ 移除：CAPEX回本周期详情（留给Step3）
 * - ❌ 移除：详细优化建议列表（留给Step3）
 */
function CostPreviewPanel({ project, costResult, state }: any) {
  const sellingPrice = project.scope?.productInfo?.targetPrice || 0;
  const unitCost = costResult?.opex?.total || 0;
  const grossProfit = sellingPrice - unitCost;
  const grossMargin = sellingPrice > 0 ? (grossProfit / sellingPrice) * 100 : 0;

  const isProfitable = grossProfit > 0;
  const isWarning = grossMargin < 20 && grossMargin > 0;

  return (
    <div className="sticky top-6">
      {/* 主卡片 - Liquid Glass设计 */}
      <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 rounded-2xl border-2 border-blue-200/60 shadow-2xl backdrop-blur-sm p-6 space-y-6">
        {/* 标题栏 */}
        <div className="flex items-center gap-2 pb-4 border-b-2 border-gradient-to-r from-blue-200 to-indigo-200">
          <Calculator className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700">
            💡 实时成本预览
          </h3>
          <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full ml-auto font-semibold">
            ⚡ 实时计算
          </span>
        </div>

        {/* 核心指标 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-200">
            <span className="text-sm font-medium text-gray-700">单位收入</span>
            <span className="text-xl font-bold text-gray-900">${sellingPrice.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-200">
            <span className="text-sm font-medium text-gray-700">单位成本</span>
            <span className="text-xl font-bold text-gray-900">${unitCost.toFixed(2)}</span>
          </div>

          {/* 毛利进度条 */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-900">单位毛利</span>
              <div className="flex items-center gap-2">
                {isProfitable ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-2xl font-black ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                  ${Math.abs(grossProfit).toFixed(2)}
                </span>
              </div>
            </div>

            {/* 成本占比进度条 */}
            <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`absolute left-0 top-0 h-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                  isProfitable
                    ? 'bg-gradient-to-r from-green-400 to-green-600 text-white'
                    : 'bg-gradient-to-r from-red-400 to-red-600 text-white'
                }`}
                style={{ width: `${Math.min((unitCost / sellingPrice) * 100, 100)}%` }}
              >
                成本 {((unitCost / sellingPrice) * 100).toFixed(0)}%
              </div>
              {isProfitable && (
                <div
                  className="absolute right-0 top-0 h-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center text-xs font-bold text-blue-900"
                  style={{ width: `${Math.max(grossMargin, 0)}%` }}
                >
                  利润 {grossMargin.toFixed(0)}%
                </div>
              )}
            </div>
          </div>

          {/* 毛利率大卡片 */}
          <div className={`p-4 rounded-xl text-center ${
            isProfitable
              ? isWarning
                ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300'
                : 'bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300'
              : 'bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300'
          }`}>
            <div className="text-xs font-semibold text-gray-600 mb-1">毛利率</div>
            <div className={`text-5xl font-black ${
              isProfitable ? (isWarning ? 'text-yellow-600' : 'text-green-600') : 'text-red-600'
            }`}>
              {grossMargin.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* OPEX构成快览（M4-M8简化金额）*/}
        {costResult?.opex && (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border-2 border-gray-200 p-4 space-y-2">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              OPEX构成（单位成本）
            </h4>
            <div className="space-y-1.5">
              {/* M4 货物税费（使用汇总字段或兼容字段） */}
              {(costResult.opex.m4_goodsTax !== undefined || (costResult.opex.m4_cogs !== undefined)) && (
                <div className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-gray-600 font-medium">M4 货物税费</span>
                  <span className="font-bold text-gray-900">
                    ${(costResult.opex.m4_goodsTax ??
                       ((costResult.opex.m4_cogs || 0) + (costResult.opex.m4_tariff || 0) + (costResult.opex.m4_logistics || 0) + (costResult.opex.m4_vat || 0))).toFixed(2)}
                  </span>
                </div>
              )}
              {/* M5 物流配送（使用兼容字段或子项相加） */}
              {(costResult.opex.m5_logistics !== undefined || costResult.opex.m5_last_mile !== undefined) && (
                <div className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-gray-600 font-medium">M5 物流配送</span>
                  <span className="font-bold text-gray-900">
                    ${(typeof costResult.opex.m5_logistics === 'number'
                       ? costResult.opex.m5_logistics
                       : ((costResult.opex.m5_last_mile || 0) + (costResult.opex.m5_return || 0))).toFixed(2)}
                  </span>
                </div>
              )}
              {/* M6 营销获客 */}
              {costResult.opex.m6_marketing !== undefined && (
                <div className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-gray-600 font-medium">M6 营销获客</span>
                  <span className="font-bold text-gray-900">${costResult.opex.m6_marketing.toFixed(2)}</span>
                </div>
              )}
              {/* M7 支付手续费（payment + commission） */}
              {costResult.opex.m7_payment !== undefined && (
                <div className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-gray-600 font-medium">M7 支付手续费</span>
                  <span className="font-bold text-gray-900">
                    ${(costResult.opex.m7_payment + (costResult.opex.m7_platform_commission || 0)).toFixed(2)}
                  </span>
                </div>
              )}
              {/* M8 运营管理（使用兼容字段或m8_ga） */}
              {(costResult.opex.m8_operations !== undefined || costResult.opex.m8_ga !== undefined) && (
                <div className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-gray-600 font-medium">M8 运营管理</span>
                  <span className="font-bold text-gray-900">
                    ${(typeof costResult.opex.m8_operations === 'number'
                       ? costResult.opex.m8_operations
                       : costResult.opex.m8_ga).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs py-2 px-2 rounded-lg bg-gray-100 border-t-2 border-gray-300 mt-2">
                <span className="text-gray-800 font-bold">OPEX总计</span>
                <span className="font-black text-gray-900">${costResult.opex.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* 状态提示 + 下一步引导 */}
        {!isProfitable && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-xl p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-red-900 mb-1">❌ 严重亏损</h4>
                <p className="text-xs text-red-800 mb-2">
                  当前定价下单位亏损 ${Math.abs(grossProfit).toFixed(2)}
                </p>
                <p className="text-xs text-red-700">
                  建议提高售价至 <span className="font-bold">${(unitCost / 0.7).toFixed(2)}+</span> 或优化成本参数
                </p>
              </div>
            </div>
          </div>
        )}

        {isProfitable && isWarning && (
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-xl p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-yellow-900 mb-1">⚠️ 利润偏低</h4>
                <p className="text-xs text-yellow-800 mb-2">
                  毛利率 {grossMargin.toFixed(1)}% 低于行业健康水平（20%+）
                </p>
                <p className="text-xs text-yellow-700">
                  点击「下一步」查看详细成本拆解和优化建议
                </p>
              </div>
            </div>
          </div>
        )}

        {isProfitable && !isWarning && (
          <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-green-900 mb-1">✅ 健康盈利</h4>
                <p className="text-xs text-green-800 mb-2">
                  成本结构合理，毛利率 {grossMargin.toFixed(1)}% 达标
                </p>
                <p className="text-xs text-green-700">
                  点击「下一步」查看完整成本建模报告
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 引导说明 */}
        <div className="bg-blue-50/50 rounded-lg p-3 border border-blue-200">
          <p className="text-xs text-blue-800 flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <span>
              完整的OPEX/CAPEX详细拆解、可视化图表和优化建议请查看 <span className="font-bold">Step 3: 成本建模</span>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * 辅助函数：获取国家中文名称
 */
function getCountryName(code: TargetCountry): string {
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

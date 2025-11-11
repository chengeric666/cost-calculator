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

  // 模拟从数据库加载成本因子数据（MVP 2.0将从Appwrite加载）
  useEffect(() => {
    // TODO: 从Appwrite cost_factors表加载数据
    // const factor = await getCostFactor(project.targetCountry, project.industry);
    // setState(prev => ({ ...prev, costFactor: factor }));

    // 临时使用Mock数据
    const mockCostFactor: Partial<CostFactor> = {
      country: project.targetCountry as TargetCountry,
      country_name_cn: getCountryName(project.targetCountry as TargetCountry),
      industry: project.industry as Industry,
      version: '2025Q1',

      // M1
      m1_regulatory_agency: 'FDA, APHIS',
      m1_complexity: '高',
      m1_estimated_cost_usd: 5000,
      m1_tier: 'tier2_authoritative',

      // M2
      m2_certifications_required: 'AAFCO认证、FDA合规',
      m2_estimated_cost_usd: 3000,
      m2_tier: 'tier2_authoritative',

      // M3
      m3_packaging_rate: 0.02,
      m3_initial_inventory_usd: 10000,
      m3_warehouse_deposit_usd: 5000,
      m3_tier: 'tier2_authoritative',

      // M4
      m4_effective_tariff_rate: 0.55,
      m4_tariff_notes: '10%互惠关税 + 25% Section 301 + 20%附加',
      m4_tariff_tier: 'tier1_official',
      m4_vat_rate: 0.06,
      m4_vat_notes: '州税差异，范围0-10%+',
      m4_vat_tier: 'tier1_official',
      m4_logistics: JSON.stringify({
        sea_freight: {
          usd_per_kg: 0.14,
          transit_days_min: 15,
          transit_days_max: 25,
          data_source: 'tier2',
        },
        air_freight: {
          usd_per_kg: 4.5,
          transit_days_min: 3,
          transit_days_max: 7,
          data_source: 'tier2',
        },
      }),
      m4_logistics_tier: 'tier2_authoritative',

      // M5
      m5_last_mile_delivery_usd: 7.5,
      m5_return_rate: 0.10,
      m5_return_cost_rate: 0.30,
      m5_tier: 'tier2_authoritative',

      // M6
      m6_marketing_rate: 0.15,
      m6_notes: 'ACOS 20-40%, ACOAS 15-20%行业均值',
      m6_tier: 'tier2_authoritative',

      // M7
      m7_payment_rate: 0.029,
      m7_payment_fixed_usd: 0.30,
      m7_platform_commission_rate: 0.15,
      m7_notes: 'Stripe/PayPal标准费率 + Amazon佣金',
      m7_tier: 'tier1_official',

      // M8
      m8_ga_rate: 0.03,
      m8_notes: '本地客服等运营人员成本',
      m8_tier: 'tier2_authoritative',
    };

    setState((prev) => ({ ...prev, costFactor: mockCostFactor as CostFactor }));
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
              readOnly
            />
            <CostItemRow
              label="合规复杂度"
              value={getEffectiveValue('m1_complexity')}
              tier={getEffectiveValue('m1_tier')}
              readOnly
            />
            <CostItemRow
              label="预估准入成本"
              value={getEffectiveValue('m1_estimated_cost_usd')}
              unit="USD"
              tier={getEffectiveValue('m1_tier')}
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
              readOnly
            />
            <CostItemRow
              label="预估认证成本"
              value={getEffectiveValue('m2_estimated_cost_usd')}
              unit="USD"
              tier={getEffectiveValue('m2_tier')}
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
              readOnly
              description={`计算: $${project.scope?.productInfo?.targetPrice || 0} × ${((getEffectiveValue('m3_packaging_rate') || 0) * 100).toFixed(1)}% = $${((project.scope?.productInfo?.targetPrice || 0) * (getEffectiveValue('m3_packaging_rate') || 0)).toFixed(2)}/单位`}
            />
            <CostItemRow
              label="初始库存投资"
              value={getEffectiveValue('m3_initial_inventory_usd')}
              unit="USD"
              tier={getEffectiveValue('m3_tier')}
              isOverridden={isOverridden('m3_initial_inventory_usd')}
              onEdit={(val) => setUserOverride('m3_initial_inventory_usd', val)}
              mode={state.mode}
            />
            <CostItemRow
              label="仓储押金"
              value={getEffectiveValue('m3_warehouse_deposit_usd')}
              unit="USD"
              tier={getEffectiveValue('m3_tier')}
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
              isOverridden={isOverridden('m5_last_mile_delivery_usd')}
              onEdit={(val) => setUserOverride('m5_last_mile_delivery_usd', val)}
              mode={state.mode}
            />
            <CostItemRow
              label="退货率"
              value={`${((getEffectiveValue('m5_return_rate') || 0) * 100).toFixed(1)}%`}
              tier={getEffectiveValue('m5_tier')}
              readOnly
            />
            <CostItemRow
              label="退货处理成本率"
              value={`${((getEffectiveValue('m5_return_cost_rate') || 0) * 100).toFixed(1)}%`}
              tier={getEffectiveValue('m5_tier')}
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
              readOnly
              description="Stripe/PayPal标准费率"
            />
            <CostItemRow
              label="平台佣金"
              value={`${((getEffectiveValue('m7_platform_commission_rate') || 0) * 100).toFixed(1)}%`}
              tier={getEffectiveValue('m7_tier')}
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
 */
function M4Module({ state, toggleSection, getEffectiveValue, isOverridden, setUserOverride, project, logistics, total }: any) {
  const cogsUsd = project.scope?.productInfo?.cogs || 0;
  const productWeight = project.scope?.productInfo?.weight || 0;
  const logisticsCost = logistics ? logistics.air_freight.usd_per_kg * productWeight : 0;
  const tariffCost = cogsUsd * (getEffectiveValue('m4_effective_tariff_rate') || 0);
  const vatCost = (cogsUsd + logisticsCost + tariffCost) * (getEffectiveValue('m4_vat_rate') || 0);

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
          <span className="text-sm text-gray-600">USD/单位（用户输入）</span>
        </div>
      </div>

      {/* 头程物流 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">🚢</span>
          <h4 className="font-semibold text-gray-900">头程物流</h4>
        </div>
        <CostItemRow
          label="运输方式"
          value="空运"
          tier={getEffectiveValue('m4_logistics_tier')}
          readOnly
        />
        <CostItemRow
          label="空运费率"
          value={`$${logistics?.air_freight.usd_per_kg}/kg`}
          tier={getEffectiveValue('m4_logistics_tier')}
          readOnly
        />
        <CostItemRow
          label="产品重量"
          value={`${productWeight} kg`}
          readOnly
        />
        <div className="bg-gray-50 rounded p-3 text-sm text-gray-700">
          计算: ${logistics?.air_freight.usd_per_kg} × {productWeight} kg = <span className="font-bold">${logisticsCost.toFixed(2)}/单位</span>
        </div>
      </div>

      {/* 进口关税 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">💰</span>
          <h4 className="font-semibold text-gray-900">进口关税</h4>
        </div>
        <CostItemRow
          label="关税税率"
          value={`${((getEffectiveValue('m4_effective_tariff_rate') || 0) * 100).toFixed(1)}%`}
          tier={getEffectiveValue('m4_tariff_tier')}
          isOverridden={isOverridden('m4_effective_tariff_rate')}
          onEdit={(val) => setUserOverride('m4_effective_tariff_rate', val / 100)}
          mode={state.mode}
          description={getEffectiveValue('m4_tariff_notes')}
          warning={(getEffectiveValue('m4_effective_tariff_rate') || 0) > 0.3}
        />
        <div className="bg-gray-50 rounded p-3 text-sm text-gray-700">
          计算: ${cogsUsd.toFixed(2)} × {((getEffectiveValue('m4_effective_tariff_rate') || 0) * 100).toFixed(1)}% = <span className="font-bold">${tariffCost.toFixed(2)}/单位</span>
        </div>
      </div>

      {/* 增值税 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          <h4 className="font-semibold text-gray-900">增值税 (VAT)</h4>
        </div>
        <CostItemRow
          label="VAT税率"
          value={`${((getEffectiveValue('m4_vat_rate') || 0) * 100).toFixed(1)}%`}
          tier={getEffectiveValue('m4_vat_tier')}
          readOnly
          description={getEffectiveValue('m4_vat_notes')}
        />
        <div className="bg-gray-50 rounded p-3 text-sm text-gray-700">
          计算: (${cogsUsd.toFixed(2)} + ${logisticsCost.toFixed(2)} + ${tariffCost.toFixed(2)}) × {((getEffectiveValue('m4_vat_rate') || 0) * 100).toFixed(1)}% = <span className="font-bold">${vatCost.toFixed(2)}/单位</span>
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
 * 成本项行组件
 */
function CostItemRow({
  label,
  value,
  unit,
  tier,
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
          {tier && <TierBadge tier={tier} />}
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
 * 实时成本预览面板（MVP 2.0增强版）
 */
function CostPreviewPanel({ project, costResult, state }: any) {
  const sellingPrice = project.scope?.productInfo?.targetPrice || 0;
  const unitCost = costResult?.opex?.total || 0;
  const grossProfit = sellingPrice - unitCost;
  const grossMargin = sellingPrice > 0 ? (grossProfit / sellingPrice) * 100 : 0;

  const isProfitable = grossProfit > 0;
  const isWarning = grossMargin < 20;

  // OPEX模块分布 - 从细分字段重新计算（⚠️ 修复：opex.modules不存在）
  const opexBreakdown = costResult?.opex ? {
    m4: (costResult.opex.m4_cogs || 0) +
        (costResult.opex.m4_tariff || 0) +
        (costResult.opex.m4_logistics || 0) +
        (costResult.opex.m4_vat || 0),
    m5: (costResult.opex.m5_last_mile || 0) +
        (costResult.opex.m5_return || 0),
    m6: costResult.opex.m6_marketing || 0,
    m7: (costResult.opex.m7_payment || 0) +
        (costResult.opex.m7_platform_commission || 0),
    m8: costResult.opex.m8_ga || 0,
  } : {
    m4: 0,
    m5: 0,
    m6: 0,
    m7: 0,
    m8: 0,
  };

  // CAPEX + 回本周期
  const capexTotal = costResult?.capex?.total || 0;
  const monthlyVolume = (project.scope as any)?.productInfo?.monthlyVolume || 0;
  const monthlyProfit = grossProfit * monthlyVolume;
  const paybackPeriod = monthlyProfit > 0 ? capexTotal / monthlyProfit : 0;

  return (
    <div className="sticky top-6 space-y-4">
      {/* 主卡片 - Liquid Glass设计 */}
      <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 rounded-2xl border-2 border-blue-200/60 shadow-2xl backdrop-blur-sm p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b-2 border-gradient-to-r from-blue-200 to-indigo-200">
          <Calculator className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700">
            实时成本预览
          </h3>
          <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full ml-auto font-semibold">
            ⚡ 实时计算
          </span>
        </div>

        {/* 单位经济模型 */}
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

        {/* 状态提示 */}
        {!isProfitable && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-xl p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-red-900 mb-1">❌ 严重亏损</h4>
                <p className="text-xs text-red-800">当前定价下该市场不可行，单位亏损 ${Math.abs(grossProfit).toFixed(2)}</p>
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
                <p className="text-xs text-yellow-800">毛利率低于20%，建议优化成本结构</p>
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
                <p className="text-xs text-green-800">成本结构合理，毛利率达标</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* OPEX模块分布卡片 */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-5 space-y-4">
        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <span className="text-lg">📊</span>
          OPEX成本分布
        </h4>

        <div className="space-y-2">
          {/* M4 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">M4 货物税费</span>
              <span className="text-xs font-bold text-gray-900">${(opexBreakdown.m4 || 0).toFixed(2)}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                style={{ width: `${unitCost > 0 ? ((opexBreakdown.m4 || 0) / unitCost) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* M5 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">M5 物流配送</span>
              <span className="text-xs font-bold text-gray-900">${(opexBreakdown.m5 || 0).toFixed(2)}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600"
                style={{ width: `${unitCost > 0 ? ((opexBreakdown.m5 || 0) / unitCost) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* M6 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">M6 营销获客</span>
              <span className="text-xs font-bold text-gray-900">${(opexBreakdown.m6 || 0).toFixed(2)}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-purple-600"
                style={{ width: `${unitCost > 0 ? ((opexBreakdown.m6 || 0) / unitCost) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* M7 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">M7 支付手续费</span>
              <span className="text-xs font-bold text-gray-900">${(opexBreakdown.m7 || 0).toFixed(2)}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600"
                style={{ width: `${unitCost > 0 ? ((opexBreakdown.m7 || 0) / unitCost) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* M8 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">M8 运营管理</span>
              <span className="text-xs font-bold text-gray-900">${(opexBreakdown.m8 || 0).toFixed(2)}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-400 to-red-600"
                style={{ width: `${unitCost > 0 ? ((opexBreakdown.m8 || 0) / unitCost) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CAPEX回本周期卡片 */}
      {capexTotal > 0 && (
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-5 space-y-3">
          <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <span className="text-lg">⏱️</span>
            CAPEX回本预测
          </h4>

          <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
            <span className="text-xs text-gray-600">初始投资</span>
            <span className="text-lg font-bold text-blue-700">${capexTotal.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
            <span className="text-xs text-gray-600">月净利润</span>
            <span className="text-lg font-bold text-green-700">${monthlyProfit.toFixed(0)}</span>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 text-center">
            <div className="text-xs font-semibold text-gray-600 mb-1">预计回本周期</div>
            <div className="text-4xl font-black text-purple-700">
              {paybackPeriod > 0 ? paybackPeriod.toFixed(1) : '∞'}
              <span className="text-lg ml-1">月</span>
            </div>
            <div className="text-xs text-purple-600 mt-1">
              {paybackPeriod > 12 ? '⚠️ 回本周期较长' : paybackPeriod > 0 ? '✅ 回本速度良好' : '❌ 无法回本'}
            </div>
          </div>
        </div>
      )}

      {/* 优化建议 */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-5">
        <h4 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
          💡 优化建议
        </h4>
        <ul className="text-xs text-blue-800 space-y-2">
          {!isProfitable && (
            <>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>提高零售价至 <span className="font-bold">${(unitCost / 0.7).toFixed(2)}+</span> 实现30%毛利率</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>选择低成本市场（越南/印尼/泰国）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>优化物流方式（空运改海运节省70%+）</span>
              </li>
            </>
          )}
          {isProfitable && isWarning && (
            <>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>优化供应链降低COGS（目标节省10-15%）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>控制营销费用率（ACOS优化至15%以下）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>提高零售价提升利润空间</span>
              </li>
            </>
          )}
          {isProfitable && !isWarning && (
            <>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>当前成本结构健康，毛利率 {grossMargin.toFixed(1)}%</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>可考虑规模化降低单位成本</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>使用Step 4多市场对比寻找最优市场</span>
              </li>
            </>
          )}
        </ul>
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

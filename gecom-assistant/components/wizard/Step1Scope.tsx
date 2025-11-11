'use client';

/**
 * Step 1: 业务场景定义
 *
 * MVP 2.0设计目标：
 * - 完整产品基本参数（名称、重量、COGS、零售价、月销量）
 * - 19国目标市场选择（动态加载，按大洲分组）
 * - 销售渠道选择（Amazon FBA/Shopee/DTC/O2O等）
 * - 行业模板预填充（Pet Food/Vape典型参数）
 * - 实时表单验证
 */

import { useState, useEffect } from 'react';
import { Project, Industry, TargetCountry, SalesChannel, CostFactor } from '@/types/gecom';
import { Package, Globe, ShoppingCart, AlertCircle, CheckCircle, Truck, Info, Warehouse, Plane, Ship } from 'lucide-react';
import CountrySelector from './components/CountrySelector';

interface Step1ScopeProps {
  project: Partial<Project>;
  onUpdate: (updates: Partial<Project>) => void;
}

interface FormState {
  productName: string;
  productWeightKg: number;
  cogsUsd: number;
  sellingPriceUsd: number;
  monthlyVolume: number;
  targetCountry: TargetCountry;
  salesChannel: SalesChannel;
  fulfillmentMode: 'direct_mail' | 'overseas_warehouse' | 'fba'; // MVP 2.0新增
}

interface FormErrors {
  productName?: string;
  productWeightKg?: string;
  cogsUsd?: string;
  sellingPriceUsd?: string;
  monthlyVolume?: string;
}

// 行业模板预设值
const INDUSTRY_TEMPLATES = {
  pet_food: {
    productName: '天然无谷狗粮 2kg',
    productWeightKg: 2.0,
    cogsUsd: 10.0,
    sellingPriceUsd: 25.0,
    monthlyVolume: 1000,
  },
  vape: {
    productName: '电子烟烟杆套装',
    productWeightKg: 0.2,
    cogsUsd: 5.0,
    sellingPriceUsd: 20.0,
    monthlyVolume: 2000,
  },
};

// Tier徽章组件
function TierBadge({ tier }: { tier?: string }) {
  if (!tier) return null;

  let displayText = 'Tier 3';
  let colorClass = 'bg-gray-100 text-gray-700 border-gray-300';

  if (tier.includes('1') || tier.toLowerCase().includes('official')) {
    displayText = 'Tier 1';
    colorClass = 'bg-green-100 text-green-700 border-green-300';
  } else if (tier.includes('2') || tier.toLowerCase().includes('authoritative')) {
    displayText = 'Tier 2';
    colorClass = 'bg-yellow-100 text-yellow-700 border-yellow-300';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
      {displayText}
    </span>
  );
}

export default function Step1Scope({ project, onUpdate }: Step1ScopeProps) {
  const [formState, setFormState] = useState<FormState>({
    productName: project.scope?.productInfo?.name || '',
    productWeightKg: project.scope?.productInfo?.weight || 0,
    cogsUsd: project.scope?.productInfo?.cogs || 0,
    sellingPriceUsd: project.scope?.productInfo?.targetPrice || 0,
    monthlyVolume: project.scope?.assumptions?.monthlySales || 0,
    targetCountry: project.targetCountry || 'US',
    salesChannel: project.salesChannel || 'amazon_fba',
    fulfillmentMode: 'fba', // MVP 2.0新增默认值
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [useTemplate, setUseTemplate] = useState(true);
  const [selectedCountryData, setSelectedCountryData] = useState<CostFactor | null>(null);

  // 自动加载行业模板
  useEffect(() => {
    if (useTemplate && project.industry) {
      const template = INDUSTRY_TEMPLATES[project.industry as keyof typeof INDUSTRY_TEMPLATES];
      if (template) {
        setFormState(prev => ({
          ...prev,
          ...template,
        }));
      }
    }
  }, [useTemplate, project.industry]);

  // 加载选中国家的成本因子数据（Mock数据）
  useEffect(() => {
    const loadCountryData = async () => {
      if (!formState.targetCountry || !project.industry) {
        setSelectedCountryData(null);
        return;
      }

      try {
        // MVP 2.0: 使用动态导入加载Mock数据
        const countryCode = formState.targetCountry;
        const industry = project.industry;
        const fileName = `${countryCode}-${industry}.ts`;

        // 动态导入 data/cost-factors 文件
        const module = await import(`@/data/cost-factors/${countryCode}-${industry}`);
        const dataKey = `${countryCode}_${industry.toUpperCase().replace('_', '_')}`;
        const data = module[dataKey] || module.default;

        setSelectedCountryData(data);
        console.log(`✅ 加载成本数据: ${countryCode} ${industry}`, data);
      } catch (error) {
        console.warn(`⚠️ 未找到成本数据: ${formState.targetCountry} ${project.industry}`, error);
        setSelectedCountryData(null);
      }
    };

    loadCountryData();
  }, [formState.targetCountry, project.industry]);

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formState.productName.trim()) {
      newErrors.productName = '请输入产品名称';
    }

    if (formState.productWeightKg <= 0) {
      newErrors.productWeightKg = '产品重量必须大于0';
    }

    if (formState.cogsUsd <= 0) {
      newErrors.cogsUsd = '商品成本必须大于0';
    }

    if (formState.sellingPriceUsd <= formState.cogsUsd) {
      newErrors.sellingPriceUsd = '零售价必须大于成本';
    }

    if (formState.monthlyVolume <= 0) {
      newErrors.monthlyVolume = '月销量必须大于0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 更新父组件状态
  const handleUpdate = () => {
    if (!validateForm()) {
      return;
    }

    onUpdate({
      targetCountry: formState.targetCountry,
      salesChannel: formState.salesChannel,
      scope: {
        productInfo: {
          sku: `SKU-${Date.now()}`,
          name: formState.productName,
          category: project.industry === 'pet_food' ? 'Pet Food' : 'Vape',
          weight: formState.productWeightKg,
          cogs: formState.cogsUsd,
          targetPrice: formState.sellingPriceUsd,
        },
        assumptions: {
          monthlySales: formState.monthlyVolume,
          returnRate: 0.08, // 默认8%退货率
        },
      },
    });
  };

  // 实时更新
  useEffect(() => {
    handleUpdate();
  }, [formState]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 标题区域 */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">业务场景定义</h2>
        <p className="text-gray-600">
          定义产品参数、目标市场和销售渠道
        </p>
      </div>

      {/* 行业模板提示 */}
      {useTemplate && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">
              已加载 {project.industry === 'pet_food' ? '宠物食品' : '电子烟'} 行业模板
            </h4>
            <p className="text-sm text-blue-700">
              模板参数已自动填充，你可以根据实际情况修改
            </p>
          </div>
          <button
            onClick={() => setUseTemplate(false)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            清空
          </button>
        </div>
      )}

      {/* 产品基本参数 */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-100">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">产品基本参数</h3>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* 产品名称 */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              产品名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formState.productName}
              onChange={(e) => setFormState({ ...formState, productName: e.target.value })}
              placeholder="例如：益家之宠天然无谷狗粮 2kg"
              className={`
                w-full px-4 py-3 rounded-xl border-2 transition-all
                ${errors.productName ? 'border-red-300' : 'border-gray-200'}
                focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500
              `}
            />
            {errors.productName && (
              <p className="text-sm text-red-600 mt-1">{errors.productName}</p>
            )}
          </div>

          {/* 产品重量 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              产品重量 (kg) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={formState.productWeightKg}
              onChange={(e) => setFormState({ ...formState, productWeightKg: parseFloat(e.target.value) || 0 })}
              className={`
                w-full px-4 py-3 rounded-xl border-2 transition-all
                ${errors.productWeightKg ? 'border-red-300' : 'border-gray-200'}
                focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500
              `}
            />
            {errors.productWeightKg && (
              <p className="text-sm text-red-600 mt-1">{errors.productWeightKg}</p>
            )}
          </div>

          {/* 商品成本 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              商品成本 (COGS) USD/单位 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={formState.cogsUsd}
              onChange={(e) => setFormState({ ...formState, cogsUsd: parseFloat(e.target.value) || 0 })}
              className={`
                w-full px-4 py-3 rounded-xl border-2 transition-all
                ${errors.cogsUsd ? 'border-red-300' : 'border-gray-200'}
                focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500
              `}
            />
            {errors.cogsUsd && (
              <p className="text-sm text-red-600 mt-1">{errors.cogsUsd}</p>
            )}
          </div>

          {/* 目标零售价 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              目标零售价 USD/单位 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={formState.sellingPriceUsd}
              onChange={(e) => setFormState({ ...formState, sellingPriceUsd: parseFloat(e.target.value) || 0 })}
              className={`
                w-full px-4 py-3 rounded-xl border-2 transition-all
                ${errors.sellingPriceUsd ? 'border-red-300' : 'border-gray-200'}
                focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500
              `}
            />
            {errors.sellingPriceUsd && (
              <p className="text-sm text-red-600 mt-1">{errors.sellingPriceUsd}</p>
            )}
            {formState.cogsUsd > 0 && formState.sellingPriceUsd > formState.cogsUsd && (
              <p className="text-sm text-green-600 mt-1">
                毛利率: {(((formState.sellingPriceUsd - formState.cogsUsd) / formState.sellingPriceUsd) * 100).toFixed(1)}%
              </p>
            )}
          </div>

          {/* 预计月销量 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              预计月销量 (单位) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formState.monthlyVolume}
              onChange={(e) => setFormState({ ...formState, monthlyVolume: parseInt(e.target.value) || 0 })}
              className={`
                w-full px-4 py-3 rounded-xl border-2 transition-all
                ${errors.monthlyVolume ? 'border-red-300' : 'border-gray-200'}
                focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500
              `}
            />
            {errors.monthlyVolume && (
              <p className="text-sm text-red-600 mt-1">{errors.monthlyVolume}</p>
            )}
          </div>
        </div>
      </div>

      {/* 目标市场选择 */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-green-100">
            <Globe className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">目标市场选择</h3>
        </div>

        <CountrySelector
          selectedCountry={formState.targetCountry}
          industry={project.industry as Industry}
          onSelect={(country) => setFormState({ ...formState, targetCountry: country })}
        />

        {/* S1.5 数据可用性面板 ⭐ MVP 2.0新增 - 优化版 */}
        {selectedCountryData && (
          <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-300 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                {/* 标题 + 数据来源说明 */}
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-base font-semibold text-blue-900 flex items-center gap-2">
                    ✅ {selectedCountryData.country_flag} {selectedCountryData.country_name_cn} 数据完整
                    <span className="text-xs font-normal text-blue-600">
                      ({selectedCountryData.version || '2025Q1'})
                    </span>
                  </h4>

                  {/* 数据来源说明气泡 */}
                  <div className="group relative">
                    <Info className="h-4 w-4 text-blue-600 cursor-help" />
                    <div className="absolute right-0 top-6 w-64 bg-white border-2 border-blue-200 rounded-lg p-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <p className="text-xs font-semibold text-gray-900 mb-2">数据质量分级说明：</p>
                      <ul className="text-xs text-gray-700 space-y-1">
                        <li><TierBadge tier="tier1_official" /> 官方数据源（政府/海关），100%可信</li>
                        <li><TierBadge tier="tier2_authoritative" /> 权威来源（行业报告），90%可信</li>
                        <li><TierBadge tier="tier3_estimated" /> 估算数据（专家估计），80%可信</li>
                      </ul>
                      <p className="text-xs text-gray-500 mt-2">鼠标悬停在Tier徽章上查看具体来源</p>
                    </div>
                  </div>
                </div>

                {/* 紧凑型3列布局 */}
                <div className="grid grid-cols-3 gap-2">
                  {/* M1 市场准入 - 紧凑版 */}
                  <div className="bg-white rounded p-2 border border-blue-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">M1 准入</span>
                      <TierBadge tier={selectedCountryData.m1_data_source} />
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-semibold text-gray-900">{selectedCountryData.m1_complexity || 'N/A'}</span> 复杂度
                    </div>
                  </div>

                  {/* M4 关税 - 紧凑版 */}
                  <div className="bg-white rounded p-2 border border-blue-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">M4 关税</span>
                      <TierBadge tier={selectedCountryData.m4_tariff_data_source} />
                    </div>
                    <div className="text-xs text-gray-600">
                      税率 <span className="font-bold text-gray-900">{((selectedCountryData.m4_effective_tariff_rate || 0) * 100).toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* M4 VAT - 紧凑版 */}
                  <div className="bg-white rounded p-2 border border-blue-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">M4 VAT</span>
                      <TierBadge tier={selectedCountryData.m4_vat_data_source} />
                    </div>
                    <div className="text-xs text-gray-600">
                      税率 <span className="font-bold text-gray-900">{((selectedCountryData.m4_vat_rate || 0) * 100).toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* M5 配送 - 紧凑版 */}
                  <div className="bg-white rounded p-2 border border-blue-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">M5 配送</span>
                      <TierBadge tier={selectedCountryData.m5_data_source} />
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-bold text-gray-900">${(selectedCountryData.m5_last_mile_delivery_usd || 0).toFixed(1)}</span>/单
                    </div>
                  </div>

                  {/* M6 营销 - 紧凑版 */}
                  <div className="bg-white rounded p-2 border border-blue-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">M6 营销</span>
                      <TierBadge tier={selectedCountryData.m6_data_source} />
                    </div>
                    <div className="text-xs text-gray-600">
                      费率 <span className="font-bold text-gray-900">{((selectedCountryData.m6_marketing_rate || 0) * 100).toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* M7 支付 - 紧凑版 */}
                  <div className="bg-white rounded p-2 border border-blue-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">M7 支付</span>
                      <TierBadge tier={selectedCountryData.m7_data_source} />
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-bold text-gray-900">{((selectedCountryData.m7_payment_rate || 0) * 100).toFixed(1)}%</span> + 佣金
                    </div>
                  </div>
                </div>

                {/* 数据更新信息 */}
                <div className="mt-4 pt-3 border-t border-blue-200">
                  <div className="flex items-center justify-between text-xs text-blue-600">
                    <div className="flex items-center gap-4">
                      <span>📊 数据版本: {selectedCountryData.version || '2025Q1'}</span>
                      {(selectedCountryData as any).m4_tariff_updated_at && (
                        <span>🕐 更新时间: {(selectedCountryData as any).m4_tariff_updated_at}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      <span>完整数据将在下一步展示</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 销售渠道选择 */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-purple-100">
            <ShoppingCart className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">销售渠道</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ChannelCard
            channel="amazon_fba"
            title="Amazon FBA"
            description="亚马逊物流，适合欧美市场"
            selected={formState.salesChannel === 'amazon_fba'}
            onClick={() => setFormState({ ...formState, salesChannel: 'amazon_fba' })}
          />
          <ChannelCard
            channel="shopee"
            title="Shopee"
            description="适合东南亚市场"
            selected={formState.salesChannel === 'shopee'}
            onClick={() => setFormState({ ...formState, salesChannel: 'shopee' })}
          />
          <ChannelCard
            channel="dtc"
            title="独立站 (DTC)"
            description="Shopify自建网站"
            selected={formState.salesChannel === 'dtc'}
            onClick={() => setFormState({ ...formState, salesChannel: 'dtc' })}
          />
          <ChannelCard
            channel="o2o"
            title="线上到线下 (O2O)"
            description="本地零售+配送"
            selected={formState.salesChannel === 'o2o'}
            onClick={() => setFormState({ ...formState, salesChannel: 'o2o' })}
          />
        </div>
      </div>

      {/* S1.8 跨境履约模式选择 ⭐ MVP 2.0新增 */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-indigo-100">
            <Truck className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900">跨境履约模式</h3>
            <p className="text-sm text-gray-600 mt-1">选择跨境物流与仓储方案</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* 直邮模式 */}
          <FulfillmentModeCard
            mode="direct_mail"
            title="直邮模式"
            icon={<Plane className="h-10 w-10 text-indigo-600" />}
            description="从中国直接发货，清关后配送"
            pros={["启动成本低", "库存压力小", "灵活度高"]}
            cons={["物流时间长(7-15天)", "退货成本高"]}
            selected={formState.fulfillmentMode === 'direct_mail'}
            onClick={() => setFormState({ ...formState, fulfillmentMode: 'direct_mail' })}
          />

          {/* 海外仓模式 */}
          <FulfillmentModeCard
            mode="overseas_warehouse"
            title="海外仓模式"
            icon={<Warehouse className="h-10 w-10 text-indigo-600" />}
            description="提前备货至海外仓，本地发货"
            pros={["配送速度快(1-3天)", "用户体验好", "退货方便"]}
            cons={["需要资金投入", "库存管理复杂", "仓储费用"]}
            selected={formState.fulfillmentMode === 'overseas_warehouse'}
            onClick={() => setFormState({ ...formState, fulfillmentMode: 'overseas_warehouse' })}
          />

          {/* FBA模式 */}
          <FulfillmentModeCard
            mode="fba"
            title="FBA模式"
            icon={<Ship className="h-10 w-10 text-indigo-600" />}
            description="Amazon仓储物流全托管"
            pros={["Prime配送加持", "仓储托管省心", "Buy Box优势"]}
            cons={["费用较高", "依赖平台", "限制较多"]}
            selected={formState.fulfillmentMode === 'fba'}
            onClick={() => setFormState({ ...formState, fulfillmentMode: 'fba' })}
            recommended={formState.salesChannel === 'amazon_fba'}
          />
        </div>

        {/* 智能推荐提示 */}
        {formState.salesChannel === 'amazon_fba' && formState.fulfillmentMode !== 'fba' && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-yellow-900 mb-1">💡 智能推荐</h4>
              <p className="text-sm text-yellow-700">
                您选择了Amazon FBA渠道，建议使用<strong>"FBA模式"</strong>以获得Prime配送和Buy Box优势
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ChannelCard({
  channel,
  title,
  description,
  selected,
  onClick,
}: {
  channel: string;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        text-left p-6 rounded-xl border-2 transition-all duration-200
        ${selected
          ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
        }
      `}
    >
      <div className="font-semibold text-gray-900 mb-1">{title}</div>
      <div className="text-sm text-gray-600">{description}</div>
    </button>
  );
}

function FulfillmentModeCard({
  mode,
  title,
  icon,
  description,
  pros,
  cons,
  selected,
  onClick,
  recommended,
}: {
  mode: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  pros: string[];
  cons: string[];
  selected: boolean;
  onClick: () => void;
  recommended?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        relative text-left p-6 rounded-xl border-2 transition-all duration-200
        ${selected
          ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-blue-50 shadow-xl scale-105'
          : 'border-gray-200 bg-white hover:border-indigo-200 hover:shadow-lg'
        }
      `}
    >
      {recommended && (
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300">
            ⭐ 推荐
          </span>
        </div>
      )}

      <div className="flex flex-col items-center mb-4">
        <div className={`p-3 rounded-xl ${selected ? 'bg-indigo-100' : 'bg-gray-100'} transition-colors`}>
          {icon}
        </div>
        <h4 className="font-bold text-lg text-gray-900 mt-3">{title}</h4>
        <p className="text-sm text-gray-600 text-center mt-1">{description}</p>
      </div>

      <div className="space-y-3">
        {/* 优势 */}
        <div>
          <div className="text-xs font-semibold text-green-700 mb-1.5 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            优势:
          </div>
          <ul className="space-y-1">
            {pros.map((pro, idx) => (
              <li key={idx} className="text-xs text-gray-700 flex items-start gap-1">
                <span className="text-green-600 flex-shrink-0">•</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 劣势 */}
        <div>
          <div className="text-xs font-semibold text-red-700 mb-1.5 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            挑战:
          </div>
          <ul className="space-y-1">
            {cons.map((con, idx) => (
              <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                <span className="text-red-500 flex-shrink-0">•</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </button>
  );
}

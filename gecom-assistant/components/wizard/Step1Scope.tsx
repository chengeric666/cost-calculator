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
import { Project, Industry, TargetCountry, SalesChannel } from '@/types/gecom';
import { Package, Globe, ShoppingCart, AlertCircle } from 'lucide-react';
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

export default function Step1Scope({ project, onUpdate }: Step1ScopeProps) {
  const [formState, setFormState] = useState<FormState>({
    productName: project.scope?.productInfo?.name || '',
    productWeightKg: project.scope?.productInfo?.weight || 0,
    cogsUsd: project.scope?.productInfo?.cogs || 0,
    sellingPriceUsd: project.scope?.productInfo?.targetPrice || 0,
    monthlyVolume: project.scope?.assumptions?.monthlySales || 0,
    targetCountry: project.targetCountry || 'US',
    salesChannel: project.salesChannel || 'amazon_fba',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [useTemplate, setUseTemplate] = useState(true);

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

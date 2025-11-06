'use client';

import { Project } from '@/types/gecom';
import { Package, DollarSign, TrendingUp } from 'lucide-react';

interface Step2DataCollectionProps {
  project: Partial<Project>;
  onUpdate: (updates: Partial<Project>) => void;
}

export default function Step2DataCollection({ project, onUpdate }: Step2DataCollectionProps) {
  const handleProductUpdate = (field: string, value: any) => {
    onUpdate({
      scope: {
        ...project.scope!,
        productInfo: {
          ...project.scope!.productInfo,
          [field]: value,
        },
      },
    });
  };

  const handleAssumptionsUpdate = (field: string, value: any) => {
    onUpdate({
      scope: {
        ...project.scope!,
        assumptions: {
          ...project.scope!.assumptions,
          [field]: value,
        },
      },
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">数据采集与验证</h2>
        <p className="text-gray-600">
          提供详细的产品和业务信息以实现精确的成本计算
        </p>
      </div>

      {/* Product information */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Package className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">产品信息</h3>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              产品名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={project.scope?.productInfo.name || ''}
              onChange={(e) => handleProductUpdate('name', e.target.value)}
              placeholder="例如：高端狗粮"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SKU / 产品编码
            </label>
            <input
              type="text"
              value={project.scope?.productInfo.sku || ''}
              onChange={(e) => handleProductUpdate('sku', e.target.value)}
              placeholder="例如：PET-DOG-001"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              产品类别
            </label>
            <input
              type="text"
              value={project.scope?.productInfo.category || ''}
              onChange={(e) => handleProductUpdate('category', e.target.value)}
              placeholder="例如：宠物食品"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              重量 (千克) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={project.scope?.productInfo.weight || ''}
              onChange={(e) => handleProductUpdate('weight', parseFloat(e.target.value) || 0)}
              placeholder="例如：2.5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Pricing information */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <DollarSign className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">定价信息</h3>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              制造成本 (COGS) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                step="0.01"
                value={project.scope?.productInfo.cogs || ''}
                onChange={(e) => handleProductUpdate('cogs', parseFloat(e.target.value) || 0)}
                placeholder="10.00"
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">单位制造成本</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              目标售价 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                step="0.01"
                value={project.scope?.productInfo.targetPrice || ''}
                onChange={(e) => handleProductUpdate('targetPrice', parseFloat(e.target.value) || 0)}
                placeholder="29.99"
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">建议零售价</p>
          </div>
        </div>

        {project.scope?.productInfo.cogs && project.scope?.productInfo.targetPrice && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-700">
              <span className="font-medium">初始毛利率:</span>{' '}
              {(
                ((project.scope.productInfo.targetPrice - project.scope.productInfo.cogs) /
                  project.scope.productInfo.targetPrice) *
                100
              ).toFixed(1)}
              %
            </div>
            <p className="text-xs text-gray-500 mt-1">
              注：这是扣除物流、营销等成本前的毛利
            </p>
          </div>
        )}
      </div>

      {/* Business assumptions */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">业务假设</h3>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              预期月销量（单位） <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={project.scope?.assumptions.monthlySales || ''}
              onChange={(e) => handleAssumptionsUpdate('monthlySales', parseInt(e.target.value) || 0)}
              placeholder="例如：1000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">月平均销售量</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              退货率 (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={(project.scope?.assumptions.returnRate || 0) * 100}
              onChange={(e) => handleAssumptionsUpdate('returnRate', parseFloat(e.target.value) / 100 || 0)}
              placeholder="例如：8"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">默认值：宠物用品为8%</p>
          </div>
        </div>

        {project.scope?.assumptions.monthlySales && project.scope?.productInfo.targetPrice && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-700">
              <span className="font-medium">预计月营收:</span> $
              {(project.scope.assumptions.monthlySales * project.scope.productInfo.targetPrice).toLocaleString()}
            </div>
            <div className="text-sm text-gray-700 mt-1">
              <span className="font-medium">预计年营收:</span> $
              {(project.scope.assumptions.monthlySales * project.scope.productInfo.targetPrice * 12).toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {/* Data quality indicator */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
              ℹ
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">数据源等级</h4>
            <p className="text-sm text-blue-800">
              行业因子为Tier 2等级（90%可信度），基于GECOM白皮书案例研究和市场调研。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

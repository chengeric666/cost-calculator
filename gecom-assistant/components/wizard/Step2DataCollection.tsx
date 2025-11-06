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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Data Collection & Validation</h2>
        <p className="text-gray-600">
          Provide detailed product and business information for accurate cost calculation
        </p>
      </div>

      {/* Product information */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Package className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Product Information</h3>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={project.scope?.productInfo.name || ''}
              onChange={(e) => handleProductUpdate('name', e.target.value)}
              placeholder="e.g., Premium Dog Food"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SKU / Product Code
            </label>
            <input
              type="text"
              value={project.scope?.productInfo.sku || ''}
              onChange={(e) => handleProductUpdate('sku', e.target.value)}
              placeholder="e.g., PET-DOG-001"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              value={project.scope?.productInfo.category || ''}
              onChange={(e) => handleProductUpdate('category', e.target.value)}
              placeholder="e.g., Pet Food"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight (kg) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={project.scope?.productInfo.weight || ''}
              onChange={(e) => handleProductUpdate('weight', parseFloat(e.target.value) || 0)}
              placeholder="e.g., 2.5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Pricing information */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <DollarSign className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Manufacturing Cost (COGS) <span className="text-red-500">*</span>
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
            <p className="mt-1 text-xs text-gray-500">Cost to manufacture per unit</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Selling Price <span className="text-red-500">*</span>
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
            <p className="mt-1 text-xs text-gray-500">Intended retail price</p>
          </div>
        </div>

        {project.scope?.productInfo.cogs && project.scope?.productInfo.targetPrice && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-700">
              <span className="font-medium">Initial Margin:</span>{' '}
              {(
                ((project.scope.productInfo.targetPrice - project.scope.productInfo.cogs) /
                  project.scope.productInfo.targetPrice) *
                100
              ).toFixed(1)}
              %
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Note: This is before logistics, marketing, and other costs
            </p>
          </div>
        )}
      </div>

      {/* Business assumptions */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Business Assumptions</h3>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Monthly Sales (units) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={project.scope?.assumptions.monthlySales || ''}
              onChange={(e) => handleAssumptionsUpdate('monthlySales', parseInt(e.target.value) || 0)}
              placeholder="e.g., 1000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">Average units sold per month</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Return Rate (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={(project.scope?.assumptions.returnRate || 0) * 100}
              onChange={(e) => handleAssumptionsUpdate('returnRate', parseFloat(e.target.value) / 100 || 0)}
              placeholder="e.g., 8"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">Default: 8% for pet products</p>
          </div>
        </div>

        {project.scope?.assumptions.monthlySales && project.scope?.productInfo.targetPrice && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-700">
              <span className="font-medium">Projected Monthly Revenue:</span> $
              {(project.scope.assumptions.monthlySales * project.scope.productInfo.targetPrice).toLocaleString()}
            </div>
            <div className="text-sm text-gray-700 mt-1">
              <span className="font-medium">Projected Annual Revenue:</span> $
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
            <h4 className="text-sm font-semibold text-blue-900 mb-1">Data Source Tier</h4>
            <p className="text-sm text-blue-800">
              Industry factors are Tier 2 (90% credibility) based on GECOM whitepaper case studies and market research.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

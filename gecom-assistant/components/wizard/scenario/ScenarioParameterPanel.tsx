/**
 * ScenarioParameterPanel - Phase 5A组件
 * 交互式场景参数调节面板
 *
 * 功能：7个可调参数（售价/月销量/CAC/物流/履约/退货/支付）
 * 设计：Liquid Glass风格 + 实时计算提示
 *
 * 参考：docs/PHASE5-SCENARIO-SIMULATION-DESIGN.md Lines 46-124
 */

'use client';

import React, { useState } from 'react';
import { Info } from 'lucide-react';

export interface ScenarioParams {
  sellingPrice: number;       // 售价 $30-$100
  monthlyVolume: number;      // 月销量 500-5000
  cac: number;                // 获客成本 $10-$60
  logisticsMode: 'sea' | 'air'; // 物流模式
  fulfillmentMode: 'fba' | '3pl' | 'direct'; // 履约模式
  returnRate: number;         // 退货率 0-15%
  paymentGateway: 'stripe' | 'paypal' | 'shoppay'; // 支付方式
}

interface ScenarioParameterPanelProps {
  params: ScenarioParams;
  onChange: (params: ScenarioParams) => void;
  onReset?: () => void;
}

// 默认参数值
export const DEFAULT_SCENARIO_PARAMS: ScenarioParams = {
  sellingPrice: 45,
  monthlyVolume: 1000,
  cac: 25,
  logisticsMode: 'sea',
  fulfillmentMode: 'fba',
  returnRate: 5,
  paymentGateway: 'stripe',
};

export default function ScenarioParameterPanel({
  params,
  onChange,
  onReset,
}: ScenarioParameterPanelProps) {

  // 参数更新处理器
  const handleParamChange = <K extends keyof ScenarioParams>(
    key: K,
    value: ScenarioParams[K]
  ) => {
    onChange({ ...params, [key]: value });
  };

  // 重置到默认值
  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      onChange(DEFAULT_SCENARIO_PARAMS);
    }
  };

  // 计算物流成本节省（仅用于提示）
  const logisticsSavings = 6.0; // 假设海运比空运节省$6.0/kg

  // 计算CAPEX分摊（基于月销量）
  const capexAllocation = params.monthlyVolume > 0
    ? (2500 / params.monthlyVolume).toFixed(2)
    : '0.00';

  // 计算LTV:CAC比率（假设LTV=$70）
  const ltv = 70; // 假设客户生命周期价值
  const ltvCacRatio = params.cac > 0 ? (ltv / params.cac).toFixed(1) : '0.0';
  const ltvCacStatus = parseFloat(ltvCacRatio) >= 3 ? '健康' : parseFloat(ltvCacRatio) >= 1.5 ? '合理' : '偏低';

  return (
    <div className="bg-gradient-to-br from-blue-50/30 to-indigo-50/20 backdrop-blur-md border border-blue-100/50 rounded-2xl p-6 shadow-glass-md">

      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-2xl">📊</span>
          场景参数调节
        </h3>
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-white/50 hover:bg-white/70 border border-blue-200 rounded-lg transition-all duration-200 hover:shadow-md"
          data-testid="reset-params-button"
        >
          重置默认值
        </button>
      </div>

      {/* 价格参数区 */}
      <div className="space-y-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-medium text-gray-700">💰 价格参数</span>
        </div>

        {/* 售价滑块 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              售价 (Selling Price)
              <Info className="h-4 w-4 text-gray-400" />
            </label>
            <span className="text-lg font-semibold text-blue-600" data-testid="price-value">
              ${params.sellingPrice}
            </span>
          </div>

          <input
            type="range"
            min="30"
            max="100"
            step="1"
            value={params.sellingPrice}
            onChange={(e) => handleParamChange('sellingPrice', parseInt(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider-thumb"
            data-testid="price-slider"
          />

          <div className="flex justify-between text-xs text-gray-500">
            <span>$30</span>
            <span>$65</span>
            <span>$100</span>
          </div>

          <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 text-sm text-gray-600">
            <span className="text-blue-600 font-medium">💡 </span>
            当前售价下预估毛利率: <span className="font-semibold text-blue-700">{((params.sellingPrice - 25) / params.sellingPrice * 100).toFixed(1)}%</span>
          </div>
        </div>

        {/* 月销量滑块 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              月销量 (Monthly Volume)
              <Info className="h-4 w-4 text-gray-400" />
            </label>
            <span className="text-lg font-semibold text-blue-600" data-testid="volume-value">
              {params.monthlyVolume} units
            </span>
          </div>

          <input
            type="range"
            min="500"
            max="5000"
            step="100"
            value={params.monthlyVolume}
            onChange={(e) => handleParamChange('monthlyVolume', parseInt(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider-thumb"
            data-testid="volume-slider"
          />

          <div className="flex justify-between text-xs text-gray-500">
            <span>500</span>
            <span>2750</span>
            <span>5000</span>
          </div>

          <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 text-sm text-gray-600">
            <span className="text-blue-600 font-medium">💡 </span>
            当前销量下CAPEX分摊: <span className="font-semibold text-blue-700">${capexAllocation}/件</span>
          </div>
        </div>

        {/* 获客成本滑块 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              获客成本 (CAC)
              <Info className="h-4 w-4 text-gray-400" />
            </label>
            <span className="text-lg font-semibold text-blue-600" data-testid="cac-value">
              ${params.cac}
            </span>
          </div>

          <input
            type="range"
            min="10"
            max="60"
            step="1"
            value={params.cac}
            onChange={(e) => handleParamChange('cac', parseInt(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider-thumb"
            data-testid="cac-slider"
          />

          <div className="flex justify-between text-xs text-gray-500">
            <span>$10</span>
            <span>$35</span>
            <span>$60</span>
          </div>

          <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 text-sm text-gray-600">
            <span className="text-blue-600 font-medium">💡 </span>
            LTV:CAC比率: <span className="font-semibold text-blue-700">{ltvCacRatio}:1（{ltvCacStatus}）</span>
          </div>
        </div>
      </div>

      {/* 运营参数区 */}
      <div className="space-y-6 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-medium text-gray-700">🚚 运营参数</span>
        </div>

        {/* 物流模式切换 */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">物流模式</label>

          <div className="flex gap-3">
            <button
              onClick={() => handleParamChange('logisticsMode', 'sea')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                params.logisticsMode === 'sea'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/50 text-gray-700 border border-gray-300 hover:bg-white/70'
              }`}
              data-testid="logistics-sea-button"
            >
              海运
            </button>
            <button
              onClick={() => handleParamChange('logisticsMode', 'air')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                params.logisticsMode === 'air'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/50 text-gray-700 border border-gray-300 hover:bg-white/70'
              }`}
              data-testid="logistics-air-button"
            >
              空运
            </button>
          </div>

          <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 text-sm text-gray-600">
            <span className="text-blue-600 font-medium">💡 </span>
            {params.logisticsMode === 'sea'
              ? `海运可节省$${logisticsSavings.toFixed(1)}/kg，但交付周期+20天`
              : '空运快速交付，但成本较高'}
          </div>
        </div>

        {/* 履约模式切换 */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">履约模式</label>

          <div className="flex gap-3">
            <button
              onClick={() => handleParamChange('fulfillmentMode', 'fba')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                params.fulfillmentMode === 'fba'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/50 text-gray-700 border border-gray-300 hover:bg-white/70'
              }`}
              data-testid="fulfillment-fba-button"
            >
              FBA
            </button>
            <button
              onClick={() => handleParamChange('fulfillmentMode', '3pl')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                params.fulfillmentMode === '3pl'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/50 text-gray-700 border border-gray-300 hover:bg-white/70'
              }`}
              data-testid="fulfillment-3pl-button"
            >
              3PL
            </button>
            <button
              onClick={() => handleParamChange('fulfillmentMode', 'direct')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                params.fulfillmentMode === 'direct'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/50 text-gray-700 border border-gray-300 hover:bg-white/70'
              }`}
              data-testid="fulfillment-direct-button"
            >
              Direct
            </button>
          </div>

          <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 text-sm text-gray-600">
            <span className="text-blue-600 font-medium">💡 </span>
            {params.fulfillmentMode === 'fba'
              ? 'FBA费用$3.5/件，含Prime流量加成'
              : params.fulfillmentMode === '3pl'
              ? '3PL费用$2.8/件，灵活性高'
              : 'Direct履约$4.2/件，完全自主控制'}
          </div>
        </div>

        {/* 退货率滑块 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              退货率 (Return Rate)
              <Info className="h-4 w-4 text-gray-400" />
            </label>
            <span className="text-lg font-semibold text-blue-600" data-testid="return-rate-value">
              {params.returnRate}%
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="15"
            step="1"
            value={params.returnRate}
            onChange={(e) => handleParamChange('returnRate', parseInt(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider-thumb"
            data-testid="return-rate-slider"
          />

          <div className="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>7.5%</span>
            <span>15%</span>
          </div>

          <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 text-sm text-gray-600">
            <span className="text-blue-600 font-medium">💡 </span>
            退货率每增加1%，净利润下降约$0.8/件
          </div>
        </div>

        {/* 支付方式切换 */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">支付方式</label>

          <div className="flex gap-3">
            <button
              onClick={() => handleParamChange('paymentGateway', 'stripe')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                params.paymentGateway === 'stripe'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/50 text-gray-700 border border-gray-300 hover:bg-white/70'
              }`}
              data-testid="payment-stripe-button"
            >
              Stripe
            </button>
            <button
              onClick={() => handleParamChange('paymentGateway', 'paypal')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                params.paymentGateway === 'paypal'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/50 text-gray-700 border border-gray-300 hover:bg-white/70'
              }`}
              data-testid="payment-paypal-button"
            >
              PayPal
            </button>
            <button
              onClick={() => handleParamChange('paymentGateway', 'shoppay')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                params.paymentGateway === 'shoppay'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/50 text-gray-700 border border-gray-300 hover:bg-white/70'
              }`}
              data-testid="payment-shoppay-button"
            >
              Shop Pay
            </button>
          </div>

          <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 text-sm text-gray-600">
            <span className="text-blue-600 font-medium">💡 </span>
            {params.paymentGateway === 'stripe'
              ? 'Stripe费率: 2.9% + $0.30/笔'
              : params.paymentGateway === 'paypal'
              ? 'PayPal费率: 3.5% + $0.30/笔'
              : 'Shop Pay费率: 2.5% + $0.30/笔'}
          </div>
        </div>
      </div>

      {/* 内联CSS样式 - Slider美化 */}
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s;
        }

        .slider-thumb::-webkit-slider-thumb:hover {
          background: #1d4ed8;
          transform: scale(1.1);
        }

        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s;
        }

        .slider-thumb::-moz-range-thumb:hover {
          background: #1d4ed8;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}

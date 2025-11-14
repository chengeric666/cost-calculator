/**
 * CountryMultiSelector - Phase 5B组件
 * 19国数据库多选器
 *
 * 功能：从19国数据库选择3-5个目标市场
 * 设计：Liquid Glass风格 + Tier质量徽章
 *
 * 参考：docs/PHASE5-SCENARIO-SIMULATION-DESIGN.md Lines 128-186
 */

'use client';

import React from 'react';
import { X, Plus } from 'lucide-react';
import { TargetCountry, Industry } from '@/types/gecom';

// 导入TierBadge组件
import TierBadge from '@/components/ui/TierBadge';

/**
 * 国家数据覆盖信息（简化版，从DataAvailabilityPanel复制）
 */
interface CountryInfo {
  country: TargetCountry;
  country_name_cn: string;
  country_name_en: string;
  flag?: string;
  tier_quality?: string; // Tier 1/2/3质量描述
}

/**
 * 组件Props
 */
interface CountryMultiSelectorProps {
  /**
   * 已选国家列表
   */
  selectedCountries: TargetCountry[];

  /**
   * 国家选择变化回调
   */
  onChange: (countries: TargetCountry[]) => void;

  /**
   * 行业（用于过滤）
   */
  industry?: Industry;

  /**
   * 最小选择数量（默认3）
   */
  minSelection?: number;

  /**
   * 最大选择数量（默认5）
   */
  maxSelection?: number;
}

/**
 * 19国数据列表（基于实际采集进度）
 * 优先显示pet_food数据完整的国家
 */
const AVAILABLE_COUNTRIES: CountryInfo[] = [
  { country: 'US', country_name_cn: '美国', country_name_en: 'United States', flag: '🇺🇸', tier_quality: 'Tier 1' },
  { country: 'DE', country_name_cn: '德国', country_name_en: 'Germany', flag: '🇩🇪', tier_quality: 'Tier 1' },
  { country: 'GB', country_name_cn: '英国', country_name_en: 'United Kingdom', flag: '🇬🇧', tier_quality: 'Tier 1' },
  { country: 'FR', country_name_cn: '法国', country_name_en: 'France', flag: '🇫🇷', tier_quality: 'Tier 1' },
  { country: 'JP', country_name_cn: '日本', country_name_en: 'Japan', flag: '🇯🇵', tier_quality: 'Tier 1' },
  { country: 'CA', country_name_cn: '加拿大', country_name_en: 'Canada', flag: '🇨🇦', tier_quality: 'Tier 1' },
  { country: 'SG', country_name_cn: '新加坡', country_name_en: 'Singapore', flag: '🇸🇬', tier_quality: 'Tier 1' },
  { country: 'VN', country_name_cn: '越南', country_name_en: 'Vietnam', flag: '🇻🇳', tier_quality: 'Tier 2' },
  { country: 'TH', country_name_cn: '泰国', country_name_en: 'Thailand', flag: '🇹🇭', tier_quality: 'Tier 2' },
  { country: 'MY', country_name_cn: '马来西亚', country_name_en: 'Malaysia', flag: '🇲🇾', tier_quality: 'Tier 2' },
  { country: 'PH', country_name_cn: '菲律宾', country_name_en: 'Philippines', flag: '🇵🇭', tier_quality: 'Tier 2' },
  { country: 'ID', country_name_cn: '印尼', country_name_en: 'Indonesia', flag: '🇮🇩', tier_quality: 'Tier 2' },
  { country: 'IN', country_name_cn: '印度', country_name_en: 'India', flag: '🇮🇳', tier_quality: 'Tier 2' },
  { country: 'KR', country_name_cn: '韩国', country_name_en: 'South Korea', flag: '🇰🇷', tier_quality: 'Tier 2' },
  { country: 'AU', country_name_cn: '澳大利亚', country_name_en: 'Australia', flag: '🇦🇺', tier_quality: 'Tier 1' },
  { country: 'SA', country_name_cn: '沙特', country_name_en: 'Saudi Arabia', flag: '🇸🇦', tier_quality: 'Tier 2' },
  { country: 'AE', country_name_cn: '阿联酋', country_name_en: 'UAE', flag: '🇦🇪', tier_quality: 'Tier 2' },
];

/**
 * 默认预选国家（US/DE/JP）
 */
export const DEFAULT_SELECTED_COUNTRIES: TargetCountry[] = ['US', 'DE', 'JP'];

export default function CountryMultiSelector({
  selectedCountries,
  onChange,
  industry = 'pet',
  minSelection = 3,
  maxSelection = 5,
}: CountryMultiSelectorProps) {

  // 添加国家
  const handleAddCountry = (country: TargetCountry) => {
    if (selectedCountries.length < maxSelection && !selectedCountries.includes(country)) {
      onChange([...selectedCountries, country]);
    }
  };

  // 移除国家
  const handleRemoveCountry = (country: TargetCountry) => {
    if (selectedCountries.length > minSelection) {
      onChange(selectedCountries.filter(c => c !== country));
    }
  };

  // 获取国家信息
  const getCountryInfo = (country: TargetCountry): CountryInfo | undefined => {
    return AVAILABLE_COUNTRIES.find(c => c.country === country);
  };

  // 未选择的国家列表
  const availableCountries = AVAILABLE_COUNTRIES.filter(
    c => !selectedCountries.includes(c.country)
  );

  // 检查是否可以添加更多国家
  const canAddMore = selectedCountries.length < maxSelection;

  return (
    <div className="bg-gradient-to-br from-indigo-50/30 to-purple-50/20 backdrop-blur-md border border-indigo-100/50 rounded-2xl p-6 shadow-glass-md">

      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-2xl">🌍</span>
          选择对比市场（{minSelection}-{maxSelection}个）
        </h3>
        <span className="text-sm text-gray-500 bg-white/60 px-3 py-1 rounded-full">
          已选: <span className="font-semibold text-blue-600">{selectedCountries.length}</span>/{maxSelection}
        </span>
      </div>

      {/* 已选市场 */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 mb-3 block">
          🔵 已选市场
        </label>

        <div className="flex flex-wrap gap-3" data-testid="selected-countries">
          {selectedCountries.map((country) => {
            const info = getCountryInfo(country);
            if (!info) return null;

            return (
              <div
                key={country}
                className="bg-white/70 backdrop-blur-sm border-2 border-blue-400 rounded-xl p-3 pr-2 shadow-sm transition-all duration-200 hover:shadow-md flex items-center gap-3"
                data-testid={`selected-country-${country}`}
              >
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-2xl">{info.flag}</span>
                  <div>
                    <div className="font-medium text-gray-900">{info.country}</div>
                    <div className="text-xs text-gray-600">{info.country_name_cn}</div>
                  </div>
                  {info.tier_quality && (
                    <TierBadge tier={info.tier_quality} />
                  )}
                </div>

                {/* 移除按钮 */}
                <button
                  onClick={() => handleRemoveCountry(country)}
                  disabled={selectedCountries.length <= minSelection}
                  className={`p-1.5 rounded-lg transition-all duration-200 ${
                    selectedCountries.length > minSelection
                      ? 'hover:bg-red-100 text-red-600'
                      : 'text-gray-300 cursor-not-allowed'
                  }`}
                  data-testid={`remove-country-${country}`}
                  title={selectedCountries.length <= minSelection ? `至少保留${minSelection}个国家` : '移除'}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>

        {selectedCountries.length < minSelection && (
          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-sm text-yellow-800">
            ⚠️ 至少需要选择{minSelection}个市场才能进行场景对比
          </div>
        )}
      </div>

      {/* 可选市场 */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-3 block">
          📋 可选市场
          {!canAddMore && (
            <span className="ml-2 text-xs text-gray-500">(已达最大选择数量)</span>
          )}
        </label>

        <div className="bg-white/40 backdrop-blur-sm border border-gray-200 rounded-xl p-4 max-h-72 overflow-y-auto">
          <div className="grid grid-cols-1 gap-2">
            {availableCountries.map((country) => (
              <button
                key={country.country}
                onClick={() => handleAddCountry(country.country)}
                disabled={!canAddMore}
                className={`flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 ${
                  canAddMore
                    ? 'hover:bg-blue-50 hover:border-blue-200 bg-white border border-gray-200'
                    : 'bg-gray-100 border border-gray-200 cursor-not-allowed opacity-60'
                }`}
                data-testid={`add-country-${country.country}`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{country.flag}</span>
                  <div>
                    <div className="font-medium text-gray-900">{country.country} - {country.country_name_cn}</div>
                    <div className="text-xs text-gray-500">{country.country_name_en}</div>
                  </div>
                  {country.tier_quality && (
                    <TierBadge tier={country.tier_quality} />
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {canAddMore && (
                    <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
                      <Plus className="h-4 w-4" />
                      添加
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 数据质量说明 */}
      <div className="mt-5 bg-blue-50/50 border border-blue-100 rounded-lg p-4 text-sm text-gray-600">
        <div className="font-medium text-gray-700 mb-2">💡 数据质量说明:</div>
        <ul className="space-y-1 ml-4">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">●</span>
            <span><strong>Tier 1</strong>: 官方数据100%（USITC、IRS等政府机构）</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 font-bold">●</span>
            <span><strong>Tier 2</strong>: 权威数据+估算（行业报告、物流商报价）</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-600 font-bold">●</span>
            <span><strong>Tier 3</strong>: AI研究+行业经验</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

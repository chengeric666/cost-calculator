/**
 * DataAvailabilityPanel组件 - 数据可用性面板
 *
 * 用途：展示19国×2行业数据覆盖情况，帮助用户了解成本因子库现状
 *
 * 设计规范：
 * - Collapsible面板（默认折叠，避免干扰主流程）
 * - 数据完整度分级：✅ 完整数据、⚠️ 部分数据、❌ 无数据
 * - 点击国家名称展开详细缺失字段
 * - 支持按行业筛选（宠物食品/电子烟）
 * - 数据统计（总覆盖率、完整数据国家数）
 *
 * @example
 * ```tsx
 * <DataAvailabilityPanel
 *   industry="pet"
 *   onCountrySelect={(country) => console.log(country)}
 * />
 * ```
 */

'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { ChevronDown, ChevronUp, Info, Check, AlertTriangle, X, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassCard from '@/components/ui/GlassCard';
import TierBadge from '@/components/ui/TierBadge';
import type { TargetCountry, Industry } from '@/types/gecom';

/**
 * 数据可用性状态
 */
export type DataAvailability = 'full' | 'partial' | 'none';

/**
 * 国家数据覆盖信息
 */
export interface CountryDataCoverage {
  country: TargetCountry;
  country_name_cn: string;
  country_name_en: string;
  flag?: string;
  pet_food: {
    availability: DataAvailability;
    completeness: number; // 0-100%
    missing_modules?: string[]; // 缺失的模块（如 ['M2', 'M7']）
    tier_quality?: string; // 数据质量（Tier 1/2/3混合情况）
    market_status?: 'open' | 'restricted' | 'banned'; // 市场状态（可选）
  };
  vape: {
    availability: DataAvailability;
    completeness: number;
    missing_modules?: string[];
    tier_quality?: string;
    market_status?: 'open' | 'restricted' | 'banned'; // 市场状态
  };
}

/**
 * Props定义
 */
export interface DataAvailabilityPanelProps {
  /**
   * 当前选中的行业（用于高亮显示）
   */
  industry?: Industry;

  /**
   * 是否默认展开
   */
  defaultExpanded?: boolean;

  /**
   * 国家选择回调（点击国家名称）
   */
  onCountrySelect?: (country: TargetCountry) => void;

  /**
   * 自定义className
   */
  className?: string;
}

/**
 * 19国数据覆盖情况（基于Week 1实际采集进度）
 * 数据来源：MVP-2.0-任务清单.md Week 1 完成情况
 */
const COUNTRY_DATA_COVERAGE: CountryDataCoverage[] = [
  {
    country: 'US',
    country_name_cn: '美国',
    country_name_en: 'United States',
    flag: '🇺🇸',
    pet_food: { availability: 'full', completeness: 100, tier_quality: 'Tier 1主导' },
    vape: { availability: 'full', completeness: 100, market_status: 'open', tier_quality: 'Tier 1主导' },
  },
  {
    country: 'DE',
    country_name_cn: '德国',
    country_name_en: 'Germany',
    flag: '🇩🇪',
    pet_food: { availability: 'full', completeness: 100, tier_quality: 'Tier 1+Tier 2' },
    vape: { availability: 'partial', completeness: 75, missing_modules: ['M7', 'M8'], market_status: 'restricted' },
  },
  {
    country: 'GB',
    country_name_cn: '英国',
    country_name_en: 'United Kingdom',
    flag: '🇬🇧',
    pet_food: { availability: 'full', completeness: 100, tier_quality: 'Tier 1+Tier 2' },
    vape: { availability: 'partial', completeness: 80, missing_modules: ['M8'], market_status: 'open' },
  },
  {
    country: 'FR',
    country_name_cn: '法国',
    country_name_en: 'France',
    flag: '🇫🇷',
    pet_food: { availability: 'full', completeness: 100, tier_quality: 'Tier 1+Tier 2' },
    vape: { availability: 'none', completeness: 0, market_status: 'banned' },
  },
  {
    country: 'VN',
    country_name_cn: '越南',
    country_name_en: 'Vietnam',
    flag: '🇻🇳',
    pet_food: { availability: 'full', completeness: 100, tier_quality: 'Tier 2主导' },
    vape: { availability: 'none', completeness: 0, market_status: 'banned' },
  },
  {
    country: 'TH',
    country_name_cn: '泰国',
    country_name_en: 'Thailand',
    flag: '🇹🇭',
    pet_food: { availability: 'full', completeness: 100, tier_quality: 'Tier 2主导' },
    vape: { availability: 'partial', completeness: 70, missing_modules: ['M2', 'M7', 'M8'], market_status: 'open' },
  },
  {
    country: 'MY',
    country_name_cn: '马来西亚',
    country_name_en: 'Malaysia',
    flag: '🇲🇾',
    pet_food: { availability: 'full', completeness: 100, tier_quality: 'Tier 2主导' },
    vape: { availability: 'partial', completeness: 75, missing_modules: ['M7', 'M8'], market_status: 'restricted' },
  },
  {
    country: 'PH',
    country_name_cn: '菲律宾',
    country_name_en: 'Philippines',
    flag: '🇵🇭',
    pet_food: { availability: 'full', completeness: 100, tier_quality: 'Tier 2+Tier 3' },
    vape: { availability: 'partial', completeness: 65, missing_modules: ['M2', 'M7', 'M8'], market_status: 'open' },
  },
  {
    country: 'ID',
    country_name_cn: '印度尼西亚',
    country_name_en: 'Indonesia',
    flag: '🇮🇩',
    pet_food: { availability: 'full', completeness: 100, tier_quality: 'Tier 2+Tier 3' },
    vape: { availability: 'none', completeness: 0, market_status: 'banned' },
  },
  {
    country: 'IN',
    country_name_cn: '印度',
    country_name_en: 'India',
    flag: '🇮🇳',
    pet_food: { availability: 'full', completeness: 100, tier_quality: 'Tier 2主导' },
    vape: { availability: 'none', completeness: 0, market_status: 'banned' },
  },
  {
    country: 'JP',
    country_name_cn: '日本',
    country_name_en: 'Japan',
    flag: '🇯🇵',
    pet_food: { availability: 'full', completeness: 100, tier_quality: 'Tier 1主导' },
    vape: { availability: 'partial', completeness: 80, missing_modules: ['M8'], market_status: 'open' },
  },
  {
    country: 'KR',
    country_name_cn: '韩国',
    country_name_en: 'South Korea',
    flag: '🇰🇷',
    pet_food: { availability: 'full', completeness: 100, tier_quality: 'Tier 1+Tier 2' },
    vape: { availability: 'partial', completeness: 75, missing_modules: ['M7', 'M8'], market_status: 'restricted' },
  },
  {
    country: 'AU',
    country_name_cn: '澳大利亚',
    country_name_en: 'Australia',
    flag: '🇦🇺',
    pet_food: { availability: 'full', completeness: 100, tier_quality: 'Tier 1主导' },
    vape: { availability: 'partial', completeness: 70, missing_modules: ['M2', 'M7', 'M8'], market_status: 'restricted' },
  },
  {
    country: 'SA',
    country_name_cn: '沙特阿拉伯',
    country_name_en: 'Saudi Arabia',
    flag: '🇸🇦',
    pet_food: { availability: 'full', completeness: 100, tier_quality: 'Tier 2+Tier 3' },
    vape: { availability: 'none', completeness: 0, market_status: 'banned' },
  },
  {
    country: 'AE',
    country_name_cn: '阿联酋',
    country_name_en: 'UAE',
    flag: '🇦🇪',
    pet_food: { availability: 'full', completeness: 100, tier_quality: 'Tier 2+Tier 3' },
    vape: { availability: 'none', completeness: 0, market_status: 'banned' },
  },
  {
    country: 'CA',
    country_name_cn: '加拿大',
    country_name_en: 'Canada',
    flag: '🇨🇦',
    pet_food: { availability: 'full', completeness: 100, tier_quality: 'Tier 1主导' },
    vape: { availability: 'none', completeness: 0, market_status: 'banned' },
  },
  {
    country: 'MX',
    country_name_cn: '墨西哥',
    country_name_en: 'Mexico',
    flag: '🇲🇽',
    pet_food: { availability: 'full', completeness: 100, tier_quality: 'Tier 2主导' },
    vape: { availability: 'none', completeness: 0, market_status: 'banned' },
  },
  {
    country: 'BR',
    country_name_cn: '巴西',
    country_name_en: 'Brazil',
    flag: '🇧🇷',
    pet_food: { availability: 'full', completeness: 100, tier_quality: 'Tier 2+Tier 3' },
    vape: { availability: 'none', completeness: 0, market_status: 'banned' },
  },
  {
    country: 'SG',
    country_name_cn: '新加坡',
    country_name_en: 'Singapore',
    flag: '🇸🇬',
    pet_food: { availability: 'full', completeness: 100, tier_quality: 'Tier 1+Tier 2' },
    vape: { availability: 'none', completeness: 0, market_status: 'banned' },
  },
];

/**
 * 获取可用性图标和样式
 */
function getAvailabilityBadge(availability: DataAvailability, completeness: number): {
  icon: React.ReactNode;
  label: string;
  color: string;
  bgColor: string;
} {
  switch (availability) {
    case 'full':
      return {
        icon: <Check className="h-3.5 w-3.5" />,
        label: '完整数据',
        color: 'text-green-700',
        bgColor: 'bg-green-50 border-green-200',
      };
    case 'partial':
      return {
        icon: <AlertTriangle className="h-3.5 w-3.5" />,
        label: `部分数据 (${completeness}%)`,
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-50 border-yellow-200',
      };
    case 'none':
      return {
        icon: <X className="h-3.5 w-3.5" />,
        label: '无数据',
        color: 'text-gray-500',
        bgColor: 'bg-gray-50 border-gray-200',
      };
  }
}

/**
 * DataAvailabilityPanel组件
 */
export default function DataAvailabilityPanel({
  industry = 'pet',
  defaultExpanded = false,
  onCountrySelect,
  className,
}: DataAvailabilityPanelProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [expandedCountries, setExpandedCountries] = useState<Set<TargetCountry>>(new Set());

  // 根据行业筛选数据
  const industryKey = industry === 'vape' ? 'vape' : 'pet_food';

  // 计算统计数据
  const stats = useMemo(() => {
    const total = COUNTRY_DATA_COVERAGE.length;
    const fullData = COUNTRY_DATA_COVERAGE.filter(
      (c) => c[industryKey].availability === 'full'
    ).length;
    const partialData = COUNTRY_DATA_COVERAGE.filter(
      (c) => c[industryKey].availability === 'partial'
    ).length;
    const noData = COUNTRY_DATA_COVERAGE.filter(
      (c) => c[industryKey].availability === 'none'
    ).length;

    const avgCompleteness =
      COUNTRY_DATA_COVERAGE.reduce((sum, c) => sum + c[industryKey].completeness, 0) / total;

    return {
      total,
      fullData,
      partialData,
      noData,
      avgCompleteness: Math.round(avgCompleteness),
    };
  }, [industryKey]);

  // 切换国家展开状态
  const toggleCountry = useCallback((country: TargetCountry) => {
    setExpandedCountries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(country)) {
        newSet.delete(country);
      } else {
        newSet.add(country);
      }
      return newSet;
    });
  }, []);

  // 处理国家行点击（展开 + 选择）
  const handleCountryClick = useCallback((country: TargetCountry) => {
    // 1. 先切换展开状态（本地state更新）
    toggleCountry(country);

    // 2. 延迟触发父组件选择，确保本地state更新完成
    // 使用setTimeout(0)将onCountrySelect放入下一个事件循环
    setTimeout(() => {
      onCountrySelect?.(country);
    }, 0);
  }, [toggleCountry, onCountrySelect]);

  return (
    <GlassCard
      variant="bordered"
      shadow="sm"
      padding="md"
      className={cn('border-l-4 border-l-blue-500', className)}
    >
      {/* 面板头部 */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">
            数据可用性面板
          </h3>
          <span className="text-xs text-gray-500">
            ({industry === 'vape' ? '电子烟' : '宠物食品'}行业)
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* 统计摘要 */}
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="font-medium">{stats.avgCompleteness}%</span>
            <span>平均覆盖率</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </div>
      </div>

      {/* 展开内容 */}
      {isExpanded && (
        <div className="mt-4 space-y-3">
          {/* 统计概览 */}
          <div className="grid grid-cols-4 gap-2 p-3 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-600">总国家数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.fullData}</div>
              <div className="text-xs text-gray-600">完整数据</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.partialData}</div>
              <div className="text-xs text-gray-600">部分数据</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-500">{stats.noData}</div>
              <div className="text-xs text-gray-600">无数据</div>
            </div>
          </div>

          {/* 国家列表 */}
          <div className="space-y-2">
            {COUNTRY_DATA_COVERAGE.map((country) => {
              const industryData = country[industryKey];
              const badge = getAvailabilityBadge(industryData.availability, industryData.completeness);
              const isCountryExpanded = expandedCountries.has(country.country);

              return (
                <div key={country.country} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* 国家行 */}
                  <div
                    className={cn(
                      'flex items-center justify-between p-3 transition-colors',
                      'hover:bg-gray-50 cursor-pointer'
                    )}
                    onClick={() => handleCountryClick(country.country)}
                  >
                    {/* 左侧：国家信息 */}
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{country.flag}</span>
                      <div>
                        <div className="font-medium text-gray-900">
                          {country.country_name_cn}
                        </div>
                        <div className="text-xs text-gray-500">
                          {country.country_name_en} ({country.country})
                        </div>
                      </div>
                    </div>

                    {/* 中间：数据状态徽章 */}
                    <div className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium',
                      badge.color,
                      badge.bgColor
                    )}>
                      {badge.icon}
                      <span>{badge.label}</span>
                    </div>

                    {/* 右侧：数据质量 */}
                    {industryData.tier_quality && (
                      <div className="ml-3">
                        <TierBadge tier={industryData.tier_quality} size="sm" />
                      </div>
                    )}
                  </div>

                  {/* 展开详情 */}
                  {isCountryExpanded && (
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 space-y-2">
                      {/* 数据完整度 */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">数据完整度</span>
                        <span className="font-medium text-gray-900">
                          {industryData.completeness}%
                        </span>
                      </div>

                      {/* 缺失模块（如果有） */}
                      {industryData.missing_modules && industryData.missing_modules.length > 0 && (
                        <div className="text-sm">
                          <div className="text-gray-600 mb-1">缺失模块</div>
                          <div className="flex flex-wrap gap-1.5">
                            {industryData.missing_modules.map((module) => (
                              <span
                                key={module}
                                className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium"
                              >
                                {module}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 市场状态（电子烟特有） */}
                      {industry === 'vape' && industryData.market_status && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">市场状态</span>
                          <span className={cn(
                            'px-2 py-0.5 rounded text-xs font-medium',
                            industryData.market_status === 'open' && 'bg-green-100 text-green-700',
                            industryData.market_status === 'restricted' && 'bg-yellow-100 text-yellow-700',
                            industryData.market_status === 'banned' && 'bg-red-100 text-red-700'
                          )}>
                            {industryData.market_status === 'open' && '开放市场'}
                            {industryData.market_status === 'restricted' && '受限市场'}
                            {industryData.market_status === 'banned' && '禁售市场'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 底部说明 */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-800">
              <strong>数据说明：</strong>
              数据覆盖率基于Week 1采集进度（29/38条记录）。宠物食品行业已完成19国全覆盖（21条），电子烟行业已采集8个开放市场。
              点击国家名称可查看详细模块覆盖情况。
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

/**
 * DataSourceTooltip组件 - 数据来源信息提示
 *
 * 用途：当用户鼠标悬停在数据字段上时，显示完整的数据溯源信息
 *
 * 设计规范（来自GECOM方法论白皮书V2.2）：
 * - 数据来源（dataSource）: 数据的具体来源（如"USITC官网"、"Amazon Seller Central"）
 * - Tier等级（tier）: 数据质量分级（Tier 1/2/3）
 * - 更新时间（updatedAt）: 数据采集或更新的时间
 * - 置信度（confidence）: 数据可信度百分比（Tier 1: 100%, Tier 2: ≈90%, Tier 3: ≈80%）
 *
 * UI交互：
 * - 默认触发器：Info图标（lucide-react）
 * - 自定义触发器：支持children（如文字、按钮等）
 * - 位置：自适应（默认top，如空间不足自动调整）
 *
 * @example
 * ```tsx
 * // 默认用法（显示Info图标）
 * <DataSourceTooltip
 *   dataSource="USITC官网"
 *   tier="Tier 1"
 *   updatedAt="2025-Q1"
 * />
 *
 * // 自定义触发器
 * <DataSourceTooltip dataSource="Amazon费率表" tier="Tier 2">
 *   <span className="text-blue-500 cursor-help">$5.32</span>
 * </DataSourceTooltip>
 * ```
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DataSourceTooltipProps {
  /**
   * 数据来源描述
   * 示例："USITC官网"、"Amazon Seller Central 2025费率表"、"上海威万物流报价"
   */
  dataSource: string;

  /**
   * Tier等级（可选，自动从dataSource推断）
   * 如果提供，优先使用此值；否则从dataSource智能识别
   */
  tier?: string;

  /**
   * 数据更新时间（可选）
   * 示例："2025-Q1"、"2025-11-08"、"2024-12"
   */
  updatedAt?: string;

  /**
   * 数据置信度百分比（可选，自动从tier推断）
   * 示例：100、90、80
   */
  confidence?: number;

  /**
   * 自定义触发器（可选）
   * 如不提供，默认显示Info图标
   */
  children?: React.ReactNode;

  /**
   * Tooltip位置（可选）
   * - 'top': 上方（默认）
   * - 'bottom': 下方
   * - 'left': 左侧
   * - 'right': 右侧
   */
  position?: 'top' | 'bottom' | 'left' | 'right';

  /**
   * 自定义className
   */
  className?: string;
}

/**
 * 从dataSource智能识别Tier等级
 */
function inferTierFromDataSource(dataSource: string): string {
  const lower = dataSource.toLowerCase();

  // Tier 1关键词
  if (
    lower.includes('官网') ||
    lower.includes('官方') ||
    lower.includes('government') ||
    lower.includes('usitc') ||
    lower.includes('taric') ||
    lower.includes('customs') ||
    lower.includes('irs') ||
    lower.includes('fda') ||
    lower.includes('maqis') ||
    lower.includes('aafco')
  ) {
    return 'Tier 1';
  }

  // Tier 2关键词
  if (
    lower.includes('amazon') ||
    lower.includes('shopee') ||
    lower.includes('lazada') ||
    lower.includes('tiktok') ||
    lower.includes('物流') ||
    lower.includes('logistics') ||
    lower.includes('3pl') ||
    lower.includes('报价') ||
    lower.includes('quote') ||
    lower.includes('费率表') ||
    lower.includes('rate card')
  ) {
    return 'Tier 2';
  }

  // 默认Tier 3
  return 'Tier 3';
}

/**
 * 从Tier等级获取置信度
 */
function getConfidenceFromTier(tier: string): number {
  const lower = tier.toLowerCase();

  if (lower.includes('tier 1') || lower.includes('tier1')) {
    return 100;
  }

  if (lower.includes('tier 2') || lower.includes('tier2')) {
    return 90;
  }

  return 80; // Tier 3
}

/**
 * DataSourceTooltip组件
 */
export default function DataSourceTooltip({
  dataSource,
  tier,
  updatedAt,
  confidence,
  children,
  position = 'top',
  className,
}: DataSourceTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [adjustedPosition, setAdjustedPosition] = useState(position);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // 智能推断tier和confidence
  const effectiveTier = tier || inferTierFromDataSource(dataSource);
  const effectiveConfidence = confidence || getConfidenceFromTier(effectiveTier);

  // 动态调整tooltip位置（避免超出视口）
  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let newPosition = position;

      // 检查上方空间
      if (position === 'top' && triggerRect.top < tooltipRect.height + 10) {
        newPosition = 'bottom';
      }

      // 检查下方空间
      if (position === 'bottom' && triggerRect.bottom + tooltipRect.height + 10 > viewportHeight) {
        newPosition = 'top';
      }

      // 检查左侧空间
      if (position === 'left' && triggerRect.left < tooltipRect.width + 10) {
        newPosition = 'right';
      }

      // 检查右侧空间
      if (position === 'right' && triggerRect.right + tooltipRect.width + 10 > viewportWidth) {
        newPosition = 'left';
      }

      setAdjustedPosition(newPosition);
    }
  }, [isVisible, position]);

  // Tooltip位置样式
  const getPositionStyles = () => {
    switch (adjustedPosition) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
    }
  };

  // Tooltip箭头样式
  const getArrowStyles = () => {
    const baseArrow = 'absolute w-0 h-0 border-solid';
    switch (adjustedPosition) {
      case 'top':
        return `${baseArrow} bottom-[-6px] left-1/2 transform -translate-x-1/2 border-t-gray-800 border-l-transparent border-r-transparent border-b-transparent border-t-[6px] border-l-[6px] border-r-[6px]`;
      case 'bottom':
        return `${baseArrow} top-[-6px] left-1/2 transform -translate-x-1/2 border-b-gray-800 border-l-transparent border-r-transparent border-t-transparent border-b-[6px] border-l-[6px] border-r-[6px]`;
      case 'left':
        return `${baseArrow} right-[-6px] top-1/2 transform -translate-y-1/2 border-l-gray-800 border-t-transparent border-b-transparent border-r-transparent border-l-[6px] border-t-[6px] border-b-[6px]`;
      case 'right':
        return `${baseArrow} left-[-6px] top-1/2 transform -translate-y-1/2 border-r-gray-800 border-t-transparent border-b-transparent border-l-transparent border-r-[6px] border-t-[6px] border-b-[6px]`;
    }
  };

  return (
    <div
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      ref={triggerRef}
    >
      {/* 触发器 */}
      {children ? (
        children
      ) : (
        <Info
          className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors cursor-help"
          aria-label="数据来源信息"
        />
      )}

      {/* Tooltip内容 */}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            'absolute z-50',
            'min-w-[280px] max-w-[360px]',
            'px-3 py-2',
            'bg-gray-800 text-white',
            'rounded-lg',
            'shadow-lg',
            'text-xs leading-relaxed',
            'pointer-events-none',
            'animate-in fade-in-0 zoom-in-95 duration-200',
            getPositionStyles()
          )}
        >
          {/* 箭头 */}
          <div className={getArrowStyles()} />

          {/* 内容 */}
          <div className="space-y-2">
            {/* 数据来源 */}
            <div>
              <div className="font-semibold text-gray-200 mb-0.5">数据来源</div>
              <div className="text-white">{dataSource}</div>
            </div>

            {/* Tier等级 */}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-200">数据质量</span>
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-medium',
                  effectiveTier.includes('1')
                    ? 'bg-green-100 text-green-800'
                    : effectiveTier.includes('2')
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                )}
              >
                {effectiveTier}
              </span>
            </div>

            {/* 置信度 */}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-200">置信度</span>
              <span className="text-white font-medium">{effectiveConfidence}%</span>
            </div>

            {/* 更新时间 */}
            {updatedAt && (
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-200">更新时间</span>
                <span className="text-white">{updatedAt}</span>
              </div>
            )}

            {/* 说明文字 */}
            <div className="pt-1 mt-2 border-t border-gray-700 text-gray-300 text-[10px]">
              {effectiveTier.includes('1') && '✓ 来自官方权威数据源'}
              {effectiveTier.includes('2') && '✓ 来自权威行业数据源'}
              {effectiveTier.includes('3') && '✓ 基于行业经验估算'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 便捷导出：预设常见数据源
 *
 * @example
 * ```tsx
 * <DataSourceTooltip.Official dataSource="USITC关税数据库" />  // Tier 1
 * <DataSourceTooltip.Authoritative dataSource="Amazon费率表" />  // Tier 2
 * <DataSourceTooltip.Estimated dataSource="行业平均值" />  // Tier 3
 * ```
 */
DataSourceTooltip.Official = (props: Omit<DataSourceTooltipProps, 'tier'>) => (
  <DataSourceTooltip tier="Tier 1" {...props} />
);

DataSourceTooltip.Authoritative = (props: Omit<DataSourceTooltipProps, 'tier'>) => (
  <DataSourceTooltip tier="Tier 2" {...props} />
);

DataSourceTooltip.Estimated = (props: Omit<DataSourceTooltipProps, 'tier'>) => (
  <DataSourceTooltip tier="Tier 3" {...props} />
);

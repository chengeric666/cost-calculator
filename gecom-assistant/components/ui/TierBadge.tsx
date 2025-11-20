/**
 * TierBadge组件 - GECOM数据质量分级徽章
 *
 * 用途：展示数据来源的可信度等级（Tier 1/2/3）
 *
 * 设计规范（来自GECOM方法论白皮书V2.2）：
 * - Tier 1: 官方权威数据（可信度100%）- 绿色
 * - Tier 2: 权威次级数据（可信度≈90%）- 黄色
 * - Tier 3: 经验推测数据（可信度≈80%）- 灰色
 *
 * 数据溯源要求：
 * - 每个成本参数必须显示Tier徽章
 * - Hover时配合DataSourceTooltip显示完整来源信息
 *
 * @example
 * ```tsx
 * <TierBadge tier="Tier 1" size="sm" />
 * <TierBadge tier="官方数据" size="md" />
 * <TierBadge tier="tier2" size="lg" />
 * ```
 */

import React from 'react';
import { cn } from '@/lib/utils'; // shadcn/ui工具函数

export type TierLevel = 'Tier 1' | 'Tier 2' | 'Tier 3' | 'tier1' | 'tier2' | 'tier3' | 'official' | 'authoritative' | 'estimated';
export type TierSize = 'sm' | 'md' | 'lg';

export interface TierBadgeProps {
  /**
   * Tier等级或数据来源描述
   * 支持多种格式：'Tier 1'、'tier1'、'官方数据'、'Official'
   */
  tier?: string | null;

  /**
   * 徽章尺寸
   * - sm: 适用于表格/列表（px-2 py-0.5 text-xs）
   * - md: 适用于表单/卡片（px-2.5 py-1 text-sm）
   * - lg: 适用于标题/强调（px-3 py-1.5 text-base）
   */
  size?: TierSize;

  /**
   * 自定义className（会与默认样式合并）
   */
  className?: string;

  /**
   * 是否显示完整文本（默认只显示"Tier 1/2/3"）
   * - true: 显示原始tier字符串
   * - false: 标准化为"Tier 1/2/3"
   */
  showFullText?: boolean;
}

/**
 * 解析Tier等级
 * 支持多种输入格式，统一归一化为Tier 1/2/3
 */
function parseTierLevel(tier?: string | null): 1 | 2 | 3 {
  if (!tier) return 3; // 默认Tier 3

  const lowerTier = tier.toLowerCase();

  // Tier 1: 官方数据
  if (
    lowerTier.includes('tier 1') ||
    lowerTier.includes('tier1') ||
    lowerTier.includes('official') ||
    lowerTier.includes('官方') ||
    lowerTier.includes('government') ||
    lowerTier.includes('gov') ||
    lowerTier.includes('usitc') ||
    lowerTier.includes('taric') ||
    lowerTier.includes('customs')
  ) {
    return 1;
  }

  // Tier 2: 权威次级数据
  if (
    lowerTier.includes('tier 2') ||
    lowerTier.includes('tier2') ||
    lowerTier.includes('authoritative') ||
    lowerTier.includes('权威') ||
    lowerTier.includes('amazon') ||
    lowerTier.includes('shopee') ||
    lowerTier.includes('3pl') ||
    lowerTier.includes('logistics')
  ) {
    return 2;
  }

  // Tier 3: 推算数据
  return 3;
}

/**
 * 获取Tier样式配置
 */
function getTierStyles(level: 1 | 2 | 3): {
  bgColor: string;
  textColor: string;
  borderColor: string;
  label: string;
  confidenceLevel: string;
} {
  switch (level) {
    case 1:
      return {
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        borderColor: 'border-green-300',
        label: 'Tier 1',
        confidenceLevel: '官方数据（100%）',
      };
    case 2:
      return {
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-700',
        borderColor: 'border-yellow-300',
        label: 'Tier 2',
        confidenceLevel: '权威数据（≈90%）',
      };
    case 3:
      return {
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-700',
        borderColor: 'border-gray-300',
        label: 'Tier 3',
        confidenceLevel: '估算数据（≈80%）',
      };
  }
}

/**
 * 获取尺寸样式
 */
function getSizeStyles(size: TierSize): string {
  switch (size) {
    case 'sm':
      return 'px-2 py-0.5 text-xs'; // 适用于密集布局
    case 'md':
      return 'px-2.5 py-1 text-sm'; // 默认尺寸
    case 'lg':
      return 'px-3 py-1.5 text-base'; // 强调展示
  }
}

/**
 * TierBadge组件
 *
 * 特性：
 * - 自动识别Tier等级（1/2/3）
 * - 响应式颜色映射（绿/黄/灰）
 * - 多种尺寸支持（sm/md/lg）
 * - 支持等宽数字字体（font-variant-numeric: tabular-nums）
 * - 可定制className
 */
export default function TierBadge({
  tier,
  size = 'sm',
  className,
  showFullText = false,
}: TierBadgeProps) {
  // 如果没有tier数据，不显示徽章
  if (!tier) {
    return null;
  }

  const level = parseTierLevel(tier);
  const styles = getTierStyles(level);
  const sizeStyles = getSizeStyles(size);

  // 显示文本：showFullText ? 原始tier字符串 : 标准化"Tier N"
  const displayText = showFullText ? tier : styles.label;

  return (
    <span
      className={cn(
        // 基础样式
        'inline-flex items-center',
        'rounded-full',
        'border',
        'font-medium',
        'tabular-nums', // 等宽数字字体（Tailwind配置的fontVariantNumeric）
        'whitespace-nowrap',
        'transition-all duration-200',
        // 颜色样式（根据Tier等级）
        styles.bgColor,
        styles.textColor,
        styles.borderColor,
        // 尺寸样式
        sizeStyles,
        // Hover效果（轻微放大）
        'hover:scale-105',
        // 自定义className
        className
      )}
      title={styles.confidenceLevel} // 鼠标悬停时显示置信度
      aria-label={`数据质量: ${styles.confidenceLevel}`}
    >
      {displayText}
    </span>
  );
}

/**
 * 便捷导出：预设Tier 1/2/3组件
 *
 * @example
 * ```tsx
 * <TierBadge.Tier1 />  // 自动显示"Tier 1"绿色徽章
 * <TierBadge.Tier2 />  // 自动显示"Tier 2"黄色徽章
 * <TierBadge.Tier3 />  // 自动显示"Tier 3"灰色徽章
 * ```
 */
TierBadge.Tier1 = (props: Omit<TierBadgeProps, 'tier'>) => (
  <TierBadge tier="Tier 1" {...props} />
);

TierBadge.Tier2 = (props: Omit<TierBadgeProps, 'tier'>) => (
  <TierBadge tier="Tier 2" {...props} />
);

TierBadge.Tier3 = (props: Omit<TierBadgeProps, 'tier'>) => (
  <TierBadge tier="Tier 3" {...props} />
);

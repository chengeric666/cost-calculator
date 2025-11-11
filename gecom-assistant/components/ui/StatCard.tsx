/**
 * StatCard组件 - KPI统计卡片
 *
 * 用途：展示关键业务指标（毛利率、ROI、LTV:CAC等）
 *
 * 设计规范：
 * - 基于GlassCard组件构建，继承Liquid Glass设计语言
 * - 数字格式化（美元符号、千位分隔符、等宽字体）
 * - 趋势指示（↑↓箭头 + 百分比变化）
 * - 颜色映射（成功绿/警告黄/危险红）
 * - 响应式布局（移动端友好）
 *
 * @example
 * ```tsx
 * // 基础用法
 * <StatCard
 *   title="毛利率"
 *   value={45.2}
 *   format="percent"
 *   trend="up"
 *   delta={5.3}
 * />
 *
 * // 美元格式 + 颜色状态
 * <StatCard
 *   title="单位利润"
 *   value={12.50}
 *   format="usd"
 *   status="success"
 *   description="已达到目标利润"
 * />
 *
 * // 自定义渲染
 * <StatCard
 *   title="客户生命周期价值"
 *   value={150.00}
 *   format="usd"
 *   trend="up"
 *   delta={15.2}
 *   status="success"
 * >
 *   <div className="text-xs text-gray-500 mt-1">
 *     基于3.2次平均复购
 *   </div>
 * </StatCard>
 * ```
 */

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatUSD, formatPercent, formatNumber } from '@/lib/utils';
import GlassCard from './GlassCard';

export type StatCardFormat = 'number' | 'usd' | 'percent' | 'custom';
export type StatCardTrend = 'up' | 'down' | 'neutral';
export type StatCardStatus = 'default' | 'success' | 'warning' | 'danger';

export interface StatCardProps {
  /**
   * KPI标题
   * 示例："毛利率"、"投资回报率"、"回本周期"
   */
  title: string;

  /**
   * KPI数值
   * - format="number": 普通数字（如 1234.56 → "1,234.56"）
   * - format="usd": 美元金额（如 1234.56 → "$1,234.56"）
   * - format="percent": 百分比（如 0.4523 → "45.23%" 或 45.23 → "45.23%"）
   * - format="custom": 自定义格式（直接显示value）
   */
  value: number | string;

  /**
   * 数值格式化类型
   * - 'number': 千位分隔符（1,234.56）
   * - 'usd': 美元符号 + 千位分隔符（$1,234.56）
   * - 'percent': 百分比符号（45.23%）
   * - 'custom': 自定义（不进行格式化）
   */
  format?: StatCardFormat;

  /**
   * 趋势方向（可选）
   * - 'up': 上升（绿色箭头）
   * - 'down': 下降（红色箭头）
   * - 'neutral': 无变化（灰色横线）
   */
  trend?: StatCardTrend;

  /**
   * 变化百分比（可选，配合trend使用）
   * 示例：5.3 表示 "+5.3%"
   */
  delta?: number;

  /**
   * 卡片状态（影响边框和标题颜色）
   * - 'default': 默认灰色
   * - 'success': 成功绿色（毛利率健康、ROI达标）
   * - 'warning': 警告黄色（边缘达标、需关注）
   * - 'danger': 危险红色（低于阈值、风险警告）
   */
  status?: StatCardStatus;

  /**
   * 辅助描述文字（可选）
   * 示例："已达到目标利润"、"需优化物流成本"
   */
  description?: string;

  /**
   * 自定义子元素（可选）
   * 用于渲染额外信息，如图表、详细说明等
   */
  children?: React.ReactNode;

  /**
   * 自定义className
   */
  className?: string;

  /**
   * 是否可点击（添加hover效果）
   */
  clickable?: boolean;

  /**
   * 点击事件（可选）
   */
  onClick?: () => void;
}

/**
 * 格式化数值
 */
function formatValue(value: number | string, format: StatCardFormat): string {
  if (format === 'custom') {
    return String(value);
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return String(value);
  }

  switch (format) {
    case 'usd':
      return formatUSD(numValue);
    case 'percent':
      // 如果数值小于1，假定是小数形式（如0.4523），需要乘以100
      // 如果数值大于等于1，假定已是百分比形式（如45.23）
      const percentValue = numValue < 1 ? numValue * 100 : numValue;
      return `${formatNumber(percentValue, 2)}%`;
    case 'number':
    default:
      return formatNumber(numValue, 2);
  }
}

/**
 * 获取状态样式
 */
function getStatusStyles(status: StatCardStatus): {
  borderColor: string;
  titleColor: string;
  valueColor: string;
} {
  switch (status) {
    case 'success':
      return {
        borderColor: 'border-l-4 border-l-green-500',
        titleColor: 'text-green-700',
        valueColor: 'text-green-600',
      };
    case 'warning':
      return {
        borderColor: 'border-l-4 border-l-yellow-500',
        titleColor: 'text-yellow-700',
        valueColor: 'text-yellow-600',
      };
    case 'danger':
      return {
        borderColor: 'border-l-4 border-l-red-500',
        titleColor: 'text-red-700',
        valueColor: 'text-red-600',
      };
    case 'default':
    default:
      return {
        borderColor: 'border-l-4 border-l-gray-300',
        titleColor: 'text-gray-700',
        valueColor: 'text-gray-900',
      };
  }
}

/**
 * 获取趋势图标和颜色
 */
function getTrendStyles(trend: StatCardTrend): {
  icon: React.ReactNode;
  color: string;
} {
  switch (trend) {
    case 'up':
      return {
        icon: <TrendingUp className="h-4 w-4" />,
        color: 'text-green-600',
      };
    case 'down':
      return {
        icon: <TrendingDown className="h-4 w-4" />,
        color: 'text-red-600',
      };
    case 'neutral':
      return {
        icon: <Minus className="h-4 w-4" />,
        color: 'text-gray-500',
      };
  }
}

/**
 * StatCard组件
 *
 * 特性：
 * - 继承GlassCard的Liquid Glass设计
 * - 自动数值格式化（USD/百分比/千位分隔符）
 * - 趋势指示（上升/下降/无变化）
 * - 状态颜色映射（成功/警告/危险）
 * - 等宽数字字体（tabular-nums）
 * - 响应式布局
 */
export default function StatCard({
  title,
  value,
  format = 'number',
  trend,
  delta,
  status = 'default',
  description,
  children,
  className,
  clickable = false,
  onClick,
}: StatCardProps) {
  const statusStyles = getStatusStyles(status);
  const trendStyles = trend ? getTrendStyles(trend) : null;
  const formattedValue = formatValue(value, format);

  return (
    <GlassCard
      variant="solid"
      shadow="md"
      hover={clickable}
      clickable={clickable}
      padding="md"
      className={cn(
        statusStyles.borderColor,
        'transition-all duration-300',
        className
      )}
      onClick={onClick}
    >
      {/* 标题 */}
      <div className={cn('text-sm font-medium mb-2', statusStyles.titleColor)}>
        {title}
      </div>

      {/* 数值 + 趋势 */}
      <div className="flex items-baseline gap-2">
        {/* 主数值 */}
        <div
          className={cn(
            'text-3xl font-bold tabular-nums',
            statusStyles.valueColor
          )}
        >
          {formattedValue}
        </div>

        {/* 趋势指示 */}
        {trendStyles && delta !== undefined && (
          <div
            className={cn(
              'flex items-center gap-1 text-sm font-medium',
              trendStyles.color
            )}
          >
            {trendStyles.icon}
            <span className="tabular-nums">
              {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}
              {formatNumber(Math.abs(delta), 1)}%
            </span>
          </div>
        )}
      </div>

      {/* 描述文字 */}
      {description && (
        <div className="text-xs text-gray-600 mt-2 leading-relaxed">
          {description}
        </div>
      )}

      {/* 自定义子元素 */}
      {children && <div className="mt-3">{children}</div>}
    </GlassCard>
  );
}

/**
 * 便捷导出：预设状态卡片
 *
 * @example
 * ```tsx
 * <StatCard.Success
 *   title="毛利率"
 *   value={45.2}
 *   format="percent"
 *   trend="up"
 *   delta={5.3}
 * />
 *
 * <StatCard.Warning
 *   title="库存周转率"
 *   value={3.2}
 *   trend="down"
 *   delta={2.1}
 * />
 *
 * <StatCard.Danger
 *   title="退货率"
 *   value={8.5}
 *   format="percent"
 *   trend="up"
 *   delta={1.2}
 * />
 * ```
 */
StatCard.Success = (props: Omit<StatCardProps, 'status'>) => (
  <StatCard status="success" {...props} />
);

StatCard.Warning = (props: Omit<StatCardProps, 'status'>) => (
  <StatCard status="warning" {...props} />
);

StatCard.Danger = (props: Omit<StatCardProps, 'status'>) => (
  <StatCard status="danger" {...props} />
);

/**
 * 便捷导出：预设格式卡片
 *
 * @example
 * ```tsx
 * <StatCard.USD
 *   title="单位利润"
 *   value={12.50}
 *   trend="up"
 *   delta={5.3}
 * />
 *
 * <StatCard.Percent
 *   title="毛利率"
 *   value={0.452}
 *   status="success"
 * />
 *
 * <StatCard.Number
 *   title="月销量"
 *   value={1234}
 *   trend="up"
 *   delta={15.2}
 * />
 * ```
 */
StatCard.USD = (props: Omit<StatCardProps, 'format'>) => (
  <StatCard format="usd" {...props} />
);

StatCard.Percent = (props: Omit<StatCardProps, 'format'>) => (
  <StatCard format="percent" {...props} />
);

StatCard.Number = (props: Omit<StatCardProps, 'format'>) => (
  <StatCard format="number" {...props} />
);

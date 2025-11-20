/**
 * GlassCard组件 - Liquid Glass设计语言卡片
 *
 * 设计语言：Liquid Glass（毛玻璃效果 + 多层阴影）
 * 参考：Apple级别体验、现代高端SaaS产品
 *
 * 核心特性：
 * - 毛玻璃效果（backdrop-filter: blur）
 * - 多层阴影系统（shadow-glass系列）
 * - 平滑过渡动画
 * - Hover状态反馈（scale + shadow增强）
 * - 响应式布局
 *
 * @example
 * ```tsx
 * <GlassCard>
 *   <h3>标题</h3>
 *   <p>内容</p>
 * </GlassCard>
 *
 * <GlassCard variant="bordered" shadow="lg" hover>
 *   高级卡片
 * </GlassCard>
 * ```
 */

import React from 'react';
import { cn } from '@/lib/utils';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 卡片变体
   * - 'default': 默认毛玻璃效果（透明背景 + blur）
   * - 'solid': 实心卡片（白色背景，无blur）
   * - 'bordered': 带边框卡片
   * - 'gradient': 渐变背景卡片
   */
  variant?: 'default' | 'solid' | 'bordered' | 'gradient';

  /**
   * 阴影等级
   * - 'none': 无阴影
   * - 'sm': 小阴影（shadow-glass-sm）
   * - 'md': 中阴影（shadow-glass-md，默认）
   * - 'lg': 大阴影（shadow-glass-lg）
   * - 'xl': 超大阴影（shadow-glass-xl）
   */
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * 圆角大小
   * - 'sm': 8px（rounded-lg）
   * - 'md': 12px（rounded-xl，默认）
   * - 'lg': 16px（rounded-glass）
   * - 'xl': 24px（rounded-glass-lg）
   */
  rounded?: 'sm' | 'md' | 'lg' | 'xl';

  /**
   * 是否启用Hover效果
   * - true: 轻微放大（scale-105）+ 阴影增强
   * - false: 无Hover效果
   */
  hover?: boolean;

  /**
   * 是否可点击（添加cursor-pointer + active状态）
   */
  clickable?: boolean;

  /**
   * 内边距大小
   * - 'none': 无内边距（p-0）
   * - 'sm': 小内边距（p-3）
   * - 'md': 中内边距（p-4，默认）
   * - 'lg': 大内边距（p-6）
   * - 'xl': 超大内边距（p-8）
   */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * 自定义className（会与默认样式合并）
   */
  className?: string;

  /**
   * 子元素
   */
  children?: React.ReactNode;
}

/**
 * 获取变体样式
 */
function getVariantStyles(variant: GlassCardProps['variant']): string {
  switch (variant) {
    case 'solid':
      return 'bg-white';
    case 'bordered':
      return 'bg-white/90 backdrop-blur-glass border-2 border-gray-200';
    case 'gradient':
      return 'bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-glass';
    case 'default':
    default:
      return 'bg-white/90 backdrop-blur-glass';
  }
}

/**
 * 获取阴影样式
 */
function getShadowStyles(shadow: GlassCardProps['shadow']): string {
  switch (shadow) {
    case 'none':
      return '';
    case 'sm':
      return 'shadow-glass-sm';
    case 'lg':
      return 'shadow-glass-lg';
    case 'xl':
      return 'shadow-glass-xl';
    case 'md':
    default:
      return 'shadow-glass-md';
  }
}

/**
 * 获取圆角样式
 */
function getRoundedStyles(rounded: GlassCardProps['rounded']): string {
  switch (rounded) {
    case 'sm':
      return 'rounded-lg'; // 8px
    case 'lg':
      return 'rounded-glass'; // 16px
    case 'xl':
      return 'rounded-glass-lg'; // 24px
    case 'md':
    default:
      return 'rounded-xl'; // 12px
  }
}

/**
 * 获取内边距样式
 */
function getPaddingStyles(padding: GlassCardProps['padding']): string {
  switch (padding) {
    case 'none':
      return 'p-0';
    case 'sm':
      return 'p-3';
    case 'lg':
      return 'p-6';
    case 'xl':
      return 'p-8';
    case 'md':
    default:
      return 'p-4';
  }
}

/**
 * GlassCard组件
 *
 * 高端Liquid Glass设计语言卡片组件
 */
export default function GlassCard({
  variant = 'default',
  shadow = 'md',
  rounded = 'md',
  hover = false,
  clickable = false,
  padding = 'md',
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        // 基础样式
        'relative',
        'overflow-hidden',
        // 变体样式
        getVariantStyles(variant),
        // 阴影样式
        getShadowStyles(shadow),
        // 圆角样式
        getRoundedStyles(rounded),
        // 内边距样式
        getPaddingStyles(padding),
        // 过渡动画
        'transition-all duration-300 ease-in-out',
        // Hover效果
        hover && [
          'hover:scale-105',
          'hover:shadow-glass-lg',
          shadow === 'xl' && 'hover:shadow-glass-xl',
        ],
        // 可点击样式
        clickable && [
          'cursor-pointer',
          'active:scale-[0.98]',
          'active:shadow-glass',
        ],
        // 自定义className
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * 便捷导出：预设卡片变体
 *
 * @example
 * ```tsx
 * <GlassCard.Solid>实心卡片</GlassCard.Solid>
 * <GlassCard.Bordered>带边框卡片</GlassCard.Bordered>
 * <GlassCard.Gradient>渐变背景卡片</GlassCard.Gradient>
 * <GlassCard.Clickable onClick={handleClick}>可点击卡片</GlassCard.Clickable>
 * ```
 */
GlassCard.Solid = (props: Omit<GlassCardProps, 'variant'>) => (
  <GlassCard variant="solid" {...props} />
);

GlassCard.Bordered = (props: Omit<GlassCardProps, 'variant'>) => (
  <GlassCard variant="bordered" {...props} />
);

GlassCard.Gradient = (props: Omit<GlassCardProps, 'variant'>) => (
  <GlassCard variant="gradient" {...props} />
);

GlassCard.Clickable = (props: Omit<GlassCardProps, 'clickable' | 'hover'>) => (
  <GlassCard clickable hover {...props} />
);

/**
 * GlassCardHeader - 卡片头部组件
 */
export function GlassCardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex flex-col space-y-1.5',
        'border-b border-gray-200/50',
        'pb-3 mb-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * GlassCardTitle - 卡片标题组件
 */
export function GlassCardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'text-lg font-semibold leading-none tracking-tight',
        'text-gray-900',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

/**
 * GlassCardDescription - 卡片描述组件
 */
export function GlassCardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        'text-sm text-gray-600',
        'leading-relaxed',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

/**
 * GlassCardContent - 卡片内容组件
 */
export function GlassCardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * GlassCardFooter - 卡片底部组件
 */
export function GlassCardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center',
        'border-t border-gray-200/50',
        'pt-3 mt-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

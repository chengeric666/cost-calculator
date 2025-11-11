/**
 * 工具函数库
 *
 * 提供项目通用的工具函数
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn - 合并Tailwind CSS类名的工具函数
 *
 * 使用clsx合并条件类名，使用twMerge处理Tailwind类冲突
 *
 * @example
 * ```tsx
 * cn('px-2 py-1', condition && 'bg-blue-500', 'text-white')
 * // => "px-2 py-1 bg-blue-500 text-white" (如果condition为true)
 * ```
 *
 * @param inputs - 类名数组（支持条件类名）
 * @returns 合并后的类名字符串
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 格式化美元金额
 *
 * @param amount - 金额数值
 * @param options - 格式化选项
 * @returns 格式化后的美元字符串
 *
 * @example
 * ```tsx
 * formatUSD(1234.56) // => "$1,234.56"
 * formatUSD(1234.56, { decimals: 0 }) // => "$1,235"
 * formatUSD(0.5, { showCents: false }) // => "$1"
 * ```
 */
export function formatUSD(
  amount: number,
  options?: {
    decimals?: number;
    showCents?: boolean;
    showSymbol?: boolean;
  }
): string {
  const {
    decimals = 2,
    showCents = true,
    showSymbol = true,
  } = options || {};

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: showCents ? decimals : 0,
    maximumFractionDigits: showCents ? decimals : 0,
  }).format(amount);

  return showSymbol ? formatted : formatted.replace('$', '');
}

/**
 * 格式化百分比
 *
 * @param value - 百分比数值（0.25 => 25%）
 * @param decimals - 小数位数
 * @returns 格式化后的百分比字符串
 *
 * @example
 * ```tsx
 * formatPercent(0.2567) // => "25.67%"
 * formatPercent(0.2567, 0) // => "26%"
 * formatPercent(0.2567, 1) // => "25.7%"
 * ```
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * 格式化数字（添加千位分隔符）
 *
 * @param value - 数值
 * @param decimals - 小数位数
 * @returns 格式化后的数字字符串
 *
 * @example
 * ```tsx
 * formatNumber(1234567.89) // => "1,234,567.89"
 * formatNumber(1234567.89, 0) // => "1,234,568"
 * ```
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * 防抖函数
 *
 * @param func - 要防抖的函数
 * @param wait - 等待时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数
 *
 * @param func - 要节流的函数
 * @param limit - 时间限制（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

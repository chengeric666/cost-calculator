/**
 * GECOM报告生成系统 - 数据格式化工具
 *
 * 职责：
 * - 统一的数据格式化函数
 * - 货币、百分比、数字、日期格式化
 * - 边界情况处理（null, 0, 负数）
 *
 * @module report/utils/formatters
 * @created 2025-11-14
 * @author GECOM Team
 */

/**
 * 格式化货币
 *
 * @param value 数值
 * @param currency 货币代码（默认：USD）
 * @param decimals 小数位数（默认：2）
 * @returns 格式化后的货币字符串
 *
 * @example
 * ```typescript
 * formatCurrency(1234.56);        // "$1,234.56"
 * formatCurrency(1234.56, 'EUR'); // "€1,234.56"
 * formatCurrency(-100);           // "-$100.00"
 * formatCurrency(0);              // "$0.00"
 * formatCurrency(null);           // "$0.00"
 * ```
 */
export function formatCurrency(
  value: number | null | undefined,
  currency: string = 'USD',
  decimals: number = 2
): string {
  // 边界情况处理
  const numValue = value ?? 0;

  // 货币符号映射
  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    VND: '₫',
    SGD: 'S$',
    MYR: 'RM',
    THB: '฿',
    AUD: 'A$',
    CAD: 'C$',
    KRW: '₩',
    INR: '₹',
    SAR: 'SR',
    AED: 'AED',
    MXN: 'MX$',
    BRL: 'R$',
  };

  const symbol = currencySymbols[currency] || currency;

  // 负数处理
  const isNegative = numValue < 0;
  const absValue = Math.abs(numValue);

  // 格式化数字（带千分位）
  const formatted = absValue.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  // 返回格式化结果
  return isNegative ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
}

/**
 * 格式化百分比
 *
 * @param value 数值（0.35 表示 35%）
 * @param decimals 小数位数（默认：1）
 * @param includeSign 是否包含+/-符号（默认：false）
 * @returns 格式化后的百分比字符串
 *
 * @example
 * ```typescript
 * formatPercentage(0.35);             // "35.0%"
 * formatPercentage(0.352);            // "35.2%"
 * formatPercentage(0.352, 2);         // "35.20%"
 * formatPercentage(-0.1);             // "-10.0%"
 * formatPercentage(0.05, 1, true);    // "+5.0%"
 * formatPercentage(0);                // "0.0%"
 * formatPercentage(null);             // "0.0%"
 * ```
 */
export function formatPercentage(
  value: number | null | undefined,
  decimals: number = 1,
  includeSign: boolean = false
): string {
  // 边界情况处理
  const numValue = value ?? 0;

  // 转换为百分比
  const percentage = numValue * 100;

  // 格式化小数位
  const formatted = percentage.toFixed(decimals);

  // 添加+/-符号（如果需要）
  if (includeSign && percentage > 0) {
    return `+${formatted}%`;
  }

  return `${formatted}%`;
}

/**
 * 格式化数字
 *
 * @param value 数值
 * @param decimals 小数位数（默认：0）
 * @param useThousandsSeparator 是否使用千分位分隔符（默认：true）
 * @returns 格式化后的数字字符串
 *
 * @example
 * ```typescript
 * formatNumber(1234567);              // "1,234,567"
 * formatNumber(1234.567, 2);          // "1,234.57"
 * formatNumber(1234567, 0, false);    // "1234567"
 * formatNumber(-1000);                // "-1,000"
 * formatNumber(0);                    // "0"
 * formatNumber(null);                 // "0"
 * ```
 */
export function formatNumber(
  value: number | null | undefined,
  decimals: number = 0,
  useThousandsSeparator: boolean = true
): string {
  // 边界情况处理
  const numValue = value ?? 0;

  // 格式化
  if (useThousandsSeparator) {
    return numValue.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  } else {
    return numValue.toFixed(decimals);
  }
}

/**
 * 格式化日期
 *
 * @param date 日期对象或字符串
 * @param locale 语言环境（默认：zh-CN）
 * @param format 格式类型（默认：full）
 * @returns 格式化后的日期字符串
 *
 * @example
 * ```typescript
 * formatDate(new Date('2025-11-14'));                    // "2025年11月14日"
 * formatDate(new Date('2025-11-14'), 'zh-CN', 'short'); // "2025-11-14"
 * formatDate(new Date('2025-11-14'), 'en-US', 'full');  // "November 14, 2025"
 * formatDate('2025-11-14');                              // "2025年11月14日"
 * formatDate(null);                                      // "未知日期"
 * ```
 */
export function formatDate(
  date: Date | string | null | undefined,
  locale: string = 'zh-CN',
  format: 'full' | 'short' | 'iso' = 'full'
): string {
  // 边界情况处理
  if (!date) {
    return '未知日期';
  }

  // 转换为Date对象
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // 检查日期有效性
  if (isNaN(dateObj.getTime())) {
    return '无效日期';
  }

  // 根据格式返回
  switch (format) {
    case 'iso':
      return dateObj.toISOString().split('T')[0]; // YYYY-MM-DD

    case 'short':
      if (locale === 'zh-CN') {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      } else {
        return dateObj.toLocaleDateString(locale);
      }

    case 'full':
    default:
      if (locale === 'zh-CN') {
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        return `${year}年${month}月${day}日`;
      } else {
        return dateObj.toLocaleDateString(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }
  }
}

/**
 * 格式化模块名称（M1-M8）
 *
 * @param module 模块代码（m1, m2, ..., m8）
 * @param includeNumber 是否包含模块编号（默认：true）
 * @returns 格式化后的模块名称
 *
 * @example
 * ```typescript
 * formatModuleName('m1');             // "M1: 市场准入"
 * formatModuleName('m4');             // "M4: 货物税费"
 * formatModuleName('m6', false);      // "营销获客"
 * formatModuleName('unknown');        // "未知模块"
 * ```
 */
export function formatModuleName(
  module: string,
  includeNumber: boolean = true
): string {
  const moduleNames: Record<string, string> = {
    m1: '市场准入',
    m2: '技术合规',
    m3: '供应链搭建',
    m4: '货物税费',
    m5: '物流配送',
    m6: '营销获客',
    m7: '支付手续费',
    m8: '运营管理',
  };

  const moduleName = moduleNames[module.toLowerCase()];

  if (!moduleName) {
    return '未知模块';
  }

  if (includeNumber) {
    return `${module.toUpperCase()}: ${moduleName}`;
  }

  return moduleName;
}

/**
 * 格式化大数字（K/M/B后缀）
 *
 * @param value 数值
 * @param decimals 小数位数（默认：1）
 * @returns 格式化后的字符串
 *
 * @example
 * ```typescript
 * formatLargeNumber(1500);           // "1.5K"
 * formatLargeNumber(1500000);        // "1.5M"
 * formatLargeNumber(1500000000);     // "1.5B"
 * formatLargeNumber(500);            // "500"
 * ```
 */
export function formatLargeNumber(
  value: number | null | undefined,
  decimals: number = 1
): string {
  const numValue = value ?? 0;
  const absValue = Math.abs(numValue);

  if (absValue >= 1000000000) {
    return (numValue / 1000000000).toFixed(decimals) + 'B';
  } else if (absValue >= 1000000) {
    return (numValue / 1000000).toFixed(decimals) + 'M';
  } else if (absValue >= 1000) {
    return (numValue / 1000).toFixed(decimals) + 'K';
  } else {
    return numValue.toFixed(0);
  }
}

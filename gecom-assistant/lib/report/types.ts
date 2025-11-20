/**
 * GECOM报告生成系统类型定义
 *
 * 职责：
 * - 定义报告生成所需的所有TypeScript接口
 * - 确保类型安全和代码可维护性
 *
 * @module report/types
 * @created 2025-11-14
 * @author GECOM Team
 */

import type { Project, Calculation, CostFactor } from '@/types/gecom';
import type { Paragraph } from 'docx';

/**
 * 报告生成器输入数据
 */
export interface ReportGeneratorInput {
  /** 项目基础信息 */
  project: Project;

  /** 成本计算结果 */
  calculation: Calculation;

  /** 成本因子数据（来自数据库或本地文件） */
  costFactor: CostFactor;
}

/**
 * 报告生成选项配置
 */
export interface ReportOptions {
  /** 报告语言（默认：中文） */
  language: 'zh-CN' | 'en-US';

  /** 是否包含图表（默认：true） */
  includeCharts: boolean;

  /** 图表质量（pixelRatio，默认：3 = 300 DPI） */
  chartQuality: number;

  /** 是否生成执行摘要（默认：true） */
  includeExecutiveSummary: boolean;

  /** 是否生成附录（默认：true） */
  includeAppendix: boolean;

  /** 是否调用AI生成第四章战略建议（默认：true） */
  useAI: boolean;

  /** 报告版本号（默认：基于日期生成） */
  version?: string;

  /** 自定义样式（默认：使用GECOM_STYLES） */
  customStyles?: any;
}

/**
 * 报告数据（原始数据收集）
 */
export interface ReportData {
  /** 项目信息 */
  project: Project;

  /** 计算结果 */
  calculation: Calculation;

  /** 成本因子 */
  costFactor: CostFactor;

  /** 生成时间 */
  generatedAt: Date;

  /** 报告版本 */
  version: string;
}

/**
 * 处理后的报告数据（用于模板生成）
 */
export interface ProcessedReportData {
  /** 原始数据 */
  raw: ReportData;

  /** 格式化后的项目信息 */
  formattedProject: {
    name: string;
    industry: string;
    industryDisplay: string; // "宠物食品" | "电子烟"
    targetCountry: string;
    targetCountryDisplay: string; // "美国" | "德国" 等
    salesChannel: string;
    salesChannelDisplay: string; // "亚马逊FBA" | "独立站" 等
  };

  /** 格式化后的单位经济模型 */
  formattedEconomics: {
    revenue: string; // "$15.99"
    cost: string; // "$23.17"
    profit: string; // "-$7.18"
    margin: string; // "-44.9%"
    marginColor: string; // "EF4444" (红色) 或 "10B981" (绿色)
  };

  /** 格式化后的KPI指标 */
  formattedKPI: {
    roi: string; // "-44.9%"
    paybackPeriod: string; // "无法回本" | "12.5个月"
    ltvCacRatio: string; // "0.85"
  };

  /** CAPEX分解 */
  capexBreakdown: {
    m1: { value: number; formatted: string; percentage: string };
    m2: { value: number; formatted: string; percentage: string };
    m3: { value: number; formatted: string; percentage: string };
    total: { value: number; formatted: string };
  };

  /** OPEX分解 */
  opexBreakdown: {
    m4: { value: number; formatted: string; percentage: string };
    m5: { value: number; formatted: string; percentage: string };
    m6: { value: number; formatted: string; percentage: string };
    m7: { value: number; formatted: string; percentage: string };
    m8: { value: number; formatted: string; percentage: string };
    total: { value: number; formatted: string };
  };

  /** 成本驱动因素（Top 3） */
  costDrivers: Array<{
    module: string; // "M4: 货物税费"
    value: number;
    formatted: string; // "$9.92"
    percentage: string; // "42.8%"
    reason: string; // "US关税55%（10% + 25% + 20%）"
  }>;

  /** 盈利能力状态 */
  profitabilityStatus: {
    isProfitable: boolean;
    message: string; // "✅ 盈利（毛利率 35.2%）" | "❌ 亏损（毛利率 -44.9%）"
    targetPriceFor30Margin: string; // "$33.10"
    priceIncreaseRequired: string; // "+107%"
  };

  /** 19国市场对比数据（用于第三章表3.1）*/
  multiCountryComparison?: Array<{
    country: string; // "US" | "DE" | "GB" 等
    countryName: string; // "美国" | "德国" | "英国" 等
    currency: string; // "USD" | "EUR" | "GBP" 等
    currencySymbol: string; // "$" | "€" | "£" 等
    retailPrice: number; // 15.99
    retailPriceFormatted: string; // "$15.99"
    unitCost: number; // 23.17
    unitCostFormatted: string; // "$23.17"
    grossProfit: number; // -7.18
    grossProfitFormatted: string; // "-$7.18"
    grossMargin: number; // -44.9
    grossMarginFormatted: string; // "-44.9%"
    marginColor: string; // "10B981" (绿色) | "F59E0B" (橙色) | "EF4444" (红色)
  }>;
}

/**
 * 图表图片数据
 */
export interface ChartImageData {
  /** 图片Buffer */
  buffer: ArrayBuffer;

  /** 图片宽度（像素） */
  width: number;

  /** 图片高度（像素） */
  height: number;

  /** 图片类型 */
  type: 'pie' | 'bar' | 'line';

  /** 图片标题 */
  caption?: string;
}

/**
 * 章节生成器函数类型
 */
export type ChapterGenerator = (data: ProcessedReportData) => Promise<Paragraph[]> | Paragraph[];

/**
 * 报告元数据
 */
export interface ReportMetadata {
  /** 报告ID */
  id: string;

  /** 项目ID */
  projectId: string;

  /** 生成时间 */
  generatedAt: Date;

  /** 报告版本 */
  version: string;

  /** 文件大小（字节） */
  fileSizeBytes?: number;

  /** 字数统计 */
  wordCount?: number;

  /** 图表数量 */
  chartCount?: number;

  /** 生成耗时（毫秒） */
  generationTimeMs?: number;
}

/**
 * 报告生成结果
 */
export interface ReportGenerationResult {
  /** 报告Blob */
  blob: Blob;

  /** 报告元数据 */
  metadata: ReportMetadata;

  /** 是否成功 */
  success: boolean;

  /** 错误信息（如果失败） */
  error?: string;
}

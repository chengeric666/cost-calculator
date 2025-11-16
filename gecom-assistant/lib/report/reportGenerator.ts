/**
 * GECOM报告生成器核心引擎
 *
 * 职责：
 * 1. 数据收集与预处理（Project + Calculation + CostFactor）
 * 2. 调用模板生成各章节内容
 * 3. 图表生成与嵌入（Recharts → PNG → ImageRun）
 * 4. AI调用（第四章战略建议，可选）
 * 5. 最终Word文档生成（docx.js）
 *
 * 设计原则：
 * - 单一职责：每个方法只做一件事
 * - 易测试：核心逻辑可单独测试
 * - 易扩展：新增章节不修改核心类
 * - 质量优先：详细注释、错误处理、日志记录
 *
 * @module report/reportGenerator
 * @created 2025-11-14
 * @author GECOM Team
 */

import { Document, Packer, Paragraph, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import type {
  ReportGeneratorInput,
  ReportOptions,
  ReportData,
  ProcessedReportData,
  ReportGenerationResult,
  ReportMetadata,
} from './types';
import { getCostFactorsByCountries } from '../appwrite-data';
import type { TargetCountry } from '@/types/gecom';
import { formatCurrency, formatPercentage } from './utils/formatters';

/**
 * GECOM报告生成器主类
 *
 * @example
 * ```typescript
 * const generator = new ReportGenerator({
 *   project,
 *   calculation,
 *   costFactor,
 * });
 *
 * // 生成并下载报告
 * await generator.generateAndDownload('gecom-report-2025-11-14.docx');
 *
 * // 或获取Blob进行自定义处理
 * const result = await generator.generateReport();
 * console.log('报告大小:', result.blob.size, '字节');
 * ```
 */
export class ReportGenerator {
  private input: ReportGeneratorInput;
  private options: ReportOptions;
  private startTime: number = 0;

  /**
   * 默认报告生成选项
   */
  private static readonly DEFAULT_OPTIONS: ReportOptions = {
    language: 'zh-CN',
    includeCharts: true,
    chartQuality: 3, // 300 DPI
    includeExecutiveSummary: true,
    includeAppendix: true,
    useAI: true,
  };

  /**
   * 创建报告生成器实例
   *
   * @param input 报告输入数据（项目、计算结果、成本因子）
   * @param options 报告生成选项（可选）
   *
   * @throws {Error} 如果输入数据缺失或无效
   */
  constructor(
    input: ReportGeneratorInput,
    options?: Partial<ReportOptions>
  ) {
    // 验证输入数据
    this.validateInput(input);

    this.input = input;
    this.options = {
      ...ReportGenerator.DEFAULT_OPTIONS,
      ...options,
    };

    // 自动生成版本号（如果未提供）
    if (!this.options.version) {
      this.options.version = this.generateVersionNumber();
    }
  }

  /**
   * 生成完整报告
   *
   * @returns 报告生成结果（包含Blob和元数据）
   *
   * @throws {Error} 如果报告生成失败
   */
  public async generateReport(): Promise<ReportGenerationResult> {
    this.startTime = Date.now();

    try {
      console.log('[ReportGenerator] 开始生成报告...');

      // Step 1: 收集数据
      console.log('[ReportGenerator] Step 1/5: 收集数据...');
      const rawData = await this.collectData();

      // Step 2: 预处理数据
      console.log('[ReportGenerator] Step 2/5: 预处理数据...');
      const processedData = await this.preprocessData(rawData);

      // Step 3: 生成章节
      console.log('[ReportGenerator] Step 3/5: 生成章节...');
      const chapters = await this.generateChapters(processedData);

      // Step 4: 创建Word文档
      console.log('[ReportGenerator] Step 4/5: 创建Word文档...');
      const document = await this.createDocument(chapters);

      // Step 5: 导出为Blob
      console.log('[ReportGenerator] Step 5/5: 导出为Blob...');
      const blob = await Packer.toBlob(document);

      // 生成元数据
      const metadata = this.generateMetadata(blob, chapters.length);

      console.log(`[ReportGenerator] 报告生成成功！耗时: ${metadata.generationTimeMs}ms`);

      return {
        blob,
        metadata,
        success: true,
      };
    } catch (error) {
      console.error('[ReportGenerator] 报告生成失败:', error);
      return {
        blob: new Blob(),
        metadata: this.generateMetadata(new Blob(), 0),
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * 生成并下载报告
   *
   * @param filename 文件名（默认：项目名称-日期.docx）
   *
   * @throws {Error} 如果报告生成或下载失败
   */
  public async generateAndDownload(filename?: string): Promise<void> {
    const result = await this.generateReport();

    if (!result.success) {
      throw new Error(`报告生成失败: ${result.error}`);
    }

    // 生成默认文件名
    const finalFilename = filename || this.generateDefaultFilename();

    // 下载文件
    saveAs(result.blob, finalFilename);

    console.log(`[ReportGenerator] 报告已下载: ${finalFilename}`);
  }

  // ========== 私有方法：数据处理流程 ==========

  /**
   * 收集报告所需的原始数据
   *
   * @returns 原始报告数据
   */
  private async collectData(): Promise<ReportData> {
    const { project, calculation, costFactor } = this.input;

    return {
      project,
      calculation,
      costFactor,
      generatedAt: new Date(),
      version: this.options.version!,
    };
  }

  /**
   * 获取国家货币符号映射（Task 24.2辅助方法）
   *
   * @param country 国家代码
   * @returns 货币符号和货币代码
   */
  private getCurrencyInfo(country: string): { symbol: string; code: string } {
    const currencyMap: Record<string, { symbol: string; code: string }> = {
      US: { symbol: '$', code: 'USD' },
      DE: { symbol: '€', code: 'EUR' },
      GB: { symbol: '£', code: 'GBP' },
      FR: { symbol: '€', code: 'EUR' },
      VN: { symbol: '₫', code: 'VND' },
      TH: { symbol: '฿', code: 'THB' },
      MY: { symbol: 'RM', code: 'MYR' },
      PH: { symbol: '₱', code: 'PHP' },
      ID: { symbol: 'Rp', code: 'IDR' },
      IN: { symbol: '₹', code: 'INR' },
      JP: { symbol: '¥', code: 'JPY' },
      KR: { symbol: '₩', code: 'KRW' },
      AU: { symbol: 'A$', code: 'AUD' },
      SA: { symbol: 'SR', code: 'SAR' },
      AE: { symbol: 'AED', code: 'AED' },
      CA: { symbol: 'C$', code: 'CAD' },
      MX: { symbol: 'MX$', code: 'MXN' },
      BR: { symbol: 'R$', code: 'BRL' },
      SG: { symbol: 'S$', code: 'SGD' },
    };
    return currencyMap[country] || { symbol: '$', code: 'USD' };
  }

  /**
   * 预处理数据：格式化、计算衍生字段
   *
   * @param rawData 原始报告数据
   * @returns 处理后的报告数据
   */
  private async preprocessData(rawData: ReportData): Promise<ProcessedReportData> {
    // Day 24实现完整的数据预处理逻辑

    const { project, calculation } = rawData;

    // Task 24.2: 获取19国成本数据用于对比分析
    let multiCountryComparison: ProcessedReportData['multiCountryComparison'] = undefined;

    try {
      console.log('[ReportGenerator] Task 24.2: 获取19国成本数据用于对比分析...');

      // 19国列表
      const countries: TargetCountry[] = [
        'US', 'DE', 'GB', 'FR', 'VN', 'TH', 'MY', 'PH', 'ID',
        'IN', 'JP', 'KR', 'AU', 'SA', 'AE', 'CA', 'MX', 'BR', 'SG'
      ];

      // 批量获取成本因子
      const costFactors = await getCostFactorsByCountries(
        countries,
        project.industry || 'pet_food',
        '2025Q1'
      );

      console.log(`[ReportGenerator] 成功获取 ${costFactors.length}/19 国家成本数据`);

      // 计算每个国家的单位经济模型
      const basePrice = calculation.scope?.sellingPriceUsd || 15.99;

      multiCountryComparison = costFactors.map(cf => {
        // 简化计算：使用OPEX总成本（M4-M8）
        const unitCost = (cf.m4_cogs || 5.0) +
          (cf.m4_tariff_cost || 0) +
          (cf.m4_vat_cost || 0) +
          (cf.m4_logistics_cost || 0) +
          (cf.m5_last_mile_delivery_usd || 0) +
          (cf.m5_return_logistics_usd || 0) +
          (cf.m6_cac_usd || 0) +
          (cf.m7_payment_gateway_fee_usd || 0) +
          (cf.m7_platform_commission_usd || 0) +
          (cf.m8_customer_service_usd || 0) +
          (cf.m8_ga_cost_usd || 0);

        const grossProfit = basePrice - unitCost;
        const grossMargin = basePrice > 0 ? (grossProfit / basePrice) * 100 : 0;

        // 颜色映射：≥30%绿色，0-30%橙色，<0%红色
        let marginColor = 'EF4444'; // 红色
        if (grossMargin >= 30) {
          marginColor = '10B981'; // 绿色
        } else if (grossMargin >= 0) {
          marginColor = 'F59E0B'; // 橙色
        }

        const currencyInfo = this.getCurrencyInfo(cf.country);

        return {
          country: cf.country,
          countryName: cf.country_name_cn || cf.country,
          currency: currencyInfo.code,
          currencySymbol: currencyInfo.symbol,
          retailPrice: basePrice,
          retailPriceFormatted: formatCurrency(basePrice, currencyInfo.symbol),
          unitCost,
          unitCostFormatted: formatCurrency(unitCost, currencyInfo.symbol),
          grossProfit,
          grossProfitFormatted: formatCurrency(grossProfit, currencyInfo.symbol),
          grossMargin,
          grossMarginFormatted: formatPercentage(grossMargin),
          marginColor,
        };
      });

      // 按毛利率降序排序
      multiCountryComparison.sort((a, b) => b.grossMargin - a.grossMargin);

      console.log('[ReportGenerator] 19国对比数据处理完成');
    } catch (error) {
      console.error('[ReportGenerator] 获取19国数据失败:', error);
      // 如果失败，继续生成报告，但multiCountryComparison为undefined
    }

    return {
      raw: rawData,
      multiCountryComparison,

      formattedProject: {
        name: project.name || '未命名项目',
        industry: project.industry || 'pet_food',
        industryDisplay: this.getIndustryDisplay(project.industry),
        targetCountry: project.targetCountry || 'US',
        targetCountryDisplay: this.getCountryDisplay(project.targetCountry),
        salesChannel: project.salesChannel || 'amazon',
        salesChannelDisplay: this.getSalesChannelDisplay(project.salesChannel),
      },

      formattedEconomics: {
        revenue: '$0.00',
        cost: '$0.00',
        profit: '$0.00',
        margin: '0.0%',
        marginColor: '6B7280', // 灰色（占位符）
      },

      formattedKPI: {
        roi: '0.0%',
        paybackPeriod: '计算中',
        ltvCacRatio: '0.00',
      },

      capexBreakdown: {
        m1: { value: 0, formatted: '$0.00', percentage: '0.0%' },
        m2: { value: 0, formatted: '$0.00', percentage: '0.0%' },
        m3: { value: 0, formatted: '$0.00', percentage: '0.0%' },
        total: { value: 0, formatted: '$0.00' },
      },

      opexBreakdown: {
        m4: { value: 0, formatted: '$0.00', percentage: '0.0%' },
        m5: { value: 0, formatted: '$0.00', percentage: '0.0%' },
        m6: { value: 0, formatted: '$0.00', percentage: '0.0%' },
        m7: { value: 0, formatted: '$0.00', percentage: '0.0%' },
        m8: { value: 0, formatted: '$0.00', percentage: '0.0%' },
        total: { value: 0, formatted: '$0.00' },
      },

      costDrivers: [],

      profitabilityStatus: {
        isProfitable: false,
        message: '计算中',
        targetPriceFor30Margin: '$0.00',
        priceIncreaseRequired: '0.0%',
      },
    };
  }

  /**
   * 生成所有章节内容
   *
   * @param data 处理后的报告数据
   * @returns 章节Paragraph数组
   */
  private async generateChapters(data: ProcessedReportData): Promise<Paragraph[]> {
    const chapters: Paragraph[] = [];

    // Day 21: 生成封面和目录 ✅
    console.log('[ReportGenerator] 生成封面页...');
    const { generateCoverPage } = await import('./templates/cover-page');
    chapters.push(...generateCoverPage(data));

    console.log('[ReportGenerator] 生成目录...');
    const { generateTableOfContents } = await import('./templates/table-of-contents');
    chapters.push(...generateTableOfContents());

    // Day 22: 执行摘要 + 第一章 ✅
    if (this.options.includeExecutiveSummary) {
      console.log('[ReportGenerator] 生成执行摘要...');
      const { generateExecutiveSummary } = await import('./templates/executive-summary');
      chapters.push(...generateExecutiveSummary(data));
    }

    console.log('[ReportGenerator] 生成第一章：项目概况...');
    const { generateChapter1Overview } = await import('./templates/chapter-1-overview');
    chapters.push(...generateChapter1Overview(data));

    // Day 23: 第二章成本拆解 ✅
    console.log('[ReportGenerator] 生成第二章：成本结构拆解...');
    const { generateChapter2CostBreakdown } = await import('./templates/chapter-2-cost-breakdown');
    chapters.push(...generateChapter2CostBreakdown(data));

    // Day 24: 第三章财务分析 ⏳
    console.log('[ReportGenerator] 生成第三章：财务分析与市场对比...');
    const { generateChapter3FinancialAnalysis } = await import('./templates/chapter-3-financial-analysis');
    chapters.push(...generateChapter3FinancialAnalysis(data));

    // TODO: Day 25 - 第四章（AI生成）
    // if (this.options.useAI) {
    //   const { generateChapter4 } = await import('./templates/chapter-4-strategy');
    //   chapters.push(...generateChapter4(data));
    // }

    // TODO: Day 26 - 附录
    // if (this.options.includeAppendix) {
    //   const { generateAppendixA } = await import('./templates/appendix-a-details');
    //   const { generateAppendixB } = await import('./templates/appendix-b-sources');
    //   const { generateAppendixC } = await import('./templates/appendix-c-methodology');
    //   chapters.push(...generateAppendixA(data));
    //   chapters.push(...generateAppendixB(data));
    //   chapters.push(...generateAppendixC(data));
    // }

    // Day 25-26占位：后续章节将逐步添加
    chapters.push(
      new Paragraph({
        text: '第四章：智能优化建议（待Day 25实现）',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
        pageBreakBefore: true,
      }),
      new Paragraph({
        text: '本章将由DeepSeek R1 AI模型基于成本数据生成战略优化建议。Day 25完成时自动生成。',
        spacing: { after: 400 },
      })
    );

    return chapters;
  }

  /**
   * 创建Word文档
   *
   * @param chapters 章节Paragraph数组
   * @returns Word文档对象
   */
  private async createDocument(chapters: Paragraph[]): Promise<Document> {
    // 应用GECOM统一样式
    const { GECOM_STYLES } = await import('./utils/styles');

    return new Document({
      styles: GECOM_STYLES,
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440, // 1英寸
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children: chapters,
        },
      ],
    });
  }

  // ========== 私有方法：辅助工具 ==========

  /**
   * 验证输入数据
   *
   * @param input 输入数据
   * @throws {Error} 如果数据无效
   */
  private validateInput(input: ReportGeneratorInput): void {
    if (!input) {
      throw new Error('报告输入数据不能为空');
    }

    if (!input.project) {
      throw new Error('项目信息不能为空');
    }

    if (!input.calculation) {
      throw new Error('计算结果不能为空');
    }

    if (!input.costFactor) {
      throw new Error('成本因子不能为空');
    }
  }

  /**
   * 生成报告版本号
   *
   * @returns 版本号（格式：v2025Q4）
   */
  private generateVersionNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const quarter = Math.floor(now.getMonth() / 3) + 1;
    return `v${year}Q${quarter}`;
  }

  /**
   * 生成默认文件名
   *
   * @returns 文件名（格式：项目名称-日期.docx）
   */
  private generateDefaultFilename(): string {
    const { project } = this.input;
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const safeName = (project.name || 'gecom-report').replace(/[^a-zA-Z0-9\u4e00-\u9fa5-]/g, '_');
    return `${safeName}-${date}.docx`;
  }

  /**
   * 生成报告元数据
   *
   * @param blob 报告Blob
   * @param chapterCount 章节数量
   * @returns 报告元数据
   */
  private generateMetadata(blob: Blob, chapterCount: number): ReportMetadata {
    const generationTime = Date.now() - this.startTime;

    return {
      id: `report-${Date.now()}`,
      projectId: this.input.project.id || 'unknown',
      generatedAt: new Date(),
      version: this.options.version!,
      fileSizeBytes: blob.size,
      chartCount: 0, // TODO: Day 23统计图表数量
      generationTimeMs: generationTime,
    };
  }

  /**
   * 获取行业显示名称
   */
  private getIndustryDisplay(industry?: string): string {
    const map: Record<string, string> = {
      pet_food: '宠物食品',
      vape: '电子烟',
    };
    return map[industry || 'pet_food'] || industry || '未知行业';
  }

  /**
   * 获取国家显示名称
   */
  private getCountryDisplay(country?: string): string {
    const map: Record<string, string> = {
      US: '美国',
      UK: '英国',
      DE: '德国',
      FR: '法国',
      JP: '日本',
      VN: '越南',
      // TODO: 补充其他19国
    };
    return map[country || 'US'] || country || '未知国家';
  }

  /**
   * 获取销售渠道显示名称
   */
  private getSalesChannelDisplay(channel?: string): string {
    const map: Record<string, string> = {
      amazon: '亚马逊（FBA）',
      independent: '独立站',
      tiktok: 'TikTok Shop',
      shopee: 'Shopee',
    };
    return map[channel || 'amazon'] || channel || '未知渠道';
  }
}

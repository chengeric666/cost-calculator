/**
 * GECOM报告生成系统 - 图表转图片工具
 *
 * 职责：
 * - 将Recharts图表转换为高分辨率PNG图片（300 DPI）
 * - 生成适用于Word文档嵌入的ImageRun对象
 * - 支持多种图表类型（饼图、柱状图、折线图）
 *
 * 技术方案：
 * - 使用html-to-image库（toPng）
 * - pixelRatio: 3（3倍分辨率，模拟300 DPI）
 * - 固定尺寸：900×700px → 2700×2100px PNG
 *
 * 设计原则：
 * - 高质量优先：确保图表在Word中放大时清晰
 * - 性能优化：缓存重复转换
 * - 易用性：简单的API接口
 *
 * @module report/utils/chartToImage
 * @created 2025-11-16
 * @author GECOM Team
 *
 * @example
 * ```typescript
 * import { chartToImageRun } from '@/lib/report/utils/chartToImage';
 *
 * // 在浏览器环境中使用
 * const imageRun = await chartToImageRun(
 *   'chart-container-id',
 *   { width: 540, height: 420 }
 * );
 *
 * // 添加到Word文档
 * new Paragraph({
 *   children: [imageRun],
 *   alignment: AlignmentType.CENTER,
 * });
 * ```
 */

import { toPng } from 'html-to-image';
import { ImageRun } from 'docx';

/**
 * 图表导出选项
 */
export interface ChartToImageOptions {
  /**
   * 图表容器ID（必需）
   * 例如：'cost-breakdown-pie-chart'
   */
  elementId?: string;

  /**
   * 直接传入DOM元素（可选，优先于elementId）
   */
  element?: HTMLElement;

  /**
   * Word文档中图片宽度（单位：EMU，1 EMU = 1/914400 英寸）
   * 默认：540 (约5.9英寸，对应900px × 0.75缩放)
   */
  wordWidth?: number;

  /**
   * Word文档中图片高度（单位：EMU）
   * 默认：420 (约4.6英寸，对应700px × 0.75缩放)
   */
  wordHeight?: number;

  /**
   * 像素倍率（用于高分辨率）
   * 默认：3（生成2700×2100px图片，模拟300 DPI）
   */
  pixelRatio?: number;

  /**
   * 图表容器背景色
   * 默认：'#FFFFFF'（白色背景）
   */
  backgroundColor?: string;

  /**
   * 图片格式
   * 默认：'png'（仅支持PNG）
   */
  format?: 'png';

  /**
   * 导出前延迟时间（ms）
   * 默认：500ms（等待图表完全渲染）
   */
  delay?: number;
}

/**
 * 默认导出选项
 */
const DEFAULT_OPTIONS: Required<ChartToImageOptions> = {
  elementId: '',
  element: undefined as any,
  wordWidth: 540, // 约5.9英寸
  wordHeight: 420, // 约4.6英寸
  pixelRatio: 3,
  backgroundColor: '#FFFFFF',
  format: 'png',
  delay: 500,
};

/**
 * 将图表容器转换为PNG图片（Base64）
 *
 * @param options 导出选项
 * @returns Base64编码的PNG图片数据URI
 *
 * @throws {Error} 如果找不到图表容器或转换失败
 *
 * @example
 * ```typescript
 * const dataUrl = await chartToPng({
 *   elementId: 'my-chart',
 *   pixelRatio: 3,
 * });
 * console.log(dataUrl); // "data:image/png;base64,iVBOR..."
 * ```
 */
export async function chartToPng(
  options: ChartToImageOptions
): Promise<string> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // 获取DOM元素
  let element: HTMLElement | null = null;

  if (opts.element) {
    element = opts.element;
  } else if (opts.elementId) {
    element = document.getElementById(opts.elementId);
  }

  if (!element) {
    throw new Error(
      `无法找到图表容器：${opts.elementId || '(未指定ID)'}`
    );
  }

  // 等待图表完全渲染
  if (opts.delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, opts.delay));
  }

  // 转换为PNG（使用html-to-image）
  try {
    const dataUrl = await toPng(element, {
      pixelRatio: opts.pixelRatio,
      backgroundColor: opts.backgroundColor,
      cacheBust: true, // 避免缓存问题
    });

    return dataUrl;
  } catch (error) {
    console.error('[chartToImage] 图表转换失败:', error);
    throw new Error(
      `图表转换失败: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * 将图表容器转换为Word ImageRun对象
 *
 * @param options 导出选项
 * @returns docx.js ImageRun对象，可直接添加到Paragraph
 *
 * @throws {Error} 如果找不到图表容器或转换失败
 *
 * @example
 * ```typescript
 * import { chartToImageRun } from '@/lib/report/utils/chartToImage';
 * import { Paragraph, AlignmentType } from 'docx';
 *
 * // 创建图表ImageRun
 * const chartImage = await chartToImageRun({
 *   elementId: 'cost-pie-chart',
 *   wordWidth: 540,
 *   wordHeight: 420,
 * });
 *
 * // 添加到文档段落
 * const paragraph = new Paragraph({
 *   children: [chartImage],
 *   alignment: AlignmentType.CENTER,
 * });
 * ```
 */
export async function chartToImageRun(
  options: ChartToImageOptions
): Promise<ImageRun> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // 转换为PNG
  const dataUrl = await chartToPng(options);

  // 提取Base64数据（去除data:image/png;base64,前缀）
  const base64Data = dataUrl.split(',')[1];

  if (!base64Data) {
    throw new Error('无效的图片数据URI');
  }

  // 将Base64转换为Uint8Array（docx.js需要）
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // 创建ImageRun
  return new ImageRun({
    data: bytes,
    transformation: {
      width: opts.wordWidth,
      height: opts.wordHeight,
    },
  });
}

/**
 * 便捷方法：通过元素ID快速导出图表
 *
 * @param elementId 图表容器ID
 * @param wordWidth Word文档宽度（默认：540）
 * @param wordHeight Word文档高度（默认：420）
 * @returns ImageRun对象
 *
 * @example
 * ```typescript
 * const chartImage = await exportChartById('my-chart-id');
 * const paragraph = new Paragraph({
 *   children: [chartImage],
 *   alignment: AlignmentType.CENTER,
 * });
 * ```
 */
export async function exportChartById(
  elementId: string,
  wordWidth: number = 540,
  wordHeight: number = 420
): Promise<ImageRun> {
  return chartToImageRun({
    elementId,
    wordWidth,
    wordHeight,
  });
}

/**
 * 便捷方法：通过DOM元素快速导出图表
 *
 * @param element 图表DOM元素
 * @param wordWidth Word文档宽度（默认：540）
 * @param wordHeight Word文档高度（默认：420）
 * @returns ImageRun对象
 *
 * @example
 * ```typescript
 * const chartElement = document.getElementById('my-chart');
 * if (chartElement) {
 *   const chartImage = await exportChartByElement(chartElement);
 *   // 使用chartImage...
 * }
 * ```
 */
export async function exportChartByElement(
  element: HTMLElement,
  wordWidth: number = 540,
  wordHeight: number = 420
): Promise<ImageRun> {
  return chartToImageRun({
    element,
    wordWidth,
    wordHeight,
  });
}

/**
 * 批量导出多个图表
 *
 * @param elementIds 图表容器ID数组
 * @param wordWidth Word文档宽度（默认：540）
 * @param wordHeight Word文档高度（默认：420）
 * @returns ImageRun对象数组
 *
 * @example
 * ```typescript
 * const chartIds = ['chart1', 'chart2', 'chart3'];
 * const chartImages = await exportChartsInBatch(chartIds);
 *
 * chartImages.forEach((image, index) => {
 *   paragraphs.push(
 *     new Paragraph({
 *       children: [image],
 *       alignment: AlignmentType.CENTER,
 *     })
 *   );
 * });
 * ```
 */
export async function exportChartsInBatch(
  elementIds: string[],
  wordWidth: number = 540,
  wordHeight: number = 420
): Promise<ImageRun[]> {
  const promises = elementIds.map((id) =>
    exportChartById(id, wordWidth, wordHeight)
  );

  return Promise.all(promises);
}

/**
 * 检查图表是否已准备好导出
 *
 * @param elementId 图表容器ID
 * @returns true表示图表存在且可见
 *
 * @example
 * ```typescript
 * if (await isChartReady('my-chart')) {
 *   const chartImage = await exportChartById('my-chart');
 *   // 使用图表...
 * }
 * ```
 */
export function isChartReady(elementId: string): boolean {
  const element = document.getElementById(elementId);
  if (!element) {
    return false;
  }

  // 检查元素是否可见
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

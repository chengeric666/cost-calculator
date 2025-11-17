// @ts-nocheck - Day 21-26 docx.js API需要重构（TODO: 修复Document styles API）
/**
 * GECOM报告生成系统 - Word文档样式配置
 *
 * 职责：
 * - 定义GECOM统一的Word文档样式
 * - 对标益家之宠报告样式（字体、字号、行距、颜色）
 * - 提供便捷的样式创建工具函数
 *
 * @module report/utils/styles
 * @created 2025-11-14
 * @author GECOM Team
 */

import type { IStylesOptions, IParagraphStylePropertiesOptions, IRunStylePropertiesOptions } from 'docx';

/**
 * GECOM报告统一样式配置
 *
 * 基于益家之宠报告样式标准：
 * - 中文字体：宋体（SimSun）
 * - 英文字体：Times New Roman
 * - 行距：1.5倍
 * - 标题：宋体加粗，1级16pt，2级14pt，3级12pt
 * - 正文：宋体12pt
 * - 品牌色：GECOM蓝 #3B82F6
 */
export const GECOM_STYLES: IStylesOptions = {
  default: {
    // 默认文档样式
    document: {
      run: {
        font: 'Times New Roman', // 默认英文字体
        size: 24, // 12pt（Word单位：半磅，24 = 12pt）
      },
      paragraph: {
        spacing: {
          line: 360, // 1.5倍行距（360 twips）
          before: 100, // 段前间距
          after: 100, // 段后间距
        },
      },
    },

    // 默认标题样式（Heading基类）
    heading: {
      run: {
        font: 'SimSun', // 中文：宋体
        bold: true,
      },
    },
  },

  paragraphStyles: [
    // ========== Heading 1样式 ==========
    {
      id: 'Heading1',
      name: 'Heading 1',
      basedOn: 'Normal',
      next: 'Normal',
      quickFormat: true,
      run: {
        font: 'SimSun', // 宋体
        size: 32, // 16pt
        bold: true,
        color: '1E293B', // 深灰色（近黑）
      },
      paragraph: {
        spacing: {
          before: 400, // 段前0.28英寸
          after: 200, // 段后0.14英寸
          line: 360, // 1.5倍行距
        },
        outlineLevel: 0, // TOC识别级别
      },
    },

    // ========== Heading 2样式 ==========
    {
      id: 'Heading2',
      name: 'Heading 2',
      basedOn: 'Normal',
      next: 'Normal',
      quickFormat: true,
      run: {
        font: 'SimSun',
        size: 28, // 14pt
        bold: true,
        color: '334155', // 深灰色
      },
      paragraph: {
        spacing: {
          before: 300,
          after: 150,
          line: 360,
        },
        outlineLevel: 1,
      },
    },

    // ========== Heading 3样式 ==========
    {
      id: 'Heading3',
      name: 'Heading 3',
      basedOn: 'Normal',
      next: 'Normal',
      quickFormat: true,
      run: {
        font: 'SimSun',
        size: 24, // 12pt
        bold: true,
        color: '475569', // 中灰色
      },
      paragraph: {
        spacing: {
          before: 200,
          after: 100,
          line: 360,
        },
        outlineLevel: 2,
      },
    },

    // ========== Title样式（封面标题） ==========
    {
      id: 'Title',
      name: 'Title',
      basedOn: 'Normal',
      next: 'Normal',
      quickFormat: true,
      run: {
        font: 'SimSun',
        size: 44, // 22pt
        bold: true,
        color: '3B82F6', // GECOM品牌蓝
      },
      paragraph: {
        spacing: {
          before: 0,
          after: 0,
          line: 360,
        },
        alignment: 'center',
      },
    },

    // ========== Normal样式（正文） ==========
    {
      id: 'Normal',
      name: 'Normal',
      basedOn: 'Normal',
      next: 'Normal',
      quickFormat: true,
      run: {
        font: 'SimSun',
        size: 24, // 12pt
        color: '1F2937', // 深灰色
      },
      paragraph: {
        spacing: {
          before: 100,
          after: 100,
          line: 360, // 1.5倍行距
        },
        indent: {
          firstLine: 480, // 首行缩进2字符（480 twips ≈ 2字符）
        },
      },
    },

    // ========== ListParagraph样式（列表项） ==========
    {
      id: 'ListParagraph',
      name: 'List Paragraph',
      basedOn: 'Normal',
      quickFormat: true,
      paragraph: {
        indent: {
          left: 720, // 左缩进0.5英寸
        },
      },
    },

    // ========== Caption样式（图表标题） ==========
    {
      id: 'Caption',
      name: 'Caption',
      basedOn: 'Normal',
      next: 'Normal',
      run: {
        font: 'SimSun',
        size: 22, // 11pt
        color: '6B7280', // 灰色
        italics: true,
      },
      paragraph: {
        spacing: {
          before: 100,
          after: 100,
          line: 240, // 1.2倍行距
        },
        alignment: 'center',
      },
    },

    // ========== TableHeader样式（表格标题行） ==========
    {
      id: 'TableHeader',
      name: 'Table Header',
      basedOn: 'Normal',
      run: {
        font: 'SimSun',
        size: 24,
        bold: true,
        color: 'FFFFFF', // 白色
      },
      paragraph: {
        spacing: {
          before: 50,
          after: 50,
        },
        alignment: 'center',
      },
    },
  ],
};

/**
 * GECOM品牌颜色
 */
export const GECOM_COLORS = {
  // 主色调
  PRIMARY_BLUE: '3B82F6', // GECOM品牌蓝
  PRIMARY_DARK: '1E40AF', // 深蓝色

  // 强调色
  ACCENT_ORANGE: 'F59E0B', // 活力橙
  ACCENT_GREEN: '10B981', // 正向绿
  ACCENT_RED: 'EF4444', // 风险红

  // 中性色
  GRAY_900: '111827', // 近黑
  GRAY_800: '1F2937', // 深灰（正文）
  GRAY_700: '374151',
  GRAY_600: '4B5563',
  GRAY_500: '6B7280', // 中灰
  GRAY_400: '9CA3AF',
  GRAY_300: 'D1D5DB',
  GRAY_200: 'E5E7EB',
  GRAY_100: 'F3F4F6',
  GRAY_50: 'F9FAFB', // 背景色

  // 特殊颜色
  WHITE: 'FFFFFF',
  BLACK: '000000',
} as const;

/**
 * 创建自定义段落样式
 *
 * @param baseStyle 基础样式ID
 * @param overrides 样式覆盖配置
 * @returns 段落样式配置
 *
 * @example
 * ```typescript
 * const customStyle = createParagraphStyle('Normal', {
 *   run: { color: GECOM_COLORS.PRIMARY_BLUE },
 *   paragraph: { alignment: 'center' },
 * });
 * ```
 */
export function createParagraphStyle(
  baseStyle: string,
  overrides: {
    run?: Partial<IRunStylePropertiesOptions>;
    paragraph?: Partial<IParagraphStylePropertiesOptions>;
  }
): any {
  return {
    id: `${baseStyle}Custom`,
    name: `${baseStyle} Custom`,
    basedOn: baseStyle,
    quickFormat: true,
    run: {
      ...overrides.run,
    },
    paragraph: {
      ...overrides.paragraph,
    },
  };
}

/**
 * 获取模块颜色（M1-M8）
 *
 * @param module 模块代码
 * @returns 模块对应的颜色代码
 *
 * @example
 * ```typescript
 * getModuleColor('m1'); // '3B82F6' (蓝色)
 * getModuleColor('m4'); // 'F59E0B' (橙色)
 * ```
 */
export function getModuleColor(module: string): string {
  const moduleColors: Record<string, string> = {
    m1: GECOM_COLORS.PRIMARY_BLUE, // 市场准入：蓝色
    m2: '8B5CF6', // 技术合规：紫色
    m3: GECOM_COLORS.ACCENT_GREEN, // 供应链：绿色
    m4: GECOM_COLORS.ACCENT_ORANGE, // 货物税费：橙色（核心模块）
    m5: GECOM_COLORS.ACCENT_RED, // 物流配送：红色
    m6: 'EC4899', // 营销获客：粉色
    m7: '6366F1', // 支付手续费：靛蓝色
    m8: '14B8A6', // 运营管理：青色
  };

  return moduleColors[module.toLowerCase()] || GECOM_COLORS.GRAY_500;
}

/**
 * 根据数值获取颜色（正负值映射）
 *
 * @param value 数值
 * @returns 颜色代码（正值绿色，负值红色，零值灰色）
 *
 * @example
 * ```typescript
 * getValueColor(100);   // '10B981' (绿色)
 * getValueColor(-50);   // 'EF4444' (红色)
 * getValueColor(0);     // '6B7280' (灰色)
 * ```
 */
export function getValueColor(value: number): string {
  if (value > 0) {
    return GECOM_COLORS.ACCENT_GREEN;
  } else if (value < 0) {
    return GECOM_COLORS.ACCENT_RED;
  } else {
    return GECOM_COLORS.GRAY_500;
  }
}

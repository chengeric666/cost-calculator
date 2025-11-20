// @ts-nocheck - Day 21-26 docx.js API需要重构（TODO: 修复Paragraph/TextRun API使用）
/**
 * GECOM报告生成系统 - 目录自动生成模板
 *
 * 职责：
 * - 生成报告目录（Table of Contents）
 * - 自动识别Heading 1-3，生成层级目录
 * - 页码占位符（Word打开后右键更新域可显示正确页码）
 *
 * 技术说明：
 * - docx.js的TOC功能生成的是域代码（field code）
 * - 页码不会在生成时显示，需要在Word中手动更新域
 * - 用户操作：打开Word → 右键点击目录 → "更新域" → 选择"更新整个目录"
 *
 * @module report/templates/table-of-contents
 * @created 2025-11-14
 * @author GECOM Team
 */

import {
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  TableOfContents,
  StyleLevel,
} from 'docx';

/**
 * 生成目录内容
 *
 * @returns 目录Paragraph数组
 *
 * @example
 * ```typescript
 * const toc = generateTableOfContents();
 * // 返回包含目录标题+TOC域+分页符的Paragraph数组
 * ```
 */
export function generateTableOfContents(): Paragraph[] {
  return [
    // ========== 目录标题 ==========
    new Paragraph({
      text: '目录',
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: {
        before: 400,
        after: 400,
      },
    }),

    // ========== 用户提示（如何更新页码） ==========
    new Paragraph({
      children: [
        new TextRun({
          text: '提示：打开Word后，右键点击目录 → 选择"更新域" → 更新整个目录，即可显示正确页码。',
          font: 'SimSun',
          size: 20, // 10pt
          color: '6B7280', // 灰色
          italics: true,
        }),
      ],
      spacing: {
        before: 200,
        after: 600,
      },
      indent: {
        left: 720, // 左缩进0.5英寸
      },
    }),

    // ========== TOC域（自动目录） ==========
    new TableOfContents('目录', {
      hyperlink: true, // 启用超链接（点击可跳转）
      headingStyleRange: '1-3', // 识别Heading 1-3
      stylesWithLevels: [
        new StyleLevel('Heading1', 1),
        new StyleLevel('Heading2', 2),
        new StyleLevel('Heading3', 3),
      ],
    }),

    // ========== 分页符（目录后） ==========
    new Paragraph({
      text: '',
      spacing: {
        before: 600,
      },
      pageBreakBefore: true, // 目录独立一页
    }),
  ];
}

/**
 * 生成简化版目录（手动列表，适用于docx.js TOC功能不可用时）
 *
 * @param chapters 章节列表
 * @returns 手动目录Paragraph数组
 *
 * @example
 * ```typescript
 * const chapters = [
 *   { title: '执行摘要', level: 1 },
 *   { title: '第一章：项目概况', level: 1 },
 *   { title: '1.1 项目背景', level: 2 },
 * ];
 * const manualTOC = generateManualTableOfContents(chapters);
 * ```
 *
 * @deprecated 优先使用generateTableOfContents()，除非TOC域不可用
 */
export function generateManualTableOfContents(
  chapters: Array<{ title: string; level: number; page?: number }>
): Paragraph[] {
  const tocItems: Paragraph[] = [
    // 目录标题
    new Paragraph({
      text: '目录',
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: {
        before: 400,
        after: 600,
      },
    }),
  ];

  // 生成每个目录项
  chapters.forEach((chapter) => {
    const indent = (chapter.level - 1) * 720; // 每级缩进0.5英寸

    tocItems.push(
      new Paragraph({
        children: [
          new TextRun({
            text: chapter.title,
            font: 'SimSun',
            size: 24, // 12pt
          }),
          new TextRun({
            text: chapter.page ? ` ............... ${chapter.page}` : ' ............... ',
            font: 'Times New Roman',
            size: 24,
            color: '6B7280',
          }),
        ],
        spacing: {
          before: 100,
          after: 100,
        },
        indent: {
          left: indent,
        },
      })
    );
  });

  // 分页符
  tocItems.push(
    new Paragraph({
      text: '',
      spacing: {
        before: 600,
      },
      pageBreakBefore: true,
    })
  );

  return tocItems;
}

/**
 * 创建目录占位符（最简化版本）
 *
 * @returns 目录占位符Paragraph数组
 *
 * @remarks
 * 这是一个最小可行版本，仅显示"目录"标题和提示文字，
 * 不包含实际的TOC域代码。适用于快速原型开发。
 */
export function generateTOCPlaceholder(): Paragraph[] {
  return [
    new Paragraph({
      text: '目录',
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: {
        before: 400,
        after: 400,
      },
    }),

    new Paragraph({
      text: '（目录将在后续章节完成后自动生成）',
      alignment: AlignmentType.CENTER,
      run: {
        font: 'SimSun',
        size: 24,
        color: '9CA3AF',
        italics: true,
      },
      spacing: {
        before: 200,
        after: 1000,
      },
    }),

    new Paragraph({
      text: '',
      pageBreakBefore: true,
    }),
  ];
}

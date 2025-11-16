/**
 * GECOM报告生成系统 - 第四章：战略建议与优化路径
 *
 * 职责：
 * - 调用DeepSeek R1生成智能战略建议
 * - 解析AI返回的Markdown内容
 * - 转换为docx格式
 * - 包含5个核心小节：
 *   * 4.1 定价策略优化
 *   * 4.2 成本削减路径
 *   * 4.3 市场选择建议
 *   * 4.4 实施路线图
 *   * 4.5 风险预警
 *
 * 设计原则：
 * - AI驱动：基于DeepSeek R1深度推理
 * - 数据支撑：所有建议基于真实计算结果
 * - 可操作性：提供具体时间节点和行动计划
 * - 风险意识：识别并预警关键风险
 *
 * @module report/templates/chapter-4-strategy
 * @created 2025-11-16
 * @author GECOM Team
 */

import {
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  UnderlineType,
} from 'docx';
import type { ProcessedReportData } from '../types';
import { callDeepSeekR1ForOptimization } from '@/lib/ai/deepseek-r1-optimizer';

// ============================================
// 核心生成函数
// ============================================

/**
 * 生成第四章：战略建议与优化路径
 *
 * @param data 处理后的报告数据
 * @returns docx Paragraph数组
 *
 * @example
 * ```typescript
 * const chapter4 = await generateChapter4Strategy(processedData);
 * doc.addSection({ children: chapter4 });
 * ```
 */
export async function generateChapter4Strategy(
  data: ProcessedReportData
): Promise<Paragraph[]> {
  const paragraphs: Paragraph[] = [];

  console.log('[Chapter 4] 开始生成第四章：战略建议与优化路径...');

  // ========== 章节标题 ==========
  paragraphs.push(
    new Paragraph({
      text: '第四章：战略建议与优化路径',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      pageBreakBefore: true,
    })
  );

  // ========== AI生成战略建议 ==========
  try {
    console.log('[Chapter 4] 调用DeepSeek R1生成战略建议...');

    const optimizationResult = await callDeepSeekR1ForOptimization({
      project: {
        id: data.raw.project.id || 'temp-project',
        name: data.formattedProject.name,
        industry: data.raw.project.industry || 'pet_food',
        targetCountry: data.raw.project.targetCountry || 'US',
        salesChannel: data.raw.project.salesChannel || 'amazon_fba',
        createdAt: data.raw.project.createdAt || new Date().toISOString(),
        updatedAt: data.raw.project.updatedAt || new Date().toISOString(),
      },
      calculation: data.raw.calculation,
      costFactor: data.raw.costFactor,
    });

    if (optimizationResult.success) {
      console.log(
        `[Chapter 4] AI生成成功（模型：${optimizationResult.model}，耗时：${optimizationResult.generationTimeMs}ms，Fallback：${optimizationResult.usedFallback}）`
      );

      // 解析Markdown内容并转换为docx
      const aiParagraphs = parseMarkdownToDocx(optimizationResult.content);
      paragraphs.push(...aiParagraphs);

      // 添加AI生成说明（页脚）
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: '\n---\n',
              font: 'SimSun',
              size: 20,
              color: '9CA3AF',
            }),
            new TextRun({
              text: `本章由${optimizationResult.model}基于GECOM方法论和项目数据生成，生成耗时${optimizationResult.generationTimeMs}ms。${optimizationResult.usedFallback ? '（使用Fallback规则引擎）' : ''}`,
              font: 'SimSun',
              size: 20,
              color: '9CA3AF',
              italics: true,
            }),
          ],
          spacing: { before: 400, after: 200 },
          alignment: AlignmentType.CENTER,
        })
      );
    } else {
      // AI生成失败，使用占位符
      console.error('[Chapter 4] AI生成失败:', optimizationResult.error);
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: '⚠️ 战略建议生成失败，请稍后重试或联系技术支持。',
              font: 'SimSun',
              size: 24,
              color: 'EF4444',
              bold: true,
            }),
          ],
          spacing: { before: 200, after: 200 },
          alignment: AlignmentType.CENTER,
        })
      );
    }
  } catch (error) {
    console.error('[Chapter 4] 生成过程中发生异常:', error);
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '⚠️ 战略建议生成过程中发生异常，请检查系统配置。',
            font: 'SimSun',
            size: 24,
            color: 'EF4444',
            bold: true,
          }),
        ],
        spacing: { before: 200, after: 200 },
        alignment: AlignmentType.CENTER,
      })
    );
  }

  console.log('[Chapter 4] 第四章生成完成');
  return paragraphs;
}

// ============================================
// Markdown解析器
// ============================================

/**
 * 将Markdown内容解析为docx Paragraph数组
 *
 * 支持的Markdown语法：
 * - # 标题（H1-H6）
 * - **加粗**
 * - *斜体*
 * - - 无序列表
 * - 1. 有序列表
 * - > 引用块
 * - 普通段落
 *
 * @param markdown Markdown格式文本
 * @returns docx Paragraph数组
 */
function parseMarkdownToDocx(markdown: string): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  const lines = markdown.split('\n');

  let inList = false;
  let listType: 'ordered' | 'unordered' | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // 跳过空行（除非在列表中）
    if (trimmedLine === '') {
      if (inList) {
        inList = false;
        listType = null;
      }
      continue;
    }

    // 解析标题（# - ######）
    const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];

      const headingLevels = [
        HeadingLevel.HEADING_1,
        HeadingLevel.HEADING_2,
        HeadingLevel.HEADING_3,
        HeadingLevel.HEADING_4,
        HeadingLevel.HEADING_5,
        HeadingLevel.HEADING_6,
      ];

      paragraphs.push(
        new Paragraph({
          text: text,
          heading: headingLevels[level - 1],
          spacing: { before: level === 1 ? 400 : 300, after: 200 },
        })
      );
      inList = false;
      listType = null;
      continue;
    }

    // 解析引用块（> ...）
    const quoteMatch = trimmedLine.match(/^>\s+(.+)$/);
    if (quoteMatch) {
      const text = quoteMatch[1];
      paragraphs.push(
        new Paragraph({
          children: parseInlineMarkdown(text),
          spacing: { before: 200, after: 200 },
          alignment: AlignmentType.JUSTIFIED,
          indent: { left: 720, right: 720 }, // 1英寸左右缩进
          italics: true,
          shading: { fill: 'F9FAFB' },
        })
      );
      inList = false;
      listType = null;
      continue;
    }

    // 解析无序列表（- ...）
    const unorderedListMatch = trimmedLine.match(/^-\s+(.+)$/);
    if (unorderedListMatch) {
      const text = unorderedListMatch[1];
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: '• ',
              font: 'SimSun',
              size: 24,
            }),
            ...parseInlineMarkdown(text),
          ],
          spacing: { before: 100, after: 100 },
          alignment: AlignmentType.JUSTIFIED,
          indent: { left: 360 },
        })
      );
      inList = true;
      listType = 'unordered';
      continue;
    }

    // 解析有序列表（1. ...）
    const orderedListMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);
    if (orderedListMatch) {
      const number = orderedListMatch[1];
      const text = orderedListMatch[2];
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${number}. `,
              font: 'SimSun',
              size: 24,
            }),
            ...parseInlineMarkdown(text),
          ],
          spacing: { before: 100, after: 100 },
          alignment: AlignmentType.JUSTIFIED,
          indent: { left: 360 },
        })
      );
      inList = true;
      listType = 'ordered';
      continue;
    }

    // 解析分隔线（--- or ***）
    if (trimmedLine === '---' || trimmedLine === '***') {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: '—————————————————————————————',
              font: 'SimSun',
              size: 20,
              color: 'D1D5DB',
            }),
          ],
          spacing: { before: 200, after: 200 },
          alignment: AlignmentType.CENTER,
        })
      );
      inList = false;
      listType = null;
      continue;
    }

    // 普通段落
    paragraphs.push(
      new Paragraph({
        children: parseInlineMarkdown(trimmedLine),
        spacing: { before: 100, after: 100 },
        alignment: AlignmentType.JUSTIFIED,
      })
    );
    inList = false;
    listType = null;
  }

  return paragraphs;
}

/**
 * 解析行内Markdown格式（加粗、斜体等）
 *
 * @param text 行内文本
 * @returns TextRun数组
 */
function parseInlineMarkdown(text: string): TextRun[] {
  const runs: TextRun[] = [];

  // 正则表达式匹配：**加粗**、*斜体*、~~删除线~~
  const regex = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(\[(.+?)\]\((.+?)\))|([^*[\]]+)/g;

  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match[2]) {
      // **加粗**
      runs.push(
        new TextRun({
          text: match[2],
          bold: true,
          font: 'SimSun',
          size: 24,
        })
      );
    } else if (match[4]) {
      // *斜体*
      runs.push(
        new TextRun({
          text: match[4],
          italics: true,
          font: 'SimSun',
          size: 24,
        })
      );
    } else if (match[6] && match[7]) {
      // [链接文本](URL) - 渲染为下划线文本
      runs.push(
        new TextRun({
          text: match[6],
          font: 'SimSun',
          size: 24,
          underline: {
            type: UnderlineType.SINGLE,
            color: '3B82F6',
          },
          color: '3B82F6',
        })
      );
    } else if (match[8]) {
      // 普通文本
      runs.push(
        new TextRun({
          text: match[8],
          font: 'SimSun',
          size: 24,
        })
      );
    }
  }

  // Fallback：如果没有匹配到任何内容，返回整个文本
  if (runs.length === 0) {
    runs.push(
      new TextRun({
        text: text,
        font: 'SimSun',
        size: 24,
      })
    );
  }

  return runs;
}

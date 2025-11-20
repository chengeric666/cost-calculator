// @ts-nocheck - Day 21-26 docx.js API需要重构（TODO: 修复Paragraph/TextRun API使用）
/**
 * GECOM报告生成系统 - 封面页模板
 *
 * 职责：
 * - 生成报告封面页（标题、项目信息、日期、版本号）
 * - 对标益家之宠报告封面布局
 * - 样式：居中对齐、品牌标识、专业排版
 *
 * @module report/templates/cover-page
 * @created 2025-11-14
 * @author GECOM Team
 */

import {
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
} from 'docx';
import type { ProcessedReportData } from '../types';

/**
 * 生成封面页内容
 *
 * @param data 处理后的报告数据
 * @returns 封面页Paragraph数组
 *
 * @example
 * ```typescript
 * const coverPages = generateCoverPage(processedData);
 * // 返回包含封面+分页符的Paragraph数组
 * ```
 */
export function generateCoverPage(data: ProcessedReportData): Paragraph[] {
  const { formattedProject, raw } = data;

  return [
    // ========== GECOM品牌标识 ==========
    new Paragraph({
      text: 'GECOM 智能成本助手',
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: {
        before: 3000, // 封面顶部留白（3000 twips ≈ 5cm）
        after: 1000,
      },
      border: {
        bottom: {
          color: '3B82F6', // GECOM品牌蓝色
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      },
    }),

    // ========== 报告主标题 ==========
    new Paragraph({
      text: `${formattedProject.name}全球在线销售成本测算报告`,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: {
        before: 1000,
        after: 500,
      },
    }),

    // ========== 报告副标题 ==========
    new Paragraph({
      text: 'GECOM应用版',
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 2000, // 副标题后较大留白
      },
      run: {
        size: 28, // 14pt
        color: '6B7280', // 灰色
        italics: true,
      },
    }),

    // ========== 项目信息区域 ==========
    // 产品名称
    new Paragraph({
      children: [
        new TextRun({
          text: '产品名称：',
          bold: true,
          font: 'SimSun', // 中文：宋体
          size: 24, // 12pt
        }),
        new TextRun({
          text: formattedProject.name,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: {
        before: 1000,
        after: 200,
      },
      indent: {
        left: 1440, // 左缩进1英寸（1440 twips）
      },
    }),

    // 行业类别
    new Paragraph({
      children: [
        new TextRun({
          text: '行业类别：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: formattedProject.industryDisplay,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: {
        after: 200,
      },
      indent: {
        left: 1440,
      },
    }),

    // 目标市场
    new Paragraph({
      children: [
        new TextRun({
          text: '目标市场：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: formattedProject.targetCountryDisplay,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: {
        after: 200,
      },
      indent: {
        left: 1440,
      },
    }),

    // 销售渠道
    new Paragraph({
      children: [
        new TextRun({
          text: '销售渠道：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: formattedProject.salesChannelDisplay,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: {
        after: 1000,
      },
      indent: {
        left: 1440,
      },
    }),

    // ========== 报告元数据 ==========
    // 生成日期
    new Paragraph({
      children: [
        new TextRun({
          text: '生成日期：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: formatDate(raw.generatedAt),
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: {
        before: 1000,
        after: 200,
      },
      indent: {
        left: 1440,
      },
    }),

    // 报告版本
    new Paragraph({
      children: [
        new TextRun({
          text: '报告版本：',
          bold: true,
          font: 'SimSun',
          size: 24,
        }),
        new TextRun({
          text: raw.version,
          font: 'SimSun',
          size: 24,
        }),
      ],
      spacing: {
        after: 200,
      },
      indent: {
        left: 1440,
      },
    }),

    // ========== 页脚信息（GECOM方法论标识） ==========
    new Paragraph({
      text: '© GECOM智能成本助手 | Global E-Commerce Cost Optimization Methodology',
      alignment: AlignmentType.CENTER,
      spacing: {
        before: 3000, // 页底留白
      },
      run: {
        size: 20, // 10pt
        color: '9CA3AF', // 浅灰色
        font: 'Times New Roman',
      },
    }),

    // ========== 分页符（封面后） ==========
    new Paragraph({
      text: '',
      pageBreakBefore: true, // 封面独立一页
    }),
  ];
}

/**
 * 格式化日期（中文格式）
 *
 * @param date 日期对象
 * @returns 格式化后的日期字符串（例：2025年11月14日）
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

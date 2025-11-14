'use client';

import { useRef, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toPng } from 'html-to-image';
import { Document, Packer, Paragraph, ImageRun, HeadingLevel, AlignmentType, TextRun } from 'docx';
import { saveAs } from 'file-saver';

/**
 * Day 21准备工作：图表300 DPI导出质量测试页面
 *
 * 目标：验证html-to-image + docx.js能否生成高质量报告图表
 * 验收标准：PNG分辨率≥2400×1800，文字在200%放大时清晰可读
 */
export default function TestChartExport() {
  const pieChartRef = useRef<HTMLDivElement>(null);
  const barChartRef = useRef<HTMLDivElement>(null);
  const [testResults, setTestResults] = useState<{
    pieStatus: string;
    barStatus: string;
    pngSize: string;
    docxStatus: string;
  }>({
    pieStatus: '待测试',
    barStatus: '待测试',
    pngSize: '未生成',
    docxStatus: '待测试',
  });

  // 测试数据：成本分布（饼图）
  const costDistributionData = [
    { name: 'M1 市场准入', value: 2000, color: '#3B82F6' },
    { name: 'M2 技术合规', value: 1500, color: '#8B5CF6' },
    { name: 'M3 供应链', value: 3000, color: '#10B981' },
    { name: 'M4 货物税费', value: 15000, color: '#F59E0B' },
    { name: 'M5 物流配送', value: 3000, color: '#EF4444' },
    { name: 'M6 营销获客', value: 5000, color: '#EC4899' },
    { name: 'M7 支付费用', value: 500, color: '#6366F1' },
    { name: 'M8 运营管理', value: 2000, color: '#14B8A6' },
  ];

  // 测试数据：单位经济模型（柱状图）
  const unitEconomicsData = [
    { category: '单位收入', value: 50, fill: '#10B981' },
    { category: '单位成本', value: 32, fill: '#EF4444' },
    { category: '单位毛利', value: 18, fill: '#3B82F6' },
  ];

  /**
   * 导出图表为PNG（300 DPI）
   */
  const exportToPng = async (
    element: HTMLElement,
    fileName: string,
    pixelRatio: number = 3
  ): Promise<Blob | null> => {
    try {
      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: pixelRatio,  // ⭐关键：3倍分辨率 ≈ 300 DPI
        backgroundColor: '#ffffff',
      });

      // 转换dataUrl为Blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      // 下载PNG文件
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();

      return blob;
    } catch (error) {
      console.error('PNG导出失败:', error);
      return null;
    }
  };

  /**
   * 测试饼图导出
   */
  const testPieChart = async () => {
    setTestResults(prev => ({ ...prev, pieStatus: '导出中...' }));

    if (!pieChartRef.current) {
      setTestResults(prev => ({ ...prev, pieStatus: '❌ 引用丢失' }));
      return;
    }

    const blob = await exportToPng(pieChartRef.current, 'pie-chart-300dpi.png', 3);

    if (blob) {
      const sizeMB = (blob.size / 1024 / 1024).toFixed(2);
      setTestResults(prev => ({
        ...prev,
        pieStatus: `✅ 成功导出`,
        pngSize: `${sizeMB} MB (${blob.size} bytes)`,
      }));
    } else {
      setTestResults(prev => ({ ...prev, pieStatus: '❌ 导出失败' }));
    }
  };

  /**
   * 测试柱状图导出
   */
  const testBarChart = async () => {
    setTestResults(prev => ({ ...prev, barStatus: '导出中...' }));

    if (!barChartRef.current) {
      setTestResults(prev => ({ ...prev, barStatus: '❌ 引用丢失' }));
      return;
    }

    const blob = await exportToPng(barChartRef.current, 'bar-chart-300dpi.png', 3);

    if (blob) {
      const sizeMB = (blob.size / 1024 / 1024).toFixed(2);
      setTestResults(prev => ({
        ...prev,
        barStatus: `✅ 成功导出 (${sizeMB} MB)`,
      }));
    } else {
      setTestResults(prev => ({ ...prev, barStatus: '❌ 导出失败' }));
    }
  };

  /**
   * 生成Word文档（嵌入PNG图表）
   */
  const generateWordDocument = async () => {
    setTestResults(prev => ({ ...prev, docxStatus: '生成中...' }));

    try {
      // 1. 导出两张图表为PNG
      if (!pieChartRef.current || !barChartRef.current) {
        throw new Error('图表引用丢失');
      }

      const pieDataUrl = await toPng(pieChartRef.current, {
        quality: 1.0,
        pixelRatio: 3,
        backgroundColor: '#ffffff',
      });

      const barDataUrl = await toPng(barChartRef.current, {
        quality: 1.0,
        pixelRatio: 3,
        backgroundColor: '#ffffff',
      });

      // 转换为Buffer
      const pieResponse = await fetch(pieDataUrl);
      const pieBlob = await pieResponse.blob();
      const pieBuffer = await pieBlob.arrayBuffer();

      const barResponse = await fetch(barDataUrl);
      const barBlob = await barResponse.blob();
      const barBuffer = await barBlob.arrayBuffer();

      // 2. 创建Word文档
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // 标题
            new Paragraph({
              text: 'GECOM成本报告 - 图表质量测试',
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: '测试日期: 2025-11-14',
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: '' }),  // 空行

            // 第一章：成本分布
            new Paragraph({
              text: '第一章：成本分布分析',
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              text: '以下为成本分布饼图（300 DPI高清）：',
            }),
            new Paragraph({
              children: [
                new ImageRun({
                  data: pieBuffer,
                  transformation: {
                    width: 540,  // Word中显示宽度（点），保持9:7宽高比
                    height: 420, // Word中显示高度（点）900×700 → 540×420
                  },
                }),
              ],
            }),
            new Paragraph({ text: '' }),  // 空行

            // 第二章：单位经济模型
            new Paragraph({
              text: '第二章：单位经济模型',
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              text: '以下为单位经济模型柱状图（300 DPI高清）：',
            }),
            new Paragraph({
              children: [
                new ImageRun({
                  data: barBuffer,
                  transformation: {
                    width: 540,  // 保持相同宽高比
                    height: 420,
                  },
                }),
              ],
            }),
            new Paragraph({ text: '' }),

            // 验收清单
            new Paragraph({
              text: '验收清单',
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              text: '请在Word中检查以下内容：',
            }),
            new Paragraph({
              text: '[ ] PNG图表分辨率 ≥ 2700×2100（900×700×3倍）',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '[ ] 文字在200%放大时清晰可读',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '[ ] 线条、边框在200%放大时无锯齿',
              bullet: { level: 0 },
            }),
            new Paragraph({
              text: '[ ] Word文档中图片质量与PNG一致',
              bullet: { level: 0 },
            }),
          ],
        }],
      });

      // 3. 下载Word文档
      const buffer = await Packer.toBlob(doc);
      saveAs(buffer, 'gecom-report-test-300dpi.docx');

      setTestResults(prev => ({
        ...prev,
        docxStatus: '✅ Word文档已生成并下载',
      }));
    } catch (error) {
      console.error('Word文档生成失败:', error);
      setTestResults(prev => ({
        ...prev,
        docxStatus: `❌ 生成失败: ${error}`,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Day 21准备工作：图表导出质量测试
          </h1>
          <p className="text-gray-600">
            验证html-to-image + docx.js能否生成300 DPI高质量报告图表
          </p>
        </div>

        {/* 测试结果面板 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">测试结果</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">饼图导出状态</p>
              <p className="text-lg font-medium">{testResults.pieStatus}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">柱状图导出状态</p>
              <p className="text-lg font-medium">{testResults.barStatus}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">PNG文件大小</p>
              <p className="text-lg font-medium">{testResults.pngSize}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Word文档生成状态</p>
              <p className="text-lg font-medium">{testResults.docxStatus}</p>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={testPieChart}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              测试饼图导出（300 DPI）
            </button>
            <button
              onClick={testBarChart}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              测试柱状图导出（300 DPI）
            </button>
            <button
              onClick={generateWordDocument}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              生成完整Word报告
            </button>
          </div>
        </div>

        {/* 图表展示区域 */}
        <div className="space-y-8">
          {/* 饼图 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">成本分布饼图</h3>
            <div ref={pieChartRef} className="bg-white p-8" style={{ width: '900px', height: '700px' }}>
              <PieChart width={900} height={700}>
                <Pie
                  data={costDistributionData}
                  cx={450}
                  cy={350}
                  labelLine={true}
                  label={(entry) => `${entry.name}: $${entry.value}`}
                  outerRadius={180}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {costDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>

          {/* 柱状图 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">单位经济模型柱状图</h3>
            <div ref={barChartRef} className="bg-white p-8" style={{ width: '900px', height: '700px' }}>
              <BarChart width={900} height={700} data={unitEconomicsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" style={{ fontSize: '16px' }} />
                <YAxis style={{ fontSize: '16px' }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '16px' }} />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </div>
          </div>
        </div>

        {/* 验收标准 */}
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-6">
          <h3 className="text-lg font-semibold mb-4">验收标准（必须全部通过）</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">✓</span>
              <span>PNG图表分辨率 ≥ 2700×2100（900×700×3倍）</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">✓</span>
              <span>PNG文件大小 &gt; 100KB（说明有足够细节）</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">✓</span>
              <span>文字在200%放大时清晰可读</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">✓</span>
              <span>线条、边框在200%放大时无锯齿</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">✓</span>
              <span>Word文档中图片质量与PNG一致（未被压缩）</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">✓</span>
              <span>单张图表导出时间 &lt; 2秒</span>
            </li>
          </ul>

          <div className="mt-4 p-4 bg-white rounded border border-yellow-200">
            <p className="text-sm font-semibold text-yellow-800">操作步骤：</p>
            <ol className="mt-2 space-y-1 text-sm">
              <li>1. 点击"生成完整Word报告"按钮</li>
              <li>2. 打开下载的.docx文件</li>
              <li>3. 右键点击图片 → 另存为 → 检查PNG分辨率</li>
              <li>4. 在Word中放大图片到150-200%，检查清晰度</li>
              <li>5. 如果所有验收标准通过 → 继续Day 21任务</li>
              <li>6. 如果清晰度不达标 → 启动Plan B（puppeteer方案）</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

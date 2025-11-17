'use client';

import { useState } from 'react';
import { Download, FileText, Loader2, CheckCircle, Settings } from 'lucide-react';
import type { Project, CostResult } from '@/types/gecom';
import { ReportGenerator } from '@/lib/report/reportGenerator';
import { getCostFactor } from '@/lib/appwrite-data';

interface Step5ReportGenerationProps {
  project: Partial<Project>;
  costResult: CostResult | null;
  onUpdate: (updates: Partial<Project>) => void;
}

export default function Step5ReportGeneration({
  project,
  costResult,
  onUpdate
}: Step5ReportGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState<string>('');

  // 报告配置选项
  const [reportConfig, setReportConfig] = useState({
    language: 'zh-CN' as const,
    includeCharts: true,
    includeExecutiveSummary: true,
    includeAppendix: true,
    useAI: true, // 是否使用DeepSeek R1生成第四章
  });

  const handleGenerateReport = async () => {
    if (!costResult || !project.targetCountry || !project.industry) {
      alert('请先完成成本计算（Step 0-3）');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGenerationStatus('正在准备数据...');

    try {
      // Step 1: 获取成本因子
      setProgress(10);
      setGenerationStatus('正在获取成本因子数据...');

      const costFactor = await getCostFactor(
        project.targetCountry,
        project.industry,
        '2025Q1'
      );

      if (!costFactor) {
        throw new Error(`无法获取成本因子数据（国家：${project.targetCountry}，行业：${project.industry}）`);
      }

      // Step 2: 创建报告生成器
      setProgress(20);
      setGenerationStatus('正在初始化报告生成器...');

      const generator = new ReportGenerator({
        project: project as Project,
        calculation: costResult as any, // ReportGenerator期望Calculation类型
        costFactor,
      }, {
        language: reportConfig.language,
        includeCharts: reportConfig.includeCharts,
        chartQuality: 3, // 300 DPI
        includeExecutiveSummary: reportConfig.includeExecutiveSummary,
        includeAppendix: reportConfig.includeAppendix,
        useAI: reportConfig.useAI,
      });

      // Step 3: 生成报告章节（模拟进度更新）
      setProgress(30);
      setGenerationStatus('正在生成封面和目录...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setProgress(40);
      setGenerationStatus('正在生成第一章：项目概况...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setProgress(50);
      setGenerationStatus('正在生成第二章：M1-M8成本拆解...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      setProgress(70);
      setGenerationStatus('正在生成第三章：财务分析...');
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (reportConfig.useAI) {
        setProgress(80);
        setGenerationStatus('正在生成第四章：AI战略建议（DeepSeek R1）...');
        await new Promise(resolve => setTimeout(resolve, 3000)); // AI生成较慢
      }

      setProgress(90);
      setGenerationStatus('正在生成附录...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 4: 导出Word文档
      setProgress(95);
      setGenerationStatus('正在导出Word文档...');

      const filename = `GECOM-${project.name || 'Report'}-${project.targetCountry}-${new Date().toISOString().split('T')[0]}.docx`;
      await generator.generateAndDownload(filename);

      // 完成
      setProgress(100);
      setGenerationStatus('报告生成成功！文件已下载。');

      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
        setGenerationStatus('');
      }, 2000);

    } catch (error) {
      console.error('报告生成失败:', error);
      alert(`报告生成失败: ${error instanceof Error ? error.message : String(error)}`);
      setIsGenerating(false);
      setProgress(0);
      setGenerationStatus('');
    }
  };

  return (
    <div className="space-y-8">
      {/* 标题 */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-3">生成专业成本分析报告</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          基于GECOM方法论，生成完整的30,000字专业Word报告。对标益家之宠行业标准，包含M1-M8成本拆解、19国对比分析、AI智能战略建议等核心内容。
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        {/* 左侧：报告配置 */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">报告配置</h3>
            </div>

            <div className="space-y-4">
              {/* 语言选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  报告语言
                </label>
                <select
                  value={reportConfig.language}
                  onChange={(e) => setReportConfig({ ...reportConfig, language: e.target.value as 'zh-CN' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  disabled={isGenerating}
                >
                  <option value="zh-CN">中文</option>
                  <option value="en-US" disabled>英文（即将推出）</option>
                </select>
              </div>

              {/* 章节选项 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  包含章节
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={reportConfig.includeExecutiveSummary}
                    onChange={(e) => setReportConfig({ ...reportConfig, includeExecutiveSummary: e.target.checked })}
                    className="rounded"
                    disabled={isGenerating}
                  />
                  <span className="text-sm text-gray-700">执行摘要</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={reportConfig.includeCharts}
                    onChange={(e) => setReportConfig({ ...reportConfig, includeCharts: e.target.checked })}
                    className="rounded"
                    disabled={isGenerating}
                  />
                  <span className="text-sm text-gray-700">图表可视化</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={reportConfig.includeAppendix}
                    onChange={(e) => setReportConfig({ ...reportConfig, includeAppendix: e.target.checked })}
                    className="rounded"
                    disabled={isGenerating}
                  />
                  <span className="text-sm text-gray-700">附录（数据源+方法论）</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={reportConfig.useAI}
                    onChange={(e) => setReportConfig({ ...reportConfig, useAI: e.target.checked })}
                    className="rounded"
                    disabled={isGenerating}
                  />
                  <span className="text-sm text-gray-700">AI生成第四章战略建议（DeepSeek R1）</span>
                </label>
              </div>
            </div>
          </div>

          {/* 报告特性 */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">报告特性</h3>
            <div className="space-y-2">
              <ReportFeature text="对标益家之宠专业报告标准" />
              <ReportFeature text="M1-M8完整成本拆解（15+表格）" />
              <ReportFeature text="19国跨市场对比分析" />
              <ReportFeature text="300 DPI高清图表嵌入" />
              <ReportFeature text="完整数据溯源（Tier 1/2/3标识）" />
              <ReportFeature text="AI生成5,000-8,000字战略建议" />
            </div>
          </div>
        </div>

        {/* 右侧：报告预览 */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">报告预览</h3>
            </div>

            <div className="space-y-2 text-sm">
              <ReportChapter number="封面" title="项目概要信息" />
              <ReportChapter number="目录" title="完整章节导航" />
              {reportConfig.includeExecutiveSummary && (
                <ReportChapter number="摘要" title="执行摘要（KPI+商业模式评估）" />
              )}
              <ReportChapter number="第一章" title="项目概况与核心假设" />
              <ReportChapter number="第二章" title="成本结构拆解（M1-M8详细表格）" highlight />
              <ReportChapter number="第三章" title="财务分析与单位经济模型" />
              <ReportChapter number="第四章" title="跨市场对比分析（19国）" />
              {reportConfig.useAI && (
                <ReportChapter number="第五章" title="AI智能战略建议（5,000-8,000字）" highlight />
              )}
              {reportConfig.includeAppendix && (
                <>
                  <ReportChapter number="附录A" title="完整成本明细表" />
                  <ReportChapter number="附录B" title="数据溯源说明" />
                  <ReportChapter number="附录C" title="GECOM方法论白皮书" />
                </>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>预计字数：</span>
                <span className="font-semibold">{reportConfig.useAI ? '28,000-32,000' : '20,000-25,000'}字</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>预计页数：</span>
                <span className="font-semibold">{reportConfig.useAI ? '30-35' : '22-28'}页</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>生成时间：</span>
                <span className="font-semibold">{reportConfig.useAI ? '25-35' : '15-20'}秒</span>
              </div>
            </div>
          </div>

          {/* 生成按钮 */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating || !costResult}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-md"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Download className="h-6 w-6" />
                  生成专业Word报告
                </>
              )}
            </button>

            {/* 进度条 */}
            {isGenerating && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-blue-100 mb-2">
                  <span>{generationStatus}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-blue-500 rounded-full h-2">
                  <div
                    className="bg-white rounded-full h-2 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {!costResult && (
              <p className="mt-4 text-sm text-blue-100 text-center">
                请先完成Step 0-3的成本计算，然后返回此处生成报告
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportFeature({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
      <span className="text-sm text-gray-700">{text}</span>
    </div>
  );
}

function ReportChapter({ number, title, highlight }: { number: string; title: string; highlight?: boolean }) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg ${highlight ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}`}>
      <FileText className={`h-5 w-5 flex-shrink-0 mt-0.5 ${highlight ? 'text-blue-600' : 'text-gray-400'}`} />
      <div>
        <div className={`font-semibold ${highlight ? 'text-blue-900' : 'text-gray-900'}`}>{number}</div>
        <div className="text-sm text-gray-600">{title}</div>
      </div>
    </div>
  );
}

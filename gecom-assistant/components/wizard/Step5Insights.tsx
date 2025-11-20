'use client';

import { Project, CostResult } from '@/types/gecom';
import { Lightbulb, CheckCircle, AlertTriangle, Download } from 'lucide-react';

interface Step5InsightsProps {
  project: Partial<Project>;
  onUpdate: (updates: Partial<Project>) => void;
  costResult: CostResult | null;
}

export default function Step5Insights({ project, costResult }: Step5InsightsProps) {
  if (!costResult) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">尚无分析结果</p>
      </div>
    );
  }

  // Helper to get unit economics and kpis with fallback
  const unitEcon = costResult.unit_economics || costResult.unitEconomics;
  const getGrossMargin = () => unitEcon?.gross_margin ?? (unitEcon as any)?.grossMargin ?? 0;
  const getGrossProfit = () => unitEcon?.gross_profit ?? (unitEcon as any)?.grossProfit ?? 0;
  const getRoi = () => costResult.kpis.roi ?? 0;
  const getBreakEvenVolume = () => costResult.kpis.breakeven_volume ?? costResult.kpis.breakEvenVolume ?? 0;

  const handleExport = () => {
    const exportData = {
      project: {
        name: project.name,
        industry: project.industry,
        targetCountry: project.targetCountry,
        salesChannel: project.salesChannel,
      },
      costResult,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gecom-analysis-${project.name?.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">洞察与行动路线图</h2>
        <p className="text-gray-600">
          AI驱动的推荐方案和市场进入策略的可执行步骤
        </p>
      </div>

      {/* Executive summary */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">执行摘要</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-blue-100 text-sm mb-1">商业模式</div>
            <div className="text-2xl font-bold">
              {getGrossMargin() >= 30
                ? '✅ 健康'
                : getGrossMargin() >= 20
                ? '⚠️ 可行'
                : '❌ 高风险'}
            </div>
          </div>
          <div>
            <div className="text-blue-100 text-sm mb-1">预期ROI</div>
            <div className="text-2xl font-bold">{getRoi().toFixed(0)}%</div>
          </div>
          <div>
            <div className="text-blue-100 text-sm mb-1">单位利润</div>
            <div className="text-2xl font-bold">${getGrossProfit().toFixed(2)}</div>
          </div>
          <div>
            <div className="text-blue-100 text-sm mb-1">盈亏平衡销量</div>
            <div className="text-2xl font-bold">{getBreakEvenVolume().toFixed(0)} 单位</div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI驱动推荐</h3>
        </div>

        <div className="space-y-3">
          {(costResult.recommendations || []).map((recommendation, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
            >
              <Lightbulb className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action roadmap */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">90天行动路线图</h3>

        <div className="space-y-6">
          {/* Month 1 */}
          <RoadmapPhase
            title="第1个月：市场验证"
            tasks={[
              '完成市场准入要求（M1：企业注册、税务登记）',
              '获取必要认证（M2：产品合规、商标注册）',
              '搭建供应链（M3：仓储、初始库存）',
              '启动MVP，投放100-500单位测试批次',
            ]}
          />

          {/* Month 2 */}
          <RoadmapPhase
            title="第2个月：市场测试与优化"
            tasks={[
              '测试营销渠道并优化CAC（目标：宠物<$20，电子烟<$35）',
              '收集客户反馈并优化产品市场匹配度',
              '优化物流和配送流程',
              '监控单位经济模型，必要时调整定价',
            ]}
          />

          {/* Month 3 */}
          <RoadmapPhase
            title="第3个月：扩大规模与拓展"
            tasks={[
              `扩大到目标销量（${project.scope?.assumptions.monthlySales} 单位/月）`,
              '实施运营和客服自动化',
              '探索更多渠道或市场（如当前模式已验证）',
              '建立现金储备以应对下一阶段增长',
            ]}
          />
        </div>
      </div>

      {/* Risk mitigation */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">风险缓解策略</h3>
        </div>

        <div className="space-y-3">
          <RiskCard
            risk="现金流风险"
            mitigation="保持3-6个月运营费用储备。考虑通过预售或定金来资助库存。"
          />
          <RiskCard
            risk="CAC波动"
            mitigation="多元化营销渠道（付费、有机、推荐）。建立自有受众（邮件列表、社群）。"
          />
          <RiskCard
            risk="供应链中断"
            mitigation="与2-3个备用供应商建立关系。保持相当于1.5倍交货期的安全库存。"
          />
          <RiskCard
            risk="监管变化"
            mitigation="订阅行业合规更新。与当地法律顾问合作。预留5-10%预算应对意外合规成本。"
          />
        </div>
      </div>

      {/* Export options */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">导出与分享</h3>
        <div className="flex gap-4">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            导出分析报告 (JSON)
          </button>
          <button
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => window.print()}
          >
            打印报告
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          保存此分析以供参考，或与您的团队、投资人或顾问分享。
        </p>
      </div>

      {/* Next steps */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">分析完成！</h3>
        </div>
        <p className="text-gray-700 mb-4">
          您已完成GECOM五步成本分析。请查看以上推荐方案，并使用行动路线图指导您的市场进入策略。
        </p>
        <div className="flex gap-3">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            开始新分析
          </button>
          <button className="px-6 py-2 bg-white border border-green-600 text-green-700 rounded-lg hover:bg-green-50 transition-colors">
            预约咨询
          </button>
        </div>
      </div>
    </div>
  );
}

function RoadmapPhase({ title, tasks }: { title: string; tasks: string[] }) {
  return (
    <div>
      <h4 className="font-semibold text-gray-900 mb-3">{title}</h4>
      <ul className="space-y-2">
        {tasks.map((task, index) => (
          <li key={index} className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700">{task}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RiskCard({ risk, mitigation }: { risk: string; mitigation: string }) {
  return (
    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
      <div className="font-semibold text-gray-900 mb-1">{risk}</div>
      <p className="text-sm text-gray-700">{mitigation}</p>
    </div>
  );
}

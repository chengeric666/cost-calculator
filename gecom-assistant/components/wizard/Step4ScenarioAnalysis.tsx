'use client';

import { Project, CostResult } from '@/types/gecom';
import { GitCompare, TrendingUp } from 'lucide-react';

interface Step4ScenarioAnalysisProps {
  project: Partial<Project>;
  onUpdate: (updates: Partial<Project>) => void;
  costResult: CostResult | null;
}

export default function Step4ScenarioAnalysis({ project, costResult }: Step4ScenarioAnalysisProps) {
  if (!costResult) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">尚无成本模型数据</p>
      </div>
    );
  }

  // Helper to get unit economics and kpis with fallback
  const unitEcon = costResult.unit_economics || costResult.unitEconomics;
  const getGrossMargin = () => unitEcon?.gross_margin ?? (unitEcon as any)?.grossMargin ?? 0;
  const getRoi = () => costResult.kpis.roi ?? 0;
  const getPaybackPeriod = () => costResult.kpis.payback_period_months ?? costResult.kpis.paybackPeriod ?? 0;

  // Scenario comparison data
  const scenarios = [
    {
      name: '当前配置',
      country: project.targetCountry,
      channel: project.salesChannel,
      margin: getGrossMargin(),
      roi: getRoi(),
      payback: getPaybackPeriod(),
      isCurrent: true,
    },
    {
      name: '越南 + Shopee',
      country: 'VN',
      channel: 'Shopee',
      margin: 22.5,
      roi: 145,
      payback: 8.5,
      isCurrent: false,
    },
    {
      name: '美国 + O2O（电子烟）',
      country: 'US',
      channel: 'O2O',
      margin: 35.2,
      roi: 180,
      payback: 6.8,
      isCurrent: false,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">场景分析</h2>
        <p className="text-gray-600">
          对比不同的市场和渠道策略以优化您的方案
        </p>
      </div>

      {/* Current scenario summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <GitCompare className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">当前配置</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-blue-700">行业</div>
                <div className="font-semibold text-blue-900 capitalize">{project.industry}</div>
              </div>
              <div>
                <div className="text-sm text-blue-700">市场</div>
                <div className="font-semibold text-blue-900">{project.targetCountry}</div>
              </div>
              <div>
                <div className="text-sm text-blue-700">渠道</div>
                <div className="font-semibold text-blue-900 capitalize">
                  {project.salesChannel?.replace('_', ' ')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario comparison table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  场景
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  市场
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  渠道
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  毛利率
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ROI
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  回本（月）
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scenarios.map((scenario, index) => (
                <tr key={index} className={scenario.isCurrent ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{scenario.name}</span>
                      {scenario.isCurrent && (
                        <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded">当前</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{scenario.country}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 capitalize">
                    {scenario.channel?.toString().replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span
                      className={`font-semibold ${
                        scenario.margin >= 30
                          ? 'text-green-600'
                          : scenario.margin >= 20
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {scenario.margin.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span
                      className={`font-semibold ${
                        scenario.roi >= 100 ? 'text-green-600' : 'text-yellow-600'
                      }`}
                    >
                      {scenario.roi.toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span
                      className={`font-semibold ${
                        scenario.payback <= 12 ? 'text-green-600' : 'text-yellow-600'
                      }`}
                    >
                      {scenario.payback.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key insights */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">关键洞察</h3>
        </div>

        <div className="space-y-4">
          <InsightCard
            title="市场机会"
            description="越南和菲律宾市场通常能提供10-15%更好的毛利率，因为CAC和运营成本更低，但市场规模可能较小。"
            color="blue"
          />
          <InsightCard
            title="渠道策略"
            description="对于电子烟产品，O2O渠道往往优于DTC，因为CAC更低（$15 vs $45）且转化率更高，尽管租金成本较高。"
            color="green"
          />
          <InsightCard
            title="风险考量"
            description="美国市场进入成本较高（CAPEX $30K+）但市场规模更大。东南亚市场门槛较低（$10K+）但更分散。"
            color="yellow"
          />
        </div>
      </div>

      {/* Scenario recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">推荐下一步行动</h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">1.</span>
            <span className="text-gray-700">
              用小批量（100-500单位）测试当前配置以验证假设
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">2.</span>
            <span className="text-gray-700">
              通过有机渠道（SEO、内容营销）优化CAC，将毛利率提升5-10%
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">3.</span>
            <span className="text-gray-700">
              一旦美国运营稳定，探索越南或菲律宾作为第二市场
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function InsightCard({
  title,
  description,
  color,
}: {
  title: string;
  description: string;
  color: 'blue' | 'green' | 'yellow';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-700">{description}</p>
    </div>
  );
}

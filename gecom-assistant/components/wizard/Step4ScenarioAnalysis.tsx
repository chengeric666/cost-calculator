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
        <p className="text-gray-600">No cost model available yet</p>
      </div>
    );
  }

  // Scenario comparison data
  const scenarios = [
    {
      name: 'Current Configuration',
      country: project.targetCountry,
      channel: project.salesChannel,
      margin: costResult.unitEconomics.grossMargin,
      roi: costResult.kpis.roi,
      payback: costResult.kpis.paybackPeriod,
      isCurrent: true,
    },
    {
      name: 'Vietnam + Shopee',
      country: 'VN',
      channel: 'Shopee',
      margin: 22.5,
      roi: 145,
      payback: 8.5,
      isCurrent: false,
    },
    {
      name: 'US + O2O (if Vape)',
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Scenario Analysis</h2>
        <p className="text-gray-600">
          Compare different market and channel strategies to optimize your approach
        </p>
      </div>

      {/* Current scenario summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <GitCompare className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Current Configuration</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-blue-700">Industry</div>
                <div className="font-semibold text-blue-900 capitalize">{project.industry}</div>
              </div>
              <div>
                <div className="text-sm text-blue-700">Market</div>
                <div className="font-semibold text-blue-900">{project.targetCountry}</div>
              </div>
              <div>
                <div className="text-sm text-blue-700">Channel</div>
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
                  Scenario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Market
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Channel
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gross Margin
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ROI
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payback (mo)
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
                        <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded">Current</span>
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
          <h3 className="text-lg font-semibold text-gray-900">Key Insights</h3>
        </div>

        <div className="space-y-4">
          <InsightCard
            title="Market Opportunity"
            description="Vietnam and Philippines markets typically offer 10-15% better margins due to lower CAC and operational costs, though market size may be smaller."
            color="blue"
          />
          <InsightCard
            title="Channel Strategy"
            description="For vape products, O2O channels often outperform DTC due to lower CAC ($15 vs $45) and higher conversion rates, despite higher rent costs."
            color="green"
          />
          <InsightCard
            title="Risk Consideration"
            description="US market has higher entry costs (CAPEX $30K+) but larger market size. SEA markets have lower barriers ($10K+) but more fragmented."
            color="yellow"
          />
        </div>
      </div>

      {/* Scenario recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommended Next Steps</h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">1.</span>
            <span className="text-gray-700">
              Test current configuration with small batch (100-500 units) to validate assumptions
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">2.</span>
            <span className="text-gray-700">
              Optimize CAC through organic channels (SEO, content marketing) to improve margins by 5-10%
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">3.</span>
            <span className="text-gray-700">
              Explore Vietnam or Philippines as secondary markets once US operations stabilize
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

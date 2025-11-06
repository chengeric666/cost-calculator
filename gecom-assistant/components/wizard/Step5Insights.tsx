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
        <p className="text-gray-600">No analysis results available yet</p>
      </div>
    );
  }

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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Insights & Action Roadmap</h2>
        <p className="text-gray-600">
          AI-powered recommendations and actionable next steps for your go-to-market strategy
        </p>
      </div>

      {/* Executive summary */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Executive Summary</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-blue-100 text-sm mb-1">Business Model</div>
            <div className="text-2xl font-bold">
              {costResult.unitEconomics.grossMargin >= 30
                ? '✅ Healthy'
                : costResult.unitEconomics.grossMargin >= 20
                ? '⚠️ Workable'
                : '❌ High Risk'}
            </div>
          </div>
          <div>
            <div className="text-blue-100 text-sm mb-1">Expected ROI</div>
            <div className="text-2xl font-bold">{costResult.kpis.roi.toFixed(0)}%</div>
          </div>
          <div>
            <div className="text-blue-100 text-sm mb-1">Unit Profit</div>
            <div className="text-2xl font-bold">${costResult.unitEconomics.grossProfit.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-blue-100 text-sm mb-1">Break-even Volume</div>
            <div className="text-2xl font-bold">{costResult.kpis.breakEvenVolume.toFixed(0)} units</div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI-Powered Recommendations</h3>
        </div>

        <div className="space-y-3">
          {costResult.recommendations.map((recommendation, index) => (
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">90-Day Action Roadmap</h3>

        <div className="space-y-6">
          {/* Month 1 */}
          <RoadmapPhase
            title="Month 1: Market Validation"
            tasks={[
              'Complete market entry requirements (M1: business registration, tax setup)',
              'Obtain necessary certifications (M2: product compliance, trademark)',
              'Set up supply chain (M3: warehouse, initial inventory)',
              'Launch MVP with 100-500 unit test batch',
            ]}
          />

          {/* Month 2 */}
          <RoadmapPhase
            title="Month 2: Market Testing & Optimization"
            tasks={[
              'Test marketing channels and optimize CAC (target: <$20 for pet, <$35 for vape)',
              'Gather customer feedback and refine product-market fit',
              'Optimize logistics and fulfillment processes',
              'Monitor unit economics and adjust pricing if needed',
            ]}
          />

          {/* Month 3 */}
          <RoadmapPhase
            title="Month 3: Scale & Expansion"
            tasks={[
              `Scale to target volume (${project.scope?.assumptions.monthlySales} units/month)`,
              'Implement automation for operations and customer service',
              'Explore additional channels or markets (if current model validated)',
              'Build cash reserves for next growth phase',
            ]}
          />
        </div>
      </div>

      {/* Risk mitigation */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Risk Mitigation Strategies</h3>
        </div>

        <div className="space-y-3">
          <RiskCard
            risk="Cash Flow Risk"
            mitigation="Maintain 3-6 months operating expenses in reserves. Consider pre-orders or deposits to fund inventory."
          />
          <RiskCard
            risk="CAC Volatility"
            mitigation="Diversify marketing channels (paid, organic, referral). Build owned audience (email list, community)."
          />
          <RiskCard
            risk="Supply Chain Disruption"
            mitigation="Establish relationships with 2-3 backup suppliers. Maintain safety stock equal to 1.5x lead time."
          />
          <RiskCard
            risk="Regulatory Changes"
            mitigation="Subscribe to industry compliance updates. Work with local legal counsel. Budget 5-10% for unexpected compliance costs."
          />
        </div>
      </div>

      {/* Export options */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export & Share</h3>
        <div className="flex gap-4">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export Analysis (JSON)
          </button>
          <button
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => window.print()}
          >
            Print Report
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Save this analysis for reference or share with your team, investors, or advisors.
        </p>
      </div>

      {/* Next steps */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Analysis Complete!</h3>
        </div>
        <p className="text-gray-700 mb-4">
          You've completed the GECOM 5-step cost analysis. Review the recommendations above and use the action
          roadmap to guide your market entry strategy.
        </p>
        <div className="flex gap-3">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Start New Analysis
          </button>
          <button className="px-6 py-2 bg-white border border-green-600 text-green-700 rounded-lg hover:bg-green-50 transition-colors">
            Schedule Consultation
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

'use client';

import { useState } from 'react';
import { Calculator, TrendingUp, Globe, Package } from 'lucide-react';
import CostCalculatorWizard from '@/components/CostCalculatorWizard';
import AssistantPanel from '@/components/AssistantPanel';

export default function HomePage() {
  const [showWizard, setShowWizard] = useState(false);

  if (showWizard) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex h-screen">
          {/* Main wizard area */}
          <div className="flex-1 overflow-auto">
            <CostCalculatorWizard onBack={() => setShowWizard(false)} />
          </div>

          {/* AI Assistant sidebar */}
          <div className="w-96 border-l border-gray-200 bg-white">
            <AssistantPanel />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Calculator className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GECOM Assistant</h1>
                <p className="text-sm text-gray-500">Global E-Commerce Cost Calculator</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-600">For Overseas Sellers</div>
              <div className="text-xs text-gray-400">Powered by GECOM Methodology</div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <div className="container mx-auto px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Professional Cost Analysis for
            <span className="block text-blue-600 mt-2">Global E-Commerce</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            科学的、可信赖的海外销售成本测算模型 · 基于GECOM方法论的双阶段八模块成本分析
          </p>

          <button
            onClick={() => setShowWizard(true)}
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Calculator className="h-5 w-5" />
            Start Cost Calculation
          </button>

          <p className="mt-4 text-sm text-gray-500">
            Free to use · 2 industries × 3 countries × 3 channels supported
          </p>
        </div>

        {/* Features */}
        <div className="mx-auto max-w-6xl mt-20 grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<TrendingUp className="h-8 w-8" />}
            title="Dual-Phase Analysis"
            description="CAPEX (Phase 0-1) + OPEX (Phase 1-N) complete cost modeling with M1-M8 modules"
            color="blue"
          />
          <FeatureCard
            icon={<Globe className="h-8 w-8" />}
            title="Multi-Market Support"
            description="US, Vietnam, Philippines markets with localized cost parameters and tax regulations"
            color="green"
          />
          <FeatureCard
            icon={<Package className="h-8 w-8" />}
            title="Industry Factors"
            description="Pre-configured factor libraries for Pet and Vape industries with real case data"
            color="purple"
          />
        </div>

        {/* GECOM Methodology Overview */}
        <div className="mx-auto max-w-4xl mt-20 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">GECOM 5-Step Process</h3>
          <div className="space-y-4">
            <ProcessStep number={1} title="Strategic Alignment" description="Define business goals and target metrics" />
            <ProcessStep
              number={2}
              title="Data Collection"
              description="Gather market, product, and operational data"
            />
            <ProcessStep number={3} title="Cost Modeling" description="Calculate CAPEX & OPEX with 8 modules" />
            <ProcessStep number={4} title="Scenario Analysis" description="Compare different strategies and channels" />
            <ProcessStep
              number={5}
              title="Insights & Roadmap"
              description="Generate recommendations and action plan"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 GECOM Assistant · Based on GECOM Methodology v2.2</p>
            <p className="mt-2">Helping Chinese companies succeed in global e-commerce</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'green' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} mb-4`}>{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function ProcessStep({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
        {number}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

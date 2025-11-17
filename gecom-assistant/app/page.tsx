'use client';

import { useState } from 'react';
import { Calculator, TrendingUp, Globe, Package } from 'lucide-react';
import CostCalculatorWizard from '@/components/CostCalculatorWizard';

export default function HomePage() {
  const [showWizard, setShowWizard] = useState(false);

  if (showWizard) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CostCalculatorWizard onBack={() => setShowWizard(false)} />
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
                <h1 className="text-xl font-bold text-gray-900">GECOM 智能助手</h1>
                <p className="text-sm text-gray-500">全球电商成本计算器</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-600">为出海卖家服务</div>
              <div className="text-xs text-gray-400">基于GECOM方法论</div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <div className="container mx-auto px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            专业的全球电商
            <span className="block text-blue-600 mt-2">成本分析工具</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            科学的、可信赖的海外销售成本测算模型 · 基于GECOM方法论的双阶段八模块成本分析
          </p>

          <button
            onClick={() => setShowWizard(true)}
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Calculator className="h-5 w-5" />
            开始成本计算
          </button>

          <p className="mt-4 text-sm text-gray-500">
            免费使用 · 支持2个行业 × 3个市场 × 3个渠道
          </p>
        </div>

        {/* Features */}
        <div className="mx-auto max-w-6xl mt-20 grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<TrendingUp className="h-8 w-8" />}
            title="双阶段分析"
            description="CAPEX（阶段0-1）+ OPEX（阶段1-N）完整成本建模，涵盖M1-M8八大模块"
            color="blue"
          />
          <FeatureCard
            icon={<Globe className="h-8 w-8" />}
            title="多市场支持"
            description="美国、越南、菲律宾市场，本地化成本参数和税收法规"
            color="green"
          />
          <FeatureCard
            icon={<Package className="h-8 w-8" />}
            title="行业因子库"
            description="基于真实案例数据的宠物和电子烟行业预配置因子库"
            color="purple"
          />
        </div>

        {/* GECOM Methodology Overview */}
        <div className="mx-auto max-w-4xl mt-20 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">GECOM 五步流程</h3>
          <div className="space-y-4">
            <ProcessStep number={1} title="战略对齐" description="定义业务目标和目标指标" />
            <ProcessStep
              number={2}
              title="数据采集"
              description="收集市场、产品和运营数据"
            />
            <ProcessStep number={3} title="成本建模" description="使用8大模块计算CAPEX和OPEX" />
            <ProcessStep number={4} title="场景分析" description="对比不同策略和渠道" />
            <ProcessStep
              number={5}
              title="洞察与路线图"
              description="生成优化建议和行动计划"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 GECOM 智能助手 · 基于GECOM方法论 v2.2</p>
            <p className="mt-2">助力中国企业在全球电商市场取得成功</p>
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

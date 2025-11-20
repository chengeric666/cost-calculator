/**
 * LoadingDemo组件 - A5 Loading骨架屏演示页面
 *
 * 用途：展示所有Loading Skeleton组件的效果
 * 目标：为未来集成Appwrite异步数据加载提供UI基础
 *
 * 使用场景：
 * - Step 1: DataAvailabilityPanel数据加载
 * - Step 2: M1-M8模块成本参数加载
 * - Step 3: 图表和计算结果加载
 */

'use client';

import React, { useState } from 'react';
import {
  CostItemRowSkeleton,
  ChartSkeleton,
  DataAvailabilityPanelSkeleton,
  ModuleCardSkeleton,
  StepLayoutSkeleton,
} from '@/components/ui/loading-skeletons';

export default function LoadingDemo() {
  const [selectedDemo, setSelectedDemo] = useState<'all' | 'step1' | 'step2' | 'step3'>('all');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 标题 */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            A5 Loading 骨架屏演示
          </h1>
          <p className="text-gray-600">
            展示GECOM应用中所有Loading Skeleton组件效果
          </p>
        </div>

        {/* 选择器 */}
        <div className="flex gap-2 bg-white p-4 rounded-lg border border-gray-200">
          {['all', 'step1', 'step2', 'step3'].map((demo) => (
            <button
              key={demo}
              onClick={() => setSelectedDemo(demo as typeof selectedDemo)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedDemo === demo
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {demo === 'all' ? '全部展示' : `Step ${demo.replace('step', '')}`}
            </button>
          ))}
        </div>

        {/* Step 1: DataAvailabilityPanel */}
        {(selectedDemo === 'all' || selectedDemo === 'step1') && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Step 1: 数据可用性面板骨架屏
              </h2>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                DataAvailabilityPanelSkeleton
              </span>
            </div>
            <DataAvailabilityPanelSkeleton />
          </section>
        )}

        {/* Step 2: M1-M8模块骨架屏 */}
        {(selectedDemo === 'all' || selectedDemo === 'step2') && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Step 2: 成本参数模块骨架屏
              </h2>
            </div>

            {/* ModuleCard骨架屏 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">ModuleCardSkeleton</h3>
              <ModuleCardSkeleton />
            </div>

            {/* CostItemRow骨架屏 */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                CostItemRowSkeleton (多行展示)
              </h3>
              <CostItemRowSkeleton count={5} showTierBadge={true} />
            </div>

            {/* 无TierBadge版本 */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                CostItemRowSkeleton (无Tier Badge)
              </h3>
              <CostItemRowSkeleton count={3} showTierBadge={false} />
            </div>
          </section>
        )}

        {/* Step 3: 图表骨架屏 */}
        {(selectedDemo === 'all' || selectedDemo === 'step3') && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Step 3: 图表骨架屏
              </h2>
            </div>

            {/* 柱状图 */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-700">ChartSkeleton (Bar)</h3>
              <ChartSkeleton type="bar" className="h-64" />
            </div>

            {/* 饼图 */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-700">ChartSkeleton (Pie)</h3>
              <ChartSkeleton type="pie" className="h-64" />
            </div>

            {/* 折线图 */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-700">ChartSkeleton (Line)</h3>
              <ChartSkeleton type="line" className="h-64" />
            </div>
          </section>
        )}

        {/* StepLayoutSkeleton */}
        {selectedDemo === 'all' && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              StepLayoutSkeleton (整页骨架屏)
            </h2>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-700">Step 1布局</h3>
              <div className="bg-white rounded-lg border border-gray-200">
                <StepLayoutSkeleton step={1} />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-700">Step 2布局</h3>
              <div className="bg-white rounded-lg border border-gray-200">
                <StepLayoutSkeleton step={2} />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-700">Step 3布局</h3>
              <div className="bg-white rounded-lg border border-gray-200">
                <StepLayoutSkeleton step={3} />
              </div>
            </div>
          </section>
        )}

        {/* 使用说明 */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold text-blue-900">💡 集成指南</h2>
          <div className="text-sm text-blue-800 space-y-2">
            <p><strong>Step 1 (DataAvailabilityPanel):</strong></p>
            <pre className="bg-white p-2 rounded border border-blue-200 overflow-x-auto">
{`import { DataAvailabilityPanelSkeleton } from '@/components/ui/loading-skeletons';

{loading ? (
  <DataAvailabilityPanelSkeleton />
) : (
  <DataAvailabilityPanel {...props} />
)}`}
            </pre>

            <p><strong>Step 2 (成本参数加载):</strong></p>
            <pre className="bg-white p-2 rounded border border-blue-200 overflow-x-auto">
{`import { ModuleCardSkeleton, CostItemRowSkeleton } from '@/components/ui/loading-skeletons';

{loading ? (
  <>
    <ModuleCardSkeleton />
    <ModuleCardSkeleton />
  </>
) : (
  <ModuleCard {...props}>
    <CostItemRow {...itemProps} />
  </ModuleCard>
)}`}
            </pre>

            <p><strong>Step 3 (图表加载):</strong></p>
            <pre className="bg-white p-2 rounded border border-blue-200 overflow-x-auto">
{`import { ChartSkeleton } from '@/components/ui/loading-skeletons';

{loading ? (
  <ChartSkeleton type="pie" className="h-80" />
) : (
  <PieChart data={data} />
)}`}
            </pre>
          </div>
        </section>

        {/* 技术说明 */}
        <section className="bg-gray-100 rounded-lg p-6 space-y-2 text-sm text-gray-600">
          <h3 className="text-base font-semibold text-gray-900">📋 技术说明</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>所有骨架屏组件基于shadcn/ui Skeleton基础组件构建</li>
            <li>使用Tailwind CSS的animate-pulse动画效果</li>
            <li>完整TypeScript类型定义，支持props定制</li>
            <li>灰色调设计避免干扰用户注意力</li>
            <li>未来集成Appwrite时可直接使用useCountryData hook的loading状态</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

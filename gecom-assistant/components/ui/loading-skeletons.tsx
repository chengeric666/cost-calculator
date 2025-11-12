/**
 * Loading Skeletons - A5专用骨架屏组件库
 *
 * 包含三类骨架屏：
 * 1. CostItemRowSkeleton - Step 2成本参数行加载状态
 * 2. ChartSkeleton - Step 3图表加载占位符
 * 3. DataAvailabilityPanelSkeleton - Step 1数据可用性面板加载状态
 *
 * 设计原则：
 * - 保持与真实组件相似的视觉结构
 * - 使用pulse动画营造加载感
 * - 灰色调避免干扰用户注意力
 */

import React from 'react';
import { Skeleton } from './skeleton';
import { cn } from '@/lib/utils';

/**
 * CostItemRowSkeleton - 成本参数行骨架屏
 *
 * 用途：Step 2中M1-M8模块数据加载时的占位符
 *
 * @example
 * ```tsx
 * {loading ? (
 *   <CostItemRowSkeleton count={3} />
 * ) : (
 *   <CostItemRow {...props} />
 * )}
 * ```
 */
export function CostItemRowSkeleton({
  count = 1,
  showTierBadge = true,
}: {
  count?: number;
  showTierBadge?: boolean;
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
        >
          <div className="flex-1 space-y-2">
            {/* Label + Tier Badge行 */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-32" />
              {showTierBadge && <Skeleton className="h-5 w-16 rounded-full" />}
            </div>

            {/* Value行 */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-8" />
            </div>

            {/* Description行（可选） */}
            {idx % 2 === 0 && <Skeleton className="h-3 w-48" />}
          </div>

          {/* 右侧按钮区域 */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-16" />
          </div>
        </div>
      ))}
    </>
  );
}

/**
 * ChartSkeleton - 图表骨架屏
 *
 * 用途：Step 3中Recharts图表加载时的占位符
 *
 * @example
 * ```tsx
 * {loading ? (
 *   <ChartSkeleton type="bar" />
 * ) : (
 *   <BarChart data={data} />
 * )}
 * ```
 */
export function ChartSkeleton({
  type = 'bar',
  className,
}: {
  type?: 'bar' | 'pie' | 'line';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200',
        className
      )}
    >
      {type === 'pie' ? (
        /* 饼图骨架 */
        <div className="flex flex-col items-center gap-4 py-8">
          <Skeleton className="h-40 w-40 rounded-full" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ) : type === 'line' ? (
        /* 折线图骨架 */
        <div className="w-full p-6 space-y-2">
          <div className="flex items-end gap-2 h-48">
            {Array.from({ length: 8 }).map((_, idx) => (
              <Skeleton
                key={idx}
                className="flex-1"
                style={{
                  height: `${40 + Math.random() * 60}%`,
                }}
              />
            ))}
          </div>
          <Skeleton className="h-3 w-full" />
        </div>
      ) : (
        /* 柱状图骨架（默认） */
        <div className="w-full p-6 space-y-2">
          <div className="flex items-end gap-2 h-48">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton
                key={idx}
                className="flex-1"
                style={{
                  height: `${30 + idx * 15}%`,
                }}
              />
            ))}
          </div>
          <Skeleton className="h-3 w-full" />
        </div>
      )}
    </div>
  );
}

/**
 * DataAvailabilityPanelSkeleton - 数据可用性面板骨架屏
 *
 * 用途：Step 1中DataAvailabilityPanel加载时的占位符
 *
 * @example
 * ```tsx
 * {loading ? (
 *   <DataAvailabilityPanelSkeleton />
 * ) : (
 *   <DataAvailabilityPanel {...props} />
 * )}
 * ```
 */
export function DataAvailabilityPanelSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      {/* 标题行 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-48" />
        </div>
        <Skeleton className="h-5 w-5" />
      </div>

      {/* 统计卡片区域 */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="bg-gray-50 rounded-lg p-4 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>

      {/* 国家列表 */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Skeleton className="h-6 w-8" />
            <Skeleton className="h-5 w-24" />
            <div className="flex-1" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-5 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * ModuleCardSkeleton - 模块卡片骨架屏
 *
 * 用途：Step 2中M1-M8模块卡片加载时的占位符
 *
 * @example
 * ```tsx
 * {loading ? (
 *   <ModuleCardSkeleton />
 * ) : (
 *   <ModuleCard {...props} />
 * )}
 * ```
 */
export function ModuleCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* 卡片头部 */}
      <div className="bg-gray-100 p-4 flex items-center justify-between cursor-pointer hover:bg-gray-150 transition-colors">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-64" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>

      {/* 卡片内容 */}
      <div className="p-6 space-y-4">
        <CostItemRowSkeleton count={3} />
      </div>
    </div>
  );
}

/**
 * StepLayoutSkeleton - Step页面整体骨架屏
 *
 * 用途：整个Step页面加载时的占位符
 *
 * @example
 * ```tsx
 * {loading ? (
 *   <StepLayoutSkeleton />
 * ) : (
 *   <StepContent />
 * )}
 * ```
 */
export function StepLayoutSkeleton({ step }: { step: 1 | 2 | 3 }) {
  if (step === 1) {
    return (
      <div className="space-y-6 p-8">
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-6 w-full max-w-2xl" />
        <div className="space-y-4">
          <DataAvailabilityPanelSkeleton />
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-6 p-8">
        <Skeleton className="h-10 w-96" />
        <div className="space-y-4">
          <ModuleCardSkeleton />
          <ModuleCardSkeleton />
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="space-y-6 p-8">
        <Skeleton className="h-10 w-96" />
        <div className="grid grid-cols-2 gap-6">
          <ChartSkeleton type="bar" className="h-80" />
          <ChartSkeleton type="pie" className="h-80" />
        </div>
        <div className="space-y-2">
          <CostItemRowSkeleton count={5} showTierBadge={false} />
        </div>
      </div>
    );
  }

  return null;
}

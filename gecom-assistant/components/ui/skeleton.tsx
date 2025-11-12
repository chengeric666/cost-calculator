/**
 * Skeleton组件 - A5 Loading骨架屏基础组件
 *
 * 用途：为数据加载状态提供占位动画
 * - Step 1: DataAvailabilityPanel加载状态
 * - Step 2: CostItemRow加载状态
 * - Step 3: Chart加载占位符
 *
 * 设计参考：shadcn/ui skeleton组件
 */

import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  );
}

export { Skeleton };

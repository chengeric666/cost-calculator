'use client';

/**
 * 客户端布局包装器（简化版）
 *
 * 职责：
 * - 仅提供客户端环境包装器
 * - AI助手已迁移到CostCalculatorWizard右侧常驻面板（PersistentAIAssistant）
 *
 * @updated 2025-11-17
 * @phase Day 27 Phase 3 Fix
 */
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

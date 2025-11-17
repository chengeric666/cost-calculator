'use client';

import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import GlobalAIAssistant from './GlobalAIAssistant';

/**
 * 客户端布局包装器
 *
 * 职责：
 * - 管理全局AI助手状态（isOpen）
 * - 渲染悬浮按钮（右下角固定定位）
 * - 渲染GlobalAIAssistant Drawer
 *
 * 设计理念：
 * - 符合Next.js 14最佳实践（将客户端逻辑从Server Component分离）
 * - 最小化客户端JavaScript（仅状态管理）
 *
 * @created 2025-11-17
 * @phase Day 27 Phase 2.2
 */
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  return (
    <>
      {children}

      {/* 悬浮按钮（右下角固定定位） */}
      <button
        onClick={() => setIsAIAssistantOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-30 group"
        aria-label="打开AI助手"
      >
        <MessageSquare className="h-6 w-6" />

        {/* Tooltip */}
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          AI智能助手
        </span>
      </button>

      {/* 全局AI助手 Drawer */}
      <GlobalAIAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        project={null}  // TODO: 从全局状态获取（如果已进入向导）
        costResult={null}  // TODO: 从全局状态获取
      />
    </>
  );
}

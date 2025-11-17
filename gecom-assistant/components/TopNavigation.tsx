'use client';

import { Home, ChevronRight, HelpCircle, Settings, User } from 'lucide-react';
import Link from 'next/link';

/**
 * TopNavigation - 全局导航栏
 *
 * 设计理念：Financial Professional SaaS
 * - Logo + 品牌标识（左侧）
 * - 面包屑导航（中间）
 * - 用户菜单/帮助（右侧）
 *
 * 美学特征：
 * - 精致的毛玻璃背景（白色/80 + backdrop-blur）
 * - 财务级别的专业感（深蓝色主题）
 * - 清晰的信息层级
 * - 微妙的hover动效
 *
 * @created 2025-11-17
 * @design Financial Professional SaaS
 */
export default function TopNavigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-4">
          {/* Logo - 财务级别的专业图标 */}
          <Link
            href="/"
            className="flex items-center gap-3 group transition-all duration-300 hover:scale-105"
          >
            <div className="relative">
              {/* 主图标 - 深蓝色渐变 */}
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/25 transition-all duration-300 group-hover:shadow-blue-500/40">
                <svg
                  className="h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* 成本计算图标：柱状图 + 美元符号 */}
                  <path d="M3 3v18h18" />
                  <path d="M18 17V9" />
                  <path d="M13 17V5" />
                  <path d="M8 17v-3" />
                </svg>
              </div>

              {/* 光晕效果 */}
              <div className="absolute inset-0 rounded-xl bg-blue-400/20 blur-md animate-pulse" />
            </div>

            {/* 品牌名称 */}
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900 tracking-tight leading-none">
                GECOM
              </span>
              <span className="text-[10px] font-medium text-slate-500 tracking-wide leading-none mt-0.5">
                Cost Intelligence
              </span>
            </div>
          </Link>

          {/* 分隔符 */}
          <div className="h-8 w-px bg-slate-200/80" />

          {/* 面包屑导航 */}
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
            >
              <Home className="h-3.5 w-3.5" />
              <span className="font-medium">首页</span>
            </Link>

            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />

            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/60">
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
              <span className="font-semibold">成本计算向导</span>
            </div>
          </div>
        </div>

        {/* Right: User Menu + Help */}
        <div className="flex items-center gap-3">
          {/* 帮助按钮 */}
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 group">
            <HelpCircle className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-sm font-medium">帮助</span>
          </button>

          {/* 设置按钮 */}
          <button className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 group">
            <Settings className="h-4 w-4 group-hover:rotate-90 transition-transform duration-500" />
          </button>

          {/* 分隔符 */}
          <div className="h-8 w-px bg-slate-200/80" />

          {/* 用户头像 */}
          <button className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-all duration-200 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-semibold text-slate-900 leading-none">
                演示用户
              </span>
              <span className="text-[10px] text-slate-500 leading-none mt-0.5">
                demo@gecom.ai
              </span>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}

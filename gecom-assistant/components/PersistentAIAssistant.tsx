'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, Sparkles, Zap } from 'lucide-react';
import { Project, CostResult } from '@/types/gecom';
import ReactMarkdown from 'react-markdown';

/**
 * 消息类型定义（与服务器端保持一致）
 */
interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tool_call_id?: string;
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: {
      name: string;
      arguments: string;
    };
  }>;
}

interface PersistentAIAssistantProps {
  project: Partial<Project> | null;
  costResult: CostResult | null;
}

/**
 * 常驻AI助手组件（精致的财务仪表盘美学）
 *
 * 设计理念：
 * - 深色主题：与主内容区（浅色）形成对比
 * - 玻璃态设计：backdrop-blur + 精致阴影
 * - 流畅动画：消息淡入 + 打字机效果
 * - 专业字体：DM Sans + JetBrains Mono
 *
 * @created 2025-11-17
 * @design Financial Dashboard Aesthetic
 */
export default function PersistentAIAssistant({
  project,
  costResult
}: PersistentAIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `你好！我是 **GECOM 智能成本助手** ✨

我可以帮助你：

• 📊 **深度成本分析** - 拆解 M1-M8 各模块成本结构
• 🌍 **跨国市场对比** - 比较 19 国成本与盈利能力
• 💡 **智能优化建议** - 基于数据生成 ROI 提升方案
• 🎯 **识别成本驱动** - 找出高占比成本项目

请随时提问，我会基于真实数据为您分析。`,
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageCount, setMessageCount] = useState(0);

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * 发送消息到API Route
   */
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);
    setMessageCount(prev => prev + 1);

    // 添加用户消息到界面
    const userMsg: ChatMessage = {
      role: 'user',
      content: userMessage
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      // 调用API Route（服务器端处理DeepSeek API）
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages,
          project: project,
          costResult: costResult
        }),
      });

      if (!response.ok) {
        throw new Error('API调用失败');
      }

      const data = await response.json();

      if (data.success) {
        // 更新消息历史（包括assistant回复和tool消息）
        setMessages(data.messages);
      } else {
        throw new Error(data.error || 'AI助手响应失败');
      }
    } catch (error) {
      console.error('AI调用失败:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '抱歉，我遇到了一些问题。请稍后再试。'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 快捷问题
   */
  const quickQuestions = [
    '分析当前成本结构',
    '对比美/越/德市场',
    '如何优化ROI？',
    '降低成本的建议'
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* 背景装饰 - 渐变光晕 */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      {/* Header - 精致的渐变卡片 */}
      <div className="relative p-6 border-b border-white/10 backdrop-blur-xl bg-white/5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            {/* 呼吸光环 */}
            <div className="absolute inset-0 rounded-2xl bg-blue-400 animate-pulse opacity-20 blur-md" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white tracking-tight">AI 智能助手</h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              基于 DeepSeek V3 · 实时成本分析
            </p>
          </div>
          {/* 状态指示器 */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/20 border border-green-500/30">
            <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-mono text-green-300">在线</span>
          </div>
        </div>
      </div>

      {/* 快捷问题 - 玻璃态卡片 */}
      <div className="relative p-4 border-b border-white/10 backdrop-blur-xl bg-white/5">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-3.5 w-3.5 text-amber-400" />
          <h3 className="text-xs font-semibold text-slate-300 tracking-wide">快捷问题</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestion(question)}
              disabled={isLoading}
              className="group relative text-left px-3 py-2.5 rounded-xl border border-white/10 hover:border-blue-400/50 bg-white/5 hover:bg-white/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              {/* 悬停光效 */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <span className="relative text-xs text-slate-300 group-hover:text-white transition-colors duration-200 leading-tight block">
                {question}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 聊天界面 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            style={{
              animationDelay: `${Math.min(index * 50, 300)}ms`
            }}
          >
            <div className={`flex gap-2.5 max-w-[90%]`}>
              {/* AI头像 */}
              {message.role !== 'user' && (
                <div className="flex-shrink-0 h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}

              {/* 消息内容 */}
              <div
                className={`rounded-2xl px-4 py-3 shadow-lg ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-500/30'
                    : message.role === 'tool'
                    ? 'bg-white/5 border border-white/10 text-slate-400 text-xs backdrop-blur-xl'
                    : 'bg-white/10 border border-white/10 text-slate-100 backdrop-blur-xl'
                }`}
              >
                {message.role === 'tool' ? (
                  <div className="font-mono text-xs flex items-center gap-1.5">
                    <div className="h-1 w-1 rounded-full bg-slate-500 animate-pulse" />
                    工具调用结果（隐藏）
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none prose-invert prose-headings:text-current prose-p:text-current prose-strong:text-current prose-ul:text-current prose-ol:text-current prose-a:text-blue-400">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                )}
              </div>

              {/* 用户头像 */}
              {message.role === 'user' && (
                <div className="flex-shrink-0 h-8 w-8 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-lg">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* 加载指示器 */}
        {isLoading && (
          <div className="flex justify-start animate-fadeIn">
            <div className="flex gap-2.5 max-w-[90%]">
              <div className="flex-shrink-0 h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-white/10 border border-white/10 backdrop-blur-xl">
                <div className="flex items-center gap-2.5 text-slate-300">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                  <span className="text-sm">AI 正在思考...</span>
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        className="h-1 w-1 rounded-full bg-blue-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 自动滚动锚点 */}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 - 精致的玻璃态设计 */}
      <div className="relative p-4 border-t border-white/10 backdrop-blur-xl bg-white/5">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="询问任何关于成本优化的问题..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-white/10 backdrop-blur-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-all duration-200"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="group relative px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 overflow-hidden"
          >
            {/* 悬停光效 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:animate-shimmer" />

            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin relative z-10" />
                <span className="text-sm font-medium relative z-10">发送中</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4 relative z-10" />
                <span className="text-sm font-medium relative z-10">发送</span>
              </>
            )}
          </button>
        </div>

        {/* 提示文字 */}
        <div className="flex items-center gap-2 mt-3 text-[11px] text-slate-400 font-mono">
          <div className="h-1 w-1 rounded-full bg-amber-400 animate-pulse" />
          <span>AI 会自动调用成本计算工具获取真实数据</span>
        </div>
      </div>

      {/* CSS 动画 */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(100%);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .group:hover .group-hover\:animate-shimmer {
          animation: shimmer 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

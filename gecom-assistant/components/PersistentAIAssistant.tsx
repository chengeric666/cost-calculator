'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, Sparkles, Zap, Circle } from 'lucide-react';
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
 * 常驻AI助手组件 - Modern SaaS美学
 *
 * 设计理念（受Lovart、Notion、Linear启发）：
 * - 精致而克制的视觉语言
 * - 浅色玻璃态背景，与主界面无缝融合
 * - 柔和的色彩方案，避免强对比
 * - 流畅的微动画，提升交互体验
 * - 清晰的信息层级和舒适的阅读体验
 *
 * @created 2025-11-17
 * @design Modern SaaS Aesthetic
 * @inspiration Lovart, Notion, Linear
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
    <div className="h-full flex flex-col bg-white/95 backdrop-blur-xl border-l border-slate-200/80 shadow-2xl overflow-hidden">
      {/* Header - 精致的渐变卡片 */}
      <div className="flex-shrink-0 p-5 border-b border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="flex items-start gap-3">
          {/* AI Icon with subtle animation */}
          <div className="relative mt-0.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            {/* 微妙呼吸光效 */}
            <div className="absolute inset-0 rounded-xl bg-blue-400/20 animate-pulse blur-sm" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                AI 智能助手
              </h2>
              {/* 在线状态指示器 - 更精致 */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-50 border border-green-200/60">
                <Circle className="h-1.5 w-1.5 fill-green-500 text-green-500 animate-pulse" />
                <span className="text-[10px] font-medium text-green-700 tracking-wide">在线</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              基于 DeepSeek V3 · 实时成本分析
            </p>
          </div>
        </div>
      </div>

      {/* 快捷问题 - 卡片式布局 */}
      <div className="flex-shrink-0 p-4 border-b border-slate-200/60 bg-slate-50/40">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-3.5 w-3.5 text-amber-500" />
          <h3 className="text-xs font-semibold text-slate-700 tracking-wide">快捷问题</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestion(question)}
              disabled={isLoading}
              className="group text-left px-2.5 py-2 rounded-lg border border-slate-200/80 bg-white hover:bg-blue-50 hover:border-blue-300/60 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-[0.98]"
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              <span className="text-[11px] text-slate-700 group-hover:text-blue-700 transition-colors duration-200 leading-snug block font-medium">
                {question}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 聊天区域 - 流畅滚动 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-50/20 to-white">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-messageSlide`}
            style={{
              animationDelay: `${Math.min(index * 30, 150)}ms`,
              opacity: 0,
              animation: 'messageSlide 0.3s ease-out forwards'
            }}
          >
            <div className={`flex gap-2 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              {message.role !== 'user' && message.role !== 'tool' && (
                <div className="flex-shrink-0 h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
              )}

              {/* Message bubble */}
              <div
                className={`rounded-2xl px-3.5 py-2.5 shadow-sm ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-500/20'
                    : message.role === 'tool'
                    ? 'bg-amber-50 border border-amber-200/60 text-amber-800 text-[11px]'
                    : 'bg-white border border-slate-200/80 text-slate-900'
                }`}
              >
                {message.role === 'tool' ? (
                  <div className="flex items-center gap-1.5 font-mono">
                    <Circle className="h-1 w-1 fill-amber-500 text-amber-500 animate-pulse" />
                    <span>工具调用结果（隐藏）</span>
                  </div>
                ) : (
                  <div className={`prose prose-sm max-w-none ${
                    message.role === 'user'
                      ? 'prose-invert prose-p:text-white prose-headings:text-white prose-strong:text-white prose-li:text-white'
                      : 'prose-slate prose-p:text-slate-700 prose-headings:text-slate-900 prose-strong:text-slate-900 prose-li:text-slate-700'
                  } prose-p:leading-relaxed prose-p:my-1 prose-ul:my-1 prose-li:my-0`}>
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                )}
              </div>

              {/* User avatar */}
              {message.role === 'user' && (
                <div className="flex-shrink-0 h-7 w-7 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-sm">
                  <User className="h-3.5 w-3.5 text-white" />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start animate-messageSlide">
            <div className="flex gap-2 max-w-[85%]">
              <div className="flex-shrink-0 h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <Bot className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="rounded-2xl px-3.5 py-2.5 bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
                  <span className="text-xs font-medium">AI 正在思考</span>
                  <div className="flex gap-0.5">
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        className="h-1 w-1 rounded-full bg-blue-500 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area - 精致的玻璃态设计 */}
      <div className="flex-shrink-0 p-4 border-t border-slate-200/80 bg-white/60 backdrop-blur-lg">
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
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300/80 bg-slate-50/80 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-all duration-200 shadow-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="group px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/40 active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-xs font-semibold">发送中</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                <span className="text-xs font-semibold">发送</span>
              </>
            )}
          </button>
        </div>

        {/* 提示文字 - 更精致 */}
        <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-slate-500">
          <Circle className="h-1 w-1 fill-amber-400 text-amber-400 animate-pulse" />
          <span className="leading-tight">AI 会自动调用成本计算工具获取真实数据</span>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

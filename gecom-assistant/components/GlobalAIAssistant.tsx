'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, Sparkles, X } from 'lucide-react';
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

interface GlobalAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  project: Partial<Project> | null;
  costResult: CostResult | null;
}

/**
 * 全局AI助手组件（Drawer模式）
 *
 * 特性：
 * - Drawer UI（右侧滑出）
 * - 全局可访问（任何页面都可打开）
 * - 复用Step5AIAssistant 90%代码
 * - DeepSeek V3工具调用集成
 *
 * @created 2025-11-17
 * @phase Day 27 Phase 2
 */
export default function GlobalAIAssistant({
  isOpen,
  onClose,
  project,
  costResult
}: GlobalAIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `你好！我是GECOM智能成本助手 🤖

我可以帮助你：
- 📊 **分析成本结构**：查看M1-M8各模块的成本拆解
- 🔍 **对比不同市场**：比较美国、越南、德国等19国的成本差异
- 💡 **提供优化建议**：基于当前成本结构生成ROI优化方案
- 🎯 **找出成本驱动因素**：识别高占比成本项目

请问有什么我可以帮助你的？`,
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
    '分析当前成本结构，找出主要成本驱动因素',
    '对比美国、越南、德国三个市场的毛利率',
    '如何优化ROI达到50%以上？',
    '给出3条降低运营成本的具体建议'
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  // 如果未打开，不渲染
  if (!isOpen) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer主体 */}
      <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-2xl z-50 transform transition-transform flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-b border-purple-200 p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">AI智能助手</h2>
                <p className="text-xs text-gray-600">
                  基于DeepSeek V3的成本优化专家
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-purple-200 flex items-center justify-center transition-colors"
              aria-label="关闭AI助手"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* 快捷问题 */}
        <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
          <h3 className="text-xs font-medium text-gray-700 mb-2">快捷问题</h3>
          <div className="grid grid-cols-1 gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                disabled={isLoading}
                className="text-left px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-xs text-gray-700 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* 聊天界面 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-2 max-w-[85%]`}>
                {/* 头像 */}
                {message.role !== 'user' && (
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                {/* 消息内容 */}
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : message.role === 'tool'
                      ? 'bg-gray-50 border border-gray-200 text-gray-600 text-xs'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}
                >
                  {message.role === 'tool' ? (
                    <div className="font-mono text-xs">
                      🔧 工具调用结果（隐藏）
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none prose-headings:text-current prose-p:text-current prose-strong:text-current prose-ul:text-current prose-ol:text-current">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  )}
                </div>

                {/* 用户头像 */}
                {message.role === 'user' && (
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* 加载指示器 */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-2 max-w-[85%]">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl px-4 py-3 bg-white border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">正在思考...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 自动滚动锚点 */}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="问我任何关于成本优化的问题..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* 提示文字 */}
          <p className="text-xs text-gray-500 mt-2">
            💡 提示：输入问题后，AI会自动调用成本计算工具获取真实数据进行分析
          </p>
        </div>
      </div>
    </>
  );
}

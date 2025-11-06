'use client';

import { useState } from 'react';
import { Bot, Send, HelpCircle, Book, Sparkles } from 'lucide-react';
import { AssistantMessage } from '@/types/gecom';

export default function AssistantPanel() {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      role: 'assistant',
      content:
        '👋 您好！我是您的GECOM助手。我可以帮助您理解成本计算流程、解释行业因子，并为优化您的海外电商策略提供指导。\n\n今天需要什么帮助？',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const quickQuestions = [
    '什么是GECOM方法论？',
    '如何降低我的CAC？',
    '什么是行业因子？',
    '解释M1-M8模块',
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: AssistantMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    // Generate assistant response (simplified for POC)
    const assistantMessage: AssistantMessage = {
      role: 'assistant',
      content: getAssistantResponse(input),
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage, assistantMessage]);
    setInput('');
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">GECOM Assistant</h3>
            <p className="text-xs text-gray-500">Powered by AI</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {/* Quick questions */}
        {messages.length === 1 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 font-medium">快速提问：</p>
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="block w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Helpful resources */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <p className="text-xs font-medium text-gray-600 mb-2">有用资源：</p>
        <div className="space-y-2">
          <ResourceLink
            icon={<Book className="h-4 w-4" />}
            title="GECOM方法论"
            description="了解双阶段模型"
          />
          <ResourceLink
            icon={<Sparkles className="h-4 w-4" />}
            title="行业因子"
            description="预配置的成本参数"
          />
          <ResourceLink
            icon={<HelpCircle className="h-4 w-4" />}
            title="常见问题"
            description="常见问题解答"
          />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="问我任何问题..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ResourceLink({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button className="w-full flex items-start gap-2 p-2 hover:bg-white rounded-lg transition-colors text-left">
      <div className="flex-shrink-0 mt-0.5 text-blue-600">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-gray-900">{title}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
    </button>
  );
}

/**
 * 简单的规则引擎回复（POC版本）
 * 生产环境将调用Claude API或GPT-4
 */
function getAssistantResponse(input: string): string {
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes('gecom') || lowerInput.includes('方法')) {
    return `📚 **GECOM方法论概述**

GECOM（全球电商成本优化方法论）是一个双阶段八模块框架：

**阶段0-1（CAPEX）：**
• M1: 市场准入 - 公司注册、许可证、法务
• M2: 技术合规 - 产品认证、商标注册
• M3: 供应链搭建 - 仓储、库存、系统

**阶段1-N（OPEX）：**
• M4: 货物税费 - COGS、关税、增值税
• M5: 物流配送 - 国际运输、本地配送、FBA
• M6: 营销获客 - CAC、平台佣金、广告
• M7: 支付手续费 - 网关费用、汇率损失、拒付
• M8: 运营管理 - 人员、软件、客服

该框架确保跨境电商的全面成本可见性。`;
  }

  if (lowerInput.includes('cac') || lowerInput.includes('获客') || lowerInput.includes('降低')) {
    return `💡 **降低客户获取成本（CAC）**

以下是降低CAC的有效策略：

1. **有机渠道**（CAC: $0-5）
   • SEO和内容营销
   • 社交媒体社群建设
   • 推荐计划

2. **效果营销**（CAC: $15-30）
   • Facebook/Instagram相似受众广告
   • Google Shopping广告
   • TikTok有机+付费混合

3. **渠道特定策略**
   • Amazon: 优化PPC，提升转化率
   • Shopee: 利用平台促销
   • DTC: 建立邮件列表，再营销

目标：宠物<$25，电子烟<$40，保持健康的LTV:CAC比率（>3:1）`;
  }

  if (lowerInput.includes('factor') || lowerInput.includes('因子') || lowerInput.includes('行业')) {
    return `🔢 **行业因子库**

行业因子是针对以下特定组合的预配置成本参数：
• 行业（宠物、电子烟）
• 国家（美国、越南、菲律宾）
• 渠道（Amazon FBA、Shopee、DTC、O2O）

**数据来源：**
• Tier 1（100%）：政府机构、官方统计
• Tier 2（90%）：行业报告、案例研究
• Tier 3（80%）：基于经验的估算

我们的因子为Tier 2等级，基于GECOM白皮书案例研究（益家之宠、VapePro）和经过验证的市场调研。

您可以用自己的数据覆盖任何因子以提高准确性。`;
  }

  if (lowerInput.includes('m1') || lowerInput.includes('m2') || lowerInput.includes('模块') || lowerInput.includes('解释')) {
    return `📊 **GECOM八模块详解**

**CAPEX（一次性）：**
M1: 市场准入 - $3K-$10K（注册、许可证）
M2: 技术合规 - $2K-$8K（产品认证）
M3: 供应链搭建 - $10K-$50K（仓储、库存）

**OPEX（单位成本）：**
M4: 货物税费 - 产品成本 + 进口关税 + 增值税
M5: 物流配送 - 国际运输 + 本地配送 + 仓储
M6: 营销获客 - CAC + 平台佣金 + 广告
M7: 支付手续费 - 网关费用（2.9%）+ 汇率损失（1.5%）+ 拒付
M8: 运营管理 - 客服 + 人员 + 软件

每个模块捕获特定的成本类别，确保完整的可见性。`;
  }

  // Default response
  return `我理解您在询问："${input}"

我可以帮您：
• 理解GECOM方法论
• 优化成本结构
• 降低CAC并提升毛利率
• 选择合适的市场和渠道
• 解读分析结果

试着问："如何提升我的毛利率？"或"宠物产品最佳渠道是什么？"`;
}

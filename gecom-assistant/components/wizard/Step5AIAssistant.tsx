'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, Wrench } from 'lucide-react';
import { Project, CostResult, ProjectScope } from '@/types/gecom';
import { chatWithTools, ChatMessage } from '@/lib/deepseek-client';
import { allTools } from '@/lib/deepseek-tools';
import { calculateCostModel } from '@/lib/gecom/calculator';
import ReactMarkdown from 'react-markdown';

interface Step5AIAssistantProps {
  project: Partial<Project>;
  onUpdate: (updates: Partial<Project>) => void;
  costResult: CostResult | null;
}

export default function Step5AIAssistant({ project, costResult }: Step5AIAssistantProps) {
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
   * 工具执行处理器
   */
  const executeToolCall = async (toolCall: any) => {
    const { name, arguments: argsStr } = toolCall.function;
    const args = JSON.parse(argsStr);

    switch (name) {
      case 'get_cost_breakdown':
        return getCostBreakdown(args.module);

      case 'compare_scenarios':
        return compareScenarios(args.countries, args.metric);

      case 'get_optimization_suggestions':
        return getOptimizationSuggestions(args.focus_area);

      default:
        throw new Error(`未知工具: ${name}`);
    }
  };

  /**
   * 工具1：获取成本拆解
   */
  const getCostBreakdown = (module?: string) => {
    if (!costResult) {
      return { error: '尚未完成成本计算，请先完成Step 2和Step 3' };
    }

    if (!module || module === 'all') {
      // 返回完整成本拆解
      return {
        summary: {
          capex_total: costResult.capex.total,
          opex_total: costResult.opex.total,
          unit_economics: costResult.unit_economics,
          kpis: costResult.kpis
        },
        capex_breakdown: {
          m1_market_entry: costResult.capex.m1,
          m2_technical_compliance: costResult.capex.m2,
          m3_supply_chain: costResult.capex.m3
        },
        opex_breakdown: {
          m4_goods_tax: costResult.opex.m4_cogs + costResult.opex.m4_tariff + costResult.opex.m4_logistics + costResult.opex.m4_vat,
          m4_cogs: costResult.opex.m4_cogs,
          m4_tariff: costResult.opex.m4_tariff,
          m4_logistics: costResult.opex.m4_logistics,
          m4_vat: costResult.opex.m4_vat,
          m5_logistics: costResult.opex.m5_last_mile + costResult.opex.m5_return,
          m5_last_mile: costResult.opex.m5_last_mile,
          m5_return: costResult.opex.m5_return,
          m6_marketing: costResult.opex.m6_marketing,
          m7_payment: costResult.opex.m7_payment + costResult.opex.m7_platform_commission,
          m8_operations: costResult.opex.m8_ga
        }
      };
    } else {
      // 返回特定模块
      const moduleKey = module.toUpperCase();
      if (moduleKey.startsWith('M1') || moduleKey.startsWith('M2') || moduleKey.startsWith('M3')) {
        return {
          module: moduleKey,
          cost: costResult.capex[module as 'm1' | 'm2' | 'm3'],
          type: 'CAPEX'
        };
      } else if (moduleKey.startsWith('M4')) {
        return {
          module: 'M4',
          cost: costResult.opex.m4_cogs + costResult.opex.m4_tariff + costResult.opex.m4_logistics + costResult.opex.m4_vat,
          breakdown: {
            cogs: costResult.opex.m4_cogs,
            tariff: costResult.opex.m4_tariff,
            logistics: costResult.opex.m4_logistics,
            vat: costResult.opex.m4_vat
          },
          type: 'OPEX'
        };
      } else if (moduleKey.startsWith('M5')) {
        return {
          module: 'M5',
          cost: costResult.opex.m5_last_mile + costResult.opex.m5_return,
          breakdown: {
            last_mile: costResult.opex.m5_last_mile,
            return: costResult.opex.m5_return
          },
          type: 'OPEX'
        };
      } else if (moduleKey.startsWith('M6')) {
        return {
          module: 'M6',
          cost: costResult.opex.m6_marketing,
          type: 'OPEX'
        };
      } else if (moduleKey.startsWith('M7')) {
        return {
          module: 'M7',
          cost: costResult.opex.m7_payment + costResult.opex.m7_platform_commission,
          breakdown: {
            payment: costResult.opex.m7_payment,
            commission: costResult.opex.m7_platform_commission
          },
          type: 'OPEX'
        };
      } else if (moduleKey.startsWith('M8')) {
        return {
          module: 'M8',
          cost: costResult.opex.m8_ga,
          type: 'OPEX'
        };
      }
    }
  };

  /**
   * 工具2：对比不同场景
   */
  const compareScenarios = async (countries: string[], metric?: string) => {
    if (!project.scope) {
      return { error: '缺少项目基本信息' };
    }

    const results = [];

    for (const country of countries) {
      try {
        // 为每个国家创建一个临时project对象并计算成本
        const tempProject: Project = {
          ...project,
          id: project.id || 'temp',
          name: project.name || 'temp',
          industry: project.industry || 'pet',
          targetCountry: country as any,  // Type cast to bypass validation since we control the input
          salesChannel: project.salesChannel || 'amazon_fba',
          scope: project.scope as ProjectScope,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const countryResult = calculateCostModel(tempProject);

        const resultData: any = {
          country,
          country_name: getCountryName(country),
        };

        if (!metric || metric === 'all') {
          resultData.gross_margin = countryResult.unit_economics.gross_margin;
          resultData.total_cost = countryResult.opex.total;
          resultData.roi = countryResult.kpis.roi;
          resultData.tariff_rate = getTariffRate(countryResult);
        } else {
          switch (metric) {
            case 'gross_margin':
              resultData.gross_margin = countryResult.unit_economics.gross_margin;
              break;
            case 'total_cost':
              resultData.total_cost = countryResult.opex.total;
              break;
            case 'roi':
              resultData.roi = countryResult.kpis.roi;
              break;
            case 'tariff_rate':
              resultData.tariff_rate = getTariffRate(countryResult);
              break;
          }
        }

        results.push(resultData);
      } catch (error) {
        console.error(`计算${country}成本失败:`, error);
        results.push({
          country,
          error: `无法计算${country}的成本`
        });
      }
    }

    return results;
  };

  /**
   * 工具3：生成优化建议
   */
  const getOptimizationSuggestions = (focusArea?: string) => {
    if (!costResult) {
      return { error: '尚未完成成本计算' };
    }

    const suggestions = [];

    // 定价优化建议
    if (!focusArea || focusArea === 'pricing' || focusArea === 'all') {
      if (costResult.unit_economics.gross_margin < 30) {
        suggestions.push({
          area: 'pricing',
          priority: 'high',
          issue: `当前毛利率${costResult.unit_economics.gross_margin.toFixed(1)}%过低`,
          suggestion: `建议提价至$${costResult.kpis.breakeven_price.toFixed(2)}以上，目标毛利率30%+`,
          impact: `提价至$${(costResult.unit_economics.cost / 0.7).toFixed(2)}可实现30%毛利率`
        });
      }
    }

    // 物流优化建议
    if (!focusArea || focusArea === 'logistics' || focusArea === 'all') {
      const logisticsCost = costResult.opex.m5_last_mile + costResult.opex.m5_return;
      const revenue = costResult.unit_economics.revenue;

      if (logisticsCost / revenue > 0.15) {
        suggestions.push({
          area: 'logistics',
          priority: 'medium',
          issue: `物流成本占比${((logisticsCost / revenue) * 100).toFixed(1)}%较高`,
          suggestion: `考虑优化物流方式：从空运改为海运，或使用海外仓降低最后一公里配送成本`,
          impact: `预计可降低3-5%的物流成本`
        });
      }
    }

    // 营销获客优化建议
    if (!focusArea || focusArea === 'cost_reduction' || focusArea === 'all') {
      const marketingCost = costResult.opex.m6_marketing;
      const revenue = costResult.unit_economics.revenue;

      if (marketingCost / revenue > 0.20) {
        suggestions.push({
          area: 'marketing',
          priority: 'high',
          issue: `CAC占比${((marketingCost / revenue) * 100).toFixed(1)}%过高`,
          suggestion: `优化营销渠道组合，提升自然流量占比，降低付费广告依赖`,
          impact: `CAC降低至15%以下可提升5个百分点毛利率`
        });
      }
    }

    // 市场选择建议
    if (!focusArea || focusArea === 'market_selection' || focusArea === 'all') {
      if (costResult.unit_economics.gross_margin < 25) {
        suggestions.push({
          area: 'market_selection',
          priority: 'high',
          issue: `当前市场${project.targetCountry}毛利率偏低`,
          suggestion: `建议对比越南(VN)、美国(US)、德国(DE)等市场的成本结构，寻找更优市场`,
          impact: `不同市场毛利率差异可达10-20个百分点`
        });
      }
    }

    return {
      total_suggestions: suggestions.length,
      suggestions
    };
  };

  /**
   * 辅助函数：获取国家名称
   */
  const getCountryName = (code: string): string => {
    const countryNames: Record<string, string> = {
      US: '美国', UK: '英国', DE: '德国', FR: '法国', ES: '西班牙',
      IT: '意大利', NL: '荷兰', PL: '波兰', JP: '日本', AU: '澳大利亚',
      CA: '加拿大', MX: '墨西哥', BR: '巴西', VN: '越南', TH: '泰国',
      SG: '新加坡', MY: '马来西亚', ID: '印度尼西亚', IN: '印度'
    };
    return countryNames[code] || code;
  };

  /**
   * 辅助函数：获取关税率
   */
  const getTariffRate = (result: CostResult): number => {
    // 从OPEX中提取关税信息
    return result.opex.m4_tariff / result.opex.m4_cogs * 100;
  };

  /**
   * 系统提示词
   */
  const systemPrompt = `你是GECOM全球电商成本优化专家助手。

**你的能力：**
1. 📊 通过get_cost_breakdown工具查询M1-M8各模块的成本详情
2. 🔍 通过compare_scenarios工具对比不同国家的成本结构
3. 💡 通过get_optimization_suggestions工具生成优化建议

**回答原则：**
- 简洁专业，每次回复控制在200字以内
- 数据驱动：优先使用工具获取真实数据，而不是猜测
- 可执行：提供具体的数值和可操作的建议
- 当用户问"如何优化"、"对比市场"等问题时，主动调用相应工具
- 使用中文回答

**当前项目信息：**
- 目标市场：${project.targetCountry || '未设置'}
- 销售渠道：${project.salesChannel || '未设置'}
- 行业：${project.industry || '未设置'}`;

  /**
   * 发送消息
   */
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // 添加用户消息到界面
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage
    }]);

    try {
      // 调用AI with工具
      const { response, messages: newMessages } = await chatWithTools(
        userMessage,
        allTools,
        executeToolCall,
        systemPrompt,
        messages
      );

      // 更新消息历史（包括assistant回复和tool消息）
      setMessages(newMessages);
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
    '当前定价下需要多少销量才能盈亏平衡？'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">AI智能助手</h2>
        <p className="text-gray-600">
          基于DeepSeek V3工具调用，连接真实成本数据，提供专业优化建议
        </p>
      </div>

      {/* 聊天界面 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[600px]">
        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} ${message.role === 'tool' ? 'opacity-0 h-0' : ''}`}
            >
              {message.role !== 'tool' && (
                <div
                  className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* 头像 */}
                  <div
                    className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white'
                    }`}
                  >
                    {message.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                  </div>

                  {/* 消息内容 */}
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.tool_calls && message.tool_calls.length > 0 ? (
                      <div className="space-y-2">
                        <div className="text-sm opacity-80">正在调用工具...</div>
                        {message.tool_calls.map((toolCall, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm bg-white/10 rounded-lg px-3 py-1.5">
                            <Wrench className="h-4 w-4" />
                            <span>{toolCall.function.name}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[85%]">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="问我任何关于成本优化的问题..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              发送
            </button>
          </div>
        </div>
      </div>

      {/* 快捷问题 */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 快捷问题</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => setInputMessage(question)}
              className="text-left px-4 py-3 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all text-sm text-gray-700"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* 提示信息 */}
      {!costResult && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-800">
            ⚠️ 提示：请先完成Step 2和Step 3的成本计算，AI助手才能访问成本数据为你提供精准分析。
          </p>
        </div>
      )}
    </div>
  );
}

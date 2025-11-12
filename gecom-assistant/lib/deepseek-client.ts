// @ts-nocheck
/**
 * DeepSeek API 客户端
 *
 * 基于OpenAI SDK封装DeepSeek API调用
 * - DeepSeek R1: 纯推理/对话模型
 * - DeepSeek V3: 工具调用模型
 */

import OpenAI from 'openai';
import { CostResult, Scope } from '@/types/gecom';

// ============================================
// 环境变量配置
// ============================================

const LLM_BASE_URL = process.env.LLM_BASE_URL || 'https://llm.chutes.ai/v1';
const LLM_API_KEY = process.env.LLM_API_KEY || '';
const MODEL_REASON = process.env.MODEL_REASON || 'deepseek-ai/DeepSeek-R1';
const MODEL_TOOLCALL = process.env.MODEL_TOOLCALL || 'deepseek-ai/DeepSeek-V3';
const LLM_PROVIDER = process.env.LLM_PROVIDER || 'deepseek';

// ============================================
// OpenAI客户端初始化（兼容DeepSeek）
// ============================================

/**
 * 创建OpenAI客户端实例（兼容DeepSeek API）
 */
export const openai = new OpenAI({
  baseURL: LLM_BASE_URL,
  apiKey: LLM_API_KEY,
});

// ============================================
// 辅助函数
// ============================================

/**
 * 检查DeepSeek API是否已配置
 * @returns 是否已配置
 */
export function isDeepSeekConfigured(): boolean {
  return !!(LLM_BASE_URL && LLM_API_KEY);
}

/**
 * 确保DeepSeek API已配置
 * @throws 如果未配置则抛出错误
 */
function ensureConfigured() {
  if (!isDeepSeekConfigured()) {
    throw new Error('DeepSeek API未配置，请检查环境变量 LLM_BASE_URL 和 LLM_API_KEY');
  }
}

// ============================================
// AI助手功能
// ============================================

/**
 * 通用聊天完成（使用DeepSeek R1）
 * @param messages 消息列表
 * @param options 额外选项
 * @returns AI回复内容
 */
export async function chatCompletion(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options: {
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
  } = {}
): Promise<string> {
  ensureConfigured();

  try {
    const response = await openai.chat.completions.create({
      model: MODEL_REASON,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2000,
      stream: false, // 强制使用非流式模式
    });

    // 类型断言：非流式模式返回ChatCompletion类型
    return (response as any).choices[0]?.message?.content || '';
  } catch (error) {
    console.error('DeepSeek API调用失败:', error);
    throw new Error('AI助手暂时无法响应，请稍后重试');
  }
}

/**
 * 生成成本优化建议
 * @param scope 业务场景
 * @param costResult 成本计算结果
 * @returns 优化建议文本
 */
export async function generateCostOptimizationAdvice(
  scope: Scope,
  costResult: CostResult
): Promise<string> {
  ensureConfigured();

  const systemPrompt = `你是GECOM全球电商成本优化专家。你的任务是根据用户的业务场景和成本计算结果，提供专业的成本优化建议。

分析要点：
1. 识别成本结构中的高占比项目
2. 对比行业基准，指出异常成本
3. 提供3-5条可行的优化建议
4. 说明每条建议的预期效果

输出格式：
- 简洁明了，每条建议控制在50字以内
- 优先级从高到低排序
- 使用中文输出`;

  const userPrompt = `## 业务场景
- 目标市场：${scope.targetCountry}
- 销售渠道：${scope.salesChannel}
- 产品定价：$${scope.sellingPriceUsd}
- 月销量：${scope.monthlyVolume}单

## 成本结构
- 总CAPEX：$${costResult.capex.total.toFixed(2)}
- 单位OPEX：$${costResult.opex.total.toFixed(2)}
- 毛利率：${((costResult as any).unitEconomics?.grossMargin || 0).toFixed(1)}%
- ROI：${((costResult as any).kpis?.roi || 0).toFixed(0)}%
- 回本周期：${((costResult as any).kpis?.paybackPeriod || 0).toFixed(1)}个月

## OPEX分布（占比最高的3项）
1. M4货物税费：$${(costResult.opex.m4_cogs + costResult.opex.m4_tariff + costResult.opex.m4_logistics + costResult.opex.m4_vat).toFixed(2)}
2. M5物流配送：$${(costResult.opex.m5_last_mile + costResult.opex.m5_return).toFixed(2)}
3. M6营销获客：$${costResult.opex.m6_marketing.toFixed(2)}

请分析以上数据，提供成本优化建议：`;

  try {
    return await chatCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], {
      temperature: 0.7,
      maxTokens: 1000,
    });
  } catch (error) {
    console.error('生成优化建议失败:', error);
    return '抱歉，AI助手暂时无法生成优化建议，请稍后重试。';
  }
}

/**
 * 场景敏感性分析
 * @param scope 业务场景
 * @param costResult 成本计算结果
 * @param variable 变量名称（如"定价"、"销量"、"CAC"等）
 * @returns 敏感性分析文本
 */
export async function analyzeSensitivity(
  scope: Scope,
  costResult: CostResult,
  variable: string
): Promise<string> {
  ensureConfigured();

  const systemPrompt = `你是GECOM成本分析专家。用户想了解某个变量对盈利能力的影响程度。请提供专业的敏感性分析。

分析要点：
1. 说明该变量如何影响毛利率和ROI
2. 给出具体的数值变化范围（如±10%、±20%）
3. 建议该变量的优化方向
4. 警告可能的风险

输出格式：简洁专业，100字以内`;

  const userPrompt = `当前场景：
- 产品定价：$${scope.sellingPriceUsd}
- 月销量：${scope.monthlyVolume}单
- 毛利率：${((costResult as any).unitEconomics?.grossMargin || costResult.unit_economics.gross_margin).toFixed(1)}%
- ROI：${costResult.kpis.roi.toFixed(0)}%

请分析变量"${variable}"的敏感性：`;

  try {
    return await chatCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], {
      temperature: 0.5,
      maxTokens: 500,
    });
  } catch (error) {
    console.error('敏感性分析失败:', error);
    return '抱歉，AI助手暂时无法进行敏感性分析，请稍后重试。';
  }
}

/**
 * 智能问答（用于Step 5 AI助手）
 * @param question 用户问题
 * @param context 上下文（项目信息、成本结果等）
 * @returns AI回答
 */
export async function answerQuestion(
  question: string,
  context: {
    scope?: Scope;
    costResult?: CostResult;
  }
): Promise<string> {
  ensureConfigured();

  const systemPrompt = `你是GECOM全球电商成本优化助手。你精通跨境电商成本结构、GECOM双阶段八模块模型、以及各国市场的税务政策。

你的职责：
1. 回答用户关于成本计算、优化策略的问题
2. 解释GECOM模型的各个模块
3. 提供实用的跨境电商建议
4. 使用简洁专业的中文

回答原则：
- 简洁明了，控制在150字以内
- 如果用户提供了成本数据，结合数据回答
- 如果不确定，诚实说明并建议咨询专业人士`;

  let contextPrompt = '';
  if (context.scope && context.costResult) {
    contextPrompt = `\n\n当前项目上下文：
- 目标市场：${context.scope.targetCountry}
- 销售渠道：${context.scope.salesChannel}
- 产品定价：$${context.scope.sellingPriceUsd}
- 毛利率：${((context.costResult as any).unitEconomics?.grossMargin || context.costResult.unit_economics.gross_margin).toFixed(1)}%
- ROI：${context.costResult.kpis.roi.toFixed(0)}%`;
  }

  const userPrompt = `用户问题：${question}${contextPrompt}`;

  try {
    return await chatCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], {
      temperature: 0.7,
      maxTokens: 500,
    });
  } catch (error) {
    console.error('AI问答失败:', error);
    return '抱歉，AI助手暂时无法回答您的问题，请稍后重试。';
  }
}

/**
 * 生成报告摘要（用于PDF/Excel导出）
 * @param scope 业务场景
 * @param costResult 成本计算结果
 * @returns 报告摘要文本
 */
export async function generateReportSummary(
  scope: Scope,
  costResult: CostResult
): Promise<string> {
  ensureConfigured();

  const systemPrompt = `你是GECOM成本分析报告撰写专家。根据用户的业务场景和成本计算结果，生成一份简洁的报告摘要。

报告结构：
1. 项目概览（1-2句话）
2. 关键指标（毛利率、ROI、回本周期）
3. 成本结构分析（2-3句话）
4. 结论与建议（2-3句话）

输出格式：专业、简洁，总字数200字以内`;

  const userPrompt = `## 业务场景
- 目标市场：${scope.targetCountry}
- 销售渠道：${scope.salesChannel}
- 产品定价：$${scope.sellingPriceUsd}
- 月销量：${scope.monthlyVolume}单

## 成本结果
- CAPEX：$${costResult.capex.total.toFixed(2)}
- 单位OPEX：$${costResult.opex.total.toFixed(2)}
- 毛利率：${((costResult as any).unitEconomics?.grossMargin || costResult.unit_economics.gross_margin).toFixed(1)}%
- ROI：${costResult.kpis.roi.toFixed(0)}%
- 回本周期：${((costResult as any).kpis?.paybackPeriod || costResult.kpis.payback_period_months).toFixed(1)}个月

请生成报告摘要：`;

  try {
    return await chatCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], {
      temperature: 0.5,
      maxTokens: 800,
    });
  } catch (error) {
    console.error('生成报告摘要失败:', error);
    return '抱歉，AI助手暂时无法生成报告摘要，请稍后重试。';
  }
}

// ============================================
// 流式响应（未来功能）
// ============================================

/**
 * 流式聊天完成（用于实时打字效果）
 * @param messages 消息列表
 * @param onChunk 每次接收到数据块时的回调
 */
export async function streamChatCompletion(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  onChunk: (chunk: string) => void
): Promise<void> {
  ensureConfigured();

  try {
    const stream = await openai.chat.completions.create({
      model: MODEL_REASON,
      messages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
      }
    }
  } catch (error) {
    console.error('流式响应失败:', error);
    throw new Error('AI助手暂时无法响应，请稍后重试');
  }
}

// ============================================
// 配置信息导出
// ============================================

export const deepseekConfig = {
  baseURL: LLM_BASE_URL,
  provider: LLM_PROVIDER,
  models: {
    reason: MODEL_REASON,
    toolCall: MODEL_TOOLCALL,
  },
};

// ============================================
// 工具调用（Tool Calling）- MVP 2.0 S5.1
// ============================================

/**
 * 消息类型定义
 */
export interface ChatMessage {
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

/**
 * 工具调用响应类型
 */
export interface ToolCallResponse {
  role: 'assistant';
  content: string | null;
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: {
      name: string;
      arguments: string;
    };
  }>;
}

/**
 * 使用DeepSeek V3进行工具调用
 *
 * @param messages 消息历史（包括system、user、assistant、tool消息）
 * @param tools 可用的工具定义列表
 * @param options 额外选项
 * @returns AI响应（可能包含tool_calls）
 */
export async function callDeepSeekWithTools(
  messages: ChatMessage[],
  tools: any[],
  options: {
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<ToolCallResponse> {
  ensureConfigured();

  try {
    const response = await openai.chat.completions.create({
      model: MODEL_TOOLCALL, // 使用DeepSeek V3进行工具调用
      messages: messages as any,
      tools: tools.length > 0 ? tools : undefined,
      tool_choice: tools.length > 0 ? 'auto' : undefined,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 3000,
    });

    const choice = (response as any).choices[0];
    const message = choice?.message;

    return {
      role: 'assistant',
      content: message?.content || null,
      tool_calls: message?.tool_calls || undefined,
    };
  } catch (error) {
    console.error('DeepSeek工具调用失败:', error);
    throw new Error('AI助手暂时无法响应，请稍后重试');
  }
}

/**
 * 简化的工具调用助手 - 自动处理多轮对话
 *
 * @param userMessage 用户消息
 * @param tools 可用的工具定义
 * @param toolExecutor 工具执行函数
 * @param systemPrompt 系统提示词（可选）
 * @param conversationHistory 对话历史（可选）
 * @returns 最终的AI回复
 */
export async function chatWithTools(
  userMessage: string,
  tools: any[],
  toolExecutor: (toolCall: any) => Promise<any>,
  systemPrompt?: string,
  conversationHistory: ChatMessage[] = []
): Promise<{
  response: string;
  messages: ChatMessage[];
}> {
  ensureConfigured();

  // 构建消息列表
  const messages: ChatMessage[] = [
    ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
    ...conversationHistory,
    { role: 'user' as const, content: userMessage }
  ];

  // 第一次调用AI
  let aiResponse = await callDeepSeekWithTools(messages, tools);
  messages.push({
    role: 'assistant',
    content: aiResponse.content || '',
    tool_calls: aiResponse.tool_calls
  });

  // 如果AI需要调用工具
  if (aiResponse.tool_calls && aiResponse.tool_calls.length > 0) {
    // 执行所有工具调用
    for (const toolCall of aiResponse.tool_calls) {
      try {
        const toolResult = await toolExecutor(toolCall);

        // 将工具结果添加到消息历史
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult)
        });
      } catch (error) {
        console.error(`工具调用失败 (${toolCall.function.name}):`, error);
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify({ error: '工具调用失败，请稍后重试' })
        });
      }
    }

    // 再次调用AI生成最终回复
    aiResponse = await callDeepSeekWithTools(messages, []);
    messages.push({
      role: 'assistant',
      content: aiResponse.content || '抱歉，我无法生成回复。'
    });
  }

  return {
    response: aiResponse.content || '抱歉，我无法生成回复。',
    messages
  };
}

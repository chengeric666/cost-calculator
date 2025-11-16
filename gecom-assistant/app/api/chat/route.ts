/**
 * AI聊天API Route
 *
 * 作为中间层处理前端聊天请求，调用DeepSeek API
 * 避免在浏览器中暴露API密钥
 */

import { NextRequest, NextResponse } from 'next/server';
import { chatWithTools, ChatMessage } from '@/lib/deepseek-client';
import { allTools } from '@/lib/deepseek-tools';
import {
  getCostBreakdown,
  compareScenarios,
  getOptimizationSuggestions
} from '@/lib/ai/tools';
import { Project } from '@/types/gecom';

interface ChatRequest {
  message: string;
  conversationHistory: ChatMessage[];
  project: Partial<Project>;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, conversationHistory, project } = body;

    // 系统提示词
    const systemPrompt = `你是GECOM全球电商成本优化助手。你精通跨境电商成本结构、GECOM双阶段八模块模型。

你的核心能力：
1. 分析M1-M8各模块的成本拆解
2. 对比不同市场的成本结构
3. 提供ROI优化建议
4. 识别成本驱动因素

你可以使用以下工具：
- get_cost_breakdown: 获取成本拆解详情
- compare_scenarios: 对比不同国家的成本
- get_optimization_suggestions: 生成优化建议

回答原则：
- 简洁专业，结合数据回答
- 使用Markdown格式，清晰排版
- 如果需要数据，主动调用工具`;

    // 工具执行器
    const toolExecutor = async (toolCall: any) => {
      const { name, arguments: argsStr } = toolCall.function;
      const args = JSON.parse(argsStr);

      switch (name) {
        case 'get_cost_breakdown':
          return getCostBreakdown({ module: args.module }, project);

        case 'compare_scenarios':
          return await compareScenarios(
            { countries: args.countries, metric: args.metric },
            project
          );

        case 'get_optimization_suggestions':
          return getOptimizationSuggestions({ focus_area: args.focus_area }, project);

        default:
          throw new Error(`未知工具: ${name}`);
      }
    };

    // 调用DeepSeek工具调用API
    const result = await chatWithTools(
      message,
      allTools,
      toolExecutor,
      systemPrompt,
      conversationHistory
    );

    return NextResponse.json({
      success: true,
      response: result.response,
      messages: result.messages
    });

  } catch (error) {
    console.error('AI聊天API错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'AI助手暂时无法响应，请稍后重试'
      },
      { status: 500 }
    );
  }
}

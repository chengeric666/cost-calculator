/**
 * AI聊天API Route
 *
 * 作为中间层处理前端聊天请求，调用DeepSeek API
 * 避免在浏览器中暴露API密钥
 */

import { NextRequest, NextResponse } from 'next/server';
import { chatWithTools, ChatMessage } from '@/lib/deepseek-client';
import { allTools } from '@/lib/deepseek-tools';
import { calculateCostModel } from '@/lib/gecom/calculator';
import { Project, ProjectScope } from '@/types/gecom';

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
          return getCostBreakdown(args.module, project);

        case 'compare_scenarios':
          return compareScenarios(args.countries, args.metric, project);

        case 'get_optimization_suggestions':
          return getOptimizationSuggestions(args.focus_area, project);

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

// ============================================
// 工具执行函数（服务器端）
// ============================================

/**
 * 工具1：获取成本拆解
 */
function getCostBreakdown(module: string | undefined, project: Partial<Project>) {
  // 如果没有成本结果，先计算
  let costResult;
  try {
    const fullProject: Project = {
      id: project.id || 'temp',
      name: project.name || 'temp',
      industry: project.industry || 'pet',
      targetCountry: project.targetCountry as any || 'US',
      salesChannel: project.salesChannel as any || 'amazon_fba',
      scope: project.scope as ProjectScope,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    costResult = calculateCostModel(fullProject);
  } catch (error) {
    return { error: '尚未完成成本计算，请先完成Step 2和Step 3' };
  }

  if (!module || module === 'all') {
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
        m5_logistics: costResult.opex.m5_last_mile + costResult.opex.m5_return,
        m6_marketing: costResult.opex.m6_marketing,
        m7_payment: costResult.opex.m7_payment + costResult.opex.m7_platform_commission,
        m8_operations: costResult.opex.m8_ga
      }
    };
  }

  // 单模块查询
  const moduleData: any = {
    module_name: module
  };

  switch (module) {
    case 'm1':
      moduleData.market_entry = { total: costResult.capex.m1 };
      break;
    case 'm2':
      moduleData.technical_compliance = { total: costResult.capex.m2 };
      break;
    case 'm3':
      moduleData.supply_chain = { total: costResult.capex.m3 };
      break;
    case 'm4':
      moduleData.goods_tax = {
        cogs: costResult.opex.m4_cogs,
        tariff: costResult.opex.m4_tariff,
        logistics: costResult.opex.m4_logistics,
        vat: costResult.opex.m4_vat,
        total: costResult.opex.m4_cogs + costResult.opex.m4_tariff + costResult.opex.m4_logistics + costResult.opex.m4_vat
      };
      break;
    case 'm5':
      moduleData.logistics = {
        last_mile: costResult.opex.m5_last_mile,
        return: costResult.opex.m5_return,
        total: costResult.opex.m5_last_mile + costResult.opex.m5_return
      };
      break;
    case 'm6':
      moduleData.marketing = {
        total: costResult.opex.m6_marketing
      };
      break;
    case 'm7':
      moduleData.payment = {
        gateway: costResult.opex.m7_payment,
        commission: costResult.opex.m7_platform_commission,
        total: costResult.opex.m7_payment + costResult.opex.m7_platform_commission
      };
      break;
    case 'm8':
      moduleData.operations = {
        total: costResult.opex.m8_ga
      };
      break;
  }

  return moduleData;
}

/**
 * 工具2：对比不同场景
 */
async function compareScenarios(
  countries: string[],
  metric: string | undefined,
  project: Partial<Project>
) {
  if (!project.scope) {
    return { error: '缺少项目基本信息' };
  }

  const results = [];

  for (const country of countries) {
    try {
      const tempProject: Project = {
        id: project.id || 'temp',
        name: project.name || 'temp',
        industry: project.industry || 'pet',
        targetCountry: country as any,
        salesChannel: project.salesChannel as any || 'amazon_fba',
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
      results.push({
        country,
        error: `无法计算${country}的成本`
      });
    }
  }

  return results;
}

/**
 * 工具3：生成优化建议
 */
function getOptimizationSuggestions(
  focusArea: string | undefined,
  project: Partial<Project>
) {
  let costResult;
  try {
    const fullProject: Project = {
      id: project.id || 'temp',
      name: project.name || 'temp',
      industry: project.industry || 'pet',
      targetCountry: project.targetCountry as any || 'US',
      salesChannel: project.salesChannel as any || 'amazon_fba',
      scope: project.scope as ProjectScope,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    costResult = calculateCostModel(fullProject);
  } catch (error) {
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
        suggestion: `建议提价至${costResult.kpis.breakeven_price.toFixed(2)}以上，目标毛利率30%+`,
        impact: `提价至${(costResult.unit_economics.cost / 0.7).toFixed(2)}可实现30%毛利率`
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
        suggestion: `考虑优化物流方式：从空运改为海运，或使用海外仓降低配送成本`,
        impact: `预计可降低3-5%的物流成本`
      });
    }
  }

  // 市场选择建议
  if (!focusArea || focusArea === 'market_selection' || focusArea === 'all') {
    if (costResult.unit_economics.gross_margin < 25) {
      suggestions.push({
        area: 'market_selection',
        priority: 'medium',
        issue: `当前市场毛利率偏低`,
        suggestion: `建议对比越南、德国等低关税市场，评估市场切换可行性`,
        impact: `选择合适市场可提升5-10%毛利率`
      });
    }
  }

  // 成本削减建议
  if (!focusArea || focusArea === 'cost_reduction' || focusArea === 'all') {
    const cac = costResult.opex.m6_marketing;
    const revenue = costResult.unit_economics.revenue;

    if (cac / revenue > 0.20) {
      suggestions.push({
        area: 'cost_reduction',
        priority: 'high',
        issue: `CAC占比${((cac / revenue) * 100).toFixed(1)}%过高`,
        suggestion: `优化营销渠道，提升自然流量，降低获客成本`,
        impact: `CAC降低5美元可提升${((5 / revenue) * 100).toFixed(1)}%毛利率`
      });
    }
  }

  return {
    total_suggestions: suggestions.length,
    suggestions
  };
}

// ============================================
// 辅助函数
// ============================================

function getCountryName(code: string): string {
  const countryNames: Record<string, string> = {
    'US': '美国',
    'DE': '德国',
    'VN': '越南',
    'UK': '英国',
    'JP': '日本',
    'CA': '加拿大',
    'FR': '法国',
    'IT': '意大利',
    'ES': '西班牙',
    'SG': '新加坡',
    'MY': '马来西亚',
    'TH': '泰国',
    'ID': '印度尼西亚',
    'PH': '菲律宾',
    'IN': '印度',
    'KR': '韩国',
    'AU': '澳大利亚',
    'SA': '沙特阿拉伯',
    'AE': '阿联酋'
  };
  return countryNames[code] || code;
}

function getTariffRate(costResult: any): number {
  const tariff = costResult.opex.m4_tariff || 0;
  const cogs = costResult.opex.m4_cogs || 1;
  return (tariff / cogs) * 100;
}

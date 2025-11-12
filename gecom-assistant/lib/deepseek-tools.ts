/**
 * DeepSeek工具调用定义
 *
 * 为Step 5 AI助手提供三个核心工具：
 * 1. get_cost_breakdown - 获取成本拆解详情
 * 2. compare_scenarios - 对比不同国家/渠道的成本
 * 3. get_optimization_suggestions - 生成成本优化建议
 *
 * 基于OpenAI Function Calling格式，兼容DeepSeek V3 API
 */

/**
 * 工具1：获取成本拆解详情
 *
 * 功能：查询当前项目的M1-M8各模块成本明细
 * 参数：module - 可选，指定要查询的模块（all/m1/m2/.../m8）
 */
export const getCostBreakdownTool = {
  type: 'function' as const,
  function: {
    name: 'get_cost_breakdown',
    description: '获取当前项目的成本拆解详情，包括M1-M8各模块的成本明细、CAPEX/OPEX总计、单位经济模型和关键KPI',
    parameters: {
      type: 'object',
      properties: {
        module: {
          type: 'string',
          enum: ['all', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8'],
          description: '要查询的模块：all=全部模块，m1=市场准入，m2=技术合规，m3=供应链搭建，m4=货物税费，m5=物流配送，m6=营销获客，m7=支付手续费，m8=运营管理'
        }
      },
      required: []
    }
  }
};

/**
 * 工具2：对比不同场景
 *
 * 功能：对比不同国家或渠道的成本结构，找出差异和最优选择
 * 参数：
 *  - countries: 必需，要对比的国家代码列表
 *  - metric: 可选，对比的指标（毛利率/总成本/ROI/关税率等）
 */
export const compareScenariosTool = {
  type: 'function' as const,
  function: {
    name: 'compare_scenarios',
    description: '对比不同国家或渠道的成本结构，分析各市场的毛利率、总成本、ROI、关税率等关键指标的差异，找出最优市场选择',
    parameters: {
      type: 'object',
      properties: {
        countries: {
          type: 'array',
          items: { type: 'string' },
          description: '要对比的国家代码列表，如["US", "VN", "DE"]。支持的国家代码：US(美国)、UK(英国)、DE(德国)、FR(法国)、ES(西班牙)、IT(意大利)、NL(荷兰)、PL(波兰)、JP(日本)、AU(澳大利亚)、CA(加拿大)、MX(墨西哥)、BR(巴西)、VN(越南)、TH(泰国)、SG(新加坡)、MY(马来西亚)、ID(印度尼西亚)、IN(印度)'
        },
        metric: {
          type: 'string',
          enum: ['gross_margin', 'total_cost', 'roi', 'tariff_rate', 'all'],
          description: '对比的指标：gross_margin=毛利率，total_cost=总成本，roi=投资回报率，tariff_rate=关税税率，all=所有指标'
        }
      },
      required: ['countries']
    }
  }
};

/**
 * 工具3：生成优化建议
 *
 * 功能：基于当前成本结构生成优化建议
 * 参数：focus_area - 可选，优化重点领域
 */
export const getOptimizationSuggestionsTool = {
  type: 'function' as const,
  function: {
    name: 'get_optimization_suggestions',
    description: '基于当前成本结构和市场数据，生成可行的优化建议。包括：定价策略优化、物流方式优化、市场选择优化、成本削减建议等',
    parameters: {
      type: 'object',
      properties: {
        focus_area: {
          type: 'string',
          enum: ['pricing', 'logistics', 'market_selection', 'cost_reduction', 'all'],
          description: '优化重点领域：pricing=定价策略，logistics=物流优化，market_selection=市场选择，cost_reduction=成本削减，all=全面优化'
        }
      },
      required: []
    }
  }
};

/**
 * 所有工具的集合
 */
export const allTools = [
  getCostBreakdownTool,
  compareScenariosTool,
  getOptimizationSuggestionsTool
];

/**
 * 工具类型定义
 */
export type ToolName = 'get_cost_breakdown' | 'compare_scenarios' | 'get_optimization_suggestions';

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: ToolName;
    arguments: string;
  };
}

export interface ToolResult {
  tool_call_id: string;
  role: 'tool';
  content: string;
}

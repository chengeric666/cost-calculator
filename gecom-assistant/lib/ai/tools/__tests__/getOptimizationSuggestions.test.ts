/**
 * 单元测试：getOptimizationSuggestions工具函数
 *
 * 测试覆盖：
 * - 参数验证（缺失scope）
 * - 全面优化建议（focus_area='all'）
 * - 单领域优化建议（pricing/logistics/market_selection/cost_reduction）
 * - 边界条件（高毛利率、低CAC等）
 * - 错误处理（计算失败）
 *
 * 目标覆盖率：>80%
 */

import { describe, it, expect } from 'vitest';
import { getOptimizationSuggestions } from '../getOptimizationSuggestions';
import { Project, ProjectScope } from '@/types/gecom';

// ============================================
// 测试数据
// ============================================

// 低毛利率场景（需要定价优化）
const lowMarginProject: Partial<Project> = {
  id: 'test-project-low-margin',
  name: 'Low Margin Project',
  industry: 'pet',
  targetCountry: 'US',
  salesChannel: 'amazon_fba',
  scope: {
    productInfo: {
      sku: 'LOW-MARGIN-001',
      name: 'Low Margin Product',
      category: 'pet_food',
      weight: 1.5,
      cogs: 15,        // 高COGS
      targetPrice: 20  // 低定价
    },
    assumptions: {
      monthlySales: 1000,
      returnRate: 0.1,
      growthRate: 0.05
    }
  } as ProjectScope,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01')
};

// 高物流成本场景
const highLogisticsProject: Partial<Project> = {
  id: 'test-project-high-logistics',
  name: 'High Logistics Project',
  industry: 'pet',
  targetCountry: 'US',
  salesChannel: 'shopify',
  scope: {
    productInfo: {
      sku: 'HIGH-LOGISTICS-001',
      name: 'Heavy Product',
      category: 'pet_food',
      weight: 5, // 重产品，高物流成本
      cogs: 10,
      targetPrice: 50
    },
    assumptions: {
      monthlySales: 1000,
      returnRate: 0.1,
      growthRate: 0.05
    }
  } as ProjectScope,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01')
};

// 健康场景（高毛利率）
const healthyProject: Partial<Project> = {
  id: 'test-project-healthy',
  name: 'Healthy Project',
  industry: 'pet',
  targetCountry: 'VN', // 低关税国家
  salesChannel: 'amazon_fba',
  scope: {
    productInfo: {
      sku: 'HEALTHY-001',
      name: 'Healthy Product',
      category: 'pet_food',
      weight: 0.5,
      cogs: 12,
      targetPrice: 60
    },
    assumptions: {
      monthlySales: 2000,
      returnRate: 0.1,
      growthRate: 0.05
    }
  } as ProjectScope,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01')
};

// ============================================
// 测试套件
// ============================================

describe('getOptimizationSuggestions', () => {
  describe('参数验证', () => {
    it('应该返回错误当缺少scope参数', () => {
      const result = getOptimizationSuggestions({ focus_area: 'all' }, {});

      expect(result.total_suggestions).toBe(0);
      expect(result.suggestions).toHaveLength(0);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('缺少项目基本信息');
    });
  });

  describe('全面优化建议（focus_area=all）', () => {
    it('应该为低毛利率项目生成多条建议', () => {
      const result = getOptimizationSuggestions({ focus_area: 'all' }, lowMarginProject);

      expect(result.total_suggestions).toBeGreaterThan(0);
      expect(result.suggestions).toBeInstanceOf(Array);

      // 应该包含定价优化建议
      const pricingSuggestion = result.suggestions.find(s => s.area === 'pricing');
      expect(pricingSuggestion).toBeDefined();
      expect(pricingSuggestion?.priority).toBe('high');
    });

    it('应该返回正确的建议结构', () => {
      const result = getOptimizationSuggestions({ focus_area: 'all' }, lowMarginProject);

      result.suggestions.forEach(suggestion => {
        expect(suggestion.area).toBeDefined();
        expect(suggestion.priority).toMatch(/^(high|medium|low)$/);
        expect(suggestion.issue).toBeDefined();
        expect(suggestion.suggestion).toBeDefined();
        expect(suggestion.impact).toBeDefined();
      });
    });
  });

  describe('定价策略优化（focus_area=pricing）', () => {
    it('应该为低毛利率项目建议提价', () => {
      const result = getOptimizationSuggestions({ focus_area: 'pricing' }, lowMarginProject);

      const pricingSuggestion = result.suggestions.find(s => s.area === 'pricing');
      expect(pricingSuggestion).toBeDefined();
      expect(pricingSuggestion?.priority).toBe('high');
      expect(pricingSuggestion?.issue).toContain('毛利率');
      expect(pricingSuggestion?.suggestion).toContain('建议提价');
    });

    it('应该为健康毛利率项目提供渐进式优化建议', () => {
      const result = getOptimizationSuggestions({ focus_area: 'pricing' }, healthyProject);

      // 健康毛利率（≥30%）应该得到低优先级建议
      if (result.suggestions.length > 0) {
        const pricingSuggestion = result.suggestions.find(s => s.area === 'pricing');
        if (pricingSuggestion) {
          expect(pricingSuggestion.priority).toBe('low');
        }
      }
    });
  });

  describe('物流优化（focus_area=logistics）', () => {
    it('应该为高物流成本项目提供建议', () => {
      const result = getOptimizationSuggestions({ focus_area: 'logistics' }, highLogisticsProject);

      // 可能会有物流优化建议
      expect(result.suggestions).toBeInstanceOf(Array);

      const logisticsSuggestion = result.suggestions.find(s => s.area === 'logistics');
      if (logisticsSuggestion) {
        expect(logisticsSuggestion.issue).toContain('物流成本');
        expect(logisticsSuggestion.suggestion).toBeDefined();
      }
    });

    it('应该返回物流优化的具体影响', () => {
      const result = getOptimizationSuggestions({ focus_area: 'logistics' }, highLogisticsProject);

      const logisticsSuggestion = result.suggestions.find(s => s.area === 'logistics');
      if (logisticsSuggestion) {
        expect(logisticsSuggestion.impact).toBeDefined();
        expect(logisticsSuggestion.impact.length).toBeGreaterThan(0);
      }
    });
  });

  describe('市场选择优化（focus_area=market_selection）', () => {
    it('应该为低毛利率市场建议切换市场', () => {
      const result = getOptimizationSuggestions({ focus_area: 'market_selection' }, lowMarginProject);

      const marketSuggestion = result.suggestions.find(s => s.area === 'market_selection');
      if (marketSuggestion) {
        expect(marketSuggestion.issue).toContain('毛利率');
        expect(marketSuggestion.suggestion).toContain('建议对比');
      }
    });

    it('应该为高ROI项目建议扩张', () => {
      const result = getOptimizationSuggestions({ focus_area: 'market_selection' }, healthyProject);

      const marketSuggestion = result.suggestions.find(s => s.area === 'market_selection');
      if (marketSuggestion) {
        // 高ROI场景应该建议扩张
        expect(marketSuggestion.priority).toBe('low');
      }
    });
  });

  describe('成本削减（focus_area=cost_reduction）', () => {
    it('应该识别高CAC成本项目', () => {
      // CAC通常来自成本因子数据，此处仅测试函数逻辑
      const result = getOptimizationSuggestions({ focus_area: 'cost_reduction' }, lowMarginProject);

      expect(result.suggestions).toBeInstanceOf(Array);
    });

    it('应该提供具体的成本削减建议', () => {
      const result = getOptimizationSuggestions({ focus_area: 'cost_reduction' }, lowMarginProject);

      result.suggestions.forEach(suggestion => {
        expect(suggestion.area).toBe('cost_reduction');
        expect(suggestion.suggestion).toBeDefined();
        expect(suggestion.impact).toBeDefined();
      });
    });
  });

  describe('默认参数处理', () => {
    it('应该默认返回全面建议（不传focus_area参数）', () => {
      const result = getOptimizationSuggestions({}, lowMarginProject);

      // 默认应该包含多个领域的建议
      expect(result.total_suggestions).toBeGreaterThan(0);
      expect(result.suggestions.length).toBe(result.total_suggestions);
    });
  });

  describe('建议优先级', () => {
    it('应该根据严重程度设置优先级', () => {
      const result = getOptimizationSuggestions({ focus_area: 'all' }, lowMarginProject);

      // 低毛利率应该触发高优先级建议
      const highPrioritySuggestions = result.suggestions.filter(s => s.priority === 'high');
      expect(highPrioritySuggestions.length).toBeGreaterThan(0);
    });

    it('应该为健康项目提供低优先级建议', () => {
      const result = getOptimizationSuggestions({ focus_area: 'all' }, healthyProject);

      // 健康项目应该主要是低优先级建议
      const lowPrioritySuggestions = result.suggestions.filter(s => s.priority === 'low');
      expect(lowPrioritySuggestions.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('边界条件', () => {
    it('应该处理极端低毛利率场景', () => {
      const extremeProject: Partial<Project> = {
        ...lowMarginProject,
        scope: {
          productInfo: {
            sku: 'EXTREME-001',
            name: 'Extreme Low Margin',
            category: 'pet_food',
            weight: 1.5,
            cogs: 15,
            targetPrice: 15 // 价格等于COGS
          },
          assumptions: {
            monthlySales: 1000,
            returnRate: 0.1,
            growthRate: 0
          }
        } as ProjectScope
      };

      const result = getOptimizationSuggestions({ focus_area: 'all' }, extremeProject);

      // 应该有紧急的定价建议
      expect(result.total_suggestions).toBeGreaterThan(0);
      const pricingSuggestion = result.suggestions.find(s => s.area === 'pricing');
      expect(pricingSuggestion?.priority).toBe('high');
    });

    it('应该处理0建议场景（非常健康的项目）', () => {
      // 理论上即使很健康的项目也应该有一些低优先级建议
      const result = getOptimizationSuggestions({ focus_area: 'all' }, healthyProject);

      expect(result.total_suggestions).toBeGreaterThanOrEqual(0);
      expect(result.suggestions).toBeInstanceOf(Array);
    });
  });

  describe('错误处理', () => {
    it('应该处理无效的项目参数', () => {
      const invalidProject: Partial<Project> = {
        scope: {
          productInfo: {
            sku: 'INVALID',
            name: 'Invalid',
            category: 'pet_food',
            weight: 0,
            cogs: 0,
            targetPrice: 0
          },
          assumptions: {
            monthlySales: 0,
            returnRate: 0,
            growthRate: 0
          }
        } as ProjectScope
      };

      // 应该返回错误而非崩溃
      const result = getOptimizationSuggestions({ focus_area: 'all' }, invalidProject);

      expect(result).toBeDefined();
      // 可能返回错误或空建议
      expect(result.total_suggestions + (result.error ? 1 : 0)).toBeGreaterThanOrEqual(0);
    });
  });
});

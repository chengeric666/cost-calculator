/**
 * 单元测试：getCostBreakdown工具函数
 *
 * 测试覆盖：
 * - 参数验证（缺失scope）
 * - 全部模块查询（module='all'）
 * - 单个模块查询（m1-m8）
 * - 错误处理（计算失败）
 * - 辅助函数（isValidModule）
 *
 * 目标覆盖率：>80%
 */

import { describe, it, expect } from 'vitest';
import { getCostBreakdown, isValidModule } from '../getCostBreakdown';
import { Project, ProjectScope } from '@/types/gecom';

// ============================================
// 测试数据
// ============================================

const mockProject: Partial<Project> = {
  id: 'test-project',
  name: 'Test Project',
  industry: 'pet',
  targetCountry: 'US',
  salesChannel: 'amazon_fba',
  scope: {
    productInfo: {
      sku: 'TEST-SKU-001',
      name: 'Test Product',
      category: 'pet_food',
      weight: 1.5,
      cogs: 15,
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

// ============================================
// 测试套件
// ============================================

describe('getCostBreakdown', () => {
  describe('参数验证', () => {
    it('应该返回错误当缺少scope参数', () => {
      const result = getCostBreakdown({ module: 'all' }, {});

      expect(result.error).toBeDefined();
      expect(result.error).toContain('缺少项目基本信息');
    });

    it('应该处理无效的module参数', () => {
      const result = getCostBreakdown({ module: 'invalid' as any }, mockProject);

      expect(result.error).toBeDefined();
      expect(result.error).toContain('未知模块');
    });
  });

  describe('全部模块查询（module=all）', () => {
    it('应该返回完整的成本拆解', () => {
      const result = getCostBreakdown({ module: 'all' }, mockProject);

      // 验证summary存在
      expect(result.summary).toBeDefined();
      expect(result.summary?.capex_total).toBeTypeOf('number');
      expect(result.summary?.opex_total).toBeTypeOf('number');

      // 验证unit_economics存在
      expect(result.summary?.unit_economics).toBeDefined();
      expect(result.summary?.unit_economics.revenue).toBeGreaterThan(0);
      expect(result.summary?.unit_economics.cost).toBeGreaterThan(0);
      expect(result.summary?.unit_economics.gross_margin).toBeTypeOf('number');

      // 验证kpis存在
      expect(result.summary?.kpis).toBeDefined();
      expect(result.summary?.kpis.roi).toBeTypeOf('number');
      expect(result.summary?.kpis.payback_period_months).toBeTypeOf('number');
      expect(result.summary?.kpis.breakeven_price).toBeGreaterThan(0);
      expect(result.summary?.kpis.breakeven_volume).toBeGreaterThan(0);
    });

    it('应该返回CAPEX分解', () => {
      const result = getCostBreakdown({ module: 'all' }, mockProject);

      expect(result.capex_breakdown).toBeDefined();
      expect(result.capex_breakdown?.m1_market_entry).toBeGreaterThanOrEqual(0);
      expect(result.capex_breakdown?.m2_technical_compliance).toBeGreaterThanOrEqual(0);
      expect(result.capex_breakdown?.m3_supply_chain).toBeGreaterThanOrEqual(0);
    });

    it('应该返回OPEX分解', () => {
      const result = getCostBreakdown({ module: 'all' }, mockProject);

      expect(result.opex_breakdown).toBeDefined();
      expect(result.opex_breakdown?.m4_goods_tax).toBeGreaterThan(0);
      expect(result.opex_breakdown?.m5_logistics).toBeGreaterThanOrEqual(0);
      expect(result.opex_breakdown?.m6_marketing).toBeGreaterThanOrEqual(0);
      expect(result.opex_breakdown?.m7_payment).toBeGreaterThanOrEqual(0);
      expect(result.opex_breakdown?.m8_operations).toBeGreaterThanOrEqual(0);
    });
  });

  describe('单个模块查询', () => {
    it('应该返回M1市场准入成本', () => {
      const result = getCostBreakdown({ module: 'm1' }, mockProject);

      expect(result.module_name).toBe('m1');
      expect(result.market_entry).toBeDefined();
      expect(result.market_entry?.total).toBeGreaterThanOrEqual(0);
    });

    it('应该返回M4货物税费成本', () => {
      const result = getCostBreakdown({ module: 'm4' }, mockProject);

      expect(result.module_name).toBe('m4');
      expect(result.goods_tax).toBeDefined();
      expect(result.goods_tax?.cogs).toBeGreaterThan(0);
      expect(result.goods_tax?.total).toBeGreaterThan(0);
    });

    it('应该返回M5物流配送成本', () => {
      const result = getCostBreakdown({ module: 'm5' }, mockProject);

      expect(result.module_name).toBe('m5');
      expect(result.logistics).toBeDefined();
      expect(result.logistics?.total).toBeGreaterThanOrEqual(0);
    });

    it('应该返回M6营销获客成本', () => {
      const result = getCostBreakdown({ module: 'm6' }, mockProject);

      expect(result.module_name).toBe('m6');
      expect(result.marketing).toBeDefined();
      expect(result.marketing?.total).toBeGreaterThanOrEqual(0);
    });

    it('应该返回M7支付手续费成本', () => {
      const result = getCostBreakdown({ module: 'm7' }, mockProject);

      expect(result.module_name).toBe('m7');
      expect(result.payment).toBeDefined();
      expect(result.payment?.total).toBeGreaterThanOrEqual(0);
    });

    it('应该返回M8运营管理成本', () => {
      const result = getCostBreakdown({ module: 'm8' }, mockProject);

      expect(result.module_name).toBe('m8');
      expect(result.operations).toBeDefined();
      expect(result.operations?.total).toBeGreaterThanOrEqual(0);
    });
  });

  describe('默认参数处理', () => {
    it('应该默认返回全部模块（不传module参数）', () => {
      const result = getCostBreakdown({}, mockProject);

      expect(result.summary).toBeDefined();
      expect(result.capex_breakdown).toBeDefined();
      expect(result.opex_breakdown).toBeDefined();
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
            targetPrice: -10 // 无效价格
          },
          assumptions: {
            monthlySales: 0,
            returnRate: 0,
            growthRate: 0
          }
        } as ProjectScope
      };

      const result = getCostBreakdown({ module: 'all' }, invalidProject);

      // 即使参数无效，calculator应该返回结果（0或合理默认值）
      expect(result).toBeDefined();
    });
  });
});

describe('isValidModule辅助函数', () => {
  it('应该验证有效的模块名称', () => {
    expect(isValidModule('all')).toBe(true);
    expect(isValidModule('m1')).toBe(true);
    expect(isValidModule('m4')).toBe(true);
    expect(isValidModule('m8')).toBe(true);
  });

  it('应该拒绝无效的模块名称', () => {
    expect(isValidModule('invalid')).toBe(false);
    expect(isValidModule('m9')).toBe(false);
    expect(isValidModule('M1')).toBe(false); // 区分大小写
    expect(isValidModule('')).toBe(false);
  });
});

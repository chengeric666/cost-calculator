/**
 * 单元测试：compareScenarios工具函数
 *
 * 测试覆盖：
 * - 参数验证（缺失countries、过多countries）
 * - 多国对比（all指标）
 * - 单指标对比（gross_margin/total_cost/roi/tariff_rate）
 * - 错误处理（无效国家代码）
 * - 辅助函数（getCountryName/getTariffRate/isValidCountryCode/validateCountries）
 *
 * 目标覆盖率：>80%
 */

import { describe, it, expect } from 'vitest';
import {
  compareScenarios,
  getCountryName,
  getTariffRate,
  isValidCountryCode,
  validateCountries
} from '../compareScenarios';
import { Project, ProjectScope, CostResult } from '@/types/gecom';

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

describe('compareScenarios', () => {
  describe('参数验证', () => {
    it('应该返回错误当缺少countries参数', async () => {
      const result = await compareScenarios({ countries: [] }, mockProject);

      expect(result).toHaveLength(1);
      expect(result[0].error).toBeDefined();
      expect(result[0].error).toContain('缺少countries参数');
    });

    it('应该返回错误当countries数量超过19个', async () => {
      const tooManyCountries = Array(20).fill('US');
      const result = await compareScenarios({ countries: tooManyCountries }, mockProject);

      expect(result).toHaveLength(1);
      expect(result[0].error).toBeDefined();
      expect(result[0].error).toContain('最多支持对比19个国家');
    });

    it('应该返回错误当缺少scope参数', async () => {
      const result = await compareScenarios({ countries: ['US'] }, {});

      expect(result).toHaveLength(1);
      expect(result[0].error).toBeDefined();
      expect(result[0].error).toContain('缺少项目基本信息');
    });
  });

  describe('多国对比（all指标）', () => {
    it('应该对比3个国家的所有指标', async () => {
      const result = await compareScenarios(
        { countries: ['US', 'VN', 'DE'], metric: 'all' },
        mockProject
      );

      expect(result).toHaveLength(3);

      // 验证每个国家的结果
      result.forEach(countryResult => {
        expect(countryResult.country).toBeDefined();
        expect(countryResult.country_name).toBeDefined();
        expect(countryResult.gross_margin).toBeTypeOf('number');
        expect(countryResult.total_cost).toBeTypeOf('number');
        expect(countryResult.roi).toBeTypeOf('number');
        expect(countryResult.tariff_rate).toBeTypeOf('number');
      });

      // 验证国家代码正确
      expect(result[0].country).toBe('US');
      expect(result[1].country).toBe('VN');
      expect(result[2].country).toBe('DE');
    });

    it('应该返回正确的国家中文名称', async () => {
      const result = await compareScenarios(
        { countries: ['US', 'JP', 'CA'], metric: 'all' },
        mockProject
      );

      expect(result[0].country_name).toBe('美国');
      expect(result[1].country_name).toBe('日本');
      expect(result[2].country_name).toBe('加拿大');
    });
  });

  describe('单指标对比', () => {
    it('应该仅返回毛利率指标', async () => {
      const result = await compareScenarios(
        { countries: ['US', 'VN'], metric: 'gross_margin' },
        mockProject
      );

      expect(result).toHaveLength(2);
      result.forEach(countryResult => {
        expect(countryResult.gross_margin).toBeTypeOf('number');
        expect(countryResult.total_cost).toBeUndefined();
        expect(countryResult.roi).toBeUndefined();
        expect(countryResult.tariff_rate).toBeUndefined();
      });
    });

    it('应该仅返回总成本指标', async () => {
      const result = await compareScenarios(
        { countries: ['US', 'VN'], metric: 'total_cost' },
        mockProject
      );

      result.forEach(countryResult => {
        expect(countryResult.total_cost).toBeTypeOf('number');
        expect(countryResult.gross_margin).toBeUndefined();
        expect(countryResult.roi).toBeUndefined();
      });
    });

    it('应该仅返回ROI指标', async () => {
      const result = await compareScenarios(
        { countries: ['US', 'DE'], metric: 'roi' },
        mockProject
      );

      result.forEach(countryResult => {
        expect(countryResult.roi).toBeTypeOf('number');
        expect(countryResult.gross_margin).toBeUndefined();
      });
    });

    it('应该仅返回关税率指标', async () => {
      const result = await compareScenarios(
        { countries: ['US', 'VN'], metric: 'tariff_rate' },
        mockProject
      );

      result.forEach(countryResult => {
        expect(countryResult.tariff_rate).toBeTypeOf('number');
        expect(countryResult.gross_margin).toBeUndefined();
      });
    });
  });

  describe('错误处理', () => {
    it('应该处理无效的国家代码', async () => {
      const result = await compareScenarios(
        { countries: ['US', 'INVALID', 'VN'], metric: 'all' },
        mockProject
      );

      expect(result).toHaveLength(3);

      // 验证有效国家正常返回
      expect(result[0].country).toBe('US');
      expect(result[0].error).toBeUndefined();

      // 验证无效国家返回错误
      expect(result[1].country).toBe('INVALID');
      expect(result[1].error).toBeDefined();
      expect(result[1].error).toContain('不支持的国家代码');

      // 验证有效国家正常返回
      expect(result[2].country).toBe('VN');
      expect(result[2].error).toBeUndefined();
    });
  });

  describe('默认参数处理', () => {
    it('应该默认返回all指标（不传metric参数）', async () => {
      const result = await compareScenarios(
        { countries: ['US'] },
        mockProject
      );

      expect(result[0].gross_margin).toBeDefined();
      expect(result[0].total_cost).toBeDefined();
      expect(result[0].roi).toBeDefined();
      expect(result[0].tariff_rate).toBeDefined();
    });
  });
});

describe('getCountryName辅助函数', () => {
  it('应该返回正确的国家中文名称', () => {
    expect(getCountryName('US')).toBe('美国');
    expect(getCountryName('DE')).toBe('德国');
    expect(getCountryName('JP')).toBe('日本');
    expect(getCountryName('VN')).toBe('越南');
    expect(getCountryName('CA')).toBe('加拿大');
  });

  it('应该返回原始代码当国家未知', () => {
    expect(getCountryName('UNKNOWN')).toBe('UNKNOWN');
    expect(getCountryName('ZZ')).toBe('ZZ');
  });
});

describe('getTariffRate辅助函数', () => {
  it('应该计算正确的关税率', () => {
    const mockCostResult = {
      opex: {
        m4_tariff: 5,
        m4_cogs: 100
      }
    } as CostResult;

    const tariffRate = getTariffRate(mockCostResult);
    expect(tariffRate).toBe(5);
  });

  it('应该处理0关税情况', () => {
    const mockCostResult = {
      opex: {
        m4_tariff: 0,
        m4_cogs: 100
      }
    } as CostResult;

    const tariffRate = getTariffRate(mockCostResult);
    expect(tariffRate).toBe(0);
  });

  it('应该避免除以0错误', () => {
    const mockCostResult = {
      opex: {
        m4_tariff: 5,
        m4_cogs: 0
      }
    } as CostResult;

    // 函数内部使用cogs || 1作为fallback
    const tariffRate = getTariffRate(mockCostResult);
    expect(tariffRate).toBe(500); // 5 / 1 * 100
  });
});

describe('isValidCountryCode辅助函数', () => {
  it('应该验证有效的国家代码', () => {
    expect(isValidCountryCode('US')).toBe(true);
    expect(isValidCountryCode('DE')).toBe(true);
    expect(isValidCountryCode('JP')).toBe(true);
    expect(isValidCountryCode('VN')).toBe(true);
    expect(isValidCountryCode('SG')).toBe(true);
  });

  it('应该拒绝无效的国家代码', () => {
    expect(isValidCountryCode('INVALID')).toBe(false);
    expect(isValidCountryCode('ZZ')).toBe(false);
    expect(isValidCountryCode('')).toBe(false);
    expect(isValidCountryCode('us')).toBe(false); // 区分大小写
  });
});

describe('validateCountries辅助函数', () => {
  it('应该分离有效和无效的国家代码', () => {
    const result = validateCountries(['US', 'INVALID', 'DE', 'ZZ', 'JP']);

    expect(result.valid).toHaveLength(3);
    expect(result.valid).toContain('US');
    expect(result.valid).toContain('DE');
    expect(result.valid).toContain('JP');

    expect(result.invalid).toHaveLength(2);
    expect(result.invalid).toContain('INVALID');
    expect(result.invalid).toContain('ZZ');
  });

  it('应该处理全部有效的情况', () => {
    const result = validateCountries(['US', 'DE', 'JP']);

    expect(result.valid).toHaveLength(3);
    expect(result.invalid).toHaveLength(0);
  });

  it('应该处理全部无效的情况', () => {
    const result = validateCountries(['INVALID1', 'INVALID2']);

    expect(result.valid).toHaveLength(0);
    expect(result.invalid).toHaveLength(2);
  });

  it('应该处理空数组', () => {
    const result = validateCountries([]);

    expect(result.valid).toHaveLength(0);
    expect(result.invalid).toHaveLength(0);
  });
});

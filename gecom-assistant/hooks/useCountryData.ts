/**
 * useCountryData Hook - 加载国家成本因子数据
 *
 * 用途：从@/data/cost-factors动态加载指定国家和行业的成本数据
 *
 * 数据来源：
 * - Week 1-2采集的19国×2行业数据
 * - 文件命名：{COUNTRY_CODE}-{industry}.ts
 * - 导出格式：{COUNTRY_CODE}_{INDUSTRY} 或 default
 *
 * @example
 * ```tsx
 * const { data, loading, error } = useCountryData('US', 'pet_food');
 *
 * if (loading) return <div>加载中...</div>;
 * if (error) return <div>加载失败</div>;
 * if (data) return <div>{data.country_name_cn}</div>;
 * ```
 */

import { useState, useEffect } from 'react';
import type { CostFactor, TargetCountry, Industry } from '@/types/gecom';

/**
 * Hook返回值类型
 */
export interface UseCountryDataReturn {
  /**
   * 成本因子数据（加载成功后）
   */
  data: CostFactor | null;

  /**
   * 加载状态
   */
  loading: boolean;

  /**
   * 错误信息（加载失败时）
   */
  error: Error | null;

  /**
   * 重新加载数据
   */
  reload: () => void;
}

/**
 * useCountryData Hook
 *
 * @param country - 目标国家代码（如 'US', 'DE', 'GB'）
 * @param industry - 行业类型（如 'pet_food', 'vape'）
 * @returns Hook返回值
 */
export function useCountryData(
  country?: TargetCountry,
  industry?: Industry
): UseCountryDataReturn {
  const [data, setData] = useState<CostFactor | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  useEffect(() => {
    // 如果缺少必要参数，清空状态
    if (!country || !industry) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    // 开始加载
    const loadCountryData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 动态导入成本因子文件
        // 文件路径：data/cost-factors/{COUNTRY_CODE}-{industry}.ts
        // 注意：文件名中的industry使用连字符（pet-food）而非下划线（pet_food）
        const industryFileName = industry.replace('_', '-');
        const module = await import(`@/data/cost-factors/${country}-${industryFileName}`);

        // 尝试多种导出格式
        // 1. 标准格式：{COUNTRY_CODE}_{INDUSTRY} (如 US_PET_FOOD)
        // 2. 小写格式：{country_code}_{industry} (如 us_pet_food)
        // 3. 默认导出：default
        const industryUpper = industry.toUpperCase().replace('_', '_');
        const dataKey = `${country}_${industryUpper}`;
        const dataKeyLower = `${country.toLowerCase()}_${industry}`;

        const costFactorData: CostFactor =
          module[dataKey] ||
          module[dataKeyLower] ||
          module.default;

        if (!costFactorData) {
          throw new Error(`未找到有效的成本数据导出（尝试了: ${dataKey}, ${dataKeyLower}, default）`);
        }

        setData(costFactorData);
        setLoading(false);

        console.log(
          `✅ useCountryData: 成功加载 ${country} ${industry}`,
          {
            country: costFactorData.country,
            country_name: costFactorData.country_name_cn,
            version: costFactorData.version,
          }
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        const newError = new Error(
          `加载 ${country} ${industry} 成本数据失败: ${errorMessage}`
        );

        setError(newError);
        setData(null);
        setLoading(false);

        console.warn(
          `⚠️ useCountryData: 加载失败 ${country} ${industry}`,
          {
            error: errorMessage,
            tip: '请检查 data/cost-factors 目录是否存在对应文件',
          }
        );
      }
    };

    loadCountryData();
  }, [country, industry, reloadTrigger]);

  // 重新加载函数
  const reload = () => {
    setReloadTrigger((prev) => prev + 1);
  };

  return {
    data,
    loading,
    error,
    reload,
  };
}

/**
 * useCountryDataBatch Hook - 批量加载多个国家数据
 *
 * @param countries - 国家代码数组
 * @param industry - 行业类型
 * @returns 批量加载结果
 *
 * @example
 * ```tsx
 * const { data, loading, errors } = useCountryDataBatch(['US', 'DE', 'GB'], 'pet_food');
 *
 * console.log(`加载成功: ${data.length}/3`);
 * console.log(`加载失败: ${errors.length}/3`);
 * ```
 */
export function useCountryDataBatch(
  countries: TargetCountry[],
  industry?: Industry
): {
  data: CostFactor[];
  loading: boolean;
  errors: Array<{ country: TargetCountry; error: Error }>;
} {
  const [data, setData] = useState<CostFactor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Array<{ country: TargetCountry; error: Error }>>([]);

  useEffect(() => {
    if (countries.length === 0 || !industry) {
      setData([]);
      setErrors([]);
      setLoading(false);
      return;
    }

    const loadBatchData = async () => {
      setLoading(true);
      const loadedData: CostFactor[] = [];
      const loadedErrors: Array<{ country: TargetCountry; error: Error }> = [];

      // 并行加载所有国家数据
      const promises = countries.map(async (country) => {
        try {
          const industryFileName = industry.replace('_', '-');
          const module = await import(`@/data/cost-factors/${country}-${industryFileName}`);
          const industryUpper = industry.toUpperCase().replace('_', '_');
          const dataKey = `${country}_${industryUpper}`;
          const costFactorData = module[dataKey] || module.default;

          if (costFactorData) {
            loadedData.push(costFactorData);
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          loadedErrors.push({ country, error });
        }
      });

      await Promise.all(promises);

      setData(loadedData);
      setErrors(loadedErrors);
      setLoading(false);

      console.log(
        `✅ useCountryDataBatch: 批量加载完成`,
        {
          total: countries.length,
          success: loadedData.length,
          failed: loadedErrors.length,
          industry,
        }
      );
    };

    loadBatchData();
  }, [countries, industry]);

  return {
    data,
    loading,
    errors,
  };
}

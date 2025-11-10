/**
 * data-loader.ts 使用示例
 *
 * 展示如何在不同场景下使用混合数据源加载器
 */

'use client';

import { useState, useEffect } from 'react';
import {
  loadCostFactor,
  loadMultipleCostFactors,
  type CostFactorComplete,
} from './data-loader';

/**
 * 示例1：成本计算页面 - 仅需要核心数据（快速）
 */
export function CostCalculationPage() {
  const [costData, setCostData] = useState<CostFactorComplete | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // 仅加载Layer 2核心数据（60字段）
      const data = await loadCostFactor('US', 'vape', {
        includeExtended: false, // ❌ 不加载扩展数据
        cache: true,
      });

      setCostData(data);
      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) return <div>加载中...</div>;
  if (!costData) return <div>数据不存在</div>;

  return (
    <div>
      <h1>成本计算：{costData.country_name_cn}</h1>

      {/* 核心字段足够用于成本计算 */}
      <div>
        <p>关税率: {costData.m4_effective_tariff_rate * 100}%</p>
        <p>VAT税率: {costData.m4_vat_rate * 100}%</p>
        <p>物流成本: ${costData.m5_international_shipping_usd}</p>
        <p>CAC: ${costData.m6_cac_usd}</p>
        <p>支付费率: {costData.m7_payment_gateway_rate * 100}%</p>
      </div>
    </div>
  );
}

/**
 * 示例2：市场详情页面 - 需要完整数据（核心+扩展）
 */
export function MarketDetailPage() {
  const [costData, setCostData] = useState<CostFactorComplete | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // 加载Layer 2 + Layer 3完整数据（144字段）
      const data = await loadCostFactor('US', 'vape', {
        includeExtended: true, // ✅ 加载扩展数据
        cache: true,
      });

      setCostData(data);
      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) return <div>加载中...</div>;
  if (!costData) return <div>数据不存在</div>;

  const extended = costData.extended;

  return (
    <div>
      <h1>市场详情：{costData.country_name_cn}</h1>

      {/* 核心字段 - Layer 2 */}
      <section>
        <h2>核心成本数据</h2>
        <p>关税率: {costData.m4_effective_tariff_rate * 100}%</p>
        <p>VAT税率: {costData.m4_vat_rate * 100}%</p>
      </section>

      {/* 扩展字段 - Layer 3 */}
      {extended && (
        <>
          <section>
            <h2>市场洞察（来自扩展数据）</h2>
            <p>市场状态: {extended.market_status}</p>
            <p>准入难度: {extended.market_summary?.entry_difficulty}</p>
            <p>监管风险: {extended.market_summary?.regulatory_risk}</p>

            <h3>市场警告</h3>
            <ul>
              {extended.market_warnings?.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>

            <h3>推荐渠道</h3>
            <ul>
              {extended.market_summary?.recommended_channels?.map((channel, index) => (
                <li key={index}>{channel}</li>
              ))}
            </ul>

            <h3>禁售渠道</h3>
            <ul>
              {extended.market_summary?.prohibited_channels?.map((channel, index) => (
                <li key={index}>{channel}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2>详细合规信息（来自扩展数据）</h2>
            {extended.m1_fda_pmta_usd && (
              <>
                <p>FDA PMTA费用: ${extended.m1_fda_pmta_usd.toLocaleString()}</p>
                <p>审批周期: {extended.m1_fda_pmta_timeline_months} 个月</p>
                <p>获批率: {(extended.m1_fda_pmta_approval_rate || 0) * 100}%</p>
              </>
            )}

            {extended.m1_regulatory_agency && (
              <p>监管机构: {extended.m1_regulatory_agency}</p>
            )}

            {extended.m1_regulatory_complexity && (
              <p>复杂度: {extended.m1_regulatory_complexity}</p>
            )}
          </section>

          <section>
            <h2>平台限制（来自扩展数据）</h2>
            <ul>
              {extended.m6_amazon_banned && <li>❌ Amazon禁售</li>}
              {extended.m6_ebay_banned && <li>❌ eBay禁售</li>}
              {extended.m5_fedex_dtc_banned && <li>❌ FedEx DTC禁运</li>}
              {extended.m5_ups_dtc_banned && <li>❌ UPS DTC禁运</li>}
              {extended.m5_online_sales_ban && <li>❌ 在线销售禁令</li>}
            </ul>
          </section>

          <section>
            <h2>数据溯源（来自扩展数据）</h2>
            <p>M1数据来源: {extended.m1_specific_data_source}</p>
            <p>M1数据等级: {extended.m1_specific_tier}</p>
            <p>M1采集时间: {extended.m1_specific_collected_at}</p>

            <div>
              <h3>元数据</h3>
              <p>源文件: {extended._metadata.source_file}</p>
              <p>总字段数: {extended._metadata.total_fields}</p>
              <p>核心字段: {extended._metadata.core_fields}</p>
              <p>扩展字段: {extended._metadata.extended_fields}</p>
              <p>导出时间: {extended._metadata.exported_at}</p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

/**
 * 示例3：市场对比页面 - 批量加载多个国家
 */
export function MarketComparisonPage() {
  const [costDataList, setCostDataList] = useState<CostFactorComplete[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // 批量加载8个开放市场国家
      const countries = ['US', 'ID', 'PH', 'CA', 'AE', 'SA', 'IT', 'ES'];
      const dataList = await loadMultipleCostFactors(countries, 'vape', {
        includeExtended: true, // ✅ 加载扩展数据用于详细对比
        cache: true,
      });

      setCostDataList(dataList);
      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) return <div>加载中...</div>;

  return (
    <div>
      <h1>8国Vape市场对比</h1>

      <table>
        <thead>
          <tr>
            <th>国家</th>
            <th>关税率</th>
            <th>VAT税率</th>
            <th>准入难度</th>
            <th>监管风险</th>
            <th>Amazon</th>
            <th>在线销售</th>
          </tr>
        </thead>
        <tbody>
          {costDataList.map((data) => (
            <tr key={data.country}>
              <td>{data.country_flag} {data.country_name_cn}</td>
              <td>{data.m4_effective_tariff_rate * 100}%</td>
              <td>{data.m4_vat_rate * 100}%</td>
              <td>{data.extended?.market_summary?.entry_difficulty}</td>
              <td>{data.extended?.market_summary?.regulatory_risk}</td>
              <td>{data.extended?.m6_amazon_banned ? '❌' : '✅'}</td>
              <td>{data.extended?.m5_online_sales_ban ? '❌' : '✅'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * 示例4：仅查看市场洞察（扩展数据Layer 3）
 */
export function MarketInsightWidget({ country }: { country: string }) {
  const [insight, setInsight] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      // 直接加载JSON扩展文件，不查询Appwrite
      const response = await fetch(`/data/vape-extended/${country}-vape-extended.json`);
      if (response.ok) {
        const data = await response.json();
        setInsight(data.market_summary);
      }
    }

    loadData();
  }, [country]);

  if (!insight) return null;

  return (
    <div className="market-insight-widget">
      <h3>市场洞察 - {country}</h3>
      <p>准入难度: {insight.entry_difficulty}</p>
      <p>监管风险: {insight.regulatory_risk}</p>

      <div>
        <strong>优势：</strong>
        <ul>
          {insight.key_advantages?.map((adv: string, i: number) => (
            <li key={i}>{adv}</li>
          ))}
        </ul>
      </div>

      <div>
        <strong>挑战：</strong>
        <ul>
          {insight.key_challenges?.map((chl: string, i: number) => (
            <li key={i}>{chl}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * 示例5：缓存管理
 */
export function CacheManagementPanel() {
  const [cacheStats, setCacheStats] = useState({ size: 0, keys: [] as string[] });

  useEffect(() => {
    // 动态导入避免SSR问题
    import('./data-loader').then(({ getCacheStats }) => {
      setCacheStats(getCacheStats());
    });
  }, []);

  const handleClearCache = () => {
    import('./data-loader').then(({ clearCache }) => {
      clearCache();
      window.location.reload();
    });
  };

  return (
    <div>
      <h3>缓存管理</h3>
      <p>缓存条目数: {cacheStats.size}</p>

      <ul>
        {cacheStats.keys.map((key) => (
          <li key={key}>{key}</li>
        ))}
      </ul>

      <button onClick={handleClearCache}>清除所有缓存</button>
    </div>
  );
}

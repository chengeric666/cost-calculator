/**
 * ScenarioComparisonTable - Phase 5D组件
 * 场景对比结果展示（横向对比表格）
 *
 * 功能：
 * - 多国成本横向对比
 * - M1-M8模块展开/收起
 * - 场景洞察（最优/风险市场、优化建议）
 * - 成本结构可视化
 *
 * 参考：docs/PHASE5-SCENARIO-SIMULATION-DESIGN.md Lines 330-486
 */

'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, AlertTriangle, Lightbulb, BarChart3 } from 'lucide-react';
import { TargetCountry, CostResult } from '@/types/gecom';
import { ScenarioParams } from './ScenarioParameterPanel';
import TierBadge from '@/components/ui/TierBadge';

/**
 * 对比数据行接口
 */
interface ComparisonRow {
  label: string;
  type: 'header' | 'data' | 'subdata';
  values: Map<TargetCountry, number | string>;
  icon?: string;
  highlight?: boolean; // 是否高亮显示（关键指标）
}

/**
 * 场景洞察接口
 */
interface ScenarioInsight {
  bestMarket: {
    country: TargetCountry;
    roi: number;
    paybackMonths: number;
    advantages: string[];
  };
  riskMarkets: {
    country: TargetCountry;
    reason: string;
  }[];
  suggestions: {
    country: TargetCountry;
    type: 'pricing' | 'logistics' | 'fulfillment' | 'marketing';
    message: string;
  }[];
}

/**
 * 组件Props
 */
interface ScenarioComparisonTableProps {
  /**
   * 场景参数
   */
  params: ScenarioParams;

  /**
   * 国家成本结果映射
   */
  results: Map<TargetCountry, CostResult>;

  /**
   * 国家Tier质量映射
   */
  tierMap: Map<TargetCountry, string>;
}

/**
 * 国家信息映射
 */
const COUNTRY_INFO: Record<TargetCountry, { name_cn: string; flag: string }> = {
  US: { name_cn: '美国', flag: '🇺🇸' },
  DE: { name_cn: '德国', flag: '🇩🇪' },
  GB: { name_cn: '英国', flag: '🇬🇧' },
  FR: { name_cn: '法国', flag: '🇫🇷' },
  JP: { name_cn: '日本', flag: '🇯🇵' },
  CA: { name_cn: '加拿大', flag: '🇨🇦' },
  SG: { name_cn: '新加坡', flag: '🇸🇬' },
  VN: { name_cn: '越南', flag: '🇻🇳' },
  TH: { name_cn: '泰国', flag: '🇹🇭' },
  MY: { name_cn: '马来西亚', flag: '🇲🇾' },
  PH: { name_cn: '菲律宾', flag: '🇵🇭' },
  ID: { name_cn: '印尼', flag: '🇮🇩' },
  IN: { name_cn: '印度', flag: '🇮🇳' },
  KR: { name_cn: '韩国', flag: '🇰🇷' },
  AU: { name_cn: '澳大利亚', flag: '🇦🇺' },
  SA: { name_cn: '沙特', flag: '🇸🇦' },
  AE: { name_cn: '阿联酋', flag: '🇦🇪' },
  MX: { name_cn: '墨西哥', flag: '🇲🇽' },
  BR: { name_cn: '巴西', flag: '🇧🇷' },
};

export default function ScenarioComparisonTable({
  params,
  results,
  tierMap,
}: ScenarioComparisonTableProps) {
  // 获取国家列表
  const countries = useMemo(() => Array.from(results.keys()), [results]);

  // 生成场景洞察
  const insights = useMemo<ScenarioInsight>(() => {
    // 找出最优市场（ROI最高）
    const sortedByROI = Array.from(results.entries())
      .sort((a, b) => (b[1].kpis.roi || 0) - (a[1].kpis.roi || 0));

    const bestEntry = sortedByROI[0];
    const bestMarket = {
      country: bestEntry[0],
      roi: bestEntry[1].kpis.roi || 0,
      paybackMonths: bestEntry[1].kpis.payback_period_months || 0,
      advantages: [
        `毛利率 ${bestEntry[1].unit_economics.gross_margin.toFixed(1)}%`,
        `ROI ${bestEntry[1].kpis.roi?.toFixed(0)}%`,
        `回本 ${bestEntry[1].kpis.payback_period_months?.toFixed(1)}月`,
      ],
    };

    // 找出风险市场（毛利率<30% 或 ROI<100%）
    const riskMarkets = Array.from(results.entries())
      .filter(([_, r]) => r.unit_economics.gross_margin < 30 || (r.kpis.roi || 0) < 100)
      .map(([country, r]) => ({
        country,
        reason: r.unit_economics.gross_margin < 30
          ? `毛利率过低 (${r.unit_economics.gross_margin.toFixed(1)}%)`
          : `ROI不达标 (${r.kpis.roi?.toFixed(0)}%)`,
      }));

    // 优化建议
    const suggestions: ScenarioInsight['suggestions'] = [];
    for (const [country, result] of results) {
      if (result.unit_economics.gross_margin < 30) {
        const targetPrice = result.unit_economics.cost / (1 - 0.38);
        suggestions.push({
          country,
          type: 'pricing',
          message: `若售价提升至$${targetPrice.toFixed(0)}，毛利率可达38%（目标线）`,
        });
      }

      // 检查物流模式优化
      if (params.logisticsMode === 'air' && result.opex.m4_goodsTax > 15) {
        suggestions.push({
          country,
          type: 'logistics',
          message: `切换至海运可节省约$2-3/件（建议测试）`,
        });
      }

      // 检查履约模式优化
      if (params.fulfillmentMode === 'fba' && result.opex.m5_logistics > 5) {
        suggestions.push({
          country,
          type: 'fulfillment',
          message: `切换至3PL履约可节省$0.5-0.7/件（FBA溢价较高）`,
        });
      }
    }

    return { bestMarket, riskMarkets, suggestions };
  }, [results, params]);

  // 构建对比表格数据
  const comparisonData = useMemo<ComparisonRow[]>(() => {
    const rows: ComparisonRow[] = [];

    // 关键指标部分
    rows.push({
      label: '📈 关键指标',
      type: 'header',
      values: new Map(),
      icon: '📈',
    });

    // 默认展开所有数据
    rows.push({
        label: '单位收入',
        type: 'data',
        values: new Map(countries.map(c => [c, `$${results.get(c)!.unit_economics.revenue.toFixed(2)}`])),
        highlight: true,
      });
      rows.push({
        label: '单位成本',
        type: 'data',
        values: new Map(countries.map(c => [c, `$${results.get(c)!.unit_economics.cost.toFixed(2)}`])),
        highlight: true,
      });
      rows.push({
        label: '单位毛利',
        type: 'data',
        values: new Map(countries.map(c => [c, `$${results.get(c)!.unit_economics.gross_profit.toFixed(2)}`])),
        highlight: true,
      });
      rows.push({
        label: '毛利率',
        type: 'data',
        values: new Map(countries.map(c => {
          const margin = results.get(c)!.unit_economics.gross_margin;
          const emoji = margin >= 40 ? ' ✅' : margin >= 30 ? '' : ' ⚠️';
          return [c, `${margin.toFixed(1)}%${emoji}`];
        })),
        highlight: true,
      });
      rows.push({
        label: 'ROI (年)',
        type: 'data',
        values: new Map(countries.map(c => {
          const roi = results.get(c)!.kpis.roi || 0;
          const isBest = c === insights.bestMarket.country;
          return [c, `${roi.toFixed(0)}%${isBest ? ' 🏆' : ''}`];
        })),
        highlight: true,
      });
      rows.push({
        label: '回本周期（月）',
        type: 'data',
        values: new Map(countries.map(c => {
          const months = results.get(c)!.kpis.payback_period_months || 0;
          const isBest = c === insights.bestMarket.country;
          return [c, `${months.toFixed(1)}${isBest ? ' 🏆' : ''}`];
        })),
        highlight: true,
      });

    // M4 货物税费
    rows.push({
      label: '📦 M4 货物税费',
      type: 'header',
      values: new Map(countries.map(c => [c, `$${results.get(c)!.opex.m4_goodsTax.total.toFixed(2)}`])),
      icon: '📦',
    });

    // 默认展开所有数据
    rows.push({
        label: '  ├─ COGS',
        type: 'subdata',
        values: new Map(countries.map(c => [c, `$${results.get(c)!.opex.m4_goodsTax.cogs.toFixed(2)}`])),
      });
      rows.push({
        label: '  ├─ 头程物流',
        type: 'subdata',
        values: new Map(countries.map(c => [c, `$${(results.get(c)!.opex.m4_goodsTax.cogs * 0.15).toFixed(2)} (${params.logisticsMode === 'sea' ? '海运' : '空运'})`])),
      });
      rows.push({
        label: '  ├─ 进口关税',
        type: 'subdata',
        values: new Map(countries.map(c => [c, `$${results.get(c)!.opex.m4_goodsTax.importTariff.toFixed(2)}`])),
      });
      rows.push({
        label: '  └─ 增值税',
        type: 'subdata',
        values: new Map(countries.map(c => [c, `$${results.get(c)!.opex.m4_goodsTax.vat.toFixed(2)}`])),
      });

    // M5 物流配送
    rows.push({
      label: '🚚 M5 物流配送',
      type: 'header',
      values: new Map(countries.map(c => [c, `$${results.get(c)!.opex.m5_logistics.total.toFixed(2)}`])),
      icon: '🚚',
    });

    // M6 营销获客
    rows.push({
      label: '📢 M6 营销获客',
      type: 'header',
      values: new Map(countries.map(c => [c, `$${results.get(c)!.opex.m6_marketing.toFixed(2)}`])),
      icon: '📢',
    });

    // M7 支付费用
    rows.push({
      label: '💳 M7 支付费用',
      type: 'header',
      values: new Map(countries.map(c => [c, `$${results.get(c)!.opex.m7_payment.toFixed(2)}`])),
      icon: '💳',
    });

    // M8 运营管理
    rows.push({
      label: '⚙️ M8 运营管理',
      type: 'header',
      values: new Map(countries.map(c => [c, `$${results.get(c)!.opex.m8_operations.total.toFixed(2)}`])),
      icon: '⚙️',
    });

    return rows;
  }, [countries, results, params, insights]);

  return (
    <div className="bg-gradient-to-br from-indigo-50/30 to-purple-50/20 backdrop-blur-md border border-indigo-100/50 rounded-2xl p-6 shadow-glass-md">

      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          📊 场景对比结果
        </h3>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white/60 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-white/80 transition-colors">
            导出Excel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            生成报告
          </button>
        </div>
      </div>

      {/* 场景参数摘要 */}
      <div className="mb-6 bg-blue-50/50 border border-blue-100 rounded-lg p-4">
        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          <span className="font-medium">场景参数:</span>
          <span>售价 <strong className="text-blue-700">${params.sellingPrice}</strong></span>
          <span>|</span>
          <span>月销 <strong className="text-blue-700">{params.monthlyVolume}</strong></span>
          <span>|</span>
          <span>CAC <strong className="text-blue-700">${params.cac}</strong></span>
          <span>|</span>
          <span>物流 <strong className="text-blue-700">{params.logisticsMode === 'sea' ? '海运' : '空运'}</strong></span>
          <span>|</span>
          <span>履约 <strong className="text-blue-700">{params.fulfillmentMode.toUpperCase()}</strong></span>
          <span>|</span>
          <span>退货率 <strong className="text-blue-700">{params.returnRate}%</strong></span>
        </div>
      </div>

      {/* 对比表格 */}
      <div className="bg-white/40 backdrop-blur-sm border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" data-testid="comparison-table">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 min-w-[200px]">
                  成本项
                </th>
                {countries.map(country => (
                  <th key={country} className="px-4 py-3 text-center text-sm font-semibold text-gray-900 min-w-[120px]">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl">{COUNTRY_INFO[country].flag}</span>
                      <span>{country}</span>
                      <TierBadge tier={tierMap.get(country) || 'Tier 3'} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, idx) => (
                <tr
                  key={idx}
                  className={`
                    border-b border-gray-100 transition-colors
                    ${row.type === 'header' ? 'bg-gray-50/50 hover:bg-gray-50' : ''}
                    ${row.type === 'data' && row.highlight ? 'bg-blue-50/30' : ''}
                    ${row.type === 'data' ? 'hover:bg-gray-50/50' : ''}
                    ${row.type === 'subdata' ? 'bg-white/60 text-sm' : ''}
                  `}
                  data-testid={`row-${row.label.replace(/\s+/g, '-')}`}
                >
                  {/* 标签列 */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`
                        ${row.type === 'header' ? 'font-semibold text-gray-900' : ''}
                        ${row.type === 'data' ? 'font-medium text-gray-700' : ''}
                        ${row.type === 'subdata' ? 'text-gray-600 font-mono' : ''}
                      `}>
                        {row.label}
                      </span>
                    </div>
                  </td>

                  {/* 数值列 */}
                  {countries.map(country => (
                    <td key={country} className="px-4 py-3 text-center">
                      <span className={`
                        ${row.type === 'header' ? 'font-semibold text-gray-900' : ''}
                        ${row.type === 'data' && row.highlight ? 'font-semibold text-blue-700' : ''}
                        ${row.type === 'data' ? 'text-gray-700' : ''}
                        ${row.type === 'subdata' ? 'text-gray-600 text-sm font-mono' : ''}
                      `}>
                        {row.values.get(country) || '-'}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 场景洞察 */}
      <div className="mt-6 space-y-4">
        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          🎯 场景洞察
        </h4>

        {/* 最优市场 */}
        <div className="bg-green-50/80 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-green-900 mb-2">
                ✅ 最优市场: {COUNTRY_INFO[insights.bestMarket.country].flag} {COUNTRY_INFO[insights.bestMarket.country].name_cn}
                {' '}(ROI {insights.bestMarket.roi.toFixed(0)}%, 回本{insights.bestMarket.paybackMonths.toFixed(1)}月)
              </div>
              <div className="text-sm text-green-800">
                核心优势: {insights.bestMarket.advantages.join(' · ')}
              </div>
            </div>
          </div>
        </div>

        {/* 风险市场 */}
        {insights.riskMarkets.length > 0 && (
          <div className="bg-yellow-50/80 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-yellow-900 mb-2">
                  ⚠️ 风险市场:
                </div>
                <div className="space-y-1 text-sm text-yellow-800">
                  {insights.riskMarkets.map(rm => (
                    <div key={rm.country}>
                      {COUNTRY_INFO[rm.country].flag} {COUNTRY_INFO[rm.country].name_cn}: {rm.reason}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 优化建议 */}
        {insights.suggestions.length > 0 && (
          <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-blue-900 mb-2">
                  💡 优化建议:
                </div>
                <div className="space-y-1 text-sm text-blue-800">
                  {insights.suggestions.slice(0, 3).map((sug, idx) => (
                    <div key={idx}>
                      {idx + 1}. {COUNTRY_INFO[sug.country].flag} {COUNTRY_INFO[sug.country].name_cn}: {sug.message}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 成本结构对比图 */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          📊 成本结构对比
        </h4>
        <div className="space-y-3">
          {countries.map(country => {
            const result = results.get(country)!;
            const total = result.opex.m4_goodsTax + result.opex.m5_logistics + result.opex.m6_marketing + result.opex.m7_payment + result.opex.m8_operations;
            const m4Pct = (result.opex.m4_goodsTax / total) * 100;
            const m5Pct = (result.opex.m5_logistics / total) * 100;
            const m6Pct = (result.opex.m6_marketing / total) * 100;
            const m7Pct = (result.opex.m7_payment / total) * 100;
            const m8Pct = (result.opex.m8_operations / total) * 100;

            return (
              <div key={country} className="flex items-center gap-3">
                <div className="w-24 text-sm font-medium text-gray-700">
                  {COUNTRY_INFO[country].flag} {country}
                </div>
                <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden flex">
                  <div className="bg-purple-500 flex items-center justify-center text-xs text-white font-medium" style={{ width: `${m6Pct}%` }}>
                    {m6Pct > 15 ? `M6 ${m6Pct.toFixed(0)}%` : ''}
                  </div>
                  <div className="bg-blue-500 flex items-center justify-center text-xs text-white font-medium" style={{ width: `${m4Pct}%` }}>
                    {m4Pct > 15 ? `M4 ${m4Pct.toFixed(0)}%` : ''}
                  </div>
                  <div className="bg-green-500 flex items-center justify-center text-xs text-white font-medium" style={{ width: `${m5Pct}%` }}>
                    {m5Pct > 8 ? `M5 ${m5Pct.toFixed(0)}%` : ''}
                  </div>
                  <div className="bg-yellow-500 flex items-center justify-center text-xs text-white font-medium" style={{ width: `${m7Pct}%` }}>
                    {m7Pct > 5 ? `M7` : ''}
                  </div>
                  <div className="bg-orange-500 flex items-center justify-center text-xs text-white font-medium" style={{ width: `${m8Pct}%` }}>
                    {m8Pct > 5 ? `M8` : ''}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-600">
          <span><span className="inline-block w-3 h-3 bg-purple-500 rounded mr-1"></span>M6 营销</span>
          <span><span className="inline-block w-3 h-3 bg-blue-500 rounded mr-1"></span>M4 货物</span>
          <span><span className="inline-block w-3 h-3 bg-green-500 rounded mr-1"></span>M5 物流</span>
          <span><span className="inline-block w-3 h-3 bg-yellow-500 rounded mr-1"></span>M7 支付</span>
          <span><span className="inline-block w-3 h-3 bg-orange-500 rounded mr-1"></span>M8 运营</span>
        </div>
      </div>
    </div>
  );
}

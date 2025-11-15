'use client';

/**
 * Day 21报告生成测试页面
 *
 * 功能：
 * - 测试ReportGenerator核心引擎
 * - 生成包含封面+目录的Word文档
 * - 提供手动下载按钮
 *
 * @created 2025-11-14
 * @author GECOM Team
 */

import { useState } from 'react';
import { ReportGenerator } from '@/lib/report/reportGenerator';
import type { Project, Calculation, CostFactor } from '@/types/gecom';

export default function TestReportGenerationPage() {
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    fileSizeBytes?: number;
    generationTimeMs?: number;
    version?: string;
    error?: string;
  } | null>(null);

  // 测试数据：US宠物食品项目
  const testProject: Project = {
    id: 'test-project-day21',
    name: 'Paws & Claws宠物零食',
    industry: 'pet_food',
    targetCountry: 'US',
    salesChannel: 'amazon_fba',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const testCalculation: Calculation = {
    id: 'test-calc-day21',
    projectId: 'test-project-day21',
    scope: {
      productName: 'Paws & Claws宠物零食',
      productWeightKg: 0.5,
      cogsUsd: 5.0,
      sellingPriceUsd: 15.99,
      monthlyVolume: 500,
      targetCountry: 'US',
      salesChannel: 'amazon_fba',
      industry: 'pet_food',
    },
    costResult: {
      capex: {
        // M1: 市场准入（11个字段）
        m1: 2500,
        m1_company_registration: 500,
        m1_business_license: 300,
        m1_tax_registration: 200,
        m1_legal_consulting: 1000,
        m1_regulatory_agency: 'FDA & USDA',
        m1_complexity: '中等',
        m1_industry_license: 500,
        m1_renewal_required: true,
        m1_renewal_frequency: '年度',
        m1_notes: '宠物食品需FDA注册',

        // M2: 技术合规（10个字段）
        m2: 3000,
        m2_product_certification: 1500,
        m2_trademark_registration: 800,
        m2_compliance_testing: 500,
        m2_certification_validity_years: 3,
        m2_trademark_notes: 'USPTO商标注册',
        m2_inspection_frequency: '季度',
        m2_inspection_cost: 100,
        m2_product_testing_cost: 500,
        m2_patent_filing: 0,

        // M3: 供应链搭建（9个字段）
        m3: 5000,
        m3_warehouse_deposit: 2000,
        m3_equipment_purchase: 1500,
        m3_initial_inventory: 1000,
        m3_system_setup: 300,
        m3_warehouse_type: '第三方仓',
        m3_warehouse_size_sqm: 100,
        m3_inventory_months: 3,
        m3_software_cost: 200,

        total: 10500,
      },
      opex: {
        m4_cogs: 5.0,
        m4_tariff: 2.75,
        m4_logistics: 2.17,
        m4_vat: 0,
        m5_last_mile: 3.0,
        m5_return: 1.5,
        m6_marketing: 8.0,
        m7_payment: 0.46,
        m7_platform_commission: 2.4,
        m8_ga: 0.89,
        total: 26.17,
      },
      unit_economics: {
        revenue: 15.99,
        cost: 26.17,
        gross_profit: -10.18,
        gross_margin: -0.636,
      },
      kpis: {
        roi: -0.636,
        payback_period_months: 999, // 无法回本
        breakeven_price: 33.10,
        breakeven_volume: 1000,
        ltvCacRatio: 0.85,
      },
      cost_breakdown: [
        { module: 'M6: 营销获客', amount: 8.0, percentage: 30.6 },
        { module: 'M4: 货物税费', amount: 9.92, percentage: 37.9 },
        { module: 'M5: 物流配送', amount: 4.5, percentage: 17.2 },
        { module: 'M7: 支付手续费', amount: 2.86, percentage: 10.9 },
        { module: 'M8: 运营管理', amount: 0.89, percentage: 3.4 },
      ],
    },
    userOverrides: {},
    cost_factor_version: 'v2025Q1',
    createdAt: new Date().toISOString(),
    version: 'v2025Q4',
  };

  const testCostFactor = {
    id: 'US-pet_food',
    country: 'US',
    country_name: '美国',
    country_name_cn: '美国',
    industry: 'pet_food',
    version: 'v2025Q1',
    // M4字段（货物税费）
    m4_effective_tariff_rate: 0.55,
    m4_tariff_notes: '10% base + 25% Section 301 + 20% additional',
    m4_vat_rate: 0,
    m4_logistics: JSON.stringify({
      sea_freight_usd_kg: 2.0,
      air_freight_usd_kg: 8.0,
    }),
    m4_data_source: 'USITC Official Website',
    m4_tier: 'tier1_official',
    m4_collected_at: new Date().toISOString(),
    // 其他必需字段
    collected_at: new Date().toISOString(),
    collected_by: 'GECOM Team',
  } as CostFactor;

  const handleGenerateReport = async () => {
    setGenerating(true);
    setResult(null);

    try {
      console.log('[Test Page] 开始生成报告...');
      const generator = new ReportGenerator(
        {
          project: testProject,
          calculation: testCalculation,
          costFactor: testCostFactor,
        },
        {
          includeCharts: false, // Day 21暂不包含图表
          includeExecutiveSummary: false,
          includeAppendix: false,
          useAI: false,
        }
      );

      const reportResult = await generator.generateReport();

      if (!reportResult.success) {
        throw new Error(reportResult.error || '报告生成失败');
      }

      console.log('[Test Page] 报告生成成功！');
      console.log('  - 文件大小:', reportResult.metadata.fileSizeBytes, '字节');
      console.log('  - 生成耗时:', reportResult.metadata.generationTimeMs, 'ms');
      console.log('  - 报告版本:', reportResult.metadata.version);

      setResult({
        success: true,
        fileSizeBytes: reportResult.metadata.fileSizeBytes,
        generationTimeMs: reportResult.metadata.generationTimeMs,
        version: reportResult.metadata.version,
      });

      // 自动下载报告
      const { saveAs } = await import('file-saver');
      saveAs(reportResult.blob, 'gecom-report-day21-test.docx');
    } catch (error) {
      console.error('[Test Page] 报告生成失败:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Day 21 报告生成测试
          </h1>
          <p className="text-gray-600">
            测试ReportGenerator核心引擎 - 封面+目录
          </p>
        </div>

        {/* 测试数据卡片 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">测试数据</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">产品名称：</span>
              <span className="text-gray-600">{testProject.name}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">行业类别：</span>
              <span className="text-gray-600">宠物食品</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">目标市场：</span>
              <span className="text-gray-600">美国</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">销售渠道：</span>
              <span className="text-gray-600">亚马逊（FBA）</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">定价：</span>
              <span className="text-gray-600">$15.99</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">月销量：</span>
              <span className="text-gray-600">500单</span>
            </div>
          </div>
        </div>

        {/* 生成按钮 */}
        <div className="text-center mb-6">
          <button
            onClick={handleGenerateReport}
            disabled={generating}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            id="generate-report-btn"
          >
            {generating ? '生成中...' : '生成Word报告'}
          </button>
        </div>

        {/* 结果显示 */}
        {result && (
          <div
            className={`rounded-lg p-6 ${
              result.success
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
            id="result-panel"
          >
            <h3
              className={`text-lg font-semibold mb-3 ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {result.success ? '✅ 报告生成成功！' : '❌ 报告生成失败'}
            </h3>

            {result.success ? (
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-green-700">文件大小：</span>
                  <span className="text-green-600" id="file-size">
                    {result.fileSizeBytes} 字节 (
                    {((result.fileSizeBytes || 0) / 1024).toFixed(2)} KB)
                  </span>
                </div>
                <div>
                  <span className="font-medium text-green-700">生成耗时：</span>
                  <span className="text-green-600" id="generation-time">
                    {result.generationTimeMs} ms
                  </span>
                </div>
                <div>
                  <span className="font-medium text-green-700">报告版本：</span>
                  <span className="text-green-600" id="report-version">
                    {result.version}
                  </span>
                </div>
                <div className="mt-4 p-4 bg-white rounded border border-green-300">
                  <p className="font-medium text-green-800 mb-2">✓ 手动验证清单：</p>
                  <ul className="list-disc list-inside text-green-700 space-y-1 text-xs">
                    <li>打开下载的Word文档：gecom-report-day21-test.docx</li>
                    <li>验证封面页：标题、项目信息、日期、版本</li>
                    <li>验证目录：右键更新域可显示页码</li>
                    <li>验证第一章占位符：项目概况（待Day 22实现）</li>
                    <li>验证样式：中文宋体、标题加粗、1.5倍行距</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-sm">
                <span className="font-medium text-red-700">错误信息：</span>
                <span className="text-red-600">{result.error}</span>
              </div>
            )}
          </div>
        )}

        {/* 验收标准 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Day 21 验收标准
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✓ TypeScript 0错误</li>
            <li>✓ 文件大小 &gt;10KB</li>
            <li>
              ✓ MIME类型正确（application/vnd.openxmlformats-officedocument.wordprocessingml.document）
            </li>
            <li>✓ 封面页信息完整（产品名称、行业、市场、渠道、日期、版本）</li>
            <li>✓ 目录结构正确（可在Word中更新域显示页码）</li>
            <li>✓ Word文档可正常打开（Mac/Windows）</li>
            <li>✓ 生成耗时 &lt;3秒</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

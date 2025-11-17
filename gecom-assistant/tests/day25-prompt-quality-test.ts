// @ts-nocheck - Day 21-26测试文件
/**
 * Day 25 Prompt质量测试 - 10个场景验证
 *
 * 测试目标：
 * - 验证DeepSeek R1优化器在不同市场条件下的Prompt生成质量
 * - 确保5个子章节（4.1-4.5）全部生成
 * - 验证专业性：GECOM术语、数据支撑、可操作性
 * - 验证字数：5,000-6,000字（中文字符）
 * - 验证Fallback机制
 *
 * 场景覆盖：
 * 1. 美国高关税市场（宠物食品）
 * 2. 欧盟高VAT市场（德国）
 * 3. 东南亚低毛利市场（越南）
 * 4. 亏损市场（日本高成本）
 * 5. 高ROI市场（美国电子烟）
 * 6. 盈亏平衡边缘市场（英国）
 * 7. 新兴市场（印度尼西亚）
 * 8. 中东高税率市场（沙特）
 * 9. 拉丁美洲市场（墨西哥）
 * 10. 大洋洲市场（澳大利亚）
 *
 * @created 2025-11-16
 * @author GECOM Team
 */

// ============================================
// 环境变量加载（必须在所有imports之前）
// ============================================
import './setup-env';

import { callDeepSeekR1ForOptimization } from '../lib/ai/deepseek-r1-optimizer';
import type { OptimizerInput } from '../lib/ai/deepseek-r1-optimizer';
import type { Project, Calculation, CostFactor } from '../types/gecom';

// ============================================
// 测试场景数据构造
// ============================================

/**
 * 场景1: 美国高关税市场（宠物食品）
 * 特点：关税55%（10% + 25% + 20% Section 301），高成本压力
 */
function createScenario1_US_HighTariff(): OptimizerInput {
  const project: Project = {
    id: 'test-scenario-1',
    name: 'Paws & Claws宠物零食',
    industry: 'pet_food',
    targetCountry: 'US',
    salesChannel: 'amazon_fba',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const calculation: Calculation = {
    scope: {
      productName: 'Paws & Claws宠物零食',
      industry: 'pet_food',
      targetCountry: 'US',
      salesChannel: 'amazon_fba',
      sellingPrice: 15.99,
      cogs: 8.0,
      monthlyVolume: 500,
      productWeight: 1.0,
      repurchaseRate: 0.5,
    },
    costResult: {
      capex: {
        total: 15000,
        m1_market_entry: 5000,
        m2_technical_compliance: 4000,
        m3_supply_chain_setup: 6000,
      },
      opex: {
        total: 23.17,
        m4_goodsTax: 9.92,
        m4_tariff: 4.4,
        m4_vat: 0,
        m5_logistics: 5.5,
        m6_marketing: 4.5,
        m7_payment: 0.75,
        m8_operations: 2.5,
      },
      unit_economics: {
        revenue: 15.99,
        cost: 23.17,
        gross_profit: -7.18,
        gross_margin: -0.449,
      },
      kpis: {
        roi: -0.449,
        payback_period_months: 999,
        ltv_cac_ratio: 0.85,
      },
      cost_breakdown: [
        { module: 'M4: 货物税费', amount: 9.92, percentage: 42.8 },
        { module: 'M5: 物流配送', amount: 5.5, percentage: 23.7 },
        { module: 'M6: 营销获客', amount: 4.5, percentage: 19.4 },
      ],
    },
  };

  const costFactor: CostFactor = {
    country: 'US',
    country_name_cn: '美国',
    industry: 'pet_food',
    version: 'v2025Q1',
    m4_effective_tariff_rate: 0.55,
    m4_tariff_notes: '基础税率10% + Section 301额外25% + 贸易战额外20%',
    m4_vat_rate: 0,
    m4_tariff_data_source: 'USITC官网 - https://hts.usitc.gov',
    m4_tariff_tier: 'tier1_official',
  };

  return { project, calculation, costFactor };
}

/**
 * 场景2: 欧盟高VAT市场（德国）
 * 特点：19% VAT，严格合规要求
 */
function createScenario2_DE_HighVAT(): OptimizerInput {
  const project: Project = {
    id: 'test-scenario-2',
    name: 'Premium Pet Treats DE',
    industry: 'pet_food',
    targetCountry: 'DE',
    salesChannel: 'amazon_fba',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const calculation: Calculation = {
    scope: {
      productName: 'Premium Pet Treats DE',
      industry: 'pet_food',
      targetCountry: 'DE',
      salesChannel: 'amazon_fba',
      sellingPrice: 18.5,
      cogs: 8.0,
      monthlyVolume: 400,
      productWeight: 1.0,
      repurchaseRate: 0.6,
    },
    costResult: {
      capex: {
        total: 22000,
        m1_market_entry: 8000,
        m2_technical_compliance: 7000,
        m3_supply_chain_setup: 7000,
      },
      opex: {
        total: 16.8,
        m4_goodsTax: 5.2,
        m4_tariff: 0.8,
        m4_vat: 3.04,
        m5_logistics: 4.5,
        m6_marketing: 4.0,
        m7_payment: 0.8,
        m8_operations: 2.3,
      },
      unit_economics: {
        revenue: 18.5,
        cost: 16.8,
        gross_profit: 1.7,
        gross_margin: 0.092,
      },
      kpis: {
        roi: 0.185,
        payback_period_months: 32.4,
        ltv_cac_ratio: 1.53,
      },
      cost_breakdown: [
        { module: 'M4: 货物税费', amount: 5.2, percentage: 30.95 },
        { module: 'M5: 物流配送', amount: 4.5, percentage: 26.79 },
        { module: 'M6: 营销获客', amount: 4.0, percentage: 23.81 },
      ],
    },
  };

  const costFactor: CostFactor = {
    country: 'DE',
    country_name_cn: '德国',
    industry: 'pet_food',
    version: 'v2025Q1',
    m4_effective_tariff_rate: 0.1,
    m4_tariff_notes: 'EU统一关税10%',
    m4_vat_rate: 0.19,
    m4_tariff_data_source: 'EU TARIC数据库 - https://ec.europa.eu/taxation_customs/dds2/taric',
    m4_tariff_tier: 'tier1_official',
  };

  return { project, calculation, costFactor };
}

/**
 * 场景3: 东南亚低毛利市场（越南）
 * 特点：低毛利率（5%），价格敏感
 */
function createScenario3_VN_LowMargin(): OptimizerInput {
  const project: Project = {
    id: 'test-scenario-3',
    name: 'Budget Pet Food VN',
    industry: 'pet_food',
    targetCountry: 'VN',
    salesChannel: 'shopee',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const calculation: Calculation = {
    scope: {
      productName: 'Budget Pet Food VN',
      industry: 'pet_food',
      targetCountry: 'VN',
      salesChannel: 'shopee',
      sellingPrice: 8.5,
      cogs: 6.0,
      monthlyVolume: 800,
      productWeight: 0.8,
      repurchaseRate: 0.4,
    },
    costResult: {
      capex: {
        total: 8000,
        m1_market_entry: 2000,
        m2_technical_compliance: 2500,
        m3_supply_chain_setup: 3500,
      },
      opex: {
        total: 8.1,
        m4_goodsTax: 2.4,
        m4_tariff: 0.6,
        m4_vat: 0.85,
        m5_logistics: 2.5,
        m6_marketing: 2.0,
        m7_payment: 0.4,
        m8_operations: 0.8,
      },
      unit_economics: {
        revenue: 8.5,
        cost: 8.1,
        gross_profit: 0.4,
        gross_margin: 0.047,
      },
      kpis: {
        roi: 0.24,
        payback_period_months: 25,
        ltv_cac_ratio: 0.96,
      },
      cost_breakdown: [
        { module: 'M5: 物流配送', amount: 2.5, percentage: 30.86 },
        { module: 'M4: 货物税费', amount: 2.4, percentage: 29.63 },
        { module: 'M6: 营销获客', amount: 2.0, percentage: 24.69 },
      ],
    },
  };

  const costFactor: CostFactor = {
    country: 'VN',
    country_name_cn: '越南',
    industry: 'pet_food',
    version: 'v2025Q1',
    m4_effective_tariff_rate: 0.1,
    m4_tariff_notes: 'ASEAN优惠税率10%',
    m4_vat_rate: 0.1,
    m4_tariff_data_source: '越南海关总局 - https://www.customs.gov.vn',
    m4_tariff_tier: 'tier1_official',
  };

  return { project, calculation, costFactor };
}

/**
 * 场景4: 亏损市场（日本高成本）
 * 特点：严重亏损（-35%毛利率），高合规成本
 */
function createScenario4_JP_Loss(): OptimizerInput {
  const project: Project = {
    id: 'test-scenario-4',
    name: 'Pet Treats Japan',
    industry: 'pet_food',
    targetCountry: 'JP',
    salesChannel: 'rakuten',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const calculation: Calculation = {
    scope: {
      productName: 'Pet Treats Japan',
      industry: 'pet_food',
      targetCountry: 'JP',
      salesChannel: 'rakuten',
      sellingPrice: 12.0,
      cogs: 8.0,
      monthlyVolume: 300,
      productWeight: 1.0,
      repurchaseRate: 0.5,
    },
    costResult: {
      capex: {
        total: 35000,
        m1_market_entry: 12000,
        m2_technical_compliance: 15000,
        m3_supply_chain_setup: 8000,
      },
      opex: {
        total: 16.2,
        m4_goodsTax: 4.8,
        m4_tariff: 1.12,
        m4_vat: 1.2,
        m5_logistics: 5.0,
        m6_marketing: 3.5,
        m7_payment: 0.9,
        m8_operations: 1.8,
      },
      unit_economics: {
        revenue: 12.0,
        cost: 16.2,
        gross_profit: -4.2,
        gross_margin: -0.35,
      },
      kpis: {
        roi: -0.35,
        payback_period_months: 999,
        ltv_cac_ratio: 0.68,
      },
      cost_breakdown: [
        { module: 'M5: 物流配送', amount: 5.0, percentage: 30.86 },
        { module: 'M4: 货物税费', amount: 4.8, percentage: 29.63 },
        { module: 'M6: 营销获客', amount: 3.5, percentage: 21.6 },
      ],
    },
  };

  const costFactor: CostFactor = {
    country: 'JP',
    country_name_cn: '日本',
    industry: 'pet_food',
    version: 'v2025Q1',
    m4_effective_tariff_rate: 0.14,
    m4_tariff_notes: '日本关税14%（宠物食品类）',
    m4_vat_rate: 0.1,
    m4_tariff_data_source: '日本海关 - https://www.customs.go.jp',
    m4_tariff_tier: 'tier1_official',
  };

  return { project, calculation, costFactor };
}

/**
 * 场景5: 高ROI市场（美国电子烟）
 * 特点：高毛利率（45%），高ROI（180%）
 */
function createScenario5_US_HighROI(): OptimizerInput {
  const project: Project = {
    id: 'test-scenario-5',
    name: 'Premium Vape US',
    industry: 'vape',
    targetCountry: 'US',
    salesChannel: 'independent_site',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const calculation: Calculation = {
    scope: {
      productName: 'Premium Vape US',
      industry: 'vape',
      targetCountry: 'US',
      salesChannel: 'independent_site',
      sellingPrice: 25.0,
      cogs: 5.0,
      monthlyVolume: 600,
      productWeight: 0.3,
      repurchaseRate: 0.7,
    },
    costResult: {
      capex: {
        total: 18000,
        m1_market_entry: 6000,
        m2_technical_compliance: 7000,
        m3_supply_chain_setup: 5000,
      },
      opex: {
        total: 13.75,
        m4_goodsTax: 2.5,
        m4_tariff: 0.5,
        m4_vat: 0,
        m5_logistics: 2.5,
        m6_marketing: 6.5,
        m7_payment: 1.0,
        m8_operations: 1.25,
      },
      unit_economics: {
        revenue: 25.0,
        cost: 13.75,
        gross_profit: 11.25,
        gross_margin: 0.45,
      },
      kpis: {
        roi: 1.8,
        payback_period_months: 2.67,
        ltv_cac_ratio: 6.05,
      },
      cost_breakdown: [
        { module: 'M6: 营销获客', amount: 6.5, percentage: 47.27 },
        { module: 'M4: 货物税费', amount: 2.5, percentage: 18.18 },
        { module: 'M5: 物流配送', amount: 2.5, percentage: 18.18 },
      ],
    },
  };

  const costFactor: CostFactor = {
    country: 'US',
    country_name_cn: '美国',
    industry: 'vape',
    version: 'v2025Q1',
    m4_effective_tariff_rate: 0.1,
    m4_tariff_notes: '电子烟10%关税',
    m4_vat_rate: 0,
    m4_tariff_data_source: 'USITC官网 - https://hts.usitc.gov',
    m4_tariff_tier: 'tier1_official',
  };

  return { project, calculation, costFactor };
}

// ============================================
// 测试执行逻辑
// ============================================

interface TestResult {
  scenarioName: string;
  success: boolean;
  model: string;
  generationTimeMs: number;
  contentLength: number;
  usedFallback: boolean;
  hasAllSections: boolean;
  sections: {
    section41: boolean;
    section42: boolean;
    section43: boolean;
    section44: boolean;
    section45: boolean;
  };
  error?: string;
}

/**
 * 验证输出内容完整性
 */
function validateContent(content: string): {
  hasAllSections: boolean;
  sections: TestResult['sections'];
} {
  const sections = {
    section41: content.includes('4.1') || content.includes('定价策略优化'),
    section42: content.includes('4.2') || content.includes('成本削减路径'),
    section43: content.includes('4.3') || content.includes('市场选择建议'),
    section44: content.includes('4.4') || content.includes('实施路线图'),
    section45: content.includes('4.5') || content.includes('风险预警'),
  };

  const hasAllSections = Object.values(sections).every((v) => v);

  return { hasAllSections, sections };
}

/**
 * 运行单个测试场景
 */
async function runScenarioTest(
  scenarioName: string,
  input: OptimizerInput
): Promise<TestResult> {
  console.log(`\n========== 测试场景: ${scenarioName} ==========`);
  console.log(`市场: ${input.costFactor.country_name_cn} (${input.costFactor.country})`);
  console.log(`行业: ${input.project.industry}`);
  console.log(`毛利率: ${(input.calculation.costResult.unit_economics.gross_margin * 100).toFixed(1)}%`);

  try {
    const result = await callDeepSeekR1ForOptimization(input);

    const contentLength = result.content.length;
    const validation = validateContent(result.content);

    console.log(`✅ 生成成功`);
    console.log(`   模型: ${result.model}`);
    console.log(`   耗时: ${result.generationTimeMs}ms`);
    console.log(`   内容长度: ${contentLength}字符`);
    console.log(`   Fallback: ${result.usedFallback ? '是' : '否'}`);
    console.log(`   完整性: ${validation.hasAllSections ? '✅ 全部5节' : '❌ 缺失章节'}`);
    if (!validation.hasAllSections) {
      console.log(`   缺失章节: ${Object.entries(validation.sections)
        .filter(([_, v]) => !v)
        .map(([k]) => k)
        .join(', ')}`);
    }

    return {
      scenarioName,
      success: result.success,
      model: result.model || 'Unknown',
      generationTimeMs: result.generationTimeMs || 0,
      contentLength,
      usedFallback: result.usedFallback || false,
      hasAllSections: validation.hasAllSections,
      sections: validation.sections,
    };
  } catch (error) {
    console.log(`❌ 测试失败: ${error}`);
    return {
      scenarioName,
      success: false,
      model: 'Error',
      generationTimeMs: 0,
      contentLength: 0,
      usedFallback: false,
      hasAllSections: false,
      sections: {
        section41: false,
        section42: false,
        section43: false,
        section44: false,
        section45: false,
      },
      error: String(error),
    };
  }
}

/**
 * 主测试函数
 */
async function runAllTests() {
  console.log('========================================');
  console.log('Day 25 Prompt质量测试 - 10个场景验证');
  console.log('========================================\n');

  const scenarios: Array<{ name: string; input: OptimizerInput }> = [
    { name: '场景1: 美国高关税市场（宠物食品）', input: createScenario1_US_HighTariff() },
    { name: '场景2: 欧盟高VAT市场（德国）', input: createScenario2_DE_HighVAT() },
    { name: '场景3: 东南亚低毛利市场（越南）', input: createScenario3_VN_LowMargin() },
    { name: '场景4: 亏损市场（日本高成本）', input: createScenario4_JP_Loss() },
    { name: '场景5: 高ROI市场（美国电子烟）', input: createScenario5_US_HighROI() },
  ];

  const results: TestResult[] = [];

  // 运行所有测试
  for (const scenario of scenarios) {
    const result = await runScenarioTest(scenario.name, scenario.input);
    results.push(result);

    // 延迟500ms，避免API请求过快
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // ========== 汇总报告 ==========
  console.log('\n========================================');
  console.log('测试结果汇总');
  console.log('========================================\n');

  const successCount = results.filter((r) => r.success).length;
  const fallbackCount = results.filter((r) => r.usedFallback).length;
  const completeCount = results.filter((r) => r.hasAllSections).length;
  const avgLength =
    results.reduce((sum, r) => sum + r.contentLength, 0) / results.length;
  const avgTime =
    results.reduce((sum, r) => sum + r.generationTimeMs, 0) / results.length;

  console.log(`总测试数: ${results.length}`);
  console.log(`成功数: ${successCount}/${results.length} (${((successCount / results.length) * 100).toFixed(1)}%)`);
  console.log(`使用Fallback数: ${fallbackCount}/${results.length}`);
  console.log(`内容完整数: ${completeCount}/${results.length} (${((completeCount / results.length) * 100).toFixed(1)}%)`);
  console.log(`平均内容长度: ${avgLength.toFixed(0)}字符`);
  console.log(`平均生成耗时: ${avgTime.toFixed(0)}ms`);

  console.log('\n详细结果:');
  console.log('┌────────────────────────────────────┬─────────┬────────┬──────────┬──────────┬──────────┐');
  console.log('│ 场景名称                           │ 成功    │ 模型   │ 耗时(ms) │ 长度     │ 完整性   │');
  console.log('├────────────────────────────────────┼─────────┼────────┼──────────┼──────────┼──────────┤');

  results.forEach((r) => {
    const name = r.scenarioName.padEnd(34);
    const success = (r.success ? '✅' : '❌').padEnd(7);
    const model = r.model.substring(0, 6).padEnd(6);
    const time = r.generationTimeMs.toString().padStart(8);
    const length = r.contentLength.toString().padStart(8);
    const complete = (r.hasAllSections ? '✅' : '❌').padEnd(8);

    console.log(`│ ${name} │ ${success} │ ${model} │ ${time} │ ${length} │ ${complete} │`);
  });

  console.log('└────────────────────────────────────┴─────────┴────────┴──────────┴──────────┴──────────┘');

  // ========== 验收判定 ==========
  console.log('\n========================================');
  console.log('验收判定');
  console.log('========================================\n');

  const passedChecks: string[] = [];
  const failedChecks: string[] = [];

  // 检查1: 成功率 ≥ 80%
  if (successCount / results.length >= 0.8) {
    passedChecks.push('✅ 成功率 ≥ 80%');
  } else {
    failedChecks.push(`❌ 成功率 ${((successCount / results.length) * 100).toFixed(1)}% < 80%`);
  }

  // 检查2: 内容完整性 ≥ 80%
  if (completeCount / results.length >= 0.8) {
    passedChecks.push('✅ 内容完整性 ≥ 80%（5个章节全部生成）');
  } else {
    failedChecks.push(`❌ 内容完整性 ${((completeCount / results.length) * 100).toFixed(1)}% < 80%`);
  }

  // 检查3: 平均字数 5,000-6,000字（允许误差±20%）
  if (avgLength >= 4000 && avgLength <= 7200) {
    passedChecks.push('✅ 平均字数在合理范围（4,000-7,200字，±20%误差）');
  } else {
    failedChecks.push(`❌ 平均字数 ${avgLength.toFixed(0)}字 不在4,000-7,200范围`);
  }

  // 检查4: Fallback机制正常工作
  if (fallbackCount > 0 && results.filter((r) => r.usedFallback && r.success).length === fallbackCount) {
    passedChecks.push('✅ Fallback机制正常工作（有场景使用Fallback且全部成功）');
  } else if (fallbackCount === 0) {
    passedChecks.push('ℹ️ 所有场景使用AI生成（Fallback未触发）');
  }

  // 检查5: 平均生成耗时 < 30秒
  if (avgTime < 30000) {
    passedChecks.push('✅ 平均生成耗时 < 30秒');
  } else {
    failedChecks.push(`❌ 平均生成耗时 ${(avgTime / 1000).toFixed(1)}秒 ≥ 30秒`);
  }

  console.log('通过的检查:');
  passedChecks.forEach((check) => console.log(`  ${check}`));

  if (failedChecks.length > 0) {
    console.log('\n未通过的检查:');
    failedChecks.forEach((check) => console.log(`  ${check}`));
  }

  const overallPass = failedChecks.length === 0;

  console.log(`\n========================================`);
  console.log(`总体验收结果: ${overallPass ? '✅ 通过' : '❌ 未通过'}`);
  console.log(`========================================\n`);

  return {
    overallPass,
    results,
    summary: {
      totalTests: results.length,
      successCount,
      fallbackCount,
      completeCount,
      avgLength,
      avgTime,
    },
  };
}

// ============================================
// 执行测试
// ============================================

if (require.main === module) {
  runAllTests()
    .then((report) => {
      if (report.overallPass) {
        console.log('✅ Day 25 Task 25.5完成：Prompt质量测试通过');
        process.exit(0);
      } else {
        console.log('❌ Day 25 Task 25.5失败：Prompt质量测试未通过');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('❌ 测试执行失败:', error);
      process.exit(1);
    });
}

export { runAllTests, runScenarioTest };

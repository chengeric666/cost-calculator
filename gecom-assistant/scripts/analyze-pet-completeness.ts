#!/usr/bin/env tsx
/**
 * Pet数据完整性分析脚本
 *
 * 对比：
 * - Layer 1: TypeScript源文件完整字段数
 * - Layer 2: Appwrite数据库实际字段数
 * - 缺失字段分析
 */

import { config } from 'dotenv';
import { Client, Databases, Query } from 'node-appwrite';

config({ path: '.env.local' });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;

async function analyzePetCompleteness() {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║   Pet Food数据完整性分析                       ║');
  console.log('╚════════════════════════════════════════════════╝\n');

  // 1. 读取Layer 1完整数据（TypeScript源文件）
  console.log('📊 Layer 1: TypeScript源文件分析...\n');

  const { US_PET_FOOD } = await import('../data/cost-factors/US-pet-food.ts');
  const layer1Fields = Object.keys(US_PET_FOOD);
  const layer1Count = layer1Fields.length;

  console.log(`✅ US-pet-food.ts 总字段数: ${layer1Count}个`);
  console.log(`   包含所有详细信息（market_summary、data_quality等）\n`);

  // 2. 查询Layer 2数据（Appwrite数据库）
  console.log('📊 Layer 2: Appwrite数据库查询...\n');

  try {
    const result = await databases.listDocuments(DB_ID, 'cost_factors', [
      Query.equal('country', ['US']),
      Query.equal('industry', ['pet_food']),
      Query.limit(1),
    ]);

    if (result.total === 0) {
      console.log('❌ Appwrite中未找到US pet_food数据');
      console.log('   需要先运行导入脚本: npm run db:import\n');
      return;
    }

    const layer2Doc = result.documents[0];
    const systemFields = new Set(['$id', '$createdAt', '$updatedAt', '$permissions', '$databaseId', '$collectionId']);
    const layer2Fields = Object.keys(layer2Doc).filter(key => !systemFields.has(key));
    const layer2Count = layer2Fields.length;

    console.log(`✅ Appwrite cost_factors 实际字段数: ${layer2Count}个`);
    console.log(`   Document ID: ${layer2Doc.$id}\n`);

    // 3. 对比分析
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║   数据完整性对比                               ║');
    console.log('╚════════════════════════════════════════════════╝\n');

    const completeness = (layer2Count / layer1Count * 100).toFixed(1);

    console.log(`Layer 1 (TypeScript源文件):`);
    console.log(`  - 总字段数: ${layer1Count}个`);
    console.log(`  - 数据完整度: 100%`);
    console.log(`  - 包含所有详细信息\n`);

    console.log(`Layer 2 (Appwrite数据库):`);
    console.log(`  - 实际导入字段: ${layer2Count}个`);
    console.log(`  - 数据完整度: ${completeness}%（${layer2Count}/${layer1Count}）`);
    console.log(`  - 缺失数据: ${layer1Count - layer2Count}个字段（${(100 - parseFloat(completeness)).toFixed(1)}%）\n`);

    // 4. 识别缺失字段
    const layer2FieldSet = new Set(layer2Fields);
    const missingFields: string[] = [];

    for (const field of layer1Fields) {
      if (!layer2FieldSet.has(field)) {
        missingFields.push(field);
      }
    }

    console.log('╔════════════════════════════════════════════════╗');
    console.log('║   缺失字段详细分析                             ║');
    console.log('╚════════════════════════════════════════════════╝\n');

    console.log(`缺失字段总数: ${missingFields.length}个\n`);

    // 分类缺失字段
    const missingByCategory = {
      market_insights: [] as string[],
      data_quality: [] as string[],
      industry_specific: [] as string[],
      traceability: [] as string[],
      other: [] as string[],
    };

    for (const field of missingFields) {
      if (field.startsWith('market_')) {
        missingByCategory.market_insights.push(field);
      } else if (field.includes('data_quality') || field.includes('confidence')) {
        missingByCategory.data_quality.push(field);
      } else if (field.includes('_specific_') || field.includes('_detailed_')) {
        missingByCategory.industry_specific.push(field);
      } else if (field.includes('_source') || field.includes('_tier') || field.includes('_collected_at')) {
        missingByCategory.traceability.push(field);
      } else {
        missingByCategory.other.push(field);
      }
    }

    console.log('缺失字段分类：\n');

    if (missingByCategory.market_insights.length > 0) {
      console.log(`1️⃣ 市场洞察字段（${missingByCategory.market_insights.length}个）：`);
      missingByCategory.market_insights.slice(0, 10).forEach(f => console.log(`   - ${f}`));
      if (missingByCategory.market_insights.length > 10) {
        console.log(`   ... 其他${missingByCategory.market_insights.length - 10}个字段`);
      }
      console.log();
    }

    if (missingByCategory.data_quality.length > 0) {
      console.log(`2️⃣ 数据质量追踪字段（${missingByCategory.data_quality.length}个）：`);
      missingByCategory.data_quality.slice(0, 10).forEach(f => console.log(`   - ${f}`));
      if (missingByCategory.data_quality.length > 10) {
        console.log(`   ... 其他${missingByCategory.data_quality.length - 10}个字段`);
      }
      console.log();
    }

    if (missingByCategory.industry_specific.length > 0) {
      console.log(`3️⃣ 行业特定高级字段（${missingByCategory.industry_specific.length}个）：`);
      missingByCategory.industry_specific.slice(0, 10).forEach(f => console.log(`   - ${f}`));
      if (missingByCategory.industry_specific.length > 10) {
        console.log(`   ... 其他${missingByCategory.industry_specific.length - 10}个字段`);
      }
      console.log();
    }

    if (missingByCategory.traceability.length > 0) {
      console.log(`4️⃣ 数据溯源字段（${missingByCategory.traceability.length}个）：`);
      missingByCategory.traceability.slice(0, 10).forEach(f => console.log(`   - ${f}`));
      if (missingByCategory.traceability.length > 10) {
        console.log(`   ... 其他${missingByCategory.traceability.length - 10}个字段`);
      }
      console.log();
    }

    if (missingByCategory.other.length > 0) {
      console.log(`5️⃣ 其他字段（${missingByCategory.other.length}个）：`);
      missingByCategory.other.slice(0, 10).forEach(f => console.log(`   - ${f}`));
      if (missingByCategory.other.length > 10) {
        console.log(`   ... 其他${missingByCategory.other.length - 10}个字段`);
      }
      console.log();
    }

    // 5. 总结与建议
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║   解决方案                                     ║');
    console.log('╚════════════════════════════════════════════════╝\n');

    console.log('✅ 三层数据架构策略：\n');
    console.log('Layer 1: TypeScript源文件');
    console.log(`  ├─ ${layer1Count}字段（100%完整）`);
    console.log('  ├─ data/cost-factors/US-pet-food.ts');
    console.log('  └─ 单一真相来源（SSOT）\n');

    console.log('Layer 2: Appwrite数据库');
    console.log(`  ├─ ${layer2Count}字段（${completeness}%核心数据）`);
    console.log('  ├─ cost_factors collection');
    console.log('  └─ 用于生产环境成本计算\n');

    console.log('Layer 3: JSON扩展文件（待生成）');
    console.log(`  ├─ ${missingFields.length}字段（${(100 - parseFloat(completeness)).toFixed(1)}%扩展数据）`);
    console.log('  ├─ public/data/pet-extended/US-pet-extended.json');
    console.log('  └─ 用于市场洞察、详情展示\n');

    console.log('📝 下一步操作：');
    console.log('  1. 创建 export-pet-extended-data.ts 脚本');
    console.log('  2. 运行 npm run export:pet-extended');
    console.log('  3. 验证 public/data/pet-extended/*.json 生成');
    console.log('  4. 前端使用 loadCostFactor({includeExtended: true})\n');

    // 写入分析报告到文件
    const reportPath = '/tmp/pet-data-completeness-analysis.txt';
    const report = `
Pet Food数据完整性对比：

本地TypeScript文件（US-pet-food.ts）：
- 总字段数：${layer1Count}个
- 数据完整度：100%
- 包含所有详细信息（market_summary、data_quality等）

Appwrite数据库导入：
- 实际导入字段：${layer2Count}个
- 数据完整度：${completeness}%（${layer2Count}/${layer1Count}）
- 缺失数据：${missingFields.length}个字段（${(100 - parseFloat(completeness)).toFixed(1)}%）

缺失的关键数据类型：
1. 市场洞察字段：${missingByCategory.market_insights.length}个
2. 数据质量追踪：${missingByCategory.data_quality.length}个
3. 行业特定高级字段：${missingByCategory.industry_specific.length}个
4. 数据溯源字段：${missingByCategory.traceability.length}个
5. 其他字段：${missingByCategory.other.length}个

缺失字段列表（前20个）：
${missingFields.slice(0, 20).map((f, i) => `${i + 1}. ${f}`).join('\n')}
${missingFields.length > 20 ? `...\n其他${missingFields.length - 20}个字段` : ''}
`;

    await import('fs/promises').then(fs => fs.writeFile(reportPath, report.trim()));
    console.log(`✅ 分析报告已保存: ${reportPath}\n`);

  } catch (error: any) {
    console.error('❌ 分析失败:', error.message);
    process.exit(1);
  }
}

analyzePetCompleteness().catch(console.error);

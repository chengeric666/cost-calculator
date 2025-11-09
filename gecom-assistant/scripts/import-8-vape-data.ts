#!/usr/bin/env tsx
/**
 * 8个开放市场Vape数据导入脚本
 *
 * 功能：
 * 1. 导入8国vape数据到Appwrite cost_factors
 * 2. 保存完整数据谱系（base-data + vape-specific + vape）
 * 3. 支持数据版本管理和溯源
 *
 * 8个开放市场国家：
 * US, ID, PH, CA, AE, SA, IT, ES
 */

import { config } from 'dotenv';
import { Client, Databases, ID, Query } from 'node-appwrite';
import fs from 'fs';
import path from 'path';

config({ path: '.env.local' });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;

// 8个开放市场国家
const VAPE_COUNTRIES = ['US', 'ID', 'PH', 'CA', 'AE', 'SA', 'IT', 'ES'];

/**
 * 读取TypeScript数据文件并提取导出的对象
 */
async function readTSDataFile(filePath: string): Promise<any> {
  const content = fs.readFileSync(filePath, 'utf-8');

  // 动态导入TypeScript文件
  const { default: data, ...namedExports } = await import(filePath);

  // 返回命名导出（通常是US_BASE_DATA, US_VAPE_SPECIFIC等）
  const exportedData = Object.values(namedExports)[0];

  return exportedData || data;
}

/**
 * 导入单个国家的vape数据
 */
async function importCountryVapeData(countryCode: string) {
  console.log(`\n📝 处理 ${countryCode}-vape...`);

  const baseDataPath = path.join(
    process.cwd(),
    'data/cost-factors',
    `${countryCode}-base-data.ts`
  );
  const specificDataPath = path.join(
    process.cwd(),
    'data/cost-factors',
    `${countryCode}-vape-specific.ts`
  );
  const mergedDataPath = path.join(
    process.cwd(),
    'data/cost-factors',
    `${countryCode}-vape.ts`
  );

  // 检查文件是否存在
  if (!fs.existsSync(baseDataPath) || !fs.existsSync(specificDataPath) || !fs.existsSync(mergedDataPath)) {
    console.log(`⚠️  ${countryCode}: vape数据文件不完整，跳过`);
    return { success: false, reason: 'incomplete_files' };
  }

  try {
    // 读取三个文件的数据
    const baseData = await readTSDataFile(baseDataPath);
    const specificData = await readTSDataFile(specificDataPath);
    const mergedData = await readTSDataFile(mergedDataPath);

    console.log(`   ✅ 读取文件成功`);
    console.log(`      - base-data: ${Object.keys(baseData || {}).length} 字段`);
    console.log(`      - vape-specific: ${Object.keys(specificData || {}).length} 字段`);
    console.log(`      - merged: ${Object.keys(mergedData || {}).length} 字段`);

    // 1. 导入合并数据到cost_factors
    const existing = await databases.listDocuments(DB_ID, 'cost_factors', [
      Query.equal('country', [countryCode]),
      Query.equal('industry', ['vape']),
    ]);

    let costFactorId: string;
    if (existing.total > 0) {
      costFactorId = existing.documents[0].$id;
      await databases.updateDocument(DB_ID, 'cost_factors', costFactorId, mergedData);
      console.log(`   ✅ 更新cost_factors成功 (${costFactorId})`);
    } else {
      const result = await databases.createDocument(
        DB_ID,
        'cost_factors',
        ID.unique(),
        mergedData
      );
      costFactorId = result.$id;
      console.log(`   ✅ 创建cost_factors成功 (${costFactorId})`);
    }

    // 2. 导入数据谱系到data_lineage（如果Collection存在）
    try {
      const lineageData = {
        country: countryCode,
        industry: 'vape',
        version: mergedData.version || '2025Q1',
        base_data: JSON.stringify(baseData, null, 2),
        specific_data: JSON.stringify(specificData, null, 2),
        merged_data: JSON.stringify(mergedData, null, 2),
        file_paths: JSON.stringify([
          `data/cost-factors/${countryCode}-base-data.ts`,
          `data/cost-factors/${countryCode}-vape-specific.ts`,
          `data/cost-factors/${countryCode}-vape.ts`,
        ]),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const existingLineage = await databases.listDocuments(DB_ID, 'data_lineage', [
        Query.equal('country', [countryCode]),
        Query.equal('industry', ['vape']),
      ]);

      if (existingLineage.total > 0) {
        await databases.updateDocument(
          DB_ID,
          'data_lineage',
          existingLineage.documents[0].$id,
          lineageData
        );
        console.log(`   ✅ 更新data_lineage成功`);
      } else {
        await databases.createDocument(
          DB_ID,
          'data_lineage',
          ID.unique(),
          lineageData
        );
        console.log(`   ✅ 创建data_lineage成功`);
      }
    } catch (error: any) {
      if (error.code === 404) {
        console.log(`   ⚠️  data_lineage Collection不存在，跳过谱系导入`);
      } else {
        throw error;
      }
    }

    // 3. 创建本地JSON备份
    const backupDir = path.join(process.cwd(), 'data/lineage-backup');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const backupData = {
      country: countryCode,
      industry: 'vape',
      version: mergedData.version || '2025Q1',
      timestamp: new Date().toISOString(),
      base_data: baseData,
      specific_data: specificData,
      merged_data: mergedData,
    };

    fs.writeFileSync(
      path.join(backupDir, `${countryCode}-vape-lineage.json`),
      JSON.stringify(backupData, null, 2),
      'utf-8'
    );
    console.log(`   ✅ 创建本地JSON备份`);

    return { success: true, costFactorId };
  } catch (error: any) {
    console.error(`   ❌ ${countryCode}: 导入失败 - ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║   8个开放市场Vape数据导入                      ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log('\n开放市场国家：');
  console.log('  1. US（美国）- 开放但严格（PMTA）');
  console.log('  2. ID（印尼）- 东南亚最友好（ASEAN零关税）');
  console.log('  3. PH（菲律宾）- Dual compliance');
  console.log('  4. CA（加拿大）- Health Canada审批');
  console.log('  5. AE（阿联酋）- 中东最友好（2019解禁）');
  console.log('  6. SA（沙特）- 中东最大市场');
  console.log('  7. IT（意大利）- EU严格（2025禁止在线销售）');
  console.log('  8. ES（西班牙）- EU严格（2025禁止在线销售）');

  const results = {
    success: 0,
    failed: 0,
  };

  for (const country of VAPE_COUNTRIES) {
    const result = await importCountryVapeData(country);
    if (result.success) {
      results.success++;
    } else {
      results.failed++;
    }
    // 等待300ms避免Appwrite限流
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║   导入完成                                     ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log(`\n✅ 成功: ${results.success}/${VAPE_COUNTRIES.length} 个国家`);
  console.log(`❌ 失败: ${results.failed}/${VAPE_COUNTRIES.length} 个国家`);
  console.log('\n📊 数据持久化层级：');
  console.log('   1. Appwrite cost_factors - 合并数据（可查询）');
  console.log('   2. Appwrite data_lineage - 完整谱系（可溯源）');
  console.log('   3. 本地JSON备份 - 额外保障（data/lineage-backup/）');
  console.log('   4. Git版本控制 - TypeScript源文件（data/cost-factors/）');
  console.log('\n✅ 8国vape数据导入完成！\n');
}

main().catch((error) => {
  console.error('❌ 导入失败:', error);
  process.exit(1);
});

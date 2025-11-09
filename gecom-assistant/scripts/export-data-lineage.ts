#!/usr/bin/env tsx
/**
 * 导出数据谱系到本地JSON
 *
 * 功能：
 * 1. 读取所有19国的3文件数据（base-data, specific, merged）
 * 2. 导出为标准化JSON格式
 * 3. 建立本地数据飞轮
 * 4. 便于数据分析和版本对比
 */

import fs from 'fs';
import path from 'path';

// 19国代码
const COUNTRIES = [
  'US', 'DE', 'VN', 'UK', 'JP', 'CA', 'FR', 'AU', 'IT', 'ES',
  'SG', 'MY', 'PH', 'TH', 'ID', 'IN', 'KR', 'SA', 'AE'
];

/**
 * 深度克隆并清理对象，移除TypeScript特定构造（如 'as const'）
 * 确保可以被JSON.stringify正确序列化
 */
function sanitizeForJSON(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeForJSON);
  }

  const cleaned: any = {};
  for (const [key, value] of Object.entries(obj)) {
    // 跳过函数和symbol
    if (typeof value === 'function' || typeof value === 'symbol') {
      continue;
    }

    // 递归清理对象
    cleaned[key] = sanitizeForJSON(value);
  }

  return cleaned;
}

/**
 * 动态导入TypeScript模块
 * 优先选择主数据对象（XX_BASE_DATA, XX_PET_FOOD_SPECIFIC, XX_PET_FOOD）
 * 而非SUMMARY对象
 */
async function importModule(filePath: string, expectedPattern: string) {
  try {
    const module = await import(filePath);

    // 先尝试通过命名匹配找到正确的导出
    for (const [key, value] of Object.entries(module)) {
      if (
        typeof value === 'object' &&
        value !== null &&
        key.includes(expectedPattern) &&
        !key.includes('SUMMARY')
      ) {
        return value;
      }
    }

    // 如果没找到，尝试找最大的对象（字段最多的）
    const namedExports = Object.entries(module)
      .filter(([key, value]) => typeof value === 'object' && value !== null && !key.includes('SUMMARY'))
      .map(([key, value]) => ({ key, value, size: Object.keys(value as object).length }))
      .sort((a, b) => b.size - a.size);

    return namedExports[0]?.value || module.default || {};
  } catch (error) {
    console.error(`导入失败: ${filePath}`, error);
    return null;
  }
}

/**
 * 导出单个国家的数据谱系
 */
async function exportCountryLineage(countryCode: string) {
  console.log(`\n📝 处理 ${countryCode}...`);

  const baseDataPath = path.resolve(
    process.cwd(),
    'data/cost-factors',
    `${countryCode}-base-data.ts`
  );
  const specificDataPath = path.resolve(
    process.cwd(),
    'data/cost-factors',
    `${countryCode}-pet-food-specific.ts`
  );
  const mergedDataPath = path.resolve(
    process.cwd(),
    'data/cost-factors',
    `${countryCode}-pet-food.ts`
  );

  // 检查文件存在性
  const filesExist = [baseDataPath, specificDataPath, mergedDataPath].every(fs.existsSync);
  if (!filesExist) {
    console.log(`   ⚠️  文件不完整，跳过`);
    return null;
  }

  try {
    // 动态导入数据，传入期望的命名模式
    const baseData = await importModule(baseDataPath, `${countryCode}_BASE_DATA`);
    const specificData = await importModule(specificDataPath, `${countryCode}_PET_FOOD_SPECIFIC`);
    const mergedData = await importModule(mergedDataPath, `${countryCode}_PET_FOOD`);

    if (!baseData || !specificData || !mergedData) {
      console.log(`   ❌ 导入失败`);
      return null;
    }

    console.log(`   ✅ 导入成功`);
    console.log(`      - base: ${Object.keys(baseData).length} 字段`);
    console.log(`      - specific: ${Object.keys(specificData).length} 字段`);
    console.log(`      - merged: ${Object.keys(mergedData).length} 字段`);

    // 清理数据，确保可JSON序列化
    const cleanedBaseData = sanitizeForJSON(baseData);
    const cleanedSpecificData = sanitizeForJSON(specificData);
    const cleanedMergedData = sanitizeForJSON(mergedData);

    // 构建完整数据谱系
    const lineage = {
      country: countryCode,
      country_name: baseData.country_name_cn || mergedData.country_name_cn,
      country_flag: baseData.country_flag || mergedData.country_flag,
      industry: 'pet_food',
      version: mergedData.version || '2025Q1',
      export_timestamp: new Date().toISOString(),

      // 数据层次
      layers: {
        base_data: {
          description: '通用基础数据（跨行业复用）',
          field_count: Object.keys(cleanedBaseData).length,
          data: cleanedBaseData,
        },
        industry_specific: {
          description: 'Pet Food行业特定数据',
          field_count: Object.keys(cleanedSpecificData).length,
          data: cleanedSpecificData,
        },
        merged: {
          description: '合并后完整数据',
          field_count: Object.keys(cleanedMergedData).length,
          data: cleanedMergedData,
        },
      },

      // 文件路径
      file_paths: {
        base_data: `data/cost-factors/${countryCode}-base-data.ts`,
        specific: `data/cost-factors/${countryCode}-pet-food-specific.ts`,
        merged: `data/cost-factors/${countryCode}-pet-food.ts`,
      },

      // 数据质量元信息
      metadata: {
        collected_at: cleanedMergedData.collected_at || cleanedBaseData.collected_at,
        collected_by: cleanedMergedData.collected_by || cleanedBaseData.collected_by,
        verified_at: cleanedMergedData.verified_at,
        data_quality_summary: cleanedMergedData.data_quality_summary || null,
      },
    };

    return lineage;
  } catch (error: any) {
    console.error(`   ❌ 处理失败: ${error.message}`);
    return null;
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║   导出19国数据谱系到本地JSON                 ║');
  console.log('╚════════════════════════════════════════════════╝');

  // 创建输出目录
  const outputDir = path.join(process.cwd(), 'data/lineage-backup');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`\n✅ 创建输出目录: ${outputDir}`);
  }

  const allLineages: any[] = [];
  const results = { success: 0, failed: 0 };

  // 处理所有国家
  for (const country of COUNTRIES) {
    const lineage = await exportCountryLineage(country);

    if (lineage) {
      allLineages.push(lineage);
      results.success++;

      // 保存单个国家的JSON文件
      const outputPath = path.join(outputDir, `${country}-pet-food-lineage.json`);
      fs.writeFileSync(
        outputPath,
        JSON.stringify(lineage, null, 2),
        'utf-8'
      );
      console.log(`   💾 保存: ${outputPath}`);
    } else {
      results.failed++;
    }

    // 延迟避免内存问题
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // 保存汇总文件
  const summaryData = {
    export_timestamp: new Date().toISOString(),
    total_countries: COUNTRIES.length,
    successful_exports: results.success,
    failed_exports: results.failed,
    industry: 'pet_food',
    version: '2025Q1',
    lineages: allLineages.map(l => ({
      country: l.country,
      country_name: l.country_name,
      field_counts: {
        base: l.layers.base_data.field_count,
        specific: l.layers.industry_specific.field_count,
        merged: l.layers.merged.field_count,
      },
      data_quality: l.metadata.data_quality_summary,
    })),
  };

  fs.writeFileSync(
    path.join(outputDir, '_summary.json'),
    JSON.stringify(summaryData, null, 2),
    'utf-8'
  );

  // 保存完整数据（all-in-one）
  fs.writeFileSync(
    path.join(outputDir, '_all-countries.json'),
    JSON.stringify(allLineages, null, 2),
    'utf-8'
  );

  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║   导出完成                                     ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log(`\n✅ 成功: ${results.success}/${COUNTRIES.length} 个国家`);
  console.log(`❌ 失败: ${results.failed}/${COUNTRIES.length} 个国家`);
  console.log(`\n📂 输出目录: ${outputDir}/`);
  console.log(`   - 单国文件: XX-pet-food-lineage.json (19个)`);
  console.log(`   - 汇总文件: _summary.json`);
  console.log(`   - 完整数据: _all-countries.json`);
  console.log('\n✅ 数据飞轮本地层建立完成！\n');
}

main().catch((error) => {
  console.error('❌ 导出失败:', error);
  process.exit(1);
});

#!/usr/bin/env tsx
/**
 * Debug脚本：诊断数据导出失败原因
 */

import fs from 'fs';
import path from 'path';

const FAILED_COUNTRIES = ['US', 'DE', 'VN', 'UK', 'JP', 'CA', 'FR', 'AU'];

async function debugCountry(countryCode: string) {
  console.log(`\n🔍 调试 ${countryCode}...`);

  const files = [
    `${countryCode}-base-data.ts`,
    `${countryCode}-pet-food-specific.ts`,
    `${countryCode}-pet-food.ts`,
  ];

  for (const filename of files) {
    const filePath = path.resolve(process.cwd(), 'data/cost-factors', filename);

    console.log(`\n  📄 ${filename}:`);

    // 1. 检查文件存在
    if (!fs.existsSync(filePath)) {
      console.log(`     ❌ 文件不存在`);
      continue;
    }
    console.log(`     ✅ 文件存在`);

    // 2. 尝试动态导入
    try {
      const module = await import(filePath);
      console.log(`     ✅ 动态导入成功`);
      console.log(`     - Module keys: ${Object.keys(module).join(', ')}`);

      // 3. 提取数据
      const namedExports = Object.values(module).filter(
        v => typeof v === 'object' && v !== null
      );

      if (namedExports.length === 0) {
        console.log(`     ⚠️  未找到命名导出对象`);
        continue;
      }

      const data = namedExports[0];
      console.log(`     ✅ 提取数据成功，${Object.keys(data).length} 个字段`);

      // 4. 尝试JSON序列化
      try {
        const json = JSON.stringify(data, null, 2);
        console.log(`     ✅ JSON序列化成功，${json.length} 字符`);
      } catch (jsonError: any) {
        console.log(`     ❌ JSON序列化失败: ${jsonError.message}`);

        // 深度检查哪些字段导致序列化失败
        console.log(`     🔍 检查字段类型:`);
        for (const [key, value] of Object.entries(data)) {
          const type = typeof value;
          const isSerializable = type !== 'function' && type !== 'symbol';

          if (!isSerializable) {
            console.log(`        ❌ ${key}: ${type}`);
          } else if (type === 'object' && value !== null) {
            try {
              JSON.stringify(value);
            } catch {
              console.log(`        ❌ ${key}: 对象序列化失败`);
            }
          }
        }
      }
    } catch (importError: any) {
      console.log(`     ❌ 动态导入失败: ${importError.message}`);
      if (importError.stack) {
        console.log(`     Stack: ${importError.stack.split('\n').slice(0, 3).join('\n')}`);
      }
    }
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║   导出失败国家诊断工具                        ║');
  console.log('╚════════════════════════════════════════════════╝');

  for (const country of FAILED_COUNTRIES) {
    await debugCountry(country);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n✅ 诊断完成\n');
}

main().catch((error) => {
  console.error('❌ 诊断失败:', error);
  process.exit(1);
});

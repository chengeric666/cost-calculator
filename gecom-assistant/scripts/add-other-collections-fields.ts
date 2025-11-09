import { config } from 'dotenv';
import { Client, Databases } from 'node-appwrite';

config({ path: '.env.local' });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;

interface FieldConfig {
  key: string;
  type: 'string' | 'datetime' | 'json';
  size?: number;
  required: boolean;
  description: string;
}

// ===== projects Collection 字段定义 =====
const projectsFields: FieldConfig[] = [
  { key: 'userId', type: 'string', size: 50, required: true, description: '用户ID' },
  { key: 'name', type: 'string', size: 100, required: true, description: '项目名称' },
  { key: 'industry', type: 'string', size: 50, required: true, description: '行业 (pet_food/vape)' },
  { key: 'targetCountry', type: 'string', size: 10, required: true, description: '目标市场国家代码' },
  { key: 'salesChannel', type: 'string', size: 50, required: true, description: '销售渠道' },
  { key: 'createdAt', type: 'datetime', required: true, description: '创建时间' },
  { key: 'updatedAt', type: 'datetime', required: true, description: '更新时间' },
];

// ===== calculations Collection 字段定义 =====
const calculationsFields: FieldConfig[] = [
  { key: 'projectId', type: 'string', size: 50, required: true, description: '关联项目ID' },
  { key: 'scope', type: 'string', size: 10000, required: true, description: '完整输入数据 (JSON字符串)' },
  { key: 'costResult', type: 'string', size: 10000, required: true, description: '计算结果 (JSON字符串)' },
  { key: 'userOverrides', type: 'string', size: 5000, required: false, description: '用户自定义覆盖值 (JSON字符串)' },
  { key: 'version', type: 'string', size: 20, required: true, description: 'GECOM版本' },
  { key: 'createdAt', type: 'datetime', required: true, description: '创建时间' },
];

// ===== cost_factor_versions Collection 字段定义 =====
const costFactorVersionsFields: FieldConfig[] = [
  { key: 'version', type: 'string', size: 20, required: true, description: '版本号 (如 2025Q1)' },
  { key: 'releaseDate', type: 'datetime', required: true, description: '发布日期' },
  { key: 'changelog', type: 'string', size: 2000, required: false, description: '更新日志' },
  { key: 'isActive', type: 'string', size: 10, required: true, description: '是否为当前活跃版本 (true/false)' },
];

async function addFieldsToCollection(collectionId: string, fields: FieldConfig[]) {
  console.log(`\n📝 开始为 ${collectionId} 添加字段...\n`);

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const progress = `[${i + 1}/${fields.length}]`;

    try {
      if (field.type === 'string') {
        await databases.createStringAttribute(
          DB_ID,
          collectionId,
          field.key,
          field.size!,
          field.required
        );
        console.log(`✅ ${progress} ${field.key} (string, ${field.size})`);
        successCount++;
      } else if (field.type === 'datetime') {
        await databases.createDatetimeAttribute(
          DB_ID,
          collectionId,
          field.key,
          field.required
        );
        console.log(`✅ ${progress} ${field.key} (datetime)`);
        successCount++;
      }

      // Appwrite限制：字段创建需要等待索引完成
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error: any) {
      if (error.code === 409) {
        console.log(`⚠️  ${progress} ${field.key}: 已存在，跳过`);
        skipCount++;
      } else {
        console.log(`❌ ${progress} ${field.key}: 失败 - ${error.message}`);
        failCount++;
      }
    }
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`${collectionId} 字段添加统计：`);
  console.log(`✅ 成功: ${successCount} | ⚠️  跳过: ${skipCount} | ❌ 失败: ${failCount}`);
  console.log('─'.repeat(60));

  return { successCount, skipCount, failCount };
}

async function verifyCollections() {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 验证所有Collections字段...\n');

  const collections = ['projects', 'calculations', 'cost_factor_versions'];

  for (const collectionId of collections) {
    try {
      const collection = await databases.getCollection(DB_ID, collectionId);
      console.log(`✅ ${collectionId}: ${collection.attributes.length} 个字段`);
      collection.attributes.forEach((attr: any) => {
        console.log(`   - ${attr.key} (${attr.type})`);
      });
      console.log('');
    } catch (error: any) {
      console.log(`❌ ${collectionId}: 验证失败 - ${error.message}\n`);
    }
  }
  console.log('='.repeat(60));
}

async function main() {
  console.log('\n🚀 开始为3个Collections添加字段...');
  console.log(`Database: ${DB_ID}\n`);
  console.log('='.repeat(60));

  // 1. projects
  await addFieldsToCollection('projects', projectsFields);

  // 2. calculations
  await addFieldsToCollection('calculations', calculationsFields);

  // 3. cost_factor_versions
  await addFieldsToCollection('cost_factor_versions', costFactorVersionsFields);

  // 验证所有字段
  await verifyCollections();

  console.log('\n✅ 所有Collections字段添加完成！');
}

main();

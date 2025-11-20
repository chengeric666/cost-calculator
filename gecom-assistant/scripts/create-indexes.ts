import { config } from 'dotenv';
import { Client, Databases, IndexType } from 'node-appwrite';

config({ path: '.env.local' });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;

interface IndexConfig {
  collectionId: string;
  key: string;
  type: IndexType;
  attributes: string[];
  orders?: string[];
  description: string;
}

// 索引定义
const indexes: IndexConfig[] = [
  // ===== cost_factors 索引 =====
  {
    collectionId: 'cost_factors',
    key: 'idx_country_industry_version',
    type: IndexType.Key,
    attributes: ['country', 'industry', 'version'],
    description: '查询特定国家+行业+版本的成本数据'
  },
  {
    collectionId: 'cost_factors',
    key: 'idx_country',
    type: IndexType.Key,
    attributes: ['country'],
    description: '按国家查询'
  },
  {
    collectionId: 'cost_factors',
    key: 'idx_industry',
    type: IndexType.Key,
    attributes: ['industry'],
    description: '按行业查询'
  },

  // ===== projects 索引 =====
  {
    collectionId: 'projects',
    key: 'idx_userId',
    type: IndexType.Key,
    attributes: ['userId'],
    description: '查询用户的所有项目'
  },
  {
    collectionId: 'projects',
    key: 'idx_userId_createdAt',
    type: IndexType.Key,
    attributes: ['userId', 'createdAt'],
    orders: ['ASC', 'DESC'],
    description: '查询用户的项目（按创建时间排序）'
  },

  // ===== calculations 索引 =====
  {
    collectionId: 'calculations',
    key: 'idx_projectId',
    type: IndexType.Key,
    attributes: ['projectId'],
    description: '查询项目的所有计算记录'
  },
  {
    collectionId: 'calculations',
    key: 'idx_projectId_createdAt',
    type: IndexType.Key,
    attributes: ['projectId', 'createdAt'],
    orders: ['ASC', 'DESC'],
    description: '查询项目的计算记录（按时间排序）'
  },

  // ===== cost_factor_versions 索引 =====
  {
    collectionId: 'cost_factor_versions',
    key: 'idx_version',
    type: IndexType.Unique,
    attributes: ['version'],
    description: '版本号唯一索引'
  },
  {
    collectionId: 'cost_factor_versions',
    key: 'idx_isActive',
    type: IndexType.Key,
    attributes: ['isActive'],
    description: '查询活跃版本'
  },
];

async function createIndexes() {
  console.log('\n🔍 开始创建数据库索引...\n');
  console.log(`Database: ${DB_ID}`);
  console.log(`共需创建 ${indexes.length} 个索引\n`);
  console.log('='.repeat(60));

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < indexes.length; i++) {
    const index = indexes[i];
    const progress = `[${i + 1}/${indexes.length}]`;
    const attrsStr = index.attributes.join(', ');

    console.log(`\n${progress} ${index.collectionId}.${index.key}`);
    console.log(`   属性: ${attrsStr}`);
    console.log(`   类型: ${index.type}`);
    console.log(`   说明: ${index.description}`);

    try {
      await databases.createIndex(
        DB_ID,
        index.collectionId,
        index.key,
        index.type,
        index.attributes,
        index.orders
      );
      console.log(`   ✅ 创建成功`);
      successCount++;

      // Appwrite限制：索引创建需要等待
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error: any) {
      if (error.code === 409) {
        console.log(`   ⚠️  已存在，跳过`);
        skipCount++;
      } else {
        console.log(`   ❌ 创建失败: ${error.message}`);
        failCount++;
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 索引创建统计：');
  console.log(`✅ 成功: ${successCount} 个`);
  console.log(`⚠️  跳过: ${skipCount} 个`);
  console.log(`❌ 失败: ${failCount} 个`);
  console.log('='.repeat(60));

  // 验证索引
  console.log('\n🔍 验证所有Collections的索引...\n');

  const collections = ['cost_factors', 'projects', 'calculations', 'cost_factor_versions'];

  for (const collectionId of collections) {
    try {
      const collection = await databases.getCollection(DB_ID, collectionId);
      console.log(`✅ ${collectionId}: ${collection.indexes.length} 个索引`);
      if (collection.indexes.length > 0) {
        collection.indexes.forEach((idx: any) => {
          const attrs = idx.attributes.join(', ');
          console.log(`   - ${idx.key}: [${attrs}] (${idx.type})`);
        });
      }
      console.log('');
    } catch (error: any) {
      console.log(`❌ ${collectionId}: 验证失败 - ${error.message}\n`);
    }
  }

  console.log('='.repeat(60));
  console.log('✅ 所有索引创建完成！');
}

createIndexes();

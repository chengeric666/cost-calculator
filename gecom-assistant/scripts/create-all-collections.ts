import { config } from 'dotenv';
import { Client, Databases } from 'node-appwrite';

config({ path: '.env.local' });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;

const collections = [
  // cost_factors已创建，跳过
  { id: 'projects', name: '用户项目' },
  { id: 'calculations', name: '计算记录' },
  { id: 'cost_factor_versions', name: '成本因子版本管理' }
];

async function createCollections() {
  console.log('\n📦 创建剩余3个Collections...\n');

  for (const col of collections) {
    try {
      const collection = await databases.createCollection(DB_ID, col.id, col.name);
      console.log(`✅ ${col.id}: 创建成功`);
    } catch (error: any) {
      if (error.code === 409) {
        console.log(`⚠️  ${col.id}: 已存在，跳过`);
      } else {
        console.log(`❌ ${col.id}: 创建失败 - ${error.message}`);
      }
    }
  }

  // 验证
  console.log('\n🔍 验证Collections...\n');
  const result = await databases.listCollections(DB_ID);
  console.log(`✅ 当前共有 ${result.total} 个Collections:`);
  result.collections.forEach((col: any) => {
    console.log(`   - ${col.$id}: ${col.name}`);
  });
}

createCollections();

import { config } from 'dotenv';
import { Client, Databases, ID } from 'node-appwrite';

config({ path: '.env.local' });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);

async function createCollection() {
  console.log('\n📦 尝试创建cost_factors Collection...\n');

  try {
    const collection = await databases.createCollection(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
      'cost_factors',
      '成本因子库'
    );

    console.log(`✅ 成功创建Collection: ${collection.$id}`);
    console.log(`   名称: ${collection.name}`);
    return true;
  } catch (error: any) {
    console.log(`❌ 创建失败\n`);
    console.log(`错误消息: ${error.message}`);
    console.log(`错误代码: ${error.code}`);
    console.log(`错误类型: ${error.type}`);
    console.log(`\n完整错误对象:`);
    console.log(JSON.stringify(error, null, 2));
    return false;
  }
}

createCollection();

import { config } from 'dotenv';
import { Client, Databases } from 'node-appwrite';

config({ path: '.env.local' });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);

async function listCollections() {
  try {
    const result = await databases.listCollections(process.env.NEXT_PUBLIC_APPWRITE_DATABASE!);
    console.log(`\n✅ 找到 ${result.total} 个Collections:\n`);
    result.collections.forEach((col: any) => {
      console.log(`- ${col.$id}: ${col.name}`);
      console.log(`  属性数: ${col.attributes?.length || 0}`);
    });
  } catch (error: any) {
    console.log(`❌ 错误: ${error.message}`);
    console.log(`Code: ${error.code}`);
    console.log(`\n完整错误:\n`, JSON.stringify(error, null, 2));
  }
}

listCollections();

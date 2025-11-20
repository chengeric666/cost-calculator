/**
 * 检查Appwrite Collections是否已存在
 */

import { config } from 'dotenv';
import { Client, Databases } from 'node-appwrite';

config({ path: '.env.local' });

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '';
const APPWRITE_PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT || '';
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE || '';
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || '';

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

async function checkCollections() {
  console.log('🔍 检查Appwrite Collections状态...\n');

  const collectionsToCheck = ['cost_factors', 'projects', 'calculations', 'cost_factor_versions'];

  for (const collectionId of collectionsToCheck) {
    try {
      const collection = await databases.getCollection(APPWRITE_DATABASE_ID, collectionId);
      console.log(`✅ ${collectionId}: 已存在`);
      console.log(`   - 名称: ${collection.name}`);
      console.log(`   - 属性数量: ${collection.attributes?.length || 0}`);
    } catch (error: any) {
      if (error.code === 404) {
        console.log(`❌ ${collectionId}: 不存在`);
      } else {
        console.log(`⚠️ ${collectionId}: 检查失败 - ${error.message}`);
      }
    }
  }
}

checkCollections().catch(console.error);

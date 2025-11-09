import { config } from 'dotenv';
import { Client, Databases } from 'node-appwrite';

config({ path: '.env.local' });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
const COL_ID = 'calculations';

async function deleteAndRecreateCalculations() {
  console.log('\n🔄 修复calculations collection字段...\n');

  // Step 1: 删除现有collection
  console.log('📝 Step 1: 删除现有calculations collection...');
  try {
    await databases.deleteCollection(DB_ID, COL_ID);
    console.log('✅ 删除成功');
    await new Promise(resolve => setTimeout(resolve, 2000));
  } catch (error: any) {
    console.log(`❌ 删除失败: ${error.message}`);
    return;
  }

  // Step 2: 重新创建collection
  console.log('\n📝 Step 2: 重新创建calculations collection...');
  try {
    const collection = await databases.createCollection(DB_ID, COL_ID, '计算记录');
    console.log(`✅ 创建成功: ${collection.name}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  } catch (error: any) {
    console.log(`❌ 创建失败: ${error.message}`);
    return;
  }

  // Step 3: 添加字段（调整大小以适应Appwrite限制）
  console.log('\n📝 Step 3: 添加字段（优化后的大小）...\n');

  const fields = [
    { key: 'projectId', type: 'string', size: 50, required: true, description: '关联项目ID' },
    { key: 'scope', type: 'string', size: 5000, required: true, description: '完整输入数据 (JSON)' },
    { key: 'costResult', type: 'string', size: 5000, required: true, description: '计算结果 (JSON)' },
    { key: 'userOverrides', type: 'string', size: 2000, required: false, description: '用户覆盖值 (JSON)' },
    { key: 'version', type: 'string', size: 20, required: true, description: 'GECOM版本' },
    { key: 'createdAt', type: 'datetime', required: true, description: '创建时间' },
  ];

  let successCount = 0;

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const progress = `[${i + 1}/${fields.length}]`;

    try {
      if (field.type === 'string') {
        await databases.createStringAttribute(
          DB_ID,
          COL_ID,
          field.key,
          field.size,
          field.required
        );
        console.log(`✅ ${progress} ${field.key} (string, ${field.size})`);
      } else if (field.type === 'datetime') {
        await databases.createDatetimeAttribute(
          DB_ID,
          COL_ID,
          field.key,
          field.required
        );
        console.log(`✅ ${progress} ${field.key} (datetime)`);
      }

      successCount++;
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error: any) {
      console.log(`❌ ${progress} ${field.key}: 失败 - ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`📊 成功添加 ${successCount}/${fields.length} 个字段`);

  // 验证
  console.log('\n🔍 验证calculations字段...\n');
  try {
    const collection = await databases.getCollection(DB_ID, COL_ID);
    console.log(`✅ calculations 当前有 ${collection.attributes.length} 个字段:\n`);
    collection.attributes.forEach((attr: any, index: number) => {
      const sizeInfo = attr.size ? ` (size: ${attr.size})` : '';
      console.log(`   ${index + 1}. ${attr.key} (${attr.type})${sizeInfo}`);
    });
  } catch (error: any) {
    console.log(`❌ 验证失败: ${error.message}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ calculations collection修复完成！');
  console.log('\n💡 字段大小优化说明：');
  console.log('   - scope: 10000 → 5000 (足够存储输入参数)');
  console.log('   - costResult: 10000 → 5000 (足够存储计算结果)');
  console.log('   - userOverrides: 5000 → 2000 (足够存储用户覆盖值)');
  console.log('   - 总计: ~12,070 字符 (符合Appwrite限制)');
  console.log('='.repeat(60));
}

deleteAndRecreateCalculations();

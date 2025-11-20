import { config } from 'dotenv';
import { Client, Databases, Query } from 'node-appwrite';

config({ path: '.env.local' });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;

async function testDatabase() {
  console.log('\n🧪 GECOM MVP 2.0 - 数据库快速验证\n');
  console.log('='.repeat(70));

  // Test 1: 查询成本因子
  console.log('\n📝 Test 1: 查询成本因子');
  const start1 = Date.now();
  try {
    const result = await databases.listDocuments(
      DB_ID,
      'cost_factors',
      [Query.equal('country', 'US')]
    );
    const elapsed1 = Date.now() - start1;
    console.log(`✅ 成功查询美国数据 (${elapsed1}ms)`);
    if (result.documents.length > 0) {
      const doc = result.documents[0];
      console.log(`   国家: ${doc.country_name_cn}`);
      console.log(`   关税: ${(doc.m4_effective_tariff_rate * 100).toFixed(2)}%`);
      console.log(`   VAT: ${(doc.m4_vat_rate * 100).toFixed(2)}%`);
    }
    console.log(`   性能: ${elapsed1 < 200 ? '✅' : '⚠️'} ${elapsed1}ms (目标<200ms)`);
  } catch (error: any) {
    console.log(`❌ 测试失败: ${error.message}`);
  }

  // Test 2: 批量查询3国
  console.log('\n📝 Test 2: 批量查询3国');
  const start2 = Date.now();
  try {
    const results = await Promise.all([
      databases.listDocuments(DB_ID, 'cost_factors', [Query.equal('country', 'US')]),
      databases.listDocuments(DB_ID, 'cost_factors', [Query.equal('country', 'DE')]),
      databases.listDocuments(DB_ID, 'cost_factors', [Query.equal('country', 'JP')]),
    ]);
    const elapsed2 = Date.now() - start2;
    const count = results.filter(r => r.documents.length > 0).length;
    console.log(`✅ 成功查询${count}/3个国家 (${elapsed2}ms)`);
    results.forEach(r => {
      if (r.documents.length > 0) {
        const doc = r.documents[0];
        console.log(`   - ${doc.country_name_cn}: 关税${(doc.m4_effective_tariff_rate * 100).toFixed(1)}%`);
      }
    });
    console.log(`   性能: ${elapsed2 < 500 ? '✅' : '⚠️'} ${elapsed2}ms (目标<500ms)`);
  } catch (error: any) {
    console.log(`❌ 测试失败: ${error.message}`);
  }

  // Test 3: 查询所有可用国家
  console.log('\n📝 Test 3: 查询所有可用国家');
  const start3 = Date.now();
  try {
    const result = await databases.listDocuments(DB_ID, 'cost_factors');
    const elapsed3 = Date.now() - start3;
    console.log(`✅ 成功查询${result.total}个国家 (${elapsed3}ms)`);
    result.documents.forEach(doc => {
      console.log(`   ${doc.country_flag || '🏳️'} ${doc.country_name_cn} (${doc.country})`);
    });
    console.log(`   性能: ${elapsed3 < 1000 ? '✅' : '⚠️'} ${elapsed3}ms (目标<1000ms)`);
  } catch (error: any) {
    console.log(`❌ 测试失败: ${error.message}`);
  }

  // Test 4: 验证所有Collections存在
  console.log('\n📝 Test 4: 验证所有Collections');
  const collections = ['cost_factors', 'projects', 'calculations', 'cost_factor_versions'];
  for (const col of collections) {
    try {
      const info = await databases.getCollection(DB_ID, col);
      console.log(`✅ ${col}: ${info.attributes.length}个字段, ${info.indexes.length}个索引`);
    } catch (error: any) {
      console.log(`❌ ${col}: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('✅ 数据库验证完成！');
  console.log('='.repeat(70) + '\n');
}

testDatabase().catch(console.error);

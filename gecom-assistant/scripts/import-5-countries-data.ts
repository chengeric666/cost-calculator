import { config } from 'dotenv';
import { Client, Databases, ID } from 'node-appwrite';

config({ path: '.env.local' });

// 导入5国数据
import { US_PET_FOOD } from '../data/cost-factors/US-pet-food';
import { DE_PET_FOOD } from '../data/cost-factors/DE-pet-food';
import { VN_PET_FOOD } from '../data/cost-factors/VN-pet-food';
import { UK_PET_FOOD } from '../data/cost-factors/UK-pet-food';
import { JP_PET_FOOD } from '../data/cost-factors/JP-pet-food';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
const COL_ID = 'cost_factors';

// 5国数据数组
const countriesData = [
  { name: '美国', code: 'US', data: US_PET_FOOD },
  { name: '德国', code: 'DE', data: DE_PET_FOOD },
  { name: '越南', code: 'VN', data: VN_PET_FOOD },
  { name: '英国', code: 'UK', data: UK_PET_FOOD },
  { name: '日本', code: 'JP', data: JP_PET_FOOD },
];

async function importCountryData(countryName: string, countryCode: string, data: any) {
  console.log(`\n📝 导入 ${countryName} (${countryCode}) 数据...`);

  try {
    // 准备文档数据 - 只包含已定义的字段
    const document: any = {
      // 基础字段
      country: data.country,
      country_name_cn: data.country_name_cn,
      ...(data.country_flag && { country_flag: data.country_flag }),
      industry: data.industry || 'pet_food',
      version: data.version || '2025Q1',

      // M1 字段
      ...(data.m1_complexity && { m1_complexity: data.m1_complexity }),
      ...(data.m1_company_registration_usd !== undefined && { m1_company_registration_usd: data.m1_company_registration_usd }),
      ...(data.m1_business_license_usd !== undefined && { m1_business_license_usd: data.m1_business_license_usd }),
      ...(data.m1_total_capex_usd !== undefined && { m1_total_capex_usd: data.m1_total_capex_usd }),
      ...(data.m1_data_source && { m1_data_source: data.m1_data_source }),

      // M2 字段
      ...(data.m2_complexity && { m2_complexity: data.m2_complexity }),
      ...(data.m2_product_certification_usd !== undefined && { m2_product_certification_usd: data.m2_product_certification_usd }),
      ...(data.m2_total_capex_usd !== undefined && { m2_total_capex_usd: data.m2_total_capex_usd }),
      ...(data.m2_data_source && { m2_data_source: data.m2_data_source }),

      // M3 字段
      ...(data.m3_warehouse_deposit_usd !== undefined && { m3_warehouse_deposit_usd: data.m3_warehouse_deposit_usd }),
      ...(data.m3_total_capex_usd !== undefined && { m3_total_capex_usd: data.m3_total_capex_usd }),
      ...(data.m3_data_source && { m3_data_source: data.m3_data_source }),

      // M4 字段
      ...(data.m4_effective_tariff_rate !== undefined && { m4_effective_tariff_rate: data.m4_effective_tariff_rate }),
      ...(data.m4_tariff_notes && { m4_tariff_notes: data.m4_tariff_notes }),
      ...(data.m4_vat_rate !== undefined && { m4_vat_rate: data.m4_vat_rate }),
      ...(data.m4_vat_notes && { m4_vat_notes: data.m4_vat_notes }),
      ...(data.m4_import_tax_usd !== undefined && { m4_import_tax_usd: data.m4_import_tax_usd }),
      ...(data.m4_tariff_data_source && { m4_tariff_data_source: data.m4_tariff_data_source }),
      ...(data.m4_tariff_tier && { m4_tariff_tier: data.m4_tariff_tier }),
      ...(data.m4_tariff_updated_at && { m4_tariff_updated_at: data.m4_tariff_updated_at }),

      // M5 字段
      ...(data.m5_international_shipping_usd !== undefined && { m5_international_shipping_usd: data.m5_international_shipping_usd }),
      ...(data.m5_last_mile_delivery_usd !== undefined && { m5_last_mile_delivery_usd: data.m5_last_mile_delivery_usd }),
      ...(data.m5_total_logistics_usd !== undefined && { m5_total_logistics_usd: data.m5_total_logistics_usd }),
      ...(data.m5_data_source && { m5_data_source: data.m5_data_source }),

      // M6 字段
      ...(data.m6_platform_commission_rate !== undefined && { m6_platform_commission_rate: data.m6_platform_commission_rate }),
      ...(data.m6_cac_usd !== undefined && { m6_cac_usd: data.m6_cac_usd }),
      ...(data.m6_data_source && { m6_data_source: data.m6_data_source }),

      // M7 字段
      ...(data.m7_payment_gateway_rate !== undefined && { m7_payment_gateway_rate: data.m7_payment_gateway_rate }),
      ...(data.m7_data_source && { m7_data_source: data.m7_data_source }),

      // M8 字段
      ...(data.m8_customer_service_usd !== undefined && { m8_customer_service_usd: data.m8_customer_service_usd }),
      ...(data.m8_data_source && { m8_data_source: data.m8_data_source }),
    };

    // 创建文档
    const result = await databases.createDocument(
      DB_ID,
      COL_ID,
      ID.unique(),
      document
    );

    console.log(`✅ ${countryName}: 导入成功 (文档ID: ${result.$id})`);

    // 打印关键数据
    console.log(`   - 关税率: ${data.m4_effective_tariff_rate * 100}%`);
    console.log(`   - VAT税率: ${data.m4_vat_rate * 100}%`);
    console.log(`   - 物流费: $${data.m5_total_logistics_usd}`);
    console.log(`   - M1 CAPEX: $${data.m1_total_capex_usd}`);

    return { success: true, id: result.$id };

  } catch (error: any) {
    console.log(`❌ ${countryName}: 导入失败 - ${error.message}`);
    if (error.response) {
      console.log(`   详细错误:`, JSON.stringify(error.response, null, 2));
    }
    return { success: false, error: error.message };
  }
}

async function importAllCountries() {
  console.log('\n🌍 开始导入5国成本数据到Appwrite...\n');
  console.log(`Database: ${DB_ID}`);
  console.log(`Collection: ${COL_ID}`);
  console.log('='.repeat(60));

  const results = {
    success: 0,
    failed: 0,
    details: [] as any[]
  };

  for (const country of countriesData) {
    const result = await importCountryData(country.name, country.code, country.data);

    if (result.success) {
      results.success++;
    } else {
      results.failed++;
    }

    results.details.push({
      country: country.name,
      code: country.code,
      ...result
    });

    // 等待一下再处理下一条
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 数据导入统计：');
  console.log(`✅ 成功: ${results.success} 个国家`);
  console.log(`❌ 失败: ${results.failed} 个国家`);
  console.log('='.repeat(60));

  // 验证数据
  console.log('\n🔍 验证导入的数据...\n');
  try {
    const documents = await databases.listDocuments(DB_ID, COL_ID);
    console.log(`✅ cost_factors collection 共有 ${documents.total} 条记录:\n`);

    documents.documents.forEach((doc: any, index: number) => {
      console.log(`${index + 1}. ${doc.country_name_cn} (${doc.country}) - ${doc.industry} - ${doc.version}`);
      console.log(`   关税: ${doc.m4_effective_tariff_rate * 100}% | VAT: ${doc.m4_vat_rate * 100}% | 物流: $${doc.m5_total_logistics_usd}`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('✅ 5国数据导入完成！');
    console.log('\n📌 下一步：');
    console.log('   1. 继续导入剩余14国数据');
    console.log('   2. 开始UI重构工作');
    console.log('   3. 集成成本计算引擎');
    console.log('='.repeat(60));

  } catch (error: any) {
    console.log(`❌ 验证失败: ${error.message}`);
  }
}

importAllCountries();

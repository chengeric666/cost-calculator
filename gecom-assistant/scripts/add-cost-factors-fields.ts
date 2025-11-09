import { config } from 'dotenv';
import { Client, Databases } from 'node-appwrite';

config({ path: '.env.local' });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;
const COL_ID = 'cost_factors';

interface FieldConfig {
  key: string;
  type: 'string' | 'float' | 'datetime';
  size?: number;
  required: boolean;
  default?: string | number;
  description: string;
}

// 38个核心字段定义
// 注意：Appwrite限制 - required字段不能有默认值，所以需要默认值的字段设为非必填
const fields: FieldConfig[] = [
  // ===== 基础字段 (5个) =====
  { key: 'country', type: 'string', size: 10, required: true, description: '国家代码 (US/UK/DE等)' },
  { key: 'country_name_cn', type: 'string', size: 50, required: true, description: '国家名称（中文）' },
  { key: 'country_flag', type: 'string', size: 10, required: false, description: '国家旗帜emoji' },
  { key: 'industry', type: 'string', size: 50, required: false, default: 'pet_food', description: '行业 (pet_food/vape)' },
  { key: 'version', type: 'string', size: 20, required: false, default: '2025Q1', description: '数据版本' },

  // ===== M1: 市场准入 (5个核心字段) =====
  { key: 'm1_complexity', type: 'string', size: 20, required: false, default: '中', description: 'M1复杂度 (极高/高/中/低)' },
  { key: 'm1_company_registration_usd', type: 'float', required: false, default: 0, description: 'M1公司注册费用 (USD)' },
  { key: 'm1_business_license_usd', type: 'float', required: false, default: 0, description: 'M1营业执照费用 (USD)' },
  { key: 'm1_total_capex_usd', type: 'float', required: false, default: 0, description: 'M1总CAPEX (USD)' },
  { key: 'm1_data_source', type: 'string', size: 200, required: false, description: 'M1数据来源' },

  // ===== M2: 技术合规 (4个核心字段) =====
  { key: 'm2_complexity', type: 'string', size: 20, required: false, default: '中', description: 'M2复杂度' },
  { key: 'm2_product_certification_usd', type: 'float', required: false, default: 0, description: 'M2产品认证费用 (USD)' },
  { key: 'm2_total_capex_usd', type: 'float', required: false, default: 0, description: 'M2总CAPEX (USD)' },
  { key: 'm2_data_source', type: 'string', size: 200, required: false, description: 'M2数据来源' },

  // ===== M3: 供应链搭建 (3个核心字段) =====
  { key: 'm3_warehouse_deposit_usd', type: 'float', required: false, default: 0, description: 'M3仓储押金 (USD)' },
  { key: 'm3_total_capex_usd', type: 'float', required: false, default: 0, description: 'M3总CAPEX (USD)' },
  { key: 'm3_data_source', type: 'string', size: 200, required: false, description: 'M3数据来源' },

  // ===== M4: 货物税费 (8个核心字段) =====
  { key: 'm4_effective_tariff_rate', type: 'float', required: false, default: 0, description: 'M4有效关税税率 (0-1)' },
  { key: 'm4_tariff_notes', type: 'string', size: 500, required: false, description: 'M4关税说明' },
  { key: 'm4_vat_rate', type: 'float', required: false, default: 0, description: 'M4增值税/消费税税率 (0-1)' },
  { key: 'm4_vat_notes', type: 'string', size: 500, required: false, description: 'M4增值税说明' },
  { key: 'm4_import_tax_usd', type: 'float', required: false, default: 0, description: 'M4进口税费 (USD/单位)' },
  { key: 'm4_tariff_data_source', type: 'string', size: 200, required: false, description: 'M4关税数据来源' },
  { key: 'm4_tariff_tier', type: 'string', size: 10, required: false, default: 'Tier 2', description: 'M4数据质量级别' },
  { key: 'm4_tariff_updated_at', type: 'datetime', required: false, description: 'M4数据更新时间' },

  // ===== M5: 物流配送 (4个核心字段) =====
  { key: 'm5_international_shipping_usd', type: 'float', required: false, default: 0, description: 'M5国际运输费 (USD/单位)' },
  { key: 'm5_last_mile_delivery_usd', type: 'float', required: false, default: 0, description: 'M5本地配送费 (USD/单位)' },
  { key: 'm5_total_logistics_usd', type: 'float', required: false, default: 0, description: 'M5总物流费 (USD/单位)' },
  { key: 'm5_data_source', type: 'string', size: 200, required: false, description: 'M5数据来源' },

  // ===== M6: 营销获客 (3个核心字段) =====
  { key: 'm6_platform_commission_rate', type: 'float', required: false, default: 0, description: 'M6平台佣金率 (0-1)' },
  { key: 'm6_cac_usd', type: 'float', required: false, default: 0, description: 'M6获客成本 (USD/客户)' },
  { key: 'm6_data_source', type: 'string', size: 200, required: false, description: 'M6数据来源' },

  // ===== M7: 支付手续费 (2个核心字段) =====
  { key: 'm7_payment_gateway_rate', type: 'float', required: false, default: 0.029, description: 'M7支付网关费率 (0-1)' },
  { key: 'm7_data_source', type: 'string', size: 200, required: false, description: 'M7数据来源' },

  // ===== M8: 运营管理 (2个核心字段) =====
  { key: 'm8_customer_service_usd', type: 'float', required: false, default: 0, description: 'M8客服成本 (USD/单位)' },
  { key: 'm8_data_source', type: 'string', size: 200, required: false, description: 'M8数据来源' },
];

async function addFields() {
  console.log('\n📝 开始添加cost_factors的38个核心字段...\n');
  console.log(`Database: ${DB_ID}`);
  console.log(`Collection: ${COL_ID}\n`);

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
          COL_ID,
          field.key,
          field.size!,
          field.required,
          field.default as string | undefined
        );
        console.log(`✅ ${progress} ${field.key} (string, ${field.size})`);
        successCount++;
      } else if (field.type === 'float') {
        await databases.createFloatAttribute(
          DB_ID,
          COL_ID,
          field.key,
          field.required,
          undefined,
          undefined,
          field.default as number | undefined
        );
        console.log(`✅ ${progress} ${field.key} (float)`);
        successCount++;
      } else if (field.type === 'datetime') {
        await databases.createDatetimeAttribute(
          DB_ID,
          COL_ID,
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

  console.log('\n' + '='.repeat(60));
  console.log('📊 字段添加完成统计：');
  console.log(`✅ 成功: ${successCount} 个`);
  console.log(`⚠️  跳过: ${skipCount} 个`);
  console.log(`❌ 失败: ${failCount} 个`);
  console.log('='.repeat(60));

  // 验证
  console.log('\n🔍 验证cost_factors字段...\n');
  try {
    const collection = await databases.getCollection(DB_ID, COL_ID);
    console.log(`✅ cost_factors 当前有 ${collection.attributes.length} 个字段`);
    console.log('\n字段列表：');
    collection.attributes.forEach((attr: any, index: number) => {
      console.log(`  ${index + 1}. ${attr.key} (${attr.type})`);
    });
  } catch (error: any) {
    console.log(`❌ 验证失败: ${error.message}`);
  }
}

addFields();

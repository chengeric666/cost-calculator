#!/usr/bin/env tsx
/**
 * 检查Appwrite数据库实际schema
 * 通过查询现有数据来确定哪些字段实际存在
 */

import { config } from 'dotenv';
import { Client, Databases, Query } from 'node-appwrite';

config({ path: '.env.local' });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;

async function checkSchema() {
  console.log('╔═══════════════════════════════════════════════╗');
  console.log('║   检查Appwrite数据库实际schema                ║');
  console.log('╚═══════════════════════════════════════════════╝\n');

  try {
    // 查询现有的pet food数据
    const result = await databases.listDocuments(DB_ID, 'cost_factors', [
      Query.equal('industry', ['pet_food']),
      Query.limit(1),
    ]);

    if (result.total === 0) {
      console.log('❌ 没有找到pet_food数据');
      return;
    }

    const doc = result.documents[0];
    console.log(`✅ 找到pet_food数据: ${doc.country} (${doc.$id})\n`);

    // 排除系统字段
    const systemFields = new Set(['$id', '$createdAt', '$updatedAt', '$permissions', '$databaseId', '$collectionId']);

    const fields = Object.keys(doc).filter(key => !systemFields.has(key));
    console.log(`📊 实际字段数: ${fields.length}个\n`);
    console.log('字段列表：');
    fields.sort().forEach((field, index) => {
      console.log(`${(index + 1).toString().padStart(3, ' ')}. ${field}`);
    });

    // 按模块分组
    console.log('\n\n按模块分组：');
    const grouped: { [key: string]: string[] } = {
      'base': [],
      'm1': [],
      'm2': [],
      'm3': [],
      'm4': [],
      'm5': [],
      'm6': [],
      'm7': [],
      'm8': [],
      'other': [],
    };

    fields.forEach(field => {
      if (field.startsWith('m1_')) grouped.m1.push(field);
      else if (field.startsWith('m2_')) grouped.m2.push(field);
      else if (field.startsWith('m3_')) grouped.m3.push(field);
      else if (field.startsWith('m4_')) grouped.m4.push(field);
      else if (field.startsWith('m5_')) grouped.m5.push(field);
      else if (field.startsWith('m6_')) grouped.m6.push(field);
      else if (field.startsWith('m7_')) grouped.m7.push(field);
      else if (field.startsWith('m8_')) grouped.m8.push(field);
      else if (['country', 'country_name_cn', 'country_flag', 'industry', 'version'].includes(field)) {
        grouped.base.push(field);
      } else {
        grouped.other.push(field);
      }
    });

    Object.entries(grouped).forEach(([module, fields]) => {
      if (fields.length > 0) {
        console.log(`\n${module.toUpperCase()}: ${fields.length}个字段`);
        fields.forEach(f => console.log(`  - ${f}`));
      }
    });

  } catch (error: any) {
    console.error('❌ 检查失败:', error.message);
  }
}

checkSchema();

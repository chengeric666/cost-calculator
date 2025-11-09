import { config } from 'dotenv';
import {
  getCostFactor,
  getCostFactorsByCountries,
  getAvailableCountries,
  createProject,
  getProjects,
  createCalculation,
  getCalculationsByProject,
} from '../lib/appwrite-data';
import { Industry, TargetCountry } from '../types/gecom';

config({ path: '.env.local' });

async function testCRUDOperations() {
  console.log('\n🧪 GECOM MVP 2.0 - 数据库CRUD操作测试\n');
  console.log('='.repeat(70));

  // Test 1: getCostFactor - 单国查询
  console.log('\n📝 Test 1: 单国成本因子查询');
  const startTime1 = Date.now();
  const usFactor = await getCostFactor('US' as TargetCountry, 'pet_food' as Industry);
  const elapsed1 = Date.now() - startTime1;

  if (usFactor) {
    console.log(`✅ 成功查询美国成本因子 (${elapsed1}ms)`);
    console.log(`   关税率: ${(usFactor.m4_effective_tariff_rate * 100).toFixed(2)}%`);
    console.log(`   VAT税率: ${(usFactor.m4_vat_rate * 100).toFixed(2)}%`);
    console.log(`   ${elapsed1 < 200 ? '✅' : '⚠️ '} 性能: ${elapsed1}ms (目标<200ms)`);
  } else {
    console.log(`❌ 查询失败`);
  }

  // Test 2: getCostFactorsByCountries - 批量查询
  console.log('\n📝 Test 2: 3国批量成本因子查询');
  const startTime2 = Date.now();
  const threeCountries = await getCostFactorsByCountries(
    ['US', 'DE', 'JP'] as TargetCountry[],
    'pet_food' as Industry
  );
  const elapsed2 = Date.now() - startTime2;

  console.log(`✅ 成功查询${threeCountries.length}/3个国家 (${elapsed2}ms)`);
  threeCountries.forEach(factor => {
    console.log(`   - ${factor.country_name_cn}: 关税${(factor.m4_effective_tariff_rate * 100).toFixed(1)}%`);
  });
  console.log(`   ${elapsed2 < 500 ? '✅' : '⚠️ '} 性能: ${elapsed2}ms (目标<500ms)`);

  // Test 3: getAvailableCountries - 5国查询
  console.log('\n📝 Test 3: 所有可用国家查询');
  const startTime3 = Date.now();
  const countries = await getAvailableCountries('pet_food' as Industry);
  const elapsed3 = Date.now() - startTime3;

  console.log(`✅ 成功查询${countries.length}个可用国家 (${elapsed3}ms)`);
  countries.forEach(c => {
    console.log(`   ${c.country_flag || '🏳️ '} ${c.country_name_cn} (${c.country})`);
  });
  console.log(`   ${elapsed3 < 1000 ? '✅' : '⚠️ '} 性能: ${elapsed3}ms (目标<1000ms)`);

  // Test 4: Projects CRUD
  console.log('\n📝 Test 4: 项目CRUD操作');
  const testProject = {
    userId: 'test-user',
    name: '测试项目 - 美国宠物食品',
    industry: 'pet_food',
    targetCountry: 'US',
    salesChannel: 'amazon_fba',
  };

  const startTime4 = Date.now();
  const createdProject = await createProject(testProject);
  const elapsed4 = Date.now() - startTime4;

  if (createdProject) {
    console.log(`✅ 创建项目成功 (${elapsed4}ms)`);
    console.log(`   项目ID: ${createdProject.id}`);
    console.log(`   项目名称: ${createdProject.name}`);

    // 查询项目列表
    const projects = await getProjects('test-user');
    console.log(`✅ 查询到${projects.length}个项目`);
  } else {
    console.log(`❌ 创建项目失败`);
  }

  // Test 5: Calculations CRUD
  console.log('\n📝 Test 5: 计算记录CRUD操作');
  if (createdProject) {
    const testScope = {
      productName: '测试产品',
      productWeight: 1.5,
      cogs: 8,
      sellingPrice: 25,
      monthlyVolume: 1000,
      targetCountry: 'US' as TargetCountry,
      industry: 'pet_food' as Industry,
      salesChannel: 'amazon_fba' as any,
    };

    const testCostResult = {
      unitRevenue: 25,
      unitCost: 15,
      grossProfit: 10,
      grossMargin: 40,
      CAPEX: { total: 5000, M1: 2000, M2: 2000, M3: 1000 },
      OPEX: {
        total: 15,
        M4: { total: 10 },
        M5: { total: 3 },
        M6: { total: 1.5 },
        M7: { total: 0.3 },
        M8: { total: 0.2 },
      },
    };

    const startTime5 = Date.now();
    const calculation = await createCalculation(
      createdProject.id,
      testScope,
      testCostResult as any,
      '2.0'
    );
    const elapsed5 = Date.now() - startTime5;

    if (calculation) {
      console.log(`✅ 创建计算记录成功 (${elapsed5}ms)`);
      console.log(`   记录ID: ${calculation.id}`);

      // 查询计算记录
      const calculations = await getCalculationsByProject(createdProject.id);
      console.log(`✅ 查询到${calculations.length}条计算记录`);
    } else {
      console.log(`❌ 创建计算记录失败`);
    }
  }

  // 性能总结
  console.log('\n' + '='.repeat(70));
  console.log('📊 性能测试总结\n');

  const performanceResults = [
    { name: '单国查询', time: elapsed1, target: 200, pass: elapsed1 < 200 },
    { name: '3国批量查询', time: elapsed2, target: 500, pass: elapsed2 < 500 },
    { name: '5国列表查询', time: elapsed3, target: 1000, pass: elapsed3 < 1000 },
    { name: '项目创建', time: elapsed4, target: 500, pass: elapsed4 < 500 },
  ];

  performanceResults.forEach(result => {
    const status = result.pass ? '✅' : '⚠️ ';
    console.log(`${status} ${result.name}: ${result.time}ms (目标<${result.target}ms)`);
  });

  const allPass = performanceResults.every(r => r.pass);
  console.log(`\n${allPass ? '✅' : '⚠️ '} 性能测试${allPass ? '全部通过' : '部分未达标'}`);
  console.log('='.repeat(70));
  console.log('\n✅ CRUD操作测试完成！\n');
}

testCRUDOperations().catch(console.error);

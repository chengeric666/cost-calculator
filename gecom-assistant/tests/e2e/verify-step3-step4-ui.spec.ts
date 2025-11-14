/**
 * 验证Step 3和Step 4的实际UI状态
 *
 * 目的：
 * 1. 通过实际页面操作验证Step 3是否显示详细成本拆解
 * 2. 验证Step 4是否仍然显示Mock数据警告
 *
 * @created 2025-11-14
 */

import { test, expect } from '@playwright/test';

test('验证Step 3和Step 4实际UI状态', async ({ page }) => {
  console.log('\n========== 开始UI状态验证 ==========\n');

  // Step 0: 访问首页
  console.log('[Step 0] 访问 http://localhost:3000...');
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // 截图首页（Landing Page）
  await page.screenshot({
    path: 'test-results/ui-verification/00-landing-page.png',
    fullPage: true,
  });
  console.log('  ✅ 截图保存: test-results/ui-verification/00-landing-page.png');

  // 点击"开始成本计算"按钮进入向导
  console.log('\n[Step 0.5] 点击"开始成本计算"按钮进入向导...');
  const startButton = page.locator('button:has-text("开始成本计算")');
  await startButton.click();
  await page.waitForTimeout(1500);
  console.log('  ✓ 已进入向导页面');

  // 截图向导首页（Step 0）
  await page.screenshot({
    path: 'test-results/ui-verification/00-wizard-step0.png',
    fullPage: true,
  });
  console.log('  ✅ 截图保存: test-results/ui-verification/00-wizard-step0.png');

  // Step 1: 填写Step 0（项目基本信息）
  console.log('\n[Step 1] 填写Step 0 - 项目基本信息...');

  // 填写项目名称
  const projectNameInput = page.locator('input[placeholder*="益家之宠"]');
  await projectNameInput.fill('UI验证测试项目');
  console.log('  ✓ 项目名称: UI验证测试项目');

  await page.waitForTimeout(500);

  // 选择行业（点击"宠物食品"卡片）
  const petFoodCard = page.locator('text=/宠物食品/i');
  await petFoodCard.click();
  console.log('  ✓ 行业: 宠物食品');

  await page.waitForTimeout(500);

  // 点击"下一步"按钮进入Step 1
  const nextButton = page.locator('button:has-text("下一步")');
  await nextButton.click();
  console.log('  ✓ 点击下一步，进入Step 1...');

  await page.waitForTimeout(2000);

  // 截图Step 1
  await page.screenshot({
    path: 'test-results/ui-verification/01-step1-scope.png',
    fullPage: true,
  });
  console.log('  ✅ 截图保存: test-results/ui-verification/01-step1-scope.png');

  // Step 2: 填写Step 1（业务场景定义）
  console.log('\n[Step 2] 填写Step 1 - 业务场景定义...');

  // 填写产品名称（第一个文本输入框）
  const productNameInput = page.locator('input[type="text"]').first();
  await productNameInput.fill('测试宠物零食');
  console.log('  ✓ 产品名称: 测试宠物零食');

  // 填写售价（第一个数字输入框）
  const priceInputs = page.locator('input[type="number"]');
  await priceInputs.nth(0).fill('15.99');
  console.log('  ✓ 售价: $15.99');

  // 填写月销量（第二个数字输入框）
  await priceInputs.nth(1).fill('500');
  console.log('  ✓ 月销量: 500');

  await page.waitForTimeout(1000);

  // 点击"下一步"进入Step 2
  const nextButton2 = page.locator('button:has-text("下一步")');
  await nextButton2.click();
  console.log('  ✓ 点击下一步，进入Step 2...');

  await page.waitForTimeout(2000);

  // 截图Step 2
  await page.screenshot({
    path: 'test-results/ui-verification/02-step2-cost-params.png',
    fullPage: true,
  });
  console.log('  ✅ 截图保存: test-results/ui-verification/02-step2-cost-params.png');

  // Step 3: Step 2使用默认值，直接下一步进入Step 3
  console.log('\n[Step 3] Step 2（成本参数配置）保持默认值，点击下一步进入Step 3...');

  const nextButton3 = page.locator('button:has-text("下一步")');
  await nextButton3.click();
  console.log('  ✓ 点击下一步，进入Step 3（成本建模结果）...');

  await page.waitForTimeout(2000);

  // 到达Step 3 - 关键验证点
  console.log('\n========== Step 3 成本建模结果 UI验证 ==========');

  // 截图完整Step 3页面
  await page.screenshot({
    path: 'test-results/ui-verification/03-step3-cost-modeling-FULL.png',
    fullPage: true,
  });
  console.log('  📸 完整页面截图: test-results/ui-verification/03-step3-cost-modeling-FULL.png');

  // 检查页面标题
  const step3Title = await page.locator('h2').first().textContent();
  console.log(`  - 页面标题: ${step3Title}`);

  // 检查是否有"成本建模结果"文字
  const hasCostModeling = await page.locator('text=/成本建模结果/i').count();
  console.log(`  - "成本建模结果"文字存在: ${hasCostModeling > 0 ? '✅' : '❌'}`);

  // 检查CAPEX区域
  const capexSection = page.locator('text=/CAPEX.*一次性启动成本/i');
  const hasCapexSection = (await capexSection.count()) > 0;
  console.log(`  - CAPEX区域存在: ${hasCapexSection ? '✅' : '❌'}`);

  // 检查是否有M1-M8详细表格
  const tables = page.locator('table');
  const tableCount = await tables.count();
  console.log(`  - 表格数量: ${tableCount}`);

  // 点击M1展开按钮（如果存在）
  const m1ExpandButton = page.locator('button:has-text("M1: 市场准入")');
  const m1ExpandButtonCount = await m1ExpandButton.count();
  if (m1ExpandButtonCount > 0) {
    await m1ExpandButton.click();
    await page.waitForTimeout(500);
    console.log('  ✓ M1展开按钮已点击');
  }

  // 检查M1模块是否展开显示详细成本项
  const m1DetailItems = page.locator('text=/公司注册费|商业许可证费|税务登记费|法务咨询费|Company Registration|Business License|Tax Registration|Legal Consulting/i');
  const m1DetailCount = await m1DetailItems.count();
  console.log(`  - M1详细成本项数量: ${m1DetailCount}`);

  if (m1DetailCount < 4) {
    console.log(`  ⚠️ WARNING: M1模块未完全显示详细成本项（期望4项，实际${m1DetailCount}项）！`);
  } else {
    console.log(`  ✅ M1模块显示完整详细成本项（${m1DetailCount}项）`);
  }

  // 点击M2展开按钮
  const m2ExpandButton = page.locator('button:has-text("M2: 技术合规")');
  const m2ExpandButtonCount = await m2ExpandButton.count();
  if (m2ExpandButtonCount > 0) {
    await m2ExpandButton.click();
    await page.waitForTimeout(500);
    console.log('  ✓ M2展开按钮已点击');
  }

  // 检查M2模块详细成本项
  const m2DetailItems = page.locator('text=/产品认证费|商标注册费|合规检测费|Product Certification|Trademark Registration|Compliance Testing/i');
  const m2DetailCount = await m2DetailItems.count();
  console.log(`  - M2详细成本项数量: ${m2DetailCount}`);

  if (m2DetailCount < 3) {
    console.log(`  ⚠️ WARNING: M2模块未完全显示详细成本项（期望3+项，实际${m2DetailCount}项）！`);
  } else {
    console.log(`  ✅ M2模块显示完整详细成本项（${m2DetailCount}项）`);
  }

  // 点击M3展开按钮
  const m3ExpandButton = page.locator('button:has-text("M3: 供应链搭建")');
  const m3ExpandButtonCount = await m3ExpandButton.count();
  if (m3ExpandButtonCount > 0) {
    await m3ExpandButton.click();
    await page.waitForTimeout(500);
    console.log('  ✓ M3展开按钮已点击');
  }

  // 检查M3模块详细成本项
  const m3DetailItems = page.locator('text=/仓储押金|设备采购费|初始库存成本|系统搭建费|Warehouse Deposit|Equipment Purchase|Initial Inventory|System Setup/i');
  const m3DetailCount = await m3DetailItems.count();
  console.log(`  - M3详细成本项数量: ${m3DetailCount}`);

  if (m3DetailCount < 4) {
    console.log(`  ⚠️ WARNING: M3模块未完全显示详细成本项（期望4项，实际${m3DetailCount}项）！`);
  } else {
    console.log(`  ✅ M3模块显示完整详细成本项（${m3DetailCount}项）`);
  }

  // 检查M4模块
  const m4DetailItems = page.locator('text=/COGS|关税|增值税|VAT|物流/i');
  const m4DetailCount = await m4DetailItems.count();
  console.log(`  - M4详细成本项数量: ${m4DetailCount}`);

  if (m4DetailCount < 3) {
    console.log('  ⚠️ WARNING: M4模块未显示完整详细成本项！');
  }

  // 截图CAPEX区域
  if (hasCapexSection) {
    const capexElement = await capexSection.first().elementHandle();
    if (capexElement) {
      await capexElement.screenshot({
        path: 'test-results/ui-verification/03-step3-CAPEX-detail.png',
      });
      console.log('  📸 CAPEX区域截图: test-results/ui-verification/03-step3-CAPEX-detail.png');
    }
  }

  console.log('\n========== Step 4 场景对比分析 UI验证 ==========');

  // 进入Step 4
  console.log('[Step 4] 点击下一步，进入Step 4（场景对比分析）...');
  const nextButton4 = page.locator('button:has-text("下一步")');
  await nextButton4.click();
  console.log('  ✓ 已进入Step 4');
  await page.waitForTimeout(2000);

  // 截图完整Step 4页面
  await page.screenshot({
    path: 'test-results/ui-verification/04-step4-comparison-FULL.png',
    fullPage: true,
  });
  console.log('  📸 完整页面截图: test-results/ui-verification/04-step4-comparison-FULL.png');

  // 检查是否有Mock数据警告
  const mockWarning = page.locator('text=/模拟数据|mock.*data/i');
  const hasMockWarning = (await mockWarning.count()) > 0;
  console.log(`  - Mock数据警告存在: ${hasMockWarning ? '⚠️ 是' : '✅ 否'}`);

  if (hasMockWarning) {
    const warningText = await mockWarning.first().textContent();
    console.log(`  - 警告文字内容: "${warningText}"`);

    // 截图警告区域
    const warningElement = await mockWarning.first().elementHandle();
    if (warningElement) {
      await warningElement.screenshot({
        path: 'test-results/ui-verification/04-step4-MOCK-WARNING.png',
      });
      console.log('  📸 Mock警告截图: test-results/ui-verification/04-step4-MOCK-WARNING.png');
    }
  }

  // 检查是否有推荐卡片
  const recommendationCards = page.locator('[class*="gradient"]');
  const cardCount = await recommendationCards.count();
  console.log(`  - 推荐卡片数量: ${cardCount}`);

  // 检查是否有19国排名表格
  const rankingTables = page.locator('table');
  const rankingTableCount = await rankingTables.count();
  console.log(`  - 表格数量: ${rankingTableCount}`);

  console.log('\n========== 验证总结 ==========');
  console.log(`
📊 Step 3 验证结果:
  - 页面标题: ${step3Title}
  - CAPEX区域: ${hasCapexSection ? '✅ 存在' : '❌ 不存在'}
  - 表格数量: ${tableCount}
  - M1详细项: ${m1DetailCount}
  - M4详细项: ${m4DetailCount}
  ${m1DetailCount === 0 || m4DetailCount < 3 ? '⚠️ 缺少详细成本拆解，仅显示概览' : '✅ 显示详细成本拆解'}

📊 Step 4 验证结果:
  - Mock警告: ${hasMockWarning ? '⚠️ 存在（需要移除）' : '✅ 不存在'}
  - 推荐卡片: ${cardCount}
  - 表格数量: ${rankingTableCount}
  ${hasMockWarning ? '⚠️ 仍在使用模拟数据' : '✅ 使用真实数据'}

📁 所有截图已保存到: test-results/ui-verification/
  `);

  console.log('\n========== 验证完成 ==========\n');

  // 保持浏览器打开30秒供手动查看
  console.log('⏸️  浏览器将保持打开30秒，请手动查看页面...\n');
  await page.waitForTimeout(30000);
});

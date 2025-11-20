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

  // 到达Step 3 - 关键验证点（紧凑布局）
  console.log('\n========== Step 3 成本建模结果 UI验证（紧凑左右分栏布局）==========');

  // 截图完整Step 3页面
  await page.screenshot({
    path: 'test-results/ui-verification/03-step3-compact-layout-FULL.png',
    fullPage: true,
  });
  console.log('  📸 完整页面截图: test-results/ui-verification/03-step3-compact-layout-FULL.png');

  // 检查页面标题
  const step3Title = await page.locator('h2').first().textContent();
  console.log(`  - 页面标题: ${step3Title}`);

  // 检查是否有"成本建模结果"文字
  const hasCostModeling = await page.locator('text=/成本建模结果/i').count();
  console.log(`  - "成本建模结果"文字存在: ${hasCostModeling > 0 ? '✅' : '❌'}`);

  // 验证左右分栏布局（60/40）
  const leftColumn = page.locator('.grid.grid-cols-5 > .col-span-3');
  const rightColumn = page.locator('.grid.grid-cols-5 > .col-span-2');
  const hasLeftColumn = (await leftColumn.count()) > 0;
  const hasRightColumn = (await rightColumn.count()) > 0;
  console.log(`  - 左侧列（60%）存在: ${hasLeftColumn ? '✅' : '❌'}`);
  console.log(`  - 右侧列（40%）存在: ${hasRightColumn ? '✅' : '❌'}`);

  // 检查CAPEX区域（左侧列）
  const capexSection = page.locator('text=/CAPEX.*一次性启动成本/i');
  const hasCapexSection = (await capexSection.count()) > 0;
  console.log(`  - CAPEX区域存在: ${hasCapexSection ? '✅' : '❌'}`);

  // ⭐ 新验证：确认没有展开/收起按钮（紧凑布局特征）
  const expandButtons = page.locator('button:has-text("点击展开")');
  const expandButtonCount = await expandButtons.count();
  console.log(`  - 展开按钮数量（应为0）: ${expandButtonCount === 0 ? '✅ 0个（紧凑布局正确）' : `❌ ${expandButtonCount}个`}`);

  // 验证M1模块详细成本项直接可见（无需点击）
  const m1DetailItems = page.locator('text=/公司注册费|商业许可证费|税务登记费|法务咨询费|Company Registration|Business License|Tax Registration|Legal Consulting/i');
  const m1DetailCount = await m1DetailItems.count();
  console.log(`  - M1详细成本项数量（直接可见）: ${m1DetailCount}`);

  if (m1DetailCount < 4) {
    console.log(`  ⚠️ WARNING: M1模块未完全显示详细成本项（期望≥8项（含英文），实际${m1DetailCount}项）！`);
  } else {
    console.log(`  ✅ M1模块显示完整详细成本项（${m1DetailCount}项，含中英文）`);
  }

  // 验证M2模块详细成本项直接可见
  const m2DetailItems = page.locator('text=/产品认证费|商标注册费|合规检测费|Product Certification|Trademark Registration|Compliance Testing/i');
  const m2DetailCount = await m2DetailItems.count();
  console.log(`  - M2详细成本项数量（直接可见）: ${m2DetailCount}`);

  if (m2DetailCount < 3) {
    console.log(`  ⚠️ WARNING: M2模块未完全显示详细成本项（期望≥6项，实际${m2DetailCount}项）！`);
  } else {
    console.log(`  ✅ M2模块显示完整详细成本项（${m2DetailCount}项）`);
  }

  // 验证M3模块详细成本项直接可见
  const m3DetailItems = page.locator('text=/仓储押金|设备采购费|初始库存成本|系统搭建费|Warehouse Deposit|Equipment Purchase|Initial Inventory|System Setup/i');
  const m3DetailCount = await m3DetailItems.count();
  console.log(`  - M3详细成本项数量（直接可见）: ${m3DetailCount}`);

  if (m3DetailCount < 4) {
    console.log(`  ⚠️ WARNING: M3模块未完全显示详细成本项（期望≥8项，实际${m3DetailCount}项）！`);
  } else {
    console.log(`  ✅ M3模块显示完整详细成本项（${m3DetailCount}项）`);
  }

  // 验证OPEX模块（M4-M8）存在于左侧列
  const opexSection = page.locator('text=/OPEX.*单位运营成本/i');
  const hasOpexSection = (await opexSection.count()) > 0;
  console.log(`  - OPEX区域存在: ${hasOpexSection ? '✅' : '❌'}`);

  // 验证M4-M8模块标题
  const m4Title = page.locator('text=/M4.*货物税费/i');
  const m5Title = page.locator('text=/M5.*物流配送/i');
  const m6Title = page.locator('text=/M6.*营销获客/i');
  const m7Title = page.locator('text=/M7.*支付手续费/i');
  const m8Title = page.locator('text=/M8.*运营管理/i');
  console.log(`  - M4模块标题: ${(await m4Title.count()) > 0 ? '✅' : '❌'}`);
  console.log(`  - M5模块标题: ${(await m5Title.count()) > 0 ? '✅' : '❌'}`);
  console.log(`  - M6模块标题: ${(await m6Title.count()) > 0 ? '✅' : '❌'}`);
  console.log(`  - M7模块标题: ${(await m7Title.count()) > 0 ? '✅' : '❌'}`);
  console.log(`  - M8模块标题: ${(await m8Title.count()) > 0 ? '✅' : '❌'}`);

  // 验证右侧列KPI卡片
  const metricCards = page.locator('.col-span-2 .space-y-3 > div');
  const metricCardCount = await metricCards.count();
  console.log(`  - 右侧KPI卡片数量: ${metricCardCount}（期望4个）`);

  // 验证右侧单位经济模型区域
  const unitEconomicsSection = page.locator('text=/单位经济模型/i');
  const hasUnitEconomics = (await unitEconomicsSection.count()) > 0;
  console.log(`  - 单位经济模型区域: ${hasUnitEconomics ? '✅' : '❌'}`);

  // 验证盈亏平衡分析区域
  const breakevenSection = page.locator('text=/盈亏平衡分析/i');
  const hasBreakeven = (await breakevenSection.count()) > 0;
  console.log(`  - 盈亏平衡分析区域: ${hasBreakeven ? '✅' : '❌'}`);

  // 截图左侧列（成本明细）
  if (hasLeftColumn) {
    await leftColumn.first().screenshot({
      path: 'test-results/ui-verification/03-step3-left-column-cost-details.png',
    });
    console.log('  📸 左侧列截图: test-results/ui-verification/03-step3-left-column-cost-details.png');
  }

  // 截图右侧列（KPI结果）
  if (hasRightColumn) {
    await rightColumn.first().screenshot({
      path: 'test-results/ui-verification/03-step3-right-column-kpi-results.png',
    });
    console.log('  📸 右侧列截图: test-results/ui-verification/03-step3-right-column-kpi-results.png');
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
📊 Step 3 验证结果（紧凑左右分栏布局）:
  - 页面标题: ${step3Title}
  - 布局模式: ${hasLeftColumn && hasRightColumn ? '✅ 左右分栏（60/40）' : '❌ 布局错误'}
  - 展开按钮: ${expandButtonCount === 0 ? '✅ 0个（紧凑模式正确）' : `❌ ${expandButtonCount}个（应为0）`}
  - CAPEX区域: ${hasCapexSection ? '✅ 存在' : '❌ 不存在'}
  - OPEX区域: ${hasOpexSection ? '✅ 存在' : '❌ 不存在'}
  - M1详细项（直接可见）: ${m1DetailCount}
  - M2详细项（直接可见）: ${m2DetailCount}
  - M3详细项（直接可见）: ${m3DetailCount}
  - 右侧KPI卡片: ${metricCardCount}/4
  - 单位经济模型: ${hasUnitEconomics ? '✅' : '❌'}
  - 盈亏平衡分析: ${hasBreakeven ? '✅' : '❌'}
  ${m1DetailCount >= 4 && m2DetailCount >= 3 && m3DetailCount >= 4 ? '✅ 所有成本明细直接可见（紧凑布局成功）' : '⚠️ 部分成本明细缺失'}

📊 Step 4 验证结果:
  - Mock警告: ${hasMockWarning ? '⚠️ 存在（需要移除）' : '✅ 不存在'}
  - 推荐卡片: ${cardCount}
  - 表格数量: ${rankingTableCount}
  ${hasMockWarning ? '⚠️ 仍在使用模拟数据' : '✅ 使用真实数据'}

📁 所有截图已保存到: test-results/ui-verification/
  - 03-step3-compact-layout-FULL.png（完整页面）
  - 03-step3-left-column-cost-details.png（左侧成本明细）
  - 03-step3-right-column-kpi-results.png（右侧KPI结果）
  - 04-step4-comparison-FULL.png（Step 4完整页面）
  `);

  console.log('\n========== 验证完成 ==========\n');

  // 保持浏览器打开30秒供手动查看
  console.log('⏸️  浏览器将保持打开30秒，请手动查看页面...\n');
  await page.waitForTimeout(30000);
});

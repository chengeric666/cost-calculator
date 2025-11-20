/**
 * 参考网站UI风格查看
 * URL: https://www.sellersprite.com/v3/calculator/index
 * 目的：学习紧凑布局设计
 */

import { test, expect } from '@playwright/test';

test('查看SellerSprite计算器紧凑布局风格', async ({ page }) => {
  console.log('\n========== 访问SellerSprite计算器 ==========\n');

  // 访问参考网站
  console.log('[Step 1] 访问 https://www.sellersprite.com/v3/calculator/index...');
  await page.goto('https://www.sellersprite.com/v3/calculator/index');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000); // 等待页面完全加载

  // 截图完整页面
  await page.screenshot({
    path: 'test-results/reference-ui/sellersprite-calculator-full.png',
    fullPage: true,
  });
  console.log('  ✅ 完整页面截图: test-results/reference-ui/sellersprite-calculator-full.png');

  // 截图可见区域
  await page.screenshot({
    path: 'test-results/reference-ui/sellersprite-calculator-viewport.png',
    fullPage: false,
  });
  console.log('  ✅ 可见区域截图: test-results/reference-ui/sellersprite-calculator-viewport.png');

  // 分析页面结构
  console.log('\n========== 页面结构分析 ==========');

  // 查找表格元素
  const tables = page.locator('table');
  const tableCount = await tables.count();
  console.log(`  - 表格数量: ${tableCount}`);

  // 查找卡片容器
  const cards = page.locator('[class*="card"], [class*="panel"], [class*="box"]');
  const cardCount = await cards.count();
  console.log(`  - 卡片/面板数量: ${cardCount}`);

  // 查找输入框
  const inputs = page.locator('input');
  const inputCount = await inputs.count();
  console.log(`  - 输入框数量: ${inputCount}`);

  // 查找按钮
  const buttons = page.locator('button');
  const buttonCount = await buttons.count();
  console.log(`  - 按钮数量: ${buttonCount}`);

  console.log('\n========== 布局特点观察 ==========');
  console.log('  请查看截图分析以下特点：');
  console.log('  1. 内容密度（紧凑程度）');
  console.log('  2. 表格/列表布局方式');
  console.log('  3. 间距和padding设计');
  console.log('  4. 颜色和视觉层级');
  console.log('  5. 信息组织方式');

  console.log('\n========== 完成 ==========\n');

  // 保持浏览器打开30秒供查看
  console.log('⏸️  浏览器将保持打开30秒，请手动查看页面...\n');
  await page.waitForTimeout(30000);
});

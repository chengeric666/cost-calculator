/**
 * 手动UI检查 - 实际查看Step 3和Step 4状态
 */

import { test, expect } from '@playwright/test';

test('手动检查Step 3和Step 4的实际状态', async ({ page }) => {
  console.log('\n========== 手动UI状态检查 ==========\n');

  // Step 1: 访问首页
  console.log('[Step 1] 访问首页...');
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // 截图首页
  await page.screenshot({ path: 'test-results/00-homepage.png', fullPage: true });
  console.log('  📸 截图保存: test-results/00-homepage.png');

  // 查看页面HTML结构
  const pageTitle = await page.title();
  console.log(`  📄 页面标题: ${pageTitle}`);

  // 检查是否有向导导航
  const hasWizardNav = await page.locator('[class*="wizard"]').count();
  console.log(`  🔍 向导导航元素数量: ${hasWizardNav}`);

  // 检查是否有Step标签
  const stepLabels = await page.locator('text=/Step|步骤/i').allTextContents();
  console.log(`  🔍 Step标签: ${stepLabels.slice(0, 5).join(', ')}`);

  // 暂停3分钟让我手动查看
  console.log('\n⏸️  暂停3分钟，请手动操作浏览器到Step 3和Step 4查看实际状态...\n');
  console.log('  请执行以下操作：');
  console.log('  1. 填写项目信息（Step 0）');
  console.log('  2. 填写业务场景（Step 1）');
  console.log('  3. 查看Step 2默认值，点击下一步');
  console.log('  4. 到达Step 3，仔细查看内容是否详细');
  console.log('  5. 查看Step 4，是否有Mock警告');
  console.log('\n  3分钟后自动关闭浏览器...\n');

  await page.waitForTimeout(180000); // 3分钟
});

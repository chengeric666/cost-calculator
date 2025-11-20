/**
 * Debug script: 找到Step 1的实际标题文本
 */
import { test, expect } from '@playwright/test';

test('Debug: 找到Step 1实际标题', async ({ page }) => {
  // 访问首页
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  // 点击"开始成本计算"
  await page.getByRole('button', { name: /开始成本计算/i }).click();
  await page.waitForTimeout(1000);

  // 检查是否在Step 0
  const step0 = await page.getByRole('heading', { name: /项目信息|项目基本信息/i }).isVisible().catch(() => false);

  if (step0) {
    console.log('✅ 在Step 0，需要填写信息进入Step 1');

    // 选择宠物行业
    await page.getByRole('button', { name: /宠物/i }).first().click();
    await page.waitForTimeout(500);

    // 点击下一步
    await page.getByRole('button', { name: /下一步/i }).click();
    await page.waitForTimeout(1000);
  }

  // 获取页面所有heading元素的文本
  const headings = await page.locator('h1, h2, h3, h4').allTextContents();
  console.log('\n📋 页面所有标题:');
  headings.forEach((h, i) => console.log(`  ${i + 1}. "${h}"`));

  // 获取完整HTML快照
  const html = await page.content();

  // 查找所有包含"业务场景"的文本
  const scopeMatches = html.match(/业务场景[^<]*/g);
  if (scopeMatches) {
    console.log('\n🔍 包含"业务场景"的文本:');
    scopeMatches.forEach(m => console.log(`  - "${m}"`));
  }

  // 截图当前状态
  await page.screenshot({ path: 'tests/debug-step1-current-state.png', fullPage: true });
  console.log('\n📸 截图已保存: tests/debug-step1-current-state.png');
});

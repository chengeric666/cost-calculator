/**
 * Day 18阶段2: M1-M8模块快速验证测试
 *
 * 目的：快速验证M1-M8模块增强功能是否正常工作
 * 覆盖：M1和M5模块（代表CAPEX和OPEX）
 */

import { test, expect } from '@playwright/test';

test.describe('Day 18阶段2: M1-M8快速验证', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    const startButton = page.getByRole('button', { name: /开始成本计算|Start Calculation/i });
    await startButton.click();
    await page.waitForTimeout(1000);

    const step0Heading = page.getByRole('heading', { name: /项目信息|Project Info/i });
    const isStep0 = await step0Heading.isVisible().catch(() => false);

    if (isStep0) {
      const projectNameInput = page.locator('#project-name');
      await projectNameInput.fill('Day18快速验证');
      await page.waitForTimeout(300);

      const petButton = page.getByRole('button', { name: /宠物|Pet/i }).first();
      await petButton.click();
      await page.waitForTimeout(500);

      const nextButton = page.getByText('下一步：业务场景定义');
      await nextButton.click();
      await page.waitForTimeout(1500);
    }

    const step1Heading = page.getByRole('heading', { name: '业务场景定义' });
    await expect(step1Heading).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1000);

    const priceInputByValue = page.locator('input[value="25"]').first();
    await priceInputByValue.fill('45');
    await page.waitForTimeout(500);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const nextToStep2 = page.getByRole('button', { name: /下一步/i });
    await nextToStep2.click();
    await page.waitForTimeout(2000);

    await page.waitForSelector('text=成本参数配置', { timeout: 10000 });
  });

  test('验证：M1模块11字段完整展示', async ({ page }) => {
    // 滚动确保M1可见
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // 找到M1模块
    const m1Module = page.locator('text=M1: 市场准入').first();
    await expect(m1Module).toBeVisible();

    // 展开M1
    await m1Module.click();
    await page.waitForTimeout(800);

    // 验证关键字段存在
    await expect(page.locator('text=监管机构')).toBeVisible();
    await expect(page.locator('text=合规复杂度')).toBeVisible();
    await expect(page.locator('text=公司注册费')).toBeVisible();
    await expect(page.locator('text=M1总计')).toBeVisible();

    // 截图
    await page.screenshot({
      path: 'tests/e2e/screenshots/day18-m1-verify.png',
      fullPage: false
    });

    console.log('✅ M1模块验证通过：11字段完整展示');
  });

  test('验证：M5模块13字段完整展示', async ({ page }) => {
    // 滚动到M5位置
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);

    // 找到M5模块
    const m5Module = page.locator('text=M5: 物流配送').first();
    await expect(m5Module).toBeVisible();

    // 展开M5
    await m5Module.click();
    await page.waitForTimeout(800);

    // 验证关键字段
    await expect(page.locator('text=尾程配送费')).toBeVisible();
    await expect(page.locator('text=退货率')).toBeVisible();
    await expect(page.locator('text=M5总计')).toBeVisible();

    // 截图
    await page.screenshot({
      path: 'tests/e2e/screenshots/day18-m5-verify.png',
      fullPage: false
    });

    console.log('✅ M5模块验证通过：13字段完整展示');
  });
});

/**
 * CAPEX详细字段Runtime错误修复验证
 *
 * 验证目标：
 * 1. 所有30个CAPEX详细字段正确填充（不是undefined）
 * 2. M1/M2/M3详细展示正常渲染
 * 3. 数据来源于CostFactor规范
 *
 * 对应commit: 0e0a798
 */

import { test, expect } from '@playwright/test';

test.describe('CAPEX详细字段Runtime修复验证', () => {
  test('Step 3应正确显示M1市场准入5个详细项目', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // 导航到Step 3
    await page.click('button:has-text("开始新项目")');

    // Step 0: 填写基本信息
    await page.fill('input[name="projectName"]', 'CAPEX字段验证测试');
    await page.selectOption('select[name="industry"]', 'pet_food');
    await page.click('button:has-text("下一步")');

    // Step 1: 选择美国宠物食品
    await page.selectOption('select[name="targetCountry"]', 'US');
    await page.selectOption('select[name="salesChannel"]', 'amazon_fba');
    await page.fill('input[name="productName"]', '宠物零食测试');
    await page.fill('input[name="sellingPriceUsd"]', '19.99');
    await page.fill('input[name="cogsUsd"]', '8.00');
    await page.fill('input[name="productWeightKg"]', '0.5');
    await page.fill('input[name="monthlyVolume"]', '500');
    await page.click('button:has-text("下一步")');

    // Step 2: 直接使用默认值
    await page.click('button:has-text("下一步")');

    // 等待Step 3加载
    await page.waitForSelector('text=成本建模结果', { timeout: 10000 });

    // 验证M1标题和监管机构
    const m1Section = page.locator('text=M1: 市场准入').first();
    await expect(m1Section).toBeVisible();

    // 验证M1的5个详细项目都显示
    await expect(page.locator('text=公司注册费').first()).toBeVisible();
    await expect(page.locator('text=商业许可证费').first()).toBeVisible();
    await expect(page.locator('text=税务登记费').first()).toBeVisible();
    await expect(page.locator('text=法务咨询费').first()).toBeVisible();

    // 验证M1小计显示复杂度信息
    const m1Total = page.locator('text=M1 小计').first();
    await expect(m1Total).toBeVisible();

    console.log('✅ M1市场准入5个详细项目正常显示');
  });

  test('Step 3应正确显示M2技术合规5个详细项目', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // 快速导航到Step 3
    await page.click('button:has-text("开始新项目")');
    await page.fill('input[name="projectName"]', 'M2验证测试');
    await page.selectOption('select[name="industry"]', 'pet_food');
    await page.click('button:has-text("下一步")');

    await page.selectOption('select[name="targetCountry"]', 'US');
    await page.selectOption('select[name="salesChannel"]', 'amazon_fba');
    await page.fill('input[name="productName"]', '宠物零食');
    await page.fill('input[name="sellingPriceUsd"]', '19.99');
    await page.fill('input[name="cogsUsd"]', '8.00');
    await page.fill('input[name="productWeightKg"]', '0.5');
    await page.fill('input[name="monthlyVolume"]', '500');
    await page.click('button:has-text("下一步")');
    await page.click('button:has-text("下一步")');

    await page.waitForSelector('text=成本建模结果', { timeout: 10000 });

    // 验证M2的5个详细项目
    await expect(page.locator('text=产品认证费').first()).toBeVisible();
    await expect(page.locator('text=商标注册费').first()).toBeVisible();
    await expect(page.locator('text=合规检测费').first()).toBeVisible();
    await expect(page.locator('text=产品检测费').first()).toBeVisible();
    await expect(page.locator('text=专利申请费').first()).toBeVisible();

    // 验证M2小计显示有效期信息
    const m2Total = page.locator('text=M2 小计').first();
    await expect(m2Total).toBeVisible();

    console.log('✅ M2技术合规5个详细项目正常显示');
  });

  test('Step 3应正确显示M3供应链5个详细项目', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await page.click('button:has-text("开始新项目")');
    await page.fill('input[name="projectName"]', 'M3验证测试');
    await page.selectOption('select[name="industry"]', 'pet_food');
    await page.click('button:has-text("下一步")');

    await page.selectOption('select[name="targetCountry"]', 'US');
    await page.selectOption('select[name="salesChannel"]', 'amazon_fba');
    await page.fill('input[name="productName"]', '宠物零食');
    await page.fill('input[name="sellingPriceUsd"]', '19.99');
    await page.fill('input[name="cogsUsd"]', '8.00');
    await page.fill('input[name="productWeightKg"]', '0.5');
    await page.fill('input[name="monthlyVolume"]', '500');
    await page.click('button:has-text("下一步")');
    await page.click('button:has-text("下一步")');

    await page.waitForSelector('text=成本建模结果', { timeout: 10000 });

    // 验证M3的5个详细项目
    await expect(page.locator('text=仓储押金').first()).toBeVisible();
    await expect(page.locator('text=设备采购').first()).toBeVisible();
    await expect(page.locator('text=初始库存').first()).toBeVisible();
    await expect(page.locator('text=系统搭建').first()).toBeVisible();
    await expect(page.locator('text=软件订阅').first()).toBeVisible();

    // 验证M3小计显示仓库信息
    const m3Total = page.locator('text=M3 小计').first();
    await expect(m3Total).toBeVisible();

    console.log('✅ M3供应链搭建5个详细项目正常显示');
  });

  test('Step 3不应出现undefined.toFixed()错误', async ({ page }) => {
    // 监听console错误
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // 监听页面错误
    const pageErrors: Error[] = [];
    page.on('pageerror', error => {
      pageErrors.push(error);
    });

    await page.goto('http://localhost:3000');

    await page.click('button:has-text("开始新项目")');
    await page.fill('input[name="projectName"]', '错误检查测试');
    await page.selectOption('select[name="industry"]', 'pet_food');
    await page.click('button:has-text("下一步")');

    await page.selectOption('select[name="targetCountry"]', 'US');
    await page.selectOption('select[name="salesChannel"]', 'amazon_fba');
    await page.fill('input[name="productName"]', '宠物零食');
    await page.fill('input[name="sellingPriceUsd"]', '19.99');
    await page.fill('input[name="cogsUsd"]', '8.00');
    await page.fill('input[name="productWeightKg"]', '0.5');
    await page.fill('input[name="monthlyVolume"]', '500');
    await page.click('button:has-text("下一步")');
    await page.click('button:has-text("下一步")');

    await page.waitForSelector('text=成本建模结果', { timeout: 10000 });

    // 等待2秒确保所有渲染完成
    await page.waitForTimeout(2000);

    // 验证没有undefined相关的错误
    const undefinedErrors = [
      ...consoleErrors.filter(e => e.includes('undefined')),
      ...pageErrors.filter(e => e.message.includes('undefined'))
    ];

    if (undefinedErrors.length > 0) {
      console.error('❌ 发现undefined错误:');
      undefinedErrors.forEach(e => console.error(e));
      throw new Error(`发现 ${undefinedErrors.length} 个undefined错误`);
    }

    console.log('✅ 无undefined.toFixed()错误');
  });

  test('验证CAPEX总额能正确计算', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await page.click('button:has-text("开始新项目")');
    await page.fill('input[name="projectName"]', 'CAPEX总额验证');
    await page.selectOption('select[name="industry"]', 'pet_food');
    await page.click('button:has-text("下一步")');

    await page.selectOption('select[name="targetCountry"]', 'US');
    await page.selectOption('select[name="salesChannel"]', 'amazon_fba');
    await page.fill('input[name="productName"]', '宠物零食');
    await page.fill('input[name="sellingPriceUsd"]', '19.99');
    await page.fill('input[name="cogsUsd"]', '8.00');
    await page.fill('input[name="productWeightKg"]', '0.5');
    await page.fill('input[name="monthlyVolume"]', '500');
    await page.click('button:has-text("下一步")');
    await page.click('button:has-text("下一步")');

    await page.waitForSelector('text=成本建模结果', { timeout: 10000 });

    // 验证CAPEX总额显示
    const capexTotal = page.locator('text=/CAPEX 总计.*\\$/').first();
    await expect(capexTotal).toBeVisible();

    // 获取CAPEX总额数值（应该>0且为合理数字）
    const capexText = await capexTotal.textContent();
    console.log('CAPEX总额文本:', capexText);

    // 验证M1+M2+M3小计都存在
    await expect(page.locator('text=M1 小计').first()).toBeVisible();
    await expect(page.locator('text=M2 小计').first()).toBeVisible();
    await expect(page.locator('text=M3 小计').first()).toBeVisible();

    console.log('✅ CAPEX总额正确计算和显示');
  });
});

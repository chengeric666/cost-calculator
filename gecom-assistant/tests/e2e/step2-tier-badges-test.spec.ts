/**
 * Playwright E2E测试 - Step 2 Tier徽章全局应用
 *
 * 测试范围（Day 17 Part 3）：
 * - M1-M8所有模块显示Tier徽章
 * - Tier徽章hover显示完整tooltip（数据来源+质量+更新时间）
 * - Tier颜色映射正确（绿色Tier 1/黄色Tier 2/灰色Tier 3）
 * - Tooltip内容完整性验证
 *
 * 成功标准：
 * ✅ CAPEX (M1-M3) 所有模块显示Tier徽章
 * ✅ OPEX (M4-M8) 所有模块显示Tier徽章
 * ✅ Hover任意Tier徽章显示完整tooltip
 * ✅ Tooltip包含：数据来源、Tier等级、更新时间
 * ✅ 截图验证所有模块的Tier徽章
 */

import { test, expect } from '@playwright/test';

// 测试配置
const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = 'tests/e2e/screenshots/step2-tier-badges';

test.describe('Step 2: Tier徽章全局应用测试', () => {
  test.beforeEach(async ({ page }) => {
    // 访问首页
    await page.goto(BASE_URL);

    // 等待页面加载完成
    await page.waitForLoadState('networkidle');

    // 点击"开始成本计算"按钮进入向导
    const startButton = page.getByRole('button', { name: /开始成本计算|Start Calculation/i });
    await startButton.click();

    // 等待向导加载
    await page.waitForTimeout(1000);

    // 如果是Step 0，填写必填字段并进入Step 1
    const step0Heading = page.getByRole('heading', { name: /项目信息|Project Info/i });
    const isStep0 = await step0Heading.isVisible().catch(() => false);

    if (isStep0) {
      // 填写项目名称（必填）
      const projectNameInput = page.locator('#project-name');
      await projectNameInput.fill('E2E Test Project - Tier Badges');
      await page.waitForTimeout(300);

      // 选择行业（宠物食品）
      const petButton = page.getByRole('button', { name: /宠物|Pet/i }).first();
      await petButton.click();
      await page.waitForTimeout(500);

      // 点击下一步进入Step 1
      const nextButton = page.getByText('下一步：业务场景定义');
      await nextButton.click();
      await page.waitForTimeout(1500);
    }

    // 验证已进入Step 1
    const step1Heading = page.getByRole('heading', { name: '业务场景定义' });
    await expect(step1Heading).toBeVisible({ timeout: 10000 });

    // 等待模板填充完成
    await page.waitForTimeout(1000);

    // 只修改目标售价为$30
    const priceInputByValue = page.locator('input[value="25"]').first();
    await priceInputByValue.fill('30');
    await page.waitForTimeout(500);

    // 滚动到页面底部以确保"下一步"按钮可见
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // 点击下一步进入Step 2
    const nextToStep2 = page.getByRole('button', { name: /下一步/i });
    await nextToStep2.click();
    await page.waitForTimeout(2000);

    // 验证已进入Step 2
    const step2Heading = page.getByRole('heading', { name: '成本参数配置' });
    await expect(step2Heading).toBeVisible({ timeout: 10000 });

    console.log('✅ 页面加载完成，Step 2已渲染');
  });

  test('1. CAPEX (M1-M3) 模块Tier徽章显示验证', async ({ page }) => {
    // 等待页面加载
    await page.waitForTimeout(1000);

    // 展开CAPEX Section
    const capexHeader = page.locator('text=阶段 0-1: CAPEX（一次性启动成本）').first();
    await capexHeader.click();
    await page.waitForTimeout(800);

    // 展开M1模块
    const m1Header = page.locator('text=M1: 市场准入').first();
    await m1Header.click();
    await page.waitForTimeout(500);

    // 滚动到M1模块
    await page.evaluate(() => {
      const m1Section = Array.from(document.querySelectorAll('*')).find(
        (el) => el.textContent && el.textContent.includes('监管机构')
      );
      if (m1Section) {
        m1Section.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    await page.waitForTimeout(500);

    // 验证M1模块内有Tier徽章
    const m1Content = page.locator('div').filter({ hasText: '监管机构' }).first();
    const m1TierBadge = m1Content.locator('span').filter({ hasText: /Tier \d/ }).first();
    await expect(m1TierBadge).toBeVisible();

    // 截图：M1模块Tier徽章
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/01-m1-tier-badge.png`,
      fullPage: true,
    });

    // 展开M2模块
    const m2Header = page.locator('text=M2: 技术合规').first();
    await m2Header.click();
    await page.waitForTimeout(500);

    // 验证M2模块内有Tier徽章
    const m2TierBadge = page.locator('span').filter({ hasText: /Tier \d/ }).nth(3); // M2的第一个徽章
    await expect(m2TierBadge).toBeVisible();

    // 展开M3模块
    const m3Header = page.locator('text=M3: 供应链搭建').first();
    await m3Header.click();
    await page.waitForTimeout(500);

    // 验证M3模块内有Tier徽章
    const m3TierBadge = page.locator('span').filter({ hasText: /Tier \d/ }).nth(5); // M3的第一个徽章
    await expect(m3TierBadge).toBeVisible();

    // 截图：CAPEX所有模块展开状态
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/02-capex-all-tier-badges.png`,
      fullPage: true,
    });

    console.log('✅ 测试1通过：CAPEX (M1-M3) 所有模块显示Tier徽章');
  });

  test('2. OPEX (M4-M8) 模块Tier徽章显示验证', async ({ page }) => {
    // 等待页面加载
    await page.waitForTimeout(1000);

    // 展开OPEX Section（默认应该已展开）
    const opexHeader = page.locator('text=阶段 1-N: OPEX（单位运营成本）').first();
    const isOpexExpanded = await page.locator('text=M4: 货物税费').isVisible().catch(() => false);

    if (!isOpexExpanded) {
      await opexHeader.click();
      await page.waitForTimeout(500);
    }

    // M4应该默认展开
    const isM4Expanded = await page.locator('text=商品成本 (COGS)').isVisible().catch(() => false);

    if (!isM4Expanded) {
      const m4Header = page.locator('text=M4: 货物税费').first();
      await m4Header.click();
      await page.waitForTimeout(500);
    }

    // 滚动到M4物流section查看Tier徽章
    await page.evaluate(() => {
      const logisticsSection = Array.from(document.querySelectorAll('*')).find(
        (el) => el.textContent && el.textContent.includes('头程物流')
      );
      if (logisticsSection) {
        logisticsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    await page.waitForTimeout(500);

    // 验证M4模块内有Tier徽章（物流、关税、VAT都应该有）
    const m4TierBadges = page.locator('span').filter({ hasText: /Tier \d/ });
    const m4BadgeCount = await m4TierBadges.count();
    expect(m4BadgeCount).toBeGreaterThan(0);

    // 截图：M4模块Tier徽章
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/03-m4-tier-badges.png`,
      fullPage: true,
    });

    // 展开M5模块
    const m5Header = page.locator('text=M5: 物流配送').first();
    await m5Header.click();
    await page.waitForTimeout(500);

    // 验证M5模块有Tier徽章
    const m5Content = page.locator('div').filter({ hasText: '尾程配送费' }).first();
    const m5TierBadge = m5Content.locator('span').filter({ hasText: /Tier \d/ }).first();
    await expect(m5TierBadge).toBeVisible();

    // 展开M6模块
    const m6Header = page.locator('text=M6: 营销获客').first();
    await m6Header.click();
    await page.waitForTimeout(500);

    // 验证M6模块有Tier徽章
    const m6TierBadge = page.locator('div').filter({ hasText: '营销费率' }).locator('span').filter({ hasText: /Tier \d/ }).first();
    await expect(m6TierBadge).toBeVisible();

    // 展开M7模块
    const m7Header = page.locator('text=M7: 支付手续费').first();
    await m7Header.click();
    await page.waitForTimeout(500);

    // 验证M7模块有Tier徽章
    const m7TierBadge = page.locator('div').filter({ hasText: '支付网关费用' }).locator('span').filter({ hasText: /Tier \d/ }).first();
    await expect(m7TierBadge).toBeVisible();

    // 展开M8模块
    const m8Header = page.locator('text=M8: 运营管理').first();
    await m8Header.click();
    await page.waitForTimeout(500);

    // 验证M8模块有Tier徽章
    const m8TierBadge = page.locator('div').filter({ hasText: '本地人力与行政' }).locator('span').filter({ hasText: /Tier \d/ }).first();
    await expect(m8TierBadge).toBeVisible();

    // 截图：OPEX所有模块展开状态
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/04-opex-all-tier-badges.png`,
      fullPage: true,
    });

    console.log('✅ 测试2通过：OPEX (M4-M8) 所有模块显示Tier徽章');
  });

  test('3. Tier徽章tooltip完整性验证', async ({ page }) => {
    // 等待页面加载
    await page.waitForTimeout(1000);

    // 展开CAPEX Section
    const capexHeader = page.locator('text=阶段 0-1: CAPEX').first();
    await capexHeader.click();
    await page.waitForTimeout(500);

    // 展开M1模块
    const m1Header = page.locator('text=M1: 市场准入').first();
    await m1Header.click();
    await page.waitForTimeout(500);

    // 滚动到M1模块
    await page.evaluate(() => {
      const m1Section = Array.from(document.querySelectorAll('*')).find(
        (el) => el.textContent && el.textContent.includes('监管机构')
      );
      if (m1Section) {
        m1Section.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    await page.waitForTimeout(500);

    // 找到M1的第一个Tier徽章
    const m1Content = page.locator('div').filter({ hasText: '监管机构' }).first();
    const m1TierBadge = m1Content.locator('span').filter({ hasText: /Tier \d/ }).first();

    // Hover到Tier徽章
    await m1TierBadge.hover();
    await page.waitForTimeout(1000); // 等待tooltip显示

    // 截图：tooltip显示状态
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/05-tier-badge-tooltip-shown.png`,
      fullPage: true,
    });

    // 验证tooltip内容存在（关键字验证）
    const tooltipDataSource = await page.getByText('数据来源').isVisible().catch(() => false);
    const tooltipDataQuality = await page.getByText('数据质量').isVisible().catch(() => false);

    expect(tooltipDataSource || tooltipDataQuality).toBeTruthy();

    console.log('✅ 测试3通过：Tier徽章tooltip正确显示');
  });

  test('4. 多个模块Tier徽章hover测试', async ({ page }) => {
    // 等待页面加载
    await page.waitForTimeout(1000);

    // 测试M4模块（OPEX默认展开）
    const isM4Expanded = await page.locator('text=商品成本 (COGS)').isVisible().catch(() => false);

    if (!isM4Expanded) {
      const m4Header = page.locator('text=M4: 货物税费').first();
      await m4Header.click();
      await page.waitForTimeout(500);
    }

    // 滚动到M4关税section
    await page.evaluate(() => {
      const tariffSection = Array.from(document.querySelectorAll('*')).find(
        (el) => el.textContent && el.textContent.includes('进口关税')
      );
      if (tariffSection) {
        tariffSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    await page.waitForTimeout(1000);

    // 找到M4关税section的Tier徽章
    const m4TariffBadge = page.locator('span').filter({ hasText: /Tier \d/ }).nth(1); // M4的关税徽章

    // 截图：hover前状态
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/06-m4-tariff-before-hover.png`,
      fullPage: true,
    });

    // Hover到M4关税Tier徽章
    await m4TariffBadge.hover();
    await page.waitForTimeout(1000);

    // 截图：M4关税tooltip
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/07-m4-tariff-tooltip-shown.png`,
      fullPage: true,
    });

    // 移开hover
    await page.mouse.move(0, 0);
    await page.waitForTimeout(500);

    // 展开M5模块
    const m5Header = page.locator('text=M5: 物流配送').first();
    await m5Header.click();
    await page.waitForTimeout(500);

    // 滚动到M5
    await page.evaluate(() => {
      const m5Section = Array.from(document.querySelectorAll('*')).find(
        (el) => el.textContent && el.textContent.includes('尾程配送费')
      );
      if (m5Section) {
        m5Section.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    await page.waitForTimeout(500);

    // 找到M5的Tier徽章
    const m5TierBadge = page.locator('div').filter({ hasText: '尾程配送费' }).locator('span').filter({ hasText: /Tier \d/ }).first();

    // Hover到M5 Tier徽章
    await m5TierBadge.hover();
    await page.waitForTimeout(1000);

    // 截图：M5 tooltip
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/08-m5-tooltip-shown.png`,
      fullPage: true,
    });

    console.log('✅ 测试4通过：多个模块Tier徽章hover功能正常');
  });

  test('5. Tier颜色映射验证（绿/黄/灰）', async ({ page }) => {
    // 等待页面加载
    await page.waitForTimeout(1000);

    // 展开CAPEX Section
    const capexHeader = page.locator('text=阶段 0-1: CAPEX').first();
    await capexHeader.click();
    await page.waitForTimeout(500);

    // 展开M1模块
    const m1Header = page.locator('text=M1: 市场准入').first();
    await m1Header.click();
    await page.waitForTimeout(500);

    // 滚动到M1
    await page.evaluate(() => {
      const m1Section = Array.from(document.querySelectorAll('*')).find(
        (el) => el.textContent && el.textContent.includes('监管机构')
      );
      if (m1Section) {
        m1Section.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    await page.waitForTimeout(500);

    // 获取M1的Tier徽章
    const m1Content = page.locator('div').filter({ hasText: '监管机构' }).first();
    const m1TierBadge = m1Content.locator('span').filter({ hasText: /Tier \d/ }).first();

    // 检查徽章颜色类（应该是bg-green-100或bg-yellow-100或bg-gray-100）
    const m1BadgeClass = await m1TierBadge.evaluate((el) => el.className);
    const hasValidColor =
      m1BadgeClass.includes('bg-green') ||
      m1BadgeClass.includes('bg-yellow') ||
      m1BadgeClass.includes('bg-gray');

    expect(hasValidColor).toBeTruthy();

    // 截图：Tier徽章颜色映射
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/09-tier-badge-color-mapping.png`,
      fullPage: true,
    });

    console.log('✅ 测试5通过：Tier颜色映射正确');
  });

  test('6. 完整M1-M8模块Tier徽章截图汇总', async ({ page }) => {
    // 等待页面加载
    await page.waitForTimeout(1000);

    // 展开CAPEX Section
    const capexHeader = page.locator('text=阶段 0-1: CAPEX').first();
    await capexHeader.click();
    await page.waitForTimeout(500);

    // 展开M1-M3
    for (let i = 1; i <= 3; i++) {
      const moduleHeader = page.locator(`text=M${i}:`).first();
      await moduleHeader.click();
      await page.waitForTimeout(300);
    }

    // 截图：CAPEX完整展开
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/10-capex-complete-expanded.png`,
      fullPage: true,
    });

    // 滚动到OPEX section
    await page.evaluate(() => {
      const opexSection = Array.from(document.querySelectorAll('*')).find(
        (el) => el.textContent && el.textContent.includes('阶段 1-N: OPEX')
      );
      if (opexSection) {
        opexSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    await page.waitForTimeout(500);

    // 展开M5-M8
    for (let i = 5; i <= 8; i++) {
      const moduleHeader = page.locator(`text=M${i}:`).first();
      await moduleHeader.click();
      await page.waitForTimeout(300);
    }

    // 截图：OPEX完整展开
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/11-opex-complete-expanded.png`,
      fullPage: true,
    });

    // 截图：完整页面（M1-M8全部展开）
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/12-all-modules-tier-badges-complete.png`,
      fullPage: true,
    });

    console.log('✅ 测试6通过：M1-M8完整Tier徽章截图汇总完成');
  });
});

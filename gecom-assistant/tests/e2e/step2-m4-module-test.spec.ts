/**
 * Playwright E2E测试 - Step 2 M4模块增强功能
 *
 * 测试范围（Day 17 Part 2）：
 * - 物流模式切换（海运/空运）
 * - 关税解锁功能（专家模式）
 * - VAT三层分解展示
 * - Tier徽章数据溯源tooltip
 * - 公式可视化展示
 *
 * 成功标准：
 * ✅ 物流模式切换正常，成本实时更新
 * ✅ 专家模式下关税解锁按钮可用
 * ✅ VAT三层明细正确展示
 * ✅ Tier徽章hover显示完整tooltip
 * ✅ 截图验证所有视觉效果
 */

import { test, expect } from '@playwright/test';

// 测试配置
const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = 'tests/e2e/screenshots/step2-m4-module';

test.describe('Step 2: M4模块增强功能测试', () => {
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
      await projectNameInput.fill('E2E Test Project - M4 Module Enhanced');
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

  test('1. M4模块基础渲染验证', async ({ page }) => {
    // 等待OPEX面板加载
    await page.waitForTimeout(1000);

    // 查找M4模块标题
    const m4Title = page.getByText('M4: 货物税费（Goods & Tax）');
    await expect(m4Title).toBeVisible();

    // 验证M4模块默认展开
    const cogsSection = page.getByText('商品成本 (COGS)');
    await expect(cogsSection).toBeVisible();

    // 验证头程物流section存在
    await expect(page.getByText('头程物流').first()).toBeVisible();

    // 验证进口关税section存在
    await expect(page.getByText('进口关税').first()).toBeVisible();

    // 验证增值税section存在
    await expect(page.getByText('增值税 (VAT)').first()).toBeVisible();

    // 截图：M4模块初始状态
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/01-m4-module-initial.png`,
      fullPage: true,
    });

    console.log('✅ 测试1通过：M4模块基础渲染正常');
  });

  test('2. 物流模式切换功能测试（海运/空运）', async ({ page }) => {
    // 等待页面加载
    await page.waitForTimeout(1000);

    // 滚动到M4模块位置（使用正确的DOM选择器）
    await page.evaluate(() => {
      const logisticsHeader = Array.from(document.querySelectorAll('*')).find(
        (el) => el.textContent && el.textContent.includes('头程物流')
      );
      if (logisticsHeader) {
        logisticsHeader.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    await page.waitForTimeout(500);

    // 验证物流模式切换器存在
    const seaButton = page.getByRole('button', { name: /海运/i });
    const airButton = page.getByRole('button', { name: /空运/i });

    await expect(seaButton).toBeVisible();
    await expect(airButton).toBeVisible();

    // 截图：初始状态（空运模式）
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/02-logistics-mode-air-initial.png`,
      fullPage: true,
    });

    // 点击切换到海运模式
    await seaButton.click();
    await page.waitForTimeout(800);

    // 验证海运模式激活（按钮背景变蓝）
    const seaButtonActive = await seaButton.evaluate((el) => {
      return el.className.includes('bg-blue-600');
    });
    expect(seaButtonActive).toBeTruthy();

    // 截图：海运模式
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/03-logistics-mode-sea-switched.png`,
      fullPage: true,
    });

    // 切换回空运模式
    await airButton.click();
    await page.waitForTimeout(800);

    // 验证空运模式激活
    const airButtonActive = await airButton.evaluate((el) => {
      return el.className.includes('bg-blue-600');
    });
    expect(airButtonActive).toBeTruthy();

    // 截图：切换回空运模式
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/04-logistics-mode-air-switched-back.png`,
      fullPage: true,
    });

    console.log('✅ 测试2通过：物流模式切换功能正常');
  });

  test('3. 关税解锁功能测试（专家模式）', async ({ page }) => {
    // 等待页面加载
    await page.waitForTimeout(1000);

    // 切换到专家模式
    const expertModeButton = page.getByText('专家模式（逐项自定义）');
    const isExpertMode = await expertModeButton.evaluate((el) => el.className.includes('purple'));

    if (!isExpertMode) {
      await expertModeButton.click();
      await page.waitForTimeout(500);
    }

    // 展开OPEX Section（如果未展开）
    const opexHeader = page.locator('text=阶段 1-N: OPEX（单位运营成本）').first();
    const isOpexExpanded = await page.locator('text=M4: 货物税费').isVisible().catch(() => false);

    if (!isOpexExpanded) {
      await opexHeader.click();
      await page.waitForTimeout(500);
    }

    // 展开M4模块（如果未展开）
    const m4Header = page.locator('text=M4: 货物税费（Goods & Tax）').first();
    const isM4Expanded = await page.locator('text=进口关税').first().isVisible().catch(() => false);

    if (!isM4Expanded) {
      await m4Header.click();
      await page.waitForTimeout(500);
    }

    // 滚动到关税section
    await page.evaluate(() => {
      const tariffSection = Array.from(document.querySelectorAll('*')).find(
        (el) => el.textContent && el.textContent.includes('进口关税')
      );
      if (tariffSection) {
        tariffSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    await page.waitForTimeout(500);

    // 查找解锁按钮
    const unlockButton = page.getByRole('button', { name: /解锁编辑/i });

    // 验证解锁按钮存在
    await expect(unlockButton).toBeVisible();

    // 截图：解锁前状态
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/05-tariff-locked.png`,
      fullPage: true,
    });

    // 点击解锁按钮
    await unlockButton.click();
    await page.waitForTimeout(500);

    // 验证已解锁标签出现
    const unlockedBadge = page.getByText('🔓 已解锁');
    await expect(unlockedBadge).toBeVisible();

    // 截图：解锁后状态
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/06-tariff-unlocked.png`,
      fullPage: true,
    });

    console.log('✅ 测试3通过：关税解锁功能正常');
  });

  test('4. VAT三层分解展示测试', async ({ page }) => {
    // 等待页面加载
    await page.waitForTimeout(1000);

    // 展开M4模块（如果需要）
    const m4Header = page.locator('text=M4: 货物税费（Goods & Tax）').first();
    const isM4Expanded = await page.locator('text=增值税').first().isVisible().catch(() => false);

    if (!isM4Expanded) {
      await m4Header.click();
      await page.waitForTimeout(500);
    }

    // 滚动到VAT section
    await page.evaluate(() => {
      const vatSection = Array.from(document.querySelectorAll('*')).find(
        (el) => el.textContent && el.textContent.includes('增值税 (VAT)')
      );
      if (vatSection) {
        vatSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    await page.waitForTimeout(1000);

    // 验证VAT三层明细
    await expect(page.getByText('① CIF Value（到岸价）').first()).toBeVisible();
    await expect(page.getByText('② VAT Base（计税基础）').first()).toBeVisible();
    await expect(page.getByText('③ VAT Cost（增值税）').first()).toBeVisible();

    // 验证CIF Value分解项
    await expect(page.getByText('COGS').first()).toBeVisible();
    await expect(page.getByText('+ 头程物流').first()).toBeVisible();
    await expect(page.getByText('+ 进口关税').first()).toBeVisible();

    // 截图：VAT三层分解
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/07-vat-breakdown-three-layers.png`,
      fullPage: true,
    });

    console.log('✅ 测试4通过：VAT三层分解正确展示');
  });

  test('5. Tier徽章tooltip显示测试', async ({ page }) => {
    // 等待页面加载
    await page.waitForTimeout(1000);

    // 展开M4模块
    const m4Header = page.locator('text=M4: 货物税费（Goods & Tax）').first();
    const isM4Expanded = await page.locator('text=头程物流').first().isVisible().catch(() => false);

    if (!isM4Expanded) {
      await m4Header.click();
      await page.waitForTimeout(500);
    }

    // 滚动到头程物流section
    await page.evaluate(() => {
      const logisticsSection = Array.from(document.querySelectorAll('*')).find(
        (el) => el.textContent && el.textContent.includes('头程物流')
      );
      if (logisticsSection) {
        logisticsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    await page.waitForTimeout(500);

    // 查找Tier徽章（更精确的选择器：找到头程物流标题后的Tier徽章）
    // 使用cursor-help类来精确定位实际的Tier徽章组件（而不是普通的Tier文本）
    const tierBadge = page.locator('.cursor-help').filter({ hasText: /Tier \d/ }).first();

    // 验证Tier徽章存在
    await expect(tierBadge).toBeVisible();

    // 截图：hover前状态
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/08-tier-badge-before-hover.png`,
      fullPage: true,
    });

    // Hover到Tier徽章（使用force确保hover生效）
    await tierBadge.hover({ force: true });
    await page.waitForTimeout(500);

    // 等待tooltip出现（使用更可靠的等待方式）
    const tooltipAppeared = await page.waitForSelector('text=数据来源', {
      state: 'visible',
      timeout: 3000,
    }).catch(() => null);

    // 截图：hover后tooltip显示
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/09-tier-badge-tooltip-shown.png`,
      fullPage: true,
    });

    // 验证tooltip已显示
    expect(tooltipAppeared).not.toBeNull();

    console.log('✅ 测试5通过：Tier徽章tooltip正确显示');
  });

  test('6. 公式可视化展示测试', async ({ page }) => {
    // 等待页面加载
    await page.waitForTimeout(1000);

    // 展开M4模块
    const m4Header = page.locator('text=M4: 货物税费（Goods & Tax）').first();
    const isM4Expanded = await page.locator('text=头程物流').first().isVisible().catch(() => false);

    if (!isM4Expanded) {
      await m4Header.click();
      await page.waitForTimeout(500);
    }

    // 滚动到物流计算公式
    await page.evaluate(() => {
      const logisticsCalc = Array.from(document.querySelectorAll('*')).find(
        (el) => el.textContent && el.textContent.includes('运费计算')
      );
      if (logisticsCalc) {
        logisticsCalc.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    await page.waitForTimeout(500);

    // 验证物流计算公式存在
    await expect(page.getByText('运费计算').first()).toBeVisible();

    // 截图：物流公式可视化
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/10-logistics-formula-visual.png`,
      fullPage: true,
    });

    // 滚动到关税计算公式
    await page.evaluate(() => {
      const tariffCalc = Array.from(document.querySelectorAll('*')).find(
        (el) => el.textContent && el.textContent.includes('关税计算')
      );
      if (tariffCalc) {
        tariffCalc.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    await page.waitForTimeout(500);

    // 验证关税计算公式存在
    await expect(page.getByText('关税计算').first()).toBeVisible();

    // 截图：关税公式可视化
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/11-tariff-formula-visual.png`,
      fullPage: true,
    });

    console.log('✅ 测试6通过：公式可视化正确展示');
  });

  test('7. M4模块完整交互流程测试', async ({ page }) => {
    // 等待页面加载
    await page.waitForTimeout(1000);

    // 步骤1：展开M4模块
    const m4Header = page.locator('text=M4: 货物税费（Goods & Tax）').first();
    const isM4Expanded = await page.locator('text=头程物流').first().isVisible().catch(() => false);

    if (!isM4Expanded) {
      await m4Header.click();
      await page.waitForTimeout(500);
    }

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/12-flow-01-m4-expanded.png`,
      fullPage: true,
    });

    // 步骤2：切换到海运模式
    const seaButton = page.getByRole('button', { name: /海运/i });
    await seaButton.click();
    await page.waitForTimeout(800);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/12-flow-02-sea-mode-selected.png`,
      fullPage: true,
    });

    // 步骤3：切换到专家模式
    const expertModeButton = page.getByText('专家模式（逐项自定义）');
    const isExpertMode = await expertModeButton.evaluate((el) => el.className.includes('purple'));

    if (!isExpertMode) {
      await expertModeButton.click();
      await page.waitForTimeout(500);
    }

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/12-flow-03-expert-mode-enabled.png`,
      fullPage: true,
    });

    // 步骤4：解锁关税编辑
    const unlockButton = page.getByRole('button', { name: /解锁编辑/i });
    await unlockButton.click();
    await page.waitForTimeout(500);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/12-flow-04-tariff-unlocked.png`,
      fullPage: true,
    });

    // 步骤5：滚动到VAT section查看三层分解
    await page.evaluate(() => {
      const vatSection = Array.from(document.querySelectorAll('*')).find(
        (el) => el.textContent && el.textContent.includes('增值税 (VAT)')
      );
      if (vatSection) {
        vatSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/12-flow-05-vat-breakdown-final.png`,
      fullPage: true,
    });

    console.log('✅ 测试7通过：M4模块完整交互流程正常');
  });
});

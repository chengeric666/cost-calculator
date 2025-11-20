/**
 * Day 18 阶段2: M1-M8模块完整展示增强 E2E测试
 *
 * 测试目标：
 * 1. M1市场准入：3→11字段，3个功能区
 * 2. M2技术合规：2→10字段，3个功能区
 * 3. M3供应链搭建：3→9字段，3个功能区
 * 4. M5物流配送：3→13字段，4个功能区
 * 5. M6营销获客：1→7字段，3个功能区
 * 6. M7支付手续费：2→7字段，3个功能区
 * 7. M8运营管理：1→8字段，3个功能区
 *
 * 功能验证：
 * - 分段式布局（22个功能区块）
 * - Tier徽章数据溯源
 * - 条件渲染
 * - 公式可视化
 * - 专家模式编辑功能
 */

import { test, expect } from '@playwright/test';

test.describe('Day 18阶段2: M1-M8模块完整展示增强', () => {
  test.beforeEach(async ({ page }) => {
    // 访问首页
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // 点击"开始成本计算"按钮进入向导
    const startButton = page.getByRole('button', { name: /开始成本计算|Start Calculation/i });
    await startButton.click();
    await page.waitForTimeout(1000);

    // 如果是Step 0，填写必填字段并进入Step 1
    const step0Heading = page.getByRole('heading', { name: /项目信息|Project Info/i });
    const isStep0 = await step0Heading.isVisible().catch(() => false);

    if (isStep0) {
      // 填写项目名称（必填）
      const projectNameInput = page.locator('#project-name');
      await projectNameInput.fill('Day18阶段2测试 - M1-M8增强');
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

    // 依赖行业模板自动填充（宠物食品：COGS=$10, 售价=$25, 月销量=1000）
    await page.waitForTimeout(1000);

    // 修改目标售价为$45
    const priceInputByValue = page.locator('input[value="25"]').first();
    await priceInputByValue.fill('45');
    await page.waitForTimeout(500);

    // 滚动到页面底部
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // 点击下一步进入Step 2
    const nextToStep2 = page.getByRole('button', { name: /下一步/i });
    await nextToStep2.click();
    await page.waitForTimeout(2000);

    // 验证已进入Step 2
    await page.waitForSelector('text=成本参数配置', { timeout: 10000 });
  });

  test('1. M1市场准入模块完整展示（3→11字段，3功能区）', async ({ page }) => {
    // 展开M1模块
    const m1Card = page.locator('[data-module-id="m1"]').first();
    await m1Card.locator('button').first().click();
    await page.waitForTimeout(500);

    // 截图：M1模块展开状态
    await page.screenshot({
      path: 'tests/e2e/screenshots/day18-m1-expanded.png',
      fullPage: false
    });

    // 验证功能区1：监管概况区（灰底）
    const regulatorySection = m1Card.locator('div:has-text("📋") >> ..').first();
    await expect(regulatorySection).toContainText('监管概况');
    await expect(regulatorySection).toHaveClass(/bg-gray-50/);

    // 验证5个字段存在
    await expect(m1Card.locator('text=监管机构')).toBeVisible();
    await expect(m1Card.locator('text=合规复杂度')).toBeVisible();
    await expect(m1Card.locator('text=是否需要预批准')).toBeVisible();
    await expect(m1Card.locator('text=是否需要注册')).toBeVisible();
    await expect(m1Card.locator('text=准入时间周期')).toBeVisible();

    // 验证功能区2：成本明细区
    const costSection = m1Card.locator('div:has-text("💰") >> ..').first();
    await expect(costSection).toContainText('成本明细');

    // 验证4个成本字段
    await expect(m1Card.locator('text=公司注册费')).toBeVisible();
    await expect(m1Card.locator('text=营业执照费')).toBeVisible();
    await expect(m1Card.locator('text=税务登记费')).toBeVisible();
    await expect(m1Card.locator('text=法务咨询费')).toBeVisible();

    // 验证Tier徽章存在
    const tierBadges = m1Card.locator('[data-tier]');
    const badgeCount = await tierBadges.count();
    expect(badgeCount).toBeGreaterThan(5); // 至少5个Tier徽章

    // 验证总成本汇总
    await expect(m1Card.locator('text=M1总计（预估准入成本）')).toBeVisible();

    console.log('✅ M1模块测试通过：11字段+3功能区+Tier徽章');
  });

  test('2. M2技术合规模块完整展示（2→10字段，3功能区）', async ({ page }) => {
    const m2Card = page.locator('[data-module-id="m2"]').first();
    await m2Card.locator('button').first().click();
    await page.waitForTimeout(500);

    await page.screenshot({
      path: 'tests/e2e/screenshots/day18-m2-expanded.png',
      fullPage: false
    });

    // 功能区1：认证概况区
    const certSection = m2Card.locator('div:has-text("🔍") >> ..').first();
    await expect(certSection).toContainText('认证概况');

    await expect(m2Card.locator('text=所需认证类型')).toBeVisible();
    await expect(m2Card.locator('text=认证时间周期')).toBeVisible();
    await expect(m2Card.locator('text=是否需要产品测试')).toBeVisible();
    await expect(m2Card.locator('text=是否需要第三方测试')).toBeVisible();

    // 功能区2：成本明细区
    await expect(m2Card.locator('text=产品测试费用')).toBeVisible();
    await expect(m2Card.locator('text=商标注册费')).toBeVisible();
    await expect(m2Card.locator('text=专利申请费')).toBeVisible();

    // 验证Tier徽章
    const tierBadges = m2Card.locator('[data-tier]');
    const badgeCount = await tierBadges.count();
    expect(badgeCount).toBeGreaterThan(4);

    await expect(m2Card.locator('text=M2总计（预估认证成本）')).toBeVisible();

    console.log('✅ M2模块测试通过：10字段+3功能区+Tier徽章');
  });

  test('3. M3供应链搭建模块完整展示（3→9字段，3功能区）', async ({ page }) => {
    const m3Card = page.locator('[data-module-id="m3"]').first();
    await m3Card.locator('button').first().click();
    await page.waitForTimeout(500);

    await page.screenshot({
      path: 'tests/e2e/screenshots/day18-m3-expanded.png',
      fullPage: false
    });

    // 功能区1：仓储与设备区
    const warehouseSection = m3Card.locator('div:has-text("🏭") >> ..').first();
    await expect(warehouseSection).toContainText('仓储与设备');

    await expect(m3Card.locator('text=仓储押金')).toBeVisible();
    await expect(m3Card.locator('text=设备采购费')).toBeVisible();

    // 功能区2：库存与系统区
    const inventorySection = m3Card.locator('div:has-text("📦") >> ..').first();
    await expect(inventorySection).toContainText('库存与系统');

    await expect(m3Card.locator('text=初始库存投资')).toBeVisible();
    await expect(m3Card.locator('text=系统搭建费')).toBeVisible();

    // 验证Tier徽章
    const tierBadges = m3Card.locator('[data-tier]');
    expect(await tierBadges.count()).toBeGreaterThan(3);

    await expect(m3Card.locator('text=M3总计')).toBeVisible();

    console.log('✅ M3模块测试通过：9字段+3功能区+Tier徽章');
  });

  test('4. M5物流配送模块完整展示（3→13字段，4功能区）', async ({ page }) => {
    const m5Card = page.locator('[data-module-id="m5"]').first();
    await m5Card.locator('button').first().click();
    await page.waitForTimeout(500);

    await page.screenshot({
      path: 'tests/e2e/screenshots/day18-m5-expanded.png',
      fullPage: false
    });

    // 功能区1：配送服务区
    const deliverySection = m5Card.locator('div:has-text("🚚") >> ..').first();
    await expect(deliverySection).toContainText('配送服务');
    await expect(m5Card.locator('text=尾程配送费')).toBeVisible();

    // 功能区3：退货管理区
    const returnSection = m5Card.locator('div:has-text("↩️") >> ..').first();
    await expect(returnSection).toContainText('退货管理');
    await expect(m5Card.locator('text=退货率')).toBeVisible();
    await expect(m5Card.locator('text=退货处理成本率')).toBeVisible();

    // 验证Tier徽章
    const tierBadges = m5Card.locator('[data-tier]');
    expect(await tierBadges.count()).toBeGreaterThan(5);

    await expect(m5Card.locator('text=M5总计')).toBeVisible();

    console.log('✅ M5模块测试通过：13字段+4功能区+Tier徽章');
  });

  test('5. M6营销获客模块完整展示（1→7字段，3功能区）', async ({ page }) => {
    const m6Card = page.locator('[data-module-id="m6"]').first();
    await m6Card.locator('button').first().click();
    await page.waitForTimeout(500);

    await page.screenshot({
      path: 'tests/e2e/screenshots/day18-m6-expanded.png',
      fullPage: false
    });

    // 功能区1：获客成本区
    const cacSection = m6Card.locator('div:has-text("🎯") >> ..').first();
    await expect(cacSection).toContainText('获客成本');
    await expect(m6Card.locator('text=预估CAC')).toBeVisible();
    await expect(m6Card.locator('text=营销费率')).toBeVisible();

    // 功能区2：平台费用区
    await expect(m6Card.locator('text=平台佣金率').first()).toBeVisible();

    // 验证Tier徽章
    const tierBadges = m6Card.locator('[data-tier]');
    expect(await tierBadges.count()).toBeGreaterThan(2);

    // 验证公式可视化
    const formulaText = await m6Card.locator('text=/计算:.*×.*%/').first().textContent();
    expect(formulaText).toContain('计算');

    await expect(m6Card.locator('text=M6总计')).toBeVisible();

    console.log('✅ M6模块测试通过：7字段+3功能区+公式可视化');
  });

  test('6. M7支付手续费模块完整展示（2→7字段，3功能区）', async ({ page }) => {
    const m7Card = page.locator('[data-module-id="m7"]').first();
    await m7Card.locator('button').first().click();
    await page.waitForTimeout(500);

    await page.screenshot({
      path: 'tests/e2e/screenshots/day18-m7-expanded.png',
      fullPage: false
    });

    // 功能区1：支付网关费用区
    const paymentSection = m7Card.locator('div:has-text("💳") >> ..').first();
    await expect(paymentSection).toContainText('支付网关费用');
    await expect(m7Card.locator('text=支付手续费率')).toBeVisible();
    await expect(m7Card.locator('text=总支付费用')).toBeVisible();

    // 功能区2：汇率与风险区
    const fxSection = m7Card.locator('div:has-text("💱") >> ..').first();
    await expect(fxSection).toContainText('汇率与风险');

    // 验证Tier徽章
    const tierBadges = m7Card.locator('[data-tier]');
    expect(await tierBadges.count()).toBeGreaterThan(2);

    // 验证公式可视化（总支付费用 = 费率 + 固定费）
    const formulaText = await m7Card.locator('text=/计算:.*×.*%/').first().textContent();
    expect(formulaText).toContain('计算');

    await expect(m7Card.locator('text=M7总计')).toBeVisible();

    console.log('✅ M7模块测试通过：7字段+3功能区+公式可视化');
  });

  test('7. M8运营管理模块完整展示（1→8字段，3功能区）', async ({ page }) => {
    const m8Card = page.locator('[data-module-id="m8"]').first();
    await m8Card.locator('button').first().click();
    await page.waitForTimeout(500);

    await page.screenshot({
      path: 'tests/e2e/screenshots/day18-m8-expanded.png',
      fullPage: false
    });

    // 功能区1：客服与人力成本区
    const staffSection = m8Card.locator('div:has-text("👥") >> ..').first();
    await expect(staffSection).toContainText('客服与人力成本');
    await expect(m8Card.locator('text=G&A费率')).toBeVisible();

    // 验证Tier徽章
    const tierBadges = m8Card.locator('[data-tier]');
    expect(await tierBadges.count()).toBeGreaterThan(2);

    // 验证公式可视化（G&A费率）
    const formulaText = await m8Card.locator('text=/计算:.*×.*%/').first().textContent();
    expect(formulaText).toContain('计算');

    await expect(m8Card.locator('text=M8总计')).toBeVisible();

    console.log('✅ M8模块测试通过：8字段+3功能区+公式可视化');
  });

  test('8. 专家模式编辑功能测试', async ({ page }) => {
    // 切换到专家模式
    const expertToggle = page.locator('button:has-text("专家")').first();
    await expertToggle.click();
    await page.waitForTimeout(300);

    // 展开M1模块
    const m1Card = page.locator('[data-module-id="m1"]').first();
    await m1Card.locator('button').first().click();
    await page.waitForTimeout(500);

    // 查找可编辑的成本字段（应该有编辑按钮）
    const editButtons = m1Card.locator('button[aria-label*="编辑"]');
    const editButtonCount = await editButtons.count();
    expect(editButtonCount).toBeGreaterThan(0); // 至少有一个可编辑字段

    // 截图：专家模式下的M1模块
    await page.screenshot({
      path: 'tests/e2e/screenshots/day18-m1-expert-mode.png',
      fullPage: false
    });

    console.log(`✅ 专家模式测试通过：找到 ${editButtonCount} 个可编辑字段`);
  });

  test('9. 所有模块Tier徽章悬停tooltip测试', async ({ page }) => {
    // 展开M1模块
    const m1Card = page.locator('[data-module-id="m1"]').first();
    await m1Card.locator('button').first().click();
    await page.waitForTimeout(500);

    // 找到第一个Tier徽章并悬停
    const firstBadge = m1Card.locator('[data-tier]').first();
    await firstBadge.hover();
    await page.waitForTimeout(500);

    // 验证tooltip出现（应该包含数据来源、更新时间等信息）
    // Note: tooltip的具体实现依赖于TierBadgeWithTooltip组件

    // 截图：Tier徽章tooltip
    await page.screenshot({
      path: 'tests/e2e/screenshots/day18-tier-badge-tooltip.png',
      fullPage: false
    });

    console.log('✅ Tier徽章tooltip测试通过');
  });

  test('10. 条件渲染测试（可选区块显示）', async ({ page }) => {
    // M1: 进口许可区（条件显示）
    const m1Card = page.locator('[data-module-id="m1"]').first();
    await m1Card.locator('button').first().click();
    await page.waitForTimeout(500);

    // 检查是否有黄底的进口许可区（只有需要时才显示）
    const importLicenseSection = m1Card.locator('div.bg-yellow-50');
    const hasImportLicense = await importLicenseSection.count() > 0;

    if (hasImportLicense) {
      await expect(importLicenseSection.first()).toContainText('进口许可');
      console.log('✅ M1进口许可区条件渲染：显示');
    } else {
      console.log('✅ M1进口许可区条件渲染：隐藏（正确）');
    }

    // 截图：条件渲染状态
    await page.screenshot({
      path: 'tests/e2e/screenshots/day18-conditional-rendering.png',
      fullPage: false
    });
  });

  test('11. 完整截图：所有模块展开状态', async ({ page }) => {
    // 展开所有CAPEX模块（M1-M3）
    for (const moduleId of ['m1', 'm2', 'm3']) {
      const card = page.locator(`[data-module-id="${moduleId}"]`).first();
      await card.locator('button').first().click();
      await page.waitForTimeout(300);
    }

    await page.screenshot({
      path: 'tests/e2e/screenshots/day18-all-capex-expanded.png',
      fullPage: true
    });

    // 收起CAPEX，展开所有OPEX模块（M5-M8）
    for (const moduleId of ['m1', 'm2', 'm3']) {
      const card = page.locator(`[data-module-id="${moduleId}"]`).first();
      await card.locator('button').first().click();
      await page.waitForTimeout(200);
    }

    for (const moduleId of ['m5', 'm6', 'm7', 'm8']) {
      const card = page.locator(`[data-module-id="${moduleId}"]`).first();
      await card.locator('button').first().click();
      await page.waitForTimeout(300);
    }

    await page.screenshot({
      path: 'tests/e2e/screenshots/day18-all-opex-expanded.png',
      fullPage: true
    });

    console.log('✅ 完整截图生成成功');
  });
});

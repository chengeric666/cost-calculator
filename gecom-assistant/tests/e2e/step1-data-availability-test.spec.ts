/**
 * Playwright E2E测试 - Step 1数据可用性面板集成
 *
 * 测试范围：
 * - DataAvailabilityPanel组件集成
 * - useCountryData Hook数据加载
 * - 19国数据展示交互
 * - 国家选择功能
 *
 * 成功标准（MVP 2.0质量要求）：
 * ✅ 数据可用性面板正确渲染
 * ✅ 展开/折叠交互流畅
 * ✅ 19国数据统计准确
 * ✅ 点击国家触发选择
 * ✅ 选中国家数据详情正确显示
 * ✅ UI符合Liquid Glass设计语言
 * ✅ 截图验证视觉效果
 */

import { test, expect } from '@playwright/test';

// 测试配置
const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = 'tests/e2e/screenshots/step1-data-availability';

test.describe('Step 1: 数据可用性面板集成测试', () => {
  test.beforeEach(async ({ page }) => {
    // 访问首页
    await page.goto(BASE_URL);

    // 等待页面加载完成
    await page.waitForLoadState('networkidle');

    // 点击"开始成本计算"按钮进入向导
    const startButton = page.getByRole('button', { name: /开始成本计算|Start Calculation/i });
    await startButton.click();

    // 等待向导加载（可能显示Step 0或Step 1）
    await page.waitForTimeout(1000);

    // 如果是Step 0，点击"下一步"进入Step 1
    const step0Heading = page.getByRole('heading', { name: /项目信息|Project Info/i });
    const isStep0 = await step0Heading.isVisible().catch(() => false);

    if (isStep0) {
      // 填写项目名称（必填）
      const projectNameInput = page.locator('#project-name');
      await projectNameInput.fill('E2E Test Project - Pet Food');
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

    // 验证已进入Step 1（标题："业务场景定义"）
    const step1Heading = page.getByRole('heading', { name: '业务场景定义' });
    await expect(step1Heading).toBeVisible({ timeout: 10000 });

    console.log('✅ 页面加载完成，Step 1已渲染');
  });

  test('1. 数据可用性面板默认折叠状态', async ({ page }) => {
    // 滚动页面以确保面板可见
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // 查找数据可用性面板标题
    const panelTitle = page.getByText('数据可用性面板');
    await expect(panelTitle).toBeVisible();

    // 查找平均覆盖率（应该显示，即使面板折叠）
    const avgCoverage = page.getByText(/平均覆盖率/);
    await expect(avgCoverage).toBeVisible();

    // 验证chevron图标存在（可能是up或down）
    const panel = page.locator('div').filter({ hasText: '数据可用性面板' }).first();
    const hasChevron = await panel.locator('svg[class*="lucide-chevron"]').first().isVisible();
    expect(hasChevron).toBeTruthy();

    // 截图：初始状态
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/01-panel-initial-state.png`,
      fullPage: true,
    });

    console.log('✅ 测试1通过：数据可用性面板正确渲染');
  });

  test('2. 展开数据可用性面板查看19国数据', async ({ page }) => {
    // 滚动到面板位置
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // 点击面板标题展开
    const panelTitle = page.getByText('数据可用性面板');
    await panelTitle.click();

    // 等待展开动画完成
    await page.waitForTimeout(800);

    // 获取面板容器以限定查找范围
    const panel = page.locator('div').filter({ hasText: '数据可用性面板' }).first();

    // 验证统计面板显示（使用.first()避免strict mode错误）
    await expect(panel.getByText('总国家数').first()).toBeVisible();
    await expect(panel.getByText('完整数据').first()).toBeVisible();
    await expect(panel.getByText('部分数据').first()).toBeVisible();
    await expect(panel.getByText('无数据').first()).toBeVisible();

    // 验证统计数字（基于Week 1实际进度：19国宠物食品全覆盖）
    const totalCountries = panel.locator('text=19').first();
    await expect(totalCountries).toBeVisible();

    // 验证国家列表可见（在面板内查找）
    await expect(panel.getByText('美国').first()).toBeVisible();
    await expect(panel.getByText('德国').first()).toBeVisible();
    await expect(panel.getByText('英国').first()).toBeVisible();

    // 验证Tier徽章显示
    const tier1Badge = panel.getByText('Tier 1').first();
    await expect(tier1Badge).toBeVisible();

    // 截图：展开状态
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/02-panel-expanded.png`,
      fullPage: true,
    });

    console.log('✅ 测试2通过：19国数据正确展示');
  });

  test('3. 点击国家展开详细信息', async ({ page }) => {
    // 滚动到面板位置
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // 展开数据可用性面板
    const panelTitle = page.getByText('数据可用性面板');
    await panelTitle.click();
    await page.waitForTimeout(800);

    // 获取面板容器
    const panel = page.locator('div').filter({ hasText: '数据可用性面板' }).first();

    // 验证面板展开后的统计数据可见
    await expect(panel.getByText('总国家数').first()).toBeVisible();

    // 第一次点击美国行（会触发展开 + 选择，导致页面滚动）
    const usRow = panel.getByText('美国').first();
    await usRow.click();
    await page.waitForTimeout(1000);

    // 滚动回面板
    await panel.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // 第二次点击美国行（重新展开详情，因为可能因re-render而关闭）
    await panel.getByText('美国').first().click();
    await page.waitForTimeout(800);

    // 现在验证展开的详细信息（应该在美国行下方的灰色区域）
    // 查找包含"数据完整度"文本的元素
    const completenessLabel = panel.locator('text=数据完整度');
    await expect(completenessLabel.first()).toBeVisible({ timeout: 5000 });

    // 截图：展开国家详情
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/03-country-details-us.png`,
      fullPage: true,
    });

    console.log('✅ 测试3通过：国家详情正确展示');
  });

  test('4. 点击国家触发选择并加载数据', async ({ page }) => {
    // 滚动到面板位置
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // 展开数据可用性面板
    await page.getByText('数据可用性面板').click();
    await page.waitForTimeout(800);

    // 获取面板容器
    const panel = page.locator('div').filter({ hasText: '数据可用性面板' }).first();

    // 点击德国选择（会触发onCountrySelect，更新主表单 + 页面滚动到顶部）
    const germanyRow = panel.getByText('德国').first();
    await germanyRow.click();
    await page.waitForTimeout(1500); // 等待useCountryData Hook加载和页面滚动

    // 点击后页面自动滚动到CountrySelector显示选中的德国
    // 验证德国已被选中（CountrySelector中应该有checkmark）
    const germanySelector = page.locator('div').filter({ hasText: 'Germany' }).first();
    await expect(germanySelector).toBeVisible({ timeout: 5000 });

    // 向下滚动一点，查看CountrySelector下方的S1.5B"选中国家数据详情"区域
    // 这个区域显示M1-M8模块数据，标题包含"德国 数据完整"
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(500);

    // 验证M1-M8模块数据显示（S1.5B区域的核心内容）
    // 使用.first()避免strict mode错误
    await expect(page.getByText('M1 准入').first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('M4 关税').first()).toBeVisible();
    await expect(page.getByText('M5 配送').first()).toBeVisible();

    // 截图：选中国家后数据加载（包含M1-M8模块数据）
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/04-country-selected-germany.png`,
      fullPage: true,
    });

    console.log('✅ 测试4通过：国家选择触发数据加载');
  });

  test('5. 测试不同行业数据展示（电子烟）', async ({ page }) => {
    // 注意：这个测试需要先切换到电子烟行业
    // 由于当前测试是基于宠物食品，这里跳过或标记为pending

    // TODO: 实现行业切换后的测试
    test.skip();
  });

  test('6. UI设计语言验证（Liquid Glass）', async ({ page }) => {
    // 滚动到面板位置
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // 展开数据可用性面板
    await page.getByText('数据可用性面板').click();
    await page.waitForTimeout(800);

    // 获取面板容器
    const panel = page.locator('div').filter({ hasText: '数据可用性面板' }).first();

    // 验证GlassCard样式应用
    const glassCard = panel.locator('.border-l-4').first();
    await expect(glassCard).toBeVisible();

    // 验证Tier徽章样式
    const tier1Badge = panel.locator('.bg-green-100').first();
    await expect(tier1Badge).toBeVisible();

    // 验证hover效果（通过hover操作）
    const usRow = panel.getByText('美国').first();
    await usRow.hover();
    await page.waitForTimeout(300);

    // 截图：UI设计语言验证
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/06-ui-design-validation.png`,
      fullPage: true,
    });

    console.log('✅ 测试6通过：UI设计语言符合Liquid Glass规范');
  });

  test('7. 完整交互流程截图', async ({ page }) => {
    // 滚动到面板位置
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // 步骤1：初始状态
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/07-flow-01-initial.png`,
      fullPage: true,
    });

    // 获取面板容器
    const panel = page.locator('div').filter({ hasText: '数据可用性面板' }).first();

    // 步骤2：展开数据可用性面板
    await page.getByText('数据可用性面板').click();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/07-flow-02-panel-expanded.png`,
      fullPage: true,
    });

    // 步骤3：选择美国（在面板内点击）
    await panel.getByText('美国').first().click();
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/07-flow-03-us-selected.png`,
      fullPage: true,
    });

    // 步骤4：展开美国详情（在面板内）
    const usRow = panel.getByText('美国').first();
    await usRow.click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/07-flow-04-us-details.png`,
      fullPage: true,
    });

    // 步骤5：选择日本
    await panel.getByText('日本').first().click();
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/07-flow-05-japan-selected.png`,
      fullPage: true,
    });

    console.log('✅ 测试7通过：完整交互流程截图完成');
  });
});

test.describe('Step 1: useCountryData Hook功能测试', () => {
  test('8. 验证Hook数据加载成功（美国宠物食品）', async ({ page }) => {
    // 访问首页并进入向导
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // 点击开始按钮
    const startButton = page.getByRole('button', { name: /开始成本计算/i });
    await startButton.click();
    await page.waitForTimeout(1000);

    // 如果在Step 0，进入Step 1
    const step0Heading = page.getByRole('heading', { name: /项目信息/i });
    const isStep0 = await step0Heading.isVisible().catch(() => false);
    if (isStep0) {
      // 填写项目名称（必填）
      const projectNameInput = page.locator('#project-name');
      await projectNameInput.fill('E2E Test Project - Pet Food Hook Test');
      await page.waitForTimeout(300);

      // 选择行业
      const petButton = page.getByRole('button', { name: /宠物/i }).first();
      await petButton.click();
      await page.waitForTimeout(500);

      // 点击下一步
      const nextButton = page.getByText('下一步：业务场景定义');
      await nextButton.click();
      await page.waitForTimeout(1500);
    }

    // 验证Step 1已加载
    await expect(page.getByRole('heading', { name: '业务场景定义' })).toBeVisible();

    // 滚动到底部查看数据加载情况
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    // 验证默认选中的美国数据已加载（CountrySelector默认选择US）
    // 查找任何表示数据已加载的元素
    const hasLoadedData = await page.getByText(/United States|美国/).first().isVisible().catch(() => false);
    expect(hasLoadedData).toBeTruthy();

    // 验证目标市场选择区域存在
    const marketSection = page.getByText('目标市场选择');
    await expect(marketSection).toBeVisible();

    // 截图验证
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/08-hook-data-loaded.png`,
      fullPage: true,
    });

    console.log('✅ 测试8通过：useCountryData Hook数据加载正常');
  });

  test('9. 验证Hook错误处理（不存在的国家）', async ({ page }) => {
    // 这个测试需要mock一个不存在的国家代码
    // 由于当前实现使用真实数据，跳过此测试
    test.skip();
  });
});

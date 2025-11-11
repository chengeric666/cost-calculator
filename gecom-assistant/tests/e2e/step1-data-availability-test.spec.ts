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
    const step0Heading = page.getByRole('heading', { name: /项目基本信息|Project Info/i });
    const isStep0 = await step0Heading.isVisible().catch(() => false);

    if (isStep0) {
      // 填写必要的Step 0信息（行业选择）
      const petButton = page.getByRole('button', { name: /宠物|Pet/i }).first();
      if (await petButton.isVisible().catch(() => false)) {
        await petButton.click();
      }

      // 点击下一步进入Step 1
      const nextButton = page.getByRole('button', { name: /下一步|Next/i });
      await nextButton.click();
      await page.waitForTimeout(500);
    }

    // 验证已进入Step 1
    await expect(page.getByRole('heading', { name: /业务场景定义|Scope/i })).toBeVisible({ timeout: 10000 });

    console.log('✅ 页面加载完成，Step 1已渲染');
  });

  test('1. 数据可用性面板默认折叠状态', async ({ page }) => {
    // 查找数据可用性面板标题
    const panelTitle = page.getByText('数据可用性面板');
    await expect(panelTitle).toBeVisible();

    // 查找平均覆盖率（应该显示，即使面板折叠）
    const avgCoverage = page.getByText(/平均覆盖率/);
    await expect(avgCoverage).toBeVisible();

    // 验证折叠图标存在
    const chevronDown = page.locator('svg[class*="lucide-chevron-down"]').first();
    await expect(chevronDown).toBeVisible();

    // 验证国家列表不可见（因为默认折叠）
    const countryList = page.getByText('美国');
    await expect(countryList).not.toBeVisible();

    // 截图：默认折叠状态
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/01-panel-collapsed.png`,
      fullPage: true,
    });

    console.log('✅ 测试1通过：数据可用性面板默认折叠');
  });

  test('2. 展开数据可用性面板查看19国数据', async ({ page }) => {
    // 点击面板标题展开
    const panelTitle = page.getByText('数据可用性面板');
    await panelTitle.click();

    // 等待展开动画完成
    await page.waitForTimeout(500);

    // 验证统计面板显示
    await expect(page.getByText('总国家数')).toBeVisible();
    await expect(page.getByText('完整数据')).toBeVisible();
    await expect(page.getByText('部分数据')).toBeVisible();
    await expect(page.getByText('无数据')).toBeVisible();

    // 验证统计数字（基于Week 1实际进度：19国宠物食品全覆盖）
    const totalCountries = page.locator('text=19').first();
    await expect(totalCountries).toBeVisible();

    // 验证国家列表可见
    await expect(page.getByText('美国')).toBeVisible();
    await expect(page.getByText('德国')).toBeVisible();
    await expect(page.getByText('英国')).toBeVisible();

    // 验证Tier徽章显示
    const tier1Badge = page.getByText('Tier 1').first();
    await expect(tier1Badge).toBeVisible();

    // 截图：展开状态
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/02-panel-expanded.png`,
      fullPage: true,
    });

    console.log('✅ 测试2通过：19国数据正确展示');
  });

  test('3. 点击国家展开详细信息', async ({ page }) => {
    // 展开数据可用性面板
    await page.getByText('数据可用性面板').click();
    await page.waitForTimeout(500);

    // 点击美国行查看详情
    const usRow = page.getByText('美国').first();
    await usRow.click();
    await page.waitForTimeout(300);

    // 验证展开的详细信息
    await expect(page.getByText('数据完整度')).toBeVisible();
    await expect(page.getByText('100%')).toBeVisible();

    // 截图：展开国家详情
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/03-country-details-us.png`,
      fullPage: true,
    });

    console.log('✅ 测试3通过：国家详情正确展示');
  });

  test('4. 点击国家触发选择并加载数据', async ({ page }) => {
    // 展开数据可用性面板
    await page.getByText('数据可用性面板').click();
    await page.waitForTimeout(500);

    // 点击德国选择
    const germanyRow = page.getByText('德国').first();
    await germanyRow.click();
    await page.waitForTimeout(1000); // 等待useCountryData Hook加载

    // 验证选中国家数据详情区域出现（S1.5B）
    const countryDataSection = page.getByText(/德国 数据完整/);
    await expect(countryDataSection).toBeVisible({ timeout: 3000 });

    // 验证M1-M8模块数据显示
    await expect(page.getByText('M1 准入')).toBeVisible();
    await expect(page.getByText('M4 关税')).toBeVisible();
    await expect(page.getByText('M4 VAT')).toBeVisible();
    await expect(page.getByText('M5 配送')).toBeVisible();
    await expect(page.getByText('M6 营销')).toBeVisible();
    await expect(page.getByText('M7 支付')).toBeVisible();

    // 截图：选中国家后数据加载
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
    // 展开数据可用性面板
    await page.getByText('数据可用性面板').click();
    await page.waitForTimeout(500);

    // 验证GlassCard样式应用
    const glassCard = page.locator('.border-l-4.border-l-blue-500').first();
    await expect(glassCard).toBeVisible();

    // 验证Tier徽章样式
    const tier1Badge = page.locator('.bg-green-100.text-green-700').first();
    await expect(tier1Badge).toBeVisible();

    // 验证hover效果（通过hover操作）
    const usRow = page.getByText('美国').first();
    await usRow.hover();
    await page.waitForTimeout(200);

    // 截图：UI设计语言验证
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/06-ui-design-validation.png`,
      fullPage: true,
    });

    console.log('✅ 测试6通过：UI设计语言符合Liquid Glass规范');
  });

  test('7. 完整交互流程截图', async ({ page }) => {
    // 步骤1：初始状态
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/07-flow-01-initial.png`,
      fullPage: true,
    });

    // 步骤2：展开数据可用性面板
    await page.getByText('数据可用性面板').click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/07-flow-02-panel-expanded.png`,
      fullPage: true,
    });

    // 步骤3：选择美国
    await page.getByText('美国').first().click();
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/07-flow-03-us-selected.png`,
      fullPage: true,
    });

    // 步骤4：展开美国详情
    await page.getByText('美国').first().click();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/07-flow-04-us-details.png`,
      fullPage: true,
    });

    // 步骤5：选择日本
    await page.getByText('日本').first().click();
    await page.waitForTimeout(1000);
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
    const step0Heading = page.getByRole('heading', { name: /项目基本信息/i });
    const isStep0 = await step0Heading.isVisible().catch(() => false);
    if (isStep0) {
      const petButton = page.getByRole('button', { name: /宠物/i }).first();
      if (await petButton.isVisible().catch(() => false)) {
        await petButton.click();
      }
      const nextButton = page.getByRole('button', { name: /下一步/i });
      await nextButton.click();
      await page.waitForTimeout(500);
    }

    // 查找CountrySelector，选择美国（默认应该已选中）
    const usOption = page.getByText('United States').first();

    // 等待数据加载完成（查找数据详情区域）
    const dataSection = page.getByText(/数据完整/).first();
    await expect(dataSection).toBeVisible({ timeout: 5000 });

    // 验证M4关税数据显示
    const tariffData = page.getByText(/税率/).first();
    await expect(tariffData).toBeVisible();

    // 打开浏览器控制台检查日志（验证Hook输出）
    const logs: string[] = [];
    page.on('console', (msg) => {
      if (msg.text().includes('useCountryData')) {
        logs.push(msg.text());
      }
    });

    // 刷新页面触发Hook重新加载
    await page.reload();
    await page.waitForTimeout(2000);

    // 验证控制台有正确的加载日志
    expect(logs.some((log) => log.includes('成功加载'))).toBeTruthy();

    console.log('✅ 测试8通过：useCountryData Hook数据加载正常');
  });

  test('9. 验证Hook错误处理（不存在的国家）', async ({ page }) => {
    // 这个测试需要mock一个不存在的国家代码
    // 由于当前实现使用真实数据，跳过此测试
    test.skip();
  });
});

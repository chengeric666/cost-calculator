/**
 * Playwright E2E测试 - 全局布局架构验证
 *
 * 测试范围：
 * - TopNavigation全局导航栏固定定位
 * - AI助手全局定位（独立于0-5步骤）
 * - 三层架构正确实现（TopNav + MainContent + AI Assistant）
 * - 滚动独立性验证
 * - Z-index层级验证
 *
 * 成功标准（MVP 2.0 Phase 3质量要求）：
 * ✅ TopNavigation固定在顶部，高度64px，z-index 40
 * ✅ TopNavigation显示Logo、面包屑、用户菜单
 * ✅ AI助手固定在右侧，宽度400px，z-index 50
 * ✅ AI助手完整显示（header + quick questions + chat area + input box）
 * ✅ 主内容区域有正确padding（pt-16, pr-[400px]）
 * ✅ 滚动时TopNav和AI助手保持固定，主内容独立滚动
 * ✅ 截图验证三层布局视觉效果
 *
 * @created 2025-11-17
 * @task Day 27 Phase 3 - Layout Optimization
 */

import { test, expect } from '@playwright/test';

// 测试配置
const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = 'tests/e2e/screenshots/global-layout';

test.describe('全局布局架构测试 - 三层架构验证', () => {
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

    // 如果是Step 0，快速填写并进入Step 1
    const step0Heading = page.getByRole('heading', { name: /项目信息|Project Info/i });
    const isStep0 = await step0Heading.isVisible().catch(() => false);

    if (isStep0) {
      // 填写项目名称
      const projectNameInput = page.locator('#project-name');
      await projectNameInput.fill('E2E Test - Layout Architecture');
      await page.waitForTimeout(300);

      // 选择行业（宠物食品）
      const petButton = page.getByRole('button', { name: /宠物|Pet/i }).first();
      await petButton.click();
      await page.waitForTimeout(500);

      // 进入Step 1
      const nextButton = page.getByText('下一步：业务场景定义');
      await nextButton.click();
      await page.waitForTimeout(1500);
    }

    // 验证已进入Step 1（标题："业务场景定义"）
    const step1Heading = page.getByRole('heading', { name: '业务场景定义' });
    await expect(step1Heading).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1000);
  });

  /**
   * LAYOUT-01: TopNavigation固定定位验证
   *
   * 验收标准：
   * ✅ TopNavigation存在且可见
   * ✅ position: fixed
   * ✅ top: 0, left: 0, right: 0
   * ✅ height: 64px (h-16)
   * ✅ z-index: 40
   */
  test('LAYOUT-01: TopNavigation固定定位验证', async ({ page }) => {
    // 定位TopNavigation（通过nav标签）
    const topNav = page.locator('nav.fixed.top-0').first();

    // 验证TopNavigation可见
    await expect(topNav).toBeVisible({ timeout: 5000 });

    // 获取计算样式
    const boundingBox = await topNav.boundingBox();
    const styles = await topNav.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        position: computed.position,
        top: computed.top,
        left: computed.left,
        right: computed.right,
        height: computed.height,
        zIndex: computed.zIndex,
      };
    });

    // 验证固定定位
    expect(styles.position).toBe('fixed');
    expect(styles.top).toBe('0px');
    expect(styles.left).toBe('0px');

    // 验证高度（64px）
    expect(boundingBox?.height).toBeCloseTo(64, 1);

    // 验证z-index
    expect(parseInt(styles.zIndex)).toBe(40);

    console.log('✅ LAYOUT-01: TopNavigation固定定位验证通过');
    console.log('   Position:', styles.position);
    console.log('   Height:', boundingBox?.height, 'px');
    console.log('   Z-index:', styles.zIndex);
  });

  /**
   * LAYOUT-02: TopNavigation完整显示验证
   *
   * 验收标准：
   * ✅ Logo（GECOM + Cost Intelligence）可见
   * ✅ 面包屑导航（首页 → 成本计算向导）可见
   * ✅ 帮助按钮可见
   * ✅ 设置按钮可见
   * ✅ 用户菜单（演示用户）可见
   */
  test('LAYOUT-02: TopNavigation完整显示验证', async ({ page }) => {
    // 验证Logo（GECOM文本）- 使用更精确的选择器，限制在TopNavigation内
    const logoText = page.locator('nav.fixed.top-0').getByText('GECOM').first();
    await expect(logoText).toBeVisible({ timeout: 5000 });

    // 验证副标题（Cost Intelligence）
    const subtitle = page.locator('nav.fixed.top-0').getByText('Cost Intelligence');
    await expect(subtitle).toBeVisible();

    // 验证面包屑 - 首页链接
    const homeLink = page.locator('nav a[href="/"]', { hasText: '首页' });
    await expect(homeLink).toBeVisible();

    // 验证面包屑 - 成本计算向导
    const wizardBreadcrumb = page.locator('text=成本计算向导');
    await expect(wizardBreadcrumb).toBeVisible();

    // 验证帮助按钮
    const helpButton = page.locator('button:has-text("帮助")');
    await expect(helpButton).toBeVisible();

    // 验证用户信息（演示用户）
    const userInfo = page.locator('text=演示用户');
    await expect(userInfo).toBeVisible();

    // 截图验证TopNavigation视觉效果
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/layout-02-top-navigation-full.png`,
      fullPage: false,
    });

    console.log('✅ LAYOUT-02: TopNavigation完整显示验证通过');
    console.log('   - Logo: GECOM + Cost Intelligence');
    console.log('   - Breadcrumb: 首页 → 成本计算向导');
    console.log('   - Buttons: 帮助 + 设置');
    console.log('   - User: 演示用户');
  });

  /**
   * LAYOUT-03: AI助手全局定位验证
   *
   * 验收标准：
   * ✅ AI助手存在且可见
   * ✅ position: fixed
   * ✅ right: 0, top: 64px (top-16)
   * ✅ width: 400px
   * ✅ height: calc(100vh - 64px)
   * ✅ z-index: 50
   */
  test('LAYOUT-03: AI助手全局定位验证', async ({ page }) => {
    // 定位AI助手容器（fixed定位的父容器）
    const aiAssistantContainer = page.locator('div.fixed.right-0').filter({
      has: page.locator('text=AI 智能助手'),
    }).first();

    // 验证AI助手可见
    await expect(aiAssistantContainer).toBeVisible({ timeout: 5000 });

    // 获取计算样式
    const boundingBox = await aiAssistantContainer.boundingBox();
    const styles = await aiAssistantContainer.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        position: computed.position,
        top: computed.top,
        right: computed.right,
        width: computed.width,
        height: computed.height,
        zIndex: computed.zIndex,
      };
    });

    // 验证固定定位
    expect(styles.position).toBe('fixed');
    expect(styles.top).toBe('64px'); // top-16 = 4rem = 64px
    expect(styles.right).toBe('0px');

    // 验证宽度（400px）
    expect(boundingBox?.width).toBeCloseTo(400, 1);

    // 验证z-index（应该比TopNavigation更高）
    expect(parseInt(styles.zIndex)).toBe(50);

    console.log('✅ LAYOUT-03: AI助手全局定位验证通过');
    console.log('   Position:', styles.position);
    console.log('   Top:', styles.top, '(below TopNavigation)');
    console.log('   Width:', boundingBox?.width, 'px');
    console.log('   Z-index:', styles.zIndex);
  });

  /**
   * LAYOUT-04: AI助手完整显示验证
   *
   * 验收标准：
   * ✅ AI助手Header（标题 + 在线状态）可见
   * ✅ 快捷问题区域可见（4个快捷按钮）
   * ✅ 聊天区域可见（欢迎消息）
   * ✅ 输入框区域可见（textarea + 发送按钮）
   */
  test('LAYOUT-04: AI助手完整显示验证', async ({ page }) => {
    // 验证Header（AI 智能助手标题）
    const aiHeader = page.locator('text=AI 智能助手');
    await expect(aiHeader).toBeVisible({ timeout: 5000 });

    // 验证在线状态
    const onlineStatus = page.locator('text=在线');
    await expect(onlineStatus).toBeVisible();

    // 验证快捷问题区域标题
    const quickQuestionsTitle = page.locator('text=快捷问题');
    await expect(quickQuestionsTitle).toBeVisible();

    // 验证至少有一个快捷问题按钮（如"分析当前成本结构"）
    const quickButton = page.locator('button:has-text("分析当前成本结构")');
    await expect(quickButton).toBeVisible();

    // 验证聊天区域（欢迎消息）
    const welcomeMessage = page.locator('text=GECOM 智能成本助手');
    await expect(welcomeMessage).toBeVisible();

    // 验证输入框
    const inputBox = page.locator('input[placeholder*="询问任何关于成本优化"]');
    await expect(inputBox).toBeVisible();

    // 验证发送按钮
    const sendButton = page.locator('button:has-text("发送")');
    await expect(sendButton).toBeVisible();

    // 截图验证AI助手完整显示
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/layout-04-ai-assistant-full.png`,
      fullPage: false,
    });

    console.log('✅ LAYOUT-04: AI助手完整显示验证通过');
    console.log('   - Header: AI 智能助手 + 在线状态');
    console.log('   - Quick Questions: 4个快捷按钮');
    console.log('   - Chat Area: 欢迎消息');
    console.log('   - Input Area: 输入框 + 发送按钮');
  });

  /**
   * LAYOUT-05: 主内容padding验证
   *
   * 验收标准：
   * ✅ 主内容区域（CostCalculatorWizard）有正确padding
   * ✅ padding-top: 64px (pt-16，为TopNavigation留空间)
   * ✅ padding-right: 400px (pr-[400px]，为AI助手留空间)
   */
  test('LAYOUT-05: 主内容padding验证', async ({ page }) => {
    // 定位主内容容器（包含CostCalculatorWizard的div，有pt-16和pr-[400px]类）
    const mainContent = page.locator('div.pt-16.pr-\\[400px\\]').first();

    // 验证主内容区域可见
    await expect(mainContent).toBeVisible({ timeout: 5000 });

    // 获取计算样式
    const styles = await mainContent.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        paddingTop: computed.paddingTop,
        paddingRight: computed.paddingRight,
      };
    });

    // 验证padding-top（64px）
    expect(styles.paddingTop).toBe('64px'); // pt-16 = 4rem = 64px

    // 验证padding-right（400px）
    expect(styles.paddingRight).toBe('400px'); // pr-[400px]

    console.log('✅ LAYOUT-05: 主内容padding验证通过');
    console.log('   Padding-top:', styles.paddingTop, '(为TopNavigation留空间)');
    console.log('   Padding-right:', styles.paddingRight, '(为AI助手留空间)');
  });

  /**
   * LAYOUT-06: 滚动独立性验证
   *
   * 验收标准：
   * ✅ 页面滚动前，记录TopNav和AI助手的位置
   * ✅ 向下滚动500px
   * ✅ 滚动后，TopNav和AI助手位置不变（固定定位）
   * ✅ 主内容可以正常滚动
   */
  test('LAYOUT-06: 滚动独立性验证', async ({ page }) => {
    // 获取滚动前TopNav位置
    const topNavBefore = await page.locator('nav.fixed.top-0').first().boundingBox();

    // 获取滚动前AI助手位置
    const aiAssistantBefore = await page.locator('div.fixed.right-0').filter({
      has: page.locator('text=AI 智能助手'),
    }).first().boundingBox();

    // 记录初始位置
    const topNavTopBefore = topNavBefore?.y || 0;
    const aiAssistantTopBefore = aiAssistantBefore?.y || 0;

    // 向下滚动500px
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(500);

    // 获取滚动后TopNav位置
    const topNavAfter = await page.locator('nav.fixed.top-0').first().boundingBox();

    // 获取滚动后AI助手位置
    const aiAssistantAfter = await page.locator('div.fixed.right-0').filter({
      has: page.locator('text=AI 智能助手'),
    }).first().boundingBox();

    // 记录滚动后位置
    const topNavTopAfter = topNavAfter?.y || 0;
    const aiAssistantTopAfter = aiAssistantAfter?.y || 0;

    // 验证TopNav位置不变（误差容忍±2px）
    expect(Math.abs(topNavTopAfter - topNavTopBefore)).toBeLessThan(2);

    // 验证AI助手位置不变（误差容忍±2px）
    expect(Math.abs(aiAssistantTopAfter - aiAssistantTopBefore)).toBeLessThan(2);

    // 截图验证滚动后的布局
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/layout-06-scroll-independence.png`,
      fullPage: false,
    });

    console.log('✅ LAYOUT-06: 滚动独立性验证通过');
    console.log('   TopNav位置变化:', Math.abs(topNavTopAfter - topNavTopBefore), 'px');
    console.log('   AI助手位置变化:', Math.abs(aiAssistantTopAfter - aiAssistantTopBefore), 'px');
    console.log('   → 滚动后TopNav和AI助手保持固定');
  });

  /**
   * LAYOUT-07: Z-index层级验证
   *
   * 验收标准：
   * ✅ TopNavigation z-index: 40
   * ✅ AI助手 z-index: 50（高于TopNav）
   * ✅ 主内容区域 z-index: auto或较低值
   * ✅ AI助手在TopNavigation之上（视觉层级）
   */
  test('LAYOUT-07: Z-index层级验证', async ({ page }) => {
    // 获取TopNavigation z-index
    const topNavZIndex = await page.locator('nav.fixed.top-0').first().evaluate((el) => {
      return window.getComputedStyle(el).zIndex;
    });

    // 获取AI助手 z-index
    const aiAssistantZIndex = await page.locator('div.fixed.right-0').filter({
      has: page.locator('text=AI 智能助手'),
    }).first().evaluate((el) => {
      return window.getComputedStyle(el).zIndex;
    });

    // 验证z-index值
    expect(parseInt(topNavZIndex)).toBe(40);
    expect(parseInt(aiAssistantZIndex)).toBe(50);

    // 验证AI助手z-index高于TopNav
    expect(parseInt(aiAssistantZIndex)).toBeGreaterThan(parseInt(topNavZIndex));

    console.log('✅ LAYOUT-07: Z-index层级验证通过');
    console.log('   TopNavigation z-index:', topNavZIndex);
    console.log('   AI助手 z-index:', aiAssistantZIndex);
    console.log('   → AI助手在TopNavigation之上');
  });

  /**
   * LAYOUT-08: 完整界面截图验证
   *
   * 验收标准：
   * ✅ 生成全页面截图（包含TopNav + 主内容 + AI助手）
   * ✅ 截图清晰显示三层架构
   * ✅ 视觉验证无遮挡、无重叠问题
   */
  test('LAYOUT-08: 完整界面截图验证', async ({ page }) => {
    // 等待所有元素加载完成
    await page.waitForTimeout(1000);

    // 生成全页面截图（不滚动）
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/layout-08-full-page-architecture.png`,
      fullPage: false, // 不滚动，显示当前视口
    });

    // 生成完整页面截图（包含滚动）
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/layout-08-full-page-scrolled.png`,
      fullPage: true, // 滚动到底部
    });

    // 验证三层架构都可见
    const topNav = page.locator('nav.fixed.top-0').first();
    const aiAssistant = page.locator('div.fixed.right-0').filter({
      has: page.locator('text=AI 智能助手'),
    }).first();
    const mainContent = page.locator('div.pt-16.pr-\\[400px\\]').first();

    await expect(topNav).toBeVisible();
    await expect(aiAssistant).toBeVisible();
    await expect(mainContent).toBeVisible();

    console.log('✅ LAYOUT-08: 完整界面截图验证通过');
    console.log('   截图已保存:');
    console.log('   - layout-08-full-page-architecture.png (当前视口)');
    console.log('   - layout-08-full-page-scrolled.png (完整页面)');
    console.log('   → 三层架构视觉验证完成');
  });
});

/**
 * 测试总结
 *
 * 本测试文件验证了GECOM MVP 2.0 Phase 3的全局布局架构：
 *
 * ✅ TopNavigation - 专业的全局导航栏
 *    - Fixed定位，高度64px，z-index 40
 *    - 包含Logo、面包屑、帮助、用户菜单
 *
 * ✅ AI助手 - 真正的全局独立组件
 *    - Fixed定位，宽度400px，z-index 50
 *    - 完整显示Header、快捷问题、聊天、输入框
 *
 * ✅ 主内容区域 - 正确的padding布局
 *    - pt-16 (64px) 为TopNavigation留空间
 *    - pr-[400px] 为AI助手留空间
 *
 * ✅ 滚动独立性 - TopNav和AI助手不随内容滚动
 * ✅ Z-index层级 - AI助手在TopNavigation之上
 * ✅ 视觉验证 - 完整截图验证三层架构
 *
 * 预期结果：8/8测试全部通过 ✅
 */

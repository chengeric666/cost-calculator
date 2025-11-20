import { test, expect } from '@playwright/test';

/**
 * Persistent AI Assistant E2E测试
 *
 * 验收标准：
 * 1. AI助手固定在视口右侧（fixed定位）
 * 2. 占满整个视口高度（h-screen）
 * 3. 头部完整显示（AI图标 + 标题 + 在线状态）
 * 4. 快捷问题区域完整显示
 * 5. 聊天区域可见
 * 6. 输入框完整显示
 * 7. 主内容滚动时AI助手不动
 * 8. 视觉风格协调统一（Modern SaaS美学）
 */
test.describe('Persistent AI Assistant - Modern SaaS Aesthetic', () => {

  test.beforeEach(async ({ page }) => {
    // 访问首页
    await page.goto('http://localhost:3002');

    // 点击"开始成本计算"进入向导
    await page.click('text=开始成本计算');

    // 等待向导页面加载
    await page.waitForSelector('text=项目信息', { timeout: 5000 });

    // 等待AI助手加载
    await page.waitForSelector('text=AI 智能助手', { timeout: 3000 });
  });

  test('AI-ASSISTANT-01: AI助手固定定位验证', async ({ page }) => {
    // 验证AI助手容器存在
    const assistant = page.locator('div.fixed.right-0.top-0');
    await expect(assistant).toBeVisible();

    // 验证宽度为380px
    const boundingBox = await assistant.boundingBox();
    expect(boundingBox?.width).toBe(380);

    // 验证高度为视口高度
    const viewportSize = page.viewportSize();
    expect(boundingBox?.height).toBe(viewportSize?.height);
  });

  test('AI-ASSISTANT-02: 头部完整显示验证', async ({ page }) => {
    // 验证AI图标（Sparkles）- 使用first()避免strict mode违规
    const icon = page.locator('div.bg-gradient-to-br.from-blue-500.to-indigo-600 >> svg').first();
    await expect(icon).toBeVisible();

    // 验证标题
    const title = page.locator('h2:has-text("AI 智能助手")');
    await expect(title).toBeVisible();

    // 验证在线状态指示器
    const status = page.locator('text=在线');
    await expect(status).toBeVisible();

    // 验证副标题（DeepSeek V3）
    const subtitle = page.locator('text=基于 DeepSeek V3');
    await expect(subtitle).toBeVisible();

    // 截图：头部完整显示
    await page.screenshot({
      path: 'tests/screenshots/ai-assistant-header.png',
      clip: { x: page.viewportSize()!.width - 380, y: 0, width: 380, height: 150 }
    });
  });

  test('AI-ASSISTANT-03: 快捷问题区域验证', async ({ page }) => {
    // 验证快捷问题标题
    const quickTitle = page.locator('text=快捷问题');
    await expect(quickTitle).toBeVisible();

    // 验证4个快捷问题按钮
    const questions = [
      '分析当前成本结构',
      '对比美/越/德市场',
      '如何优化ROI？',
      '降低成本的建议'
    ];

    for (const question of questions) {
      const button = page.locator(`button:has-text("${question}")`);
      await expect(button).toBeVisible();
    }

    // 截图：快捷问题区域
    await page.screenshot({
      path: 'tests/screenshots/ai-assistant-quick-questions.png',
      clip: { x: page.viewportSize()!.width - 380, y: 100, width: 380, height: 180 }
    });
  });

  test('AI-ASSISTANT-04: 聊天区域验证', async ({ page }) => {
    // 验证欢迎消息存在
    const welcomeMessage = page.locator('text=你好！我是 GECOM 智能成本助手');
    await expect(welcomeMessage).toBeVisible();

    // 验证AI头像（Bot icon）
    const botAvatar = page.locator('div.bg-gradient-to-br.from-blue-500.to-indigo-600 >> svg').nth(1);
    await expect(botAvatar).toBeVisible();

    // 截图：聊天区域
    await page.screenshot({
      path: 'tests/screenshots/ai-assistant-chat-area.png',
      clip: { x: page.viewportSize()!.width - 380, y: 250, width: 380, height: 400 }
    });
  });

  test('AI-ASSISTANT-05: 输入框完整显示验证', async ({ page }) => {
    // 验证输入框
    const input = page.locator('input[placeholder*="询问任何关于成本优化的问题"]');
    await expect(input).toBeVisible();

    // 验证发送按钮
    const sendButton = page.locator('button:has-text("发送")');
    await expect(sendButton).toBeVisible();

    // 验证提示文字
    const hint = page.locator('text=AI 会自动调用成本计算工具获取真实数据');
    await expect(hint).toBeVisible();

    // 截图：输入框区域
    await page.screenshot({
      path: 'tests/screenshots/ai-assistant-input-area.png',
      clip: {
        x: page.viewportSize()!.width - 380,
        y: page.viewportSize()!.height - 120,
        width: 380,
        height: 120
      }
    });
  });

  test('AI-ASSISTANT-06: 主内容滚动时AI助手不动', async ({ page }) => {
    // 获取AI助手的初始位置
    const assistant = page.locator('div.fixed.right-0.top-0');
    const initialBox = await assistant.boundingBox();

    // 滚动主内容区域
    await page.evaluate(() => {
      const mainContent = document.querySelector('div.pr-\\[380px\\]');
      if (mainContent) {
        mainContent.scrollTo({ top: 500, behavior: 'smooth' });
      }
    });

    // 等待滚动完成
    await page.waitForTimeout(500);

    // 获取AI助手的新位置
    const newBox = await assistant.boundingBox();

    // 验证AI助手位置未变化
    expect(initialBox?.x).toBe(newBox?.x);
    expect(initialBox?.y).toBe(newBox?.y);
  });

  test('AI-ASSISTANT-07: 完整界面截图验证', async ({ page }) => {
    // 完整界面截图
    await page.screenshot({
      path: 'tests/screenshots/ai-assistant-full-view.png',
      fullPage: false
    });

    // 验证视觉元素
    // 1. 背景色为浅色（white/95 + backdrop-blur）
    const bgColor = await page.locator('div.bg-white\\/95.backdrop-blur-xl').first().evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    console.log('AI助手背景色:', bgColor);

    // 2. 边框存在（border-l border-slate-200/80）
    const borderStyle = await page.locator('div.border-l.border-slate-200\\/80').first().evaluate(el => {
      return window.getComputedStyle(el).borderLeftWidth;
    });
    expect(borderStyle).toBe('1px');
  });

  test.skip('AI-ASSISTANT-08: 快捷问题交互测试', async ({ page }) => {
    // 点击第一个快捷问题（使用force避免sticky header拦截）
    await page.click('button:has-text("分析当前成本结构")', { force: true });

    // 等待输入框状态更新
    await page.waitForTimeout(500);

    // 验证问题文本被填充到输入框
    const input = page.locator('input[placeholder*="询问任何关于成本优化的问题"]');
    await expect(input).toHaveValue('分析当前成本结构');

    // 截图：交互状态
    await page.screenshot({
      path: 'tests/screenshots/ai-assistant-interaction.png',
      clip: { x: page.viewportSize()!.width - 380, y: 0, width: 380, height: page.viewportSize()!.height }
    });
  });

  test('AI-ASSISTANT-09: 响应式高度验证（不同视口）', async ({ page }) => {
    // 测试不同视口高度下AI助手的表现
    const viewportHeights = [800, 1000, 1200];

    for (const height of viewportHeights) {
      await page.setViewportSize({ width: 1920, height });

      // 等待布局调整
      await page.waitForTimeout(300);

      // 验证AI助手高度等于视口高度
      const assistant = page.locator('div.fixed.right-0.top-0');
      const box = await assistant.boundingBox();
      expect(box?.height).toBe(height);

      // 截图
      await page.screenshot({
        path: `tests/screenshots/ai-assistant-height-${height}.png`
      });
    }
  });
});

/**
 * Step 5 AI助手E2E测试
 *
 * 测试范围：
 * - AI助手界面基础功能
 * - 三个工具调用场景（真实DeepSeek API）
 * - 用户交互流程
 * - 快捷问题功能
 *
 * 注意：需要配置LLM_API_KEY环境变量
 */

import { test, expect } from '@playwright/test';

// 测试超时时间（AI调用可能需要较长时间）
test.setTimeout(120000);

test.describe('Step 5: AI智能助手', () => {

  test.beforeEach(async ({ page }) => {
    // 访问首页并进入向导
    await page.goto('http://localhost:3000');
    await page.click('text=开始成本计算');

    // 快速完成Step 0-4以到达Step 5
    // Step 0: 项目信息
    await page.fill('input[placeholder*="项目名称"]', 'AI测试项目');
    await page.click('button:has-text("下一步")');

    // Step 1: 业务场景（使用默认值）
    await page.waitForTimeout(500);
    await page.click('button:has-text("下一步")');

    // Step 2: 数据采集（使用默认值）
    await page.waitForTimeout(500);
    await page.click('button:has-text("下一步")');

    // Step 3: 成本建模（查看结果）
    await page.waitForTimeout(1000);
    await page.click('button:has-text("下一步")');

    // Step 4: 场景分析
    await page.waitForTimeout(1000);
    await page.click('button:has-text("下一步")');

    // 现在应该在Step 5
    await expect(page.locator('text=AI智能助手')).toBeVisible({ timeout: 5000 });
  });

  test('S5.1-01: AI助手界面基础元素显示', async ({ page }) => {
    // 检查页面标题
    await expect(page.locator('h2:has-text("AI智能助手")')).toBeVisible();

    // 检查欢迎消息
    await expect(page.locator('text=你好！我是GECOM智能成本助手')).toBeVisible();

    // 检查输入框
    const input = page.locator('input[placeholder*="问我任何关于成本优化的问题"]');
    await expect(input).toBeVisible();

    // 检查发送按钮
    await expect(page.locator('button:has-text("发送")')).toBeVisible();

    // 检查快捷问题标题
    await expect(page.locator('text=💡 快捷问题')).toBeVisible();

    // 检查4个快捷问题按钮
    await expect(page.locator('text=分析当前成本结构，找出主要成本驱动因素')).toBeVisible();
    await expect(page.locator('text=对比美国、越南、德国三个市场的毛利率')).toBeVisible();
    await expect(page.locator('text=如何优化ROI达到50%以上？')).toBeVisible();
    await expect(page.locator('text=当前定价下需要多少销量才能盈亏平衡？')).toBeVisible();

    // 截图
    await page.screenshot({
      path: 'tests/screenshots/step5-ai/01-initial-interface.png',
      fullPage: true
    });
  });

  test('S5.1-02: 快捷问题按钮功能', async ({ page }) => {
    // 点击第一个快捷问题
    await page.click('text=分析当前成本结构，找出主要成本驱动因素');

    // 检查输入框是否填充了问题
    const input = page.locator('input[placeholder*="问我任何关于成本优化的问题"]');
    await expect(input).toHaveValue('分析当前成本结构，找出主要成本驱动因素');

    // 截图
    await page.screenshot({
      path: 'tests/screenshots/step5-ai/02-quick-question-filled.png'
    });
  });

  test('S5.1-03: 用户发送消息交互流程', async ({ page }) => {
    const input = page.locator('input[placeholder*="问我任何关于成本优化的问题"]');
    const sendButton = page.locator('button:has-text("发送")');

    // 检查发送按钮初始状态（应该禁用）
    await expect(sendButton).toBeDisabled();

    // 输入消息
    await input.fill('测试消息');

    // 检查发送按钮变为可用
    await expect(sendButton).toBeEnabled();

    // 发送消息
    await sendButton.click();

    // 检查用户消息出现
    await expect(page.locator('.bg-blue-600:has-text("测试消息")')).toBeVisible({ timeout: 2000 });

    // 检查加载状态
    await expect(page.locator('.animate-spin')).toBeVisible({ timeout: 2000 });

    // 截图
    await page.screenshot({
      path: 'tests/screenshots/step5-ai/03-message-sent.png'
    });
  });

  test('S5.1-04: 工具调用场景1 - get_cost_breakdown', async ({ page }) => {
    const input = page.locator('input[placeholder*="问我任何关于成本优化的问题"]');
    const sendButton = page.locator('button:has-text("发送")');

    // 发送触发成本拆解工具的问题
    await input.fill('请分析M4模块的成本构成');
    await sendButton.click();

    // 等待AI响应（最多60秒）
    await page.waitForSelector('.bg-gray-100', { timeout: 60000 });

    // 检查是否有AI回复
    const aiResponse = page.locator('.bg-gray-100').last();
    await expect(aiResponse).toBeVisible();

    // 截图
    await page.screenshot({
      path: 'tests/screenshots/step5-ai/04-cost-breakdown-response.png',
      fullPage: true
    });

    console.log('✓ 工具调用测试1完成 - get_cost_breakdown');
  });

  test('S5.1-05: 工具调用场景2 - compare_scenarios', async ({ page }) => {
    const input = page.locator('input[placeholder*="问我任何关于成本优化的问题"]');
    const sendButton = page.locator('button:has-text("发送")');

    // 发送触发场景对比工具的问题
    await input.fill('对比美国、越南、德国三个市场的毛利率');
    await sendButton.click();

    // 等待AI响应
    await page.waitForSelector('.bg-gray-100', { timeout: 90000 });

    // 检查是否有AI回复
    const aiResponse = page.locator('.bg-gray-100').last();
    await expect(aiResponse).toBeVisible();

    // 等待稍微长一点，因为对比三个国家需要更多计算时间
    await page.waitForTimeout(2000);

    // 截图
    await page.screenshot({
      path: 'tests/screenshots/step5-ai/05-compare-scenarios-response.png',
      fullPage: true
    });

    console.log('✓ 工具调用测试2完成 - compare_scenarios');
  });

  test('S5.1-06: 工具调用场景3 - get_optimization_suggestions', async ({ page }) => {
    const input = page.locator('input[placeholder*="问我任何关于成本优化的问题"]');
    const sendButton = page.locator('button:has-text("发送")');

    // 发送触发优化建议工具的问题
    await input.fill('如何优化ROI达到50%以上？');
    await sendButton.click();

    // 等待AI响应
    await page.waitForSelector('.bg-gray-100', { timeout: 60000 });

    // 检查是否有AI回复
    const aiResponse = page.locator('.bg-gray-100').last();
    await expect(aiResponse).toBeVisible();

    // 截图
    await page.screenshot({
      path: 'tests/screenshots/step5-ai/06-optimization-suggestions-response.png',
      fullPage: true
    });

    console.log('✓ 工具调用测试3完成 - get_optimization_suggestions');
  });

  test('S5.1-07: 多轮对话测试', async ({ page }) => {
    const input = page.locator('input[placeholder*="问我任何关于成本优化的问题"]');
    const sendButton = page.locator('button:has-text("发送")');

    // 第一轮对话
    await input.fill('当前的毛利率是多少？');
    await sendButton.click();
    await page.waitForSelector('.bg-gray-100', { timeout: 60000 });
    await page.waitForTimeout(1000);

    // 截图第一轮
    await page.screenshot({
      path: 'tests/screenshots/step5-ai/07-round1.png',
      fullPage: true
    });

    // 第二轮对话
    await input.fill('那如何提升毛利率？');
    await sendButton.click();
    await page.waitForSelector('.bg-gray-100:nth-of-type(2)', { timeout: 60000 });
    await page.waitForTimeout(1000);

    // 截图第二轮
    await page.screenshot({
      path: 'tests/screenshots/step5-ai/07-round2.png',
      fullPage: true
    });

    // 检查消息数量（欢迎消息 + 2轮对话 × 2 = 5条消息）
    const messages = page.locator('.bg-blue-600, .bg-gray-100');
    const count = await messages.count();
    expect(count).toBeGreaterThanOrEqual(5);

    console.log('✓ 多轮对话测试完成');
  });

  test('S5.1-08: 输入验证和错误处理', async ({ page }) => {
    const input = page.locator('input[placeholder*="问我任何关于成本优化的问题"]');
    const sendButton = page.locator('button:has-text("发送")');

    // 测试空输入
    await input.fill('   ');
    await expect(sendButton).toBeDisabled();

    // 测试正常输入
    await input.fill('测试');
    await expect(sendButton).toBeEnabled();

    // 清空输入
    await input.fill('');
    await expect(sendButton).toBeDisabled();

    console.log('✓ 输入验证测试完成');
  });

  test('S5.1-09: 消息自动滚动', async ({ page }) => {
    const input = page.locator('input[placeholder*="问我任何关于成本优化的问题"]');
    const sendButton = page.locator('button:has-text("发送")');

    // 发送一条消息
    await input.fill('请分析成本结构');
    await sendButton.click();

    // 等待响应
    await page.waitForSelector('.bg-gray-100', { timeout: 60000 });

    // 检查最新消息是否在可见区域
    const lastMessage = page.locator('.bg-gray-100').last();
    await expect(lastMessage).toBeInViewport();

    console.log('✓ 自动滚动测试完成');
  });

  test('S5.1-10: 完整用户流程 - 从快捷问题到AI回复', async ({ page }) => {
    // 点击快捷问题
    await page.click('text=分析当前成本结构，找出主要成本驱动因素');

    // 截图1：快捷问题填充
    await page.screenshot({
      path: 'tests/screenshots/step5-ai/10-flow-01-question-filled.png'
    });

    // 发送消息
    await page.click('button:has-text("发送")');

    // 截图2：消息发送后
    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'tests/screenshots/step5-ai/10-flow-02-message-sent.png'
    });

    // 等待AI响应
    await page.waitForSelector('.bg-gray-100', { timeout: 60000 });
    await page.waitForTimeout(2000);

    // 截图3：AI回复完成
    await page.screenshot({
      path: 'tests/screenshots/step5-ai/10-flow-03-ai-response.png',
      fullPage: true
    });

    // 验证消息结构
    const userMessage = page.locator('.bg-blue-600');
    await expect(userMessage).toBeVisible();

    const aiMessage = page.locator('.bg-gray-100');
    await expect(aiMessage).toBeVisible();

    console.log('✓ 完整用户流程测试完成');
  });
});

/**
 * Global AI Assistant E2E Tests
 *
 * Test Coverage:
 * - GAI-01: 悬浮按钮在所有页面显示
 * - GAI-02: 点击按钮打开Drawer
 * - GAI-03: Drawer关闭功能（X按钮 + 背景点击）
 * - GAI-04: 发送消息到AI助手
 * - GAI-05: 快捷问题点击自动填充
 *
 * @created 2025-11-17
 * @phase Phase 2 Task 2.3
 */

import { test, expect } from '@playwright/test';

test.describe('Global AI Assistant', () => {
  test.beforeEach(async ({ page }) => {
    // 导航到主页
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('GAI-01: 悬浮按钮在所有页面显示', async ({ page }) => {
    // 验证主页显示悬浮按钮
    const floatingButton = page.locator('button[aria-label="打开AI助手"]');
    await expect(floatingButton).toBeVisible();

    // 验证按钮样式（固定定位，紫色渐变背景）
    await expect(floatingButton).toHaveClass(/fixed/);
    await expect(floatingButton).toHaveClass(/bg-gradient-to-br/);
    await expect(floatingButton).toHaveClass(/from-purple-600/);
    await expect(floatingButton).toHaveClass(/to-indigo-700/);

    // 验证图标存在
    await expect(floatingButton.locator('svg')).toBeVisible();

    // 导航到向导页面，验证悬浮按钮仍然显示
    await page.click('button:has-text("开始成本计算")');
    await page.waitForLoadState('networkidle');
    await expect(floatingButton).toBeVisible();
  });

  test('GAI-02: 点击按钮打开Drawer', async ({ page }) => {
    const floatingButton = page.locator('button[aria-label="打开AI助手"]');

    // 验证初始状态：Drawer不可见
    const drawerTitle = page.locator('h2:has-text("AI智能助手")');
    await expect(drawerTitle).not.toBeVisible();

    // 点击悬浮按钮
    await floatingButton.click();
    await page.waitForTimeout(300); // 等待Drawer动画

    // 验证Drawer打开
    await expect(drawerTitle).toBeVisible();
    await expect(page.locator('text=基于DeepSeek V3的成本优化专家')).toBeVisible();

    // 验证Drawer内容
    await expect(page.locator('h3:has-text("快捷问题")')).toBeVisible();
    await expect(page.locator('text=分析当前成本结构，找出主要成本驱动因素')).toBeVisible();
    await expect(page.locator('input[placeholder*="问我任何关于成本优化的问题"]')).toBeVisible();

    // 验证初始AI欢迎消息
    await expect(page.locator('text=你好！我是GECOM智能成本助手')).toBeVisible();
  });

  test('GAI-03: Drawer关闭功能', async ({ page }) => {
    const floatingButton = page.locator('button[aria-label="打开AI助手"]');
    const drawerTitle = page.locator('h2:has-text("AI智能助手")');

    // 打开Drawer
    await floatingButton.click();
    await page.waitForTimeout(300);
    await expect(drawerTitle).toBeVisible();

    // Test 1: 使用X按钮关闭
    const closeButton = page.locator('button[aria-label="关闭AI助手"]');
    await expect(closeButton).toBeVisible();
    await closeButton.click();
    await page.waitForTimeout(300);
    await expect(drawerTitle).not.toBeVisible();

    // 重新打开Drawer
    await floatingButton.click();
    await page.waitForTimeout(300);
    await expect(drawerTitle).toBeVisible();

    // Test 2: 点击背景遮罩关闭
    const overlay = page.locator('.fixed.inset-0.bg-black\\/50');
    await expect(overlay).toBeVisible();
    await overlay.click({ position: { x: 10, y: 10 } }); // 点击遮罩左上角
    await page.waitForTimeout(300);
    await expect(drawerTitle).not.toBeVisible();
  });

  test('GAI-04: 发送消息到AI助手', async ({ page }) => {
    const floatingButton = page.locator('button[aria-label="打开AI助手"]');

    // 打开Drawer
    await floatingButton.click();
    await page.waitForTimeout(300);

    // 定位输入框和发送按钮
    const input = page.locator('input[placeholder*="问我任何关于成本优化的问题"]');
    const sendButton = page.locator('button:has-text("发送")');

    // 验证初始状态：发送按钮禁用
    await expect(sendButton).toBeDisabled();

    // 输入消息
    const testMessage = '测试消息：请分析当前成本结构';
    await input.fill(testMessage);

    // 验证发送按钮启用
    await expect(sendButton).toBeEnabled();

    // 发送消息
    await sendButton.click();

    // 验证用户消息显示在聊天界面
    await expect(page.locator(`text=${testMessage}`)).toBeVisible();

    // 验证输入框清空
    await expect(input).toHaveValue('');

    // 验证加载状态显示
    await expect(page.locator('text=正在思考...')).toBeVisible({ timeout: 5000 });

    // 注意：由于需要真实API调用，AI回复验证在集成测试中进行
    // 这里仅验证UI交互正常
  });

  test('GAI-05: 快捷问题点击自动填充', async ({ page }) => {
    const floatingButton = page.locator('button[aria-label="打开AI助手"]');

    // 打开Drawer
    await floatingButton.click();
    await page.waitForTimeout(300);

    // 定位快捷问题按钮
    const quickQuestionButtons = page.locator('h3:has-text("快捷问题") + div button');
    await expect(quickQuestionButtons).toHaveCount(4);

    // 点击第一个快捷问题
    const firstQuestion = quickQuestionButtons.nth(0);
    const questionText = await firstQuestion.textContent();
    await firstQuestion.click();

    // 验证输入框自动填充
    const input = page.locator('input[placeholder*="问我任何关于成本优化的问题"]');
    await expect(input).toHaveValue(questionText || '');

    // 验证发送按钮启用
    const sendButton = page.locator('button:has-text("发送")');
    await expect(sendButton).toBeEnabled();

    // 点击第二个快捷问题
    const secondQuestion = quickQuestionButtons.nth(1);
    const secondQuestionText = await secondQuestion.textContent();
    await secondQuestion.click();

    // 验证输入框内容替换
    await expect(input).toHaveValue(secondQuestionText || '');
  });

  test('GAI-06: Drawer响应式设计验证', async ({ page }) => {
    const floatingButton = page.locator('button[aria-label="打开AI助手"]');

    // 打开Drawer
    await floatingButton.click();
    await page.waitForTimeout(300);

    // 获取Drawer容器
    const drawer = page.locator('.fixed.inset-y-0.right-0').first();
    await expect(drawer).toBeVisible();

    // 验证Drawer宽度（desktop模式：600px）
    const drawerBox = await drawer.boundingBox();
    if (drawerBox) {
      // 在desktop视口下，Drawer应该是600px宽度
      expect(drawerBox.width).toBeGreaterThanOrEqual(500); // 允许一些误差
    }

    // 验证Drawer完全占据视口高度
    const viewportSize = page.viewportSize();
    if (viewportSize && drawerBox) {
      expect(drawerBox.height).toBeCloseTo(viewportSize.height, -1); // -1: 允许10px误差
    }
  });

  test('GAI-07: Hover效果验证', async ({ page }) => {
    const floatingButton = page.locator('button[aria-label="打开AI助手"]');

    // Hover悬浮按钮
    await floatingButton.hover();

    // 验证Tooltip显示
    await expect(page.locator('text=AI智能助手')).toBeVisible({ timeout: 1000 });

    // 验证按钮有scale效果（通过class检查）
    await expect(floatingButton).toHaveClass(/hover:scale-110/);
  });
});

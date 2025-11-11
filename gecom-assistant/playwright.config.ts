import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright配置文件
 * 用于GECOM成本计算器的端到端测试
 */
export default defineConfig({
  testDir: './tests/e2e',

  // 测试超时
  timeout: 60 * 1000,

  // 全局设置
  fullyParallel: false, // 串行执行，避免端口冲突
  forbidOnly: !!process.env.CI, // CI环境禁止.only
  retries: process.env.CI ? 2 : 0,
  workers: 1, // 单worker执行

  // 报告
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],

  // 共享设置
  use: {
    // 基础URL
    baseURL: 'http://localhost:3000',

    // 截图
    screenshot: 'only-on-failure',

    // 视频
    video: 'retain-on-failure',

    // 追踪
    trace: 'on-first-retry',
  },

  // 浏览器配置
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Web服务器配置（自动启动开发服务器）
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});

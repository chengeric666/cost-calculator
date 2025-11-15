import { test, expect } from '@playwright/test';

test('调试成本结构图数据', async ({ page }) => {
  // 访问页面
  await page.goto('http://localhost:3000');

  // 等待页面加载
  await page.waitForTimeout(2000);

  // 导航到Step 4
  const step4Button = page.locator('button:has-text("场景分析")');
  if (await step4Button.isVisible()) {
    await step4Button.click();
    await page.waitForTimeout(1000);
  }

  // 检查是否有成本结构对比图
  const chartTitle = page.locator('text=成本结构对比');
  await expect(chartTitle).toBeVisible();

  // 检查是否有条形图或"暂无数据"提示
  const hasData = await page.locator('.bg-purple-500, .bg-blue-500, .bg-green-500').count();
  const noDataMsg = await page.locator('text=暂无数据').count();

  console.log('条形图数量:', hasData);
  console.log('"暂无数据"提示数量:', noDataMsg);

  // 截图
  await page.screenshot({ path: 'debug-cost-chart.png', fullPage: true });

  // 获取页面控制台输出
  page.on('console', msg => {
    if (msg.text().includes('成本数据') || msg.text().includes('total')) {
      console.log('浏览器控制台:', msg.text());
    }
  });

  await page.waitForTimeout(2000);
});

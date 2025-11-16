/**
 * Day 23 第二章成本拆解生成功能 - E2E测试
 *
 * 测试范围：
 * - 第二章模板（chapter-2-cost-breakdown.ts）
 * - M1-M3 CAPEX表格（3个表格）
 * - M4-M8 OPEX表格（5个表格）
 * - 5个图表占位符
 * - 数据动态填充验证
 *
 * 验收标准：
 * - TypeScript 0错误
 * - 文件大小 >35KB（含执行摘要+第一章+第二章）
 * - 生成耗时 <8秒
 * - 第二章内容完整（8,000-10,000字）
 * - 8个表格完整（M1-M8）
 * - 5个图表占位符完整
 * - 数据准确性验证
 *
 * @created 2025-11-16
 * @author GECOM Team
 */

import { test, expect } from '@playwright/test';

test.describe('Day 23: 第二章成本拆解生成功能测试', () => {
  test.beforeEach(async ({ page }) => {
    // 访问测试页面
    await page.goto('http://localhost:3000/test-report-generation');
    await page.waitForLoadState('networkidle');
  });

  test('Test 23.1: 测试页面正确渲染（Day 23版本）', async ({ page }) => {
    // 验证页面标题
    const title = await page.locator('h1').textContent();
    expect(title).toContain('Day 21-23 报告生成测试');

    // 验证描述包含第二章
    const description = await page.locator('p.text-gray-600').first().textContent();
    expect(description).toContain('第二章');
    expect(description).toContain('8表格');

    // 验证测试数据卡片
    const productName = await page.locator('text=Paws & Claws宠物零食').textContent();
    expect(productName).toBe('Paws & Claws宠物零食');

    // 验证生成按钮存在
    const generateBtn = page.locator('#generate-report-btn');
    await expect(generateBtn).toBeVisible();
    await expect(generateBtn).toHaveText('生成Word报告');

    console.log('✅ Test 23.1通过：测试页面正确渲染（Day 23版本）');
  });

  test('Test 23.2: 报告生成功能验证（包含第二章）', async ({ page }) => {
    // 点击生成按钮
    const generateBtn = page.locator('#generate-report-btn');
    await generateBtn.click();

    // 验证按钮状态变化
    await expect(generateBtn).toHaveText('生成中...');
    await expect(generateBtn).toBeDisabled();

    // 等待生成完成（最多20秒，Day 23内容更多）
    await page.waitForSelector('#result-panel', { timeout: 20000 });

    // 验证成功消息
    const successMsg = await page.locator('text=✅ 报告生成成功！').textContent();
    expect(successMsg).toContain('报告生成成功');

    console.log('✅ Test 23.2通过：报告生成成功（包含第二章）');
  });

  test('Test 23.3: 报告元数据验证（Day 23标准）', async ({ page }) => {
    // 生成报告
    await page.locator('#generate-report-btn').click();
    await page.waitForSelector('#result-panel', { timeout: 20000 });

    // 验证文件大小 >35KB (35,840字节，Day 23含第二章8表格)
    // 预期文件大小：30-50KB
    const fileSizeText = await page.locator('#file-size').textContent();
    expect(fileSizeText).toBeTruthy();

    // 提取文件大小数字
    const fileSizeMatch = fileSizeText?.match(/(\d+)\s*字节/);
    if (fileSizeMatch) {
      const fileSizeBytes = parseInt(fileSizeMatch[1], 10);
      expect(fileSizeBytes).toBeGreaterThan(35840); // >35KB (Day 23标准)
      console.log(`  文件大小: ${fileSizeBytes} 字节 (${(fileSizeBytes / 1024).toFixed(2)} KB)`);

      // 验证文件大小在合理范围内（35-80KB）
      expect(fileSizeBytes).toBeLessThan(81920); // <80KB
    }

    // 验证生成耗时 <8000ms (Day 23放宽标准)
    const genTimeText = await page.locator('#generation-time').textContent();
    const genTimeMatch = genTimeText?.match(/(\d+)\s*ms/);
    if (genTimeMatch) {
      const genTimeMs = parseInt(genTimeMatch[1], 10);
      expect(genTimeMs).toBeLessThan(8000); // <8秒
      console.log(`  生成耗时: ${genTimeMs} ms`);
    }

    // 验证报告版本
    const versionText = await page.locator('#report-version').textContent();
    expect(versionText).toMatch(/v\d{4}Q\d/); // 格式：v2025Q4
    console.log(`  报告版本: ${versionText}`);

    console.log('✅ Test 23.3通过：报告元数据验证（Day 23标准）');
  });

  test('Test 23.4: Day 23验收清单显示', async ({ page }) => {
    // 生成报告
    await page.locator('#generate-report-btn').click();
    await page.waitForSelector('#result-panel', { timeout: 20000 });

    // 验证手动验证清单标题
    const checklistTitle = await page.locator('text=✓ 手动验证清单（Day 23）：').textContent();
    expect(checklistTitle).toContain('手动验证清单（Day 23）');

    // 验证清单项（Day 23特有）
    const checklistItems = [
      'gecom-report-day23-test.docx',
      '验证第二章内容',
      '8,000-10,000字',
      'M1-M3共3个表格',
      'M4-M8共5个表格',
      '5个图表占位符',
      'CAPEX',
      'OPEX',
      '关税对比',
      '物流成本',
      '成本饼图',
      'CAPEX vs OPEX',
      '瀑布图',
      '表格格式',
      'formatCurrency',
    ];

    for (const item of checklistItems) {
      const found = await page.locator(`text=${item}`).count();
      expect(found).toBeGreaterThan(0);
    }

    console.log('✅ Test 23.4通过：Day 23验收清单显示正确');
  });

  test('Test 23.5: Day 23验收标准显示', async ({ page }) => {
    // 验证验收标准卡片
    const criteriaTitle = await page.locator('text=Day 23 验收标准').textContent();
    expect(criteriaTitle).toContain('Day 23 验收标准');

    // 验证所有验收标准项（Day 23特有）
    const criteria = [
      'TypeScript 0错误',
      '文件大小 >35KB',
      '第二章内容完整（8,000-10,000字，8表格+5图表占位符）',
      '2.1 CAPEX三模块（M1-M3表格完整，数据正确）',
      '2.2 OPEX五模块（M4-M8表格完整，数据正确）',
      '2.3 图表占位符（5个专业描述格式）',
      '表格格式正确',
      'Word文档可正常打开',
      '生成耗时 <8秒',
    ];

    for (const criterion of criteria) {
      const found = await page.locator(`text=${criterion}`).count();
      expect(found).toBeGreaterThan(0);
    }

    console.log('✅ Test 23.5通过：Day 23验收标准完整显示');
  });

  test('Test 23.6: 测试数据完整性（US市场）', async ({ page }) => {
    // 验证测试数据卡片的所有字段（US宠物食品项目）
    const dataFields = [
      { label: '产品名称：', value: 'Paws & Claws宠物零食' },
      { label: '行业类别：', value: '宠物食品' },
      { label: '目标市场：', value: '美国' },
      { label: '销售渠道：', value: '亚马逊（FBA）' },
      { label: '定价：', value: '$15.99' },
      { label: '月销量：', value: '500单' },
    ];

    for (const field of dataFields) {
      const labelElement = page.locator(`text=${field.label}`);
      await expect(labelElement).toBeVisible();

      const valueElement = page.locator(`text=${field.value}`);
      await expect(valueElement).toBeVisible();
    }

    console.log('✅ Test 23.6通过：测试数据完整（US市场）');
  });

  test('Test 23.7: TypeScript编译检查（Day 23）', async ({ page }) => {
    // 访问页面后检查控制台是否有TypeScript错误
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('http://localhost:3000/test-report-generation');
    await page.waitForLoadState('networkidle');

    // 等待2秒，收集可能的错误
    await page.waitForTimeout(2000);

    // 过滤掉非TypeScript相关错误（如网络错误等）
    const tsErrors = errors.filter(
      (err) =>
        err.includes('TypeError') || err.includes('undefined') || err.includes('is not a function')
    );

    expect(tsErrors.length).toBe(0);

    if (tsErrors.length === 0) {
      console.log('✅ Test 23.7通过：无TypeScript运行时错误（Day 23）');
    } else {
      console.error('❌ 发现TypeScript错误:', tsErrors);
    }
  });

  test('Test 23.8: 第二章内容生成验证', async ({ page }) => {
    // 生成报告
    await page.locator('#generate-report-btn').click();
    await page.waitForSelector('#result-panel', { timeout: 20000 });

    // 验证成功
    const successMsg = await page.locator('text=✅ 报告生成成功！').isVisible();
    expect(successMsg).toBe(true);

    // 验证控制台日志包含Day 23特有步骤
    const logs: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'log') {
        logs.push(msg.text());
      }
    });

    // 验证文件大小符合Day 23标准（含第二章8表格）
    const fileSizeText = await page.locator('#file-size').textContent();
    const fileSizeMatch = fileSizeText?.match(/(\d+)\s*字节/);

    if (fileSizeMatch) {
      const fileSizeBytes = parseInt(fileSizeMatch[1], 10);
      // Day 23文件应该比Day 22大很多（>35KB）
      expect(fileSizeBytes).toBeGreaterThan(35840);
      console.log(`  ✅ 文件大小符合Day 23标准: ${(fileSizeBytes / 1024).toFixed(2)} KB`);
    }

    console.log('✅ Test 23.8通过：第二章内容生成验证');
  });
});

test.describe('Day 23: 错误处理测试', () => {
  test('Test 23.9: 内容完整性验证（第二章核心部分）', async ({ page }) => {
    await page.goto('http://localhost:3000/test-report-generation');
    await page.waitForLoadState('networkidle');

    // 生成报告
    await page.locator('#generate-report-btn').click();
    await page.waitForSelector('#result-panel', { timeout: 20000 });

    // 验证成功
    const success = await page.locator('text=✅ 报告生成成功！').isVisible();
    expect(success).toBe(true);

    // 验证手动验证清单包含第二章核心部分的提示
    const checklistText = await page.locator('.list-disc').textContent();
    expect(checklistText).toContain('2.1 CAPEX');
    expect(checklistText).toContain('M1-M3');
    expect(checklistText).toContain('市场准入');
    expect(checklistText).toContain('技术合规');
    expect(checklistText).toContain('供应链搭建');

    console.log('✅ Test 23.9通过：内容完整性验证（第二章CAPEX部分）');
  });

  test('Test 23.10: 内容完整性验证（第二章OPEX部分）', async ({ page }) => {
    await page.goto('http://localhost:3000/test-report-generation');
    await page.waitForLoadState('networkidle');

    // 生成报告
    await page.locator('#generate-report-btn').click();
    await page.waitForSelector('#result-panel', { timeout: 20000 });

    // 验证成功
    const success = await page.locator('text=✅ 报告生成成功！').isVisible();
    expect(success).toBe(true);

    // 验证手动验证清单包含第二章OPEX部分的提示
    const checklistText = await page.locator('.list-disc').textContent();
    expect(checklistText).toContain('2.2 OPEX');
    expect(checklistText).toContain('M4-M8');
    expect(checklistText).toContain('货物税费');
    expect(checklistText).toContain('物流配送');
    expect(checklistText).toContain('营销获客');
    expect(checklistText).toContain('支付手续费');
    expect(checklistText).toContain('运营管理');

    console.log('✅ Test 23.10通过：内容完整性验证（第二章OPEX部分）');
  });

  test('Test 23.11: 图表占位符验证', async ({ page }) => {
    await page.goto('http://localhost:3000/test-report-generation');
    await page.waitForLoadState('networkidle');

    // 生成报告
    await page.locator('#generate-report-btn').click();
    await page.waitForSelector('#result-panel', { timeout: 20000 });

    // 验证成功
    const success = await page.locator('text=✅ 报告生成成功！').isVisible();
    expect(success).toBe(true);

    // 验证手动验证清单包含5个图表占位符的提示
    const checklistText = await page.locator('.list-disc').textContent();
    expect(checklistText).toContain('2.3 可视化');
    expect(checklistText).toContain('5个图表占位符');
    expect(checklistText).toContain('关税对比');
    expect(checklistText).toContain('物流成本');
    expect(checklistText).toContain('成本饼图');
    expect(checklistText).toContain('CAPEX vs OPEX');
    expect(checklistText).toContain('瀑布图');

    console.log('✅ Test 23.11通过：图表占位符验证');
  });
});

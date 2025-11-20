import { describe, it } from 'vitest';
import { getCostBreakdown } from '../getCostBreakdown';
import { Project, ProjectScope } from '@/types/gecom';

const mockProject: Partial<Project> = {
  id: 'test-project',
  name: 'Test Project',
  industry: 'pet',
  targetCountry: 'US',
  salesChannel: 'amazon_fba',
  scope: {
    productInfo: {
      sku: 'TEST-SKU-001',
      name: 'Test Product',
      category: 'pet_food',
      weight: 1.5,
      cogs: 15,
      targetPrice: 50
    },
    assumptions: {
      monthlySales: 1000,
      returnRate: 0.1,
      growthRate: 0.05
    }
  } as ProjectScope,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01')
};

describe('Debug getCostBreakdown', () => {
  it('should log actual result', () => {
    const result = getCostBreakdown({ module: 'm1' }, mockProject);
    console.log('=== DEBUG RESULT ===');
    console.log(JSON.stringify(result, null, 2));
    console.log('===================');
  });
});

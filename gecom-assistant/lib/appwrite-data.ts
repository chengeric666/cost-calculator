/**
 * Appwrite 数据操作层
 *
 * 提供项目和计算结果的CRUD操作
 */

import { ID, Query } from 'appwrite';
import { databases, serverDatabases, appwriteConfig, isAppwriteConfigured, QueryOptions, AppwriteDocument } from './appwrite-client';
import { Project, CostResult, Scope, CostFactor, TargetCountry, Industry, M4Logistics, Calculation } from '@/types/gecom';

// ============================================
// 类型定义
// ============================================

/**
 * 项目文档类型（Appwrite格式）
 */
export interface ProjectDocument extends AppwriteDocument {
  userId: string;
  name: string;
  industry: string;
  targetCountry: string;
  salesChannel: string;
}

/**
 * 计算结果文档类型（Appwrite格式）
 */
export interface CalculationDocument extends AppwriteDocument {
  projectId: string;
  scope: string; // JSON字符串
  costResult: string; // JSON字符串
  version: string;
}

// ============================================
// 辅助函数
// ============================================

/**
 * 安全解析JSON字符串
 * @param jsonString JSON字符串或已解析对象
 * @returns 解析后的对象
 */
function safeParse<T>(jsonString: string | T): T {
  if (typeof jsonString === 'string') {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('JSON解析失败:', error);
      return jsonString as T;
    }
  }
  return jsonString;
}

/**
 * 检查Appwrite是否已配置
 * @throws 如果未配置则抛出错误
 */
function ensureConfigured() {
  if (!isAppwriteConfigured()) {
    throw new Error('Appwrite配置不完整，请检查环境变量');
  }
}

// ============================================
// 项目（Projects）操作
// ============================================

/**
 * 获取所有项目列表
 * @param userId 用户ID（可选，未来用于多用户）
 * @param options 查询选项
 * @returns 项目列表
 */
export async function getProjects(
  userId?: string,
  options: QueryOptions = {}
): Promise<Project[]> {
  ensureConfigured();

  try {
    const queries = [];

    // 如果提供了userId，添加用户过滤
    if (userId) {
      queries.push(Query.equal('userId', userId));
    }

    // 排序（默认按创建时间倒序）
    if (options.orderBy) {
      queries.push(
        options.orderType === 'ASC'
          ? Query.orderAsc(options.orderBy)
          : Query.orderDesc(options.orderBy)
      );
    } else {
      queries.push(Query.orderDesc('$createdAt'));
    }

    // 分页
    if (options.limit) {
      queries.push(Query.limit(options.limit));
    }
    if (options.offset) {
      queries.push(Query.offset(options.offset));
    }

    const response = await databases.listDocuments<ProjectDocument>(
      appwriteConfig.databaseId,
      appwriteConfig.collections.projects,
      queries
    );

    return response.documents.map((doc) => ({
      id: doc.$id,
      userId: doc.userId,
      name: doc.name,
      industry: doc.industry,
      targetCountry: doc.targetCountry,
      salesChannel: doc.salesChannel,
      createdAt: doc.$createdAt,
      updatedAt: doc.$updatedAt,
    }));
  } catch (error) {
    console.error('获取项目列表失败:', error);
    return [];
  }
}

/**
 * 根据ID获取项目详情
 * @param projectId 项目ID
 * @returns 项目详情
 */
export async function getProjectById(projectId: string): Promise<Project | null> {
  ensureConfigured();

  try {
    const doc = await databases.getDocument<ProjectDocument>(
      appwriteConfig.databaseId,
      appwriteConfig.collections.projects,
      projectId
    );

    return {
      id: doc.$id,
      userId: doc.userId,
      name: doc.name,
      industry: doc.industry,
      targetCountry: doc.targetCountry,
      salesChannel: doc.salesChannel,
      createdAt: doc.$createdAt,
      updatedAt: doc.$updatedAt,
    };
  } catch (error) {
    console.error(`获取项目失败 (ID: ${projectId}):`, error);
    return null;
  }
}

/**
 * 创建新项目
 * @param project 项目数据
 * @returns 创建的项目
 */
export async function createProject(project: Partial<Project>): Promise<Project | null> {
  ensureConfigured();

  try {
    const doc = await databases.createDocument<ProjectDocument>(
      appwriteConfig.databaseId,
      appwriteConfig.collections.projects,
      ID.unique(),
      {
        userId: project.userId || 'anonymous',
        name: project.name || '未命名项目',
        industry: project.industry || '',
        targetCountry: project.targetCountry || '',
        salesChannel: project.salesChannel || '',
      }
    );

    return {
      id: doc.$id,
      userId: doc.userId,
      name: doc.name,
      industry: doc.industry,
      targetCountry: doc.targetCountry,
      salesChannel: doc.salesChannel,
      createdAt: doc.$createdAt,
      updatedAt: doc.$updatedAt,
    };
  } catch (error) {
    console.error('创建项目失败:', error);
    return null;
  }
}

/**
 * 更新项目
 * @param projectId 项目ID
 * @param updates 更新数据
 * @returns 更新后的项目
 */
export async function updateProject(
  projectId: string,
  updates: Partial<Project>
): Promise<Project | null> {
  ensureConfigured();

  try {
    const doc = await databases.updateDocument<ProjectDocument>(
      appwriteConfig.databaseId,
      appwriteConfig.collections.projects,
      projectId,
      {
        ...(updates.name && { name: updates.name }),
        ...(updates.industry && { industry: updates.industry }),
        ...(updates.targetCountry && { targetCountry: updates.targetCountry }),
        ...(updates.salesChannel && { salesChannel: updates.salesChannel }),
      }
    );

    return {
      id: doc.$id,
      userId: doc.userId,
      name: doc.name,
      industry: doc.industry,
      targetCountry: doc.targetCountry,
      salesChannel: doc.salesChannel,
      createdAt: doc.$createdAt,
      updatedAt: doc.$updatedAt,
    };
  } catch (error) {
    console.error(`更新项目失败 (ID: ${projectId}):`, error);
    return null;
  }
}

/**
 * 删除项目
 * @param projectId 项目ID
 * @returns 是否删除成功
 */
export async function deleteProject(projectId: string): Promise<boolean> {
  ensureConfigured();

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.projects,
      projectId
    );
    return true;
  } catch (error) {
    console.error(`删除项目失败 (ID: ${projectId}):`, error);
    return false;
  }
}

// ============================================
// 计算结果（Calculations）操作
// ============================================

/**
 * 获取项目的所有计算结果
 * @param projectId 项目ID
 * @param options 查询选项
 * @returns 计算结果列表
 */
export async function getCalculationsByProject(
  projectId: string,
  options: QueryOptions = {}
): Promise<Array<{ id: string; scope: Scope; costResult: CostResult; version: string; createdAt: string }>> {
  ensureConfigured();

  try {
    const queries = [
      Query.equal('projectId', projectId),
      Query.orderDesc('$createdAt'),
    ];

    if (options.limit) {
      queries.push(Query.limit(options.limit));
    }

    const response = await databases.listDocuments<CalculationDocument>(
      appwriteConfig.databaseId,
      appwriteConfig.collections.calculations,
      queries
    );

    return response.documents.map((doc) => ({
      id: doc.$id,
      scope: safeParse<Scope>(doc.scope),
      costResult: safeParse<CostResult>(doc.costResult),
      version: doc.version,
      createdAt: doc.$createdAt,
    }));
  } catch (error) {
    console.error(`获取计算结果失败 (项目ID: ${projectId}):`, error);
    return [];
  }
}

/**
 * 创建计算结果
 * @param projectId 项目ID
 * @param scope 业务场景
 * @param costResult 成本计算结果
 * @param version GECOM版本
 * @returns 创建的计算结果
 */
export async function createCalculation(
  projectId: string,
  scope: Scope,
  costResult: CostResult,
  version: string = '1.0'
): Promise<{ id: string; createdAt: string } | null> {
  ensureConfigured();

  try {
    const doc = await databases.createDocument<CalculationDocument>(
      appwriteConfig.databaseId,
      appwriteConfig.collections.calculations,
      ID.unique(),
      {
        projectId,
        scope: JSON.stringify(scope),
        costResult: JSON.stringify(costResult),
        version,
      }
    );

    return {
      id: doc.$id,
      createdAt: doc.$createdAt,
    };
  } catch (error) {
    console.error('创建计算结果失败:', error);
    return null;
  }
}

/**
 * 获取最新的计算结果
 * @param projectId 项目ID
 * @returns 最新的计算结果
 */
export async function getLatestCalculation(projectId: string): Promise<{
  id: string;
  scope: Scope;
  costResult: CostResult;
  version: string;
  createdAt: string;
} | null> {
  ensureConfigured();

  try {
    const calculations = await getCalculationsByProject(projectId, { limit: 1 });
    return calculations.length > 0 ? calculations[0] : null;
  } catch (error) {
    console.error(`获取最新计算结果失败 (项目ID: ${projectId}):`, error);
    return null;
  }
}

/**
 * 删除计算结果
 * @param calculationId 计算结果ID
 * @returns 是否删除成功
 */
export async function deleteCalculation(calculationId: string): Promise<boolean> {
  ensureConfigured();

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.calculations,
      calculationId
    );
    return true;
  } catch (error) {
    console.error(`删除计算结果失败 (ID: ${calculationId}):`, error);
    return false;
  }
}

// ============================================
// 服务端专用操作（需要管理员权限）
// ============================================

/**
 * 服务端批量创建项目（用于数据迁移）
 * @param projects 项目数组
 * @returns 创建成功的项目数量
 */
export async function serverBatchCreateProjects(projects: Partial<Project>[]): Promise<number> {
  ensureConfigured();

  let successCount = 0;

  for (const project of projects) {
    try {
      await serverDatabases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.projects,
        ID.unique(),
        {
          userId: project.userId || 'anonymous',
          name: project.name || '未命名项目',
          industry: project.industry || '',
          targetCountry: project.targetCountry || '',
          salesChannel: project.salesChannel || '',
        }
      );
      successCount++;
    } catch (error) {
      console.error('批量创建项目失败:', error);
    }
  }

  return successCount;
}

// ============================================
// 成本因子（Cost Factors）操作 - MVP 2.0
// ============================================

/**
 * 成本因子文档类型（Appwrite格式）
 */
export interface CostFactorDocument extends AppwriteDocument {
  country: string;
  country_name_cn: string;
  country_flag?: string;
  industry: string;
  version: string;

  // M1-M8字段（完整127字段，这里简化类型定义）
  [key: string]: any;
}

/**
 * 获取成本因子
 * @param country 国家代码
 * @param industry 行业
 * @param version 版本（可选，默认最新）
 * @returns 成本因子
 */
export async function getCostFactor(
  country: TargetCountry,
  industry: Industry,
  version: string = '2025Q1'
): Promise<CostFactor | null> {
  ensureConfigured();

  try {
    const queries = [
      Query.equal('country', country),
      Query.equal('industry', industry),
      Query.equal('version', version),
    ];

    const response = await databases.listDocuments<CostFactorDocument>(
      appwriteConfig.databaseId,
      appwriteConfig.collections.costFactors,
      queries
    );

    if (response.documents.length === 0) {
      console.warn(`未找到成本因子: ${country}/${industry}/${version}`);
      return null;
    }

    const doc = response.documents[0];

    // 解析m4_logistics JSON字段
    let m4_logistics_parsed: M4Logistics | null = null;
    if (doc.m4_logistics) {
      try {
        m4_logistics_parsed = JSON.parse(doc.m4_logistics);
      } catch (e) {
        console.error('解析m4_logistics失败:', e);
      }
    }

    return {
      country: doc.country as TargetCountry,
      country_name_cn: doc.country_name_cn,
      country_flag: doc.country_flag,
      industry: doc.industry as Industry,
      version: doc.version,

      // M1字段
      m1_regulatory_agency: doc.m1_regulatory_agency,
      m1_pre_approval_required: doc.m1_pre_approval_required,
      m1_registration_required: doc.m1_registration_required,
      m1_complexity: doc.m1_complexity,
      m1_estimated_cost_usd: doc.m1_estimated_cost_usd,
      m1_data_source: doc.m1_data_source,

      // M2字段
      m2_certifications_required: doc.m2_certifications_required,
      m2_estimated_cost_usd: doc.m2_estimated_cost_usd,
      m2_data_source: doc.m2_data_source,

      // M3字段
      m3_packaging_rate: doc.m3_packaging_rate,
      m3_data_source: doc.m3_data_source,

      // M4字段
      m4_hs_code: doc.m4_hs_code,
      m4_effective_tariff_rate: doc.m4_effective_tariff_rate || 0,
      m4_tariff_notes: doc.m4_tariff_notes,
      m4_vat_rate: doc.m4_vat_rate || 0,
      m4_vat_notes: doc.m4_vat_notes,
      m4_logistics: doc.m4_logistics,
      m4_tariff_data_source: doc.m4_tariff_data_source,
      m4_vat_data_source: doc.m4_vat_data_source,

      // M5字段
      m5_last_mile_delivery_usd: doc.m5_last_mile_delivery_usd,
      m5_return_rate: doc.m5_return_rate,
      m5_return_cost_rate: doc.m5_return_cost_rate,
      m5_data_source: doc.m5_data_source,

      // M6字段
      m6_marketing_rate: doc.m6_marketing_rate,
      m6_platform_commission_rate: doc.m6_platform_commission_rate,
      m6_data_source: doc.m6_data_source,

      // M7字段
      m7_payment_rate: doc.m7_payment_rate,
      m7_payment_fixed_usd: doc.m7_payment_fixed_usd,
      m7_platform_commission_rate: doc.m7_platform_commission_rate,
      m7_data_source: doc.m7_data_source,

      // M8字段
      m8_ga_rate: doc.m8_ga_rate,
      m8_data_source: doc.m8_data_source,

      created_at: doc.$createdAt,
      updated_at: doc.$updatedAt,
    };
  } catch (error) {
    console.error(`获取成本因子失败 (${country}/${industry}/${version}):`, error);
    return null;
  }
}

/**
 * 批量获取多国成本因子
 * @param countries 国家代码数组
 * @param industry 行业
 * @param version 版本
 * @returns 成本因子数组
 */
export async function getCostFactorsByCountries(
  countries: TargetCountry[],
  industry: Industry,
  version: string = '2025Q1'
): Promise<CostFactor[]> {
  ensureConfigured();

  const results = await Promise.all(
    countries.map(country => getCostFactor(country, industry, version))
  );

  return results.filter((factor): factor is CostFactor => factor !== null);
}

/**
 * 获取所有可用国家列表
 * @param industry 行业（可选）
 * @param version 版本（可选）
 * @returns 国家列表
 */
export async function getAvailableCountries(
  industry?: Industry,
  version: string = '2025Q1'
): Promise<Array<{ country: TargetCountry; country_name_cn: string; country_flag?: string }>> {
  ensureConfigured();

  try {
    const queries = [Query.equal('version', version)];
    if (industry) {
      queries.push(Query.equal('industry', industry));
    }

    const response = await databases.listDocuments<CostFactorDocument>(
      appwriteConfig.databaseId,
      appwriteConfig.collections.costFactors,
      queries
    );

    return response.documents.map(doc => ({
      country: doc.country as TargetCountry,
      country_name_cn: doc.country_name_cn,
      country_flag: doc.country_flag,
    }));
  } catch (error) {
    console.error('获取可用国家列表失败:', error);
    return [];
  }
}

/**
 * 服务端创建成本因子（用于数据导入）
 * @param costFactor 成本因子数据
 * @returns 是否创建成功
 */
export async function serverCreateCostFactor(costFactor: Partial<CostFactor>): Promise<boolean> {
  ensureConfigured();

  try {
    await serverDatabases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.costFactors,
      ID.unique(),
      {
        country: costFactor.country,
        country_name_cn: costFactor.country_name_cn,
        country_flag: costFactor.country_flag,
        industry: costFactor.industry,
        version: costFactor.version || '2025Q1',

        // M1-M8字段（省略详细展开，根据CostFactor接口自动映射）
        ...costFactor,
      }
    );

    return true;
  } catch (error) {
    console.error('创建成本因子失败:', error);
    return false;
  }
}

/**
 * 服务端批量创建成本因子（用于数据导入）
 * @param costFactors 成本因子数组
 * @returns 创建成功的数量
 */
export async function serverBatchCreateCostFactors(costFactors: Partial<CostFactor>[]): Promise<number> {
  ensureConfigured();

  let successCount = 0;

  for (const costFactor of costFactors) {
    const success = await serverCreateCostFactor(costFactor);
    if (success) {
      successCount++;
    }
  }

  return successCount;
}

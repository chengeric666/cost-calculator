/**
 * Appwrite 客户端配置
 *
 * 提供客户端和服务端的Appwrite SDK实例
 * - 客户端实例：用于浏览器端交互
 * - 服务端实例：用于Server Components和API Routes
 */

import { Client, Databases, Account } from 'appwrite';
import { Client as ServerClient, Databases as ServerDatabases } from 'node-appwrite';

// ============================================
// 环境变量配置
// ============================================

// 前端公开变量（NEXT_PUBLIC_*）
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://apps.aotsea.com/v1';
const APPWRITE_PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT || '';
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE || '';

// MVP 2.0: 4个Collections
const APPWRITE_COLLECTION_COST_FACTORS = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_COST_FACTORS || 'cost_factors';
const APPWRITE_COLLECTION_PROJECTS = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PROJECTS || 'projects';
const APPWRITE_COLLECTION_CALCULATIONS = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_CALCULATIONS || 'calculations';
const APPWRITE_COLLECTION_COST_FACTOR_VERSIONS = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_COST_FACTOR_VERSIONS || 'cost_factor_versions';

// 服务端私密变量
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || '';

// ============================================
// 客户端实例（浏览器端使用）
// ============================================

/**
 * 创建客户端Appwrite实例
 * 用于浏览器端的用户认证和数据交互
 */
export const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT);

/**
 * 客户端数据库实例
 */
export const databases = new Databases(client);

/**
 * 客户端账号实例（用于用户认证）
 */
export const account = new Account(client);

// ============================================
// 服务端实例（Server Components/API Routes使用）
// ============================================

/**
 * 创建服务端Appwrite实例
 * 用于Server Components和API Routes的管理员操作
 */
export const serverClient = new ServerClient()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT)
  .setKey(APPWRITE_API_KEY);

/**
 * 服务端数据库实例
 */
export const serverDatabases = new ServerDatabases(serverClient);

// ============================================
// 数据库配置常量
// ============================================

/**
 * Appwrite数据库和集合配置 - MVP 2.0
 */
export const appwriteConfig = {
  endpoint: APPWRITE_ENDPOINT,
  project: APPWRITE_PROJECT,
  databaseId: APPWRITE_DATABASE_ID,
  collections: {
    costFactors: APPWRITE_COLLECTION_COST_FACTORS,
    projects: APPWRITE_COLLECTION_PROJECTS,
    calculations: APPWRITE_COLLECTION_CALCULATIONS,
    costFactorVersions: APPWRITE_COLLECTION_COST_FACTOR_VERSIONS,
  },
};

/**
 * 验证Appwrite配置是否完整 - MVP 2.0
 * @returns 配置是否有效
 */
export function isAppwriteConfigured(): boolean {
  return !!(
    APPWRITE_ENDPOINT &&
    APPWRITE_PROJECT &&
    APPWRITE_DATABASE_ID &&
    APPWRITE_COLLECTION_COST_FACTORS &&
    APPWRITE_COLLECTION_PROJECTS &&
    APPWRITE_COLLECTION_CALCULATIONS &&
    APPWRITE_COLLECTION_COST_FACTOR_VERSIONS
  );
}

/**
 * 验证服务端Appwrite配置是否完整
 * @returns 服务端配置是否有效
 */
export function isServerAppwriteConfigured(): boolean {
  return isAppwriteConfigured() && !!APPWRITE_API_KEY;
}

// ============================================
// 类型定义
// ============================================

/**
 * Appwrite查询选项
 */
export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderType?: 'ASC' | 'DESC';
}

/**
 * Appwrite文档基础类型
 */
export interface AppwriteDocument {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $databaseId: string;
  $collectionId: string;
}

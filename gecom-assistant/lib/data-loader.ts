/**
 * 混合数据源加载器
 *
 * 三层数据架构：
 * - Layer 1: TypeScript源文件 (144字段) - Git版本控制，单一真相来源
 * - Layer 2: Appwrite数据库 (60字段) - 生产环境核心计算查询
 * - Layer 3: JSON扩展文件 (84字段) - 静态资源，详细数据按需加载
 *
 * 使用场景：
 * - 成本计算页面：仅查询Layer 2（快速，60核心字段）
 * - 详情展示页面：Layer 2 + Layer 3（完整，144字段）
 * - 市场洞察页面：Layer 3（扩展字段：market_summary、warnings等）
 */

import { databases } from './appwrite-client';
import { Query } from 'appwrite';

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE!;

/**
 * 成本因子核心数据类型（Appwrite Layer 2 - 60字段）
 */
export interface CostFactorCore {
  $id: string;
  country: string;
  country_flag: string;
  country_name_cn: string;
  industry: string;
  version: string;

  // M1-M8核心字段（54个）
  m1_company_registration_usd?: number;
  m1_complexity?: string;
  // ... 其他核心字段（参见scripts/import-8-vape-filtered.ts的ALLOWED_FIELDS）

  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $databaseId: string;
  $collectionId: string;
}

/**
 * 扩展数据类型（JSON Layer 3 - 84字段）
 */
export interface CostFactorExtended {
  _metadata: {
    source_file: string;
    total_fields: number;
    core_fields: number;
    extended_fields: number;
    exported_at: string;
  };

  // 行业特定高级字段
  m1_fda_pmta_usd?: number;
  m1_fda_pmta_timeline_months?: number;
  m1_fda_pmta_approval_rate?: number;
  m1_state_registration_usd?: number;
  m1_regulatory_agency?: string;
  m1_regulatory_complexity?: string;

  m2_product_testing_usd?: number;
  m2_child_resistant_packaging_usd?: number;
  m2_ul8139_certification_usd?: number;

  // 平台限制字段
  m5_fedex_dtc_banned?: boolean;
  m5_ups_dtc_banned?: boolean;
  m5_usps_dtc_banned?: boolean;
  m5_online_sales_ban?: boolean;
  m5_alternative_shipping_cost_usd_per_kg?: number;

  m6_amazon_banned?: boolean;
  m6_ebay_banned?: boolean;
  m6_facebook_ads_restricted?: boolean;
  m6_google_ads_restricted?: boolean;
  m6_dtc_website_setup_usd?: number;
  m6_ltv_usd?: number;
  m6_repeat_purchase_rate?: number;

  m7_high_risk_processing_fee?: number;
  m8_compliance_staff_usd?: number;

  // 数据溯源字段
  m1_base_data_source?: string;
  m1_base_tier?: string;
  m1_base_collected_at?: string;
  m1_specific_data_source?: string;
  m1_specific_tier?: string;
  m1_specific_collected_at?: string;

  m2_trademark_collected_at?: string;
  m2_compliance_data_source?: string;
  m2_compliance_tier?: string;
  m2_compliance_collected_at?: string;

  // 市场洞察汇总
  market_status?: string;
  market_warnings?: string[];
  market_summary?: {
    status: string;
    entry_difficulty: string;
    regulatory_risk: string;
    recommended_channels?: string[];
    prohibited_channels?: string[];
    key_regulations?: string[];
    key_advantages?: string[];
    key_challenges?: string[];
    market_size_usd?: number;
    growth_rate_yoy?: number;
    competition_level?: string;
  };

  // 数据质量
  data_quality_notes?: string;
  backfill_status?: string;
  backfill_date?: string;

  // ... 其他扩展字段
  [key: string]: any;
}

/**
 * 完整成本因子数据（核心+扩展）
 */
export interface CostFactorComplete extends CostFactorCore {
  extended?: CostFactorExtended;
}

/**
 * 数据加载选项
 */
export interface LoadOptions {
  /** 是否包含扩展数据（Layer 3） */
  includeExtended?: boolean;
  /** 是否启用缓存 */
  cache?: boolean;
}

/**
 * 内存缓存（浏览器端）
 */
const memoryCache = new Map<string, {
  data: any;
  timestamp: number;
  ttl: number;
}>();

const CACHE_TTL = 5 * 60 * 1000; // 5分钟缓存

/**
 * 从缓存获取数据
 */
function getFromCache(key: string): any | null {
  const cached = memoryCache.get(key);
  if (!cached) return null;

  const now = Date.now();
  if (now - cached.timestamp > cached.ttl) {
    memoryCache.delete(key);
    return null;
  }

  return cached.data;
}

/**
 * 写入缓存
 */
function setCache(key: string, data: any, ttl: number = CACHE_TTL) {
  memoryCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
}

/**
 * 加载成本因子核心数据（Layer 2: Appwrite）
 */
export async function loadCostFactorCore(
  country: string,
  industry: string
): Promise<CostFactorCore | null> {
  const cacheKey = `core:${country}:${industry}`;

  // 检查缓存
  const cached = getFromCache(cacheKey);
  if (cached) {
    console.log(`[DataLoader] 从缓存加载 ${cacheKey}`);
    return cached;
  }

  try {
    const result = await databases.listDocuments(DB_ID, 'cost_factors', [
      Query.equal('country', [country]),
      Query.equal('industry', [industry]),
      Query.limit(1),
    ]);

    if (result.total === 0) {
      console.warn(`[DataLoader] 未找到数据: ${country} ${industry}`);
      return null;
    }

    const data = result.documents[0] as CostFactorCore;
    setCache(cacheKey, data);
    console.log(`[DataLoader] 从Appwrite加载 ${cacheKey} (${result.total}条)`);
    return data;
  } catch (error) {
    console.error(`[DataLoader] 加载失败 ${cacheKey}:`, error);
    return null;
  }
}

/**
 * 加载扩展数据（Layer 3: JSON静态文件）
 */
export async function loadCostFactorExtended(
  country: string,
  industry: string
): Promise<CostFactorExtended | null> {
  const cacheKey = `extended:${country}:${industry}`;

  // 检查缓存
  const cached = getFromCache(cacheKey);
  if (cached) {
    console.log(`[DataLoader] 从缓存加载 ${cacheKey}`);
    return cached;
  }

  try {
    const response = await fetch(
      `/data/${industry}-extended/${country}-${industry}-extended.json`
    );

    if (!response.ok) {
      console.warn(`[DataLoader] 扩展数据不存在: ${country} ${industry}`);
      return null;
    }

    const data = await response.json();
    setCache(cacheKey, data, CACHE_TTL * 2); // JSON静态文件可以缓存更久
    console.log(`[DataLoader] 从JSON加载 ${cacheKey} (${data._metadata.extended_fields}字段)`);
    return data;
  } catch (error) {
    console.error(`[DataLoader] 加载扩展数据失败 ${cacheKey}:`, error);
    return null;
  }
}

/**
 * 加载完整成本因子数据（Layer 2 + Layer 3）
 */
export async function loadCostFactor(
  country: string,
  industry: string,
  options: LoadOptions = {}
): Promise<CostFactorComplete | null> {
  const { includeExtended = false, cache = true } = options;

  // 始终加载核心数据
  const coreData = await loadCostFactorCore(country, industry);
  if (!coreData) {
    return null;
  }

  const result: CostFactorComplete = { ...coreData };

  // 如果需要扩展数据，则加载Layer 3
  if (includeExtended) {
    const extendedData = await loadCostFactorExtended(country, industry);
    if (extendedData) {
      result.extended = extendedData;
      console.log(
        `[DataLoader] 完整数据加载成功: ${country} ${industry} (核心60 + 扩展${extendedData._metadata.extended_fields})`
      );
    } else {
      console.warn(`[DataLoader] 扩展数据加载失败，仅返回核心数据`);
    }
  }

  return result;
}

/**
 * 批量加载多个国家的成本因子数据
 */
export async function loadMultipleCostFactors(
  countries: string[],
  industry: string,
  options: LoadOptions = {}
): Promise<CostFactorComplete[]> {
  const promises = countries.map((country) =>
    loadCostFactor(country, industry, options)
  );

  const results = await Promise.all(promises);

  // 过滤掉null值
  return results.filter((data): data is CostFactorComplete => data !== null);
}

/**
 * 清除缓存
 */
export function clearCache(pattern?: string) {
  if (!pattern) {
    memoryCache.clear();
    console.log('[DataLoader] 清除所有缓存');
    return;
  }

  let count = 0;
  for (const key of memoryCache.keys()) {
    if (key.includes(pattern)) {
      memoryCache.delete(key);
      count++;
    }
  }
  console.log(`[DataLoader] 清除缓存 (匹配"${pattern}"): ${count}条`);
}

/**
 * 获取缓存统计
 */
export function getCacheStats() {
  return {
    size: memoryCache.size,
    keys: Array.from(memoryCache.keys()),
  };
}

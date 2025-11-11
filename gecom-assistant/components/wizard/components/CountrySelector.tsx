'use client';

/**
 * CountrySelector - 19国目标市场选择组件
 *
 * MVP 2.0特性：
 * - 19国完整列表（按大洲分组）
 * - 搜索过滤功能
 * - 国旗emoji显示
 * - 数据可用性徽章（Tier 1/2/3）
 * - 市场规模提示
 */

import { useState } from 'react';
import { Industry, TargetCountry } from '@/types/gecom';
import { Search, Check } from 'lucide-react';

interface CountrySelectorProps {
  selectedCountry: TargetCountry;
  industry: Industry;
  onSelect: (country: TargetCountry) => void;
}

// 19国完整数据（按大洲分组）- 增强版：核心成本指标 + 数据溯源
const COUNTRIES_BY_REGION = {
  '北美洲': [
    {
      code: 'US' as TargetCountry,
      name: '美国',
      nameEn: 'United States',
      flag: '🇺🇸',
      tier: 1,
      marketSize: '$50B',
      tariff: '55%',
      vat: '0-10%',
      status: '开放',
      dataSource: 'USITC (美国国际贸易委员会)',
      sourceUrl: 'https://hts.usitc.gov/'
    },
    {
      code: 'CA' as TargetCountry,
      name: '加拿大',
      nameEn: 'Canada',
      flag: '🇨🇦',
      tier: 1,
      marketSize: '$5B',
      tariff: '0-6.5%',
      vat: '5% GST',
      status: '开放',
      dataSource: 'CBSA (加拿大边境服务局)',
      sourceUrl: 'https://www.cbsa-asfc.gc.ca/'
    },
    {
      code: 'MX' as TargetCountry,
      name: '墨西哥',
      nameEn: 'Mexico',
      flag: '🇲🇽',
      tier: 2,
      marketSize: '$3.5B',
      tariff: '0-20%',
      vat: '16% IVA',
      status: '开放',
      dataSource: 'SAT (墨西哥税务局)',
      sourceUrl: 'https://www.sat.gob.mx/'
    },
  ],
  '欧洲': [
    {
      code: 'GB' as TargetCountry,
      name: '英国',
      nameEn: 'United Kingdom',
      flag: '🇬🇧',
      tier: 1,
      marketSize: '$8B',
      tariff: '0%',
      vat: '20%',
      status: '开放',
      dataSource: 'GOV.UK (英国政府官网)',
      sourceUrl: 'https://www.gov.uk/trade-tariff'
    },
    {
      code: 'DE' as TargetCountry,
      name: '德国',
      nameEn: 'Germany',
      flag: '🇩🇪',
      tier: 1,
      marketSize: '$10B',
      tariff: '0%',
      vat: '19%',
      status: '开放',
      dataSource: 'EU TARIC (欧盟关税数据库)',
      sourceUrl: 'https://ec.europa.eu/taxation_customs/dds2/taric'
    },
    { code: 'FR' as TargetCountry, name: '法国', nameEn: 'France', flag: '🇫🇷', tier: 1, marketSize: '$6B', tariff: '0%', vat: '20%', status: '开放', dataSource: 'EU TARIC', sourceUrl: 'https://ec.europa.eu/taxation_customs/dds2/taric' },
    { code: 'IT' as TargetCountry, name: '意大利', nameEn: 'Italy', flag: '🇮🇹', tier: 2, marketSize: '$4B', tariff: '0%', vat: '22%', status: '开放', dataSource: 'EU TARIC', sourceUrl: 'https://ec.europa.eu/taxation_customs/dds2/taric' },
    { code: 'ES' as TargetCountry, name: '西班牙', nameEn: 'Spain', flag: '🇪🇸', tier: 2, marketSize: '$3B', tariff: '0%', vat: '21%', status: '开放', dataSource: 'EU TARIC', sourceUrl: 'https://ec.europa.eu/taxation_customs/dds2/taric' },
  ],
  '亚太地区': [
    {
      code: 'JP' as TargetCountry,
      name: '日本',
      nameEn: 'Japan',
      flag: '🇯🇵',
      tier: 1,
      marketSize: '$15B',
      tariff: '0-9.6%',
      vat: '10%',
      status: '开放',
      dataSource: 'Japan Customs (日本海关)',
      sourceUrl: 'https://www.customs.go.jp/'
    },
    { code: 'KR' as TargetCountry, name: '韩国', nameEn: 'South Korea', flag: '🇰🇷', tier: 2, marketSize: '$2.5B', tariff: '0-8%', vat: '10%', status: '开放', dataSource: 'Korea Customs', sourceUrl: 'https://www.customs.go.kr/' },
    { code: 'AU' as TargetCountry, name: '澳大利亚', nameEn: 'Australia', flag: '🇦🇺', tier: 1, marketSize: '$3.9B', tariff: '0-5%', vat: '10% GST', status: '开放', dataSource: 'Australian Border Force', sourceUrl: 'https://www.abf.gov.au/' },
    { code: 'SG' as TargetCountry, name: '新加坡', nameEn: 'Singapore', flag: '🇸🇬', tier: 1, marketSize: '$0.8B', tariff: '0%', vat: '9% GST', status: '开放', dataSource: 'Singapore Customs', sourceUrl: 'https://www.customs.gov.sg/' },
    { code: 'MY' as TargetCountry, name: '马来西亚', nameEn: 'Malaysia', flag: '🇲🇾', tier: 2, marketSize: '$1.2B', tariff: '0-30%', vat: '10%', status: '开放', dataSource: 'Royal Malaysian Customs', sourceUrl: 'http://www.customs.gov.my/' },
    { code: 'TH' as TargetCountry, name: '泰国', nameEn: 'Thailand', flag: '🇹🇭', tier: 2, marketSize: '$1.8B', tariff: '0-30%', vat: '7%', status: '开放', dataSource: 'Thai Customs', sourceUrl: 'https://www.customs.go.th/' },
    { code: 'VN' as TargetCountry, name: '越南', nameEn: 'Vietnam', flag: '🇻🇳', tier: 2, marketSize: '$1.5B', tariff: '0-50%', vat: '10%', status: '开放', dataSource: 'Vietnam Customs', sourceUrl: 'https://www.customs.gov.vn/' },
    { code: 'PH' as TargetCountry, name: '菲律宾', nameEn: 'Philippines', flag: '🇵🇭', tier: 2, marketSize: '$1.0B', tariff: '0-30%', vat: '12%', status: '开放', dataSource: 'BOC Philippines', sourceUrl: 'https://customs.gov.ph/' },
    { code: 'ID' as TargetCountry, name: '印度尼西亚', nameEn: 'Indonesia', flag: '🇮🇩', tier: 2, marketSize: '$2.0B', tariff: '0-150%', vat: '11%', status: '开放', dataSource: 'Indonesia Customs', sourceUrl: 'https://www.beacukai.go.id/' },
    { code: 'IN' as TargetCountry, name: '印度', nameEn: 'India', flag: '🇮🇳', tier: 2, marketSize: '$3.5B', tariff: '0-100%', vat: '18% GST', status: '开放', dataSource: 'Indian Customs (CBIC)', sourceUrl: 'https://www.cbic.gov.in/' },
  ],
  '中东': [
    { code: 'AE' as TargetCountry, name: '阿联酋', nameEn: 'United Arab Emirates', flag: '🇦🇪', tier: 2, marketSize: '$1.5B', tariff: '5%', vat: '5%', status: '开放', dataSource: 'Federal Customs Authority', sourceUrl: 'https://www.fca.gov.ae/' },
    { code: 'SA' as TargetCountry, name: '沙特阿拉伯', nameEn: 'Saudi Arabia', flag: '🇸🇦', tier: 2, marketSize: '$2.0B', tariff: '5%', vat: '15%', status: '开放', dataSource: 'Saudi Customs (ZATCA)', sourceUrl: 'https://zatca.gov.sa/' },
  ],
  '拉丁美洲': [
    { code: 'BR' as TargetCountry, name: '巴西', nameEn: 'Brazil', flag: '🇧🇷', tier: 2, marketSize: '$4.5B', tariff: '0-35%', vat: '17% ICMS', status: '开放', dataSource: 'Receita Federal (巴西联邦税务局)', sourceUrl: 'https://www.gov.br/receitafederal/' },
  ],
};

export default function CountrySelector({ selectedCountry, industry, onSelect }: CountrySelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // 过滤国家列表
  const filteredRegions = Object.entries(COUNTRIES_BY_REGION).reduce((acc, [region, countries]) => {
    const filtered = countries.filter(
      (country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filtered.length > 0) {
      (acc as any)[region] = filtered;
    }

    return acc;
  }, {} as typeof COUNTRIES_BY_REGION);

  // 获取Tier徽章样式
  const getTierBadge = (tier: number) => {
    const styles = {
      1: 'bg-green-100 text-green-700 border-green-300',
      2: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      3: 'bg-gray-100 text-gray-700 border-gray-300',
    };

    return (
      <span className={`text-xs px-2 py-0.5 rounded-full border ${styles[tier as keyof typeof styles]}`}>
        Tier {tier}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* 搜索框 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="搜索国家名称..."
          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
        />
      </div>

      {/* 国家列表（按大洲分组） */}
      <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
        {Object.entries(filteredRegions).map(([region, countries]) => (
          <div key={region}>
            <h4 className="text-sm font-semibold text-gray-500 mb-2">{region}</h4>
            <div className="space-y-2">
              {countries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => onSelect(country.code)}
                  className={`
                    w-full p-3 rounded-lg border-2 transition-all duration-200 text-left
                    ${selectedCountry === country.code
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                    }
                  `}
                >
                  {/* 第一行：国旗+名称+Tier+选中图标 */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{country.flag}</span>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{country.name}</div>
                        <div className="text-xs text-gray-500">{country.nameEn}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTierBadge(country.tier)}
                      {selectedCountry === country.code && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </div>

                  {/* 第二行：核心成本指标（3列紧凑布局）*/}
                  {(country as any).tariff && (
                    <div className="grid grid-cols-3 gap-2 mb-2 text-xs">
                      <div className="bg-gray-50 rounded px-2 py-1">
                        <div className="text-gray-500">关税</div>
                        <div className="font-bold text-gray-900">{(country as any).tariff}</div>
                      </div>
                      <div className="bg-gray-50 rounded px-2 py-1">
                        <div className="text-gray-500">VAT</div>
                        <div className="font-bold text-gray-900">{(country as any).vat}</div>
                      </div>
                      <div className="bg-gray-50 rounded px-2 py-1">
                        <div className="text-gray-500">状态</div>
                        <div className="font-bold text-green-700">{(country as any).status || '开放'}</div>
                      </div>
                    </div>
                  )}

                  {/* 第三行：数据来源（可点击链接）*/}
                  {(country as any).dataSource && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 flex items-center gap-1">
                        📎 数据源:
                        <a
                          href={(country as any).sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {(country as any).dataSource}
                        </a>
                      </span>
                      <span className="text-gray-400">市场 {country.marketSize}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 无结果提示 */}
      {Object.keys(filteredRegions).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>未找到匹配的国家</p>
          <p className="text-sm mt-1">尝试搜索国家名称或代码</p>
        </div>
      )}

      {/* 数据说明 */}
      <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
        <p className="font-semibold mb-2">数据质量说明：</p>
        <ul className="space-y-1">
          <li className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full border bg-green-100 text-green-700 border-green-300">
              Tier 1
            </span>
            <span>官方数据，100%可信</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full border bg-yellow-100 text-yellow-700 border-yellow-300">
              Tier 2
            </span>
            <span>权威来源，90%可信</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full border bg-gray-100 text-gray-700 border-gray-300">
              Tier 3
            </span>
            <span>估算数据，80%可信</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

'use client';

import { Project, Industry, TargetCountry, SalesChannel } from '@/types/gecom';
import { Target, Globe, ShoppingCart } from 'lucide-react';

interface Step1StrategicProps {
  project: Partial<Project>;
  onUpdate: (updates: Partial<Project>) => void;
}

export default function Step1Strategic({ project, onUpdate }: Step1StrategicProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">战略对齐</h2>
        <p className="text-gray-600">
          定义业务目标和目标市场配置
        </p>
      </div>

      {/* Project name */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          项目名称
        </label>
        <input
          type="text"
          value={project.name || ''}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="例如：宠物用品美国市场"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        />
      </div>

      {/* Industry selection */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-blue-600" />
          <label className="text-sm font-medium text-gray-700">行业类别</label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <IndustryCard
            industry="pet"
            title="宠物用品"
            description="宠物食品、玩具、配件"
            selected={project.industry === 'pet'}
            onClick={() => onUpdate({ industry: 'pet' })}
          />
          <IndustryCard
            industry="vape"
            title="电子烟"
            description="雾化设备、烟油"
            selected={project.industry === 'vape'}
            onClick={() => onUpdate({ industry: 'vape' })}
          />
        </div>
      </div>

      {/* Target country */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-blue-600" />
          <label className="text-sm font-medium text-gray-700">目标市场</label>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <CountryCard
            country="US"
            title="美国"
            flag="🇺🇸"
            selected={project.targetCountry === 'US'}
            onClick={() => onUpdate({ targetCountry: 'US' })}
          />
          <CountryCard
            country="VN"
            title="越南"
            flag="🇻🇳"
            selected={project.targetCountry === 'VN'}
            onClick={() => onUpdate({ targetCountry: 'VN' })}
          />
          <CountryCard
            country="PH"
            title="菲律宾"
            flag="🇵🇭"
            selected={project.targetCountry === 'PH'}
            onClick={() => onUpdate({ targetCountry: 'PH' })}
          />
        </div>
      </div>

      {/* Sales channel */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="h-5 w-5 text-blue-600" />
          <label className="text-sm font-medium text-gray-700">销售渠道</label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ChannelCard
            channel="amazon_fba"
            title="Amazon FBA"
            description="亚马逊物流"
            selected={project.salesChannel === 'amazon_fba'}
            onClick={() => onUpdate({ salesChannel: 'amazon_fba' })}
          />
          <ChannelCard
            channel="shopee"
            title="Shopee"
            description="东南亚电商平台"
            selected={project.salesChannel === 'shopee'}
            onClick={() => onUpdate({ salesChannel: 'shopee' })}
          />
          <ChannelCard
            channel="dtc"
            title="直营电商(DTC)"
            description="自建网站（Shopify）"
            selected={project.salesChannel === 'dtc'}
            onClick={() => onUpdate({ salesChannel: 'dtc' })}
          />
          <ChannelCard
            channel="o2o"
            title="线上到线下(O2O)"
            description="本地零售+配送"
            selected={project.salesChannel === 'o2o'}
            onClick={() => onUpdate({ salesChannel: 'o2o' })}
          />
        </div>
      </div>
    </div>
  );
}

function IndustryCard({
  industry,
  title,
  description,
  selected,
  onClick,
}: {
  industry: string;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-4 rounded-lg border-2 transition-all ${
        selected
          ? 'border-blue-600 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="font-semibold text-gray-900 mb-1">{title}</div>
      <div className="text-sm text-gray-600">{description}</div>
    </button>
  );
}

function CountryCard({
  country,
  title,
  flag,
  selected,
  onClick,
}: {
  country: string;
  title: string;
  flag: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-center p-4 rounded-lg border-2 transition-all ${
        selected
          ? 'border-blue-600 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="text-3xl mb-2">{flag}</div>
      <div className="font-semibold text-gray-900 text-sm">{title}</div>
    </button>
  );
}

function ChannelCard({
  channel,
  title,
  description,
  selected,
  onClick,
}: {
  channel: string;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-4 rounded-lg border-2 transition-all ${
        selected
          ? 'border-blue-600 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="font-semibold text-gray-900 mb-1">{title}</div>
      <div className="text-sm text-gray-600">{description}</div>
    </button>
  );
}

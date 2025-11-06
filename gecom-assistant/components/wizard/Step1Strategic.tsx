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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Strategic Alignment</h2>
        <p className="text-gray-600">
          Define your business goals and target market configuration
        </p>
      </div>

      {/* Project name */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Name
        </label>
        <input
          type="text"
          value={project.name || ''}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="e.g., Pet Products US Launch"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        />
      </div>

      {/* Industry selection */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-blue-600" />
          <label className="text-sm font-medium text-gray-700">Industry</label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <IndustryCard
            industry="pet"
            title="Pet Products"
            description="Pet food, toys, accessories"
            selected={project.industry === 'pet'}
            onClick={() => onUpdate({ industry: 'pet' })}
          />
          <IndustryCard
            industry="vape"
            title="Vape / E-Cigarettes"
            description="Vaping devices, e-liquids"
            selected={project.industry === 'vape'}
            onClick={() => onUpdate({ industry: 'vape' })}
          />
        </div>
      </div>

      {/* Target country */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-blue-600" />
          <label className="text-sm font-medium text-gray-700">Target Market</label>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <CountryCard
            country="US"
            title="United States"
            flag="🇺🇸"
            selected={project.targetCountry === 'US'}
            onClick={() => onUpdate({ targetCountry: 'US' })}
          />
          <CountryCard
            country="VN"
            title="Vietnam"
            flag="🇻🇳"
            selected={project.targetCountry === 'VN'}
            onClick={() => onUpdate({ targetCountry: 'VN' })}
          />
          <CountryCard
            country="PH"
            title="Philippines"
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
          <label className="text-sm font-medium text-gray-700">Sales Channel</label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ChannelCard
            channel="amazon_fba"
            title="Amazon FBA"
            description="Fulfillment by Amazon"
            selected={project.salesChannel === 'amazon_fba'}
            onClick={() => onUpdate({ salesChannel: 'amazon_fba' })}
          />
          <ChannelCard
            channel="shopee"
            title="Shopee"
            description="Southeast Asia platform"
            selected={project.salesChannel === 'shopee'}
            onClick={() => onUpdate({ salesChannel: 'shopee' })}
          />
          <ChannelCard
            channel="dtc"
            title="Direct-to-Consumer"
            description="Own website (Shopify)"
            selected={project.salesChannel === 'dtc'}
            onClick={() => onUpdate({ salesChannel: 'dtc' })}
          />
          <ChannelCard
            channel="o2o"
            title="Online-to-Offline"
            description="Local retail + delivery"
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

import React, { useState } from 'react';
import { Search, X, Flame, ShieldAlert, Sparkles, Globe } from 'lucide-react';
import { Cigarette, RegionCategory } from '../types';
import { CIGARETTES_DATA } from '../data/cigarettes';

interface CigaretteSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCigarette: Cigarette;
  onSelect: (cig: Cigarette) => void;
}

export const CigaretteSelector: React.FC<CigaretteSelectorProps> = ({
  isOpen,
  onClose,
  selectedCigarette,
  onSelect
}) => {
  const [activeTab, setActiveTab] = useState<RegionCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const categories: { key: RegionCategory; label: string }[] = [
    { key: 'all', label: '全部名烟' },
    { key: 'china', label: '中国国粹' },
    { key: 'americas', label: '美洲风云' },
    { key: 'asia', label: '日韩典范' },
    { key: 'europe', label: '欧洲贵族' },
    { key: 'special', label: '雪茄/丁香' }
  ];

  const filteredList = CIGARETTES_DATA.filter((cig) => {
    const matchesTab = activeTab === 'all' || cig.regionCategory === activeTab;
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      cig.name.toLowerCase().includes(query) ||
      cig.nameEn.toLowerCase().includes(query) ||
      cig.brand.toLowerCase().includes(query) ||
      cig.country.toLowerCase().includes(query) ||
      cig.flavorNotes.some((n) => n.toLowerCase().includes(query));
    return matchesTab && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md transition-all p-0 sm:p-4">
      <div
        id="cigarette-selector-modal"
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-t-2xl sm:rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-zinc-100">
                世界名烟馆 · 品类切换
              </h2>
              <p className="text-xs text-zinc-400">
                收录全球16+款殿堂级名品烟草，支持物理模拟点燃
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-zinc-800/80 bg-zinc-900">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索香烟名称、产地、风味 (如：中华、万宝路、陈皮、薄荷)..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveTab(cat.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === cat.key
                    ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cigarette Card Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredList.map((cig) => {
            const isSelected = cig.id === selectedCigarette.id;
            return (
              <div
                key={cig.id}
                id={`cigarette-card-${cig.id}`}
                onClick={() => {
                  onSelect(cig);
                  onClose();
                }}
                className={`relative p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-amber-950/40 via-zinc-800 to-zinc-900 border-amber-500/80 shadow-lg ring-2 ring-amber-500/20'
                    : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80'
                }`}
              >
                {/* Top Row: Rarity Tag & Country */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider"
                    style={{
                      backgroundColor: `${cig.packTheme.primary}40`,
                      color: cig.packTheme.accent,
                      border: `1px solid ${cig.packTheme.accent}60`
                    }}
                  >
                    {cig.rarity || '经典'}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-medium">
                    {cig.country}
                  </span>
                </div>

                {/* Brand Name & English */}
                <div className="mb-2">
                  <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                    {cig.name}
                    {cig.hasBead && (
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" title="内含爆珠" />
                    )}
                  </h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-1">
                    {cig.nameEn}
                  </p>
                </div>

                {/* Specs: Tar, Nicotine, CO */}
                <div className="grid grid-cols-3 gap-1 py-1.5 px-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80 text-center text-[10px] mb-2">
                  <div>
                    <span className="text-zinc-500 block">焦油量</span>
                    <strong className="text-amber-400 font-mono font-bold">
                      {cig.tar}mg
                    </strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">烟气烟碱</span>
                    <strong className="text-zinc-300 font-mono font-bold">
                      {cig.nicotine}mg
                    </strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">一氧化碳</span>
                    <strong className="text-zinc-300 font-mono font-bold">
                      {cig.carbonMonoxide}mg
                    </strong>
                  </div>
                </div>

                {/* Flavor Notes Pill Tags */}
                <div className="flex flex-wrap gap-1">
                  {cig.flavorNotes.slice(0, 3).map((flavor, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-300 border border-zinc-700/60"
                    >
                      {flavor}
                    </span>
                  ))}
                  <span className="text-[10px] text-zinc-500 self-center ml-auto font-mono">
                    {cig.yearIntroduced}年创
                  </span>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold text-amber-400">
                    <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>当前装填</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Warning */}
        <div className="p-2.5 bg-zinc-950 border-t border-zinc-800 text-center text-[11px] text-zinc-400 flex items-center justify-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
          <span>吸烟有害健康 · 电子模拟鉴赏 · 未成年人严禁吸烟</span>
        </div>
      </div>
    </div>
  );
};

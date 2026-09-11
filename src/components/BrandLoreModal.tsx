import React from 'react';
import { X, BookOpen, Award, Flame, ShieldAlert, Sparkles } from 'lucide-react';
import { Cigarette } from '../types';

interface BrandLoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  cigarette: Cigarette;
  onOpenShare: () => void;
}

export const BrandLoreModal: React.FC<BrandLoreModalProps> = ({
  isOpen,
  onClose,
  cigarette,
  onOpenShare
}) => {
  if (!isOpen) return null;

  // Tar level indicator logic
  const getTarLabel = (tar: number) => {
    if (tar <= 6) return { text: '低焦油清爽级', color: 'text-emerald-400', bg: 'bg-emerald-950/50 border-emerald-800' };
    if (tar <= 10) return { text: '中焦油平衡级', color: 'text-amber-400', bg: 'bg-amber-950/50 border-amber-800' };
    if (tar <= 15) return { text: '高焦油浓郁级', color: 'text-orange-400', bg: 'bg-orange-950/50 border-orange-800' };
    return { text: '特重丁香重击级', color: 'text-red-400', bg: 'bg-red-950/50 border-red-800' };
  };

  const tarInfo = getTarLabel(cigarette.tar);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4">
      <div
        id="brand-lore-modal"
        className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-t-2xl sm:rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl overflow-hidden"
      >
        {/* Banner Header with Pack Theme */}
        <div
          className="p-6 relative overflow-hidden flex flex-col justify-end min-h-[130px] border-b border-white/10"
          style={{
            background: `linear-gradient(135deg, ${cigarette.packTheme.primary} 0%, #18181b 90%)`
          }}
        >
          {/* Subtle background glow */}
          <div className="absolute right-0 top-0 w-64 h-64 rounded-full blur-3xl opacity-20 bg-white pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white/80 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Tag & Origin */}
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider"
              style={{
                backgroundColor: cigarette.packTheme.accent,
                color: '#111827'
              }}
            >
              {cigarette.rarity || '经典名烟'}
            </span>
            <span className="text-xs text-zinc-300 font-medium">
              {cigarette.country} · {cigarette.yearIntroduced}年创
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            {cigarette.name}
          </h2>
          <p className="text-xs text-zinc-300 font-light mt-0.5">
            {cigarette.nameEn}
          </p>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Tagline */}
          <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 text-center italic text-sm text-amber-200/90 font-serif">
            “{cigarette.tagline}”
          </div>

          {/* Tar & Chemical Content Analysis */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>理化数据与焦油档案</span>
              </h3>
              <span className={`text-[11px] px-2 py-0.5 rounded border font-medium ${tarInfo.bg} ${tarInfo.color}`}>
                {tarInfo.text}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* Tar */}
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                <span className="text-xs text-zinc-400 block mb-1">焦油量 (Tar)</span>
                <div className="text-xl font-mono font-extrabold text-amber-400">
                  {cigarette.tar}
                  <span className="text-xs text-zinc-400 font-normal ml-0.5">mg</span>
                </div>
                {/* Visual bar */}
                <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${Math.min(100, (cigarette.tar / 15) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Nicotine */}
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                <span className="text-xs text-zinc-400 block mb-1">烟气烟碱 (Nicotine)</span>
                <div className="text-xl font-mono font-extrabold text-zinc-100">
                  {cigarette.nicotine}
                  <span className="text-xs text-zinc-400 font-normal ml-0.5">mg</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-zinc-400 rounded-full"
                    style={{ width: `${Math.min(100, (cigarette.nicotine / 1.5) * 100)}%` }}
                  />
                </div>
              </div>

              {/* CO */}
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                <span className="text-xs text-zinc-400 block mb-1">一氧化碳 (CO)</span>
                <div className="text-xl font-mono font-extrabold text-zinc-300">
                  {cigarette.carbonMonoxide}
                  <span className="text-xs text-zinc-400 font-normal ml-0.5">mg</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-zinc-500 rounded-full"
                    style={{ width: `${Math.min(100, (cigarette.carbonMonoxide / 15) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Flavor Notes and Characteristics */}
          <div>
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>香型特点与风味图谱</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                类型: {cigarette.type}
              </span>
              {cigarette.hasBead && (
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/40">
                  特色爆珠: {cigarette.beadFlavor}
                </span>
              )}
              {cigarette.flavorNotes.map((flavor, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg text-xs bg-zinc-800 text-zinc-200 border border-zinc-700"
                >
                  #{flavor}
                </span>
              ))}
            </div>
          </div>

          {/* Historical Lore & Cultural Background */}
          <div>
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>百年历史与文化底蕴</span>
            </h3>
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs sm:text-sm leading-relaxed tracking-wide space-y-2">
              <p>{cigarette.history}</p>
            </div>
          </div>

          {/* Health Warning */}
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-900/60 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="text-xs text-red-200/90 leading-relaxed">
              <strong>健康与法规警示：</strong>
              本模拟器仅用于世界烟草文化、工业设计历史与物理渲染鉴赏。吸烟严重危害身体健康，可能导致多种慢性疾病。未成年人严禁购买及吸食烟草制品。
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium cursor-pointer transition-colors"
          >
            返回点烟台
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenShare();
            }}
            className="flex-1 max-w-[200px] flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-xs shadow-lg cursor-pointer transition-all active:scale-95"
          >
            <Flame className="w-4 h-4" />
            <span>生成品鉴分享卡</span>
          </button>
        </div>
      </div>
    </div>
  );
};

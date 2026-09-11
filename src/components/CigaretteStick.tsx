import React, { useRef, useEffect } from 'react';
import { Sparkles, Trash2, Wind } from 'lucide-react';
import { Cigarette } from '../types';
import { soundEngine } from '../utils/audio';

interface CigaretteStickProps {
  cigarette: Cigarette;
  isLit: boolean;
  burnProgress: number; // 0 (full length) to 100 (smoked down to filter)
  ashLength: number; // 0 to 100% of current ash clump
  isInhaling: boolean;
  beadPopped: boolean;
  onPopBead: () => void;
  onTipPositionChange: (pos: { x: number; y: number } | null) => void;
  onFlickAsh: () => void;
  onInhaleStart: () => void;
  onInhaleEnd: () => void;
  onExtinguish: () => void;
  isDragging?: boolean;
}

export const CigaretteStick: React.FC<CigaretteStickProps> = ({
  cigarette,
  isLit,
  burnProgress,
  ashLength,
  isInhaling,
  beadPopped,
  onPopBead,
  onTipPositionChange,
  onFlickAsh,
  onInhaleStart,
  onInhaleEnd,
  onExtinguish,
  isDragging = false
}) => {
  const tipRef = useRef<HTMLDivElement | null>(null);

  // Monitor tip position for ignition & smoke rendering
  useEffect(() => {
    const updateTip = () => {
      if (tipRef.current) {
        const rect = tipRef.current.getBoundingClientRect();
        onTipPositionChange({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
      }
    };

    updateTip();
    const interval = setInterval(updateTip, 60);
    return () => clearInterval(interval);
  }, [onTipPositionChange, burnProgress, ashLength]);

  // Dimension scaling based on cigarette length type
  const isSlim = cigarette.length === 'slim';
  const stickWidth = isSlim ? 'w-5' : 'w-7';
  const filterHeight = isSlim ? 'h-24' : 'h-20';

  // Calculate remaining unburnt tobacco length in px (max 180px down to 10px)
  const maxTobaccoHeight = isSlim ? 210 : 180;
  const remainingTobaccoHeight = Math.max(10, maxTobaccoHeight * (1 - burnProgress / 100));

  // Ash height in px
  const currentAshHeight = Math.min(45, (ashLength / 100) * 45);

  const handlePopBeadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!beadPopped) {
      soundEngine.playBeadPop();
      onPopBead();
    }
  };

  return (
    <div className="relative flex flex-col items-center select-none" id="cigarette-assembly">
      {/* Action shortcuts floating above tip */}
      {isLit && (
        <div className="absolute -top-14 flex items-center gap-2 z-40">
          <button
            id="flick-ash-btn"
            type="button"
            onClick={onFlickAsh}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/90 hover:bg-zinc-700 text-xs text-zinc-200 border border-zinc-600/50 shadow-lg cursor-pointer active:scale-95 transition-all"
            title="点击弹落烟灰"
          >
            <Trash2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>弹烟灰</span>
            {ashLength > 30 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </button>

          <button
            id="extinguish-btn"
            type="button"
            onClick={onExtinguish}
            className="px-2.5 py-1 rounded-full bg-red-950/80 hover:bg-red-900 text-xs text-red-300 border border-red-800/50 shadow-lg cursor-pointer active:scale-95 transition-all"
            title="掐灭香烟"
          >
            掐灭
          </button>
        </div>
      )}

      {/* Main Cigarette Model */}
      <div className={`relative flex flex-col items-center shadow-2xl rounded-full ${stickWidth}`}>
        {/* Burning Tip / Ash Head */}
        <div
          ref={tipRef}
          className="relative w-full flex flex-col items-center overflow-visible z-20"
        >
          {/* Ash Clump (grows when lit) */}
          {isLit && currentAshHeight > 2 && (
            <div
              onClick={onFlickAsh}
              className="w-full rounded-t-sm cursor-pointer relative overflow-hidden transition-all duration-300"
              style={{
                height: `${currentAshHeight}px`,
                background: 'linear-gradient(to top, #333333 0%, #71717a 40%, #e4e4e7 90%, #d4d4d8 100%)',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4), 0 -2px 4px rgba(0,0,0,0.5)'
              }}
              title="烟灰积攒中，点击弹落"
            >
              {/* Crumbly flaky ash textures */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:3px_3px]" />
              <div className="absolute top-0 inset-x-0 h-1 bg-zinc-200/80 blur-[0.5px]" />
            </div>
          )}

          {/* Incandescent Red-Hot Ember Core */}
          {isLit ? (
            <div
              className={`w-full h-3.5 relative rounded-t-xs transition-all duration-200 overflow-visible ${
                isInhaling ? 'scale-105' : ''
              }`}
              style={{
                background: isInhaling
                  ? 'radial-gradient(circle at 50% 50%, #ffffff 0%, #fef08a 25%, #ff4500 70%, #991b1b 100%)'
                  : 'radial-gradient(circle at 50% 50%, #fed7aa 0%, #ff5722 45%, #b91c1c 80%, #450a0a 100%)',
                boxShadow: isInhaling
                  ? '0 -4px 20px #ff4500, 0 0 35px #f59e0b, 0 0 10px #ffffff'
                  : '0 -2px 10px #ea580c, 0 0 15px rgba(234, 88, 12, 0.4)'
              }}
            >
              {/* Charred paper burnt edge ring */}
              <div className="absolute -bottom-1 inset-x-0 h-1 bg-gradient-to-b from-black to-zinc-800" />
            </div>
          ) : (
            /* Unlit Tobacco End (Cut shredded tobacco leaves texture) */
            <div
              className="w-full h-3 rounded-t-xs relative overflow-hidden"
              style={{
                backgroundColor: '#573016',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8)'
              }}
            >
              {/* Shredded cut rag tobacco visual grain */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,#3c1f0d_25%,transparent_25%),linear-gradient(-45deg,#3c1f0d_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#7c451b_75%),linear-gradient(-45deg,transparent_75%,#7c451b_75%)] [background-size:4px_4px]" />
            </div>
          )}
        </div>

        {/* Cigarette Paper Cylinder (Consuming as it burns) */}
        <div
          className="w-full relative transition-all duration-300 overflow-hidden flex flex-col justify-between"
          style={{
            height: `${remainingTobaccoHeight}px`,
            backgroundColor: cigarette.paperColor,
            boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.15), inset 2px 0 4px rgba(255,255,255,0.3), 0 4px 15px rgba(0,0,0,0.4)'
          }}
        >
          {/* Paper subtle watermark ribbing stripes */}
          <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(0deg,transparent,transparent_4px,#000000_5px)]" />

          {/* Brand Name Stamp near filter */}
          <div className="absolute bottom-2 inset-x-0 text-center select-none pointer-events-none">
            <span
              className="text-[9px] font-serif font-bold tracking-tight opacity-75"
              style={{
                color: cigarette.paperColor === '#1a1a1a' ? '#d4af37' : (cigarette.paperColor === '#4a2c1d' ? '#e5e7eb' : '#4b5563')
              }}
            >
              {cigarette.brand.split(' ')[0]}
            </span>
          </div>

          {/* Paper seam line */}
          <div className="absolute right-1 inset-y-0 w-px bg-black/10" />
        </div>

        {/* Filter Tipping Paper (Cork / Gold / Black / Luxury) */}
        <div
          className={`w-full ${filterHeight} relative rounded-b-md overflow-hidden flex flex-col justify-between p-1`}
          style={{
            backgroundColor: cigarette.filterStyle.color,
            boxShadow: 'inset -3px 0 6px rgba(0,0,0,0.3), inset 3px 0 6px rgba(255,255,255,0.2), 0 8px 20px rgba(0,0,0,0.6)'
          }}
        >
          {/* Gold Decorative Ring (Divider between paper and filter) */}
          <div
            className="absolute top-0 inset-x-0 h-1.5 shadow-sm"
            style={{
              backgroundColor: cigarette.filterStyle.ringColor || '#d4af37'
            }}
          />

          {/* Cork pattern speckles if cork */}
          {cigarette.filterStyle.pattern === 'cork' && (
            <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#451a03_1px,transparent_1px)] [background-size:4px_4px]" />
          )}

          {/* Popping Bead (e.g. Chenpi Tangerine bead) */}
          {cigarette.hasBead ? (
            <div className="my-auto flex flex-col items-center z-10">
              <button
                type="button"
                onClick={handlePopBeadClick}
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                  beadPopped
                    ? 'bg-amber-600/40 ring-1 ring-amber-500/50 scale-90'
                    : 'bg-amber-400 hover:scale-110 active:scale-90 animate-pulse ring-2 ring-amber-300'
                }`}
                title={beadPopped ? '爆珠已捏破 · 陈皮清香四溢' : '点击捏破爆珠'}
              >
                <Sparkles className={`w-3 h-3 ${beadPopped ? 'text-amber-200' : 'text-zinc-900 font-bold'}`} />
              </button>
              <span className="text-[8px] font-medium text-amber-300/90 mt-0.5 whitespace-nowrap">
                {beadPopped ? '已爆珠' : '捏爆珠'}
              </span>
            </div>
          ) : (
            <div className="flex-1" />
          )}

          {/* Filter Bottom Mouthpiece */}
          <div className="w-full h-2 rounded-b-xs border-t border-black/20 bg-white/20 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-700/40" />
          </div>
        </div>
      </div>

      {/* Unlit State Drag Hint */}
      {!isLit && (
        <div className="mt-3 text-center pointer-events-none">
          <span className={`text-[10px] px-2.5 py-0.5 rounded-full border transition-all ${
            isDragging
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
              : 'bg-zinc-800/80 text-zinc-400 border-zinc-700/60'
          }`}>
            {isDragging ? '正在拖动香烟靠近火苗...' : '可拖动烟身点燃'}
          </span>
        </div>
      )}

      {/* Inhale / Draw Action Trigger (Press & hold or click to draw) */}
      {isLit && (
        <div className="mt-8 flex flex-col items-center gap-2">
          <button
            id="inhale-button"
            type="button"
            onMouseDown={onInhaleStart}
            onMouseUp={onInhaleEnd}
            onTouchStart={onInhaleStart}
            onTouchEnd={onInhaleEnd}
            className={`group relative flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm transition-all duration-200 cursor-pointer shadow-xl select-none ${
              isInhaling
                ? 'bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 text-white scale-105 ring-4 ring-orange-500/40 shadow-orange-500/50'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-600/80 active:scale-95'
            }`}
          >
            <Wind className={`w-4 h-4 ${isInhaling ? 'animate-spin text-yellow-200' : 'text-amber-400'}`} />
            <span>{isInhaling ? '正在抽吸 · 烟丝炽热' : '长按抽一口 (Inhale)'}</span>
          </button>
          <span className="text-[11px] text-zinc-400">
            燃烧进度: {Math.round(burnProgress)}%
          </span>
        </div>
      )}
    </div>
  );
};

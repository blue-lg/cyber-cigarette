import React, { useState, useEffect, useRef } from 'react';
import { Flame, Sparkles, Move } from 'lucide-react';
import { LighterConfig } from '../types';
import { soundEngine } from '../utils/audio';

interface LighterProps {
  config: LighterConfig;
  isOpen: boolean;
  isLit: boolean;
  onToggleOpen: () => void;
  onIgnite: () => void;
  onExtinguish: () => void;
  tiltAngle: number; // Phone tilt in degrees
  onFlamePositionChange: (pos: { x: number; y: number } | null) => void;
  isDragging?: boolean;
}

export const Lighter: React.FC<LighterProps> = ({
  config,
  isOpen,
  isLit,
  onToggleOpen,
  onIgnite,
  onExtinguish,
  tiltAngle,
  onFlamePositionChange,
  isDragging = false
}) => {
  const [isSparking, setIsSparking] = useState(false);
  const flameTipRef = useRef<HTMLDivElement | null>(null);

  // Update flame position periodically
  useEffect(() => {
    if (!isLit || !isOpen) {
      onFlamePositionChange(null);
      return;
    }

    const interval = setInterval(() => {
      if (flameTipRef.current) {
        const rect = flameTipRef.current.getBoundingClientRect();
        onFlamePositionChange({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isLit, isOpen, onFlamePositionChange]);

  // Handle striking the spark wheel
  const handleStrikeWheel = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (!isOpen) {
      // If lid is closed, open it first with sound
      soundEngine.playLighterOpen();
      onToggleOpen();
      return;
    }

    setIsSparking(true);
    soundEngine.playLighterSpark();

    setTimeout(() => {
      setIsSparking(false);
      if (!isLit) {
        onIgnite();
        soundEngine.startFlameHiss();
      }
    }, 140);
  };

  const handleLidClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOpen) {
      if (isLit) {
        onExtinguish();
        soundEngine.stopFlameHiss();
      }
      soundEngine.playLighterClose();
      onToggleOpen();
    } else {
      soundEngine.playLighterOpen();
      onToggleOpen();
    }
  };

  // Flame tilt calculation: flame stays pointing upwards relative to world!
  // If lighter is tilted clockwise by +deg, flame counter-rotates by -deg.
  const flameCounterTilt = -tiltAngle * 0.85;

  return (
    <div
      className={`relative flex flex-col items-center select-none touch-none ${
        isDragging ? 'cursor-grabbing scale-105 filter drop-shadow-[0_20px_25px_rgba(245,158,11,0.25)]' : 'cursor-grab'
      }`}
      id="lighter-container"
    >
      {/* Flame Container */}
      <div className="relative h-28 w-20 flex items-end justify-center overflow-visible pointer-events-none">
        {isLit && isOpen && (
          <div
            ref={flameTipRef}
            className="absolute bottom-1 z-30 transition-transform duration-75 origin-bottom"
            style={{
              transform: `rotate(${flameCounterTilt}deg)`,
              filter: 'drop-shadow(0 -8px 18px rgba(245, 158, 11, 0.75)) drop-shadow(0 0 30px rgba(239, 68, 68, 0.4))'
            }}
          >
            {/* Realistic Organic Layered Flame */}
            <div className="relative flex flex-col items-center">
              {/* Outer yellow/orange flicker envelope */}
              <div className="w-9 h-20 bg-gradient-to-t from-amber-500 via-yellow-400 to-transparent rounded-[50%_50%_35%_35%/70%_70%_30%_30%] animate-pulse opacity-95 blur-[0.6px]" />

              {/* Core intense bright yellow / white body */}
              <div className="absolute bottom-1 w-5 h-14 bg-gradient-to-t from-yellow-200 via-white to-transparent rounded-[50%_50%_40%_40%/80%_80%_20%_20%]" />

              {/* Inner blue oxygen combustion cone */}
              <div className="absolute bottom-0 w-4 h-6 bg-gradient-to-t from-blue-600 via-cyan-400 to-transparent rounded-[50%_50%_40%_40%/80%_80%_20%_20%] opacity-90" />

              {/* Floating flame tip lick */}
              <div className="absolute -top-3 w-3 h-6 bg-yellow-300 rounded-full blur-[1px] opacity-70 animate-ping" />
            </div>
          </div>
        )}

        {/* Spark Burst Effect */}
        {isSparking && (
          <div className="absolute bottom-3 flex items-center justify-center pointer-events-none z-40">
            <Sparkles className="w-12 h-12 text-yellow-300 animate-spin" />
            <div className="absolute w-16 h-16 bg-yellow-400/40 rounded-full blur-md animate-ping" />
          </div>
        )}
      </div>

      {/* Lighter Chimney / Windproof Guard & Flint Wheel */}
      <div className="relative w-28 h-10 flex items-center justify-between px-3 z-20">
        {/* Windproof Chimney Holes */}
        <div
          className="w-10 h-9 rounded-t-md flex flex-wrap gap-1 p-1 items-center justify-center border border-zinc-700 shadow-inner pointer-events-none"
          style={{ backgroundColor: '#27272a' }}
        >
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-900 shadow-inner" />
          ))}
          {/* Wick */}
          <div className="w-1 h-3 bg-zinc-400 rounded-t -mt-2 shadow" />
        </div>

        {/* Strike Flint Wheel */}
        <button
          id="flint-wheel-button"
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={handleStrikeWheel}
          className={`group relative w-10 h-10 rounded-full border-2 border-zinc-600 bg-gradient-to-b from-zinc-600 via-zinc-800 to-zinc-900 shadow-lg cursor-pointer active:scale-95 active:rotate-45 transition-transform duration-100 flex items-center justify-center ${
            isOpen ? 'hover:ring-2 hover:ring-amber-400/50' : 'opacity-80'
          }`}
          title={isOpen ? '滑动或点击打火砂轮' : '请先打开机盖'}
        >
          {/* Knurled steel teeth pattern */}
          <div className="w-7 h-7 rounded-full border border-dashed border-zinc-500 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
          </div>
          {isOpen && !isLit && (
            <span className="absolute -top-6 text-[10px] font-medium text-amber-400 whitespace-nowrap bg-zinc-900/95 px-2 py-0.5 rounded-full border border-amber-500/40 animate-bounce shadow-md">
              划动打火
            </span>
          )}
        </button>
      </div>

      {/* Lighter Lid (Flip Top) */}
      <div
        id="lighter-lid"
        onClick={handleLidClick}
        className={`relative w-32 h-14 rounded-t-xl cursor-pointer transition-all duration-300 origin-bottom-left shadow-2xl border-t border-x border-white/20 flex items-center justify-center overflow-hidden ${
          isOpen ? '-rotate-105 -translate-x-6 translate-y-3' : 'hover:brightness-110'
        }`}
        style={{
          background: `linear-gradient(135deg, ${config.capColor} 0%, ${config.baseColor} 50%, #1c1917 100%)`,
          boxShadow: isOpen
            ? 'none'
            : `0 4px 15px rgba(0,0,0,0.6), inset 0 2px 4px ${config.accentColor}40`
        }}
        title={isOpen ? '点击关闭顶盖' : '点击弹开打火机顶盖'}
      >
        {/* Metal grain highlight line */}
        <div className="absolute inset-x-0 top-1 h-0.5 bg-white/40 blur-[0.5px]" />
        <div className="text-[11px] font-mono tracking-widest uppercase opacity-75 text-zinc-100 font-bold">
          {isOpen ? 'OPEN' : 'ZIPPO'}
        </div>
      </div>

      {/* Lighter Main Body Case */}
      <div
        id="lighter-body"
        className="relative w-32 h-36 rounded-b-xl border border-white/10 shadow-2xl flex flex-col justify-between p-3 overflow-hidden active:brightness-95"
        style={{
          background: `linear-gradient(160deg, ${config.baseColor} 0%, #1e1b18 70%, ${config.baseColor} 100%)`,
          boxShadow: `0 10px 30px rgba(0,0,0,0.7), inset 0 1px 2px ${config.accentColor}60`
        }}
      >
        {/* Brushed metallic reflection line */}
        <div className="absolute -inset-x-10 top-0 h-40 bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-45 pointer-events-none" />

        {/* Hinge detail */}
        <div className="absolute -left-1.5 top-0 w-3 h-6 rounded-r-md bg-zinc-400 border border-zinc-600 shadow" />

        {/* Brand engraved plaque */}
        <div className="mt-2 text-center pointer-events-none">
          <div className="text-xs font-serif font-extrabold tracking-wider" style={{ color: config.accentColor }}>
            {config.name}
          </div>
          <div className="text-[9px] text-zinc-400 tracking-tight mt-0.5">
            {config.material}
          </div>
        </div>

        {/* Drag to ignite pill handle indicator */}
        <div className="my-1 flex items-center justify-center">
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all shadow-sm ${
              isDragging
                ? 'bg-amber-500 text-zinc-950 ring-2 ring-amber-300 font-bold scale-105'
                : isLit
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                : 'bg-zinc-800/80 text-zinc-300 border border-zinc-700/60'
            }`}
          >
            <Move className="w-3 h-3" />
            <span>{isDragging ? '正在拖动靠近...' : '按住拖动点火'}</span>
          </div>
        </div>

        {/* Bottom status stamp */}
        <div className="flex items-center justify-between text-[9px] text-zinc-400 font-mono border-t border-white/10 pt-1 pointer-events-none">
          <span>{isLit ? 'FLAME ON' : 'READY'}</span>
          <span className="flex items-center gap-1">
            <Flame className={`w-3 h-3 ${isLit ? 'text-amber-400 animate-pulse' : 'text-zinc-500'}`} />
            {isOpen ? 'UNLOCKED' : 'LOCKED'}
          </span>
        </div>
      </div>
    </div>
  );
};

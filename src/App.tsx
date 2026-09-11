import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Flame,
  Volume2,
  VolumeX,
  Share2,
  BookOpen,
  RefreshCw,
  Sparkles,
  Info,
  ShieldAlert,
  Sliders,
  Award,
  ChevronDown,
  Move,
  Zap
} from 'lucide-react';
import { Cigarette, LighterConfig } from './types';
import { CIGARETTES_DATA, LIGHTER_MODELS } from './data/cigarettes';
import { soundEngine } from './utils/audio';
import { SmokeCanvas } from './components/SmokeCanvas';
import { Lighter } from './components/Lighter';
import { CigaretteStick } from './components/CigaretteStick';
import { GravityTiltController } from './components/GravityTiltController';
import { CigaretteSelector } from './components/CigaretteSelector';
import { BrandLoreModal } from './components/BrandLoreModal';
import { SocialShareModal } from './components/SocialShareModal';

export default function App() {
  // Current Cigarette Selection
  const [selectedCigarette, setSelectedCigarette] = useState<Cigarette>(CIGARETTES_DATA[0]);

  // Current Lighter Model
  const [selectedLighter, setSelectedLighter] = useState<LighterConfig>(LIGHTER_MODELS[0]);
  const [showLighterPicker, setShowLighterPicker] = useState(false);

  // States
  const [isLighterOpen, setIsLighterOpen] = useState(true);
  const [isLighterLit, setIsLighterLit] = useState(false);
  const [isCigaretteLit, setIsCigaretteLit] = useState(false);
  const [burnProgress, setBurnProgress] = useState(0); // 0 to 100%
  const [ashLength, setAshLength] = useState(0); // 0 to 100%
  const [isInhaling, setIsInhaling] = useState(false);
  const [beadPopped, setBeadPopped] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Dragging states
  const [lighterDrag, setLighterDrag] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingLighter, setIsDraggingLighter] = useState(false);
  const lighterPointerStartRef = useRef<{ pointerX: number; pointerY: number; startX: number; startY: number } | null>(null);
  const lighterMovedRef = useRef(false);

  const [cigDrag, setCigDrag] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingCig, setIsDraggingCig] = useState(false);
  const cigPointerStartRef = useRef<{ pointerX: number; pointerY: number; startX: number; startY: number } | null>(null);
  const cigMovedRef = useRef(false);

  const [justIgnited, setJustIgnited] = useState(false);

  // Tilt & Gravity
  const [tiltAngle, setTiltAngle] = useState(0); // in degrees (-45 to 45)

  // Positions for Collision Ignition
  const [flamePos, setFlamePos] = useState<{ x: number; y: number } | null>(null);
  const [tipPos, setTipPos] = useState<{ x: number; y: number } | null>(null);
  const [proximityScore, setProximityScore] = useState(0);
  const contactDurationRef = useRef(0);

  // Modals
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isLoreOpen, setIsLoreOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Toggle Mute
  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  // Reset cigarette stick
  const handleResetCigarette = () => {
    setIsCigaretteLit(false);
    setBurnProgress(0);
    setAshLength(0);
    setIsInhaling(false);
    setBeadPopped(false);
    setJustIgnited(false);
    soundEngine.stopInhaleCrackle();
  };

  // Switch Cigarette
  const handleSelectCigarette = (cig: Cigarette) => {
    setSelectedCigarette(cig);
    handleResetCigarette();
  };

  // Flick ash
  const handleFlickAsh = useCallback(() => {
    if (ashLength > 0) {
      soundEngine.playAshFlick();
      setAshLength(0);
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(30);
      }
    }
  }, [ashLength]);

  // Inhale Start
  const handleInhaleStart = () => {
    if (!isCigaretteLit) return;
    setIsInhaling(true);
    const isKretek = selectedCigarette.type === '丁香型';
    soundEngine.startInhaleCrackle(isKretek);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([40, 30, 40]);
    }
  };

  // Inhale End
  const handleInhaleEnd = () => {
    if (!isInhaling) return;
    setIsInhaling(false);
    soundEngine.stopInhaleCrackle();
    soundEngine.playExhaleSmoke();
  };

  // Trigger ignition helper
  const triggerIgnition = useCallback(() => {
    if (isCigaretteLit) return;
    setIsCigaretteLit(true);
    setJustIgnited(true);
    const isKretek = selectedCigarette.type === '丁香型';
    soundEngine.playIgnite(isKretek);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([80, 50, 150]);
    }
    setTimeout(() => {
      setJustIgnited(false);
    }, 2200);
  }, [isCigaretteLit, selectedCigarette]);

  // Quick light lighter
  const handleQuickStrikeLighter = () => {
    if (!isLighterOpen) {
      setIsLighterOpen(true);
      soundEngine.playLighterOpen();
    }
    soundEngine.playLighterSpark();
    setTimeout(() => {
      setIsLighterLit(true);
      soundEngine.startFlameHiss();
    }, 120);
  };

  // Pointer drag for Lighter
  const handleLighterPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('#flint-wheel-button') || target.closest('#lighter-picker-popover') || target.closest('#open-picker-btn')) {
      return;
    }
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    lighterPointerStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      startX: lighterDrag.x,
      startY: lighterDrag.y
    };
    lighterMovedRef.current = false;
  };

  const handleLighterPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!lighterPointerStartRef.current) return;
    const dx = e.clientX - lighterPointerStartRef.current.pointerX;
    const dy = e.clientY - lighterPointerStartRef.current.pointerY;

    if (!lighterMovedRef.current && Math.hypot(dx, dy) > 5) {
      lighterMovedRef.current = true;
      setIsDraggingLighter(true);
    }

    if (lighterMovedRef.current) {
      const nextX = Math.max(-360, Math.min(120, lighterPointerStartRef.current.startX + dx));
      const nextY = Math.max(-220, Math.min(200, lighterPointerStartRef.current.startY + dy));
      setLighterDrag({ x: nextX, y: nextY });
    }
  };

  const handleLighterPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!lighterPointerStartRef.current) return;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    if (lighterMovedRef.current) {
      setIsDraggingLighter(false);
      // Spring back to resting dock
      setLighterDrag({ x: 0, y: 0 });
    } else {
      // Tap on lighter: toggle lid
      const target = e.target as HTMLElement;
      if (target.closest('#lighter-lid') || target.closest('#lighter-body')) {
        if (isLighterOpen) {
          if (isLighterLit) {
            setIsLighterLit(false);
            soundEngine.stopFlameHiss();
          }
          soundEngine.playLighterClose();
          setIsLighterOpen(false);
        } else {
          soundEngine.playLighterOpen();
          setIsLighterOpen(true);
        }
      }
    }
    lighterPointerStartRef.current = null;
    lighterMovedRef.current = false;
  };

  // Pointer drag for Cigarette
  const handleCigPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isCigaretteLit || e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    cigPointerStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      startX: cigDrag.x,
      startY: cigDrag.y
    };
    cigMovedRef.current = false;
  };

  const handleCigPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cigPointerStartRef.current) return;
    const dx = e.clientX - cigPointerStartRef.current.pointerX;
    const dy = e.clientY - cigPointerStartRef.current.pointerY;

    if (!cigMovedRef.current && Math.hypot(dx, dy) > 5) {
      cigMovedRef.current = true;
      setIsDraggingCig(true);
    }

    if (cigMovedRef.current) {
      const nextX = Math.max(-100, Math.min(360, cigPointerStartRef.current.startX + dx));
      const nextY = Math.max(-200, Math.min(200, cigPointerStartRef.current.startY + dy));
      setCigDrag({ x: nextX, y: nextY });
    }
  };

  const handleCigPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cigPointerStartRef.current) return;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    if (cigMovedRef.current) {
      setIsDraggingCig(false);
      setCigDrag({ x: 0, y: 0 });
    }
    cigPointerStartRef.current = null;
    cigMovedRef.current = false;
  };

  // Burning simulation ticker
  useEffect(() => {
    if (!isCigaretteLit) return;

    const interval = setInterval(() => {
      setBurnProgress((prev) => {
        // Inhaling burns 4x faster
        const rate = isInhaling ? 0.35 : 0.06;
        const next = prev + rate;
        if (next >= 100) {
          setIsCigaretteLit(false);
          setIsInhaling(false);
          soundEngine.stopInhaleCrackle();
          return 100;
        }
        return next;
      });

      // Accumulate ash
      setAshLength((prev) => {
        const ashRate = isInhaling ? 0.8 : 0.15;
        const next = prev + ashRate;
        // Auto drop if too heavy (>85%)
        if (next >= 90) {
          handleFlickAsh();
          return 0;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isCigaretteLit, isInhaling, handleFlickAsh]);

  // Proximity & Ignition Logic: Check distance between flame and cigarette tip
  useEffect(() => {
    if (isCigaretteLit || !isLighterLit || !flamePos || !tipPos) {
      setProximityScore(0);
      contactDurationRef.current = 0;
      return;
    }

    const dx = flamePos.x - tipPos.x;
    const dy = flamePos.y - tipPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Ignition threshold radius in px
    const maxIgniteDistance = 150;
    const contactDistance = 58;

    if (dist > maxIgniteDistance) {
      setProximityScore(0);
      contactDurationRef.current = 0;
    } else if (dist > contactDistance) {
      const score = Math.max(
        0,
        Math.min(95, (1 - (dist - contactDistance) / (maxIgniteDistance - contactDistance)) * 95)
      );
      setProximityScore(score);
      contactDurationRef.current = 0;
    } else {
      // In direct contact!
      setProximityScore(100);
      contactDurationRef.current += 1;

      // Snappy contact ignition
      if (contactDurationRef.current >= 1) {
        triggerIgnition();
      }
    }
  }, [flamePos, tipPos, isLighterLit, isCigaretteLit, triggerIgnition]);

  // Dynamic calculations for Lighter & Cigarette
  const dragTilt = Math.max(-25, Math.min(15, (lighterDrag.x / 140) * 22));
  const lighterTotalX = -tiltAngle * 3.5 + lighterDrag.x;
  const lighterTotalY = Math.abs(tiltAngle) * 0.8 + lighterDrag.y;
  const lighterTotalRotate = tiltAngle * 0.75 + dragTilt;

  const cigDragTilt = Math.max(-10, Math.min(20, (cigDrag.x / 140) * 16));
  const cigTotalX = cigDrag.x;
  const cigTotalY = cigDrag.y;
  const cigTotalRotate = cigDragTilt;

  // Shake detection on mobile (DeviceMotion) for flicking ash
  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let lastZ = 0;
    let lastTime = 0;

    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

      const now = Date.now();
      if (now - lastTime > 150) {
        const diffTime = now - lastTime;
        lastTime = now;

        const speed =
          (Math.abs(acc.x - lastX) + Math.abs(acc.y - lastY) + Math.abs(acc.z - lastZ)) /
          diffTime *
          10000;

        if (speed > 450 && isCigaretteLit && ashLength > 15) {
          handleFlickAsh();
        }

        lastX = acc.x;
        lastY = acc.y;
        lastZ = acc.z;
      }
    };

    if (typeof window !== 'undefined' && 'ondevicemotion' in window) {
      window.addEventListener('devicemotion', handleMotion);
      return () => window.removeEventListener('devicemotion', handleMotion);
    }
  }, [isCigaretteLit, ashLength, handleFlickAsh]);

  return (
    <div
      className="relative min-h-screen w-full flex flex-col justify-between bg-zinc-950 text-zinc-100 overflow-hidden select-none font-sans"
      id="app-root"
    >
      {/* Background Ambient Warm Lighting */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background: isCigaretteLit || isLighterLit
            ? 'radial-gradient(circle at 50% 40%, rgba(245, 158, 11, 0.12) 0%, rgba(239, 68, 68, 0.05) 50%, #09090b 100%)'
            : 'radial-gradient(circle at 50% 30%, rgba(39, 39, 42, 0.4) 0%, #09090b 90%)'
        }}
      />

      {/* Atmospheric Canvas Smoke Particle Engine */}
      <SmokeCanvas
        isLit={isCigaretteLit}
        isInhaling={isInhaling}
        tipPosition={tipPos}
        tiltAngle={tiltAngle}
        isKretek={selectedCigarette.type === '丁香型'}
      />

      {/* Top Navbar */}
      <header className="relative z-40 w-full px-4 py-3 flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md">
        {/* Brand Selector Trigger */}
        <button
          id="cigarette-picker-trigger"
          type="button"
          onClick={() => setIsSelectorOpen(true)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 border border-zinc-700/80 cursor-pointer transition-all active:scale-95 shadow"
        >
          <div
            className="w-3.5 h-3.5 rounded-full shadow-sm"
            style={{ backgroundColor: selectedCigarette.packTheme.accent }}
          />
          <div className="text-left">
            <span className="text-[11px] text-zinc-400 block -mb-0.5">切换香烟</span>
            <span className="text-xs font-bold text-zinc-100 flex items-center gap-1">
              {selectedCigarette.name}
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </span>
          </div>
        </button>

        {/* Action Controls: Lore, Sound, Share */}
        <div className="flex items-center gap-2">
          {/* Tar & Lore Info */}
          <button
            id="open-lore-btn"
            type="button"
            onClick={() => setIsLoreOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-xs text-amber-300 font-medium border border-amber-500/30 cursor-pointer transition-all active:scale-95"
            title="查看焦油含量与历史文化"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">焦油档案</span>
            <span className="font-mono font-bold text-amber-400">{selectedCigarette.tar}mg</span>
          </button>

          {/* Social Share */}
          <button
            id="open-share-btn"
            type="button"
            onClick={() => setIsShareOpen(true)}
            className="p-2 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 hover:text-amber-400 border border-zinc-700/80 cursor-pointer transition-all active:scale-95"
            title="生成品鉴分享卡片"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Audio Mute Toggle */}
          <button
            id="toggle-mute-btn"
            type="button"
            onClick={handleToggleMute}
            className={`p-2 rounded-xl border transition-all cursor-pointer active:scale-95 ${
              isMuted
                ? 'bg-zinc-800/50 border-zinc-700 text-zinc-500'
                : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
            }`}
            title={isMuted ? '取消静音' : '静音'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Reset Cigarette */}
          <button
            id="reset-cigarette-btn"
            type="button"
            onClick={handleResetCigarette}
            className="p-2 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 border border-zinc-700/80 cursor-pointer transition-all active:scale-95"
            title="重置香烟"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Interactive Stage */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 py-2">
        {/* Active Cigarette Brief Tag */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400">
              {selectedCigarette.country}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-medium">
              {selectedCigarette.type}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400">
              焦油 {selectedCigarette.tar}mg
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-zinc-100 tracking-wide mt-1">
            {selectedCigarette.name}
          </h1>
          <p className="text-xs text-zinc-400 italic">
            “{selectedCigarette.tagline}”
          </p>
        </div>

        {/* Drag to Ignite Instruction Banner */}
        <div className="mb-3 px-3 py-1.5 rounded-full backdrop-blur-md transition-all flex items-center gap-2 text-xs border shadow-lg">
          {justIgnited ? (
            <div className="flex items-center gap-1.5 text-amber-300 font-bold animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>引燃成功！烟丝炽热，可长按香烟抽吸</span>
            </div>
          ) : isCigaretteLit ? (
            <div className="flex items-center gap-2 text-zinc-300">
              <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>香烟燃烧中 · 可长按下方按钮深吸，或摇晃手机弹烟灰</span>
            </div>
          ) : isLighterLit ? (
            <div className="flex items-center gap-2 text-amber-300">
              <Move className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>
                {isDraggingLighter || isDraggingCig
                  ? `正在拖动靠拢 · 契合度 ${Math.round(proximityScore)}%`
                  : '火苗已起：直接按住打火机拖动至烟头即可引燃！'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-zinc-300">
              <Flame className="w-3.5 h-3.5 text-zinc-400" />
              <span>点击砂轮打火后，按住打火机拖动靠近烟头点燃</span>
              <button
                type="button"
                onClick={handleQuickStrikeLighter}
                className="ml-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-bold border border-amber-500/40 cursor-pointer active:scale-95 transition-all flex items-center gap-1"
              >
                <Zap className="w-3 h-3 text-amber-400" />
                <span>一键打火</span>
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Drag Guide Arc & Trajectory Line */}
        {isLighterLit && !isCigaretteLit && flamePos && tipPos && (
          <svg
            className="pointer-events-none fixed inset-0 z-30 w-full h-full"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="guide-flame-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            {/* Dashed line connecting flame and cigarette tip */}
            <line
              x1={flamePos.x}
              y1={flamePos.y}
              x2={tipPos.x}
              y2={tipPos.y}
              stroke="url(#guide-flame-grad)"
              strokeWidth={proximityScore > 70 ? "3" : "1.5"}
              strokeDasharray="5,5"
              opacity={Math.max(0.35, proximityScore / 100)}
            />
            {/* Target reticle on cigarette tip */}
            <circle
              cx={tipPos.x}
              cy={tipPos.y}
              r={12 + (1 - Math.min(100, proximityScore) / 100) * 8}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="3,3"
              opacity="0.8"
            />
          </svg>
        )}

        {/* Celebration Flash Burst on Ignition */}
        {justIgnited && tipPos && (
          <div
            className="fixed pointer-events-none z-50 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
            style={{ left: tipPos.x, top: tipPos.y }}
          >
            <div className="w-24 h-24 rounded-full bg-amber-400/30 blur-lg animate-ping" />
            <div className="absolute w-12 h-12 rounded-full bg-orange-500/50 blur-md animate-pulse" />
            <Sparkles className="w-8 h-8 text-amber-200 animate-spin" />
          </div>
        )}

        {/* Dual Interaction Arena: Cigarette & Dynamic Lighter */}
        <div className="relative w-full max-w-lg min-h-[380px] flex items-center justify-center gap-12 sm:gap-16 select-none touch-none">
          {/* Cigarette Stick Container with touch & drag support */}
          <div
            onPointerDown={handleCigPointerDown}
            onPointerMove={handleCigPointerMove}
            onPointerUp={handleCigPointerUp}
            onPointerCancel={handleCigPointerUp}
            className={`flex flex-col items-center select-none ${
              !isCigaretteLit ? 'cursor-grab active:cursor-grabbing' : ''
            }`}
            style={{
              transform: `translate(${cigTotalX}px, ${cigTotalY}px) rotate(${cigTotalRotate}deg)`,
              transition: isDraggingCig ? 'none' : 'transform 0.4s cubic-bezier(0.34, 1.3, 0.64, 1)',
              zIndex: isDraggingCig ? 40 : 20
            }}
          >
            <CigaretteStick
              cigarette={selectedCigarette}
              isLit={isCigaretteLit}
              burnProgress={burnProgress}
              ashLength={ashLength}
              isInhaling={isInhaling}
              beadPopped={beadPopped}
              onPopBead={() => setBeadPopped(true)}
              onTipPositionChange={setTipPos}
              onFlickAsh={handleFlickAsh}
              onInhaleStart={handleInhaleStart}
              onInhaleEnd={handleInhaleEnd}
              onExtinguish={() => setIsCigaretteLit(false)}
              isDragging={isDraggingCig}
            />
          </div>

          {/* Interactive Draggable & Tiltable Lighter */}
          <div
            onPointerDown={handleLighterPointerDown}
            onPointerMove={handleLighterPointerMove}
            onPointerUp={handleLighterPointerUp}
            onPointerCancel={handleLighterPointerUp}
            className="select-none cursor-grab active:cursor-grabbing relative"
            style={{
              transform: `translate(${lighterTotalX}px, ${lighterTotalY}px) rotate(${lighterTotalRotate}deg)`,
              transition: isDraggingLighter ? 'none' : 'transform 0.4s cubic-bezier(0.34, 1.3, 0.64, 1)',
              zIndex: isDraggingLighter ? 40 : 20
            }}
          >
            <Lighter
              config={selectedLighter}
              isOpen={isLighterOpen}
              isLit={isLighterLit}
              onToggleOpen={() => setIsLighterOpen(!isLighterOpen)}
              onIgnite={() => setIsLighterLit(true)}
              onExtinguish={() => setIsLighterLit(false)}
              tiltAngle={tiltAngle}
              onFlamePositionChange={setFlamePos}
              isDragging={isDraggingLighter}
            />

            {/* Switch Lighter Model button */}
            <div className="mt-3 text-center">
              <button
                id="open-picker-btn"
                type="button"
                onClick={() => setShowLighterPicker(!showLighterPicker)}
                className="text-[10px] text-zinc-400 hover:text-amber-400 cursor-pointer underline flex items-center justify-center gap-1 mx-auto"
              >
                <span>换打火机: {selectedLighter.name.split(' ')[0]}</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </button>

              {/* Lighter switcher popover */}
              {showLighterPicker && (
                <div
                  id="lighter-picker-popover"
                  className="absolute left-1/2 -translate-x-1/2 bottom-0 mb-8 p-2 rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl z-50 flex flex-col gap-1 w-44"
                >
                  {LIGHTER_MODELS.map((lm) => (
                    <button
                      key={lm.id}
                      type="button"
                      onClick={() => {
                        setSelectedLighter(lm);
                        setShowLighterPicker(false);
                      }}
                      className={`px-2 py-1.5 rounded-lg text-left text-xs cursor-pointer flex items-center justify-between ${
                        selectedLighter.id === lm.id
                          ? 'bg-amber-500/20 text-amber-300 font-bold'
                          : 'hover:bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      <span>{lm.name}</span>
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: lm.baseColor }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Controls: Gravity Sensing & Alignment HUD */}
      <footer className="relative z-40 w-full border-t border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md pb-2 pt-1">
        <GravityTiltController
          tiltAngle={tiltAngle}
          onTiltChange={setTiltAngle}
          proximityScore={proximityScore}
          isLighterLit={isLighterLit}
          isCigaretteLit={isCigaretteLit}
        />

        {/* Public Health Warning Notice */}
        <div className="text-center py-1 text-[10px] text-zinc-400 flex items-center justify-center gap-1">
          <ShieldAlert className="w-3 h-3 text-red-400" />
          <span>吸烟有害健康 · 本页面为H5物理交互与历史文化鉴赏 · 未成年人严禁吸烟</span>
        </div>
      </footer>

      {/* Cigarette Selector Drawer / Modal */}
      <CigaretteSelector
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        selectedCigarette={selectedCigarette}
        onSelect={handleSelectCigarette}
      />

      {/* Brand Lore & Tar Chemical Analysis Modal */}
      <BrandLoreModal
        isOpen={isLoreOpen}
        onClose={() => setIsLoreOpen(false)}
        cigarette={selectedCigarette}
        onOpenShare={() => setIsShareOpen(true)}
      />

      {/* Social Sharing Poster Generator Modal */}
      <SocialShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        cigarette={selectedCigarette}
        isLit={isCigaretteLit}
        burnProgress={burnProgress}
      />
    </div>
  );
}

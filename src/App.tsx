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
  ChevronDown
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
    const maxIgniteDistance = 140;
    const contactDistance = 55;

    if (dist > maxIgniteDistance) {
      setProximityScore(0);
      contactDurationRef.current = 0;
    } else if (dist > contactDistance) {
      const score = Math.max(
        0,
        Math.min(90, (1 - (dist - contactDistance) / (maxIgniteDistance - contactDistance)) * 90)
      );
      setProximityScore(score);
      contactDurationRef.current = 0;
    } else {
      // In direct contact!
      setProximityScore(100);
      contactDurationRef.current += 1;

      // When in contact for ~3 ticks (~150ms)
      if (contactDurationRef.current >= 3) {
        setIsCigaretteLit(true);
        const isKretek = selectedCigarette.type === '丁香型';
        soundEngine.playIgnite(isKretek);
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate([60, 40, 120]);
        }
      }
    }
  }, [flamePos, tipPos, isLighterLit, isCigaretteLit, selectedCigarette]);

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

  // Calculate dynamic tilt displacement for the lighter
  // Tilting right moves lighter leftward towards cigarette; tilting left moves lighter rightward
  const lighterOffsetX = -tiltAngle * 3.5;
  const lighterOffsetY = Math.abs(tiltAngle) * 0.8;

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

        {/* Dual Interaction Arena: Cigarette & Dynamic Lighter */}
        <div className="relative w-full max-w-lg min-h-[380px] flex items-center justify-center gap-12 sm:gap-16">
          {/* Cigarette Stick */}
          <div className="flex flex-col items-center">
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
            />
          </div>

          {/* Interactive Tiltable Lighter */}
          <div
            className="transition-transform duration-75 ease-out"
            style={{
              transform: `translate(${lighterOffsetX}px, ${lighterOffsetY}px) rotate(${tiltAngle * 0.75}deg)`
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
            />

            {/* Switch Lighter Model button */}
            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={() => setShowLighterPicker(!showLighterPicker)}
                className="text-[10px] text-zinc-400 hover:text-amber-400 cursor-pointer underline flex items-center justify-center gap-1 mx-auto"
              >
                <span>换打火机: {selectedLighter.name.split(' ')[0]}</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </button>

              {/* Lighter switcher popover */}
              {showLighterPicker && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-0 mb-8 p-2 rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl z-50 flex flex-col gap-1 w-44">
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

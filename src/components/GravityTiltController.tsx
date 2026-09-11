import React, { useState, useEffect } from 'react';
import { Compass, Smartphone, Sliders, CheckCircle2, Flame } from 'lucide-react';

interface GravityTiltControllerProps {
  tiltAngle: number;
  onTiltChange: (angle: number) => void;
  proximityScore: number; // 0 to 100% distance to ignition
  isLighterLit: boolean;
  isCigaretteLit: boolean;
  onAutoAlignIgnite?: () => void;
}

export const GravityTiltController: React.FC<GravityTiltControllerProps> = ({
  tiltAngle,
  onTiltChange,
  proximityScore,
  isLighterLit,
  isCigaretteLit
}) => {
  const [hasSensor, setHasSensor] = useState(false);
  const [sensorActive, setSensorActive] = useState(false);
  const [needsIosPermission, setNeedsIosPermission] = useState(false);
  const [manualMode, setManualMode] = useState(false);

  useEffect(() => {
    // Check if DeviceOrientation is available
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      setHasSensor(true);
      const DeviceOrientation = window.DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };

      if (typeof DeviceOrientation.requestPermission === 'function') {
        setNeedsIosPermission(true);
      } else {
        // Standard Android/Chrome or non-restricted sensor
        const handleOrientation = (e: DeviceOrientationEvent) => {
          if (manualMode) return;
          if (e.gamma !== null) {
            setSensorActive(true);
            // Clamp gamma from -45 to 45 degrees
            const clamped = Math.max(-45, Math.min(45, e.gamma));
            onTiltChange(clamped);
          }
        };

        window.addEventListener('deviceorientation', handleOrientation);
        return () => window.removeEventListener('deviceorientation', handleOrientation);
      }
    }
  }, [manualMode, onTiltChange]);

  const requestIosSensor = async () => {
    try {
      const DeviceOrientation = window.DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };
      if (typeof DeviceOrientation.requestPermission === 'function') {
        const res = await DeviceOrientation.requestPermission();
        if (res === 'granted') {
          setNeedsIosPermission(false);
          setSensorActive(true);
          window.addEventListener('deviceorientation', (e: DeviceOrientationEvent) => {
            if (e.gamma !== null) {
              const clamped = Math.max(-45, Math.min(45, e.gamma));
              onTiltChange(clamped);
            }
          });
        } else {
          setManualMode(true);
        }
      }
    } catch {
      setManualMode(true);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-2 select-none" id="gravity-controller">
      {/* Ignition Alignment / Proximity Radar */}
      {!isCigaretteLit && isLighterLit && (
        <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-amber-950/70 via-zinc-900/90 to-amber-950/70 border border-amber-500/40 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-medium mb-1.5">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>火苗与烟头对准度</span>
            </span>
            <span className="font-mono text-amber-400 font-bold">
              {Math.round(proximityScore)}%
            </span>
          </div>

          {/* Proximity Progress Bar */}
          <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden relative">
            <div
              className="h-full rounded-full transition-all duration-100 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 shadow-sm"
              style={{ width: `${Math.min(100, Math.max(0, proximityScore))}%` }}
            />
          </div>

          <div className="mt-2 text-center text-[11px] text-zinc-300">
            {proximityScore >= 80 ? (
              <span className="text-emerald-400 font-bold flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 接触点火中！持续保持...
              </span>
            ) : tiltAngle < -15 ? (
              <span>向右回倾手机或滑块，让火苗靠向烟嘴前端</span>
            ) : tiltAngle > 15 ? (
              <span>向左倾斜手机或滑块，将打火机凑近烟头</span>
            ) : (
              <span>倾斜手机或拖动打火机，让火苗靠近香烟顶部点燃</span>
            )}
          </div>
        </div>
      )}

      {/* Sensor / Manual Gyro Control Bar */}
      <div className="flex flex-col gap-2 p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-sm text-xs text-zinc-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className={`w-4 h-4 ${sensorActive ? 'text-emerald-400 animate-spin' : 'text-amber-400'}`} />
            <span className="font-medium">
              重力感应倾角: <strong className="text-amber-400 font-mono">{Math.round(tiltAngle)}°</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {needsIosPermission && (
              <button
                type="button"
                onClick={requestIosSensor}
                className="px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-[11px] cursor-pointer shadow active:scale-95"
              >
                开启陀螺仪
              </button>
            )}

            <button
              type="button"
              onClick={() => setManualMode(!manualMode)}
              className={`p-1 rounded-md border text-[11px] flex items-center gap-1 cursor-pointer ${
                manualMode
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-400'
              }`}
              title={manualMode ? '切回物理重力感应' : '切换手动虚拟倾角滑块'}
            >
              <Sliders className="w-3 h-3" />
              <span>{manualMode ? '滑块控火' : '自动重力'}</span>
            </button>
          </div>
        </div>

        {/* Manual Tilt Slider & Level Indicator */}
        <div className="flex items-center gap-3 pt-1">
          <span className="text-[10px] text-zinc-400 font-mono">-45°(左)</span>
          <input
            id="tilt-slider"
            type="range"
            min="-45"
            max="45"
            value={tiltAngle}
            onChange={(e) => {
              setManualMode(true);
              onTiltChange(parseFloat(e.target.value));
            }}
            className="flex-1 h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <span className="text-[10px] text-zinc-400 font-mono">+45°(右)</span>
        </div>

        {/* Quick sensor tip indicator */}
        <div className="flex items-center justify-between text-[10px] text-zinc-400 px-1">
          <span className="flex items-center gap-1">
            <Smartphone className="w-3 h-3" />
            {sensorActive ? '手机物理感应已激活 · 晃动或倾斜设备' : '支持触控拖拽打火机或晃动倾斜'}
          </span>
          <button
            type="button"
            onClick={() => onTiltChange(0)}
            className="text-zinc-400 hover:text-amber-400 cursor-pointer underline"
          >
            回正 (0°)
          </button>
        </div>
      </div>
    </div>
  );
};

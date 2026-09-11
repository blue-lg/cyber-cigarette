import React, { useRef, useState, useEffect, useCallback } from 'react';
import { X, Download, Share2, Copy, Check, Flame, ShieldAlert, Image as ImageIcon } from 'lucide-react';
import { Cigarette } from '../types';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  cigarette: Cigarette;
  isLit: boolean;
  burnProgress: number;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  cigarette,
  isLit,
  burnProgress
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Generate the Canvas poster card
  const generatePoster = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Card dimensions (ideal for mobile share 800 x 1200 high-res)
    const W = 800;
    const H = 1200;
    canvas.width = W;
    canvas.height = H;

    // 1. Background gradient (dark luxury charcoal)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#121316');
    bgGrad.addColorStop(0.5, '#18191e');
    bgGrad.addColorStop(1, '#0b0c0e');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Decorative border frame
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, W - 60, H - 60);

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, W - 80, H - 80);

    // 2. Top Header Brand Plaque
    const headerGrad = ctx.createLinearGradient(60, 60, W - 120, 200);
    headerGrad.addColorStop(0, cigarette.packTheme.primary);
    headerGrad.addColorStop(1, '#1c1917');
    ctx.fillStyle = headerGrad;
    ctx.beginPath();
    ctx.roundRect(60, 60, W - 120, 160, [16, 16, 16, 16]);
    ctx.fill();

    // Rarity Badge Pill
    ctx.fillStyle = cigarette.packTheme.accent;
    ctx.beginPath();
    ctx.roundRect(85, 80, 120, 30, [8, 8, 8, 8]);
    ctx.fill();

    ctx.fillStyle = '#111827';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(cigarette.rarity || '世界名烟', 145, 101);

    // Origin Country & Year
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${cigarette.country} · ${cigarette.yearIntroduced}年`, W - 85, 101);

    // Brand Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px serif';
    ctx.textAlign = 'left';
    ctx.fillText(cigarette.name, 85, 155);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '18px sans-serif';
    ctx.fillText(cigarette.nameEn, 85, 190);

    // 3. Middle Section: Tasting Status & Simulated Visual
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.roundRect(60, 240, W - 120, 270, [16, 16, 16, 16]);
    ctx.fill();
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Lit status indicator
    ctx.fillStyle = isLit ? '#f59e0b' : '#a1a1aa';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(
      isLit ? `🔥 已点燃 · 燃烧完成度 ${Math.round(burnProgress)}%` : '✦ 未点火 · 完好静候品吸',
      90,
      285
    );

    // Draw Cigarette Model horizontally in the card
    const cigStartX = 180;
    const cigY = 380;
    const cigTotalW = 440;
    const filterW = 120;
    const tobaccoW = cigTotalW - filterW;

    // Filter
    ctx.fillStyle = cigarette.filterStyle.color;
    ctx.beginPath();
    ctx.roundRect(cigStartX, cigY - 14, filterW, 28, [6, 0, 0, 6]);
    ctx.fill();
    // Gold ring on filter
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(cigStartX + filterW - 6, cigY - 14, 6, 28);

    // Tobacco paper cylinder
    ctx.fillStyle = cigarette.paperColor;
    ctx.fillRect(cigStartX + filterW, cigY - 14, tobaccoW, 28);

    // If lit, draw red ember and ash
    if (isLit) {
      // Burnt ember
      const emberGrad = ctx.createRadialGradient(
        cigStartX + cigTotalW,
        cigY,
        2,
        cigStartX + cigTotalW,
        cigY,
        18
      );
      emberGrad.addColorStop(0, '#ffffff');
      emberGrad.addColorStop(0.3, '#ff5500');
      emberGrad.addColorStop(1, '#991b1b');
      ctx.fillStyle = emberGrad;
      ctx.beginPath();
      ctx.arc(cigStartX + cigTotalW, cigY, 14, 0, Math.PI * 2);
      ctx.fill();

      // Flaky ash clump
      ctx.fillStyle = '#71717a';
      ctx.fillRect(cigStartX + cigTotalW, cigY - 12, 28, 24);
      ctx.fillStyle = '#d4d4d8';
      ctx.fillRect(cigStartX + cigTotalW + 20, cigY - 10, 10, 20);
    } else {
      // Unlit cut tobacco
      ctx.fillStyle = '#573016';
      ctx.fillRect(cigStartX + cigTotalW - 10, cigY - 14, 10, 28);
    }

    // Tagline in center
    ctx.fillStyle = '#fef08a';
    ctx.font = 'italic 18px serif';
    ctx.textAlign = 'center';
    ctx.fillText(`“${cigarette.tagline}”`, W / 2, 470);

    // 4. Tar, Nicotine & CO 3-Box Display
    const specsY = 530;
    const boxW = (W - 120 - 20) / 3;

    // Tar box
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.roundRect(60, specsY, boxW, 110, [12, 12, 12, 12]);
    ctx.fill();
    ctx.fillStyle = '#a8a29e';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('焦油量 (Tar)', 60 + boxW / 2, specsY + 38);
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 36px monospace';
    ctx.fillText(`${cigarette.tar}mg`, 60 + boxW / 2, specsY + 84);

    // Nicotine box
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.roundRect(60 + boxW + 10, specsY, boxW, 110, [12, 12, 12, 12]);
    ctx.fill();
    ctx.fillStyle = '#a8a29e';
    ctx.font = '16px sans-serif';
    ctx.fillText('烟气烟碱 (Nicotine)', 60 + boxW * 1.5 + 10, specsY + 38);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px monospace';
    ctx.fillText(`${cigarette.nicotine}mg`, 60 + boxW * 1.5 + 10, specsY + 84);

    // CO box
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.roundRect(60 + (boxW + 10) * 2, specsY, boxW, 110, [12, 12, 12, 12]);
    ctx.fill();
    ctx.fillStyle = '#a8a29e';
    ctx.font = '16px sans-serif';
    ctx.fillText('一氧化碳 (CO)', 60 + boxW * 2.5 + 20, specsY + 38);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 36px monospace';
    ctx.fillText(`${cigarette.carbonMonoxide}mg`, 60 + boxW * 2.5 + 20, specsY + 84);

    // 5. Flavor Notes & Style
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.roundRect(60, 660, W - 120, 90, [12, 12, 12, 12]);
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`香型类别：${cigarette.type}  |  风味图谱：`, 85, 712);

    let tagOffset = 310;
    cigarette.flavorNotes.slice(0, 3).forEach((fn) => {
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(tagOffset, 692, 110, 32, [8, 8, 8, 8]);
      ctx.fill();
      ctx.fillStyle = '#f1f5f9';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(fn, tagOffset + 55, 713);
      tagOffset += 120;
    });

    // 6. History excerpt
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.roundRect(60, 770, W - 120, 240, [12, 12, 12, 12]);
    ctx.fill();

    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('【 品牌历史背景与文化简纪 】', 85, 810);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '17px serif';
    const words = cigarette.history;
    // Word wrap 35 chars per line
    let line = '';
    let curY = 850;
    for (let n = 0; n < words.length; n++) {
      line += words[n];
      if (line.length >= 36 || n === words.length - 1) {
        ctx.fillText(line, 85, curY);
        line = '';
        curY += 28;
        if (curY > 970) break;
      }
    }

    // 7. Footer Stamp & Health Notice
    ctx.fillStyle = '#27272a';
    ctx.fillRect(60, 1030, W - 120, 1);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('全球烟草鉴赏与拟真点烟模拟器 · 虚拟品鉴藏卡', 85, 1070);

    const nowStr = new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    ctx.textAlign = 'right';
    ctx.fillText(nowStr, W - 85, 1070);

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('吸烟有害健康 · 未成年人严禁吸烟 · 本页面仅供文化与物理渲染鉴赏', W / 2, 1115);

    setPosterUrl(canvas.toDataURL('image/png'));
  }, [cigarette, isLit, burnProgress]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(generatePoster, 100);
    }
  }, [isOpen, generatePoster]);

  if (!isOpen) return null;

  // Download image
  const handleDownload = () => {
    if (!posterUrl) return;
    const a = document.createElement('a');
    a.href = posterUrl;
    a.download = `${cigarette.name.replace(/\s+/g, '_')}_品鉴卡.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Copy share text
  const handleCopyText = async () => {
    const text = `【${cigarette.name} (${cigarette.country})】\n` +
      `🔥 焦油量: ${cigarette.tar}mg | 烟碱: ${cigarette.nicotine}mg | 一氧化碳: ${cigarette.carbonMonoxide}mg\n` +
      `🌿 风味: ${cigarette.flavorNotes.join('、')}\n` +
      `📜 “${cigarette.tagline}”\n` +
      `沉浸式重力感应点火体验：${window.location.href}`;
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Native Web Share API
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `全球名烟品鉴 · ${cigarette.name}`,
          text: `我正在品鉴【${cigarette.name}】，焦油量 ${cigarette.tar}mg，点击体验沉浸式重力感应点烟与烟雾物理渲染！`,
          url: window.location.href
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      } catch {
        // User cancelled or unsupported
      }
    } else {
      handleCopyText();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4">
      <div
        id="social-share-modal"
        className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950/80">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-zinc-100">
                生成社交分享品鉴海报
              </h2>
              <p className="text-xs text-zinc-400">
                支持高清下载保存相册、微信/朋友圈分享与规格复制
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Poster Preview */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center bg-zinc-950">
          {/* Hidden Canvas */}
          <canvas ref={canvasRef} className="hidden" />

          {posterUrl ? (
            <img
              src={posterUrl}
              alt="品鉴分享卡"
              className="w-full max-w-xs rounded-xl shadow-2xl border border-zinc-800 transition-transform duration-200 hover:scale-[1.01]"
            />
          ) : (
            <div className="w-64 h-96 rounded-xl bg-zinc-900 animate-pulse flex items-center justify-center text-zinc-600">
              <ImageIcon className="w-12 h-12" />
            </div>
          )}
        </div>

        {/* Actions Bar */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/90 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg cursor-pointer transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>保存高清海报</span>
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs border border-zinc-700 cursor-pointer transition-all active:scale-95"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{isCopied ? '已复制到剪贴板' : '复制分享文案'}</span>
          </button>

          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full sm:w-auto p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-400 border border-zinc-700 cursor-pointer"
              title="调用系统分享"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

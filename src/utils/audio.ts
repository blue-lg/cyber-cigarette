// Web Audio API pure procedural sound synthesizer for realistic lighter and smoking audio

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private flameGainNode: GainNode | null = null;
  private flameSourceNode: AudioNode | null = null;
  private inhaleGainNode: GainNode | null = null;
  private inhaleSourceNode: AudioNode | null = null;

  private initCtx(): AudioContext {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopFlameHiss();
      this.stopInhaleCrackle();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // 1. Zippo / Lighter lid open: crisp metallic "clink / ping"
  public playLighterOpen() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;

      // Resonant high metal ping (2200Hz - 3400Hz harmonics)
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(2650, now);
      osc.frequency.exponentialRampToValueAtTime(2450, now + 0.12);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(5300, now);
      osc2.frequency.exponentialRampToValueAtTime(4900, now + 0.08);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      // Noise click transient
      const bufferSize = ctx.sampleRate * 0.03;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.005));
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.value = 3500;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.4, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc2.start(now);
      noiseSource.start(now);

      osc.stop(now + 0.3);
      osc2.stop(now + 0.3);
    } catch {
      // Audio fallback
    }
  }

  // 2. Lighter lid close: solid metal "clack-chunk"
  public playLighterClose() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // Audio fallback
    }
  }

  // 3. Flint spark strike: "chhh-fwoosh" friction and spark
  public playLighterSpark() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;

      // Friction scrape (filtered noise burst)
      const bufferSize = ctx.sampleRate * 0.18;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const decay = Math.exp(-i / (ctx.sampleRate * 0.04));
        data[i] = (Math.random() * 2 - 1) * decay;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(4500, now);
      filter.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
      filter.Q.value = 3.0;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      // Gas catch "whoosh"
      const gasOsc = ctx.createOscillator();
      const gasGain = ctx.createGain();
      gasOsc.type = 'sine';
      gasOsc.frequency.setValueAtTime(180, now + 0.04);
      gasOsc.frequency.exponentialRampToValueAtTime(320, now + 0.12);
      gasGain.gain.setValueAtTime(0, now);
      gasGain.gain.setValueAtTime(0.25, now + 0.04);
      gasGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      gasOsc.connect(gasGain);
      gasGain.connect(ctx.destination);

      noise.start(now);
      gasOsc.start(now + 0.04);
      gasOsc.stop(now + 0.22);
    } catch {
      // Audio fallback
    }
  }

  // 4. Continuous gentle flame hiss
  public startFlameHiss() {
    if (this.isMuted || this.flameGainNode) return;
    try {
      const ctx = this.initCtx();
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02; // Pink-ish noise
        lastOut = data[i];
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 850;
      filter.Q.value = 1.2;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      this.flameSourceNode = noise;
      this.flameGainNode = gain;
    } catch {
      // Audio fallback
    }
  }

  public stopFlameHiss() {
    if (this.flameGainNode && this.ctx) {
      try {
        this.flameGainNode.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
        setTimeout(() => {
          if (this.flameSourceNode) {
            try { (this.flameSourceNode as AudioBufferSourceNode).stop(); } catch {}
            this.flameSourceNode = null;
          }
          this.flameGainNode = null;
        }, 120);
      } catch {
        this.flameGainNode = null;
      }
    }
  }

  // 5. Cigarette ignition crackle (when flame touches cigarette tip)
  public playIgnite(isKretek = false) {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const popCount = isKretek ? 22 : 12;

      for (let i = 0; i < popCount; i++) {
        const delay = Math.random() * 0.45;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = isKretek && i % 3 === 0 ? 'square' : 'triangle';
        osc.frequency.setValueAtTime(isKretek ? 800 + Math.random() * 2400 : 1200 + Math.random() * 1800, now + delay);

        const popVol = isKretek ? 0.35 : 0.2;
        gain.gain.setValueAtTime(popVol, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.02 + Math.random() * 0.03);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.06);
      }
    } catch {
      // Audio fallback
    }
  }

  // 6. Inhale & draw smoke crackle
  public startInhaleCrackle(isKretek = false) {
    if (this.isMuted || this.inhaleGainNode) return;
    try {
      const ctx = this.initCtx();
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        // Crackle spikes
        const isSpike = Math.random() < (isKretek ? 0.02 : 0.008);
        const spike = isSpike ? (Math.random() * 2 - 1) * 0.8 : (Math.random() * 2 - 1) * 0.08;
        data[i] = spike;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;
      filter.Q.value = 1.8;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.24, ctx.currentTime + 0.3);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      this.inhaleSourceNode = noise;
      this.inhaleGainNode = gain;
    } catch {
      // Audio fallback
    }
  }

  public stopInhaleCrackle() {
    if (this.inhaleGainNode && this.ctx) {
      try {
        this.inhaleGainNode.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
        setTimeout(() => {
          if (this.inhaleSourceNode) {
            try { (this.inhaleSourceNode as AudioBufferSourceNode).stop(); } catch {}
            this.inhaleSourceNode = null;
          }
          this.inhaleGainNode = null;
        }, 220);
      } catch {
        this.inhaleGainNode = null;
      }
    }
  }

  // 7. Exhale smoke whoosh
  public playExhaleSmoke() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.8;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const envelope = Math.sin((i / bufferSize) * Math.PI);
        data[i] = (Math.random() * 2 - 1) * envelope;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.exponentialRampToValueAtTime(220, now + 0.7);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
    } catch {
      // Audio fallback
    }
  }

  // 8. Flick ash tap sound
  public playAshFlick() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.05);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Audio fallback
    }
  }

  // 9. Popping bead crack sound
  public playBeadPop() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(2400, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.04);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // Audio fallback
    }
  }
}

export const soundEngine = new SoundEngine();

/**
 * Procedural Web Audio Sound Generator for Paper Logic
 * Creates organic sounds without external mp3 dependencies:
 * - Paperclip metallic click / clack
 * - Electrical spark / hum
 * - Success chime
 * - Error buzzer / warning thump
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazy initialize on first user gesture
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  /**
   * Metallic paperclip toggle click sound
   */
  public playClipToggle(closed: boolean) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    // Higher click when connecting, lower when disconnecting
    osc.frequency.setValueAtTime(closed ? 1200 : 750, now);
    osc.frequency.exponentialRampToValueAtTime(closed ? 2400 : 350, now + 0.04);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  /**
   * Bulb turned on glow / spark
   */
  public playLightOn() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  /**
   * Validation success chime
   */
  public playSuccess() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0.12, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.3);
    });
  }

  /**
   * Error buzz / penalty thump
   */
  public playError() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(90, now + 0.18);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  /**
   * Paper rustle / button click
   */
  public playPaperTap() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  /**
   * Sound when lamp cracks (2nd error in phase)
   */
  public playGlassCrack() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // High snap
    const snap = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snap.type = 'sawtooth';
    snap.frequency.setValueAtTime(2800, now);
    snap.frequency.exponentialRampToValueAtTime(800, now + 0.08);

    snapGain.gain.setValueAtTime(0.25, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    snap.connect(snapGain);
    snapGain.connect(this.ctx.destination);
    snap.start(now);
    snap.stop(now + 0.1);

    // Subtle brittle rattle
    const rattle = this.ctx.createOscillator();
    const rattleGain = this.ctx.createGain();
    rattle.type = 'square';
    rattle.frequency.setValueAtTime(1400, now + 0.03);
    rattle.frequency.linearRampToValueAtTime(3200, now + 0.09);

    rattleGain.gain.setValueAtTime(0.12, now + 0.03);
    rattleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    rattle.connect(rattleGain);
    rattleGain.connect(this.ctx.destination);
    rattle.start(now + 0.03);
    rattle.stop(now + 0.13);
  }

  /**
   * Sound when lamp shatters/breaks completely (3rd error in phase)
   */
  public playGlassBreak() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Burst crash
    const crash = this.ctx.createOscillator();
    const crashGain = this.ctx.createGain();
    crash.type = 'sawtooth';
    crash.frequency.setValueAtTime(900, now);
    crash.frequency.exponentialRampToValueAtTime(120, now + 0.35);

    crashGain.gain.setValueAtTime(0.35, now);
    crashGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    crash.connect(crashGain);
    crashGain.connect(this.ctx.destination);
    crash.start(now);
    crash.stop(now + 0.36);

    // High scattering shards ping
    [2400, 3100, 3800, 4400].forEach((freq, idx) => {
      if (!this.ctx) return;
      const shard = this.ctx.createOscillator();
      const shardGain = this.ctx.createGain();
      const delay = idx * 0.04;

      shard.type = 'triangle';
      shard.frequency.setValueAtTime(freq, now + delay);
      shard.frequency.exponentialRampToValueAtTime(freq * 0.6, now + delay + 0.15);

      shardGain.gain.setValueAtTime(0.15, now + delay);
      shardGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.16);

      shard.connect(shardGain);
      shardGain.connect(this.ctx.destination);
      shard.start(now + delay);
      shard.stop(now + delay + 0.17);
    });
  }
}

export const soundManager = new SoundController();

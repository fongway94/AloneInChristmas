// Web Audio 将短音效、音乐与人声统一混音。用户只需在输出页面互动一次；
// 后续画面无需为每个新音轨重新取得浏览器自动播放权限。
export class WebAudioManager {
  constructor(muted = false, Context = globalThis.AudioContext || globalThis.webkitAudioContext) {
    this.muted = muted;
    this.context = muted || !Context ? null : new Context();
    this.scene = null; this.tracks = []; this.retiring = []; this.cache = new Map();
    this.failed = new Set(); this.lastState = { playing: false, black: true };
  }
  unlock() {
    // 此方法须在 click / pointerdown 事件处理器内同步调用。
    if (!this.context) return;
    try {
      // 某些 iOS 版本还需要在同一手势里启动一个极短的静音缓冲。
      if (this.context.state !== 'running' && this.context.createBuffer) {
        const source = this.context.createBufferSource();
        source.buffer = this.context.createBuffer(1, 1, this.context.sampleRate);
        source.connect(this.context.destination); source.onended = () => source.disconnect(); source.start(0);
      }
      this.context.resume().catch(() => {});
    } catch (_) { /* 稍后可重新点击 */ }
  }
  preload(sources) { if (this.context) for (const src of new Set(sources)) this.getBuffer(src); }
  getBuffer(src) {
    if (!this.cache.has(src)) {
      const promise = fetch(src).then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.arrayBuffer();
      }).then(data => this.context.decodeAudioData(data)).then(buffer => { this.failed.delete(src); return buffer; }).catch(() => { this.failed.add(src); this.cache.delete(src); return null; });
      this.cache.set(src, promise);
    }
    return this.cache.get(src);
  }
  load(scene) {
    const oldScene = this.scene, previous = this.tracks;
    this.scene = scene;
    if (!this.context || !scene?.audio) { this.stop(); return; }
    const config = scene.audio;
    const entries = [
      ...(config.music ? [{ ...config.music, kind: 'music' }] : []),
      ...(config.ambience || []).map(item => ({ ...item, kind: 'effects' })),
      ...(config.effects || []).map(item => ({ ...item, kind: item.kind || 'effects' }))
    ].filter(item => item.src);
    // 只保留当前音乐／环境与小型音效：解码后的长音乐会占用较多手机内存。
    const activeSources = new Set(entries.map(item => item.src));
    for (const src of this.cache.keys()) if (!activeSources.has(src) && !src.includes('/sfx/') && !src.endsWith('/prayer.mp3') && !src.endsWith('/testimony.mp3')) this.cache.delete(src);
    const reused = new Set();
    this.tracks = entries.map(item => {
      const prior = item.continuity && oldScene?.id !== scene.id
        ? previous.find(track => !reused.has(track) && track.src === item.src && track.continuity === item.continuity && track.kind === item.kind) : null;
      if (prior) {
        reused.add(prior);
        const offset = prior.node ? this.position(prior) : (prior.lastTarget ?? prior.offset ?? 0);
        const fromVolume = prior.currentVolume || 0;
        Object.assign(prior, item, { fadeIn: 0, offset, lastTarget: offset, fromVolume, transitionAt: this.context.currentTime });
        return prior;
      }
      const track = { ...item, offset: 0, buffer: null, node: null, gain: null, cycle: -1, ended: false, lastTarget: 0, currentVolume: 0 };
      this.getBuffer(item.src).then(buffer => { track.buffer = buffer; });
      return track;
    });
    for (const track of previous) {
      if (reused.has(track)) continue;
      if (track.continuity && track.node) this.retiring.push({ track, startedAt: this.context.currentTime, volume: track.currentVolume });
      else this.stopTrack(track);
    }
  }
  position(track) {
    return track.node ? track.startOffset + Math.max(0, this.context.currentTime - track.startedAt) : track.lastTarget;
  }
  stopTrack(track) {
    if (!track.node) return;
    track.node.onended = null;
    try { track.node.stop(); } catch (_) {}
    try { track.node.disconnect(); track.gain.disconnect(); } catch (_) {}
    track.node = null; track.gain = null;
  }
  startTrack(track, target) {
    const node = this.context.createBufferSource(), gain = this.context.createGain();
    node.buffer = track.buffer; node.loop = !!track.loop && !track.repeatEvery;
    node.connect(gain); gain.connect(this.context.destination);
    track.node = node; track.gain = gain; track.startedAt = this.context.currentTime; track.startOffset = target;
    gain.gain.setValueAtTime(0, this.context.currentTime);
    node.onended = () => { if (track.node === node) { track.node = null; track.gain = null; track.ended = true; try { node.disconnect(); gain.disconnect(); } catch (_) {} } };
    try { node.start(0, target); } catch (_) { this.stopTrack(track); }
  }
  update(time, playing, black, masterVolume = 1, levels = {}) {
    this.lastState = { playing, black, masterVolume, levels };
    if (!this.context) return;
    const ctx = this.context;
    this.retiring = this.retiring.filter(item => {
      const remaining = Math.max(0, 1 - (ctx.currentTime - item.startedAt) / 1.2);
      if (!playing || black || masterVolume === 0 || levels[item.track.kind] === 0 || remaining <= 0) { this.stopTrack(item.track); return false; }
      if (item.track.gain) item.track.gain.gain.setTargetAtTime(item.volume * remaining, ctx.currentTime, .02);
      return true;
    });
    for (const track of this.tracks) {
      const start = track.at || 0, end = track.end ?? Infinity;
      if (time < start || time >= end || black || !playing) { this.stopTrack(track); continue; }
      let target = time - start + track.offset;
      if (track.repeatEvery) {
        const cycle = Math.floor(target / track.repeatEvery); target %= track.repeatEvery;
        if (cycle !== track.cycle) { this.stopTrack(track); track.cycle = cycle; track.ended = false; }
      }
      track.lastTarget = target;
      if (!track.buffer) continue;
      if (track.loop && !track.repeatEvery) target %= track.buffer.duration;
      else if (target >= track.buffer.duration) { this.stopTrack(track); continue; }
      if (ctx.state !== 'running') { this.stopTrack(track); continue; }
      if (track.node) {
        let actual = this.position(track);
        if (track.loop && !track.repeatEvery) actual %= track.buffer.duration;
        const delta = Math.abs(actual - target), loopDelta = track.loop ? Math.min(delta, Math.abs(track.buffer.duration - delta)) : delta;
        if (loopDelta > 1.5) this.stopTrack(track);
      }
      if (!track.node && !track.ended) this.startTrack(track, target);
      const fadeIn = track.fadeIn && track.transitionAt == null ? Math.min(1, (time - start) / track.fadeIn) : 1;
      const fadeOut = track.fadeOut && Number.isFinite(end) ? Math.max(0, Math.min(1, (end - time) / track.fadeOut)) : 1;
      let volume = Math.max(0, Math.min(1, (this.scene.audio.volume ?? 1) * (track.volume ?? 1) * masterVolume * (levels[track.kind] ?? 1) * fadeIn * fadeOut));
      if (volume === 0) track.transitionAt = null;
      if (track.transitionAt != null) {
        const p = Math.min(1, (ctx.currentTime - track.transitionAt) / 1.2);
        volume = track.fromVolume + (volume - track.fromVolume) * p;
        if (p >= 1) track.transitionAt = null;
      }
      track.currentVolume = Math.max(0, Math.min(1, volume));
      if (track.gain) track.gain.gain.setTargetAtTime(track.currentVolume, ctx.currentTime, .02);
    }
  }
  status() {
    if (!this.context) return '不可用';
    if (this.lastState.black || !this.lastState.playing) return '等待播放';
    if (this.context.state !== 'running') return '需要点击输出页面启用声音';
    if (this.tracks.some(t => this.failed.has(t.src))) return '部分音频加载失败，请检查网络';
    if (this.tracks.some(t => t.node && t.currentVolume > 0)) return '音频播放中';
    if (this.tracks.some(t => t.node)) return '当前分轨音量为零';
    return '正在加载音频';
  }
  stop() {
    for (const track of this.tracks) this.stopTrack(track);
    for (const item of this.retiring) this.stopTrack(item.track);
    this.tracks = []; this.retiring = [];
  }
}

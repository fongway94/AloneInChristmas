// Web Audio 將短音效、音乐与人声统一混音。用户只需在输出页面互动一次；
// 后续画面无需为每个新音轨重新取得浏览器自动播放权限。
// 若某首 MP3 无法被 Web Audio API 解码，会自动回退为 HTML Audio（<audio>）播放，
// 并在控制台与状态里记录错误，方便排查。
export class WebAudioManager {
  constructor(muted = false, Context = globalThis.AudioContext || globalThis.webkitAudioContext) {
    this.muted = muted;
    this.context = muted || !Context ? null : new Context();
    this.scene = null; this.tracks = []; this.retiring = []; this.cache = new Map();
    this.preloadedAt = new Map(); // src -> 最近預載時間戳，避免 load() 誤淘汰剛預載的下一場景資源
    this.failed = new Set(); this.lastState = { playing: false, black: true };
    this.fallbacks = new Map(); // src -> HTML Audio 後備音軌（Web Audio 解码失败时使用）
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
  preload(sources) { if (!this.context) return; const now = Date.now(); for (const src of new Set(sources)) { if (!src) continue; this.preloadedAt.set(src, now); this.getBuffer(src); } }
  // 預載指定場景的全部音源（音樂＋環境＋音效/人聲），用於下一場景提前解碼，避免切換時延遲
  preloadScene(scene) {
    if (!this.context || !scene?.audio) return;
    const cfg = scene.audio;
    const sources = [
      ...(cfg.music ? [cfg.music.src] : []),
      ...(cfg.ambience || []).map(item => item.src),
      ...(cfg.effects || []).map(item => item.src)
    ].filter(Boolean);
    this.preload(sources);
  }
  getBuffer(src) {
    if (!this.cache.has(src)) {
      const promise = fetch(src).then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.arrayBuffer();
      }).then(data => this.context.decodeAudioData(data)).then(buffer => { this.failed.delete(src); return buffer; }).catch(err => { this.failed.add(src); this.cache.delete(src); console.warn('[AloneInChristmas] 音频加载/解码失败：' + src, err); return null; });
      this.cache.set(src, promise);
    }
    return this.cache.get(src);
  }
  makeFallback(item) {
    const audio = new Audio(item.src);
    audio.preload = 'auto';
    audio.loop = !!item.loop && !item.repeatEvery;
    return { ...item, audio, started: false, lastPlayAttempt: 0, fromVolume: 0, transitionAt: null };
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
    // 只淘汰非當前場景的長音訊（音樂/環境）：解碼後的長音樂會占用較多手機記憶體。
    // 短音效與人聲（sfx、錄音、TTS 語音）體積小，保留快取以便切換時即時播放；
    // 下一場景的音樂由 preloadScene() 在 load() 之後預載，不會被此處淘汰。
    const activeSources = new Set(entries.map(item => item.src));
    const isLongAudio = src => {
      if (src.includes('Christmas Recording') || src.includes('/sfx/') || src.includes('voice-')) return false;
      return src.includes('/music/') || src.includes('/ambience/') || src.startsWith('Music/');
    };
    const now = Date.now();
    for (const src of this.cache.keys()) {
      if (activeSources.has(src) || !isLongAudio(src)) continue;
      // 剛預載（60 秒內）的資源不淘汰，確保下一場景切換時即時播放
      if (now - (this.preloadedAt.get(src) || 0) < 60000) continue;
      this.cache.delete(src);
    }
    // 清理不再使用的 HTML Audio 後備
    for (const src of this.fallbacks.keys()) if (!activeSources.has(src)) { const fb = this.fallbacks.get(src); fb.audio.pause(); fb.audio.src = ''; this.fallbacks.delete(src); }
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
      if (!playing || black || levels[item.track.kind] === 0 || remaining <= 0) { this.stopTrack(item.track); return false; }
      if (item.track.gain) item.track.gain.gain.setTargetAtTime(item.volume * remaining, ctx.currentTime, .02);
      return true;
    });
    // 将已解码失败且尚未建立后备的音轨切换到 HTML Audio
    for (const track of this.tracks) {
      if (track.htmlFallback) continue;
      if (!track.buffer && this.failed.has(track.src)) {
        track.htmlFallback = true;
        this.fallbacks.set(track.src, this.makeFallback(track));
        console.warn('[AloneInChristmas] 已启用 HTML Audio 后备播放：' + track.src);
      }
    }
    for (const track of this.tracks) {
      if (track.htmlFallback) continue; // 由下方 HTML Audio 逻辑驱动
      const start = track.at || 0, end = track.end ?? Infinity;
      if (time < start || time >= end || black || !playing) { this.stopTrack(track); continue; }
      let target = time - start + track.offset;
      if (track.repeatEvery) {
        const cycle = Math.floor(target / track.repeatEvery); target %= track.repeatEvery;
        if (cycle !== track.cycle) { this.stopTrack(track); track.cycle = cycle; track.ended = false; }
      }
      track.lastTarget = target;
      if (!track.buffer) continue; // 仍在载入，或已切后备
      if (track.loop && !track.repeatEvery) target %= track.buffer.duration;
      else if (target >= track.buffer.duration) { this.stopTrack(track); continue; }
      if (ctx.state !== 'running') { this.stopTrack(track); continue; }
      if (track.node) {
        if (track.loop && !track.repeatEvery) {
          // 循環音軌始終保持播放，不因時間偏差（場景淡出/黑屏後）而停止
        } else {
          let actual = this.position(track);
          const delta = Math.abs(actual - target);
          if (delta > 1.5) this.stopTrack(track);
        }
      }
      if (!track.node && !track.ended) this.startTrack(track, target);
      const fadeIn = track.fadeIn && track.transitionAt == null ? Math.min(1, (time - start) / track.fadeIn) : 1;
      const fadeOut = track.fadeOut && Number.isFinite(end) ? Math.max(0, Math.min(1, (end - time) / track.fadeOut)) : 1;
      // 每個音頻類型只響應其對應的音量滑塊，不響應總音量滑塊（masterVolume），避免過度縮放
      // 音樂允許 track.volume 超過 1 做額外增益（例如 lonely1 設為 1.3）
      let volume;
      if (track.kind === 'music') {
        volume = Math.max(0, (this.scene.audio.volume ?? 1) * (track.volume ?? 1) * (levels.music ?? 1) * fadeIn * fadeOut);
      } else if (track.kind === 'effects') {
        volume = Math.max(0, Math.min(1, (this.scene.audio.volume ?? 1) * (track.volume ?? 1) * (levels.effects ?? 1) * fadeIn * fadeOut));
      } else if (track.kind === 'voice') {
        // 語音允許 track.volume 超過 1 做額外增益（例如第六幕錄音設為 1.5）
        volume = Math.max(0, (this.scene.audio.volume ?? 1) * (track.volume ?? 1) * (levels.voice ?? 1) * fadeIn * fadeOut);
      } else {
        volume = Math.max(0, Math.min(1, (this.scene.audio.volume ?? 1) * (track.volume ?? 1) * fadeIn * fadeOut));
      }
      if (volume === 0) track.transitionAt = null;
      if (track.transitionAt != null) {
        const p = Math.min(1, (ctx.currentTime - track.transitionAt) / 1.2);
        volume = track.fromVolume + (volume - track.fromVolume) * p;
        if (p >= 1) track.transitionAt = null;
      }
      track.currentVolume = Math.max(0, Math.min(1, volume));
      if (track.gain) track.gain.gain.setTargetAtTime(track.currentVolume, ctx.currentTime, .02);
    }
    // 驱动 HTML Audio 后备音轨
    for (const fb of this.fallbacks.values()) {
      const a = fb.audio;
      const start = fb.at || 0, end = fb.end ?? Infinity;
      if (time < start || time >= end || black || !playing) { if (!a.paused) a.pause(); continue; }
      let target = time - start;
      if (fb.loop && !fb.repeatEvery) { const duration = Number.isFinite(a.duration) && a.duration > 0 ? a.duration : Infinity; if (duration !== Infinity) target %= duration; }
      else if (Number.isFinite(a.duration) && a.duration > 0 && target >= a.duration) { if (!a.paused) a.pause(); continue; }
      const ready = a.readyState >= 1;
      if (ready && !a.seeking && Number.isFinite(a.duration) && a.duration > 0 && Math.abs(a.currentTime - target) > 1.5) {
        try { a.currentTime = target; } catch (_) {}
      }
      const fadeIn = fb.fadeIn && !fb.transitionAt ? Math.min(1, (time - start) / fb.fadeIn) : 1;
      const group = levels[fb.kind] ?? 1;
      // 音效與環境音只響應 levels.effects，不響應 masterVolume（總音量），避免過度縮放
      let targetVolume = Math.max(0, Math.min(1, (this.scene.audio.volume ?? 1) * (fb.volume ?? 1) * group * fadeIn));
      if (fb.transitionAt) {
        const p = Math.min(1, (Date.now() - fb.transitionAt) / 1200);
        targetVolume = fb.fromVolume + (targetVolume - fb.fromVolume) * p;
        if (p >= 1) fb.transitionAt = null;
      }
      a.volume = Math.max(0, Math.min(1, targetVolume));
      if (a.paused && (!fb.lastPlayAttempt || Date.now() - fb.lastPlayAttempt >= 1000)) {
        fb.lastPlayAttempt = Date.now();
        try { a.play()?.catch(() => {}); } catch (_) {}
      }
    }
  }
  status() {
    if (!this.context) return '不可用';
    if (this.lastState.black || !this.lastState.playing) return '等待播放';
    if (this.context.state !== 'running') return '需要点击输出页面启用声音';
    if (this.failed.size) {
      const failedList = [...this.failed].join(', ');
      return `部分音频已切 HTML Audio 后备播放：${failedList}`;
    }
    if (this.tracks.some(t => this.failed.has(t.src))) return '部分音频加载失败，请检查网络';
    if (this.tracks.some(t => t.node && t.currentVolume > 0)) return '音频播放中';
    if (this.tracks.some(t => t.node)) return '当前分轨音量为零';
    if ([...this.fallbacks.values()].some(fb => !fb.audio.paused && fb.audio.volume > 0)) return '音频播放中（HTML Audio 后备）';
    return '正在加载音频';
  }
  stop() {
    for (const track of this.tracks) this.stopTrack(track);
    for (const item of this.retiring) this.stopTrack(item.track);
    for (const fb of this.fallbacks.values()) { fb.audio.pause(); fb.audio.src = ''; }
    this.tracks = []; this.retiring = []; this.fallbacks.clear();
  }
}

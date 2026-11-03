// 舞台窗口播放音频；操作台内嵌预览始终静音。
export class AudioManager {
  constructor(muted = false) { this.muted = muted; this.scene = null; this.tracks = []; this.retiring = []; }
  load(scene) {
    const oldScene = this.scene;
    const previous = this.tracks;
    this.scene = scene;
    if (this.muted || !scene?.audio) { this.stop(); return; }
    const config = scene.audio;
    const entries = [
      ...(config.music ? [{ ...config.music, kind: 'music' }] : []),
      ...(config.ambience || []).map(item => ({ ...item, kind: 'effects' })),
      ...(config.effects || []).map(item => ({ ...item, kind: item.kind || 'effects' }))
    ].filter(item => item.src);
    const reused = new Set();
    this.tracks = entries.map(item => {
      // 相邻画面同一条持续音轨不中断；重播同一画面则重新开始。
      const prior = item.continuity && oldScene?.id !== scene.id
        ? previous.find(track => !reused.has(track) && track.src === item.src && track.continuity === item.continuity && track.kind === item.kind)
        : null;
      if (prior) {
        reused.add(prior);
        return { ...item, fadeIn: 0, audio: prior.audio, started: true, offset: prior.audio.currentTime || 0,
          fromVolume: prior.audio.volume, transitionAt: Date.now(), cycle: 0 };
      }
      const audio = new Audio(item.src); audio.preload = 'auto'; audio.loop = !!item.loop && !item.repeatEvery;
      return { ...item, audio, started: false, offset: 0, cycle: -1 };
    });
    for (const track of previous) {
      if (reused.has(track)) continue;
      if (track.continuity && !track.audio.paused) {
        this.retiring.push({ audio: track.audio, kind: track.kind, volume: track.audio.volume, startedAt: Date.now(), duration: 1200 });
      } else { track.audio.pause(); track.audio.src = ''; }
    }
  }
  update(time, playing, black, masterVolume = 1, levels = {}) {
    // 不同音乐／环境音切换时短暂交叉淡化，避免切画面时突然中断。
    this.retiring = this.retiring.filter(track => {
      const remaining = Math.max(0, 1 - (Date.now() - track.startedAt) / track.duration);
      if (!playing || black || masterVolume === 0 || levels[track.kind] === 0 || remaining <= 0) { track.audio.pause(); track.audio.src = ''; return false; }
      track.audio.volume = Math.max(0, Math.min(1, track.volume * remaining)); return true;
    });
    for (const track of this.tracks) {
      const a = track.audio, start = track.at || 0, end = track.end ?? Infinity;
      if (time < start || time >= end || black || !playing) { if (!a.paused) a.pause(); continue; }
      let target = time - start + track.offset;
      if (track.repeatEvery) {
        const cycle = Math.floor(target / track.repeatEvery);
        target %= track.repeatEvery;
        if (cycle !== track.cycle) { track.cycle = cycle; track.started = false; }
      }
      if (Number.isFinite(a.duration) && a.duration > 0) {
        if (track.loop && !track.repeatEvery) target %= a.duration;
        else if (target >= a.duration) { if (!a.paused) a.pause(); continue; }
      }
      // 等媒体元数据就绪再定位；正在定位时勿逐帧重复设置，避免阻塞缓冲。
      if (typeof a.readyState === 'number' && a.readyState < 1) continue;
      if (!a.seeking && (!track.started || Math.abs(a.currentTime - target) > 1.5) && (!track.lastSeek || Date.now() - track.lastSeek > 1000)) {
        try { a.currentTime = target; track.lastSeek = Date.now(); track.started = true; } catch (_) {}
      }
      const fadeIn = track.fadeIn && !track.transitionAt ? Math.min(1, (time - start) / track.fadeIn) : 1;
      const fadeOut = track.fadeOut && Number.isFinite(end) ? Math.max(0, Math.min(1, (end - time) / track.fadeOut)) : 1;
      const group = levels[track.kind] ?? 1;
      let targetVolume = Math.max(0, Math.min(1, (this.scene.audio.volume ?? 1) * (track.volume ?? 1) * masterVolume * group * fadeIn * fadeOut));
      if (targetVolume === 0) track.transitionAt = null;
      if (track.transitionAt) {
        const p = Math.min(1, (Date.now() - track.transitionAt) / 1200);
        targetVolume = track.fromVolume + (targetVolume - track.fromVolume) * p;
        if (p >= 1) track.transitionAt = null;
      }
      a.volume = Math.max(0, Math.min(1, targetVolume));
      if (a.paused) a.play().catch(() => {}); // 浏览器可能要求先点击舞台窗口。
    }
  }
  stop() {
    for (const track of [...this.tracks, ...this.retiring]) { track.audio.pause(); track.audio.src = ''; }
    this.tracks = []; this.retiring = [];
  }
}

// Optional local audio. The stage display alone plays sound; the operator preview is muted.
export class AudioManager {
  constructor(muted = false) { this.muted = muted; this.scene = null; this.tracks = []; }
  load(scene) {
    this.stop(); this.scene = scene;
    if (this.muted || !scene?.audio) return;
    const config = scene.audio;
    const entries = [...(config.music ? [{ ...config.music, at: config.music.at || 0 }] : []), ...(config.effects || [])];
    this.tracks = entries.filter(item => item.src).map(item => ({ ...item, audio: new Audio(item.src), started: false }));
  }
  update(time, playing, black, masterVolume = 1) {
    for (const track of this.tracks) {
      const a = track.audio, start = track.at || 0, end = track.end ?? Infinity;
      if (time < start || time >= end || black || !playing) { if (!a.paused) a.pause(); continue; }
      const target = time - start;
      // 播放完成後不要反覆從頭播放；時間軸仍可在暫停／繼續時追上。
      if (Number.isFinite(a.duration) && target >= a.duration) { if (!a.paused) a.pause(); continue; }
      if (!track.started || Math.abs(a.currentTime - target) > 1.5) { try { a.currentTime = target; } catch (_) {} track.started = true; }
      const fadeIn = track.fadeIn ? Math.min(1, target / track.fadeIn) : 1;
      const fadeOut = track.fadeOut && Number.isFinite(end) ? Math.min(1, (end - time) / track.fadeOut) : 1;
      a.volume = Math.max(0, Math.min(1, (this.scene.audio.volume ?? 1) * (track.volume ?? 1) * masterVolume * fadeIn * fadeOut));
      if (a.paused) a.play().catch(() => {}); // Browsers may require a gesture on the stage window.
    }
  }
  stop() { for (const track of this.tracks) { track.audio.pause(); track.audio.src = ''; } this.tracks = []; }
}

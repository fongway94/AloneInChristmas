import { AudioManager } from './audioManager.js?v=audio3';
import { WebAudioManager } from './webAudioManager.js?v=audio3';
// 现代浏览器优先使用同一个已解锁的 Web Audio 混音器；旧浏览器保留 HTML 音频后备方案。
export function createAudioManager(muted = false) {
  if (!muted && (globalThis.AudioContext || globalThis.webkitAudioContext)) {
    try { return new WebAudioManager(); } catch (_) { /* 回退至 HTML 音频 */ }
  }
  return new AudioManager(muted);
}

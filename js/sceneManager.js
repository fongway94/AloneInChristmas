import { scenes } from '../scenes/index.js';
export { scenes };
const KEY = 'alone-in-christmas-state-v2';
const CHANNEL = 'alone-in-christmas-v2';
const initial = () => ({ index: -1, elapsed: 0, playing: false, black: false, updatedAt: Date.now(), revision: 0 });
export function elapsed(state, now = Date.now()) {
  return Math.max(0, state.elapsed + (state.playing ? (now - state.updatedAt) / 1000 : 0));
}
export class SceneManager {
  constructor() {
    this.state = this.read() || initial();
    this.listeners = new Set();
    try { this.channel = new BroadcastChannel(CHANNEL); this.channel.onmessage = e => this.receive(e.data); } catch (_) { /* storage events are the fallback */ }
    window.addEventListener('storage', e => { if (e.key === KEY && e.newValue) { try { this.receive(JSON.parse(e.newValue)); } catch (_) {} } });
  }
  read() { try { const value = JSON.parse(localStorage.getItem(KEY)); return value && typeof value.index === 'number' ? value : null; } catch (_) { return null; } }
  receive(value) { if (!value || typeof value.revision !== 'number' || value.revision <= this.state.revision) return; this.state = value; this.notify(); }
  notify() { this.listeners.forEach(fn => fn(this.state)); }
  subscribe(fn) { this.listeners.add(fn); fn(this.state); return () => this.listeners.delete(fn); }
  update(patch) {
    const latest = this.read();
    if (latest && latest.revision > this.state.revision) this.state = latest;
    const now = Date.now();
    this.state = { ...this.state, elapsed: elapsed(this.state, now), ...patch, updatedAt: now, revision: Math.max(now, this.state.revision + 1) };
    try { localStorage.setItem(KEY, JSON.stringify(this.state)); } catch (_) {}
    this.channel?.postMessage(this.state); this.notify();
  }
  go(index) { if (index < 0 || index > scenes.length) return; this.update({ index, elapsed: 0, playing: index < scenes.length, black: false, runId: (this.state.runId || 0) + 1 }); }
  next() { this.go(Math.min(this.state.index + 1, scenes.length)); }
  previous() { if (this.state.index > 0) this.go(this.state.index - 1); }
  restart() { if (this.state.index >= 0 && this.state.index < scenes.length) this.go(this.state.index); }
  togglePlay() { if (this.state.index >= 0 && this.state.index < scenes.length && elapsed(this.state) < scenes[this.state.index].duration) this.update({ playing: !this.state.playing }); }
  toggleBlack() { this.update({ black: !this.state.black }); }
}

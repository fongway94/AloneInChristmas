import assert from 'node:assert/strict';
import { AudioManager } from '../js/audioManager.js';
class FakeAudio {
  constructor(src) { this.src = src; this.duration = 18.6; this.currentTime = 0; this.paused = true; this.volume = 1; this.playCount = 0; }
  play() { this.paused = false; this.playCount++; return Promise.resolve(); }
  pause() { this.paused = true; }
}
globalThis.Audio = FakeAudio;
const manager = new AudioManager();
manager.load({ audio: { volume: 1, effects: [{ src: 'prayer.mp3', at: 2, end: 20.7, volume: 1 }] } });
const a = manager.tracks[0].audio;
manager.update(1, true, false); assert.equal(a.playCount, 0);
manager.update(3, true, false, .5); assert.equal(a.playCount, 1); assert.equal(a.volume, .5); assert.equal(a.currentTime, 1);
manager.update(5, false, false); assert.equal(a.paused, true);
manager.update(5, true, false); assert.equal(a.paused, false); assert.equal(a.currentTime, 3);
manager.update(6, true, true); assert.equal(a.paused, true);
manager.update(21, true, false); assert.equal(a.paused, true);
manager.stop(); assert.equal(manager.tracks.length, 0);
const preview = new AudioManager(true); preview.load({audio: {effects: [{src:'x.mp3'}]}}); assert.equal(preview.tracks.length, 0);
console.log('预录音讯的开始、静音、暂停、音量及结束测试通过。');

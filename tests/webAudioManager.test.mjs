import assert from 'node:assert/strict';
import { WebAudioManager } from '../js/webAudioManager.js';
class FakeContext {
  constructor() { this.state = 'suspended'; this.currentTime = 0; this.destination = {}; this.created = []; }
  resume() { this.state = 'running'; return Promise.resolve(); }
  decodeAudioData() { return Promise.resolve({duration: 10}); }
  createGain() { return { gain: { setValueAtTime(v) { this.value = v; }, setTargetAtTime(v) { this.value = v; } }, connect() {}, disconnect() {} }; }
  createBufferSource() {
    const node = { connect() {}, disconnect() {}, start(when, offset) { this.started = true; this.offset = offset; }, stop() { this.stopped = true; }, onended: null };
    this.created.push(node); return node;
  }
}
const originalFetch = globalThis.fetch;
globalThis.fetch = async () => ({ok:true,arrayBuffer:async()=>new ArrayBuffer(1)});
const flush = async () => { for (let i=0;i<8;i++) await Promise.resolve(); };
const audio = new WebAudioManager(false, FakeContext), ctx = audio.context;
const scene = (id, vol=.2) => ({id,audio:{music:{src:'song.mp3',loop:true,continuity:'song',volume:vol},effects:[{src:'message.wav',at:2,volume:.7}]}});
audio.load(scene('one')); await flush();
audio.update(1,true,false); assert.equal(ctx.created.length,0, '音频在用户解锁前不得开始');
audio.unlock(); audio.update(1,true,false); assert.equal(ctx.created.length,1); const bg=audio.tracks[0].node; assert.equal(bg.loop,true);
audio.update(2.2,true,false); assert.equal(ctx.created.length,2); const effect=audio.tracks[1].node; assert.ok(effect.started);
audio.update(3,false,false); assert.ok(bg.stopped && effect.stopped, '暂停停止所有源');
ctx.currentTime=4; audio.update(3,true,false); assert.equal(ctx.created.length,4, '继续时按照时间重建音源');
const resumed=audio.tracks[0].node;ctx.currentTime=5; audio.load(scene('two',.1)); assert.equal(audio.tracks[0].node,resumed, '相邻画面持续同一音轨');
audio.update(0,true,false); assert.equal(audio.tracks[0].node,resumed);
audio.update(1,true,true); assert.equal(audio.tracks[0].node,null, '黑场静音');
audio.update(2,true,false,1,{music:0,effects:1}); assert.equal(audio.tracks[0].currentVolume,0);
audio.load({id:'third',audio:{music:{src:'other.mp3',continuity:'other',loop:true,volume:.2}}}); await flush();
assert.ok(audio.retiring.length>0, '切换背景音保留短暂淡出'); ctx.currentTime += 2;audio.update(3,true,false); assert.equal(audio.retiring.length,0);
audio.stop(); assert.equal(audio.tracks.length,0);
// 还在下载时切换到相邻画面：共享对象收到解码结果，不能永久静音。
const delayed = new WebAudioManager(false, FakeContext); delayed.load(scene('a')); const first=delayed.tracks[0]; delayed.load(scene('b')); await flush();
assert.equal(delayed.tracks[0],first); assert.ok(delayed.tracks[0].buffer); delayed.unlock(); delayed.update(1,true,false); assert.ok(delayed.tracks[0].node);
delayed.stop(); globalThis.fetch = originalFetch;
console.log('Web Audio 解锁、分轨、暂停黑场、连续播放、切换淡化及延迟解码测试通过。');
// iOS 兼容手势：在 resume 的同时启动一个静音缓冲，不能产生可闻提示声。
class IOSContext extends FakeContext { constructor() { super(); this.sampleRate=48000; } createBuffer(channels, frames, rate) { return {duration:frames/rate}; } }
const ios = new WebAudioManager(false, IOSContext); ios.unlock();
assert.equal(ios.context.state, 'running'); assert.equal(ios.context.created.length,1); assert.ok(ios.context.created[0].started); assert.ok(ios.context.created[0].buffer.duration < .001);
const muted = new WebAudioManager(true, IOSContext); muted.unlock(); assert.equal(muted.context,null);
console.log('iOS 静音解锁手势与预览静音测试通过。');

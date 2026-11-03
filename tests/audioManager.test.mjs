import assert from 'node:assert/strict';
import { AudioManager } from '../js/audioManager.js';
class FakeAudio {
  constructor(src) { this.src = src; this.duration = 18.6; this.currentTime = 0; this.paused = true; this.volume = 1; this.playCount = 0; }
  play() { this.paused = false; this.playCount++; return Promise.resolve(); }
  pause() { this.paused = true; }
}
globalThis.Audio = FakeAudio;
const realNow = Date.now; let fakeNow = 100000; Date.now = () => fakeNow;
const manager = new AudioManager();
manager.load({ audio: { volume: 1, effects: [{ src: 'prayer.mp3', at: 2, end: 20.7, volume: 1 }] } });
const a = manager.tracks[0].audio;
manager.update(1, true, false); assert.equal(a.playCount, 0);
manager.update(3, true, false, .5); assert.equal(a.playCount, 1); assert.equal(a.volume, .5); assert.equal(a.currentTime, 1);
manager.update(5, false, false); assert.equal(a.paused, true);
fakeNow += 1001; manager.update(5, true, false); assert.equal(a.paused, false); assert.equal(a.currentTime, 3);
manager.update(6, true, true); assert.equal(a.paused, true);
manager.update(21, true, false); assert.equal(a.paused, true);
manager.stop(); assert.equal(manager.tracks.length, 0);
const preview = new AudioManager(true); preview.load({audio: {effects: [{src:'x.mp3'}]}}); assert.equal(preview.tracks.length, 0);
Date.now = realNow;
console.log('预录音讯的开始、静音、暂停、音量及结束测试通过。');

// 连续音乐在相邻画面保持播放；切换曲目则在短暂淡化后释放。
const originalNow = Date.now; let now = 1000000; Date.now = () => now;
const mix = new AudioManager();
const bg = (id, src, volume = .2) => ({ id, audio: { volume: 1, music: { src, continuity: src, loop: true, fadeIn: 1, volume } } });
mix.load(bg('a', 'music-a.mp3'));
const firstMusic = mix.tracks[0].audio;
mix.update(2, true, false); firstMusic.currentTime = 2;
mix.load(bg('b', 'music-a.mp3', .1));
assert.equal(mix.tracks[0].audio, firstMusic, '相邻画面不重启相同音乐');
now += 1200; mix.update(1, true, false, 1, { music: .5 });
assert.equal(firstMusic.currentTime, 2); assert.ok(Math.abs(firstMusic.volume - .05) < 1e-9);
mix.load(bg('c', 'music-b.mp3'));
assert.equal(mix.retiring.length, 1); now += 1200; mix.update(2, true, false); assert.equal(mix.retiring.length, 0); assert.equal(firstMusic.src, '');
mix.update(2, true, true); assert.equal(mix.tracks[0].audio.paused, true); mix.stop();

// 烟花按间隔重触发，不会连续循环短音效。
const repeated = new AudioManager();
repeated.load({id:'fireworks', audio:{effects:[{src:'firework.wav', at:2, repeatEvery:11}]}});
const boom = repeated.tracks[0].audio; boom.duration = 3.33;
repeated.update(2.2, true, false); assert.equal(boom.playCount, 1);
repeated.update(6, true, false); assert.equal(boom.paused, true);
now += 11000; repeated.update(13.2, true, false); assert.equal(boom.playCount, 2); assert.ok(Math.abs(boom.currentTime - .2) < 1e-8);
repeated.update(14, true, false, .5, { effects: 0 }); assert.equal(boom.volume, 0);
repeated.stop(); Date.now = originalNow;
console.log('连续音轨、淡化、分轨音量与循环触发测试通过。');

// 未就绪或正在定位时不能逐帧重复定位，避免网络缓冲被打断。
const waiting = new AudioManager(); waiting.load({id:'wait',audio:{effects:[{src:'slow.mp3',at:0}]}});
const slow = waiting.tracks[0].audio; slow.readyState = 0;
waiting.update(5,true,false); assert.equal(slow.paused,true); assert.equal(waiting.tracks[0].started,false);
slow.readyState=1; slow.seeking=true; waiting.update(5,true,false); assert.equal(waiting.tracks[0].started,false);
slow.seeking=false; waiting.update(5,true,false); assert.equal(slow.currentTime,5); assert.equal(waiting.tracks[0].started,true); waiting.stop();
console.log('媒体准备与定位保护测试通过。');

// 触摸必须同步触发 play()，即使元数据尚未载入或自动播放刚被拒绝。
const gesture = new AudioManager(); gesture.load({id:'mobile',audio:{music:{src:'music.mp3',volume:.2}}});
const mobile = gesture.tracks[0].audio; mobile.readyState=0;
gesture.update(1,true,false,1,{},true); assert.equal(mobile.playCount,1); assert.equal(mobile.paused,false);
mobile.pause(); gesture.update(1,true,true,1,{},true); assert.equal(mobile.playCount,1, '黑场不可播放');
gesture.update(1,false,false,1,{},true); assert.equal(mobile.playCount,1, '暂停不可播放');
gesture.update(1,true,false,1,{},true); assert.equal(mobile.playCount,2, '手势可立即重试');
gesture.stop();
console.log('移动浏览器手势解锁、黑场和暂停测试通过。');

const noRanges = new AudioManager(); noRanges.load({id:'no-range',audio:{music:{src:'music.mp3'}}});
const stream = noRanges.tracks[0].audio; stream.seekable = {length:1,start:()=>0,end:()=>0};
noRanges.update(8,true,false); assert.equal(stream.currentTime,0); assert.equal(stream.paused,false);
stream.currentTime=1; noRanges.update(10,true,false); assert.equal(stream.currentTime,1, '不可定位时不能反复重置播放');
noRanges.stop();
console.log('不支持随机定位的服务器播放测试通过。');

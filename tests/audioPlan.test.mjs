import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { scenes } from '../scenes/index.js';
for (const scene of scenes) {
  assert.ok(scene.audio?.music?.loop, `${scene.id} 缺少可持续音乐`);
  assert.ok(scene.audio.summary, `${scene.id} 缺少音频提示`);
  for (const track of [scene.audio.music, ...(scene.audio.ambience || []), ...(scene.audio.effects || [])]) {
    assert.ok(existsSync(track.src), `${scene.id}: 缺少 ${track.src}`);
    assert.ok((track.volume ?? 1) >= 0 && (track.volume ?? 1) <= 1);
    assert.ok((track.at ?? 0) < scene.duration);
  }
}
for (const [id, key] of [['work-pressure', 'notifications'], ['friends-whatsapp', 'messages']]) {
  const scene = scenes.find(s => s.id === id);
  assert.deepEqual(scene.audio.effects.filter(e => e.name === '手机讯息').map(e => e.at), scene[key].map(n => n.at));
}
for (const id of ['prayer','testimony-memory']) {
  const scene = scenes.find(s=>s.id===id); assert.equal(scene.audio.effects.filter(e=>e.kind==='voice').length, 1);
  assert.ok(scene.audio.music.volume < .1, `${id}: 音乐不应掩盖预录人声`);
}
const blackout = scenes.find(s=>s.id==='who-can-i-lean-on');
assert.equal(blackout.audio.music.end, blackout.fadeAt + blackout.fadeDuration);
assert.ok(blackout.audio.ambience.every(a=>a.end===blackout.audio.music.end));
console.log('37 个画面音频配置、素材、讯息同步及黑场淡出测试通过。');

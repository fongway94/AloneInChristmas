import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { scenes } from '../scenes/index.js';
for (const name of ['message', 'alarm', 'phone-ring', 'firework']) {
  const b = readFileSync(`assets/audio/sfx/${name}-v2.wav`);
  assert.equal(b.toString('ascii', 0, 4), 'RIFF'); assert.equal(b.toString('ascii', 8, 12), 'WAVE');
  const fmt = b.indexOf('fmt '), data = b.indexOf('data');
  assert.ok(fmt >= 0 && data >= 0, `${name}: 缺少 WAV 段`);
  assert.equal(b.readUInt16LE(fmt + 8), 1, `${name}: 应为 PCM`);
  assert.equal(b.readUInt16LE(fmt + 22), 16, `${name}: 应为 16 位`);
  const length = b.readUInt32LE(data + 4); let peak = 0, sum = 0;
  for (let i = data + 8; i < data + 8 + length; i += 2) { const v = b.readInt16LE(i) / 32768; peak = Math.max(peak, Math.abs(v)); sum += v * v; }
  assert.ok(peak < .96, `${name}: 峰值不得削波`); assert.ok(Math.sqrt(sum / (length / 2)) > .025, `${name}: 声音过弱`);
}
for (const id of ['work-pressure', 'friends-whatsapp']) {
  const scene = scenes.find(s => s.id === id);
  assert.ok(scene.audio.effects.filter(e => e.name === '手机讯息').every(e => e.volume >= .7));
}
assert.ok(scenes.find(s => s.id === 'window-fireworks').audio.effects.every(e => e.volume >= .5));
console.log('手机兼容的 16 位音效、无削波、可听电平与场景音效增益测试通过。');

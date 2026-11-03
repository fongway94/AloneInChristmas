import assert from 'node:assert/strict';
import { createAtmosphere } from '../js/atmosphere.js';
import { scenes } from '../scenes/index.js';
function fakeCanvas() {
  const ops = [];
  const ctx = {
    set strokeStyle(value) { ops.push(['strokeStyle', value]); },
    clearRect(...a) { ops.push(['clear', ...a]); }, save() {}, restore() {}, beginPath() {}, clip() {},
    rect(...a) { ops.push(['clip', ...a]); }, moveTo(...a) { ops.push(['start', ...a]); }, lineTo(...a) { ops.push(['end', ...a]); }, stroke() {},
    createRadialGradient(...a) { ops.push(['gradient', ...a]); return { addColorStop(...b) { ops.push(['color', ...b]); } }; },
    fillRect(...a) { ops.push(['fill', ...a]); }
  };
  return { ops, getContext(type) { assert.equal(type, '2d'); return ctx; } };
}
for (const preset of ['rain-left', 'rain-right', 'rain-middle', 'street', 'bench', 'fireworks', 'sea', 'embrace']) {
  const canvas = fakeCanvas(), animation = createAtmosphere(canvas, { preset });
  animation.draw(3); const first = JSON.stringify(canvas.ops);
  canvas.ops.length = 0; animation.draw(3); assert.equal(JSON.stringify(canvas.ops), first, `${preset}: 同一时间必须同步`);
  canvas.ops.length = 0; animation.draw(9); assert.notEqual(JSON.stringify(canvas.ops), first, `${preset}: 必须随时间变化`);
  assert.equal(canvas.width, 960); assert.equal(canvas.height, 540);
}
assert.ok(scenes.every(scene => ['rain-left', 'rain-right', 'rain-middle', 'street', 'bench', 'fireworks', 'sea', 'embrace'].includes(scene.motion.preset)));
console.log('八种环境动态、跨画面同步与全部场景设定测试通过。');

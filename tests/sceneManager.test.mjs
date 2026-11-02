import assert from 'node:assert/strict';
// Minimal browser transport to exercise the localStorage fallback without BroadcastChannel.
const listeners = {};
globalThis.window = { addEventListener(type, fn) { (listeners[type] ||= []).push(fn); } };
const store = new Map();
globalThis.localStorage = {
  getItem(key) { return store.get(key) ?? null; },
  setItem(key, value) { store.set(key, value); for (const fn of listeners.storage || []) fn({ key, newValue: value }); }
};
globalThis.BroadcastChannel = undefined;
let now = 1000000; Date.now = () => now;
const { SceneManager, elapsed, scenes } = await import('../js/sceneManager.js');
assert.equal(new Set(scenes.map(s => s.act)).size, 9);
assert.equal(scenes.length, 37);
assert.deepEqual(scenes.find(s => s.id === 'friends-whatsapp').messages.map(m => m.sender), ['朋友A', '朋友B', '朋友C', '朋友D']);
assert.ok(!scenes.some(s => s.id === 'encounter'));
assert.deepEqual(scenes.slice(-3).map(s => s.caption), ['這個聖誕節，也許你的世界仍有黑暗……', '但有一道光，從未離開。', '因為耶穌愛你。']);
assert.equal(scenes.find(s => s.id === 'prayer').audio.effects[0].src, 'assets/audio/prayer.mp3');
assert.equal(new Set(scenes.map(s => s.id)).size, scenes.length);
for (const scene of scenes) {
  assert.ok(scene.title && scene.description && scene.cue && scene.background && scene.duration > 0);
  assert.ok(!scene.caption || scene.captionAt < scene.duration);
  assert.ok(!scene.notifications || scene.notifications.every((n, i, all) => n.at < scene.duration && (i === 0 || n.at >= all[i - 1].at)));
  assert.ok(!scene.messages || scene.messages.every((n, i, all) => n.at < scene.duration && (i === 0 || n.at >= all[i - 1].at)));
}
assert.match(scenes.at(-1).caption, /耶穌愛你/);
const operator = new SceneManager(), stage = new SceneManager();
assert.equal(stage.state.index, -1);
operator.next(); assert.equal(stage.state.index, 0); assert.equal(stage.state.playing, true);
now += 5500; assert.equal(elapsed(stage.state), 5.5);
operator.togglePlay(); assert.equal(stage.state.playing, false); now += 10000; assert.equal(elapsed(stage.state), 5.5);
operator.togglePlay(); now += 1000; assert.equal(elapsed(stage.state), 6.5);
operator.toggleBlack(); assert.equal(stage.state.black, true); operator.toggleBlack(); assert.equal(stage.state.black, false);
operator.toggleMute(); assert.equal(stage.state.muted, true); operator.setVolume(.5); assert.equal(stage.state.volume, .5); operator.toggleMute();
operator.restart(); assert.equal(elapsed(stage.state), 0);
now += (scenes[0].duration + 10) * 1000; assert.equal(stage.state.index, 0); // completion never auto-advances
operator.togglePlay(); const held = elapsed(stage.state); assert.equal(stage.state.playing, false); now += 10000; assert.equal(elapsed(stage.state), held);
operator.togglePlay(); assert.equal(stage.state.playing, true);
operator.next(); assert.equal(stage.state.index, 1);
operator.go(scenes.length - 1); now += (scenes.at(-1).duration + 10) * 1000; assert.equal(stage.state.index, scenes.length - 1);
operator.next(); assert.equal(stage.state.index, scenes.length); assert.equal(stage.state.playing, false);
operator.previous(); assert.equal(stage.state.index, scenes.length - 1); assert.equal(elapsed(stage.state), 0);
console.log('场景状态、暂停、重播、黑屏、结束保持及存储事件同步测试通过。');

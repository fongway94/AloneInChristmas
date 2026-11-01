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
const operator = new SceneManager(), stage = new SceneManager();
assert.equal(stage.state.index, -1);
operator.next(); assert.equal(stage.state.index, 0); assert.equal(stage.state.playing, true);
now += 5500; assert.equal(elapsed(stage.state), 5.5);
operator.togglePlay(); assert.equal(stage.state.playing, false); now += 10000; assert.equal(elapsed(stage.state), 5.5);
operator.togglePlay(); now += 1000; assert.equal(elapsed(stage.state), 6.5);
operator.toggleBlack(); assert.equal(stage.state.black, true); operator.toggleBlack(); assert.equal(stage.state.black, false);
operator.restart(); assert.equal(elapsed(stage.state), 0);
now += (scenes[0].duration + 10) * 1000; assert.equal(stage.state.index, 0); // completion never auto-advances
operator.next(); assert.equal(stage.state.index, scenes.length); assert.equal(stage.state.playing, false);
operator.previous(); assert.equal(stage.state.index, 0); assert.equal(elapsed(stage.state), 0);
console.log('场景状态、暂停、重播、黑屏、结束保持及存储事件同步测试通过。');

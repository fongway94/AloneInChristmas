import assert from 'node:assert/strict';
import { notificationClock, socialPosition } from '../js/phoneTimeline.js';
import { scenes } from '../scenes/index.js';
const work = scenes.find(scene => scene.id === 'work-pressure');
const notes = work.notifications;
assert.equal(notificationClock(work.clock, notes, 0), '08:30');
for (const [i, note] of notes.entries()) {
  assert.equal(notificationClock(work.clock, notes, note.at), note.receivedAt);
  if (i) assert.ok(note.receivedAt > notes[i - 1].receivedAt);
}
const social = scenes.find(scene => scene.id === 'friends-photos');
assert.equal(socialPosition(social.posts, 3), 0);
assert.equal(socialPosition(social.posts, 7.1), 1);
assert.ok(socialPosition(social.posts, 6.55) > 0 && socialPosition(social.posts, 6.55) < 1);
assert.equal(socialPosition(social.posts, 14), 2);
assert.ok(social.posts.every((post, i, posts) => post.photo && post.caption && post.at < social.duration && (!i || post.at > posts[i - 1].at)));
console.log('社交照片上滑与工作消息的模拟时间测试通过。');

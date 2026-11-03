// 根据演出时间计算手机显示；暂停、重播及双视窗共享相同结果。
export function notificationClock(baseClock, notifications, time) {
  const received = notifications.filter(item => time >= item.at);
  return received.at(-1)?.receivedAt || baseClock;
}

// 将帖子间的平滑上滑位置映射为帖子高度的倍数。
export function socialPosition(posts, time) {
  return posts.slice(1).reduce((position, post) => {
    const t = Math.max(0, Math.min(1, (time - post.at) / 1.1));
    return position + t * t * (3 - 2 * t);
  }, 0);
}

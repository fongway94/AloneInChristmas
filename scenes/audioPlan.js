// 九幕音效表：所有 at/end 单位为秒，音量为 0–1；提示点仍由操作员手动推进。
const musicFiles = {
  piano: 'assets/audio/music/piano-worship-01.mp3',
  prayer: 'assets/audio/music/peaceful-prayer-01.mp3',
  hope: 'assets/audio/music/morning-prayer-01.mp3',
  christmas: 'assets/audio/music/christmas-angels-lofi.mp3'
};
const ambienceFiles = {
  rain: 'assets/audio/ambience/rain.m4a',
  street: 'assets/audio/ambience/city_street.m4a',
  crowd: 'assets/audio/ambience/crowd-soft.m4a',
  ocean: 'assets/audio/ambience/ocean_surf.m4a'
};
const musicNames = { piano: '轻柔钢琴', prayer: '温柔祷告音乐', hope: '盼望主题', christmas: '圣诞器乐' };
const ambienceNames = { rain: '雨声', street: '街道环境', crowd: '远处人群', ocean: '海浪' };
const effectNames = { message: '手机讯息', alarm: '闹钟', ring: '电话铃声', firework: '烟花' };
const effects = {
  message: 'assets/audio/sfx/message-v2.wav', alarm: 'assets/audio/sfx/alarm-v2.wav',
  ring: 'assets/audio/sfx/phone-ring-v2.wav', firework: 'assets/audio/sfx/firework-v2.wav'
};
// id: [音乐, 音乐音量, [[环境音, 音量], ...]]。对话和人声画面刻意降低音乐。
const plan = {
  'lonely-room': ['piano', .12, [['rain', .03]]],
  'unsent-draft': ['piano', .12, [['rain', .03]]],
  'friends-photos': ['piano', .10, [['rain', .03]]],
  'alarm-work': ['piano', .11, [['rain', .025]]],
  'bills': ['piano', .12, [['rain', .035]]],
  'family-call': ['piano', .06, [['rain', .02]]],
  'grief': ['piano', .08, [['rain', .03]]],
  'friends-whatsapp': ['piano', .09, [['rain', .025]]],
  'hide-away': ['piano', .07, [['rain', .03]]],
  'window-fireworks': ['christmas', .13, [['street', .09], ['crowd', .07]]],
  'get-ready-to-go': ['christmas', .11, [['street', .06], ['crowd', .04]]],
  'crowd-scene': ['christmas', .16, [['street', .12], ['crowd', .12]]],
  'bench-meeting': ['prayer', .10, [['street', .03]]],
  'prayer': ['prayer', .05, [['street', .015]]],
  'jesus-loves-you': ['prayer', .08, [['street', .02]]],
  'testimony-talk': ['prayer', .08, [['street', .02]]],
  'encouragement': ['hope', .09, [['street', .02]]],
  'friends-arrive': ['hope', .11, [['street', .025]]],
  'ending': ['hope', .16, [['ocean', .025]]]
};
function fx(name, at, volume, extra = {}) { return { src: effects[name], name: effectNames[name], at, volume, ...extra }; }
export function withAudio(scene) {
  const entry = plan[scene.id];
  if (!entry) throw new Error(`缺少音频配置：${scene.id}`);
  const [theme, volume, ambient] = entry;
  const music = { name: musicNames[theme], src: musicFiles[theme], continuity: `music-${theme}`, loop: true, fadeIn: 2, volume };
  const ambience = ambient.map(([name, gain]) => ({ name: ambienceNames[name], src: ambienceFiles[name], continuity: `ambience-${name}`, loop: true, fadeIn: 2, volume: gain }));
  const result = { volume: 1, music, ambience, effects: (scene.audio?.effects || []).map(item => ({ ...item, name: scene.id === 'prayer' ? '预录祷告' : '预录旁白', kind: 'voice' })) };
  if (scene.id === 'alarm-work') result.effects.push(fx('alarm', .5, .60));
  if (scene.id === 'work-pressure') result.effects.push(...scene.notifications.map(n => fx('message', n.at, .70)));
  if (scene.id === 'family-call') result.effects.push(fx('ring', 1.2, .60));
  if (scene.id === 'room-dark') result.effects.push(fx('message', 2, .70));
  if (scene.id === 'friends-whatsapp') result.effects.push(...scene.messages.map(m => fx('message', m.at, .70)));
  if (scene.id === 'wake-to-celebration') result.effects.push(fx('firework', 1, .45));
  if (scene.id === 'crowd-scene') result.effects.push(fx('message', 0.5, .50));
  if (scene.id === 'window-fireworks') result.effects.push(...[0, 1.8, 4.9].map(t => fx('firework', t, .50, { repeatEvery: 11 })));
  if (scene.id === 'play-time') result.effects.push(fx('message', 2, .70));
  const byName = new Map();
  for (const item of result.effects) {
    const name = item.name + (item.repeatEvery ? `（每 ${item.repeatEvery} 秒重复）` : '');
    if (!byName.has(name)) byName.set(name, []);
    byName.get(name).push(item.at);
  }
  const events = [...byName].map(([name, times]) => `${name} ${times.join('、')} 秒`).join('；');
  result.summary = `音乐：${music.name}；环境：${ambience.map(a => a.name).join('、') || '无'}${events ? '；音效／人声：' + events : ''}。`;
  return { ...scene, audio: result };
}

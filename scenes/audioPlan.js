// 九幕音效表：所有 at/end 单位为秒，音量为 0–1；提示点仍由操作员手动推进。
const musicFiles = {
  piano: 'assets/audio/music/piano-worship-01.mp3',
  prayer: 'assets/audio/music/peaceful-prayer-01.mp3',
  hope: 'assets/audio/music/morning-prayer-01.mp3',
  christmas: 'assets/audio/music/christmas-angels-lofi.mp3',
  sad1: 'Music/悲伤音乐一.mp3',
  busy1: 'Music/忙生活音乐一.mp3',
  sad2: 'Music/悲伤音乐二.mp3',
  lonely1: 'Music/孤单音乐一.mp3'
};
const ambienceFiles = {
  rain: 'assets/audio/ambience/rain.m4a',
  street: 'assets/audio/ambience/city_street.m4a',
  crowd: 'assets/audio/ambience/crowd-soft.m4a',
  ocean: 'assets/audio/ambience/ocean_surf.m4a'
};
const musicNames = { piano: '轻柔钢琴', prayer: '温柔祷告音乐', hope: '盼望主题', christmas: '圣诞器乐', sad1: '悲伤音乐一', busy1: '忙生活音乐一', sad2: '悲伤音乐二', lonely1: '孤单音乐一' };
const ambienceNames = { rain: '雨声', street: '街道环境', crowd: '远处人群', ocean: '海浪' };
const effectNames = { message: '手机讯息', alarm: '闹钟', ring: '电话铃声', firework: '烟花' };
const effects = {
  message: 'assets/audio/sfx/message-v2.wav', alarm: 'assets/audio/sfx/alarm-v2.wav',
  ring: 'assets/audio/sfx/phone-ring-v2.wav', firework: 'assets/audio/sfx/firework-v2.wav'
};
// id: [音乐, 音乐音量, [[环境音, 音量], ...], synthTune]
// synthTune: Web Audio 合成聖誕旋律（silentNight, jingleBells, joyToTheWorld, weWishYou, oChristmasTree）
// 若設定 synthTune，將以合成音樂代替 MP3 音樂檔案，音質更好且無需外部檔案。
const plan = {
  // 所有音樂音量皆為原始上傳音量（1.0），不再調整；lonely1 稍微大聲一點（1.3）
  'lonely-room': ['sad1', 1, [['rain', .02]], null],
  'unsent-draft': ['sad1', 1, [['rain', .02]], null],
  'friends-photos': ['sad1', 1, [['rain', .02]], null],
  'no-one-to-talk': ['sad1', 1, [], null],
  'alarm-work': ['busy1', 1, [['rain', .03]], null],
  'bills': ['busy1', 1, [['rain', .04]], null],
  'life-stops-for-no-one': ['busy1', 1, [], null],
  'family-call': ['sad2', 1, [['rain', .02]], null],
  'grief': ['sad2', 1, [['rain', .03]], null],
  'friends-whatsapp': ['lonely1', 1.3, [['rain', .015]], null],
  'hide-away': ['lonely1', 1.3, [['rain', .02]], null],
  'window-fireworks': ['lonely1', 1.3, [['street', .10], ['crowd', .08]], null],
  'get-ready-to-go': ['lonely1', 1.3, [['street', .07], ['crowd', .05]], null],
  'crowd-scene': ['christmas', 1, [['street', .10], ['crowd', .14]], 'weWishYou'],
  'bench-meeting': ['prayer', 1, [['street', .025]], 'silentNight'],
  'prayer': ['prayer', 1, [['street', .01]], 'silentNight'],
  'jesus-loves-you': ['prayer', 1, [['street', .015]], 'silentNight'],
  'testimony-talk': ['prayer', 1, [['street', .015]], 'silentNight'],
  'encouragement': ['hope', 1, [['street', .02]], 'joyToTheWorld'],
  'friends-arrive': ['hope', 1, [['street', .025]], 'joyToTheWorld'],
  'ending': ['hope', 1, [['ocean', .03]], 'joyToTheWorld']
};
function fx(name, at, volume, extra = {}) { return { src: effects[name], name: effectNames[name], at, volume, kind: 'effects', ...extra }; }
export function withAudio(scene) {
  const entry = plan[scene.id];
  if (!entry) throw new Error(`缺少音频配置：${scene.id}`);
  const [theme, volume, ambient, synthTune] = entry;
  const music = { name: musicNames[theme], src: musicFiles[theme], continuity: `music-${theme}`, loop: true, fadeIn: 2, volume };
  const ambience = ambient.map(([name, gain]) => ({ name: ambienceNames[name], src: ambienceFiles[name], continuity: `ambience-${name}`, loop: true, fadeIn: 2, volume: gain }));
  const result = { volume: 1, music, ambience, synthTune, effects: (scene.audio?.effects || []).map(item => ({ ...item, name: scene.id === 'prayer' ? '预录祷告' : '预录旁白', kind: 'voice' })) };
  if (scene.id === 'alarm-work') {
    // 鈴聲延遲到手機完全淡入後（7秒開始淡入 + 1.5秒過渡 = 8.5秒）才播放
    result.effects.push(fx('alarm', 8.5, .85));
    result.effects.push(...scene.notifications.map(n => fx('message', n.at, .85)));
  }
  if (scene.id === 'work-pressure') result.effects.push(...scene.notifications.map(n => fx('message', n.at, .85)));
  if (scene.id === 'family-call') result.effects.push(fx('ring', 5, .85));
  if (scene.id === 'room-dark') result.effects.push(fx('message', 2, .85));
  if (scene.id === 'friends-whatsapp') result.effects.push(...scene.messages.map(m => fx('message', m.at, .85)));
  if (scene.id === 'wake-to-celebration') result.effects.push(fx('firework', 1, .70));
  // 第六幕：人群声已经通过环境音（crowd）体现，不需要额外手机叮咚声
  if (scene.id === 'window-fireworks') result.effects.push(...[0, 1.8, 4.9].map(t => fx('firework', t, .70, { repeatEvery: 11 })));
  if (scene.id === 'play-time') result.effects.push(fx('message', 2, .85));
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

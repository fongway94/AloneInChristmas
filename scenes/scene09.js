const bench = 'assets/images/penang-bench-local.png';
const base = { act: '第九幕：因为耶稣爱你', transitionIn: 1.5, audio: { music: null, effects: [], volume: .7 } };
export default [
  { ...base, id: 'encouragement', type: 'room', title: '故事还没有结束', subtitle: '男孩的鼓励', duration: 14, background: bench, warmth: .42,
    description: '男孩温柔鼓励女孩不要放弃，因为耶稣爱她；女孩慢慢擦干眼泪。', cue: '等男孩完整说完、女孩擦干眼泪并表情柔和后再推进。' },
  { ...base, id: 'play-time', type: 'room', title: '圣诞话剧快开始了', subtitle: '男孩看看时间', duration: 10, background: bench, warmth: .46,
    description: '男孩站起身，看看时间，发现圣诞话剧快开始了。', cue: '手机讯息声自动响起。等男孩的台词后再让朋友入场。' },
  { ...base, id: 'friends-arrive', type: 'room', title: '朋友们来了', subtitle: '热情打招呼', duration: 12, background: bench, warmth: .5,
    description: '朋友们到场，催促看话剧，并热情地向女孩打招呼。', cue: '配角依剧本入场、招呼；再推进到邀请。' },
  { ...base, id: 'acceptance', type: 'room', title: '一起去看话剧', subtitle: '女孩轻轻点头', duration: 15, background: bench, warmth: .55,
    description: '男孩邀请女孩，大家微笑等待；她犹豫后轻轻点头，露出久违的笑容。', cue: '留出犹豫、等待和点头的时间；笑容不代表困难已经消失。' },
  { ...base, id: 'walk-together', type: 'room', title: '一起同行', subtitle: '众人走向出口', duration: 15, background: bench, warmth: .62,
    description: '男孩走在女孩身旁，朋友围绕着她，众人一起走向舞台出口。', cue: '等所有演员离场，再进入结尾字幕。音乐由温柔转为有盼望。' },
  { ...base, id: 'ending-darkness', type: 'closing', title: '结尾字幕 ①', subtitle: '世界仍有黑暗', duration: 8, background: 'assets/images/ending-dark-sea.png', motion: { preset: 'sea', intensity: .8 }, warmth: .05, caption: '这个圣诞节，也许你的世界仍有黑暗……', captionAt: 1,
    description: '暗夜海面与第一句结尾字幕。', cue: '留出阅读时间，再手动推进下一句。' },
  { ...base, id: 'ending-light', type: 'closing', title: '结尾字幕 ②', subtitle: '有一道光', duration: 8, background: 'assets/images/ending-dark-sea.png', overlayBackground: 'assets/images/ending-light-sea.png', lightAt: .5, lightDuration: 5, motion: { preset: 'sea', intensity: 1 }, warmth: .08, caption: '但有一道光，从未离开。', captionAt: 1,
    description: '光线逐渐穿过云层，照亮海面。', cue: '停留片刻，再进入最后一句。' },
  { ...base, id: 'ending-love', type: 'closing', title: '结尾字幕 ③', subtitle: '因为耶稣爱你', duration: 10, background: 'assets/images/ending-embrace.png', motion: { preset: 'embrace', intensity: .8 }, warmth: .12, caption: '因为耶稣爱你。', captionAt: 1,
    description: '柔和光芒中的人物张开双臂，以第一人称视角拥抱观众；最后一句字幕保持。', cue: '待音乐与演出结束后，按下一个画面进入黑场。' }
];

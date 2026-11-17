const bench = 'assets/images/penang-bench-local.png';
const base = { act: '第九幕：因为耶稣爱你', transitionIn: 1.5, audio: { music: null, effects: [], volume: .7 } };
export default [
  { ...base, id: 'encouragement', type: 'room', title: '故事还没有结束', subtitle: '男孩的鼓励', duration: 14, background: bench, warmth: .42,
    description: '男孩温柔鼓励女孩不要放弃，因为耶稣爱她；女孩慢慢擦干眼泪，表情开始柔和。',
    cue: '等男孩完整说完、女孩擦干眼泪并表情柔和后再推进。',
    dialogues: [
      { at: 3, speaker: '👦 方炜', text: '我不知道你的困难什么时候会过去。', note: '' },
      { at: 7, speaker: '👦 方炜', text: '但我相信，你的故事还没有结束。', note: '' },
      { at: 11, speaker: '👦 方炜', text: '不要放弃，好吗？因为耶稣爱你。', note: '' }
    ] },
  { ...base, id: 'friends-arrive', type: 'room', title: '朋友们来了', subtitle: '热情邀请', duration: 14, background: bench, warmth: .5, caption: '这个圣诞节，也许你的世界仍有黑暗……', captionAt: 10,
    description: '男孩站起身，看看时间，发现圣诞话剧快开始了。朋友们到场，热情地向女孩打招呼并邀请她一起去看。女孩犹豫后轻轻点头，露出久违的笑容。',
    cue: '手机讯息声自动响起。朋友入场、招呼、邀请；等女孩点头笑容出现后再推进。',
    dialogues: [
      { at: 3, speaker: '👦 方炜', text: '哎呀！圣诞话剧快开始了！', note: '看时间' },
      { at: 5, speaker: 'Jessica', text: 'Hey！我们到了！', note: '朋友们上台' },
      { at: 7, speaker: '欣美', text: '快点！圣诞话剧要开始啦！', note: '' },
      { at: 9, speaker: '👥 朋友们', text: '来啦来啦，一起去！你也一起来吧！', note: '热情邀请 ⭐' },
      { at: 11, speaker: '👦 方炜', text: '对了！你要不要跟我们一起去看？', note: '' },
      { at: 13, speaker: '👥 众人', text: 'Merry Christmas！耶稣爱你！', note: '回头向观众，谢幕 ⭐' }
    ] },
  { ...base, id: 'ending', type: 'closing', title: '结尾字幕', subtitle: '因为耶稣爱你', duration: 12, background: 'assets/images/ending-embrace.png', motion: { preset: 'embrace', intensity: .8 }, warmth: .12, caption: '这个圣诞节，也许你的世界仍有黑暗……\n\n但有一道光，从未离开。\n\n✨ 因为耶稣爱你。', captionAt: 1,
    description: '柔和光芒中的人物张开双臂，最后一句字幕保持。',
    cue: '音乐推至最高点，众人向观众微笑。停留至少 8 秒后熄灯。' }
];

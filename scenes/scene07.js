const bench = 'assets/images/penang-bench-local.png';
const base = { act: '第七幕：长椅上的祷告', transitionIn: 1.5, audio: { music: null, effects: [], volume: .7 } };
export default [
  { ...base, id: 'bench-meeting', type: 'room', title: '长椅上的相遇', subtitle: '你还好吗？', duration: 14, background: bench, warmth: .12,
    description: '女孩看见长椅，走过去坐下，望着远方，没有留意旁边的男孩。男孩轻声问：「你还好吗？」女孩摇头、流泪；男孩没有追问，只是陪伴她。',
    cue: '使用实体长椅，男孩先坐在一旁。等女孩坐下、男孩说话、女孩摇头流泪后再推进。',
    dialogues: [
      { at: 4, speaker: '👦 方炜', text: '你还好吗？', note: '轻声' },
      { at: 8, speaker: '👧 悠兒', text: '（没有回答，只是轻轻摇头，眼泪慢慢流下）', note: '' }
    ] },
  { ...base, id: 'prayer', type: 'room', title: '为她祷告', subtitle: '预录祷告', duration: 30, background: 'assets/images/penang-bench-prayer-local.png', warmth: .24, caption: '即使在最孤独的时候，她也不是一个人。', captionAt: 8, audio: { music: null, volume: 1, effects: [{ src: 'assets/audio/prayer.mp3', at: 2, end: 20.7, volume: 1 }] },
    description: '男孩询问是否可以为她祷告；女孩惊讶、犹豫，最后轻轻点头。男孩低头、双手合十，为女孩祷告。',
    cue: '等女孩点头，才推进到祷告。预录祷告进入画面后约两秒播放；等祷告完成后再推进。',
    dialogues: [
      { at: 4, speaker: '👦 方炜', text: '虽然我不知道你经历了什么，但如果你愿意，我可以为你祷告吗？', note: '征求同意' },
      { at: 10, speaker: '👧 悠兒', text: '（惊讶地看着他，犹豫片刻后，轻轻点头）', note: '' }
    ] }
];

const bench = 'assets/images/penang-bench-hope-local.png';
const base = { act: '第八幕：笑容背后的故事', transitionIn: 1.5, audio: { music: null, effects: [], volume: .7 } };
export default [
  { ...base, id: 'jesus-loves-you', type: 'room', title: '因为耶稣爱你', subtitle: '女孩的疑惑', duration: 12, background: bench, warmth: .28,
    description: '女孩问为甚么替陌生人祷告；男孩微笑回答「因为耶稣爱你」。女孩疑惑：「耶稣……爱我？」', cue: '让演员完成对话与停顿，再进入男孩的见证。' },
  { ...base, id: 'testimony-begins', type: 'room', title: '曾经难熬的日子', subtitle: '男孩开始分享', duration: 12, background: bench, warmth: .3,
    description: '男孩说自己也曾经历很难熬的日子，开始分享生命见证。', cue: '等男孩说完开场，再转入过去的画面。' },
  { ...base, id: 'testimony-memory', type: 'room', title: '男孩过去的困境', subtitle: '生命见证与旁白', duration: 25, background: 'assets/images/penang-memory.png', audio: { music: null, volume: 1, effects: [{ src: 'assets/audio/testimony.mp3', at: 2, end: 17.1, volume: 1 }] }, motion: { preset: 'rain-middle', intensity: .7 },
    description: '从男孩的视角看向昏暗房间与雨窗，以环境呈现他曾经的痛苦与失落；画面不投影人物。', cue: '旁白预录：男孩曾经历痛苦、失落，也曾觉得自己无法再坚持下去。但在最无助的时候，他认识了耶稣，并透过信仰与身边人的陪伴，重新找到面对生活的力量。进入画面后约两秒播放预录旁白，旁白结束后再推进。' },
  { ...base, id: 'testimony-talk', type: 'room', title: '不必独自面对', subtitle: '男孩的分享', duration: 14, background: bench, warmth: .35,
    description: '男孩分享：每个人都有不容易的时候；相信耶稣不代表没有困难，但不需要独自面对。女孩安静聆听。', cue: '留足男孩完整分享与女孩聆听的时间，勿按动画长度催促。' },
  { ...base, id: 'unseen-story', type: 'room', title: '笑容背后', subtitle: '不为人知的故事', duration: 12, background: bench, warmth: .38, caption: '你看见的笑容背后，也许藏着一段不为人知的故事。', captionAt: 2,
    description: '女孩渐渐明白，男孩的笑容背后也有伤痛。', cue: '等观众读完字幕、演员完成停顿后再进入第九幕。' }
];

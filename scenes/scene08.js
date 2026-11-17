const bench = 'assets/images/penang-bench-hope-local.png';
const base = { act: '第八幕：笑容背后的故事', transitionIn: 1.5, audio: { music: null, effects: [], volume: .7 } };
export default [
  { ...base, id: 'jesus-loves-you', type: 'room', title: '因为耶稣爱你', subtitle: '女孩的疑惑', duration: 14, background: bench, warmth: .3,
    description: '女孩问为什么替陌生人祷告；男孩微笑回答「因为耶稣爱你」。女孩疑惑：「耶稣……爱我？」',
    cue: '让演员完成对话与停顿，再进入男孩的见证。',
    dialogues: [
      { at: 3, speaker: '👧 悠兒', text: '你为什么要为我祷告？我们又不认识。', note: '' },
      { at: 6, speaker: '👦 方炜', text: '因为耶稣爱你。', note: '微笑' },
      { at: 9, speaker: '👧 悠兒', text: '耶稣……爱我？', note: '疑惑' },
      { at: 11, speaker: '👦 方炜', text: '（点头）其实，我也曾经历过很难熬的日子。', note: '' }
    ] },
  { ...base, id: 'testimony-talk', type: 'room', title: '不必独自面对', subtitle: '男孩的分享', duration: 20, background: bench, warmth: .38, caption: '你看见的笑容背后，也许藏着一段不为人知的故事。', captionAt: 6,
    description: '男孩分享自己的生命见证：每个人都有不容易的时候；相信耶稣不代表没有困难，但不需要独自面对。女孩安静聆听。',
    cue: 'PPT 配合呈现男孩过去困境画面。留足男孩完整分享与女孩聆听的时间。',
    dialogues: [
      { at: 3, speaker: '👦 方炜', text: '我以前也以为，只有自己这么痛苦。', note: '' },
      { at: 7, speaker: '👦 方炜', text: '后来才发现，原来每个人都有不容易的时候。', note: '' },
      { at: 11, speaker: '👦 方炜', text: '相信耶稣，不代表人生从此没有困难。', note: '' },
      { at: 15, speaker: '👦 方炜', text: '但我知道，无论发生什么事，我都不需要独自面对。', note: '' }
    ] }
];

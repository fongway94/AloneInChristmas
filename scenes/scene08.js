const bench = 'assets/images/penang-bench-hope-local.png';
const base = { act: '第八幕：笑容背后的故事', transitionIn: 1.5, audio: { music: null, effects: [], volume: .7 } };
export default [
  { ...base, id: 'testimony-talk', type: 'room', title: '不必独自面对', subtitle: '男孩的分享', duration: 30, background: bench, overlayBackground: 'assets/images/penang-memory.png', lightAt: 2, lightDuration: 4, warmth: .38, caption: '你看见的笑容背后，也许藏着一段不为人知的故事。', captionAt: 18,
    description: '男孩分享自己的生命见证：每个人都有不容易的时候；相信耶稣不代表没有困难，但不需要独自面对。女孩安静聆听。背景显示他过去经历困境的画面。',
    cue: 'PPT 配合呈现男孩过去困境画面。预录旁白播放约 15 秒；结尾字幕在18秒出现，2秒后播放本幕结尾录音，结束后再推进。',
    audio: { music: null, volume: 1, effects: [
      { src: 'assets/audio/testimony.mp3', at: 2, end: 17.1, volume: 1 },
      { src: 'Music/8th scene Recording.mp4', at: 20, volume: 15, kind: 'voice' }
    ] },
    dialogues: [
      { at: 3, speaker: '👦 方炜', text: '我以前也以为，只有自己这么痛苦。', note: '' },
      { at: 7, speaker: '👦 方炜', text: '后来才发现，原来每个人都有不容易的时候。', note: '' },
      { at: 11, speaker: '👦 方炜', text: '相信耶稣，不代表人生从此没有困难。', note: '' },
      { at: 15, speaker: '👦 方炜', text: '但我知道，无论发生什么事，我都不需要独自面对。', note: '' }
    ] }
];

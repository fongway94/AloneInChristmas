const bench = 'assets/images/penang-bench.png';
const base = { act: '第八幕：笑容背後的故事', transitionIn: 1.5, audio: { music: null, effects: [], volume: .7 } };
export default [
  { ...base, id: 'jesus-loves-you', type: 'room', title: '因為耶穌愛你', subtitle: '女孩的疑惑', duration: 12, background: bench, warmth: .28,
    description: '女孩問為甚麼替陌生人禱告；男孩微笑回答「因為耶穌愛你」。女孩疑惑：「耶穌……愛我？」', cue: '讓演員完成對話與停頓，再進入男孩的見證。' },
  { ...base, id: 'testimony-begins', type: 'room', title: '曾經難熬的日子', subtitle: '男孩開始分享', duration: 12, background: bench, warmth: .3,
    description: '男孩說自己也曾經歷很難熬的日子，開始分享生命見證。', cue: '等男孩說完開場，再轉入過去的畫面。' },
  { ...base, id: 'testimony-memory', type: 'room', title: '男孩過去的困境', subtitle: '生命見證與旁白', duration: 25, background: 'assets/images/penang-memory.png', audio: { music: null, volume: 1, effects: [{ src: 'assets/audio/testimony.mp3', at: 2, end: 17.1, volume: 1 }] }, motion: { preset: 'rain-middle', intensity: .7 },
    description: '從男孩的視角看向昏暗房間與雨窗，以環境呈現他曾經的痛苦與失落；畫面不投影人物。', cue: '旁白預錄：男孩曾經歷痛苦、失落，也曾覺得自己無法再堅持下去。但在最無助的時候，他認識了耶穌，並透過信仰與身邊人的陪伴，重新找到面對生活的力量。進入畫面後約兩秒播放預錄旁白，旁白結束後再推進。' },
  { ...base, id: 'testimony-talk', type: 'room', title: '不必獨自面對', subtitle: '男孩的分享', duration: 14, background: bench, warmth: .35,
    description: '男孩分享：每個人都有不容易的時候；相信耶穌不代表沒有困難，但不需要獨自面對。女孩安靜聆聽。', cue: '留足男孩完整分享與女孩聆聽的時間，勿按動畫長度催促。' },
  { ...base, id: 'unseen-story', type: 'room', title: '笑容背後', subtitle: '不為人知的故事', duration: 12, background: bench, warmth: .38, caption: '你看見的笑容背後，也許藏著一段不為人知的故事。', captionAt: 2,
    description: '女孩漸漸明白，男孩的笑容背後也有傷痛。', cue: '等觀眾讀完字幕、演員完成停頓後再進入第九幕。' }
];

const bench = 'assets/images/penang-bench.png';
const base = { act: '第九幕：因為耶穌愛你', transitionIn: 1.5, audio: { music: null, effects: [], volume: .7 } };
export default [
  { ...base, id: 'encouragement', type: 'room', title: '故事還沒有結束', subtitle: '男孩的鼓勵', duration: 14, background: bench, warmth: .42,
    description: '男孩溫柔鼓勵女孩不要放棄，因為耶穌愛她；女孩慢慢擦乾眼淚。', cue: '等男孩完整說完、女孩擦乾眼淚並表情柔和後再推進。' },
  { ...base, id: 'play-time', type: 'room', title: '聖誕話劇快開始了', subtitle: '男孩看看時間', duration: 10, background: bench, warmth: .46,
    description: '男孩站起身，看看時間，發現聖誕話劇快開始了。', cue: '待補：手機訊息聲。等男孩的台詞後再讓朋友入場。' },
  { ...base, id: 'friends-arrive', type: 'room', title: '朋友們來了', subtitle: '熱情打招呼', duration: 12, background: bench, warmth: .5,
    description: '朋友們到場，催促看話劇，並熱情地向女孩打招呼。', cue: '配角依劇本入場、招呼；再推進到邀請。' },
  { ...base, id: 'acceptance', type: 'room', title: '一起去看話劇', subtitle: '女孩輕輕點頭', duration: 15, background: bench, warmth: .55,
    description: '男孩邀請女孩，大家微笑等待；她猶豫後輕輕點頭，露出久違的笑容。', cue: '留出猶豫、等待和點頭的時間；笑容不代表困難已經消失。' },
  { ...base, id: 'walk-together', type: 'room', title: '一起同行', subtitle: '眾人走向出口', duration: 15, background: bench, warmth: .62,
    description: '男孩走在女孩身旁，朋友圍繞著她，眾人一起走向舞台出口。', cue: '等所有演員離場，再進入結尾字幕。音樂待補：由溫柔轉為有盼望。' },
  { ...base, id: 'ending-darkness', type: 'closing', title: '結尾字幕 ①', subtitle: '世界仍有黑暗', duration: 8, background: 'assets/images/ending-dark-sea.png', motion: { preset: 'sea', intensity: .8 }, warmth: .05, caption: '這個聖誕節，也許你的世界仍有黑暗……', captionAt: 1,
    description: '暗夜海面與第一句結尾字幕。', cue: '留出閱讀時間，再手動推進下一句。' },
  { ...base, id: 'ending-light', type: 'closing', title: '結尾字幕 ②', subtitle: '有一道光', duration: 8, background: 'assets/images/ending-dark-sea.png', overlayBackground: 'assets/images/ending-light-sea.png', lightAt: .5, lightDuration: 5, motion: { preset: 'sea', intensity: 1 }, warmth: .08, caption: '但有一道光，從未離開。', captionAt: 1,
    description: '光線逐漸穿過雲層，照亮海面。', cue: '停留片刻，再進入最後一句。' },
  { ...base, id: 'ending-love', type: 'closing', title: '結尾字幕 ③', subtitle: '因為耶穌愛你', duration: 10, background: 'assets/images/ending-embrace.png', motion: { preset: 'embrace', intensity: .8 }, warmth: .12, caption: '因為耶穌愛你。', captionAt: 1,
    description: '柔和光芒中的人物張開雙臂，以第一人稱視角擁抱觀眾；最後一句字幕保持。', cue: '待音樂與演出結束後，按下一個畫面進入黑場。' }
];

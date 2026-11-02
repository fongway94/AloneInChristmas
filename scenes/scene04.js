const bench = 'assets/images/bench-evening.png';
const common = { act: '第四幕', transitionIn: 1.5, audio: { music: null, effects: [], volume: 0.7 } };
export default [
  { ...common, id: 'play-invitation', type: 'room', title: '一起去看話劇', subtitle: '男孩的邀請', duration: 12, background: bench, warmth: 0.42,
    description: '男孩發現聖誕話劇快開始了，邀請女孩一起去看。', cue: '等男孩提出邀請後再推進。音效建議：輕微手機訊息聲。' },
  { ...common, id: 'friends-arrive', type: 'room', title: '朋友們來了', subtitle: '真誠的邀請', duration: 12, background: bench, warmth: 0.48,
    description: '男孩的朋友們來到現場，真誠地邀請女孩同行。', cue: '待朋友們進場並完成邀請。音效建議：朋友呼喊聲，由演員現場表現。' },
  { ...common, id: 'acceptance', type: 'room', title: '久違的微笑', subtitle: '重新接受關懷', duration: 15, background: bench, warmth: 0.55,
    description: '女孩有些猶豫，看到大家真誠的笑容後輕輕點頭，露出久違的微笑。', cue: '保留猶豫與點頭的時間。笑容不代表困難已經消失。' },
  { ...common, id: 'walk-together', type: 'room', title: '一起走向前', subtitle: '眾人離開', duration: 15, background: bench, warmth: 0.62,
    description: '眾人一起走向舞台出口。女孩的困難還在，但她願意接受陪伴。', cue: '等所有演員離開後進入結尾字幕。音樂建議：漸入溫暖、充滿盼望的聖誕旋律。' },
  { ...common, id: 'ending-darkness', type: 'closing', title: '結尾字幕 ①', subtitle: '世界仍有黑暗', duration: 8, background: bench, warmth: 0.3,
    caption: '這個聖誕節，也許你的世界仍然有黑暗……', captionAt: 1,
    description: '第一句結尾字幕。', cue: '留出閱讀時間，再手動推進下一句。' },
  { ...common, id: 'ending-difficulty', type: 'closing', title: '結尾字幕 ②', subtitle: '困難尚未解決', duration: 8, background: bench, warmth: 0.34,
    caption: '也許你的困難還沒有解決……', captionAt: 1,
    description: '第二句結尾字幕。', cue: '留出閱讀時間，再手動推進下一句。' },
  { ...common, id: 'ending-light', type: 'closing', title: '結尾字幕 ③', subtitle: '有一道光', duration: 8, background: bench, warmth: 0.4,
    caption: '但有一道光，從未離開。', captionAt: 1,
    description: '第三句結尾字幕。', cue: '停留片刻，然後進入最後一句。' },
  { ...common, id: 'ending-love', type: 'closing', title: '結尾字幕 ④', subtitle: '因為耶穌愛你', duration: 10, background: bench, warmth: 0.5,
    caption: '因為耶穌愛你。', captionAt: 1,
    description: '最後一句字幕。保留足夠時間，讓觀眾安靜領受。', cue: '最後字幕會保持；待音樂和演出結束後，按下一個畫面進入黑場。' }
];

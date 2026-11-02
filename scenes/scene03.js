// 同一張街景作為長椅背景；演出時請使用實際長椅道具。
const street = 'assets/images/christmas-street.png';
const bench = 'assets/images/bench-evening.png';
const common = { act: '第三幕', transitionIn: 1.5, audio: { music: null, effects: [], volume: 0.7 } };
export default [
  { ...common, id: 'encounter', type: 'room', title: '意外的相遇', subtitle: '街頭相撞', duration: 10, background: street,
    description: '女孩不小心撞上迎面走來的男孩。男孩扶起她，關心她是否受傷。', cue: '讓兩人完成相撞與關心，再切至長椅。音效建議：輕微碰撞聲。' },
  { ...common, id: 'sit-together', type: 'room', title: '長椅上的陪伴', subtitle: '安靜地坐下', duration: 12, background: bench, warmth: 0.1,
    description: '兩人坐在長椅上。男孩輕聲問：「妳還好嗎？」女孩沒有回答，眼淚慢慢流下來。', cue: '留出沉默與眼淚的時間。長椅由舞台道具提供，不要急著切換。' },
  { ...common, id: 'permission-to-pray', type: 'room', title: '可以為妳禱告嗎？', subtitle: '先徵求她的同意', duration: 12, background: bench, warmth: 0.16,
    description: '男孩安靜陪伴，詢問：「雖然我不知道妳經歷了什麼，但如果妳願意，我可以為妳禱告嗎？」女孩點頭。', cue: '等女孩點頭後再推進。背景保持安靜，讓觀眾聽清對白。' },
  { ...common, id: 'prayer', type: 'room', title: '為她禱告', subtitle: '陪伴與安慰', duration: 16, background: bench, warmth: 0.24,
    description: '男孩為女孩禱告，求主安慰她受傷的心，讓她知道自己不是一個人。', cue: '讓演員完整禱告；不要按動畫時間強制推進。音樂建議：輕柔鋼琴，音量低於對白。' },
  { ...common, id: 'jesus-loves-you', type: 'room', title: '因為耶穌愛妳', subtitle: '真誠的回答', duration: 12, background: bench, warmth: 0.3,
    description: '女孩問男孩為什麼願意為陌生人禱告；男孩回答：「因為耶穌愛妳。」', cue: '這句話由演員自然說出；說完並停頓後再推進。' },
  { ...common, id: 'testimony', type: 'room', title: '在風雨中不再孤單', subtitle: '生命見證', duration: 15, background: bench, warmth: 0.34,
    description: '男孩分享自己的經歷：相信耶穌不代表沒有困難，而是不必獨自面對。', cue: '待男孩完成見證後再推進；不要讓背景蓋過對白。' },
  { ...common, id: 'story-not-over', type: 'room', title: '妳的故事還沒有結束', subtitle: '溫柔的鼓勵', duration: 14, background: bench, warmth: 0.38,
    caption: '相信耶穌，不代表沒有風雨，而是在風雨中，我們不再孤單。', captionAt: 2,
    description: '男孩鼓勵女孩：「我不知道妳的困難什麼時候會過去，但我相信，妳的故事還沒有結束。不要放棄，好嗎？」', cue: '讓演員說完並停頓，再進入第四幕。' }
];

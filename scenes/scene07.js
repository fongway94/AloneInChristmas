const bench = 'assets/images/penang-bench.png';
const base = { act: '第七幕：長椅上的禱告', transitionIn: 1.5, audio: { music: null, effects: [], volume: .7 } };
export default [
  { ...base, id: 'bench-meeting', type: 'room', title: '長椅上的相遇', subtitle: '男孩已坐在一旁', duration: 12, background: bench, warmth: .1,
    description: '女孩看見長椅，走過去坐下，望著遠方，沒有留意旁邊的男孩。', cue: '使用實體長椅，男孩先坐在一旁。等女孩坐下、望向遠方再推進。' },
  { ...base, id: 'are-you-okay', type: 'room', title: '你還好嗎？', subtitle: '安靜的陪伴', duration: 12, background: bench, warmth: .14,
    description: '男孩輕聲問「你還好嗎？」女孩搖頭、流淚；男孩沒有追問，只是陪伴她。', cue: '保留女孩搖頭、流淚與兩人沉默的時間；不要催促演員。' },
  { ...base, id: 'permission-to-pray', type: 'room', title: '可以為你禱告嗎？', subtitle: '徵求同意', duration: 12, background: bench, warmth: .18,
    description: '男孩詢問是否可以為她禱告；女孩驚訝、猶豫，最後輕輕點頭。', cue: '等女孩點頭，才推進到禱告。音樂待補：溫柔鋼琴。' },
  { ...base, id: 'prayer', type: 'room', title: '為她禱告', subtitle: '預錄禱告', duration: 35, background: bench, warmth: .24, audio: { music: null, volume: 1, effects: [{ src: 'assets/audio/prayer.mp3', at: 2, end: 20.7, volume: 1 }] },
    description: '男孩低頭、雙手合十，為女孩禱告。', cue: '預錄禱告：親愛的主耶穌，雖然我不知道她經歷了甚麼，但祢都知道。求祢安慰她受傷的心，擦乾她的眼淚。讓她知道，即使在最孤獨的時候，她也不是一個人。因為祢一直愛著她。奉主耶穌基督的名禱告，阿們。進入畫面後約兩秒播放預錄禱告；等禱告完成後再推進。如以演員現場禱告，請先靜音。' }
];

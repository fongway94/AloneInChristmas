const bench = 'assets/images/penang-bench-local.png';
const base = { act: '第七幕：长椅上的祷告', transitionIn: 1.5, audio: { music: null, effects: [], volume: .7 } };
export default [
  { ...base, id: 'bench-meeting', type: 'room', title: '长椅上的相遇', subtitle: '男孩已坐在一旁', duration: 12, background: bench, warmth: .1,
    description: '女孩看见长椅，走过去坐下，望着远方，没有留意旁边的男孩。', cue: '使用实体长椅，男孩先坐在一旁。等女孩坐下、望向远方再推进。' },
  { ...base, id: 'are-you-okay', type: 'room', title: '你还好吗？', subtitle: '安静的陪伴', duration: 12, background: bench, warmth: .14,
    description: '男孩轻声问「你还好吗？」女孩摇头、流泪；男孩没有追问，只是陪伴她。', cue: '保留女孩摇头、流泪与两人沉默的时间；不要催促演员。' },
  { ...base, id: 'permission-to-pray', type: 'room', title: '可以为你祷告吗？', subtitle: '征求同意', duration: 12, background: 'assets/images/penang-bench-prayer-local.png', warmth: .18,
    description: '男孩询问是否可以为她祷告；女孩惊讶、犹豫，最后轻轻点头。', cue: '等女孩点头，才推进到祷告。音乐待补：温柔钢琴。' },
  { ...base, id: 'prayer', type: 'room', title: '为她祷告', subtitle: '预录祷告', duration: 35, background: 'assets/images/penang-bench-prayer-local.png', warmth: .24, audio: { music: null, volume: 1, effects: [{ src: 'assets/audio/prayer.mp3', at: 2, end: 20.7, volume: 1 }] },
    description: '男孩低头、双手合十，为女孩祷告。', cue: '预录祷告：亲爱的主耶稣，虽然我不知道她经历了甚么，但祢都知道。求祢安慰她受伤的心，擦干她的眼泪。让她知道，即使在最孤独的时候，她也不是一个人。因为祢一直爱着她。奉主耶稣基督的名祷告，阿们。进入画面后约两秒播放预录祷告；等祷告完成后再推进。如以演员现场祷告，请先静音。' }
];

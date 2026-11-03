const room = 'assets/images/penang-bedroom.png';
const base = { act: '第三幕：无法掌控', transitionIn: 1.4, audio: { music: null, effects: [], volume: .7 } };
export default [
  { ...base, id: 'gather-bills', type: 'room', title: '努力整理', subtitle: '深呼吸，继续面对', duration: 10, background: 'assets/images/penang-bills.png',
    description: '女孩整理好帐单，深呼吸，准备继续面对。', cue: '等女孩整理帐单并深呼吸后，再推进至来电。' },
  { ...base, id: 'family-call', type: 'call', title: '突如其来的电话', subtitle: '亲人离世的消息', duration: 12, background: room, clock: '20:16', date: '12月24日', caller: '家人',
    description: '电话响起；女孩接听后愣住，说不出话，电话缓缓垂下。', cue: '待补：电话铃声及家人预录对白，交代亲人离世；台词与声音请先由导演确认。女孩扶住椅子后再推进。' },
  { ...base, id: 'grief', type: 'room', title: '无法挽留', subtitle: '坐下，掩面哭泣', duration: 16, background: room, caption: '有些事，再努力，也无法挽留。', captionAt: 4, dim: .24,
    description: '女孩扶着椅子坐下，掩面哭泣。', cue: '留足表演和沉默时间，字幕淡入后也不自动切换。' },
  { ...base, id: 'who-can-i-lean-on', type: 'closing', title: '我还能依靠谁？', subtitle: '第三幕最后的提问', duration: 16, background: room, caption: '当所有的不幸接踵而来，我还能依靠谁？', captionAt: 1.5, fadeAt: 12, fadeDuration: 4,
    description: '最后的提问逐渐淡至黑场。', cue: '黑场会保持；等女孩与灯光准备好，再进入第四幕。' }
];

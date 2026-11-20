const room = 'assets/images/penang-bedroom.png';
const base = { act: '第三幕：无法掌控', transitionIn: 1.4, audio: { music: null, effects: [], volume: .7 } };
export default [
  { ...base, id: 'family-call', type: 'call', title: '突如其来的电话', subtitle: '亲人离世的消息', duration: 14, background: room, clock: '20:16', date: '12月24日', caller: '家人',
    description: '女孩整理好帐单，深呼吸，准备继续面对。突然电话响起，她接听后愣住，说不出话，电话缓缓垂下。',
    phoneShowAt: 5,
    cue: '5秒後手机和铃声才出现，不要太快；家人预录对白交代亲人离世。女孩扶住椅子后再推进。',
    dialogues: [
      { at: 3, speaker: '📞 预录对白', text: '喂，请问是悠兒吗？我是医院……你家人刚刚……对不起，我们已经尽力了。', note: '电话音' },
      { at: 9, speaker: '悠兒', text: '……你说什么？不可能……', note: '颤抖' }
    ] },
  { ...base, id: 'grief', type: 'closing', title: '我还能依靠谁？', subtitle: '掩面哭泣', duration: 16, background: room, caption: '有些事，再努力，也无法挽留。\n\n当所有的不幸接踵而来，我还能依靠谁？', captionAt: 3, fadeAt: 12, fadeDuration: 4,
    description: '女孩扶着椅子坐下，掩面哭泣。',
    cue: '留足表演和沉默时间，字幕淡入后也不自动切换。黑场会保持；等女孩与灯光准备好，再进入第四幕。' }
];

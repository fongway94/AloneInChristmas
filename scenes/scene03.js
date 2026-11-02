const room = 'assets/images/bedroom-cold.png';
const base = { act: '第三幕：無法掌控', transitionIn: 1.4, audio: { music: null, effects: [], volume: .7 } };
export default [
  { ...base, id: 'gather-bills', type: 'room', title: '努力整理', subtitle: '深呼吸，繼續面對', duration: 10, background: 'assets/images/bills-table.png',
    description: '女孩整理好帳單，深呼吸，準備繼續面對。', cue: '等女孩整理帳單並深呼吸後，再推進至來電。' },
  { ...base, id: 'family-call', type: 'call', title: '突如其來的電話', subtitle: '親人離世的消息', duration: 12, background: room, clock: '20:16', date: '12月24日 星期二', caller: '家人',
    description: '電話響起；女孩接聽後愣住，說不出話，電話緩緩垂下。', cue: '待補：電話鈴聲及家人預錄對白，交代親人離世；台詞與聲音請先由導演確認。女孩扶住椅子後再推進。' },
  { ...base, id: 'grief', type: 'room', title: '無法挽留', subtitle: '坐下，掩面哭泣', duration: 16, background: room, caption: '有些事，再努力，也無法挽留。', captionAt: 4, dim: .24,
    description: '女孩扶著椅子坐下，掩面哭泣。', cue: '留足表演和沉默時間，字幕淡入後也不自動切換。' },
  { ...base, id: 'who-can-i-lean-on', type: 'closing', title: '我還能依靠誰？', subtitle: '第三幕最後的提問', duration: 16, background: room, caption: '當所有的不幸接踵而來，我還能依靠誰？', captionAt: 1.5, fadeAt: 12, fadeDuration: 4,
    description: '最後的提問逐漸淡至黑場。', cue: '黑場會保持；等女孩與燈光準備好，再進入第四幕。' }
];

const room = 'assets/images/penang-bedroom.png';
const base = { act: '第四幕：沒有回覆', transitionIn: 1.6, audio: { music: null, effects: [], volume: .7 } };
export default [
  { ...base, id: 'room-dark', type: 'room', title: '燈光慢慢暗下', subtitle: '女孩的房間', duration: 10, background: room, dim: .3,
    description: '燈光慢慢暗下；手機訊息提示聲傳來，女孩抬頭拿起手機。', cue: '待補：手機訊息聲。等女孩抬頭並拿起手機後再推進。' },
  { ...base, id: 'friends-whatsapp', type: 'chat', title: '朋友群組', subtitle: '聖誕邀請', duration: 15, background: room, clock: '20:30', date: '12月24日', chatTitle: '朋友群組',
    messages: [
      { at: 2, sender: '朋友A', message: 'Merry Christmas！🎄❤️' },
      { at: 4.5, sender: '朋友B', message: '聖誕快樂！今晚大家出來聚一聚吧！' },
      { at: 7, sender: '朋友C', message: '好啊！一起去看聖誕表演！' },
      { at: 9.5, sender: '朋友D', message: '你呢？要不要一起來？' }
    ], description: 'WhatsApp 群組訊息依次出現，女孩看著手機，沉默，沒有回覆。', cue: '等四則訊息出現，並給女孩足夠時間看完後再推進。' },
  { ...base, id: 'hide-away', type: 'room', title: '沒有力氣快樂', subtitle: '把自己藏起來', duration: 15, background: room, dim: .22, caption: '有時候，不是不想快樂，而是真的沒有力氣快樂。', captionAt: 4,
    description: '女孩把手機放在一旁，輕輕搖頭，躺到床上拉起被子。', cue: '待女孩完成躺下、拉被子的動作再推進。音樂待補：安靜、孤單。' }
];

const room = 'assets/images/penang-bedroom.png';
const base = { act: '第四幕：没有回复', transitionIn: 1.6, audio: { music: null, effects: [], volume: .7 } };
export default [
  { ...base, id: 'friends-whatsapp', type: 'chat', title: '朋友群组', subtitle: '圣诞邀请', duration: 16, background: room, clock: '20:30', date: '12月24日', chatTitle: '朋友群组',
    messages: [
      { at: 2, sender: '朋友A', message: 'Merry Christmas！🎄❤️' },
      { at: 5, sender: '朋友B', message: '圣诞快乐！今晚大家出来聚一聚吧！' },
      { at: 8, sender: '朋友C', message: '好啊！一起去看圣诞表演！' },
      { at: 11, sender: '朋友D', message: '你呢？要不要一起来？' }
    ],
    description: 'WhatsApp 群组讯息依次出现，女孩看着手机，沉默，没有回复。',
    cue: '等四则讯息出现，并给女孩足够时间看完后再推进。',
    dialogues: [
      { at: 2, speaker: '朋友A', text: 'Merry Christmas！🎄❤️' },
      { at: 5, speaker: '朋友B', text: '圣诞快乐！今晚大家出来聚一聚吧！' },
      { at: 8, speaker: '朋友C', text: '好啊！一起去看圣诞表演！' },
      { at: 11, speaker: '朋友D', text: '你呢？要不要一起来？' }
    ] },
  { ...base, id: 'hide-away', type: 'room', title: '没有力气快乐', subtitle: '把自己藏起来', duration: 18, background: room, dim: .22, caption: '有时候，不是不想快乐，而是真的没有力气快乐。', captionAt: 4,
    audio: { music: null, volume: 1, effects: [{ src: 'Music/4th scene Recording.mp4', at: 6, volume: 15, kind: 'voice' }] },
    description: '女孩把手机放在一旁，轻轻摇头，躺到床上拉起被子。',
    cue: '待女孩完成躺下、拉被子的动作再推进。音乐保持安静、孤单。',
    dialogues: [
      { at: 6, speaker: '悠兒', text: '我也想去……可是，我真的没有力气了。', note: '看着手机，低声' }
    ] }
];

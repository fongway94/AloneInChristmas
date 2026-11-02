// 第二幕：聖誕夜。每個提示點都等待操作員配合演員推進。
const room = 'assets/images/bedroom-cold.png';
const street = 'assets/images/christmas-street.png';
const common = { act: '第二幕', transitionIn: 1.5, audio: { music: null, effects: [], volume: 0.7 } };
export default [
  { ...common, id: 'christmas-invitation', type: 'phone', title: '沒有回覆的邀請', subtitle: '朋友群組的訊息', duration: 12, background: room, clock: '19:28', date: '12月24日 星期二',
    description: '女孩收到朋友群組的聖誕邀請，但沒有回覆。', cue: '等女孩看完訊息、放下手機後再推進。音效建議：輕微訊息聲。',
    notifications: [{ at: 2, sender: '朋友群組', message: '今晚一起過聖誕嗎？大家都在等妳！', icon: '信', color: 'sage' }] },
  { ...common, id: 'leave-home', type: 'room', title: '一個人出門', subtitle: '聖誕夜的房間', duration: 10, background: room,
    description: '窗外傳來節慶聲音，女孩決定獨自出去走走。', cue: '待女孩起身準備出門後，切到街景。音效建議：遠處人聲、聖誕音樂和煙火。' },
  { ...common, id: 'christmas-crowd', type: 'room', title: '熱鬧的街頭', subtitle: '別人的聖誕夜', duration: 15, background: street, warmth: 0.12,
    description: '朋友拍照、交換禮物；情侶和一家人開心慶祝。女孩獨自穿過人群。', cue: '配角開始互動後，讓女孩穿過人群。使用實際演員營造熱鬧，背景不出現人像。' },
  { ...common, id: 'alone-in-crowd', type: 'room', title: '人群中的孤獨', subtitle: '熱鬧之中的一個人', duration: 14, background: street,
    caption: '有時候，最深的孤獨，不是身邊沒有人，而是在人群之中，仍然覺得自己孤單。', captionAt: 2,
    description: '其他演員的動作逐漸放慢，女孩慢慢走向舞台中央。', cue: '等配角放慢動作、女孩站定並完成情緒表演後再推進。音效漸弱。' }
];

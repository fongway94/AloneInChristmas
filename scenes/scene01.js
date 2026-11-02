// 第一幕：孤獨。所有時間為秒；每個提示點都由操作員手動推進。
const room = 'assets/images/penang-bedroom.png';
const base = { act: '第一幕：孤獨', transitionIn: 1.4, audio: { music: null, effects: [], volume: .7 } };
export default [
  { ...base, id: 'lonely-room', type: 'room', title: '想找人說話', subtitle: '獨自坐在房間', duration: 12, background: room, caption: '想找個人說說話，卻不知道可以找誰。', captionAt: 3,
    description: '女孩坐在房間，拿起手機，想找人說話。', cue: '字幕淡入後，等女孩拿起手機、準備輸入訊息，再推進。' },
  { ...base, id: 'unsent-draft', type: 'draft', title: '打了又刪的訊息', subtitle: '沒有送出的話', duration: 14, background: room, clock: '8:30', date: '12月24日', draft: '最近有點難過，你有空聊聊嗎？',
    description: '女孩打了幾個字，又逐一刪除。手機上的示範文字可修改。', cue: '訊息會自動逐字輸入、停頓、再逐字刪除；讓演員配合手機動作，完成後再推進。' },
  { ...base, id: 'friends-photos', type: 'social', title: '別人的相聚', subtitle: '手機裡的聚會照片', duration: 14, background: room, clock: '8:30', date: '12月24日', photo: 'assets/images/penang-friends.png',
    description: '女孩翻看聚會照片，再看看身旁空著的位置，最後抱緊抱枕，低下頭。', cue: '等女孩看過空位、抱緊抱枕並低頭後，再進入第二幕。' }
];

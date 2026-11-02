// 第一幕的操作提示。時間單位為秒；每個畫面播放完畢後都會等待操作員。
const room = 'assets/images/bedroom-cold.png';
const common = { act: '第一幕', transitionIn: 1.4, audio: { music: null, effects: [], volume: 0.7 } };
export default [
  { ...common, id: 'alone-room', type: 'room', title: '一個人的房間', subtitle: '孤獨的早晨', duration: 15, background: room,
    caption: '想找個人說說話，卻不知道可以找誰。', captionAt: 3,
    description: '女孩坐在床邊，拿起手機，猶豫著想找人說話。', cue: '女孩拿起手機、環顧四周後，進入下一個畫面。' },
  { ...common, id: 'friends-photos', type: 'social', title: '別人的相聚', subtitle: '手機裡的聚會照片', duration: 15, background: room,
    clock: '8:30', date: '12月24日 星期二', photo: 'assets/images/friends-christmas.png',
    description: '女孩看著朋友們的聚會照片，最後放下手機，抱住枕頭。', cue: '等女孩放下手機、抱住枕頭後，進入下一個畫面。' },
  { ...common, id: 'work-pressure', type: 'phone', title: '工作訊息', subtitle: '壓力逐漸累積', duration: 23, background: room, clock: '8:30', date: '12月24日 星期二',
    description: '工作電話和訊息接連不斷，女孩勉強應付。', cue: '訊息會自動出現；等女孩完成工作壓力的表演後再推進。',
    notifications: [
      { at: 2.5, sender: '工作通知', message: '早安，今天的報告請盡快交給我。', icon: '工', color: 'slate' },
      { at: 7, sender: '主管', message: '客戶那邊還在等回覆，麻煩妳再跟進一下。', icon: '信', color: 'sage' },
      { at: 11, sender: '工作通知', message: '會議時間提前了，請記得準時出席。', icon: '工', color: 'slate' },
      { at: 14.5, sender: '主管', message: '這份資料需要再修改，今天可以完成嗎？', icon: '信', color: 'sage' },
      { at: 17, sender: '工作通知', message: '還有幾件急事，請盡快查看。', icon: '工', color: 'slate' },
      { at: 19, sender: '主管', message: '看到訊息後，請馬上回覆我。', icon: '信', color: 'sage' }
    ] },
  { ...common, id: 'bills', type: 'room', title: '生活的重擔', subtitle: '帳單與經濟壓力', duration: 15, background: 'assets/images/bills-table.png',
    caption: '生活不會因為我累了，就停下來。', captionAt: 3,
    description: '女孩回到家，面對眼前的帳單與經濟壓力。', cue: '讓女孩有時間查看帳單；表演完成後再推進。' },
  { ...common, id: 'loss-message', type: 'phone', title: '來不及的消息', subtitle: '親人離世', duration: 13, background: room, clock: '20:16', date: '12月24日 星期二',
    description: '女孩突然接到親人離世的消息。', cue: '女孩看見消息後，留出沉默與反應的時間，再推進。',
    notifications: [{ at: 3, sender: '家人', message: '醫院剛剛打來了……人已經走了。', icon: '信', color: 'sage' }] },
  { ...common, id: 'grief', type: 'room', title: '無法挽留', subtitle: '獨自面對失去', duration: 16, background: room,
    caption: '有些事，再努力，也無法挽留。', captionAt: 4, dim: .24,
    description: '女孩情緒崩潰，獨自哭泣。', cue: '讓女孩完整演出悲傷；不要按時間自動切換。' },
  { ...common, id: 'who-can-i-lean-on', type: 'closing', title: '我還能依靠誰？', subtitle: '第一幕結尾', duration: 16, background: room,
    caption: '當所有的不幸接踵而來，我還能依靠誰？', captionAt: 1.5, fadeAt: 12, fadeDuration: 4,
    description: '第一幕的最後提問；畫面慢慢淡至黑場。', cue: '黑場會一直保持。等待演員準備好，再進入下一幕。' }
];

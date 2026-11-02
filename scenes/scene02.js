const room = 'assets/images/penang-bedroom.png';
const base = { act: '第二幕：現實', transitionIn: 1.4, audio: { music: null, effects: [], volume: .7 } };
export default [
  { ...base, id: 'alarm-work', type: 'room', title: '新的一天', subtitle: '鬧鐘響起', duration: 10, background: room,
    description: '鬧鐘響起，女孩急忙穿上外套，開始一天的工作。', cue: '音效待補：鬧鐘。等女孩穿上外套後再推進。' },
  { ...base, id: 'work-pressure', type: 'phone', title: '電話與工作訊息', subtitle: '忙碌的一天', duration: 23, background: room, clock: '8:30', date: '12月24日',
    description: '電話、工作訊息接連而來，她不停接聽、記錄。', cue: '訊息自動逐條出現；演員配合接聽和記錄。音效待補：電話及訊息聲。', notifications: [
      { at: 2.5, sender: '工作通知', message: '早安，今天的報告請盡快交給我。', icon: '工', color: 'slate' },
      { at: 7, sender: '主管', message: '客戶還在等回覆，麻煩妳再跟進一下。', icon: '信', color: 'sage' },
      { at: 11, sender: '工作通知', message: '會議時間提前了，請記得準時出席。', icon: '工', color: 'slate' },
      { at: 14.5, sender: '主管', message: '這份資料需要再修改，今天可以完成嗎？', icon: '信', color: 'sage' },
      { at: 17, sender: '工作通知', message: '還有幾件急事，請盡快查看。', icon: '工', color: 'slate' },
      { at: 19, sender: '主管', message: '看到訊息後，請馬上回覆我。', icon: '信', color: 'sage' }] },
  { ...base, id: 'bills', type: 'room', title: '帳單與錢包', subtitle: '回家後的壓力', duration: 15, background: 'assets/images/penang-bills.png', caption: '生活不會因為我累了，就停下來。', captionAt: 3,
    description: '女孩拆開帳單，翻看錢包、低頭計算，疲憊地揉著額頭。', cue: '讓演員完整完成拆帳單、查看錢包與計算的動作，再推進。' }
];

const room = 'assets/images/penang-bedroom.png';
const base = { act: '第二幕：现实', transitionIn: 1.4, audio: { music: null, effects: [], volume: .7 } };
export default [
  { ...base, id: 'alarm-work', type: 'phone', title: '新的一天', subtitle: '闹钟与工作讯息', duration: 18, background: room, clock: '08:30', date: '12月24日',
    description: '闹钟响起，女孩急忙穿上外套，开始一天的工作。电话、工作讯息接连而来，她不停接听、记录。',
    caption: '忙碌的一天',
    captionAt: 2,
    phoneShowAt: 5,
    cue: '先显示「忙碌的一天」字幕，再淡入手机，工作讯息依次出现，表示一天过去；演员配合接听和记录。',
    notifications: [
      { at: 2.5, receivedAt: '08:35', sender: '工作通知', message: '早安，今天的报告请尽快交给我。', icon: '工', color: 'slate' },
      { at: 7, receivedAt: '09:40', sender: '主管', message: '客户还在等回复，麻烦你再跟进一下。', icon: '信', color: 'sage' },
      { at: 11, receivedAt: '11:15', sender: '工作通知', message: '会议时间提前了，请记得准时出席。', icon: '工', color: 'slate' }
    ],
    dialogues: [
      { at: 4, speaker: '悠兒', text: '喂，好、好，我马上处理……', note: '接电话' }
    ] },
  { ...base, id: 'bills', type: 'room', title: '帐单与钱包', subtitle: '回家后的压力', duration: 16, background: 'assets/images/penang-bills.png',
    description: '女孩拆开帐单，翻看钱包、低头计算，疲惫地揉着额头。',
    cue: '让演员完整完成拆帐单、查看钱包与计算的动作，再推进。',
    dialogues: [
      { at: 6, speaker: '悠兒', text: '这个月……又要再省一点了。', note: '看帐单，叹气' }
    ] },
  { ...base, id: 'life-stops-for-no-one', type: 'room', title: '生活不会因为我累了', subtitle: '黑屏字幕', duration: 10, background: '',
    caption: '生活不会因为我累了，就停下来。',
    captionAt: 2,
    fadeAt: 7,
    fadeDuration: 3,
    description: '黑屏显示字幕，淡出后进入第三幕。',
    cue: '黑屏显示字幕，等观众读完后淡出，再进入第三幕。',
    dialogues: [] }
];

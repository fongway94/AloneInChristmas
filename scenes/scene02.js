const room = 'assets/images/penang-bedroom.png';
const base = { act: '第二幕：现实', transitionIn: 1.4, audio: { music: null, effects: [], volume: .7 } };
export default [
  { ...base, id: 'alarm-work', type: 'room', title: '新的一天', subtitle: '闹钟响起', duration: 10, background: room,
    description: '闹钟响起，女孩急忙穿上外套，开始一天的工作。', cue: '音效待补：闹钟。等女孩穿上外套后再推进。' },
  { ...base, id: 'work-pressure', type: 'phone', title: '电话与工作讯息', subtitle: '忙碌的一天', duration: 23, background: room, clock: '08:30', date: '12月24日',
    description: '电话、工作讯息接连而来，她不停接听、记录。', cue: '工作讯息与手机时间依次变化，表示一天过去；演员配合接听和记录。音效待补：电话及讯息声。', notifications: [
      { at: 2.5, receivedAt: '08:35', sender: '工作通知', message: '早安，今天的报告请尽快交给我。', icon: '工', color: 'slate' },
      { at: 7, receivedAt: '09:40', sender: '主管', message: '客户还在等回复，麻烦你再跟进一下。', icon: '信', color: 'sage' },
      { at: 11, receivedAt: '11:15', sender: '工作通知', message: '会议时间提前了，请记得准时出席。', icon: '工', color: 'slate' },
      { at: 14.5, receivedAt: '14:10', sender: '主管', message: '这份资料需要再修改，今天可以完成吗？', icon: '信', color: 'sage' },
      { at: 17, receivedAt: '16:25', sender: '工作通知', message: '还有几件急事，请尽快查看。', icon: '工', color: 'slate' },
      { at: 19, receivedAt: '18:00', sender: '主管', message: '看到讯息后，请马上回复我。', icon: '信', color: 'sage' }] },
  { ...base, id: 'bills', type: 'room', title: '帐单与钱包', subtitle: '回家后的压力', duration: 15, background: 'assets/images/penang-bills.png', caption: '生活不会因为我累了，就停下来。', captionAt: 3,
    description: '女孩拆开帐单，翻看钱包、低头计算，疲惫地揉着额头。', cue: '让演员完整完成拆帐单、查看钱包与计算的动作，再推进。' }
];

// 第一幕：孤独。所有时间为秒；每个提示点都由操作员手动推进。
const room = 'assets/images/penang-bedroom.png';
const base = { act: '第一幕：孤独', transitionIn: 1.4, audio: { music: null, effects: [], volume: .7 } };
export default [
  { ...base, id: 'lonely-room', type: 'room', title: '想找人说话', subtitle: '独自坐在房间', duration: 14, background: room,
    description: '女孩坐在房间，拿起手机，想找人说话。打了几个字，又逐一删除。',
    cue: '等女孩拿起手机、准备输入讯息，再推进。',
    dialogues: [
      { at: 3, speaker: '悠兒', text: '最近有点难过，你有空聊聊吗？', note: '打字又删去' },
      { at: 8, speaker: '悠兒', text: '算了。', note: '' }
    ] },
  { ...base, id: 'friends-photos', type: 'social', title: '别人的相聚', subtitle: '手机里的聚会照片', duration: 16, background: room, clock: '20:30', date: '12月23日', caption: '想找个人说说话，却不知道可以找谁。', captionAt: 4,
    posts: [
      { at: 1.8, photo: 'assets/images/penang-friends.png', author: '朋友们', caption: '和朋友一起迎接圣诞。', likes: '42 次赞', age: '2小时前' },
      { at: 7, photo: 'assets/images/social-family.png', author: '家人', caption: '和家人相聚的温暖时光。', likes: '28 次赞', age: '3小时前' },
      { at: 12, photo: 'assets/images/social-friends.png', author: '朋友们', caption: '今晚和大家一起吃饭。', likes: '36 次赞', age: '4小时前' }
    ],
    description: '女孩滑看朋友与家人的聚会照片，再看看身旁空着的位置，最后抱紧抱枕，低下头。',
    cue: '照片动态滚动，每张停留片刻；等女孩看过空位、抱紧抱枕并低头后，再进入第二幕。',
    dialogues: [
      { at: 10, speaker: '悠兒', text: '他们……好像都不需要我了。', note: '看着照片，轻声' }
    ] }
];

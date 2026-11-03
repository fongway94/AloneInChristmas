const street = 'assets/images/penang-street-local.png';
const base = { act: '第六幕：人群中的孤独', transitionIn: 1.5, audio: { music: null, effects: [], volume: .7 } };
export default [
  { ...base, id: 'crowd-friends', type: 'room', title: '朋友们', subtitle: '拍照与交换礼物', duration: 12, background: 'assets/images/penang-festive-local.png', warmth: .12,
    description: '朋友们有说有笑地走过，互相拍照、交换礼物。', cue: '第一组配角入场；节奏跟随现场演出。音乐待补：轻快的圣诞歌曲。' },
  { ...base, id: 'crowd-couple', type: 'room', title: '情侣', subtitle: '一起欣赏灯饰', duration: 12, background: 'assets/images/penang-quiet-local.png', warmth: .12,
    description: '一对情侣牵着手，甜蜜地欣赏圣诞灯饰。', cue: '第二组配角入场；让他们完成走位后再推进。' },
  { ...base, id: 'crowd-family', type: 'room', title: '家庭', subtitle: '一起庆祝', duration: 12, background: street, warmth: .12,
    description: '一家人开心走过，孩子兴奋地指着圣诞装饰。', cue: '第三组配角入场，女孩独自在其中穿梭。' },
  { ...base, id: 'alone-in-crowd', type: 'room', title: '人群中的孤独', subtitle: '女孩低头穿梭', duration: 14, background: street, caption: '原来最深的孤独，不是身边没有人，而是在人群之中，仍然觉得自己孤单。', captionAt: 2,
    description: '大家都很快乐，女孩低着头，显得格外孤独。', cue: '保留字幕阅读与女孩穿过人群的时间；再切换到长椅。' }
];

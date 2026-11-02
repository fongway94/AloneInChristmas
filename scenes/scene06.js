const street = 'assets/images/penang-street.png';
const base = { act: '第六幕：人群中的孤獨', transitionIn: 1.5, audio: { music: null, effects: [], volume: .7 } };
export default [
  { ...base, id: 'crowd-friends', type: 'room', title: '朋友們', subtitle: '拍照與交換禮物', duration: 12, background: street, warmth: .12,
    description: '朋友們有說有笑地走過，互相拍照、交換禮物。', cue: '第一組配角入場；節奏跟隨現場演出。音樂待補：輕快的聖誕歌曲。' },
  { ...base, id: 'crowd-couple', type: 'room', title: '情侶', subtitle: '一起欣賞燈飾', duration: 12, background: street, warmth: .12,
    description: '一對情侶牽著手，甜蜜地欣賞聖誕燈飾。', cue: '第二組配角入場；讓他們完成走位後再推進。' },
  { ...base, id: 'crowd-family', type: 'room', title: '家庭', subtitle: '一起慶祝', duration: 12, background: street, warmth: .12,
    description: '一家人開心走過，孩子興奮地指著聖誕裝飾。', cue: '第三組配角入場，女孩獨自在其中穿梭。' },
  { ...base, id: 'alone-in-crowd', type: 'room', title: '人群中的孤獨', subtitle: '女孩低頭穿梭', duration: 14, background: street, caption: '原來最深的孤獨，不是身邊沒有人，而是在人群之中，仍然覺得自己孤單。', captionAt: 2,
    description: '大家都很快樂，女孩低著頭，顯得格外孤獨。', cue: '保留字幕閱讀與女孩穿過人群的時間；再切換到長椅。' }
];

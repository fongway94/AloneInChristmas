const street = 'assets/images/penang-street-local.png';
const recording = (n, at, volume = 2) => ({ src: `Music/Christmas Recording ${n}.mp4`, at, volume, kind: 'voice' });
const base = { act: '第六幕：人群中的孤独', transitionIn: 1.5, audio: { music: null, effects: [], volume: .7 } };
export default [
  { ...base, id: 'crowd-scene', type: 'room', title: '热闹的人群', subtitle: '三组人依序出场', duration: 90, background: 'assets/images/penang-festive-local.png', warmth: .15, caption: '原来最深的孤独，不是身边没有人，而是在人群之中，仍然觉得自己孤单。', captionAt: 87,
    description: '舞台上开始出现热闹的人群。第一组朋友们有说有笑地走过，互相拍照、交换礼物；第二组情侣牵着手，甜蜜地欣赏圣诞灯饰；第三组家庭开心走过，孩子兴奋地指着圣诞装饰。女孩独自在人群中穿梭，低着头，显得格外孤独。',
    cue: '三组人依序出场并说对白，随后播放圣诞录音序列（12段，按指定绝对时间播放）；最后录音结束后字幕淡入。',
    audio: { music: null, volume: 1, effects: [
      recording(1, 6), recording(2, 11), recording(3, 16), recording(4, 22), recording(5, 24),
      recording(6, 38), recording(7, 44), recording(8, 51, 3), recording(9, 55),
      recording(10, 64), recording(11, 68), recording(12, 77)
    ] },
    dialogues: [
      { at: 1, speaker: '👥 朋友们', text: 'Merry Christmas！🎄', note: 'Abraham、欣美、Jessica、美玲、巧清' },
      { at: 3, speaker: '👥 朋友们', text: '来来来，我们一起拍照！', note: '互相拍照' },
      { at: 5, speaker: '👥 朋友们', text: '等一下，我先交换礼物！', note: '交换礼物 🎁' },
      { at: 8, speaker: '💑 情侣', text: '哇，你看那边的灯饰，好漂亮啊！', note: 'Louis 和女朋友，牵手' },
      { at: 10, speaker: '💑 情侣', text: 'Merry Christmas，谢谢你陪我过圣诞。', note: '甜蜜对望 ❤️' },
      { at: 12, speaker: '👨‍👩‍👧‍👦 家庭', text: '哇！好漂亮啊！', note: '孩子兴奋指着装饰' },
      { at: 13, speaker: '👨‍👩‍👧‍👦 家庭', text: '圣诞节好热闹啊！', note: '孩子开心' },
      { at: 14, speaker: '👨‍👩‍👧‍👦 家庭', text: '慢一点，小心啊！', note: '爸爸牵着孩子' },
      { at: 16, speaker: '👧 悠兒', text: '原来这么多人……也可以这么孤单。', note: '低头穿过人群' }
    ] }
];

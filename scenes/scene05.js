const base = { act: '第五幕：窗外的圣诞夜', transitionIn: 1.5, audio: { music: null, effects: [], volume: .7 } };
export default [
  { ...base, id: 'window-fireworks', type: 'room', title: '窗外的烟花', subtitle: '圣诞夜的街道', duration: 14, background: 'assets/images/christmas-window.png', dim: .15, motion: { preset: 'fireworks', intensity: 1 },
    description: '女孩躺在床上，被窗外热闹的声音吵醒，慢慢坐起身。窗外有烟花、圣诞灯饰和热闹的街道；女孩轻叹、摇头。',
    cue: '烟花、远处人群与圣诞器乐自动响起。等女孩坐起并望向窗外再推进。',
    dialogues: [
      { at: 4, speaker: '悠兒', text: '外面好热闹……为什么我一点也开心不起？', note: '望窗外' }
    ] },
  { ...base, id: 'get-ready-to-go', type: 'room', title: '决定出去走走', subtitle: '穿上外套与围巾', duration: 12, background: 'assets/images/christmas-window.png',
    description: '女孩起身，穿上外套、围上围巾，决定独自出去。',
    cue: '等服装与走位准备好，再切换到街头。',
    dialogues: [
      { at: 4, speaker: '悠兒', text: '出去走走吧……总好过一个人留在这里。', note: '围上围巾' }
    ] }
];

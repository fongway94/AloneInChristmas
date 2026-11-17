const base = { act: '第五幕：窗外的圣诞夜', transitionIn: 1.5, audio: { music: null, effects: [], volume: .7 } };
export default [
  { ...base, id: 'wake-to-celebration', type: 'room', title: '窗外的声音', subtitle: '被热闹声吵醒', duration: 10, background: 'assets/images/penang-bedroom.png', dim: .15,
    description: '女孩躺在床上，被窗外热闹的声音吵醒，慢慢坐起身。', cue: '烟花、远处人群与圣诞器乐自动响起。等女孩坐起并望向窗外再推进。' },
  { ...base, id: 'window-fireworks', type: 'room', title: '窗外的烟花', subtitle: '圣诞夜的街道', duration: 15, background: 'assets/images/penang-window-local.png', motion: { preset: 'fireworks', intensity: 1 },
    description: '窗外有烟花、圣诞灯饰和热闹的街道；女孩轻叹、摇头。', cue: '烟花会持续缓慢绽放；烟花、人群及街道环境声自动播放。等女孩表演完成再推进。' },
  { ...base, id: 'get-ready-to-go', type: 'room', title: '决定出去走走', subtitle: '穿上外套与围巾', duration: 12, background: 'assets/images/penang-bedroom.png',
    description: '女孩起身，穿上外套、围上围巾，决定独自出去。', cue: '等服装与走位准备好，再切换到街头。' }
];

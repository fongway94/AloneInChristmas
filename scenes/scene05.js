const base = { act: '第五幕：窗外的聖誕夜', transitionIn: 1.5, audio: { music: null, effects: [], volume: .7 } };
export default [
  { ...base, id: 'wake-to-celebration', type: 'room', title: '窗外的聲音', subtitle: '被熱鬧聲吵醒', duration: 10, background: 'assets/images/bedroom-cold.png', dim: .15,
    description: '女孩躺在床上，被窗外熱鬧的聲音吵醒，慢慢坐起身。', cue: '待補：煙花聲、歡呼聲、聖誕歌曲。等女孩坐起並望向窗外再推進。' },
  { ...base, id: 'window-fireworks', type: 'room', title: '窗外的煙花', subtitle: '聖誕夜的街道', duration: 15, background: 'assets/images/christmas-window.png', motion: { preset: 'fireworks', intensity: 1 },
    description: '窗外有煙花、聖誕燈飾和熱鬧的街道；女孩輕嘆、搖頭。', cue: '煙花會持續緩慢綻放；人群的聲音須另備。等女孩表演完成再推進。' },
  { ...base, id: 'get-ready-to-go', type: 'room', title: '決定出去走走', subtitle: '穿上外套與圍巾', duration: 12, background: 'assets/images/bedroom-cold.png',
    description: '女孩起身，穿上外套、圍上圍巾，決定獨自出去。', cue: '等服裝與走位準備好，再切換到街頭。' }
];

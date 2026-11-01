// 时间单位均为秒。修改文案或时间不需要改动播放引擎。
export default {
  id: 'bad-day', title: '糟糕的一天', subtitle: '平静被一条条消息打破',
  description: '接连而来的消息，将一个平凡的早晨推向失控。',
  duration: 40, freezeAt: 34, fadeAt: 36, fadeDuration: 4,
  background: 'assets/images/morning-room.png',
  transitionIn: 1.5, transitionOut: 4,
  clock: '8:30', date: '12月25日 星期三',
  notifications: [
    { at: 4.5, sender: '生意合伙人', message: '很抱歉，公司资金已经周转不下去了。我们可能真的要结束营业了。', icon: '信', color: 'sage' },
    { at: 9.5, sender: '家人', message: '你今天先不要回来了，我们之间真的需要冷静一下。', icon: '信', color: 'sage' },
    { at: 14, sender: '银行通知', message: '温馨提醒：您的贷款已逾期，请尽快缴付未偿还款项。', icon: '银', color: 'blue' },
    { at: 18, sender: '工作通知', message: '很遗憾地通知您，公司决定终止您的职位。', icon: '工', color: 'slate' },
    { at: 21.5, sender: '朋友', message: '听说你最近发生了一些事情，你还好吗？', icon: '信', color: 'sage' },
    { at: 24.5, sender: '家人', message: '我们真的需要好好谈一谈，不能再这样下去了。', icon: '信', color: 'sage' },
    { at: 27, sender: '生意合伙人', message: '账单还没有处理，我们得尽快想办法。', icon: '信', color: 'sage' },
    { at: 29, sender: '银行通知', message: '您的还款已逾期，请及时查看。', icon: '银', color: 'blue' },
    { at: 30.5, sender: '工作通知', message: '请尽快确认离职相关事宜。', icon: '工', color: 'slate' },
    { at: 32, sender: '家人', message: '看到消息后，给我们回个电话吧。', icon: '信', color: 'sage' }
  ],
  // 留空即静音。可填入本地、已获授权的音频路径。
  audio: { music: null, effects: [], volume: 0.7 },
  pausePoints: []
};

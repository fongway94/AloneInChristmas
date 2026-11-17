// Web Audio 合成聖誕旋律 — 無需外部音樂檔案，即時產生好聽的聖誕歌曲
const NOTE_FREQ = {
  C3:130.81, D3:146.83, E3:164.81, F3:174.61, G3:196.00, A3:220.00, B3:246.94,
  C4:261.63, D4:293.66, E4:329.63, F4:349.23, G4:392.00, A4:440.00, B4:493.88,
  C5:523.25, D5:587.33, E5:659.25, F5:698.46, G5:783.99, A5:880.00, B5:987.77,
  E2:82.41, A2:110.00, C2:65.41
};

// 每首曲子：[音名, 時長(秒)] 循環播放
const TUNES = {
  silentNight: [   // 〈平安夜〉慢版，孤獨溫柔
    ['G4',1],['A4',.5],['G4',.5],['E4',2],
    ['G4',1],['A4',.5],['G4',.5],['E4',2],
    ['D5',2],['D5',1],['B4',2],['C5',2],
    ['C5',1],['G4',2],['E4',.5],['G4',.5],['E4',2]
  ],
  jingleBells: [   // 〈鈴兒響叮噹〉輕快熱鬧
    ['E4',1],['E4',1],['E4',2],
    ['E4',1],['E4',1],['E4',2],
    ['G4',1.5],['C4',.5],['D4',1],['E4',3],
    ['F4',1],['F4',1],['F4',1],['F4',1],['F4',.5],['E4',.5],
    ['E4',1],['E4',1],['E4',1],['E4',1],['D4',1],['D4',1],
    ['E4',1],['D4',1],['C4',3]
  ],
  joyToTheWorld: [ // 〈普世歡騰〉光明盼望
    ['C5',2],['B4',1],['A4',1],['G4',2],
    ['F4',1],['E4',1],['D4',1],['C4',2],
    ['G4',1],['A4',1],['A4',1],['B4',1],['B4',1],['C5',3]
  ],
  weWishYou: [     // 〈We Wish You a Merry Christmas〉慶祝
    ['C4',1],['F4',1],['F4',.5],['G4',.5],['F4',.5],['E4',.5],
    ['D4',1],['D4',1],['D4',1],['G4',1],['G4',.5],['A4',.5],
    ['G4',.5],['F4',.5],['E4',1],['C4',1],['E4',1],['A4',1],
    ['A4',.5],['B4',.5],['A4',.5],['G4',.5],['F4',1],
    ['D4',1],['C4',.5],['D4',.5],['G4',1],['E4',2]
  ],
  oChristmasTree: [// 〈O Christmas Tree〉安靜音樂盒
    ['C4',1],['F4',1.5],['F4',.5],['F4',1],['G4',1],['A4',1.5],['A4',.5],['A4',1],
    ['G4',1],['F4',1],['E4',1],['D4',1],['C4',2],
    ['C4',1],['F4',1.5],['F4',.5],['F4',1],['G4',1],['A4',1.5],['A4',.5],['A4',1],
    ['G4',1],['E4',2],['D4',1],['C4',3]
  ]
};

export class XmasSynth {
  constructor() {
    this.ctx = null;
    this.gainNode = null;
    this.tune = null;
    this.index = 0;
    this.playing = false;
    this.volume = 0.1;
    this.timer = null;
  }
  init() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    if (!this.gainNode) {
      this.gainNode = this.ctx.createGain();
      this.gainNode.connect(this.ctx.destination);
      this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    }
  }
  play(tuneName, volume = 0.12) {
    this.init();
    this.stop();
    this.tune = TUNES[tuneName];
    this.index = 0;
    this.volume = volume;
    this.playing = true;
    this.gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
    this.nextNote();
  }
  nextNote() {
    if (!this.playing || !this.tune) return;
    if (this.index >= this.tune.length) this.index = 0;
    const [name, dur] = this.tune[this.index];
    const freq = NOTE_FREQ[name];
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(this.volume, now + 0.03);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur * 0.85);
    osc.connect(g).connect(this.gainNode);
    osc.start(now);
    osc.stop(now + dur);
    this.index++;
    this.timer = setTimeout(() => this.nextNote(), dur * 1000);
  }
  stop() {
    this.playing = false;
    this.tune = null;
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
    }
  }
  setVolume(v) {
    this.volume = v;
    if (this.gainNode) this.gainNode.gain.setTargetAtTime(v, this.ctx.currentTime, 0.02);
  }
}

export const xmasSynth = new XmasSynth();

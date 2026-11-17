// 同步的低强度环境动态。时间由场景管理器提供，预览与舞台不各自随机生成。
const W = 960, H = 540;
const fraction = n => n - Math.floor(n);
const seed = n => fraction(Math.sin(n * 127.1 + 19.19) * 43758.5453);

function rain(ctx, time, side, intensity) {
  const bounds = side === 'left' ? { x: 0, y: 0, w: .43, h: .63 } : side === 'middle' ? { x: .47, y: .10, w: .34, h: .69 } : { x: .72, y: 0, w: .28, h: .79 };
  ctx.save(); ctx.beginPath(); ctx.rect(bounds.x * W, bounds.y * H, bounds.w * W, bounds.h * H); ctx.clip();
  ctx.lineCap = 'round';
  for (let i = 0; i < 48; i++) {
    const x = (bounds.x + seed(i + 1) * bounds.w) * W;
    const y = (bounds.y + fraction(seed(i + 90) + time * (.035 + seed(i + 160) * .045)) * bounds.h) * H;
    const length = 5 + seed(i + 220) * 14;
    ctx.strokeStyle = `rgba(195, 221, 231, ${(0.10 + seed(i + 260) * .17) * intensity})`;
    ctx.lineWidth = .45 + seed(i + 310) * .5;
    ctx.beginPath(); ctx.moveTo(x, y - length); ctx.lineTo(x + .6, y); ctx.stroke();
  }
  ctx.restore();
}

function lights(ctx, time, preset, intensity) {
  // 光晕只落在原始街景的灯串、橱窗与街灯附近，中央留给演员。
  const points = preset === 'bench'
    ? [[.73,.17,45],[.19,.14,25],[.35,.34,25],[.85,.29,32],[.08,.65,24],[.94,.62,24]]
    : [[.76,.16,45],[.07,.11,25],[.20,.23,25],[.37,.30,22],[.88,.32,27],[.35,.58,24]];
  for (let i = 0; i < points.length; i++) {
    const [x, y, radius] = points[i];
    const breathing = .72 + .28 * Math.sin(time * (.19 + i * .012) + i * 1.1);
    const alpha = Math.max(0, .12 * intensity * breathing);
    const gradient = ctx.createRadialGradient(x * W, y * H, 0, x * W, y * H, radius);
    gradient.addColorStop(0, `rgba(255, 205, 132, ${alpha})`);
    gradient.addColorStop(.35, `rgba(255, 177, 91, ${alpha * .35})`);
    gradient.addColorStop(1, 'rgba(255, 177, 91, 0)');
    ctx.fillStyle = gradient; ctx.fillRect(x * W - radius, y * H - radius, radius * 2, radius * 2);
  }
}

// 烟花只在窗外天空绽放；无快速闪光，不遮挡舞台下方。
function fireworks(ctx, time, intensity) {
  const bursts = [[.38,.20,0],[.61,.15,2.8],[.48,.27,5.9]];
  for (let b = 0; b < bursts.length; b++) {
    const [x, y, offset] = bursts[b];
    const phase = ((time - offset) % 11 + 11) % 11;
    if (phase > 3.2 || time < offset) continue;
    const spread = Math.min(1, phase / 1.6);
    const opacity = Math.min(1, phase / .35) * Math.max(0, 1 - phase / 3.2) * intensity;
    for (let i = 0; i < 44; i++) {
      const angle = (Math.PI * 2 * i) / 44 + seed(i + b * 50) * .09;
      const distance = (35 + seed(i + 60) * 37) * spread;
      const fall = phase * phase * 2.4;
      const px = x * W + Math.cos(angle) * distance, py = y * H + Math.sin(angle) * distance + fall;
      ctx.strokeStyle = `rgba(255, ${Math.round(185 + 40 * seed(i + b))}, 133, ${opacity * .8})`;
      ctx.lineWidth = .8 + seed(i + 80) * .9;
      ctx.beginPath(); ctx.moveTo(px - Math.cos(angle) * 5 * spread, py - Math.sin(angle) * 5 * spread); ctx.lineTo(px, py); ctx.stroke();
    }
  }
}

// 缓慢的水面光感与柔和光晕；不闪烁，也不影响文字阅读。
function endingLight(ctx, time, preset, intensity) {
  if (preset === 'embrace') {
    const alpha = (.07 + .025 * Math.sin(time * .4)) * intensity;
    const g = ctx.createRadialGradient(W * .5, H * .16, 0, W * .5, H * .16, W * .24);
    g.addColorStop(0, `rgba(255, 224, 177, ${alpha})`); g.addColorStop(1, 'rgba(255, 213, 160, 0)');
    ctx.fillStyle = g; ctx.fillRect(W * .26, 0, W * .48, H * .5); return;
  }
  for (let i = 0; i < 12; i++) {
    const x = W * (.27 + seed(i + 7) * .46), y = H * (.57 + seed(i + 71) * .16);
    const alpha = (.015 + .018 * (1 + Math.sin(time * .3 + i))) * intensity;
    ctx.strokeStyle = `rgba(231, 216, 190, ${alpha})`; ctx.lineWidth = .7;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 5 + seed(i + 9) * 13, y); ctx.stroke();
  }
}

export function createAtmosphere(canvas, settings) {
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return { draw() {} };
  const intensity = Math.max(0, Math.min(1.5, settings.intensity ?? 1));
  return { draw(time) {
    ctx.clearRect(0, 0, W, H);
    if (settings.preset === 'rain-right') rain(ctx, time, 'right', intensity);
    else if (settings.preset === 'rain-left') rain(ctx, time, 'left', intensity);
    else if (settings.preset === 'rain-middle') rain(ctx, time, 'middle', intensity);
    else if (settings.preset === 'street' || settings.preset === 'bench') lights(ctx, time, settings.preset, intensity);
    else if (settings.preset === 'fireworks') fireworks(ctx, time, intensity);
    else if (settings.preset === 'sea' || settings.preset === 'embrace') endingLight(ctx, time, settings.preset, intensity);
  }};
}

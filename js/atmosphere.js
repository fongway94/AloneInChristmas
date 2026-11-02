// 同步的低強度環境動態。時間由場景管理器提供，預覽與舞台不各自隨機生成。
const W = 960, H = 540;
const fraction = n => n - Math.floor(n);
const seed = n => fraction(Math.sin(n * 127.1 + 19.19) * 43758.5453);

function rain(ctx, time, side, intensity) {
  const bounds = side === 'left' ? { x: 0, y: 0, w: .34, h: .56 } : { x: .79, y: 0, w: .21, h: .79 };
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
  // 光暈只落在原始街景的燈串、櫥窗與街燈附近，中央留給演員。
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

export function createAtmosphere(canvas, settings) {
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return { draw() {} };
  const intensity = Math.max(0, Math.min(1.5, settings.intensity ?? 1));
  return { draw(time) {
    ctx.clearRect(0, 0, W, H);
    if (settings.preset === 'rain-right') rain(ctx, time, 'right', intensity);
    else if (settings.preset === 'rain-left') rain(ctx, time, 'left', intensity);
    else if (settings.preset === 'street' || settings.preset === 'bench') lights(ctx, time, settings.preset, intensity);
  }};
}

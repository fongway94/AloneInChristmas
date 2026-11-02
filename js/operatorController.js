import { SceneManager, scenes, elapsed } from './sceneManager.js';
const manager = new SceneManager();
const $ = id => document.getElementById(id);
const pad = n => String(Math.floor(n)).padStart(2, '0');
const format = seconds => `${pad(seconds / 60)}:${pad(seconds % 60)}`;
$('scene-count').textContent = pad(scenes.length); $('total-heading').textContent = pad(scenes.length);
let lastAct = '';
scenes.forEach((scene, index) => {
  if (scene.act !== lastAct) { const heading = document.createElement('div'); heading.className = 'act-heading'; heading.textContent = scene.act; $('scene-list').append(heading); lastAct = scene.act; }
  const button = document.createElement('button'); button.className = 'scene-item';
  const number = document.createElement('span'); number.className = 'number'; number.textContent = pad(index + 1);
  const text = document.createElement('span'); const title = document.createElement('strong'); title.textContent = scene.title;
  const subtitle = document.createElement('small'); subtitle.textContent = scene.subtitle; text.append(title, subtitle);
  const marker = document.createElement('span'); marker.className = 'scene-state'; marker.textContent = '●'; button.append(number, text, marker);
  button.addEventListener('click', () => manager.go(index)); $('scene-list').append(button);
  const option = document.createElement('option'); option.value = String(index); option.textContent = `${pad(index + 1)} · ${scene.act} · ${scene.title}`; $('cue-select').append(option);
});
$('cue-select').addEventListener('change', event => { const index = Number(event.target.value); if (index >= 0) manager.go(index); });
$('next').addEventListener('click', () => manager.next());
$('previous').addEventListener('click', () => manager.previous());
$('restart').addEventListener('click', () => manager.restart());
$('play').addEventListener('click', () => manager.togglePlay());
$('black').addEventListener('click', () => manager.toggleBlack());
$('audio-toggle').addEventListener('click', () => manager.toggleMute());
$('audio-volume').addEventListener('input', event => manager.setVolume(Number(event.target.value)));
$('open-stage').addEventListener('click', () => { const win = window.open('index.html', 'christmas-stage'); if (win) win.focus(); else alert('無法開啟舞台視窗，請允許瀏覽器開啟彈出視窗後重試。'); });
window.addEventListener('keydown', event => {
  if (event.repeat || event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
  const key = event.key.toLowerCase();
  if (['arrowright','arrowleft',' ','b','r','f'].includes(key)) event.preventDefault();
  if (key === 'arrowright' || key === ' ') manager.next();
  else if (key === 'arrowleft') manager.previous();
  else if (key === 'b') manager.toggleBlack();
  else if (key === 'r') manager.restart();
  else if (key === 'f') { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {}); }
});
let state; manager.subscribe(value => { state = value; });
function render() {
  const scene = scenes[state.index], selected = scene || scenes[0];
  const time = scene ? Math.min(elapsed(state), scene.duration) : 0;
  $('current-heading').textContent = pad(scene ? state.index + 1 : 0);
  $('current-title').textContent = scene ? `${scene.act} · ${scene.title}` : state.index >= scenes.length ? '演出結束' : '等待開始';
  $('preview-wait').hidden = state.index !== -1 || state.black;
  $('elapsed').textContent = format(time); $('duration').textContent = format(selected?.duration || 0);
  $('progress').style.width = `${selected ? time / selected.duration * 100 : 0}%`;
  $('status-text').textContent = state.black ? '手動黑場中' : !scene ? (state.index >= scenes.length ? '演出結束 · 黑場保持中' : '準備就緒') : !state.playing ? '已暫停' : time >= scene.duration ? (scene.fadeAt != null ? '黑場保持中 · 等待推進' : '環境動態持續 · 等待推進') : '動畫播放中';
  $('play').querySelector('strong').textContent = scene && state.playing ? '暫停' : '播放';
  $('play').querySelector('span').textContent = scene && state.playing ? 'Ⅱ' : '▶';
  $('audio-toggle').textContent = state.muted ? '預錄聲音：靜音' : '預錄聲音：開啟'; $('audio-volume').value = state.volume ?? 1;
  $('black').classList.toggle('active', state.black); $('black').querySelector('strong').textContent = state.black ? '解除黑場' : '黑場';
  $('previous').disabled = state.index <= 0; $('next').disabled = state.index >= scenes.length;
  $('cue-act').textContent = selected?.act || ''; $('scene-description').textContent = selected?.description || ''; $('operator-cue').textContent = selected?.cue || '';
  $('scene-length').textContent = `約 ${selected?.duration || 0} 秒`; $('cue-select').value = scene ? String(state.index) : '-1';
  document.querySelectorAll('.scene-item').forEach((el, i) => { el.style.opacity = state.index === i || (state.index === -1 && i === 0) ? '1' : '.55'; });
  requestAnimationFrame(render);
}
requestAnimationFrame(render);

import { SceneManager, scenes, elapsed } from './sceneManager.js';
const manager = new SceneManager();
const $ = id => document.getElementById(id);
const pad = n => String(Math.floor(n)).padStart(2, '0');
const format = seconds => `${pad(seconds / 60)}:${pad(seconds % 60)}`;
$('scene-count').textContent = pad(scenes.length); $('total-heading').textContent = pad(scenes.length);
scenes.forEach((scene, index) => {
  const button = document.createElement('button'); button.className = 'scene-item';
  const number = document.createElement('span'); number.className = 'number'; number.textContent = pad(index + 1);
  const text = document.createElement('span'); const title = document.createElement('strong'); title.textContent = `第${['一','二','三','四','五','六','七','八','九','十'][index] || index + 1}幕：${scene.title}`;
  const subtitle = document.createElement('small'); subtitle.textContent = scene.subtitle || scene.description; text.append(title, subtitle);
  const marker = document.createElement('span'); marker.className = 'scene-state'; marker.textContent = '●'; button.append(number, text, marker);
  button.addEventListener('click', () => manager.go(index)); $('scene-list').append(button);
});
$('next').addEventListener('click', () => manager.next());
$('previous').addEventListener('click', () => manager.previous());
$('restart').addEventListener('click', () => manager.restart());
$('play').addEventListener('click', () => manager.togglePlay());
$('black').addEventListener('click', () => manager.toggleBlack());
$('open-stage').addEventListener('click', () => { const win = window.open('index.html', 'christmas-stage'); if (win) win.focus(); else alert('无法打开舞台窗口，请允许浏览器弹出窗口后重试。'); });
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
  $('current-title').textContent = scene ? `第一幕：${scene.title}` : state.index >= scenes.length ? '演出结束' : '等待开始';
  $('preview-wait').hidden = state.index !== -1 || state.black;
  $('elapsed').textContent = format(time); $('duration').textContent = format(selected?.duration || 0);
  $('progress').style.width = `${selected ? time / selected.duration * 100 : 0}%`;
  $('status-text').textContent = state.black ? '手动黑屏中' : !scene ? (state.index >= scenes.length ? '演出已结束 · 黑屏保持中' : '准备就绪') : time >= scene.duration ? '场景结束 · 黑屏保持中' : state.playing ? '正在播放' : '已暂停';
  $('play').querySelector('strong').textContent = state.playing && time < (scene?.duration || 0) ? '暂停' : '播放';
  $('play').querySelector('span').textContent = state.playing && time < (scene?.duration || 0) ? 'Ⅱ' : '▶';
  $('black').classList.toggle('active', state.black); $('black').querySelector('strong').textContent = state.black ? '解除黑屏' : '黑屏';
  $('previous').disabled = state.index <= 0; $('next').disabled = state.index >= scenes.length;
  $('scene-description').textContent = selected?.description || ''; $('scene-length').textContent = `约 ${selected?.duration || 0} 秒`;
  document.querySelectorAll('.scene-item').forEach((el, i) => { el.style.opacity = state.index === i || (state.index === -1 && i === 0) ? '1' : '.55'; });
  requestAnimationFrame(render);
}
requestAnimationFrame(render);

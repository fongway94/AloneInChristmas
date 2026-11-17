import { SceneManager, scenes, elapsed } from './sceneManager.js?v=audio3';
import { createAudioManager } from './createAudioManager.js?v=audio3';
const manager = new SceneManager();
const localAudio = createAudioManager();
let localIndex = null, localRun = null, localSelected = false, remoteSound = null;
try { const channel = new BroadcastChannel('alone-in-christmas-audio-status'); channel.onmessage = event => { remoteSound = event.data; }; } catch (_) {}
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
for (const group of ['music', 'effects', 'voice']) $(group + '-volume').addEventListener('input', event => manager.setGroupVolume(group, event.target.value));
// 只播放一次本机提示音，方便在手机上核对效果音量；演出音轨仍由舞台播放。
let testSound;
$('test-sfx').addEventListener('click', () => {
  const status = $('test-sfx-status');
  const level = state.muted ? 0 : (state.volume ?? 1) * (state.effectsVolume ?? 1) * .70;
  if (level <= 0) { status.textContent = '请先解除静音并调高总音量和音效音量。'; return; }
  if (!testSound) { testSound = new Audio('assets/audio/sfx/message-v2.wav'); testSound.preload = 'auto'; }
  testSound.pause();
  try { testSound.currentTime = 0; } catch (_) {}
  testSound.volume = Math.min(1, level); status.textContent = '正在播放，请确认是否听到提示音。';
  try { testSound.play().catch(() => { status.textContent = '浏览器未能播放，请检查媒体音量和网站声音权限。'; }); }
  catch (_) { status.textContent = '浏览器未能播放，请检查媒体音量和网站声音权限。'; }
});
$('output-stage').addEventListener('click', () => manager.setAudioOutput('stage'));
$('output-operator').addEventListener('click', () => {
  manager.setAudioOutput('operator');
  // resume() 必须直接在用户点击时调用，不能等到动画帧。
  localAudio.unlock?.();
  localAudio.preload?.(scenes.flatMap(scene => scene.audio?.effects || []).map(track => track.src).filter(Boolean));
  const scene = scenes[state.index], time = scene ? elapsed(state) : 0;
  const faded = scene?.fadeAt != null && time >= scene.fadeAt + scene.fadeDuration;
  localAudio.update(time, state.playing && !faded, state.black || state.muted, state.volume ?? 1,
    { music: state.musicVolume ?? 1, effects: state.effectsVolume ?? 1, voice: state.voiceVolume ?? 1 }, true);
});
$('open-stage').addEventListener('click', () => { const win = window.open('index.html', 'christmas-stage'); if (win) win.focus(); else alert('无法开启舞台视窗，请允许浏览器开启弹出视窗后重试。'); });
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
let state; manager.subscribe(value => {
  state = value;
  const selected = value.audioOutput === 'operator';
  if (selected && (!localSelected || localIndex !== value.index || localRun !== value.runId)) {
    localIndex = value.index; localRun = value.runId; localAudio.load(scenes[value.index]);
  } else if (!selected && localSelected) localAudio.stop();
  localSelected = selected;
});
function render() {
  const scene = scenes[state.index], selected = scene || scenes[0];
  const time = scene ? Math.min(elapsed(state), scene.duration) : 0;
  $('current-heading').textContent = pad(scene ? state.index + 1 : 0);
  $('current-title').textContent = scene ? `${scene.act} · ${scene.title}` : state.index >= scenes.length ? '演出结束' : '等待开始';
  $('preview-wait').hidden = state.index !== -1 || state.black;
  $('elapsed').textContent = format(time); $('duration').textContent = format(selected?.duration || 0);
  $('progress').style.width = `${selected ? time / selected.duration * 100 : 0}%`;
  $('status-text').textContent = state.black ? '手动黑场中' : !scene ? (state.index >= scenes.length ? '演出结束 · 黑场保持中' : '准备就绪') : !state.playing ? '已暂停' : time >= scene.duration ? (scene.fadeAt != null ? '黑场保持中 · 等待推进' : '环境动态持续 · 等待推进') : '动画播放中';
  $('play').querySelector('strong').textContent = scene && state.playing ? '暂停' : '播放';
  $('play').querySelector('span').textContent = scene && state.playing ? 'Ⅱ' : '▶';
  const localOutput = state.audioOutput === 'operator';
  $('output-stage').classList.toggle('active', !localOutput);
  $('output-operator').classList.toggle('active', localOutput);
  const rawTime = scene ? elapsed(state) : 0;
  const faded = scene?.fadeAt != null && rawTime >= scene.fadeAt + scene.fadeDuration;
  if (localOutput) localAudio.update(rawTime, !!scene && state.playing && !faded, state.black || state.muted, state.volume ?? 1,
    { music: state.musicVolume ?? 1, effects: state.effectsVolume ?? 1, voice: state.voiceVolume ?? 1 });
  if (state.muted || (state.volume ?? 1) === 0) $('output-status').textContent = '全部声音已静音，或总音量为零。';
  else if (localOutput) $('output-status').textContent = '本操作台：' + (localAudio.status?.() || '已选择；如无声音，请再次点击本操作台播放。');
  else $('output-status').textContent = remoteSound && Date.now() - remoteSound.at < 5000
    ? '舞台窗口：' + remoteSound.status : '请打开舞台窗口，并在舞台页面点击或轻触一次。';
  $('audio-toggle').textContent = state.muted ? '全部声音：静音' : '全部声音：开启'; $('audio-volume').value = state.volume ?? 1; for (const group of ['music', 'effects', 'voice']) $(group + '-volume').value = state[group + 'Volume'] ?? 1;
  $('black').classList.toggle('active', state.black); $('black').querySelector('strong').textContent = state.black ? '解除黑场' : '黑场';
  $('previous').disabled = state.index <= 0; $('next').disabled = state.index >= scenes.length;
  $('cue-act').textContent = selected?.act || ''; $('scene-description').textContent = selected?.description || ''; $('operator-cue').textContent = selected?.cue || ''; $('audio-cue').textContent = selected?.audio?.summary || '';
  $('scene-length').textContent = `约 ${selected?.duration || 0} 秒`; $('cue-select').value = scene ? String(state.index) : '-1';
  document.querySelectorAll('.scene-item').forEach((el, i) => { el.style.opacity = state.index === i || (state.index === -1 && i === 0) ? '1' : '.55'; });
  requestAnimationFrame(render);
}
requestAnimationFrame(render);

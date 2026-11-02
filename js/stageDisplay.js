import { SceneManager, scenes, elapsed } from './sceneManager.js';
import { AudioManager } from './audioManager.js';
const manager = new SceneManager();
const preview = new URLSearchParams(location.search).has('preview');
const audio = new AudioManager(preview);
// 提前載入圖片，降低現場切換時等待解碼的機率。
const preloaded = [...new Set(scenes.flatMap(scene => [scene.background, scene.photo]).filter(Boolean))].map(src => { const image = new Image(); image.src = src; return image; });
const root = document.querySelector('#stage');
let currentIndex = null, currentRun = null, view = null, state;
function build(scene) {
  const previous = root.querySelector('.scene-layer:not(.leaving)');
  if (previous) { previous.classList.add('leaving'); setTimeout(() => previous.remove(), 1500); }
  if (!scene) return null;
  const layer = document.createElement('div'); layer.className = `scene-layer scene-${scene.type}`;
  const environment = document.createElement('div'); environment.className = 'environment'; environment.style.backgroundImage = `url("${scene.background}")`;
  layer.append(environment);
  const warmGlow = document.createElement('div'); warmGlow.className = 'warm-glow'; warmGlow.style.opacity = String(scene.warmth || 0); layer.append(warmGlow);
  const haze = document.createElement('div'); haze.className = 'atmosphere'; layer.append(haze);
  let phone = null; const cards = [];
  if (scene.type === 'phone' || scene.type === 'social') {
    phone = document.createElement('div'); phone.className = 'phone';
    phone.innerHTML = `<div class="phone-edge"><div class="screen"><div class="wallpaper"></div><div class="status"><span></span><span class="status-icons"><span>◢</span><span>◕</span><span class="battery"></span></span></div><div class="island"></div><div class="lock"><div class="lock-icon">⌁</div><div class="date"></div><div class="clock"></div></div><div class="notifications"></div><div class="phone-bottom"><span class="bottom-button">◉</span><span class="bottom-button camera">◉</span></div><div class="home-bar"></div></div></div>`;
    phone.querySelector('.status > span').textContent = scene.clock; phone.querySelector('.date').textContent = scene.date; phone.querySelector('.clock').textContent = scene.clock;
    if (scene.type === 'social') {
      const post = document.createElement('div'); post.className = 'social-post';
      const header = document.createElement('div'); header.className = 'social-header'; header.textContent = '朋友的近況';
      const image = document.createElement('img'); image.src = scene.photo; image.alt = '';
      const caption = document.createElement('div'); caption.className = 'social-caption'; caption.textContent = '和喜歡的人，一起迎接聖誕。';
      post.append(header, image, caption); phone.querySelector('.screen').append(post);
    }
    (scene.notifications || []).forEach(item => {
      const card = document.createElement('div'); card.className = 'notification';
      const head = document.createElement('div'); head.className = 'notification-head';
      const icon = document.createElement('span'); icon.className = `app-icon ${item.color || 'sage'}`; icon.textContent = item.icon || '信';
      const sender = document.createElement('strong'); sender.textContent = item.sender;
      const now = document.createElement('span'); now.className = 'notification-time'; now.textContent = '現在';
      const message = document.createElement('div'); message.className = 'message'; message.textContent = item.message;
      head.append(icon, sender, now); card.append(head, message); phone.querySelector('.notifications').append(card); cards.push(card);
    });
    layer.append(phone);
  }
  let caption = null;
  if (scene.caption) { caption = document.createElement('div'); caption.className = 'scene-caption'; caption.textContent = scene.caption; layer.append(caption); }
  const fade = document.createElement('div'); fade.className = 'blackout'; layer.append(fade);
  root.append(layer);
  return { layer, phone, cards, caption };
}
manager.subscribe(value => { state = value; if (currentIndex !== value.index || currentRun !== value.runId) { currentIndex = value.index; currentRun = value.runId; const scene = scenes[currentIndex]; view = build(scene); audio.load(scene); } });
function frame() {
  const scene = scenes[state.index];
  if (scene && view) {
    const time = Math.min(elapsed(state), scene.duration), { layer, phone, cards, caption } = view;
    layer.style.setProperty('--darkness', String(scene.dim || 0));
    layer.style.setProperty('--fade', scene.fadeAt == null ? '0' : String(Math.min(1, Math.max(0, (time - scene.fadeAt) / scene.fadeDuration))));
    layer.style.setProperty('--entrance', String(Math.min(1, time / scene.transitionIn)));
    layer.classList.toggle('paused', !state.playing || time >= scene.duration);
    if (caption) caption.classList.toggle('visible', time >= scene.captionAt);
    if (phone) {
      const notes = scene.notifications || [];
      const count = notes.filter(n => time >= n.at).length;
      phone.classList.toggle('lit', time >= 1); phone.classList.toggle('show-social', scene.type === 'social' && time >= 1.8);
      cards.forEach((card, i) => {
        const age = count - 1 - i; card.classList.toggle('visible', age >= 0 && age < 4);
        card.style.setProperty('--order', Math.max(0, age)); card.style.zIndex = String(i + 1);
      });
      const lastAt = count ? notes[count - 1].at : -10;
      phone.classList.toggle('vibrate', state.playing && time < scene.duration && time - lastAt < .48);
    }
    audio.update(time, state.playing && time < scene.duration, state.black);
  } else audio.update(0, false, true);
  root.classList.toggle('manual-black', state.black);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
if (!preview) window.addEventListener('keydown', event => {
  if (event.key.toLowerCase() === 'f') { event.preventDefault(); if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {}); }
});

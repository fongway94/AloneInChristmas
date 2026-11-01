import { SceneManager, scenes, elapsed } from './sceneManager.js';
import { AudioManager } from './audioManager.js';
const manager = new SceneManager();
const preview = new URLSearchParams(location.search).has('preview');
const audio = new AudioManager(preview);
const root = document.querySelector('#stage');
let currentIndex = null, cards = [], state;
function build(scene) {
  root.innerHTML = '';
  cards = [];
  if (!scene) return;
  const environment = document.createElement('div'); environment.className = 'environment'; environment.style.backgroundImage = `url("${scene.background}")`;
  root.append(environment);
  const haze = document.createElement('div'); haze.className = 'atmosphere'; root.append(haze);
  const phone = document.createElement('div'); phone.className = 'phone';
  phone.innerHTML = `<div class="phone-edge"><div class="screen"><div class="wallpaper"></div><div class="status"><span>${scene.clock}</span><span class="status-icons"><span>◢</span><span>◕</span><span class="battery"></span></span></div><div class="island"></div><div class="lock"><div class="lock-icon">⌁</div><div class="date"></div><div class="clock"></div></div><div class="notifications"></div><div class="phone-bottom"><span class="bottom-button">◉</span><span class="bottom-button camera">◉</span></div><div class="home-bar"></div></div></div>`;
  phone.querySelector('.date').textContent = scene.date; phone.querySelector('.clock').textContent = scene.clock;
  const list = phone.querySelector('.notifications');
  scene.notifications.forEach((item, i) => {
    const card = document.createElement('div'); card.className = 'notification';
    const head = document.createElement('div'); head.className = 'notification-head';
    const icon = document.createElement('span'); icon.className = `app-icon ${item.color || 'sage'}`; icon.textContent = item.icon || '信';
    const sender = document.createElement('strong'); sender.textContent = item.sender;
    const now = document.createElement('span'); now.className = 'notification-time'; now.textContent = '现在';
    const message = document.createElement('div'); message.className = 'message'; message.textContent = item.message;
    head.append(icon, sender, now); card.append(head, message); list.append(card); cards.push(card);
  });
  root.append(phone);
  const blackout = document.createElement('div'); blackout.className = 'blackout'; root.append(blackout);
}
manager.subscribe(value => { state = value; if (currentIndex !== value.index) { currentIndex = value.index; const scene = scenes[currentIndex]; build(scene); audio.load(scene); } });
function frame() {
  const scene = scenes[state.index];
  if (scene) {
    const time = Math.min(elapsed(state), scene.duration), phone = root.querySelector('.phone');
    const count = scene.notifications.filter(n => time >= n.at).length;
    const frozen = time >= scene.freezeAt;
    root.style.setProperty('--darkness', Math.min(.54, Math.max(0, (time - 10) / 55)).toString());
    root.style.setProperty('--fade', state.black ? '1' : String(Math.min(1, Math.max(0, (time - scene.fadeAt) / scene.fadeDuration))));
    root.style.setProperty('--entrance', String(Math.min(1, time / scene.transitionIn)));
    phone.classList.toggle('lit', time >= 2); phone.classList.toggle('frozen', frozen || !state.playing);
    // Only the newest cards are fully visible; older cards compress into a believable stack.
    cards.forEach((card, i) => {
      const age = count - 1 - i;
      const visible = age >= 0 && age < 4;
      card.classList.toggle('visible', visible);
      card.style.setProperty('--order', Math.max(0, age));
      card.style.zIndex = String(i + 1);
    });
    const lastAt = count ? scene.notifications[count - 1].at : -10;
    phone.classList.toggle('vibrate', !frozen && state.playing && time - lastAt < .48);
    audio.update(time, state.playing && time < scene.duration, state.black);
  } else { root.style.setProperty('--fade', '1'); audio.update(0, false, true); }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
if (!preview) window.addEventListener('keydown', event => {
  if (event.key.toLowerCase() === 'f') { event.preventDefault(); if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {}); }
});

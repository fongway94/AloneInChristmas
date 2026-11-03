import { SceneManager, scenes, elapsed } from './sceneManager.js';
import { AudioManager } from './audioManager.js';
import { createAtmosphere } from './atmosphere.js';
import { notificationClock, socialPosition } from './phoneTimeline.js';
const manager = new SceneManager();
const preview = new URLSearchParams(location.search).has('preview');
const audio = new AudioManager(preview);
// 提前载入图片，降低现场切换时等待解码的机率。
const preloaded = [...new Set(scenes.flatMap(scene => [scene.background, scene.overlayBackground, ...(scene.posts || []).map(post => post.photo)]).filter(Boolean))].map(src => { const image = new Image(); image.src = src; return image; });
const root = document.querySelector('#stage');
let currentIndex = null, currentRun = null, view = null, state;
// 所有图标均为本地线条图形，界面是演出模拟，不连接任何社交平台。
const socialIcons = {
  heart: '<path d="M20.8 4.8a5.4 5.4 0 0 0-7.6 0L12 6l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.6a5.4 5.4 0 0 0 0-7.6Z"/>',
  message: '<path d="M21 11.5c0 4.7-4 8.5-9 8.5-1 0-2-.2-2.9-.5L5 21l.5-3.5A8.1 8.1 0 0 1 3 11.5C3 6.8 7 3 12 3s9 3.8 9 8.5Z"/><path d="m8 13 3.2-3.2 2.1 2 2.7-2.1"/>',
  comment: '<path d="M21 11.5c0 4.7-4 8.5-9 8.5-1.2 0-2.2-.2-3.2-.6L4.4 21l.7-4A8 8 0 0 1 3 11.5C3 6.8 7 3 12 3s9 3.8 9 8.5Z"/>',
  send: '<path d="m22 3-8.5 18-3-7-7-3L22 3Z"/><path d="m10.5 14 5-5"/>',
  bookmark: '<path d="M5 3h14v18l-7-4-7 4V3Z"/>',
  home: '<path d="m3 10 9-7 9 7v10h-6v-6H9v6H3V10Z"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',
  add: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/>',
  reels: '<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M8 5l3 5m3-5 3 5m-7 3 5 2.5-5 2.5v-5Z"/>',
  profile: '<circle cx="12" cy="8" r="3.5"/><path d="M5 21c.4-4.2 2.8-6.3 7-6.3s6.6 2.1 7 6.3"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>'
};
function socialIcon(name) {
  const span = document.createElement('span'); span.className = 'ig-icon'; span.setAttribute('aria-hidden', 'true');
  span.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${socialIcons[name]}</svg>`;
  return span;
}
function socialAvatar(photo, label) {
  const ring = document.createElement('span'); ring.className = 'ig-avatar';
  const image = document.createElement('img'); image.src = photo; image.alt = ''; ring.append(image);
  ring.setAttribute('aria-label', label); return ring;
}

function build(scene) {
  const previous = root.querySelector('.scene-layer:not(.leaving)');
  if (previous) { previous.classList.add('leaving'); setTimeout(() => previous.remove(), 1500); }
  if (!scene) return null;
  const layer = document.createElement('div'); layer.className = `scene-layer scene-${scene.type}`;
  const environment = document.createElement('div'); environment.className = 'environment'; environment.style.backgroundImage = `url("${scene.background}")`;
  layer.append(environment);
  let lightReveal = null;
  if (scene.overlayBackground) { lightReveal = document.createElement('div'); lightReveal.className = 'light-reveal'; lightReveal.style.backgroundImage = `url("${scene.overlayBackground}")`; layer.append(lightReveal); }
  const warmGlow = document.createElement('div'); warmGlow.className = 'warm-glow'; warmGlow.style.opacity = String(scene.warmth || 0); layer.append(warmGlow);
  const haze = document.createElement('div'); haze.className = 'atmosphere'; layer.append(haze);
  const motionCanvas = document.createElement('canvas'); motionCanvas.className = 'motion-canvas'; motionCanvas.setAttribute('aria-hidden', 'true'); layer.append(motionCanvas);
  const motion = createAtmosphere(motionCanvas, scene.motion);
  let phone = null; const cards = [];
  if (['phone', 'social', 'draft', 'chat', 'call'].includes(scene.type)) {
    phone = document.createElement('div'); phone.className = `phone phone-${scene.type}`;
    phone.innerHTML = `<div class="phone-edge"><div class="screen"><div class="wallpaper"></div><div class="status"><span></span><span class="status-icons"><span>◢</span><span>◕</span><span class="battery"></span></span></div><div class="island"></div><div class="lock"><div class="lock-icon">⌁</div><div class="date"></div><div class="clock"></div></div><div class="notifications"></div><div class="phone-bottom"><span class="bottom-button">◉</span><span class="bottom-button camera">◉</span></div><div class="home-bar"></div></div></div>`;
    phone.querySelector('.status > span').textContent = scene.clock; phone.querySelector('.date').textContent = scene.date; phone.querySelector('.clock').textContent = scene.clock;
    if (scene.type === 'social') {
      const social = document.createElement('div'); social.className = 'social-post';
      const header = document.createElement('div'); header.className = 'social-header';
      const brand = document.createElement('span'); brand.className = 'ig-brand'; brand.textContent = 'Instagram';
      const headerActions = document.createElement('span'); headerActions.className = 'ig-header-actions';
      headerActions.append(socialIcon('heart'), socialIcon('message')); header.append(brand, socialIcon('chevron'), headerActions);
      const stories = document.createElement('div'); stories.className = 'ig-stories';
      scene.posts.forEach(item => {
        const story = document.createElement('div'); story.className = 'ig-story';
        const label = document.createElement('span'); label.className = 'ig-story-label'; label.textContent = item.author;
        story.append(socialAvatar(item.photo, item.author), label); stories.append(story);
      });
      const viewport = document.createElement('div'); viewport.className = 'social-viewport';
      const feed = document.createElement('div'); feed.className = 'social-feed';
      scene.posts.forEach(item => {
        const post = document.createElement('article'); post.className = 'social-card';
        const author = document.createElement('div'); author.className = 'social-author';
        const authorName = document.createElement('strong'); authorName.textContent = item.author;
        const more = document.createElement('span'); more.className = 'ig-more'; more.textContent = '···'; more.setAttribute('aria-hidden', 'true');
        author.append(socialAvatar(item.photo, item.author), authorName, more);
        const image = document.createElement('img'); image.className = 'ig-photo'; image.src = item.photo; image.alt = item.author + '的聚会照片';
        const actions = document.createElement('div'); actions.className = 'social-actions';
        actions.append(socialIcon('heart'), socialIcon('comment'), socialIcon('send'));
        const bookmark = socialIcon('bookmark'); bookmark.classList.add('ig-save'); actions.append(bookmark);
        const likes = document.createElement('div'); likes.className = 'ig-likes'; likes.textContent = item.likes || '其他人赞过';
        const caption = document.createElement('div'); caption.className = 'social-caption';
        const captionAuthor = document.createElement('strong'); captionAuthor.textContent = item.author;
        caption.append(captionAuthor, document.createTextNode('  ' + item.caption));
        const age = document.createElement('div'); age.className = 'ig-age'; age.textContent = item.age || '';
        post.append(author, image, actions, likes, caption, age); feed.append(post);
      });
      viewport.append(feed);
      const nav = document.createElement('div'); nav.className = 'ig-nav'; nav.setAttribute('aria-hidden', 'true');
      ['home', 'search', 'add', 'reels', 'profile'].forEach(icon => nav.append(socialIcon(icon)));
      social.append(header, stories, viewport, nav); phone.querySelector('.screen').append(social);
    }
    if (scene.type === 'draft') {
      const draftView = document.createElement('div'); draftView.className = 'draft-view';
      draftView.innerHTML = '<div class="phone-view-header">‹　朋友</div><div class="draft-date">今天</div><div class="draft-input"><span class="draft-text"></span><span class="draft-cursor"></span></div>';
      phone.querySelector('.screen').append(draftView);
    }
    if (scene.type === 'chat') {
      const chatView = document.createElement('div'); chatView.className = 'chat-view';
      const header = document.createElement('div'); header.className = 'phone-view-header'; header.textContent = `‹　${scene.chatTitle}`;
      const app = document.createElement('small'); app.className = 'chat-app'; app.textContent = 'WhatsApp'; header.append(app); chatView.append(header);
      const feed = document.createElement('div'); feed.className = 'chat-feed';
      scene.messages.forEach(item => {
        const bubble = document.createElement('div'); bubble.className = 'chat-bubble';
        const sender = document.createElement('strong'); sender.textContent = item.sender;
        const text = document.createElement('span');
        // 以本地图示呈现指定表情，避免演出电脑缺少彩色表情字型时显示方框。
        if (item.message.includes('🎄❤️')) {
          const [before, after] = item.message.split('🎄❤️'); text.append(document.createTextNode(before));
          [['assets/icons/tree.svg', '圣诞树'], ['assets/icons/heart.svg', '爱心']].forEach(([src, alt]) => { const icon = document.createElement('img'); icon.className = 'emoji-icon'; icon.src = src; icon.alt = alt; text.append(icon); });
          text.append(document.createTextNode(after || ''));
        } else text.textContent = item.message;
        bubble.append(sender, text); feed.append(bubble);
      });
      chatView.append(feed); const input = document.createElement('div'); input.className = 'chat-input'; input.textContent = '讯息'; chatView.append(input);
      phone.querySelector('.screen').append(chatView);
    }
    if (scene.type === 'call') {
      const call = document.createElement('div'); call.className = 'call-view';
      const label = document.createElement('div'); label.className = 'call-status'; label.textContent = '来电';
      const caller = document.createElement('div'); caller.className = 'call-name'; caller.textContent = scene.caller;
      const hint = document.createElement('div'); hint.className = 'call-hint'; hint.textContent = '电话响起';
      const accept = document.createElement('div'); accept.className = 'call-accept'; accept.textContent = '☎';
      call.append(label, caller, hint, accept); phone.querySelector('.screen').append(call);
    }
    (scene.notifications || []).forEach(item => {
      const card = document.createElement('div'); card.className = 'notification';
      const head = document.createElement('div'); head.className = 'notification-head';
      const icon = document.createElement('span'); icon.className = `app-icon ${item.color || 'sage'}`; icon.textContent = item.icon || '信';
      const sender = document.createElement('strong'); sender.textContent = item.sender;
      const now = document.createElement('span'); now.className = 'notification-time'; now.textContent = item.receivedAt || '现在';
      const message = document.createElement('div'); message.className = 'message'; message.textContent = item.message;
      head.append(icon, sender, now); card.append(head, message); phone.querySelector('.notifications').append(card); cards.push(card);
    });
    layer.append(phone);
  }
  let caption = null;
  if (scene.caption) { caption = document.createElement('div'); caption.className = 'scene-caption'; caption.classList.toggle('short', Array.from(scene.caption).length <= 12); caption.textContent = scene.caption; layer.append(caption); }
  const fade = document.createElement('div'); fade.className = 'blackout'; layer.append(fade);
  root.append(layer);
  return { layer, phone, cards, caption, motion, lightReveal, motionFrame: null };
}
manager.subscribe(value => { state = value; if (currentIndex !== value.index || currentRun !== value.runId) { currentIndex = value.index; currentRun = value.runId; const scene = scenes[currentIndex]; view = build(scene); audio.load(scene); } });
function frame() {
  const scene = scenes[state.index];
  if (scene && view) {
    const rawTime = elapsed(state), time = Math.min(rawTime, scene.duration), { layer, phone, cards, caption, motion } = view;
    const fullyFaded = scene.fadeAt != null && time >= scene.fadeAt + scene.fadeDuration;
    // 背景持续微动直到操作员推进；暂停时以同一个时间点冻结。
    const motionFrame = Math.floor(rawTime * 24);
    if (!state.black && !fullyFaded && view.motionFrame !== motionFrame) {
      motion.draw(rawTime); view.motionFrame = motionFrame;
    }
    if (!state.black && !fullyFaded) {
      const drift = (1 - Math.cos(rawTime * Math.PI / 48)) / 2;
      const embraceApproach = scene.motion.preset === 'embrace' ? .025 * (1 - Math.exp(-rawTime / 6)) : 0;
      layer.style.setProperty('--room-scale', String(1.025 + drift * .04 + embraceApproach));
    }
    layer.style.setProperty('--darkness', String(scene.dim || 0));
    layer.style.setProperty('--fade', scene.fadeAt == null ? '0' : String(Math.min(1, Math.max(0, (time - scene.fadeAt) / scene.fadeDuration))));
    const entrance = Math.min(1, time / scene.transitionIn);
    layer.style.setProperty('--entrance', String(entrance));
    if (view.lightReveal) { const reveal = Math.max(0, Math.min(1, (time - (scene.lightAt || 0)) / (scene.lightDuration || 5))); view.lightReveal.style.opacity = String(entrance * reveal); }
    layer.classList.toggle('paused', !state.playing || state.black || fullyFaded);
    if (caption) caption.classList.toggle('visible', time >= scene.captionAt);
    if (phone) {
      const notes = scene.notifications || [];
      const count = notes.filter(n => time >= n.at).length;
      const clock = notificationClock(scene.clock, notes, time);
      phone.querySelector('.status > span').textContent = clock; phone.querySelector('.clock').textContent = clock;
      if (scene.type === 'social') phone.querySelector('.social-feed').style.transform = `translateY(${-100 * socialPosition(scene.posts, time)}%)`;
      phone.classList.toggle('lit', time >= 1); phone.classList.toggle('show-social', scene.type === 'social' && time >= (scene.posts[0]?.at ?? 1.8));
      phone.classList.toggle('show-interface', time >= 1.4);
      if (scene.type === 'chat') phone.querySelectorAll('.chat-bubble').forEach((bubble, i) => bubble.classList.toggle('visible', time >= scene.messages[i].at));
      if (scene.type === 'draft') {
        const chars = Array.from(scene.draft), typed = Math.min(chars.length, Math.max(0, Math.floor((time - 2) * 4)));
        const deleted = Math.max(0, Math.floor((time - 8) * 5));
        phone.querySelector('.draft-text').textContent = chars.slice(0, Math.max(0, typed - deleted)).join('');
      }
      cards.forEach((card, i) => {
        const age = count - 1 - i; card.classList.toggle('visible', age >= 0 && age < 2);
        card.style.setProperty('--order', Math.max(0, age)); card.style.zIndex = String(i + 1);
      });
      const lastAt = count ? notes[count - 1].at : -10;
      phone.classList.toggle('vibrate', state.playing && time < scene.duration && time - lastAt < .48);
    }
    audio.update(rawTime, state.playing && !fullyFaded, state.black || state.muted, state.volume ?? 1, { music: state.musicVolume ?? 1, effects: state.effectsVolume ?? 1, voice: state.voiceVolume ?? 1 });
  } else audio.update(0, false, true);
  root.classList.toggle('manual-black', state.black);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
// 移动浏览器通常要求 play() 直接发生在舞台页面的触摸手势内。
// 操作台预览始终静音；舞台画面不添加任何可见按钮或边框。
if (!preview) window.addEventListener('pointerdown', () => {
  const scene = scenes[state.index];
  if (!scene) return;
  const time = elapsed(state);
  const fullyFaded = scene.fadeAt != null && time >= scene.fadeAt + scene.fadeDuration;
  audio.update(time, state.playing && !fullyFaded, state.black || state.muted, state.volume ?? 1,
    { music: state.musicVolume ?? 1, effects: state.effectsVolume ?? 1, voice: state.voiceVolume ?? 1 }, true);
});
if (!preview) window.addEventListener('keydown', event => {
  if (event.key.toLowerCase() === 'f') { event.preventDefault(); if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {}); }
});

import actOne from './scene01.js';
import actTwo from './scene02.js';
import actThree from './scene03.js';
import actFour from './scene04.js';
// 調整這裡的順序即可重新排列各幕。
const all = [...actOne, ...actTwo, ...actThree, ...actFour];
// 預設依背景選擇動態，也可在個別場景以 motion 覆蓋。
function defaultMotion(scene) {
  if (scene.background.includes('bills-table')) return { preset: 'rain-left', intensity: .85 };
  if (scene.background.includes('bedroom-cold')) return { preset: 'rain-right', intensity: scene.dim ? .65 : 1 };
  if (scene.background.includes('bench-evening')) return { preset: 'bench', intensity: .65 + (scene.warmth || 0) * .5 };
  return { preset: 'street', intensity: .8 };
}
export const scenes = all.map(scene => ({ ...scene, motion: scene.motion || defaultMotion(scene) }));

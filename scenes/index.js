import actOne from './scene01.js';
import actTwo from './scene02.js';
import actThree from './scene03.js';
import actFour from './scene04.js';
import actFive from './scene05.js';
import actSix from './scene06.js';
import actSeven from './scene07.js';
import actEight from './scene08.js';
import actNine from './scene09.js';
import { withAudio } from './audioPlan.js?v=audio2';
const all = [...actOne, ...actTwo, ...actThree, ...actFour, ...actFive, ...actSix, ...actSeven, ...actEight, ...actNine];
function defaultMotion(scene) {
  if (scene.background.includes('penang-bills')) return { preset: 'rain-left', intensity: .85 };
  if (scene.background.includes('penang-bedroom')) return { preset: 'rain-right', intensity: scene.dim ? .65 : 1 };
  if (scene.background.includes('penang-bench')) return { preset: 'bench', intensity: .65 + (scene.warmth || 0) * .5 };
  return { preset: 'street', intensity: .8 };
}
export const scenes = all.map(scene => withAudio({ ...scene, motion: scene.motion || defaultMotion(scene) }));

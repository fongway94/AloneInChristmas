import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const html = readFileSync('archive/16-cue/index.html', 'utf8');
assert.ok(html.includes('历史参考') && html.includes('不是现行演出画面'));
const source = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(source, '历史版本应保留独立脚本');
function element() { return { style:{}, classList:{toggle() {}}, firstElementChild:{style:{}}, addEventListener() {}, appendChild() {}, closest() { return null; }, querySelector() { return element(); }, textContent:'', innerHTML:'', value:'', onclick:null, onchange:null }; }
const elements = new Map();
const doc = { getElementById(id) { if (!elements.has(id)) elements.set(id, element()); return elements.get(id); }, createElement() { return element(); }, querySelector() { return element(); }, querySelectorAll() { return []; }, addEventListener() {}, documentElement: {} };
class FakeContext {
  constructor() { this.currentTime=0; this.destination={}; }
  createOscillator() { return {frequency:{value:0},connect(target) {return target;},start() {},stop() {}}; }
  createGain() { return {gain:{setValueAtTime() {},linearRampToValueAtTime() {},exponentialRampToValueAtTime() {}},connect() {}}; }
}
const env = vm.createContext({document:doc,window:{AudioContext:FakeContext},setTimeout:()=>1,clearTimeout:()=>{},Math,console});
vm.runInContext(source,env);
assert.equal(vm.runInContext('FLAT.length',env),16);
for (let i=0;i<16;i++) vm.runInContext(`idx=${i}; render()`,env);
assert.ok(readFileSync('SCRIPT.md','utf8').includes('历史参考，不是现行演出提示'));
console.log('旧版 16 提示点完整保留、可运行，且标明为历史参考。');

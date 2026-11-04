import { Game } from './game.js';
import { snapshotMenuFrame } from './input.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const game = new Game(ctx);

// setInterval rather than requestAnimationFrame: rAF fully stalls on a page the
// browser considers backgrounded/hidden (including automated/embedded preview
// panes), which would freeze the whole game; setInterval keeps a steady 60Hz
// tick regardless.
const STEP_MS = 1000 / 60;

setInterval(() => {
  game.update();
  snapshotMenuFrame();
  game.render();
}, STEP_MS);

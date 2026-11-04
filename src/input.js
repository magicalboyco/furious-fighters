// Keyboard state + per-player directional/button history for motion-input specials.

const keysDown = new Set();

window.addEventListener('keydown', (e) => keysDown.add(e.code));
window.addEventListener('keyup', (e) => keysDown.delete(e.code));

// Menu-level helpers (title / character-select screens), independent of the
// in-fight InputState used for motion-input specials.
let prevFrameKeys = new Set();
export function isKeyDown(code) { return keysDown.has(code); }
export function justPressedKey(code) { return keysDown.has(code) && !prevFrameKeys.has(code); }
export function snapshotMenuFrame() { prevFrameKeys = new Set(keysDown); }

export const CONTROLS = {
  p1: {
    left: 'KeyA', right: 'KeyD', up: 'KeyW', down: 'KeyS',
    lp: 'KeyU', hp: 'KeyI', lk: 'KeyJ', hk: 'KeyK',
  },
  p2: {
    left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', down: 'ArrowDown',
    lp: 'Numpad7', hp: 'Numpad8', lk: 'Numpad4', hk: 'Numpad5',
  },
};

// Numpad notation for a direction, relative to the fighter's facing (facing: 1 = right, -1 = left).
function directionCode(up, down, left, right, facing) {
  const fwd = facing === 1 ? right : left;
  const back = facing === 1 ? left : right;
  if (up && fwd) return 9;
  if (up && back) return 7;
  if (down && fwd) return 3;
  if (down && back) return 1;
  if (up) return 8;
  if (down) return 2;
  if (fwd) return 6;
  if (back) return 4;
  return 5;
}

export class InputState {
  constructor(controls) {
    this.controls = controls;
    this.history = []; // { dir, buttons:Set, frame }
    this.frame = 0;
    this.prevButtons = new Set();
  }

  raw() {
    const c = this.controls;
    return {
      up: keysDown.has(c.up), down: keysDown.has(c.down),
      left: keysDown.has(c.left), right: keysDown.has(c.right),
      lp: keysDown.has(c.lp), hp: keysDown.has(c.hp),
      lk: keysDown.has(c.lk), hk: keysDown.has(c.hk),
    };
  }

  // Call once per logic frame. facing: 1 right, -1 left.
  update(facing) {
    this.frame++;
    const r = this.raw();
    const dir = directionCode(r.up, r.down, r.left, r.right, facing);
    const buttons = new Set();
    if (r.lp) buttons.add('lp');
    if (r.hp) buttons.add('hp');
    if (r.lk) buttons.add('lk');
    if (r.hk) buttons.add('hk');

    const justPressed = new Set();
    for (const b of buttons) if (!this.prevButtons.has(b)) justPressed.add(b);
    this.prevButtons = buttons;

    this.history.push({ dir, buttons, justPressed, frame: this.frame });
    if (this.history.length > 40) this.history.shift();

    return { dir, buttons, justPressed, raw: r };
  }

  // Did the direction sequence appear (in order, allowing extra frames between) within the
  // last `window` frames, with one of `finishButtons` just-pressed on/after the final direction?
  matchesMotion(sequence, finishButtons, window = 18) {
    const h = this.history;
    if (h.length === 0) return null;
    const cutoff = this.frame - window;
    let seqIdx = 0;
    let matchFrame = -1;
    for (const entry of h) {
      if (entry.frame < cutoff) continue;
      if (seqIdx < sequence.length && entry.dir === sequence[seqIdx]) {
        seqIdx++;
        matchFrame = entry.frame;
      }
    }
    if (seqIdx < sequence.length) return null;
    // Find a just-pressed finishing button at or after the sequence completed.
    for (let i = h.length - 1; i >= 0; i--) {
      const entry = h[i];
      if (entry.frame < matchFrame) break;
      for (const b of finishButtons) if (entry.justPressed.has(b)) return b;
    }
    return null;
  }

  // Charge motion: held `holdDir` for at least `minHold` frames, then pressed `releaseDir`,
  // with one of `finishButtons` just-pressed within `window` frames of the release.
  matchesCharge(holdDir, releaseDir, finishButtons, minHold = 35, window = 12) {
    const h = this.history;
    if (h.length === 0) return null;
    let holdFrames = 0;
    let releaseIdx = -1;
    for (let i = 0; i < h.length; i++) {
      if (h[i].dir === holdDir) {
        holdFrames++;
      } else {
        if (holdFrames >= minHold && h[i].dir === releaseDir) {
          releaseIdx = i;
          break;
        }
        if (h[i].dir !== releaseDir) holdFrames = 0;
      }
    }
    if (releaseIdx === -1) return null;
    const releaseFrame = h[releaseIdx].frame;
    for (let i = h.length - 1; i >= 0; i--) {
      const entry = h[i];
      if (entry.frame < releaseFrame) break;
      if (entry.frame - releaseFrame > window) continue;
      for (const b of finishButtons) if (entry.justPressed.has(b)) return b;
    }
    return null;
  }
}

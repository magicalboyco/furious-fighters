// Character roster data: stats, normals, and special-move motions.
// Numpad notation (facing-relative): 1=down-back 2=down 3=down-fwd 4=back 6=fwd 7=up-back 8=up 9=up-fwd

const NORMAL_TEMPLATE = {
  lp: { dmg: 4, startup: 3, active: 3, recovery: 6, hitstun: 10, blockstun: 7, range: 55, high: true },
  hp: { dmg: 9, startup: 7, active: 4, recovery: 14, hitstun: 16, blockstun: 11, range: 60, high: true },
  lk: { dmg: 5, startup: 4, active: 3, recovery: 8, hitstun: 11, blockstun: 8, range: 58, high: false },
  hk: { dmg: 10, startup: 9, active: 4, recovery: 16, hitstun: 18, blockstun: 12, range: 65, high: false },
};

function normals(overrides = {}) {
  const out = {};
  for (const key of Object.keys(NORMAL_TEMPLATE)) {
    out[key] = { ...NORMAL_TEMPLATE[key], ...(overrides[key] || {}) };
  }
  return out;
}

export const ROSTER = [
  {
    id: 'kaida',
    name: 'KAIDA',
    color: '#ff5050',
    accent: '#ffb3b3',
    walkSpeed: 3.2,
    jumpPower: 11.5,
    maxHealth: 100,
    normals: normals(),
    specials: [
      {
        name: 'Flame Wave',
        motion: { type: 'motion', sequence: [2, 3, 6], buttons: ['lp', 'hp'] },
        kind: 'projectile',
        dmg: 8, startup: 10, recovery: 20,
        projectileSpeed: 6.5, projectileLife: 90,
      },
      {
        name: 'Rising Talon',
        motion: { type: 'motion', sequence: [6, 2, 3], buttons: ['lp', 'hp'] },
        kind: 'uppercut',
        dmg: 13, startup: 4, active: 10, recovery: 22,
        vy: -10, vx: 2.5, invulnFrames: 8,
      },
    ],
  },
  {
    id: 'maddox',
    name: 'SGT. MADDOX',
    color: '#4da6ff',
    accent: '#c2e0ff',
    walkSpeed: 2.8,
    jumpPower: 11,
    maxHealth: 105,
    normals: normals({ hp: { dmg: 10, range: 65 } }),
    specials: [
      {
        name: 'Sonic Barrage',
        motion: { type: 'charge', holdDir: 4, releaseDir: 6, buttons: ['lp', 'hp'] },
        kind: 'projectile',
        dmg: 7, startup: 8, recovery: 18,
        projectileSpeed: 8, projectileLife: 80,
      },
      {
        name: 'Rocket Knee',
        motion: { type: 'charge', holdDir: 2, releaseDir: 8, buttons: ['lk', 'hk'] },
        kind: 'uppercut',
        dmg: 11, startup: 5, active: 12, recovery: 24,
        vy: -11, vx: 1.5, invulnFrames: 10,
      },
    ],
  },
  {
    id: 'volkov',
    name: 'VOLKOV',
    color: '#66cc66',
    accent: '#c9f2c9',
    walkSpeed: 2.5,
    jumpPower: 10,
    maxHealth: 115,
    normals: normals({ hp: { dmg: 12, range: 50 }, hk: { dmg: 13, range: 55 } }),
    specials: [
      {
        name: 'Siberian Slam',
        motion: { type: 'motion', sequence: [4, 1, 2, 3, 6], buttons: ['lp', 'hp'] },
        kind: 'grab',
        dmg: 20, startup: 3, active: 4, recovery: 26,
        range: 50,
      },
    ],
  },
  {
    id: 'meilin',
    name: 'MEI LIN',
    color: '#ffcc33',
    accent: '#fff0bf',
    walkSpeed: 3.6,
    jumpPower: 12,
    maxHealth: 90,
    normals: normals({ lp: { startup: 2, recovery: 4 }, lk: { startup: 3, recovery: 5 } }),
    specials: [
      {
        name: 'Crane Sweep',
        motion: { type: 'motion', sequence: [2, 1, 4], buttons: ['lk', 'hk'] },
        kind: 'sweep',
        dmg: 9, startup: 6, active: 8, recovery: 20,
        vx: 5.5,
      },
    ],
  },
];

export function getCharacter(id) {
  return ROSTER.find((c) => c.id === id);
}

// To attach real art once you have original sprite sheets (e.g. from SpriteCook,
// or an atlas exported from Aseprite/TexturePacker), set `spriteSrc` + `spriteMeta`
// on a roster entry above, then load it in main.js:
//
//   import { SpriteSheet } from './sprite.js';
//   const kaida = getCharacter('kaida');
//   kaida.sprite = await SpriteSheet.load(kaida.spriteSrc, kaida.spriteMeta);
//
// Characters with no `sprite` set just render as the placeholder shapes.

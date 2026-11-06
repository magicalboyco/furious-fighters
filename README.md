# Furious Fighters

**Play:** https://magicalboyco.github.io/furious-fighters/ (served from `main` / root once Settings > Pages is set to deploy from a branch. Not verified live as of 2026-11-06.)

A browser-based 2D fighter in the spirit of classic arcade fighting games —
health bars, a round timer, best-of-3 matches, and motion-input special
moves — built with plain HTML5 Canvas and vanilla JavaScript. No build step,
no dependencies.

## Running it

```
python3 tools/dev-server.py
```

Then open http://localhost:8420 in a browser.

## Controls

| Action        | Player 1 | Player 2 |
|---------------|----------|----------|
| Move          | A / D    | ←/→      |
| Jump          | W        | ↑        |
| Crouch / Block low | S   | ↓        |
| Light Punch   | U        | Numpad 7 |
| Heavy Punch   | I        | Numpad 8 |
| Light Kick    | J        | Numpad 4 |
| Heavy Kick    | K        | Numpad 5 |

Hold back (away from your opponent) to block.

At the title screen, press any Punch to continue. On the character-select
screen, each player moves their cursor with left/right and locks in with
Light Punch.

## Roster

- **Kaida** — balanced all-rounder. Fireball (quarter-circle-forward +
  punch), anti-air uppercut (dragon-punch motion + punch).
- **Sgt. Maddox** — charge zoner. Charge back then forward + punch for a
  projectile; charge down then up + kick for a flash-kick-style anti-air.
- **Volkov** — grappler. Half-circle-forward + punch for an unblockable
  command grab.
- **Mei Lin** — rushdown. Fast normals; quarter-circle-back + kick for a
  spinning sweep.

## Project structure

- `src/input.js` — keyboard state and motion-input detection (quarter-circle,
  charge, half-circle) for specials.
- `src/characters.js` — roster data: stats, normals, specials.
- `src/fighter.js` — the `Fighter` state machine (movement, attacks,
  hit/block resolution).
- `src/combat.js` — hitbox/hurtbox collision and damage resolution between
  fighters and projectiles.
- `src/render.js` — canvas rendering (stage, fighters, HUD).
- `src/sprite.js` — optional sprite-sheet renderer; characters without a
  `sprite` assigned fall back to the placeholder shapes in `render.js`.
- `src/game.js` — the overall game/match state machine (title → select →
  fight → round end → match end).

## Adding real sprite art

Characters currently render as simple placeholder shapes. To swap in real
art once you have original sprite sheets (hand-drawn, commissioned, or
generated), see the comment at the bottom of `src/characters.js` for how to
attach a `SpriteSheet` to a roster entry.

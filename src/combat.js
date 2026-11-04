import { Projectile } from './fighter.js';

function overlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}

function resolveMelee(attacker, defender) {
  const a = attacker.action;
  if (!a || a.phase !== 'active' || attacker.hitThisAction) return;

  if (a.kind === 'grab') {
    const dist = Math.abs(attacker.x - defender.x);
    const facingRight = attacker.facing === 1 ? defender.x >= attacker.x : defender.x <= attacker.x;
    if (dist <= (a.data.range || 50) && facingRight && defender.state !== 'knockdown' && defender.invulnTimer === 0) {
      attacker.hitThisAction = true;
      defender.applyHit({
        dmg: a.data.dmg, pushback: attacker.facing * 4,
        hitstun: 30, blockstun: 0, launchY: -6,
      }, attacker, false);
    }
    return;
  }

  const hitbox = attacker.activeHitbox();
  if (!hitbox) return;
  if (!overlap(hitbox, defender.hurtbox())) return;

  attacker.hitThisAction = true;
  const blocked = defender.blocking && defender.state !== 'hitstun';
  defender.applyHit({
    dmg: a.data.dmg,
    pushback: attacker.facing * (blocked ? 2.5 : 4.5),
    hitstun: a.data.hitstun || 14,
    blockstun: a.data.blockstun || 9,
    launchY: a.kind === 'uppercut' ? -8 : 0,
  }, attacker, blocked);
}

export function resolveCombat(f1, f2, projectiles) {
  resolveMelee(f1, f2);
  resolveMelee(f2, f1);

  for (const f of [f1, f2]) {
    if (f.pendingProjectile) {
      const p = f.pendingProjectile;
      projectiles.push(new Projectile(p.x, p.y, p.vx, p.life, p.dmg, f, p.color));
      f.pendingProjectile = null;
    }
  }

  for (const proj of projectiles) {
    if (proj.dead) continue;
    proj.update();
    const target = proj.owner === f1 ? f2 : f1;
    if (overlap(proj.hurtbox(), target.hurtbox())) {
      proj.dead = true;
      const blocked = target.blocking;
      target.applyHit({
        dmg: proj.dmg,
        pushback: (proj.vx > 0 ? 1 : -1) * (blocked ? 2 : 3.5),
        hitstun: 16, blockstun: 10, launchY: 0,
      }, proj.owner, blocked);
    }
  }

  for (let i = projectiles.length - 1; i >= 0; i--) {
    if (projectiles[i].dead) projectiles.splice(i, 1);
  }

  // Simple push-apart so fighters don't overlap.
  const minDist = f1.width;
  const dist = f2.x - f1.x;
  if (Math.abs(dist) < minDist && f1.grounded && f2.grounded) {
    const overlapAmt = (minDist - Math.abs(dist)) / 2;
    const dir = dist >= 0 ? 1 : -1;
    f1.x -= dir * overlapAmt;
    f2.x += dir * overlapAmt;
  }
}

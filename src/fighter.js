import { InputState } from './input.js';

export const GRAVITY = 0.6;
export const GROUND_Y = 420;
export const STAGE_LEFT = 60;
export const STAGE_RIGHT = 900;
export const FIGHTER_W = 50;
export const FIGHTER_H = 120;
export const CROUCH_H = 85;

export class Projectile {
  constructor(x, y, vx, life, dmg, owner, color) {
    this.x = x; this.y = y; this.vx = vx; this.life = life;
    this.dmg = dmg; this.owner = owner; this.color = color;
    this.w = 24; this.h = 16;
    this.dead = false;
  }
  update() {
    this.x += this.vx;
    this.life--;
    if (this.life <= 0 || this.x < STAGE_LEFT - 40 || this.x > STAGE_RIGHT + 40) this.dead = true;
  }
  hurtbox() {
    return { x: this.x - this.w / 2, y: this.y - this.h / 2, w: this.w, h: this.h };
  }
}

export class Fighter {
  constructor(charData, controls, startX, facing, playerLabel) {
    this.char = charData;
    this.input = new InputState(controls);
    this.playerLabel = playerLabel;
    this.x = startX;
    this.y = GROUND_Y;
    this.vx = 0; this.vy = 0;
    this.facing = facing;
    this.health = charData.maxHealth;
    this.maxHealth = charData.maxHealth;
    this.roundWins = 0;
    this.state = 'idle';
    this.grounded = true;
    this.crouching = false;
    this.blocking = false;
    this.action = null; // { data, kind, phase, timer, name }
    this.hitThisAction = false;
    this.stunTimer = 0;
    this.invulnTimer = 0;
    this.koFlag = false;
    this.pendingProjectile = null;
    this.animTimer = 0;
    this._prevAnimKey = null;
  }

  get width() { return FIGHTER_W; }
  get height() { return this.crouching ? CROUCH_H : FIGHTER_H; }

  isActionable() {
    return this.state !== 'hitstun' && this.state !== 'blockstun' &&
           this.state !== 'knockdown' && this.state !== 'ko' && !this.action;
  }

  hurtbox() {
    const h = this.height;
    return { x: this.x - this.width / 2, y: this.y - h, w: this.width, h };
  }

  // Active hitbox for the current action, or null.
  activeHitbox() {
    if (!this.action || this.action.phase !== 'active') return null;
    const a = this.action;
    const reach = a.data.range || 55;
    const boxW = reach;
    const boxH = a.data.low ? 30 : 40;
    const boxY = a.data.low ? this.y - 30 : this.y - this.height + 30;
    const boxX = this.facing === 1 ? this.x : this.x - boxW;
    return { x: boxX, y: boxY, w: boxW, h: boxH };
  }

  startAction(name, data, kind) {
    this.action = { name, data, kind, phase: 'startup', timer: data.startup };
    this.hitThisAction = false;
    this.state = 'attack';
    if (data.invulnFrames) this.invulnTimer = data.invulnFrames;
  }

  applyHit({ dmg, pushback, hitstun, blockstun, launchY }, fromAttacker, blocked) {
    if (this.invulnTimer > 0) return false;
    if (blocked) {
      this.health -= Math.max(1, Math.round(dmg * 0.15));
      this.state = 'blockstun';
      this.stunTimer = blockstun;
    } else {
      this.health -= dmg;
      this.state = 'hitstun';
      this.stunTimer = hitstun;
      if (launchY) this.vy = launchY;
    }
    this.action = null;
    this.vx = pushback;
    if (this.health <= 0) {
      this.health = 0;
      this.koFlag = true;
      this.state = 'knockdown';
      this.stunTimer = 60;
    }
    return true;
  }

  update(opponent) {
    this.invulnTimer = Math.max(0, this.invulnTimer - 1);

    const animKey = this.action ? `action:${this.action.name}` : `state:${this.state}`;
    if (animKey !== this._prevAnimKey) { this.animTimer = 0; this._prevAnimKey = animKey; }
    else this.animTimer++;

    // Facing: track opponent unless mid-action/stunned.
    if (this.isActionable() || this.state === 'walk' || this.state === 'idle') {
      this.facing = opponent.x >= this.x ? 1 : -1;
    }

    const input = this.input.update(this.facing);

    if (this.state === 'hitstun' || this.state === 'blockstun') {
      this.stunTimer--;
      if (this.stunTimer <= 0) { this.state = 'idle'; }
    } else if (this.state === 'knockdown') {
      this.stunTimer--;
      if (this.stunTimer <= 0 && !this.koFlag) this.state = 'idle';
    } else if (this.action) {
      this.stepAction(input);
    } else {
      this.stepFree(input);
    }

    // Physics
    this.x += this.vx;
    this.vx *= this.grounded ? 0.75 : 0.98;
    if (Math.abs(this.vx) < 0.05) this.vx = 0;

    if (!this.grounded || this.vy !== 0) {
      this.vy += GRAVITY;
      this.y += this.vy;
      if (this.y >= GROUND_Y) {
        this.y = GROUND_Y;
        this.vy = 0;
        this.grounded = true;
        if (this.state === 'jump') this.state = 'idle';
      } else {
        this.grounded = false;
      }
    }

    this.x = Math.max(STAGE_LEFT, Math.min(STAGE_RIGHT, this.x));
  }

  stepFree(input) {
    this.crouching = false;
    this.blocking = false;

    if (!this.grounded) {
      this.state = 'jump';
      return;
    }

    // Special motions (checked before normals; grounded only).
    for (const sp of this.char.specials) {
      const hit = this.tryMotion(sp, input);
      if (hit) {
        this.triggerSpecial(sp, hit);
        return;
      }
    }

    // Normals.
    for (const [btn, data] of Object.entries(this.char.normals)) {
      if (input.justPressed.has(btn)) {
        this.startAction(btn.toUpperCase(), { ...data, low: btn === 'lk' || btn === 'hk' ? data.low : false }, 'normal');
        return;
      }
    }

    const holdingBack = (this.facing === 1 && input.raw.left) || (this.facing === -1 && input.raw.right);
    const holdingFwd = (this.facing === 1 && input.raw.right) || (this.facing === -1 && input.raw.left);

    if (input.raw.up) {
      this.vy = -this.char.jumpPower;
      this.grounded = false;
      this.state = 'jump';
      this.vx = holdingFwd ? this.facing * this.char.walkSpeed : holdingBack ? -this.facing * this.char.walkSpeed : 0;
      return;
    }

    if (input.raw.down) {
      this.crouching = true;
      this.state = 'crouch';
      this.blocking = holdingBack;
      return;
    }

    if (holdingBack) {
      this.blocking = true;
      this.vx = -this.facing * this.char.walkSpeed * 0.9;
      this.state = 'walk';
      return;
    }

    if (holdingFwd) {
      this.vx = this.facing * this.char.walkSpeed;
      this.state = 'walk';
      return;
    }

    this.state = 'idle';
  }

  tryMotion(sp, input) {
    const m = sp.motion;
    if (m.type === 'motion') return this.input.matchesMotion(m.sequence, m.buttons);
    if (m.type === 'charge') return this.input.matchesCharge(m.holdDir, m.releaseDir, m.buttons);
    return null;
  }

  triggerSpecial(sp, button) {
    const heavy = button === 'hp' || button === 'hk';
    const dmg = heavy ? sp.dmg + 2 : sp.dmg;
    this.startAction(sp.name, { ...sp, dmg, range: sp.range || 60 }, sp.kind);
  }

  stepAction(input) {
    const a = this.action;
    a.timer--;

    if (a.phase === 'startup') {
      if (a.kind === 'uppercut') {
        this.vy = a.data.vy;
        this.vx = a.data.vx * this.facing;
        this.grounded = false;
      }
      if (a.kind === 'sweep') {
        this.vx = a.data.vx * this.facing;
      }
      if (a.timer <= 0) {
        a.phase = 'active';
        a.timer = a.data.active || 6;
        if (a.kind === 'projectile') {
          this.pendingProjectile = {
            x: this.x + this.facing * 40,
            y: this.y - this.height / 2,
            vx: a.data.projectileSpeed * this.facing,
            life: a.data.projectileLife,
            dmg: a.data.dmg,
            color: this.char.color,
          };
        }
      }
      return;
    }

    if (a.phase === 'active') {
      if (a.timer <= 0) {
        a.phase = 'recovery';
        a.timer = a.data.recovery || 10;
      }
      return;
    }

    if (a.phase === 'recovery') {
      if (a.timer <= 0) {
        this.action = null;
        this.state = this.grounded ? 'idle' : 'jump';
      }
    }
  }
}

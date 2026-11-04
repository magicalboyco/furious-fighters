import { Fighter, STAGE_LEFT, STAGE_RIGHT } from './fighter.js';
import { resolveCombat } from './combat.js';
import { ROSTER } from './characters.js';
import { CONTROLS, justPressedKey } from './input.js';
import { drawStage, drawFighter, drawProjectile, drawHUD, drawBanner } from './render.js';

const ROUND_TIME = 99;
const WINS_NEEDED = 2;

export class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.phase = 'title';
    this.select = { p1: 0, p2: 1, p1Locked: false, p2Locked: false };
    this.f1 = null; this.f2 = null;
    this.projectiles = [];
    this.timer = ROUND_TIME;
    this.frameCount = 0;
    this.bannerUntil = 0;
    this.bannerText = '';
    this.bannerSub = '';
  }

  update() {
    this.frameCount++;
    if (this.phase === 'title') this.updateTitle();
    else if (this.phase === 'select') this.updateSelect();
    else if (this.phase === 'fight') this.updateFight();
    else if (this.phase === 'roundEnd') this.updateRoundEnd();
    else if (this.phase === 'matchEnd') this.updateMatchEnd();
  }

  updateTitle() {
    if (justPressedKey(CONTROLS.p1.lp) || justPressedKey(CONTROLS.p2.lp) || justPressedKey('Enter')) {
      this.phase = 'select';
    }
  }

  updateSelect() {
    const s = this.select;
    if (!s.p1Locked) {
      if (justPressedKey(CONTROLS.p1.right)) s.p1 = (s.p1 + 1) % ROSTER.length;
      if (justPressedKey(CONTROLS.p1.left)) s.p1 = (s.p1 - 1 + ROSTER.length) % ROSTER.length;
      if (justPressedKey(CONTROLS.p1.lp)) s.p1Locked = true;
    }
    if (!s.p2Locked) {
      if (justPressedKey(CONTROLS.p2.right)) s.p2 = (s.p2 + 1) % ROSTER.length;
      if (justPressedKey(CONTROLS.p2.left)) s.p2 = (s.p2 - 1 + ROSTER.length) % ROSTER.length;
      if (justPressedKey(CONTROLS.p2.lp)) s.p2Locked = true;
    }
    if (s.p1Locked && s.p2Locked) this.startMatch();
  }

  startMatch() {
    this.p1Char = ROSTER[this.select.p1];
    this.p2Char = ROSTER[this.select.p2];
    this.p1Wins = 0; this.p2Wins = 0;
    this.startRound();
    this.phase = 'fight';
  }

  startRound() {
    this.f1 = new Fighter(this.p1Char, CONTROLS.p1, STAGE_LEFT + 180, 1, 'P1');
    this.f2 = new Fighter(this.p2Char, CONTROLS.p2, STAGE_RIGHT - 180, -1, 'P2');
    this.f1.roundWins = this.p1Wins; this.f2.roundWins = this.p2Wins;
    this.projectiles = [];
    this.timer = ROUND_TIME;
    this.showBanner('ROUND START', '', 60);
  }

  showBanner(text, sub, frames) {
    this.bannerText = text;
    this.bannerSub = sub;
    this.bannerUntil = this.frameCount + frames;
  }

  updateFight() {
    this.f1.update(this.f2);
    this.f2.update(this.f1);
    resolveCombat(this.f1, this.f2, this.projectiles);

    if (this.frameCount % 60 === 0) this.timer--;

    const p1Dead = this.f1.health <= 0;
    const p2Dead = this.f2.health <= 0;
    const timeUp = this.timer <= 0;

    if (p1Dead || p2Dead || timeUp) {
      let winner = null;
      if (p1Dead && p2Dead) winner = null;
      else if (p1Dead) winner = this.f2;
      else if (p2Dead) winner = this.f1;
      else {
        const p1Pct = this.f1.health / this.f1.maxHealth;
        const p2Pct = this.f2.health / this.f2.maxHealth;
        winner = p1Pct === p2Pct ? null : (p1Pct > p2Pct ? this.f1 : this.f2);
      }

      if (winner === this.f1) this.p1Wins++;
      else if (winner === this.f2) this.p2Wins++;

      this.roundWinner = winner;
      this.showBanner(winner ? `${winner.char.name} WINS` : 'DOUBLE KO', '', 120);
      this.phase = 'roundEnd';
      this.roundEndAt = this.frameCount + 120;
    }
  }

  updateRoundEnd() {
    // Fighters freeze once the round decides — no further input processing,
    // so a last-instant attack can't start (and whiff unresolved) during the banner.
    if (this.frameCount >= this.roundEndAt) {
      if (this.p1Wins >= WINS_NEEDED || this.p2Wins >= WINS_NEEDED) {
        this.matchWinner = this.p1Wins >= WINS_NEEDED ? this.f1 : this.f2;
        this.showBanner(`${this.matchWinner.char.name} WINS THE MATCH`, 'Press any attack to continue', 99999);
        this.phase = 'matchEnd';
      } else {
        this.startRound();
        this.phase = 'fight';
      }
    }
  }

  updateMatchEnd() {
    const anyButton = ['lp', 'mp', 'hp', 'lk', 'mk', 'hk'].some(
      (b) => justPressedKey(CONTROLS.p1[b]) || justPressedKey(CONTROLS.p2[b])
    );
    if (anyButton) {
      this.select = { p1: 0, p2: 1, p1Locked: false, p2Locked: false };
      this.phase = 'select';
    }
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, 960, 540);

    if (this.phase === 'title') {
      drawStage(ctx);
      drawBanner(ctx, 'FEMALE FURY', 'Press any Punch to start');
      return;
    }

    if (this.phase === 'select') {
      this.renderSelect(ctx);
      return;
    }

    drawStage(ctx);
    for (const p of this.projectiles) drawProjectile(ctx, p);
    drawFighter(ctx, this.f1);
    drawFighter(ctx, this.f2);
    drawHUD(ctx, this.f1, this.f2, this.timer, null);

    if (this.frameCount < this.bannerUntil) {
      drawBanner(ctx, this.bannerText, this.bannerSub);
    }
  }

  renderSelect(ctx) {
    drawStage(ctx);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 28px monospace';
    ctx.fillText('CHOOSE YOUR FIGHTER', 480, 60);

    const cols = 4;
    const slotW = 190, startX = 480 - (cols * slotW) / 2;
    ROSTER.forEach((c, i) => {
      const x = startX + (i % cols) * slotW + slotW / 2;
      const y = 165 + Math.floor(i / cols) * 175;
      ctx.fillStyle = c.color;
      ctx.fillRect(x - 50, y - 50, 100, 100);
      ctx.fillStyle = '#fff';
      ctx.font = '12px monospace';
      ctx.fillText(c.name, x, y + 70);

      if (this.select.p1 === i) {
        ctx.strokeStyle = '#ff5050';
        ctx.lineWidth = 4;
        ctx.strokeRect(x - 58, y - 58, 116, 116);
        ctx.fillStyle = '#ff5050';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('P1' + (this.select.p1Locked ? ' ✓' : ''), x, y - 68);
      }
      if (this.select.p2 === i) {
        ctx.strokeStyle = '#4da6ff';
        ctx.lineWidth = 4;
        ctx.strokeRect(x - 64, y - 64, 128, 128);
        ctx.fillStyle = '#4da6ff';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('P2' + (this.select.p2Locked ? ' ✓' : ''), x, y + 105);
      }
    });
  }
}

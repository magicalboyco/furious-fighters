import { GROUND_Y, STAGE_LEFT, STAGE_RIGHT } from './fighter.js';
import { animForFighter } from './sprite.js';

const W = 960, H = 540;

export function drawStage(ctx) {
  const sky = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  sky.addColorStop(0, '#1a1340');
  sky.addColorStop(1, '#3a2a6a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, GROUND_Y);

  // distant skyline silhouette
  ctx.fillStyle = '#241a4f';
  for (let i = 0; i < 12; i++) {
    const bw = 40 + (i % 3) * 20;
    const bh = 60 + (i % 5) * 30;
    ctx.fillRect(i * 85, GROUND_Y - bh, bw, bh);
  }

  ctx.fillStyle = '#12102a';
  ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);

  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.lineTo(W, GROUND_Y);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255,0,180,0.25)';
  ctx.beginPath();
  ctx.moveTo(STAGE_LEFT, GROUND_Y);
  ctx.lineTo(STAGE_LEFT - 30, H);
  ctx.moveTo(STAGE_RIGHT, GROUND_Y);
  ctx.lineTo(STAGE_RIGHT + 30, H);
  ctx.stroke();
}

export function drawFighter(ctx, f) {
  const h = f.height;
  const top = f.y - h;
  const bodyW = f.width;

  if (f.char.sprite) {
    const drawn = f.char.sprite.draw(ctx, animForFighter(f), f.animTimer, f.x, f.y, h, f.facing);
    if (drawn) {
      ctx.fillStyle = '#ffffffaa';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(f.char.name, f.x, f.y + 14);
      return;
    }
  }

  ctx.save();
  if (f.state === 'hitstun') ctx.translate((Math.random() - 0.5) * 4, 0);

  // flash white briefly on hit via invuln-less quick tint; simple: outline only
  ctx.fillStyle = f.char.color;
  ctx.strokeStyle = f.blocking ? '#ffffff' : f.char.accent;
  ctx.lineWidth = 3;

  // legs
  ctx.fillRect(f.x - bodyW / 2 + 6, f.y - h * 0.45, bodyW * 0.3, h * 0.45);
  ctx.fillRect(f.x + bodyW / 2 - bodyW * 0.3 - 6, f.y - h * 0.45, bodyW * 0.3, h * 0.45);

  // torso
  ctx.fillRect(f.x - bodyW / 2, top + h * 0.22, bodyW, h * 0.4);
  ctx.strokeRect(f.x - bodyW / 2, top + h * 0.22, bodyW, h * 0.4);

  // head
  ctx.beginPath();
  ctx.arc(f.x, top + h * 0.12, h * 0.13, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // arm / attack indicator
  const hitbox = f.activeHitbox ? f.activeHitbox() : null;
  if (hitbox) {
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.85;
    ctx.fillRect(hitbox.x, hitbox.y, hitbox.w, hitbox.h);
    ctx.globalAlpha = 1;
  } else {
    const armLen = 14;
    const armX = f.facing === 1 ? f.x + bodyW / 2 : f.x - bodyW / 2 - armLen;
    ctx.fillRect(armX, top + h * 0.28, armLen, 10);
  }

  // facing indicator (nose triangle)
  ctx.fillStyle = f.char.accent;
  ctx.beginPath();
  const noseX = f.x + f.facing * (h * 0.13);
  ctx.moveTo(noseX, top + h * 0.12);
  ctx.arc(f.x, top + h * 0.12, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // name tag
  ctx.fillStyle = '#ffffffaa';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(f.char.name, f.x, f.y + 14);
}

export function drawProjectile(ctx, p) {
  ctx.save();
  ctx.fillStyle = p.color;
  ctx.shadowColor = p.color;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.ellipse(p.x, p.y, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawHealthBar(ctx, x, flip, fighter) {
  const barW = 320, barH = 22;
  const pct = Math.max(0, fighter.health / fighter.maxHealth);
  ctx.save();
  ctx.fillStyle = '#222';
  ctx.fillRect(x, 20, barW, barH);
  ctx.fillStyle = pct > 0.4 ? '#4ddc4d' : pct > 0.18 ? '#ffcc33' : '#ff4040';
  const w = barW * pct;
  ctx.fillRect(flip ? x + barW - w : x, 20, w, barH);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, 20, barW, barH);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 13px monospace';
  ctx.textAlign = flip ? 'right' : 'left';
  ctx.fillText(fighter.char.name, flip ? x + barW : x, 15);

  ctx.textAlign = 'center';
  for (let i = 0; i < 2; i++) {
    const cx = flip ? x + barW - 12 - i * 16 : x + 12 + i * 16;
    ctx.fillStyle = i < fighter.roundWins ? '#ffcc33' : '#444';
    ctx.beginPath();
    ctx.arc(cx, 50, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function drawHUD(ctx, f1, f2, timeLeft, roundLabel) {
  drawHealthBar(ctx, 20, false, f1);
  drawHealthBar(ctx, W - 20 - 320, true, f2);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 28px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(String(Math.ceil(timeLeft)), W / 2, 45);

  if (roundLabel) {
    ctx.font = 'bold 20px monospace';
    ctx.fillStyle = '#ffcc33';
    ctx.fillText(roundLabel, W / 2, 85);
  }
}

export function drawBanner(ctx, text, sub) {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = 'bold 48px monospace';
  ctx.fillText(text, W / 2, H / 2 - 10);
  if (sub) {
    ctx.font = '18px monospace';
    ctx.fillStyle = '#ffcc33';
    ctx.fillText(sub, W / 2, H / 2 + 30);
  }
  ctx.restore();
}

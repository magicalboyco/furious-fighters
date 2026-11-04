// Sprite-sheet support. Two input shapes, matching common real-world exports:
//
// 1) "grid" meta   — a uniform grid of equal-sized frames, grouped into named
//                     animations by listing which row/frame-range belongs to each.
//    { type: 'grid', frameW, frameH, columns,
//      animations: { idle: { row: 0, count: 4, fps: 8 }, walk: { row: 1, count: 6, fps: 10 }, ... } }
//
// 2) "atlas" meta  — named, individually-packed frames (Aseprite / TexturePacker
//                     JSON-array style), the shape tools like SpriteCook produce.
//    { type: 'atlas',
//      animations: { idle: { frames: ['idle_0','idle_1',...], fps: 8 }, ... },
//      frames: { idle_0: { x, y, w, h }, idle_1: { x, y, w, h }, ... } }
//
// A character with no `sprite` config just falls back to the placeholder shape
// renderer in render.js — nothing here is required to run the game.

export class SpriteSheet {
  constructor(image, meta) {
    this.image = image;
    this.meta = meta;
  }

  static async load(src, meta) {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
    return new SpriteSheet(image, meta);
  }

  frameRect(animName, index) {
    const anim = this.meta.animations[animName];
    if (!anim) return null;

    if (this.meta.type === 'grid') {
      const i = index % anim.count;
      return {
        x: (anim.col || 0) * this.meta.frameW + i * this.meta.frameW,
        y: anim.row * this.meta.frameH,
        w: this.meta.frameW,
        h: this.meta.frameH,
      };
    }

    if (this.meta.type === 'atlas') {
      const name = anim.frames[index % anim.frames.length];
      return this.meta.frames[name] || null;
    }

    return null;
  }

  frameCount(animName) {
    const anim = this.meta.animations[animName];
    if (!anim) return 0;
    return this.meta.type === 'grid' ? anim.count : anim.frames.length;
  }

  fps(animName) {
    return this.meta.animations[animName]?.fps || 8;
  }

  draw(ctx, animName, animTimeFrames, x, y, drawH, facing) {
    const count = this.frameCount(animName);
    if (count === 0) return false;
    const fps = this.fps(animName);
    const index = Math.floor((animTimeFrames / 60) * fps) % count;
    const rect = this.frameRect(animName, index);
    if (!rect) return false;

    const scale = drawH / rect.h;
    const drawW = rect.w * scale;

    ctx.save();
    ctx.translate(x, y);
    if (facing === -1) ctx.scale(-1, 1);
    ctx.drawImage(
      this.image, rect.x, rect.y, rect.w, rect.h,
      -drawW / 2, -drawH, drawW, drawH
    );
    ctx.restore();
    return true;
  }
}

// Picks an animation name for a fighter's current state/action — characters
// without matching entries in their sprite's `animations` map just show
// whichever generic one exists (e.g. 'idle'), so partial sprite sets degrade
// gracefully instead of crashing.
export function animForFighter(f) {
  if (f.action) return f.action.kind === 'normal' ? f.action.name.toLowerCase() : 'special';
  if (f.state === 'hitstun') return 'hit';
  if (f.state === 'blockstun') return 'block';
  if (f.state === 'knockdown') return 'down';
  if (f.state === 'jump') return 'jump';
  if (f.state === 'crouch') return 'crouch';
  if (f.state === 'walk') return 'walk';
  return 'idle';
}
